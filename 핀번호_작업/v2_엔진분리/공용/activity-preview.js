/* 핀번호·단자대 공용 활동 화면. 기존 입력 이벤트·데이터·채점·PNG 유지. */
(function () {
  'use strict';
  var body=document.body,stage=body.dataset.stage;
  var assetRoot=new URL('../사진/',document.currentScript.src);
  function devicePhotos(it,type){
    var ids=[],note='기구와 소켓의 방향을 내부 결선도와 나란히 확인해요.';
    var fronts={'mc-12p':'mc','timer-8p':'timer','flicker-8p':'flicker-timer','fls-8p':'fls'};
    if(type==='eocr-12p'||type==='ls-2p')return null;
    if(type==='relay-8p'){ids=['socket-8p'];note='8P 소켓의 홈과 번호를 확인해요. 릴레이 앞면은 추가 촬영 예정이에요.';}
    else if(fronts[type])ids=[type==='mc-12p'?'socket-12p':'socket-8p',fronts[type]];
    else if(it.cat==='lamp'){ids=it.tag==='BZ'?['buzzer','buzzer-back']:[({'RL':'lamp-red','GL':'lamp-green','YL':'lamp-yellow','WL':'lamp-white'})[it.tag],'lamp-back'];note='앞면 색과 뒷면 단자를 함께 확인해요.';}
    else if(it.cat==='pb'){ids=[it.kind==='b'?'pushbutton-red':'pushbutton-green','pushbutton-back'];note='뒷면 NC·NO 글자를 보고 b접점·a접점 단자를 찾아요.';}
    else if(it.cat==='ss'){ids=['selector-switch','selector-switch-top'];note='스위치 방향과 접점 블록을 내부 결선도와 비교해요.';}
    else if(it.tag==='MCCB'){ids=['mccb-front','mccb-bottom-label'];note='전원측·부하측 방향과 기구 표시를 확인해요.';}
    return ids.length&&ids.every(Boolean)?{ids:ids,note:note}:null;
  }
  if(stage==='wire'||stage==='tb')setupPracticePhotos();
  if(!['pin','tb'].includes(stage))return;
  var $=function(s){return document.querySelector(s);},ns='http://www.w3.org/2000/svg';
  function make(t,c){var e=document.createElement(t);e.className=c||'';return e;}
  if(stage==='pin')setupPin();else setupOrder();

  function setupPracticePhotos(){
    var LS_NOTE='수업에서는 LS 대신 4핀 단자대에서 전선을 빼서 LS 동작을 대신해요.';
    var W=window.PIN_WIRING[body.dataset.circuit],C=window.PIN_CIRCUITS[body.dataset.circuit],devices={};
    Object.keys(W.panel.devices).forEach(function(tag){devices[tag]=W.panel.devices[tag];});
    if(W.piping)(W.piping.boxes||[]).forEach(function(box){(box.devices||[]).forEach(function(d){devices[d.tag]=d;});});
    function photos(tag){
      var d=devices[tag],type=(C.devices[tag]||{}).type;
      if(!d)return null;
      if(tag==='EOCR')return {ids:['eocr-front','eocr-side','eocr-back'],note:'선생님 촬영 전면·측면·후면이에요. 사진 속 단자 표시는 학습 회로의 핀번호와 같다고 가정하지 않아요.'};
      if(/^LS/.test(tag))return {ids:['terminal-block-4p'],note:LS_NOTE};
      if(d.type==='tb-strip' && d.n===20 && JSON.stringify(d.blocks)==='[10,10]')return {ids:['terminal-block-10p'],note:'이 단자대는 10P 두 개로 된 20극이에요. 사진은 10P 한 개이며, 이름·방향은 배치도를 따라요.'};
      if(d.type==='tb' && (d.pins||[]).length+(d.spare||0)===4 && !/^e/.test(body.dataset.circuit))return {ids:['terminal-block-4p'],note:'4극 단자대예요. 화면은 한쪽 나사 줄을 단순화했으며 사진의 양쪽 나사는 같은 극이에요. 방향은 배치도를 따라요.'};
      var cat=d.type==='pb'?'pb':d.type==='ss'?'ss':d.type==='lamp'||d.type==='bz'?'lamp':null;
      var p=devicePhotos({tag:tag,cat:cat,kind:d.kind},type);
      if(p && type==='relay-8p')p.note='8P 소켓의 홈과 번호를 배치도와 함께 확인해요.';
      return p;
    }
    var list=Object.keys(devices);if(!list.some(function(tag){return photos(tag);}))return;
    var ref=document.createElement('details');ref.className='ap-practice-reference';ref.setAttribute('data-html2canvas-ignore','true');
    ref.innerHTML='<summary>기구 참고 · 실물 사진</summary><div class="ap-practice-content"><label>기구 <select aria-label="실물 사진 기구 선택"></select></label><div class="ap-reference-tabs" role="tablist"><button type="button" role="tab">기구 설명</button><button type="button" role="tab">실물 사진</button></div><div class="ap-practice-description" role="tabpanel"></div><div class="ap-photo-panel" role="tabpanel"><div class="ap-photo-gallery"></div><p class="ap-photo-note"></p></div></div>';
    var board=document.querySelector(stage==='wire'?'#wBoard':'#tBoard'),parent=stage==='wire'?board.parentNode:document.querySelector('.ap-tb-side');
    if(stage==='wire')board.before(ref);else parent.appendChild(ref);
    var select=ref.querySelector('select'),tabs=ref.querySelectorAll('[role=tab]'),desc=ref.querySelector('.ap-practice-description'),photo=ref.querySelector('.ap-photo-panel');
    list.forEach(function(tag){var o=document.createElement('option');o.value=tag;o.textContent=tag;select.appendChild(o);});
    var dialog=document.createElement('dialog');dialog.className='ap-reference-dialog';dialog.setAttribute('aria-label','실물 사진 크게 보기');dialog.innerHTML='<header><strong>실물 사진 크게 보기</strong><button type="button">닫기</button></header><div class="ap-large-figs"></div>';document.body.appendChild(dialog);
    dialog.querySelector('button').onclick=function(){dialog.close();};
    function choosePhoto(on){if(tabs[1].hidden)on=false;tabs[0].setAttribute('aria-selected',String(!on));tabs[1].setAttribute('aria-selected',String(on));desc.hidden=on;photo.hidden=!on;}
    tabs[0].onclick=function(){choosePhoto(false);};tabs[1].onclick=function(){choosePhoto(true);};
    function choose(tag){
      var p=photos(tag);select.value=tag;ref.querySelector('summary').textContent=tag+' · 기구 참고';tabs[1].hidden=!p;if(!p){desc.textContent='이 기구는 연결된 실물 사진이 없습니다.';photo.querySelector('.ap-photo-gallery').replaceChildren();choosePhoto(false);return;}
      desc.textContent=p.note;photo.querySelector('.ap-photo-note').textContent=p.note;
      var gallery=photo.querySelector('.ap-photo-gallery');gallery.replaceChildren();
      p.ids.forEach(function(id){var button=document.createElement('button'),img=document.createElement('img');button.type='button';button.className='ap-photo-thumb';button.dataset.photo=id;button.setAttribute('aria-label',tag+' 실물 사진 크게 보기');img.src=new URL(id+'_s.jpg',assetRoot).href;img.alt=tag+' 실물 참고 사진';button.appendChild(img);gallery.appendChild(button);
        button.onclick=function(){var fig=document.createElement('figure');fig.className='ap-photo-large';var large=document.createElement('img'),caption=document.createElement('figcaption');large.src=new URL(id+'.jpg',assetRoot).href;large.alt=img.alt;caption.textContent=p.note;fig.append(large,caption);dialog.querySelector('.ap-large-figs').replaceChildren(fig);dialog.showModal();};
      });choosePhoto(true);
    }
    select.onchange=function(){choose(select.value);};choose(list[0]);
    // 단자 클릭은 기존 처리에 맡긴다. 기구 본체나 이름을 고를 때만 참고 칸을 연다.
    board.addEventListener('click',function(e){if(e.target.closest('[data-key],[data-cell]'))return;var dev=e.target.closest('[data-tag]'),tag=dev?dev.dataset.tag:e.target.closest('text')?.textContent.trim();if(tag&&devices[tag]){choose(tag);ref.open=true;}});
    ref.addEventListener('keydown',function(e){if(e.target.getAttribute('role')==='tab'&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();var on=!tabs[1].hidden&&(e.key==='End'||e.key==='ArrowRight');choosePhoto(on);tabs[on?1:0].focus();}});
    window.__practicePhotos={select:choose,photos:photos,element:ref};
  }

  function setupPin(){
    body.classList.add('ap-pin');
    var panel=$('#panel'),notes=make('div','ap-device-notes'),referenceTab=0,referenceLabel='내부 결선도';$('.ps-brief .pf-popover').prepend(notes);
    function sizeHits(){panel.querySelectorAll('.fig:not([hidden]) svg').forEach(function(svg){var m=svg.getScreenCTM();if(!m)return;var size=44/Math.hypot(m.c,m.d);svg.querySelectorAll('.ap-hit').forEach(function(hit){var cx=+hit.getAttribute('x')+(+hit.getAttribute('width'))/2,cy=+hit.getAttribute('y')+(+hit.getAttribute('height'))/2;hit.setAttribute('x',cx-size/2);hit.setAttribute('y',cy-size/2);hit.setAttribute('width',size);hit.setAttribute('height',size);});});}
    var referenceObserver=new ResizeObserver(sizeHits);
    var dialog=make('dialog','ap-reference-dialog');
    dialog.innerHTML='<header><strong>기구 내부 결선도 · 소켓</strong><button type="button">닫기</button></header><div class="ap-large-figs"></div>';
    body.appendChild(dialog);dialog.querySelector('button').onclick=function(){dialog.close();};
    function showPhoto(id){var fig=make('figure','ap-photo-large'),img=make('img'),caption=make('figcaption');img.src=new URL(id+'.jpg',assetRoot).href;img.alt='선생님 촬영 기구 사진';caption.textContent='선생님 촬영 · 참고 사진 (핀 번호는 내부 결선도에서 확인해요)';fig.append(img,caption);dialog.querySelector('header strong').textContent='실물 사진 크게 보기';dialog.querySelector('.ap-large-figs').replaceChildren(fig);}
    function large(){var photo=panel.querySelector('.ap-photo-panel:not([hidden]) [data-photo]');if(photo){showPhoto(photo.dataset.photo);return;}dialog.querySelector('header strong').textContent='기구 내부 결선도 · 소켓';dialog.querySelector('.ap-large-figs').replaceChildren(...Array.from(panel.querySelectorAll('.fig:not(.ap-photo-panel)'),function(f){return f.cloneNode(true);}));}
    dialog.addEventListener('click',function(e){var p=e.target.closest('[data-pin]');if(p){var original=Array.from(panel.querySelectorAll('[data-pin]')).find(function(n){return n.dataset.pin===p.dataset.pin;});if(original)original.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
    function pinKey(e){if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-pin]')){e.preventDefault();e.stopPropagation();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}}
    panel.addEventListener('keydown',pinKey);dialog.addEventListener('keydown',pinKey);
    function enhance(){
      if(panel.querySelector('.ap-reference-tools'))return;
      notes.replaceChildren();
      panel.querySelectorAll('.hint,.fig-cap,.photo,:scope > .note').forEach(function(n){notes.appendChild(n);});
      var figs=Array.from(panel.querySelectorAll('.fig'));if(!figs.length)return;
      var selected=window.__pin.state.sel,it=window.__pin.byId[selected.split('.')[0]],C=window.PIN_CIRCUITS[body.dataset.circuit],photos=devicePhotos(it,(C.devices[it.tag]||{}).type);
      var bar=make('div','ap-reference-tools');bar.innerHTML='<button type="button" class="ap-enlarge" title="기구 그림의 번호를 누르면 입력됩니다">크게 보기</button>';
      var clear=panel.querySelector('[data-key=""]');if(clear){clear.textContent='이 칸 지우기';bar.appendChild(clear);}
      var heading=panel.querySelector('h2');heading.after(bar);bar.prepend(heading);bar.querySelector('.ap-enlarge').onclick=function(){large();dialog.showModal();};
      figs.forEach(function(fig,i){var svg=fig.querySelector('svg'),v=svg.viewBox.baseVal,w=i? (v.width>300?300:250):(v.width>350?350:330);svg.style.setProperty('--ap-width',w+'px');
        svg.querySelectorAll('[data-pin]').forEach(function(p){
          var b=p.getBBox(),size=42*v.width/w,hit=document.createElementNS(ns,'rect');
          hit.setAttribute('x',b.x+b.width/2-size/2);hit.setAttribute('y',b.y+b.height/2-size/2);hit.setAttribute('width',size);hit.setAttribute('height',size);hit.setAttribute('fill','transparent');hit.setAttribute('class','ap-hit');p.appendChild(hit);
          p.setAttribute('role','button');p.setAttribute('tabindex','0');p.setAttribute('aria-label',p.dataset.pin+' 입력');
        });
      });
      var labels=['내부 결선도','소켓 모양'].slice(0,figs.length);
      if(photos){
        notes.querySelectorAll('.photo').forEach(function(n){n.remove();});
        var photoPanel=make('div','fig ap-photo-panel'),gallery=make('div','ap-photo-gallery'),note=make('p','ap-photo-note');
        photos.ids.forEach(function(id){var button=make('button','ap-photo-thumb'),img=make('img');button.type='button';button.dataset.photo=id;button.setAttribute('aria-label','실물 사진 크게 보기');img.src=new URL(id+'_s.jpg',assetRoot).href;img.alt=it.tag+' 실물 참고 사진';button.append(img);button.onclick=function(){showPhoto(id);dialog.showModal();};gallery.append(button);});
        var photoKeys=panel.querySelector('.keypad').cloneNode(true);photoKeys.classList.add('ap-photo-keys');photoKeys.querySelector('[data-key=""]')?.remove();
        note.textContent=photos.note;photoPanel.append(gallery,note,photoKeys);figs.push(photoPanel);labels.push('실물 사진');
      }
      referenceTab=Math.max(0,labels.indexOf(referenceLabel));
      var tabs=make('div','ap-reference-tabs'),frame=make('div','ap-reference-frame');
      tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','기구 참고 그림');
      labels.forEach(function(label,i){
        var b=make('button');b.type='button';b.textContent=label;b.setAttribute('role','tab');
        b.id='ap-ref-tab-'+i;b.setAttribute('aria-controls','ap-ref-panel-'+i);
        figs[i].id='ap-ref-panel-'+i;figs[i].setAttribute('role','tabpanel');figs[i].setAttribute('aria-labelledby',b.id);
        b.onclick=function(){referenceTab=i;selectReference();};tabs.append(b);frame.append(figs[i]);
      });
      bar.after(tabs,frame);
      function selectReference(){if(referenceTab>=figs.length)referenceTab=0;referenceLabel=labels[referenceTab];Array.from(tabs.children).forEach(function(b,i){b.setAttribute('aria-selected',String(i===referenceTab));figs[i].hidden=i!==referenceTab;});requestAnimationFrame(sizeHits);}
      tabs.onkeydown=function(e){if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();referenceTab=e.key==='Home'?0:e.key==='End'?figs.length-1:(referenceTab+(e.key==='ArrowRight'?1:-1)+figs.length)%figs.length;selectReference();tabs.children[referenceTab].focus();};
      selectReference();
      referenceObserver.disconnect();referenceObserver.observe(frame);
      if(dialog.open)large();
    }
    // 엔진이 패널을 다시 그릴 때만 적용한다. 장식용 자식 추가는 재귀하지 않는다.
    new MutationObserver(enhance).observe(panel,{childList:true});enhance();
  }

  function setupOrder(){
    function projected(W){
      var drawing=JSON.parse(JSON.stringify(W)),P=drawing.piping;
      function X(x){return Math.abs(x)<=200?x*2.5:x+Math.sign(x)*300;}
      function Y(y){return Math.abs(y)<=210?y:Math.sign(y)*(210+(Math.abs(y)-210)*.55);}
      P.box.w=1000;P.boxes.forEach(function(b){b.x=X(b.x);b.y=Y(b.y);});
      P.pipes.forEach(function(p){p.pts=p.pts.map(function(pt){return[X(pt[0]),Y(pt[1])];});});
      return drawing;
    }

    var panel=$('#tInfo'),host=$('#tBoard'),card=host.parentElement,options=make('div','ap-options'),legend=make('span','ap-pipe-legend');
    var commonNotes=make('div','ap-common-notes');$('.ps-brief .pf-popover').appendChild(commonNotes);
    function forward(e){var b=e.target.closest('button[data-g]');if(!b)return;e.stopPropagation();
      var original=Array.from(panel.querySelectorAll('button[data-g]')).find(function(n){return n.dataset.g===b.dataset.g;});if(original)original.click();
    }
    options.addEventListener('click',forward);host.addEventListener('click',forward);
    function refresh(){
      commonNotes.replaceChildren();if(tbPage.state.tab==='common')panel.querySelectorAll(':scope > .note').forEach(function(n){commonNotes.appendChild(n.cloneNode(true));});
      var active=window.tbPage.state.tab==='order';body.classList.toggle('ap-order',active);
      options.remove();legend.remove();host.style.removeProperty('--ap-aspect');
      body.classList.toggle('ap-common',window.tbPage.state.tab==='common');
      if(!active){
        if(window.tbPage.state.tab==='explain'){
          // 화면의 칸 번호만 키운다. 원래 단자·위치·권장 배치 데이터는 유지한다.
          var picture=host.querySelector('svg');
          picture.querySelectorAll('.pr-cell > text:first-of-type').forEach(function(t){
            t.setAttribute('font-size',24);
            var cell=t.parentNode.querySelector('rect');t.setAttribute('y',+cell.getAttribute('y')+21);
            // '공통' 표시는 원래 크기로 남겨 옆 칸 번호를 덮지 않는다.
            var common=/^(\d+) 공통$/.exec(t.textContent);
            if(common&&!t.querySelector('tspan')){var suffix=document.createElementNS(ns,'tspan');suffix.setAttribute('font-size',9);suffix.textContent=' 공통';t.replaceChildren(document.createTextNode(common[1]),suffix);}
          });
          if(picture.firstElementChild.matches('rect[fill="#fff"]'))picture.firstElementChild.remove();
          var bounds=picture.getBBox();picture.setAttribute('viewBox',[bounds.x-18,bounds.y-18,bounds.width+36,bounds.height+36].join(' '));
          host.style.setProperty('--ap-aspect',String((bounds.width+36)/(bounds.height+36)));
        }
        if(window.tbPage.state.tab==='common'){
          var W=window.PIN_WIRING[body.dataset.circuit],quiz=tbPage.common(),pair=quiz.list[quiz.q];
      var drawing=projected(W);

          var opt={strips:false,hlPoints:{},hlPipes:{},hlBoxes:{}};
          if(pair){opt.hlPoints[pair.a]=1;opt.hlPoints[pair.b]=1;var group=W.terminalBlocks.groups.find(function(g){return g.id===pair.group;});opt.hlBoxes[group.box]=1;(group.pipes||[]).forEach(function(id){opt.hlPipes[id]=1;});}
          host.innerHTML=window.PANEL_RENDER.drawPiping(drawing,opt);
          var picture=host.querySelector('svg');picture.firstElementChild.remove();
          legend.textContent=Object.values(W.piping.pipeKinds).map(function(k){return k.no+' '+k.label;}).join('　');card.querySelector('.pf-figure-head strong').after(legend);
          picture.querySelectorAll('text').forEach(function(t){if(Object.values(W.piping.pipeKinds).some(function(k){return t.textContent===k.no+' '+k.label;})){t.remove();return;}if(t.textContent.includes('제어함 ('))t.textContent='제어함 ('+W.piping.box.w+'×'+W.piping.box.h+')';t.setAttribute('font-size',Math.max(+t.getAttribute('font-size'),18));});
          var bb=picture.getBBox();picture.setAttribute('viewBox',[bb.x-18,bb.y-18,bb.width+36,bb.height+36].join(' '));
          host.style.setProperty('--ap-aspect',String((bb.width+36)/(bb.height+36)));
        }
        return;
      }
      var q=tbPage.order(),sid=Object.keys(tbPage.expected)[q.round],W=window.PIN_WIRING[body.dataset.circuit];
      legend.textContent=Object.values(W.piping.pipeKinds).map(function(k){return k.no+' '+k.label;}).join('　');card.querySelector('.pf-figure-head strong').after(legend);
      options.replaceChildren();var label=make('strong');label.textContent=sid+' 보기 · 왼쪽부터 선택';options.appendChild(label);
      panel.querySelectorAll('.tq-pool button').forEach(function(b){options.appendChild(b.cloneNode(true));});
      if(q.checked)label.textContent=sid+' · 고른 순서와 관을 확인하세요';
      if(sid==='TB5')host.before(options);else host.after(options);
      // 관의 연결·좌우 순서를 유지한 보기용 투영. 학생이 채울 제어함 폭을 확보한다.
      // 원본 객체와 mm 치수, 정답 계산에는 이 복사본을 사용하지 않는다.
      var drawing=projected(W);
      var o={strips:false,hlPipes:{},hlBoxes:{}};
      q.picks.forEach(function(id){var g=W.terminalBlocks.groups.find(function(g){return g.id===id;});g.pipes.forEach(function(p){o.hlPipes[p]=1;});o.hlBoxes[g.box]=1;});
      host.innerHTML=window.PANEL_RENDER.drawPiping(drawing,o);var svg=host.querySelector('svg');
      var box=Array.from(svg.querySelectorAll('rect')).find(function(r){return r.getAttribute('fill')==='#fbfaf7';});
      // 표시 치수는 원래 제어함 치수를 유지한다.
      svg.querySelectorAll('text').forEach(function(t){if(Object.values(W.piping.pipeKinds).some(function(k){return t.textContent===k.no+' '+k.label;})){t.remove();return;}
        if(t.textContent.includes('제어함 ('))t.textContent='제어함 ('+W.piping.box.w+'×'+W.piping.box.h+')';
        var f=Number(t.getAttribute('font-size'));t.setAttribute('font-size',Math.max(f,18));});
      var stripText=Array.from(svg.querySelectorAll('text')).find(function(t){return t.textContent===sid;}),stripRect=stripText.previousElementSibling;
      stripRect.remove();stripText.remove();
      var bx=+box.getAttribute('x'),by=+box.getAttribute('y'),bw=+box.getAttribute('width'),bh=+box.getAttribute('height');
      var centerLabel=Array.from(svg.querySelectorAll('text')).find(function(t){return t.textContent.includes('제어함 (');});centerLabel.setAttribute('y',sid==='TB5'?by+165:by+56);
      var fo=document.createElementNS(ns,'foreignObject');fo.setAttribute('x',bx+8);fo.setAttribute('y',sid==='TB5'?by+6:by+bh-148);fo.setAttribute('width',bw-16);fo.setAttribute('height',142);fo.setAttribute('class','ap-answer');
      var answer=make('div','ap-answer-strip'),caption=make('span','ap-strip-label');caption.textContent=sid+' · 왼쪽 → 오른쪽';answer.append(caption,panel.querySelector('.tq-slots').cloneNode(true));fo.appendChild(answer);svg.appendChild(fo);
      // 고정 도면 여백을 걷어내되 실제 기구·관은 모두 남긴다.
      var background=svg.firstElementChild;background.remove();var bounds=svg.getBBox(),pad=18;
      svg.setAttribute('viewBox',[bounds.x-pad,bounds.y-pad,bounds.width+pad*2,bounds.height+pad*2].join(' '));
      host.style.setProperty('--ap-aspect',String((bounds.width+pad*2)/(bounds.height+pad*2)));
      svg.setAttribute('preserveAspectRatio','xMidYMid meet');
    }
    new MutationObserver(refresh).observe(panel,{childList:true});refresh();
  }
})();

