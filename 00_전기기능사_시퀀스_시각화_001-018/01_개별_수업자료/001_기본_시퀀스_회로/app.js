(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const model=new CircuitModel(), diagram=new CircuitDiagram($('circuit'));
  let lesson='auto', step=0, free=false, playing=false, playbackElapsed=0, selected='', view='all';
  let lessons, lastTime=performance.now(), renderBudget=0, sound=false, audioContext=null, oscillator=null;
  const hints={
    X:'X 코일 ↔ 위쪽 a접점과 T 앞의 b접점. 여자되면 a는 닫히고 b는 열립니다.',
    T:'T 코일 ↔ PB1 옆의 순시 a접점과 MC2 앞의 한시 a접점. 두 접점의 동작 시점을 비교하세요.',
    MC1:'MC1 코일 ↔ M1 주접점 3개와 RL 앞의 보조 a접점.',
    MC2:'MC2 코일 ↔ M2 주접점 3개와 GL 앞의 보조 a접점.',
    EOCR:'EOCR ↔ 운전 전원을 끊는 b접점과 경보 전원을 연결하는 a접점.',
    FR:'FR 코일 ↔ YL과 BZ 앞의 교대 접점. 수업 예시는 BZ부터 시작합니다.',
    FLS:'FLS 전원 ↔ X 앞의 감지 접점. 전극 입력은 감지 / 해제로 조작합니다.'
  };
  function createLessons(){
    const delay=model.delay,interval=model.interval;
    const fresh=()=>{const m=new CircuitModel();m.set('delay',delay);m.set('interval',interval);return m;};
    const make=(m,title,description,focus,heading=title)=>({snapshot:m.snapshot(),title,description,focus,heading});
    const a=fresh(), auto=[];
    auto.push(make(a,'MCCB를 투입하기 전입니다.','모든 기기가 정지해 있습니다. 전원을 넣으면 어느 기기에 먼저 전원이 공급될까요?','','전원 투입 전'));
    a.set('power',true);auto.push(make(a,'전원을 넣으면 EOCR에 먼저 전원이 공급됩니다.','운전용 접점은 닫혀 있지만, 기동 경로가 완성되지 않아 모터는 정지해 있습니다.','EOCR','전원 ON · 기동 대기'));
    a.set('mode','A');auto.push(make(a,'SS를 A로 선택하면 FLS에 전원이 공급됩니다.','아직 수위 감지 입력이 해제되어 있으므로 FLS 접점은 열려 있고 X는 소자 상태입니다.','FLS','자동 선택 · FLS 감지 대기'));
    a.set('sensor',true);auto.push(make(a,'FLS가 감지하면 X가 여자됩니다.','FLS 접점이 닫혀 X 코일에 전원이 공급됩니다. 같은 X 이름의 두 접점도 함께 바뀝니다.','FLS','수위 감지 · X 여자'));
    auto.push(make(a,'X의 a접점이 닫혀 M1이 운전합니다.','X a접점 → MC1 코일 → MC1 주접점과 보조접점. M1이 회전하고 RL이 켜집니다.','MC1','자동 운전 · M1 ON'));
    auto.push(make(a,'M2가 돌지 않는 이유는 X의 b접점입니다.','X가 여자되면 T 앞의 b접점이 열립니다. T가 동작하지 않아 MC2의 한시 기동 경로도 열려 있습니다.','X','자동 운전 · T 경로 차단'));
    a.set('sensor',false);auto.push(make(a,'수위 감지가 해제되면 M1이 정지합니다.','FLS 접점 열림 → X 소자 → X a접점 열림 → MC1 소자. FLS 전원은 계속 공급됩니다.','FLS','감지 해제 · 자동 대기'));
    const m=fresh(), manual=[];m.set('power',true);
    manual.push(make(m,'SS를 M에 놓고 기동을 기다립니다.','PB0는 놓으면 닫히는 b접점, PB1은 누르면 닫히는 a접점입니다.','T','수동 선택 · 기동 대기'));
    m.set('start',true);manual.push(make(m,'PB1을 누르면 MC1과 T가 여자됩니다.','M1과 RL이 켜지고, T의 순시 접점이 즉시 닫힙니다. MC2 앞의 한시 접점은 아직 열려 있습니다.','T','PB1 누름 · M1 기동'));
    m.set('start',false);manual.push(make(m,'PB1을 놓아도 T의 순시 접점이 운전을 유지합니다.','전원은 PB0 → T 순시 a접점 → MC1·T 경로로 공급됩니다. 이것이 자기유지입니다.','T','PB1 놓음 · 자기유지'));
    m.tick(delay/2);manual.push(make(m,'타이머가 설정시간을 세고 있습니다.',`수업 예시: ${delay}초 중 ${delay/2}초 경과. 순시 접점은 닫혔지만 MC2 앞의 한시 접점은 아직 열려 있습니다.`,'T','설정시간 도달 전 · M2 대기'));
    m.tick(delay/2);manual.push(make(m,'설정시간이 지나면 M2가 추가로 운전합니다.',`T의 한시 a접점이 ${delay}초 후 닫힙니다. MC2가 여자되어 M2와 GL이 켜지고 M1도 계속 운전합니다.`,'MC2','설정시간 도달 · M1 + M2 운전'));
    m.set('stop',true);manual.push(make(m,'PB0를 누르면 수동 운전 경로가 끊깁니다.','T·MC1·MC2가 소자되어 두 모터가 정지하고, T의 자기유지 접점과 한시 접점도 열립니다.','T','PB0 누름 · 전체 운전 정지'));
    m.set('stop',false);manual.push(make(m,'PB0를 놓아도 자동으로 다시 기동하지 않습니다.','PB0는 닫혔지만 PB1과 T 순시 접점이 모두 열려 있습니다. 다시 PB1을 눌러야 수동 운전이 시작됩니다.','T','PB0 놓음 · 재기동 대기'));
    const e=fresh(),alarm=[];e.set('power',true);e.set('start',true);e.set('start',false);e.tick(delay);
    alarm.push(make(e,'두 모터가 수동 운전 중입니다.','여기서 과부하가 발생했을 때, 운전 회로와 경보 회로가 각각 어떻게 바뀌는지 관찰합니다.','EOCR','정상 운전 · 과부하 전'));
    e.set('trip',true);alarm.push(make(e,'EOCR이 동작하면 모터가 정지하고 부저가 켜집니다.','운전용 b접점은 열리고 경보용 a접점은 닫힙니다. EOCR 자체와 FR에는 전원이 공급됩니다.','EOCR','과부하 발생 · BZ 동작'));
    e.tick(interval);alarm.push(make(e,'FR 접점이 전환되어 YL이 켜집니다.','부저 BZ는 멈추고 황색 램프 YL이 켜집니다. 두 경보는 동시에 켜지지 않고 번갈아 동작합니다.','FR','경보 교대 · YL 점등'));
    e.tick(interval);alarm.push(make(e,'다음 간격에는 BZ가 다시 동작합니다.',`수업 예시 간격은 ${interval}초입니다. 자유 조작에서는 이 교대 동작을 계속 관찰할 수 있습니다.`,'FR','경보 교대 · BZ 동작'));
    e.set('trip',false);alarm.push(make(e,'M 위치에서 RESET하면 경보가 해제됩니다.','운전 전원은 복구되지만 자기유지는 해제되어 있습니다. PB1을 놓은 상태이므로 두 모터는 기동 대기합니다.','EOCR','수동에서 RESET · 기동 대기'));
    e.set('mode','A');e.set('sensor',true);e.set('trip',true);alarm.push(make(e,'이번에는 A 위치와 감지 입력을 유지한 채 리셋해 봅니다.','현재는 과부하 접점이 열려 M1이 정지해 있습니다. RESET 이후에도 정지가 유지될지 예측해 보세요.','FLS','자동 감지 조건 유지 · 과부하 상태'));
    e.set('trip',false);alarm.push(make(e,'자동 기동 조건이 남아 있으면 M1이 다시 운전합니다.','RESET으로 운전 전원이 복구되면 FLS → X → MC1 경로가 다시 성립합니다. 리셋 후 상태는 현재 조건에 따라 달라집니다.','FLS','자동에서 RESET · M1 재운전'));
    return {auto,manual,alarm};
  }
  function selectDevice(device){selected=selected===device?'':device;diagram.select(selected);renderSelection();}
  function renderSelection(){document.querySelectorAll('[data-device]').forEach(el=>{if(el.tagName==='BUTTON'){el.classList.toggle('selected',el.dataset.device===selected);el.setAttribute('aria-pressed',el.dataset.device===selected);}});$('device-hint').textContent=hints[selected]||'기기를 선택하면 코일과 관련 접점을 함께 표시합니다.';}
  function drawDots(){
    $('step-dots').replaceChildren();
    lessons[lesson].forEach((item,i)=>{const b=document.createElement('button');b.textContent=String(i+1).padStart(2,'0');b.setAttribute('aria-label',`${i+1}단계: ${item.heading}`);b.addEventListener('click',()=>go(i));$('step-dots').appendChild(b);});
  }
  function go(index,keepPlaying=false){
    step=Math.max(0,Math.min(lessons[lesson].length-1,index));
    const entry=lessons[lesson][step];model.restore(entry.snapshot);selected=entry.focus;diagram.select(selected);
    if(!keepPlaying)playing=false;playbackElapsed=0;render();
  }
  function selectLesson(id){lesson=id;free=false;playing=false;lessons=createLessons();drawDots();go(0);}
  function toggleFree(force){
    free=force===undefined?!free:force;playing=free;playbackElapsed=0;
    model.set('start',false);model.set('stop',false);
    if(!free){lessons=createLessons();drawDots();go(step);}else render();
  }
  function currentExplanation(s){
    if(!s.power)return ['전원 투입 전','MCCB가 OFF입니다.','MCCB를 켜고 SS의 A 또는 M 위치를 선택해 보세요.'];
    if(s.trip)return ['과부하 · 운전 차단',s.bz?'EOCR 동작 · BZ가 울립니다.':'EOCR 동작 · YL이 켜집니다.',`운전용 b접점은 열리고 경보용 a접점은 닫혔습니다. FR이 ${s.interval}초 간격으로 경보를 바꿉니다.`];
    if(s.mode==='A'&&s.sensor)return ['자동 운전 · M1 ON','FLS → X → MC1 경로로 M1이 운전합니다.',s.stop?'PB0는 수동 분기에 있어 자동 운전 경로를 끊지 않습니다. FLS 감지를 해제하면 M1이 정지합니다.':'X의 a접점은 닫히고 T 앞의 b접점은 열립니다. 자동 운전에서는 T와 M2가 동작하지 않습니다.'];
    if(s.mode==='A')return ['자동 선택 · 감지 대기','FLS에 전원이 공급되고 감지를 기다립니다.','수위 감지 입력을 켜면 FLS 접점이 닫히고 X와 MC1이 여자됩니다.'];
    if(s.stop)return ['수동 정지 · PB0 누름','PB0가 열려 수동 운전 경로가 끊겼습니다.','T의 자기유지가 해제되고 두 모터가 정지합니다. PB0를 놓아도 PB1이 열려 있으면 정지 상태가 유지됩니다.'];
    if(s.done)return ['수동 운전 · M1 + M2 ON','T의 한시 접점이 닫혀 두 모터가 운전합니다.',`설정시간 ${s.delay}초가 지났습니다. PB0를 누르면 자기유지와 계시가 함께 해제됩니다.`];
    if(s.timerOn)return ['수동 운전 · T 계시 중',s.start?'PB1을 누르면 MC1과 T가 여자됩니다.':'PB1을 놓아도 T의 순시 접점이 자기유지합니다.',`M1이 먼저 운전하고 ${s.delay}초가 되면 T의 한시 접점이 MC2를 기동합니다.`];
    return ['수동 선택 · 기동 대기','PB1을 누르면 M1부터 기동합니다.',s.sensor?'감지 입력은 켜져 있지만 M 위치에서는 FLS에 전원이 공급되지 않습니다. PB1으로 기동하세요.':'PB1을 잠깐 누른 뒤 놓아 보세요. T의 순시 접점이 운전을 유지하는지 확인할 수 있습니다.'];
  }
  function setPressed(id,on){$(id).setAttribute('aria-pressed',!!on);$(id).classList.toggle('on',!!on);}
  function render(){
    const s=model.state();diagram.update(s);renderSelection();
    document.body.classList.toggle('paused',!playing);
    document.querySelectorAll('[data-lesson]').forEach(b=>{const on=b.dataset.lesson===lesson&&!free;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',on);});
    $('free-button').classList.toggle('selected',free);$('free-button').setAttribute('aria-pressed',free);$('free-button').textContent=free?'단계별 설명으로 돌아가기':'자유 조작으로 전환';
    $('mode-badge').textContent=free?'자유 조작':'단계별 설명';$('control-help').textContent=free?'버튼을 직접 조작해 회로 변화를 확인하세요.':'아래 ‘다음 단계’로 진행하세요.';
    for(const id of ['power-button','auto-button','manual-button','start-button','stop-button','sensor-button','trip-button','reset-trip-button'])$(id).disabled=!free;
    if(free){$('trip-button').disabled=!s.power||s.trip;$('reset-trip-button').disabled=!s.trip;}
    $('power-button').textContent=s.power?'ON':'OFF';setPressed('power-button',s.power);
    $('sensor-button').textContent=s.sensor?'감지':'해제';setPressed('sensor-button',s.sensor);
    for(const [id,on]of[['auto-button',s.mode==='A'],['manual-button',s.mode==='M']]){$(id).classList.toggle('selected',on);$(id).setAttribute('aria-pressed',on);}
    $('start-button').classList.toggle('held',s.start);$('stop-button').classList.toggle('held',s.stop);
    $('start-button').setAttribute('aria-pressed',s.start);$('stop-button').setAttribute('aria-pressed',s.stop);
    $('power-status').textContent=!s.power?'전원 OFF':s.trip?'EOCR 트립':'전원 ON';
    for(const [n,on]of[[1,s.mc1],[2,s.mc2]]){$('motor'+n).classList.toggle('running',on);$('m'+n+'-state').textContent=on?'운전':'정지';}
    for(const [id,on,label]of[['rl-led',s.mc1,'RL'],['gl-led',s.mc2,'GL'],['yl-led',s.yl,'YL']]){$(id).classList.toggle('on',on);$(id).setAttribute('aria-label',label+(on?' 점등':' 소등'));}
    $('bz-led').classList.toggle('on',s.bz);$('bz-led').querySelector('span').textContent=s.bz?'동작':'정지';$('bz-led').setAttribute('aria-label',s.bz?'BZ 동작':'BZ 정지');
    $('timer-value').textContent=`${s.elapsed.toFixed(1)} / ${s.delay.toFixed(1)}초`;$('timer-fill').style.width=Math.min(100,s.elapsed/s.delay*100)+'%';
    $('timer-progress').setAttribute('aria-valuenow',s.elapsed.toFixed(1));$('timer-progress').setAttribute('aria-valuemax',s.delay);
    $('timer-state').textContent=(s.done?'설정시간 도달':s.timerOn?'계시 중':'대기')+' · 수업 예시 설정';
    if(document.activeElement!==$('delay-input'))$('delay-input').value=s.delay;
    $('interval-input').value=s.interval;
    let heading,title,description;
    if(free){[heading,title,description]=currentExplanation(s);$('step-count').textContent='직접 조작';}
    else{const entry=lessons[lesson][step];({heading,title,description}=entry);$('step-count').textContent=`${String(step+1).padStart(2,'0')} / ${String(lessons[lesson].length).padStart(2,'0')}`;}
    $('scene-heading').textContent=heading;$('step-title').textContent=title;
    if($('step-description').textContent!==description)$('step-description').textContent=description;
    $('previous-button').disabled=free||step===0;$('next-button').disabled=free||step===lessons[lesson].length-1;
    $('play-button').textContent=free?(playing?'시간 일시정지':'시간 재개'):(playing?'일시정지':'자동 재생');
    $('step-dots').hidden=free;
    [...$('step-dots').children].forEach((b,i)=>{b.classList.toggle('selected',i===step);b.setAttribute('aria-current',i===step?'step':'false');});
    $('lesson-note').textContent=free?'실제 초 단위 계시 · 시간을 멈추면 T와 FR도 멈춥니다.':'단계별 설명은 예시 시점으로 이동합니다. 실제 초 단위 계시는 자유 조작에서 확인하세요.';
    syncSound();
  }
  function input(key,value){if(!free)return;model.set(key,value);render();}
  function stopSound(){if(oscillator){try{oscillator.stop();}catch{}oscillator.disconnect();oscillator=null;}}
  function syncSound(){
    if(!sound||!playing||!model.bz||!audioContext){stopSound();return;}
    if(!oscillator){oscillator=audioContext.createOscillator();const gain=audioContext.createGain();oscillator.type='sine';oscillator.frequency.value=560;gain.gain.value=.045;oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.onended=()=>gain.disconnect();oscillator.start();}
  }
  function momentary(id,key){
    const button=$(id);let pointer=null,keyboard=false;
    const release=()=>{pointer=null;keyboard=false;if(free&&model[key]){model.set(key,false);render();}};
    button.addEventListener('pointerdown',event=>{if(!free||event.button!==0)return;pointer=event.pointerId;button.setPointerCapture(pointer);input(key,true);});
    button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
    button.addEventListener('keydown',event=>{if(event.code==='Space'||event.code==='Enter'){event.preventDefault();if(!event.repeat&&free){keyboard=true;input(key,true);}}});
    button.addEventListener('keyup',event=>{if((event.code==='Space'||event.code==='Enter')&&keyboard){event.preventDefault();release();}});
    button.addEventListener('blur',()=>{if(keyboard)release();});window.addEventListener('blur',release);
    button.addEventListener('contextmenu',event=>event.preventDefault());
    button.addEventListener('click',event=>{if(event.detail===0&&!keyboard&&free&&!model[key]){input(key,true);input(key,false);}});
  }
  document.querySelectorAll('[data-lesson]').forEach(b=>b.addEventListener('click',()=>selectLesson(b.dataset.lesson)));
  document.querySelectorAll('[data-device]').forEach(b=>{if(b.tagName==='BUTTON')b.addEventListener('click',()=>selectDevice(b.dataset.device));});
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;diagram.view(view);document.querySelectorAll('[data-view]').forEach(v=>{v.classList.toggle('selected',v===b);v.setAttribute('aria-pressed',v===b);});}));
  $('free-button').addEventListener('click',()=>toggleFree());
  $('power-button').addEventListener('click',()=>input('power',!model.power));
  $('auto-button').addEventListener('click',()=>input('mode','A'));$('manual-button').addEventListener('click',()=>input('mode','M'));
  $('sensor-button').addEventListener('click',()=>input('sensor',!model.sensor));
  $('trip-button').addEventListener('click',()=>input('trip',true));$('reset-trip-button').addEventListener('click',()=>input('trip',false));
  momentary('start-button','start');momentary('stop-button','stop');
  $('delay-input').addEventListener('change',event=>{model.set('delay',event.target.value);event.target.value=model.delay;if(!free){lessons=createLessons();go(step);}else render();});
  $('interval-input').addEventListener('change',event=>{model.set('interval',event.target.value);if(!free){lessons=createLessons();go(step);}else render();});
  $('previous-button').addEventListener('click',()=>go(step-1));$('next-button').addEventListener('click',()=>go(step+1));
  $('play-button').addEventListener('click',()=>{if(!free&&!playing&&step===lessons[lesson].length-1)go(0);playing=!playing;playbackElapsed=0;lastTime=performance.now();render();});
  $('restart-button').addEventListener('click',()=>{if(free){const delay=model.delay,interval=model.interval;model.reset();model.set('delay',delay);model.set('interval',interval);playing=true;selected='';render();}else go(0);});
  $('sound-button').addEventListener('click',async()=>{sound=!sound;if(sound){try{audioContext=audioContext||new(window.AudioContext||window.webkitAudioContext)();await audioContext.resume();}catch{sound=false;}}$('sound-button').textContent=sound?'소리 ON':'소리 OFF';$('sound-button').setAttribute('aria-pressed',sound);syncSound();});
  $('reference-button').addEventListener('click',()=>{playing=false;render();$('reference-dialog').showModal();});$('close-reference').addEventListener('click',()=>$('reference-dialog').close());
  $('fullscreen-button').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('fullscreen-button').textContent='F11로 전체 화면';}});
  document.addEventListener('fullscreenchange',()=>{$('fullscreen-button').textContent=document.fullscreenElement?'전체 화면 종료':'전체 화면';});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){playing=false;if(free){model.set('start',false);model.set('stop',false);}render();}lastTime=performance.now();});
  function frame(now){
    const dt=Math.min(.2,Math.max(0,(now-lastTime)/1000));lastTime=now;renderBudget+=dt;
    if(playing){
      if(free){const wasDone=model.done,wasBZ=model.bz;model.tick(dt);if(renderBudget>.08||wasDone!==model.done||wasBZ!==model.bz){render();renderBudget=0;}}
      else{playbackElapsed+=dt;if(playbackElapsed>=4){if(step<lessons[lesson].length-1)go(step+1,true);else{playing=false;render();}}}
    }
    requestAnimationFrame(frame);
  }
  lessons=createLessons();drawDots();go(0);requestAnimationFrame(frame);
  window.simulator={model,diagram,selectLesson,goStep:go,toggleFree,getState:()=>model.state(),getUI:()=>({lesson,step,free,playing,view}),render};
})();
