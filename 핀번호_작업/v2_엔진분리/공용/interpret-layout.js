/* 회로해석 28개 공용 배치. 입력·채점·결과 PNG 엔진은 유지한다. */
(function(){
 'use strict';
 var body=document.body;
 if(body.dataset.stage!=='interpret')return;
 var $=function(s){return document.querySelector(s);},make=function(tag,cls){var e=document.createElement(tag);e.className=cls||'';return e;};
 body.classList.add('ip-layout');
 body.classList.remove('ip-circ-closed');
 var main=$('main'),panel=$('#panel'),svg=$('#circuit'),card=svg.parentNode,modes=$('.ip-tabs'),toolbar=$('.toolbar');
 var row=make('div','ps-row');modes.before(row);row.append(modes,$('#progress'));
 var save=$('#btnSave'),share=$('#btnShare');save.textContent='이미지 저장';share.textContent='공유';share.hidden=false;
 window.PRACTICE_SHELL.submission(row,[$('#stuName').closest('label'),$('#stuId').closest('label'),save,share]);toolbar.hidden=true;
 var help=make('details','ps-brief');help.innerHTML='<summary><span class="ps-brief-icon">?</span><span class="ps-brief-text"></span><span class="ps-brief-more">설명 ▾</span></summary><div class="pf-popover"></div>';main.before(help);
 var intro=$('.page-header .lead'),copyright=$('body > p.note'),notes=make('div');help.lastChild.append(intro,notes,copyright);
 var head=make('div','il-figure-head');head.innerHTML='<strong>회로도 · 참고</strong><button type="button" data-zoom="out">−</button><button type="button" data-zoom="fit">맞춤</button><button type="button" data-zoom="in">+</button><button type="button" class="il-large-button">크게 보기</button>';
 var viewport=make('div','il-viewport');card.prepend(head);card.append(viewport);viewport.append(svg);
 var pickSize=make('button','il-pick-size');pickSize.type='button';pickSize.textContent='접점 확대';head.insertBefore(pickSize,head.querySelector('.il-large-button'));
 var base={w:svg.viewBox.baseVal.width,h:svg.viewBox.baseVal.height},z=1,x=0,y=0,drag=null,moved=0,lastMode=null;
 function apply(){var w=base.w/z,h=base.h/z;x=Math.max(0,Math.min(base.w-w,x));y=Math.max(0,Math.min(base.h-h,y));svg.setAttribute('viewBox',[x,y,w,h].join(' '));}
 function zoom(n){var cx=x+base.w/z/2,cy=y+base.h/z/2;z=Math.max(1,Math.min(8,n));x=cx-base.w/z/2;y=cy-base.h/z/2;apply();}
 function fit(){z=1;x=y=0;apply();}
 pickSize.onclick=function(){var hits=Array.from(svg.querySelectorAll('[data-item-id] .dr-hit'));var smallest=Math.min.apply(null,hits.map(function(r){return +r.getAttribute('height');}).filter(function(h){return h>0;}));if(isFinite(smallest)){var m=svg.getScreenCTM();zoom(z*44/(smallest*Math.hypot(m.c,m.d)));}};
 head.onclick=function(e){var b=e.target.closest('[data-zoom]');if(!b)return;if(b.dataset.zoom==='fit')fit();else zoom(z*(b.dataset.zoom==='in'?1.5:1/1.5));};
 viewport.addEventListener('pointerdown',function(e){drag={id:e.pointerId,x:e.clientX,y:e.clientY};});
 viewport.addEventListener('pointermove',function(e){if(!drag||drag.id!==e.pointerId)return;var dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)<5)return;viewport.setPointerCapture(e.pointerId);moved=performance.now()+400;var m=svg.getScreenCTM();if(z>1){x-=dx/m.a;y-=dy/m.d;apply();}drag.x=e.clientX;drag.y=e.clientY;});
 function release(){drag=null;}viewport.addEventListener('pointerup',release);viewport.addEventListener('pointercancel',release);
 viewport.addEventListener('click',function(e){if(performance.now()<moved){e.stopImmediatePropagation();e.preventDefault();}},true);
 var dialog=make('dialog','il-large');dialog.innerHTML='<header><strong>회로도 크게 보기</strong><button type="button">닫기 ×</button></header><div class="il-large-picture"></div>';body.append(dialog);
 head.querySelector('.il-large-button').onclick=function(){var clone=svg.cloneNode(true);clone.removeAttribute('id');clone.setAttribute('viewBox',[0,0,base.w,base.h].join(' '));dialog.lastChild.replaceChildren(clone);dialog.showModal();};dialog.querySelector('button').onclick=function(){dialog.close();};
 dialog.lastChild.addEventListener('click',function(e){var item=e.target.closest('[data-item-id]');if(!item)return;var original=Array.from(svg.querySelectorAll('[data-item-id]')).find(function(n){return n.dataset.itemId===item.dataset.itemId;});if(original){original.dispatchEvent(new MouseEvent('click',{bubbles:true}));dialog.close();}});
 function refresh(){var mode=window.__interpret.state.mode;
  pickSize.hidden=mode!=='pick';
  head.firstChild.textContent=mode==='pick'?'회로도에서 접점 고르기':'회로도 · 전체 맞춤 / 확대 가능';
  if(mode!==lastMode){lastMode=mode;fit();}
  notes.replaceChildren(...Array.from(panel.querySelectorAll(':scope > .where,:scope > .ip-help,:scope > .ip-model-note'),function(n){var c=n.cloneNode(true);if(c.tagName==='DETAILS')c.open=true;return c;}));
  var hint=mode==='write'?'회로도를 참고해 동작을 순서대로 쓰세요. 다 쓴 뒤 나란히 비교합니다.':(panel.querySelector('.ip-prompt')?.textContent||'기기를 누르면 같은 기기의 코일과 접점을 함께 봅니다.');help.querySelector('.ps-brief-text').textContent=hint;help.querySelector('.ps-brief-text').title=hint;
  apply();
 }
 new MutationObserver(refresh).observe(panel,{childList:true});refresh();
 var fullHeight=innerHeight;
 function keyboard(){var h=window.visualViewport?visualViewport.height:innerHeight,typing=document.activeElement?.id==='answer';if(!typing)fullHeight=Math.max(fullHeight,h);var open=typing&&fullHeight-h>150;body.classList.toggle('il-keyboard',open);if(open)requestAnimationFrame(function(){document.activeElement.scrollIntoView({block:'center'});});}
 window.addEventListener('resize',keyboard);if(window.visualViewport)visualViewport.addEventListener('resize',keyboard);document.addEventListener('focusin',keyboard);document.addEventListener('focusout',function(){setTimeout(keyboard,0);});
 window.__interpretLayout={fit:fit,zoom:zoom};
})();
