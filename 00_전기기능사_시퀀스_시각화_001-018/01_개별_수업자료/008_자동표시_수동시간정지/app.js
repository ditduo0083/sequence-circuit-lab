(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const model=new CircuitModel(), diagram=new CircuitDiagram($('circuit'));
  let lesson='auto', step=0, free=false, playing=false, playbackElapsed=0, selected='', view='all';
  let lessons, lastTime=performance.now(), renderBudget=0, sound=false, audioContext=null, oscillator=null;
  const hints=window.circuitHints;
  function createLessons(){return window.createCircuitLessons(model);}
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
  function currentExplanation(s){return window.explainCircuitState(s);}
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
    const readout=window.circuitReadout(s);
    $('timer-state').textContent=readout.timer;
    $('fr-status').textContent=readout.fr;
    $('fr-countdown').textContent=readout.next;
    $('fr-fill').style.width=(s.fr?s.phaseElapsed/s.interval*100:0)+'%';
    $('fr-progress').setAttribute('aria-valuenow',s.phaseElapsed.toFixed(1));
    $('fr-progress').setAttribute('aria-valuemax',s.interval);
    if(document.activeElement!==$('delay-input'))$('delay-input').value=s.delay;
    if(document.activeElement!==$('interval-input'))$('interval-input').value=s.interval;
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
      if(free){const wasDone=model.done,wasMC1=model.mc1,wasBZ=model.bz;model.tick(dt);if(renderBudget>.08||wasDone!==model.done||wasMC1!==model.mc1||wasBZ!==model.bz){render();renderBudget=0;}}
      else{playbackElapsed+=dt;if(playbackElapsed>=4){if(step<lessons[lesson].length-1)go(step+1,true);else{playing=false;render();}}}
    }
    requestAnimationFrame(frame);
  }
  lessons=createLessons();drawDots();go(0);requestAnimationFrame(frame);
  window.simulator={model,diagram,selectLesson,goStep:go,toggleFree,getState:()=>model.state(),getUI:()=>({lesson,step,free,playing,view,steps:lessons[lesson].length}),render};
})();
