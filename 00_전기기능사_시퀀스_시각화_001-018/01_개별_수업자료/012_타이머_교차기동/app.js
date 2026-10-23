(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const model=new CircuitModel(), diagram=new CircuitDiagram($('circuit'));
  let lesson='branch1', step=0, free=false, playing=false, playbackElapsed=0, selected='', view='all';
  let lessons, lastTime=performance.now(), renderBudget=0;
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
    model.set('start1',false);model.set('start2',false);model.set('stop',false);
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
    for(const id of ['power-button','start1-button','start2-button','stop-button','ls1-button','ls2-button','trip-button','reset-trip-button'])$(id).disabled=!free;
    if(free){$('trip-button').disabled=!s.power||s.trip;$('reset-trip-button').disabled=!s.trip;}
    $('power-button').textContent=s.power?'ON':'OFF';setPressed('power-button',s.power);
    for(const i of [1,2]){$('ls'+i+'-button').textContent=s['ls'+i]?'감지':'해제';setPressed('ls'+i+'-button',s['ls'+i]);}
    for(const [id,key]of [['start1-button','start1'],['start2-button','start2'],['stop-button','stop']]){$(id).classList.toggle('held',s[key]);$(id).setAttribute('aria-pressed',s[key]);}
    $('power-status').textContent=!s.power?'전원 OFF':s.trip?'EOCR 트립':'전원 ON';
    for(const [n,on]of[[1,s.mc1],[2,s.mc2]]){$('motor'+n).classList.toggle('running',on);$('m'+n+'-state').textContent=on?'운전':'정지';}
    for(const [id,on,label]of[['rl-led',s.mc1,'RL'],['gl-led',s.mc2,'GL'],['yl-led',s.yl,'YL'],['wl-led',s.wl,'WL']]){$(id).classList.toggle('on',on);$(id).setAttribute('aria-label',label+(on?' 점등':' 소등'));}
    $('wl-state').textContent=window.circuitWLText(s);
    $('yl-state').textContent=s.yl?'과부하 경보':'과부하 없음';
    for(const i of [1,2]){
      const elapsed=s['elapsed'+i],delay=s['delay'+i];
      $('timer'+i+'-value').textContent=`${elapsed.toFixed(1)} / ${delay.toFixed(1)}초`;
      $('timer'+i+'-fill').style.width=Math.min(100,elapsed/delay*100)+'%';
      $('timer'+i+'-progress').setAttribute('aria-valuenow',elapsed.toFixed(1));$('timer'+i+'-progress').setAttribute('aria-valuemax',delay);
      $('timer'+i+'-state').textContent=window.circuitTimerText(s,i);
      if(document.activeElement!==$('delay'+i+'-input'))$('delay'+i+'-input').value=delay;
    }
    let heading,title,description;
    if(free){[heading,title,description]=currentExplanation(s);$('step-count').textContent='직접 조작';}
    else{const entry=lessons[lesson][step];({heading,title,description}=entry);$('step-count').textContent=`${String(step+1).padStart(2,'0')} / ${String(lessons[lesson].length).padStart(2,'0')}`;}
    $('scene-heading').textContent=heading;$('step-title').textContent=title;
    if($('step-description').textContent!==description)$('step-description').textContent=description;
    $('previous-button').disabled=free||step===0;$('next-button').disabled=free||step===lessons[lesson].length-1;
    $('play-button').textContent=free?(playing?'시간 일시정지':'시간 재개'):(playing?'일시정지':'자동 재생');
    $('step-dots').hidden=free;
    [...$('step-dots').children].forEach((b,i)=>{b.classList.toggle('selected',i===step);b.setAttribute('aria-current',i===step?'step':'false');});
    $('lesson-note').textContent=free?'실제 초 단위 계시 · 시간을 멈추면 T1과 T2도 멈춥니다.':'단계별 설명은 예시 시점으로 이동합니다. 실제 초 단위 계시는 자유 조작에서 확인하세요.';
  }
  function input(key,value){if(!free)return;model.set(key,value);render();}
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
  for(const i of [1,2])$('ls'+i+'-button').addEventListener('click',()=>input('ls'+i,!model['ls'+i]));
  $('trip-button').addEventListener('click',()=>input('trip',true));$('reset-trip-button').addEventListener('click',()=>input('trip',false));
  momentary('start1-button','start1');momentary('start2-button','start2');momentary('stop-button','stop');
  for(const i of [1,2])$('delay'+i+'-input').addEventListener('change',event=>{model.set('delay'+i,event.target.value);event.target.value=model['delay'+i];if(!free){lessons=createLessons();go(step);}else render();});
  $('previous-button').addEventListener('click',()=>go(step-1));$('next-button').addEventListener('click',()=>go(step+1));
  $('play-button').addEventListener('click',()=>{if(!free&&!playing&&step===lessons[lesson].length-1)go(0);playing=!playing;playbackElapsed=0;lastTime=performance.now();render();});
  $('restart-button').addEventListener('click',()=>{if(free){const d1=model.delay1,d2=model.delay2;model.reset();model.set('delay1',d1);model.set('delay2',d2);playing=true;selected='';render();}else go(0);});
  $('reference-button').addEventListener('click',()=>{playing=false;render();$('reference-dialog').showModal();});$('close-reference').addEventListener('click',()=>$('reference-dialog').close());
  $('fullscreen-button').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('fullscreen-button').textContent='F11로 전체 화면';}});
  document.addEventListener('fullscreenchange',()=>{$('fullscreen-button').textContent=document.fullscreenElement?'전체 화면 종료':'전체 화면';});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){playing=false;if(free){model.set('start1',false);model.set('start2',false);model.set('stop',false);}render();}lastTime=performance.now();});
  function frame(now){
    const dt=Math.min(.2,Math.max(0,(now-lastTime)/1000));lastTime=now;renderBudget+=dt;
    if(playing){
      if(free){const prior=[model.mc1,model.mc2,model.wl];model.tick(dt);if(renderBudget>.08||prior[0]!==model.mc1||prior[1]!==model.mc2||prior[2]!==model.wl){render();renderBudget=0;}}
      else{playbackElapsed+=dt;if(playbackElapsed>=4){if(step<lessons[lesson].length-1)go(step+1,true);else{playing=false;render();}}}
    }
    requestAnimationFrame(frame);
  }
  lessons=createLessons();drawDots();go(0);requestAnimationFrame(frame);
  window.simulator={model,diagram,selectLesson,goStep:go,toggleFree,getState:()=>model.state(),getUI:()=>({lesson,step,free,playing,view,steps:lessons[lesson].length}),render};
})();
