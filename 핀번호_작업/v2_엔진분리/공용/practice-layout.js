/* 실습 모드·진행·표시·제출 배치. 회로해석은 기존 검수 시안만 유지. */
(function () {
  'use strict';
  var body=document.body, stage=body.dataset.stage;
  if (!['pin','tb'].includes(stage) && !(stage==='interpret' && ['001','e01'].includes(body.dataset.circuit)))return;
  var $=function(s){return document.querySelector(s);},make=function(t,c){var e=document.createElement(t);e.className=c;return e;};
  var main=$('main'),panel=$('#panel')||$('#tInfo');body.classList.add('practice-fit');
  var row=make('div','ps-row'),progress=make('nav','ps-progress'),actions=make('div','ps-actions');main.before(row);
  progress.setAttribute('aria-label','학습 진행');
  var options=make('details','ps-settings pf-options');options.innerHTML='<summary>⋯ 표시</summary><div class="pf-popover"></div>';var ob=options.lastChild;
  var help=make('details','ps-brief');help.innerHTML='<summary><span class="ps-brief-icon">?</span><span class="ps-brief-text"></span><span class="ps-brief-more">설명 ▾</span></summary><div class="pf-popover"></div>';var helpBody=help.lastChild;main.before(help);
  ['.page-header .lead','body > p.note','#deep'].forEach(function(s){var e=$(s);if(e)helpBody.appendChild(e);});
  var zoomHelp=make('p','');zoomHelp.textContent=stage==='pin'?'칸 확대를 누르면 선택한 칸이 손가락으로 누르기 쉽게 커집니다. 이전 칸·다음 칸으로 이동하거나 번호를 입력하세요. 확대 후 그림을 끌어 이동하고 맞춤으로 전체를 봅니다.':'그림의 + / −로 확대·축소하고 끌어서 이동합니다. 맞춤으로 전체 그림을 봅니다.';helpBody.prepend(zoomHelp);
  var tools=$('.toolbar'),modes;
  if(stage==='pin'){
    modes=make('div','ps-modes');modes.setAttribute('role','group');modes.setAttribute('aria-label','핀번호 학습 방식');
    modes.innerHTML='<button type="button" data-follow="0" aria-pressed="true">적기</button><button type="button" data-follow="1" aria-pressed="false">따라 적기</button>';
    modes.onclick=function(e){var b=e.target.closest('[data-follow]');if(!b)return;$('#optFollow').checked=b.dataset.follow==='1';$('#optFollow').dispatchEvent(new Event('change',{bubbles:true}));};
    progress.innerHTML='<button type="button" data-slot-step="-1">◀ 이전 칸</button><output></output><button type="button" data-slot-step="1">다음 칸 ▶</button>';
    actions.append($('#btnCheck'),$('#btnReset'));
    // 숨겨 둔 핀번호 심화 버튼은 기존 도구줄에 둔다.
    var result=$('#result'),side=make('div','pf-side');main.replaceChild(side,panel);side.append(result,panel);
  }else{
    modes=$('.ip-tabs');modes.classList.add('ps-modes');
    if(stage==='interpret'){
      ['동작 보기','설명 쓰기','접점 고르기'].forEach(function(t,i){modes.children[i].textContent=(i+1)+' '+t;});progress.appendChild($('#progress'));
    }else{
      ['권장 배치','관 순서','공통단자'].forEach(function(t,i){modes.children[i].textContent=t;});
      progress.append($('#tPrev'));var count=make('output','');progress.append(count,$('#tNext'));
      ob.append($('#tSelect'),$('#tDeep'));$('#tExplainBar').classList.add('ps-tools-removed');main.appendChild(panel);main.classList.add('pf-tb-main');
      var tbSide=make('div','pf-side ap-tb-side');panel.before(tbSide);tbSide.append(help,panel);
    }
  }
  row.append(modes,progress,actions);if(stage==='tb')row.append(options);
  if(tools){
    var save=$('#btnSave'),share=$('#btnShare');save.textContent='이미지 저장';share.textContent='공유';
    window.PRACTICE_SHELL.submission(row,[$('#stuName').closest('label'),$('#stuId').closest('label'),save,share]);tools.classList.add('ps-tools-removed');
  } else if(stage==='tb') {
    window.__tbSubmission = window.PRACTICE_SHELL.terminalSubmission(row);
  }
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){help.open=false;options.open=false;}});
  document.addEventListener('pointerdown',function(e){if(!help.contains(e.target))help.open=false;if(!options.contains(e.target))options.open=false;});
  var card=main.querySelector('.circuit-wrap')||main.querySelector('.card'),host=stage==='tb'?$('#tBoard'):make('div','pf-viewport');
  if(stage!=='tb'){card.appendChild(host);host.appendChild($('#circuit'));}host.classList.add('pf-viewport');
  var head=make('div','pf-figure-head'),title=make('strong','');title.textContent=stage==='tb'?'배관도 · 단자대':'회로도';head.appendChild(title);card.insertBefore(head,host);
  var oldZoom=$('.tb-zoombar');if(oldZoom)oldZoom.hidden=true;
  var zoom=figureZoom(host,function(){return host.querySelector('svg');},head);
  function update(){
    var hint=panel.querySelector('.where')||panel.querySelector('.ip-prompt')||panel.querySelector('h2'),brief=hint?hint.textContent.trim():'';
    if(stage==='pin'){
      var p=window.__pin,index=p.SLOTS.findIndex(function(s){return s.key===p.state.sel;});
      progress.querySelector('output').textContent=(index+1)+' / '+p.SLOTS.length;progress.firstChild.disabled=index<=0;progress.lastChild.disabled=index===p.SLOTS.length-1;
      modes.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String(p.state.follow===(b.dataset.follow==='1')));});
      brief=(panel.querySelector('h2')?.textContent||'')+(panel.querySelector('.where')?' · '+panel.querySelector('.where').textContent:'');
    }else if(stage==='tb'){
      var t=window.tbPage,explain=t.state.tab==='explain';$('#tPrev').hidden=!explain;$('#tNext').hidden=!explain;
      // 권장 배치의 단계 이동은 설명과 함께 둔다. 퀴즈 진행은 모드 줄로 되돌린다.
      if(explain && progress.parentNode!==tbSide)tbSide.prepend(progress);
      else if(!explain && progress.parentNode!==row)modes.after(progress);
      progress.querySelector('output').textContent=explain?t.state.step+' / '+($('#tSelect').options.length-1):t.state.tab==='order'?(t.order().round+1)+' / '+Object.keys(t.expected).length:(t.common().q+1)+' / '+t.common().list.length;
    }else if(window.__interpret.state.mode==='pick'){brief=panel.querySelector('.ip-prompt')?.textContent||brief;}
    help.querySelector('.ps-brief-text').textContent=brief;help.querySelector('.ps-brief-text').title=brief;
  }
  new MutationObserver(update).observe(panel,{childList:true});update();
  if(stage==='pin'){
    var pin=window.__pin,button=make('button','pf-input-size');button.type='button';button.textContent='칸 확대';head.insertBefore(button,head.lastChild);
    function selected(){return pin.SLOTS.find(function(s){return s.key===pin.state.sel;});}
    function inputSize(){var s=selected()||pin.SLOTS[0];if(!pin.state.sel){pin.state.sel=s.key;pin.render();}zoom.input(s.x,s.y,20);}
    button.onclick=inputSize;
    progress.onclick=function(e){var b=e.target.closest('[data-slot-step]');if(!b)return;var i=pin.SLOTS.indexOf(selected());i=Math.max(0,Math.min(pin.SLOTS.length-1,i+Number(b.dataset.slotStep)));pin.state.sel=pin.SLOTS[i].key;pin.render();inputSize();};
    var last=null;new MutationObserver(function(){var s=selected();if(s&&s.key!==last){last=s.key;if(zoom.scale()>1)zoom.center(s.x,s.y);}}).observe(host,{childList:true,subtree:true});
  }
  if(stage==='tb'){
    var dynamicHelp=make('div','');helpBody.prepend(dynamicHelp);
    function foldNotes(){var notes=panel.querySelectorAll(':scope > .tb-free,:scope > .wi-rules,:scope > .wi-note,:scope > p.muted');dynamicHelp.replaceChildren();notes.forEach(function(n){dynamicHelp.appendChild(n.cloneNode(true));n.hidden=true;});}
    new MutationObserver(foldNotes).observe(panel,{childList:true});foldNotes();
  }
  // 키보드가 입력 칸을 덮으면 문서 흐름을 풀고 입력 위치를 보여준다.
  var fullHeight=window.visualViewport?visualViewport.height:innerHeight;
  function keyboardLayout(){var h=window.visualViewport?visualViewport.height:innerHeight,active=document.activeElement,typing=active&&active.matches('input[type=text],textarea');if(!typing)fullHeight=Math.max(fullHeight,h);var open=typing&&fullHeight-h>150;body.classList.toggle('pf-keyboard',!!open);if(open)requestAnimationFrame(function(){active.scrollIntoView({block:'center'});});}
  if(window.visualViewport)visualViewport.addEventListener('resize',keyboardLayout);window.addEventListener('resize',keyboardLayout);document.addEventListener('focusin',keyboardLayout);document.addEventListener('focusout',function(){setTimeout(keyboardLayout,0);});
  window.__practiceLayout={zoom:zoom};

  function figureZoom(host, getSvg, head) {
    var bar = make('div', 'pf-zoom'); bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', '그림 확대');
    bar.innerHTML = '<button type="button" data-zoom="out" aria-label="작게">−</button><button type="button" data-zoom="fit">맞춤</button><button type="button" data-zoom="in" aria-label="크게">+</button>'; head.appendChild(bar);
    var svg, base, z = 1, x = 0, y = 0, points = {}, gesture, suppress = 0;
    function sync() { var next = getSvg(); if (svg !== next) { svg = next; if(svg)svg.setAttribute('preserveAspectRatio','xMidYMin meet'); var v = svg && svg.viewBox.baseVal; base = v && { x: v.x, y: v.y, w: v.width, h: v.height }; z = 1; x = base ? base.x : 0; y = base ? base.y : 0; } return svg && base; }
    function apply() { if (!sync()) return; var w = base.w / z, h = base.h / z; x = Math.max(base.x, Math.min(base.x + base.w - w, x)); y = Math.max(base.y, Math.min(base.y + base.h - h, y)); svg.setAttribute('viewBox', [x, y, w, h].join(' ')); bar.firstChild.disabled = z <= 1; bar.lastChild.disabled = z >= 12; host.classList.toggle('pf-zoomed', z > 1); }
    function fit() { if (!sync()) return; z = 1; x = base.x; y = base.y; apply(); }
    function center(cx, cy) { if (!sync()) return; x = cx - base.w / z / 2; y = cy - base.h / z / 2; apply(); }
    function zoom(n, cx, cy) { if (!sync()) return; var p = svg.createSVGPoint(); p.x = cx; p.y = cy; p = p.matrixTransform(svg.getScreenCTM().inverse()); var rx = (p.x - x) / (base.w / z), ry = (p.y - y) / (base.h / z); z = Math.max(1, Math.min(12, n)); x = p.x - rx * base.w / z; y = p.y - ry * base.h / z; apply(); }
    bar.addEventListener('click', function (e) { var b = e.target.closest('[data-zoom]'); if (!b || !sync()) return; if (b.dataset.zoom === 'fit') fit(); else { var r = svg.getBoundingClientRect(); zoom(z * (b.dataset.zoom === 'in' ? 1.5 : 1 / 1.5), r.x + r.width / 2, r.y + r.height / 2); } });
    host.addEventListener('pointerdown', function (e) { if (!sync()) return; points[e.pointerId] = { x: e.clientX, y: e.clientY }; var ids = Object.keys(points); if (ids.length === 1) gesture = { type: 'tap', x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY }; else if (ids.length === 2) { var a = points[ids[0]], b = points[ids[1]]; gesture = { type: 'pinch', d: Math.hypot(a.x - b.x, a.y - b.y) || 1, z: z }; } });
    host.addEventListener('pointermove', function (e) { if (!points[e.pointerId] || !gesture) return; points[e.pointerId] = { x: e.clientX, y: e.clientY }; var ids = Object.keys(points); if (gesture.type === 'pinch' && ids.length === 2) { var a = points[ids[0]], b = points[ids[1]]; zoom(gesture.z * Math.hypot(a.x - b.x, a.y - b.y) / gesture.d, (a.x + b.x) / 2, (a.y + b.y) / 2); return; } if (gesture.type === 'tap' && Math.hypot(e.clientX - gesture.x, e.clientY - gesture.y) > 8) gesture.type = 'pan'; if (gesture.type === 'pan') { try { host.setPointerCapture(e.pointerId); } catch (_) {} var dx = e.clientX - gesture.lx, dy = e.clientY - gesture.ly; gesture.lx = e.clientX; gesture.ly = e.clientY; if (z > 1) { var m = svg.getScreenCTM(); x -= dx / m.a; y -= dy / m.d; apply(); } else if (innerWidth < 600 && e.pointerType !== 'mouse') window.scrollBy(0, -dy); } });
    function up(e) { if (!points[e.pointerId]) return; delete points[e.pointerId]; if (gesture && gesture.type !== 'tap') suppress = performance.now() + 400; gesture = Object.keys(points).length ? { type: 'done' } : null; }
    host.addEventListener('pointerup', up); host.addEventListener('pointercancel', up);
    host.addEventListener('click', function (e) { if (performance.now() < suppress) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
    new MutationObserver(function () { if (getSvg() !== svg) fit(); }).observe(host, { childList: true });
    fit();
    return { fit: fit, center: center, scale: function () { return z; }, input: function (cx, cy, height) { if (!sync()) return; z = Math.min(12, Math.max(1, z * 44 / (height * svg.getScreenCTM().d))); center(cx, cy); } };
  }
})();
