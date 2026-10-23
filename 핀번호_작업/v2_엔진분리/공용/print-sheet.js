/* A4 학생용 유인물. 정답지는 이 API에 넣지 않는다. 기존 그림 렌더러를 공유한다.
 * input = PRINT_SHEET.studentInput(kind, C, W, referencePins);
 * article = PRINT_SHEET.render(kind, input, {id, course, title, logoUrl});
 * 화면에 article을 붙인 뒤 PRINT_SHEET.prepare(article), inspect(article) 순으로 호출한다.
 * prepare는 실제 종이 배율로 글자·단자 원 간격을 맞춘다. 원본 회로·기구 규격은 바꾸지 않는다.
 */
(function (root) {
  'use strict';
  var DR = root.DIAGRAM_RENDER, PR = root.PANEL_RENDER;
  var PRINT_NAME = '시퀀스 제어 실습';
  var kinds = {interpret: '회로해석', pin: '핀번호 적기', tb: '단자대 번호매기기', wire: '결선하기'};
  function esc(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }
  function pick(o, keys) {
    var v = {}; keys.forEach(function(k) { if (o[k] !== undefined) v[k] = o[k]; }); return v;
  }
  // 목록을 열거하지 않고 허용된 필드만 읽는다. net·풀이·정답·저장 답은 경계를 넘지 않는다.
  function layoutOnly(L) {
    var v = pick(L, ['viewBox','coilY']);
    v.drawing = (L.drawing || []).map(function(p) { return pick(p,['t','x','y','w','h','x1','x2','y1','y2','s','size','anchor','bold','sw','dash','pts','id']); });
    v.main = (L.main || []).map(function(p) { return pick(p,['tag','xs','slotY','optional']); });
    v.items = (L.items || []).map(function(p) {
      var q = pick(p,['id','tag','cat','x','y','x1','x2','rows','horiz','kind','feat','label','sub','shape']);
      if (p.slots) q.slots = p.slots.map(function(s) { return pick(s,['x','y']); });
      return q;
    });
    return v;
  }
  function studentInput(kind, C, W, referencePins) {
    if (!kinds[kind]) throw Error('알 수 없는 유인물 종류');
    var v = {};
    if (kind === 'interpret' || kind === 'pin') v.layout = layoutOnly(C.layout);
    if (kind === 'pin') {
      v.devices = {};
      Object.keys(C.devices).forEach(function(tag) { v.devices[tag] = pick(C.devices[tag], ['type','cat']); });
    }
    if (kind === 'tb') v.piping = W.piping;
    if (kind === 'wire') {
      v.panel = W.panel;
      v.wireTypes = W.wireTypes;
    }
    return v;
  }
  function circuit(input, mode) {
    var L = input.layout, items = root.PIN_VALIDATE.buildItems({layout:L}), byId = {}, slots = [];
    items.forEach(function(it) { byId[it.id] = it; (it.slots || []).forEach(function(s) { slots.push(s); }); });
    var text = DR.drawBase(L,items,byId,L.coilY,{wrapItems:mode==='blank'}).join('');
    if (mode === 'blank') items.forEach(function(it) { (it.slots || []).forEach(function(s,index) {
      var gap = Math.min.apply(null,[48].concat(slots.filter(function(t) {return t !== s && Math.abs(t.y-s.y)<28;}).map(function(t) {return Math.abs(t.x-s.x);}))), w = Math.min(46,gap-2);
      text += '<rect class="ps-blank" data-ps-item="'+esc(it.id)+'" data-ps-index="'+index+'" data-ps-x="'+s.x+'" data-ps-y="'+s.y+'" x="'+(s.x-w/2)+'" y="'+(s.y-14)+'" width="'+w+'" height="28" rx="2" fill="none" stroke="#829099" stroke-dasharray="3 2" stroke-width="0.8"/>';
    }); });
    if (mode === 'numbered') input.referencePins.forEach(function(p) {
      text += '<g class="ps-number" data-ps-x="'+p.x+'" data-ps-y="'+p.y+'"><rect x="'+(p.x-20)+'" y="'+(p.y-14)+'" width="40" height="29" fill="white"/><text class="ps-reference-pin" x="'+p.x+'" y="'+(p.y+8)+'" font-size="28" text-anchor="middle">'+esc(p.value)+'</text></g>';
    });
    return '<div class="ps-circuit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+L.viewBox.join(' ')+'">'+text+'</svg></div>';
  }
  function references(devices) {
    var groups = {}, F = DR.deviceFigures, lib = root.PIN_DEVICE_LIBRARY;
    Object.keys(devices).forEach(function(tag) {
      var d = devices[tag], key = d.type || d.cat;
      if (!groups[key]) groups[key] = {type:d.type, cat:d.cat, tags:[]};
      groups[key].tags.push(tag);
    });
    var typed=[],plain=[];
    Object.keys(groups).forEach(function(key) {
      var g=groups[key], svg, label;
      if (g.type) {
        var type=lib.types[g.type]; label=type.name;
        svg = !type.socket ? F.drawLS([]) : type.socket==='socket-12p' ? F.draw12(g.type,[]) : F.draw8(g.type,[]);
      } else if (g.cat==='pb') {label='푸시버튼'; svg=F.drawPB([],null);}
      else if (g.cat==='ss') {label='셀렉터'; svg=F.drawSS([],null);}
      else if (g.cat==='main') {label='MCCB'; svg=F.drawMCCB([]);}
      else {label='램프·부저'; svg=F.drawTwo('램프·부저',[]);}
      var card='<div class="ps-ref-card'+(g.type&&lib.types[g.type].socket==='socket-12p'?' ps-ref-tall':'')+'"><strong>'+esc(g.tags.join('·'))+' <span>'+esc(label)+'</span></strong>'+svg+'</div>';
      (g.type?typed:plain).push(card);
    });
    // 긴 카드를 같은 행으로 모은다. 이미 앞에 모인 기준본의 순서는 유지한다.
    typed.sort(function(a,b){return Number(b.indexOf('ps-ref-tall')>=0)-Number(a.indexOf('ps-ref-tall')>=0);});
    return '<section class="ps-references"><h2>사용 기구 내부 결선도 <small>같은 규격은 한 번씩</small></h2><div class="ps-ref-grid">'+typed.join('')+'</div><div class="ps-ref-grid ps-ref-plain">'+plain.join('')+'</div></section>';
  }
  function render(kind, input, meta, options) {
    options=options || {};
    var article=document.createElement('article'); article.className='ps-sheet ps-'+kind;
    var landscape=kind==='wire' && input.panel.size[0]>input.panel.size[1];
    if(landscape) article.classList.add('ps-landscape');
    // 독립 참고표. 다음 단계에서 referencePage:'next' 한 줄로 분리할 수 있다.
    if (options.referencePage==='next') article.classList.add('ps-reference-next');
    var title=esc(meta.course+' '+meta.id+' · '+meta.title), body='';
    if (kind==='interpret') body=circuit(input)+'<h2>회로의 동작 순서를 설명하세요.</h2><div class="ps-lines">'+Array.from({length:12},function(_,i){return '<div><span>'+(i+1)+'</span></div>';}).join('')+'</div>';
    if (kind==='pin') body=circuit(input,'blank')+references(input.devices);
    if (kind==='tb') {
      // 권장 배치 객체를 아예 전달하지 않는다. blankStrips는 숫자·기구명을 생성하지 않는다.
      var W={id:meta.id,piping:input.piping,terminalBlocks:{strips:{TB5:{blocks:[10,10],place:'top'},TB6:{blocks:[10,10],place:'bottom'}}}};
      body='<p>관의 연결을 보고 TB5·TB6 빈칸에 번호와 기구명을 쓰세요.</p><div class="ps-piping">'+PR.drawPiping(W,{strips:true,blankStrips:true})+'</div>';
    }
    if (kind==='wire') {
      body='<h2>제어판 배치도 · 단자와 단자를 선으로 이으세요.</h2><div class="ps-panel">'+PR.drawPanel({id:meta.id,panel:input.panel},{edges:[],hl:{},physicalContacts:true})+'</div><div class="ps-legend">'+Object.keys(input.wireTypes).map(function(k){var t=input.wireTypes[k];return '<span>'+esc(t.label)+' '+esc(t.color)+' '+esc(t.size)+'</span>';}).join('')+'</div>';
    }
    article.innerHTML='<header><img class="ps-emblem" alt="경성전자고등학교 교표" src="'+esc(meta.logoUrl)+'"><div class="ps-title"><small>경성전자고등학교 · IoT전기과</small><h1>'+title+'</h1><p>'+kinds[kind]+'</p></div><div class="ps-student">학번 ______________<br>이름 ______________</div></header>'+body+'<footer><span>'+PRINT_NAME+' · '+kinds[kind]+'</span><span>A4 '+(landscape?'가로':'세로')+' · 실제 크기 100%</span></footer><img class="ps-watermark" alt="" src="'+esc(meta.logoUrl)+'">';
    if(kind==='pin') article._psPinInput=input;
    if(kind==='wire') article._psWireDevices=input.panel.devices;
    article.querySelectorAll('[data-pin]').forEach(function(g){g.removeAttribute('data-pin');g.removeAttribute('style');});
    if(kind==='wire') article.querySelectorAll('.ps-panel .pr-term circle').forEach(function(c){c.setAttribute('r',+c.getAttribute('r')*1.25);});
    return article;
  }
  // 실제 인쇄 배율(mm/pt)을 확인하며, 하한 미달은 인쇄를 차단한다.
  function inspect(article) {
    var mm=25.4/96, pt=.75, min=function(xs){return xs.length?Math.min.apply(null,xs):null;};
    var refs=Array.from(article.querySelectorAll('.ps-ref-card svg text'));
    var blanks=Array.from(article.querySelectorAll('.ps-blank'));
    var circles=Array.from(article.querySelectorAll('.ps-panel .pr-term circle'));
    var pitches=[],clearances=[],inkClearances=[],pins=Array.from(article.querySelectorAll('.ps-reference-pin'));
    circles.forEach(function(a,i){circles.slice(i+1).forEach(function(b){var s=a.getScreenCTM().a,d=Math.hypot(a.cx.baseVal.value-b.cx.baseVal.value,a.cy.baseVal.value-b.cy.baseVal.value),clear=(d-a.r.baseVal.value-b.r.baseVal.value)*s*mm;pitches.push(d*s*mm);clearances.push(clear);inkClearances.push(clear-(parseFloat(getComputedStyle(a).strokeWidth)+parseFloat(getComputedStyle(b).strokeWidth))/2*s*mm);});});
    var res={blankMinMm:min(blanks.map(function(r){return r.width.baseVal.value*r.getScreenCTM().a*mm;})),blankHeightMm:min(blanks.map(function(r){return r.height.baseVal.value*r.getScreenCTM().a*mm;})),referenceMinPt:min(refs.map(function(t){return parseFloat(getComputedStyle(t).fontSize)*t.getScreenCTM().a*pt;})),referencePinMinPt:min(pins.map(function(t){return parseFloat(getComputedStyle(t).fontSize)*t.getScreenCTM().a*pt;})),terminalMinMm:min(circles.map(function(c){return 2*c.r.baseVal.value*c.getScreenCTM().a*mm;})),terminalPitchMm:min(pitches),terminalClearMm:min(clearances),terminalInkClearMm:min(inkClearances),errors:[]};
    if(res.blankMinMm!==null && res.blankMinMm<3.7) res.errors.push('빈칸 너비 3.7mm 미만');
    if(res.referenceMinPt!==null && res.referenceMinPt<7) res.errors.push('참고 그림 글자 7pt 미만');
    if(circles.length) {
      var elevator=article.querySelector('h1').textContent.indexOf('승강기')>=0;
      if(res.terminalMinMm<(elevator?3:2.4)||res.terminalPitchMm<(elevator?4:3.7)) res.errors.push('단자 지름·간격이 0097 세로 기준 미만');
      if(res.terminalInkClearMm<.5) res.errors.push('단자 원 사이 0.5mm 펜 여유 미달');
    }
    res.referenceTextCollisions=[];
    article.querySelectorAll('.ps-ref-card').forEach(function(card){
      var ts=Array.from(card.querySelectorAll('svg text'));
      ts.forEach(function(t,i){ts.slice(i+1).forEach(function(u){var a=t.getBoundingClientRect(),b=u.getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)res.referenceTextCollisions.push(t.textContent+'/'+u.textContent);});});
    });
    if(res.referenceTextCollisions.length) res.errors.push('참고 그림 글자 겹침 '+res.referenceTextCollisions.length+'건');
    res.blankTextCoveredMm2=0;
    blanks.forEach(function(blank){article.querySelectorAll('.ps-circuit text').forEach(function(t){
      var a=blank.getBoundingClientRect(),b=t.getBoundingClientRect();
      res.blankTextCoveredMm2+=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top))*mm*mm;
    });});
    if(res.blankTextCoveredMm2>0) res.errors.push('빈칸이 기구·단자 글자를 덮음');
    if(article._psPinInput){
      var svg=article.querySelector('.ps-circuit svg');
      var symbols=Array.from(svg.querySelectorAll('circle,ellipse,polygon,path,rect,.dr-item line,.dr-item polyline')).filter(function(e){return !e.classList.contains('ps-blank')&&!(e.tagName==='rect'&&+e.getAttribute('width')===svg.viewBox.baseVal.width);});
      var overlap=function(a,b){return Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top))*mm*mm;};
      res.blankSymbolCoveredMm2=0;res.blankOverlapMm2=0;
      blanks.forEach(function(b,i){symbols.forEach(function(s){res.blankSymbolCoveredMm2+=overlap(b.getBoundingClientRect(),s.getBoundingClientRect());});blanks.slice(i+1).forEach(function(c){res.blankOverlapMm2+=overlap(b.getBoundingClientRect(),c.getBoundingClientRect());});});
      if(res.blankSymbolCoveredMm2>0)res.errors.push('빈칸이 접점 원·기호를 덮음');
      if(res.blankOverlapMm2>0)res.errors.push('번호 칸끼리 겹침');
    }
    if(article.querySelector('.ps-unplaced')) res.errors.push('빈칸·참고 번호 배치 실패');
    return res;
  }
  function fitReferences(article) {
    // 인쇄 전용 글자 간격. 공용 그림의 선과 기호는 바꾸지 않는다.
    article.querySelectorAll('.ps-ref-card').forEach(function(card){
      var svg=card.querySelector('svg'), vb=svg.viewBox.baseVal;
      if(vb.width===330&&(vb.height===290||vb.height===274)) {
        var mc=vb.height===290;
        svg.setAttribute('viewBox','0 0 330 '+(mc?316:300));
        svg.querySelectorAll('text').forEach(function(t){
          var y=+t.getAttribute('y');
          if(y===50) t.setAttribute('y',54);
          if(y===250) t.setAttribute('y',260);
          if(y===268) t.setAttribute('y',288);
        });
        svg.querySelector('rect').setAttribute('height',mc?304:286);
      }
      if(vb.width===330&&vb.height===230) svg.querySelectorAll('text').forEach(function(t){
        if(t.textContent==='수동(M)') t.setAttribute('y',28);
        if(t.textContent==='SS') t.setAttribute('y',108);
      });
    });
    // 도형 크기는 유지하고 작은 규격 글씨만 7pt까지 올린다. 들어가지 않으면 inspect가 알린다.
    article.querySelectorAll('.ps-ref-card svg text').forEach(function(t) {
      var floor=7/(t.getScreenCTM().a*.75);
      if(parseFloat(getComputedStyle(t).fontSize)<floor) t.setAttribute('font-size',Math.ceil(floor*1000)/1000);
    });
  }
  function prepare(article) {
    if(article.classList.contains('ps-wire')) prepareWire(article);
    if(article._psPinInput) preparePin(article);
    fitReferences(article);
    if(!article._psPinInput) fitMarks(article);
    // 원 중심은 그대로 두고 촘촘한 원만 줄인다. 테두리 선폭까지 빼도 0.5mm 펜이 지난다.
    var circles=Array.from(article.querySelectorAll('.ps-panel .pr-term circle'));
    circles.forEach(function(c){
      var nearest=Math.min.apply(null,circles.filter(function(t){return t!==c;}).map(function(t){return Math.hypot(c.cx.baseVal.value-t.cx.baseVal.value,c.cy.baseVal.value-t.cy.baseVal.value);}));
      var gap=.55/(c.getScreenCTM().a*25.4/96)+parseFloat(getComputedStyle(c).strokeWidth);
      c.setAttribute('r',Math.min(c.r.baseVal.value,(nearest-gap)/2));
    });
    prepareWatermark(article);
  }
  // 흰 SVG 판 아래의 교표가 가려지지 않도록 같은 쪽 좌표를 판 안에 이어 그린다.
  // 각 img는 바탕 rect 뒤, 글자·선 앞에 놓인다. 합성 모드로 본문 전체를 래스터화하지 않는다.
  function prepareWatermark(article) {
    var mark=article.querySelector('.ps-watermark'), box=mark.getBoundingClientRect();
    article.querySelectorAll('svg rect[fill]').forEach(function(rect){
      if(!/^#f|^white$/.test(rect.getAttribute('fill'))) return;
      var inset=parseFloat(rect.getAttribute('stroke-width')||1)/2+.2;
      var x=+rect.getAttribute('x')+inset, y=+rect.getAttribute('y')+inset;
      var width=+rect.getAttribute('width')-2*inset, height=+rect.getAttribute('height')-2*inset;
      if(width<=0||height<=0)return;
      var matrix=rect.getScreenCTM(), a=matrix.a, d=matrix.d;
      if(box.right<matrix.e+x*a||box.left>matrix.e+(x+width)*a||box.bottom<matrix.f+y*d||box.top>matrix.f+(y+height)*d)return;
      var f=document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
      f.setAttribute('class','ps-watermark-fragment');f.setAttribute('x',x);f.setAttribute('y',y);f.setAttribute('width',width);f.setAttribute('height',height);f.style.pointerEvents='none';
      var div=document.createElementNS('http://www.w3.org/1999/xhtml','div');div.style.cssText='position:relative;width:100%;height:100%;overflow:hidden';
      var im=document.createElement('img');im.alt='';im.src=mark.src;
      im.style.cssText='position:absolute;max-width:none;left:'+((box.left-matrix.e)/a-x)+'px;top:'+((box.top-matrix.f)/d-y)+'px;width:'+(box.width/a)+'px;height:'+(box.height/d)+'px;opacity:.075;filter:grayscale(1) brightness(0)';
      div.appendChild(im);f.appendChild(div);rect.after(f);
    });
  }
  // 인쇄 전용: 가로 배율을 보존하고 남은 높이를 줄 사이 통로에 균등 배분한다.
  // 글자·단자·상자까지 포함한 그림 경계가 겹치는 기구를 한 줄로 묶는다.
  function prepareWire(article) {
    if(article._psWireLayout) return;
    var area=article.querySelector('.ps-panel'), svg=area.querySelector('svg');
    var legend=article.querySelector('.ps-legend'), footer=article.querySelector('footer');
    var mm=25.4/96, legendHeight=legend.getBoundingClientRect().height;
    area.style.height=((footer.getBoundingClientRect().top-area.getBoundingClientRect().top-legendHeight)*mm-5)+'mm';
    var rect=area.getBoundingClientRect(), vb=svg.viewBox.baseVal;
    var height=rect.height/rect.width*vb.width, border=svg.children[1], margin=+border.getAttribute('y');
    svg.setAttribute('viewBox','0 0 '+vb.width+' '+height);
    svg.children[0].setAttribute('height',height);border.setAttribute('height',height-2*margin);
    var unitMm=rect.width/vb.width*mm, nodes=Array.from(svg.querySelectorAll('.pr-dev'));
    // 전기의 10P+10P 단자대만: 두 나사 줄 사이에 앞 단계 배치도를 옮겨 적는 10mm 빈칸.
    // 학생 렌더러·기구 데이터는 건드리지 않고 인쇄 SVG에서만 늘린다.
    var strips=nodes.filter(function(e){return e.querySelectorAll('.pr-term').length===40;});
    strips.forEach(function(g){
      var terms=Array.from(g.querySelectorAll('.pr-term')), ys=terms.map(function(t){return +t.querySelector('circle').getAttribute('cy');});
      var lower=Math.max.apply(null,ys), body=g.querySelector('rect'), labels=Array.from(g.children).filter(function(e){return e.tagName==='text'&&/^\d+$/.test(e.textContent);});
      var top=Math.max.apply(null,labels.map(function(t){var b=t.getBBox();return b.y+b.height;}))+2;
      var radius=+terms[0].querySelector('circle').getAttribute('r'), writeHeight=10/unitMm;
      var extra=Math.max(0,top+writeHeight+2-(lower-radius));
      body.setAttribute('height',+body.getAttribute('height')+extra);body.setAttribute('fill','#fff');
      Array.from(g.children).filter(function(e){return e.tagName==='line';}).forEach(function(e){e.setAttribute('y2',+e.getAttribute('y2')+extra);});
      terms.forEach(function(t){if(+t.querySelector('circle').getAttribute('cy')===lower)t.setAttribute('transform','translate(0 '+extra+')');});
      Array.from(g.children).filter(function(e){return e.tagName==='text'&&labels.indexOf(e)<0;}).forEach(function(e){
        var dy=e.textContent.indexOf('바깥쪽')===0?(e.textContent.indexOf('▼')>=0?extra:0):extra/2;e.setAttribute('y',+e.getAttribute('y')+dy);
      });
      labels.forEach(function(t){
        var blank=document.createElementNS(svg.namespaceURI,'rect'), x=+t.getAttribute('x'), width=+body.getAttribute('width')/labels.length-4;
        blank.setAttribute('class','ps-tb-write');blank.setAttribute('x',x-width/2);blank.setAttribute('y',top);blank.setAttribute('width',width);blank.setAttribute('height',writeHeight);blank.setAttribute('fill','none');
        g.appendChild(blank);
      });
    });
    // 상자의 윤곽과 이름도 그 안 기구와 함께 이동한다.
    Array.from(svg.children).filter(function(e){return e.tagName==='rect'&&e.hasAttribute('rx');}).forEach(function(e){
      var label=e.nextElementSibling, g=document.createElementNS(svg.namespaceURI,'g');
      svg.insertBefore(g,e);g.appendChild(e);if(label&&label.tagName==='text')g.appendChild(label);nodes.push(g);
    });
    function collectRows() {
      var rows=[];
      nodes.map(function(e){var b=e.getBBox();return {node:e,top:b.y,bottom:b.y+b.height};}).sort(function(a,b){return a.top-b.top;}).forEach(function(e){
        var row=rows[rows.length-1];
        if(!row||e.top>row.bottom){row={top:e.top,bottom:e.bottom,nodes:[]};rows.push(row);}
        row.bottom=Math.max(row.bottom,e.bottom);row.nodes.push(e.node);
      });
      return rows;
    }
    var rows=collectRows(), edge=10, used=rows.reduce(function(sum,r){return sum+r.bottom-r.top;},0);
    var target=18/unitMm, topInset=strips.length?10/unitMm:0;
    // 0103의 배율을 고정한 뒤 줄인 면적 전부를 통로에 돌린다.
    var factor=Math.min(1,(height-2*(margin+edge)-topInset-target*(rows.length-1))/used);
    nodes.forEach(function(e){
      var d=article._psWireDevices[e.dataset.tag], socket=d&&/^socket-(8|12)p$/.test(d.type);
      var shrink=socket?(d.type==='socket-8p'?.82:1):.88;
      var b=e.getBBox(), cx=b.x+b.width/2, cy=b.y+b.height/2;
      var g=document.createElementNS(svg.namespaceURI,'g');
      while(e.firstChild) g.appendChild(e.firstChild);
      // TB5/TB6는 축소 뒤에도 필기칸 높이 10mm를 보존한다.
      if(strips.indexOf(e)>=0){
        var extra=10/unitMm/(factor*shrink)-10/unitMm;
        var blanks=Array.from(g.querySelectorAll('.ps-tb-write')), bottom=+blanks[0].getAttribute('y')+10/unitMm;
        Array.from(g.querySelectorAll('*')).forEach(function(n){
          if(n.classList.contains('ps-tb-write'))n.setAttribute('height',+n.getAttribute('height')+extra);
          else if(n.tagName==='rect')n.setAttribute('height',+n.getAttribute('height')+extra);
          else if(n.tagName==='line'&&n.parentNode===g)n.setAttribute('y2',+n.getAttribute('y2')+extra);
          else if(n.classList.contains('pr-term')&&+n.querySelector('circle').getAttribute('cy')>bottom)n.setAttribute('transform','translate(0 '+(+n.transform.baseVal.consolidate().matrix.f+extra)+')');
          else if(n.tagName==='text'&&+n.getAttribute('y')>bottom)n.setAttribute('y',+n.getAttribute('y')+extra);
        });
      }
      // 소켓 중심을 판 가운데로 조금 모아 좌우 외곽 여백을 확보한다.
      var x=socket?vb.width/2+(cx-vb.width/2)*.92:cx;
      g.setAttribute('transform','translate('+x+' '+cy+') scale('+shrink+') translate('+(-cx)+' '+(-cy)+')');e.appendChild(g);
    });
    rows=collectRows();used=rows.reduce(function(sum,r){return sum+r.bottom-r.top;},0);
    var gap=(height-2*(margin+edge)-topInset-used*factor)/(rows.length-1), y=margin+edge+topInset;
    // 전기는 아래 단자대도 같은 만큼 안쪽으로. 가운데 줄들은 함께 반만 이동해 줄 간격을 보존한다.
    rows.forEach(function(row,index){var rowY=y-(index===0?0:index===rows.length-1?topInset:topInset/2);row.nodes.forEach(function(e){var b=e.getBBox(),cx=b.x+b.width/2;e.setAttribute('transform','translate('+cx+' '+rowY+') scale('+factor+') translate('+(-cx)+' '+(-row.top)+')');});y+=(row.bottom-row.top)*factor+gap;});
    article._psWireLayout={rows:rows.length,gapMm:gap*unitMm,outerGapMm:(gap-topInset/2)*unitMm,deviceScale:factor};
  }
  function intersects(a,b,pad) {
    return Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>-pad && Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>-pad;
  }
  // 핀번호 인쇄 전용. 학생 데이터·다른 종류의 그림 경로에는 들어가지 않는다.
  function preparePin(article) {
    var input=article._psPinInput, L=layoutOnly(input.layout), area=article.querySelector('.ps-circuit');
    var footer=article.querySelector('footer').getBoundingClientRect(), refs=article.querySelector('.ps-references').getBoundingClientRect();
    var height=footer.top-area.getBoundingClientRect().top-refs.height-18;
    area.style.height=height+'px';
    var factor=Math.max(1,height/(L.viewBox[1]*area.clientWidth/L.viewBox[0]));
    L.viewBox=[L.viewBox[0],L.viewBox[1]*factor]; L.coilY*=factor;
    L.drawing.forEach(function(p){
      ['y','y1','y2','h'].forEach(function(k){if(typeof p[k]==='number')p[k]*=factor;});
      if(p.pts)p.pts=p.pts.map(function(x){return [x[0],x[1]*factor];});
    });
    L.main.forEach(function(p){p.slotY=p.slotY.map(function(y){return y*factor;});});
    L.items.forEach(function(p){
      if(typeof p.y==='number')p.y*=factor;
      if(p.rows)p.rows=p.rows.map(function(y){return y*factor;});
      if(p.slots)p.slots=p.slots.map(function(s){return {x:s.x,y:s.y*factor};});
    });
    // SS 표기는 공통선 위에 한 번, 접점에는 기존 A/M을 남긴다.
    var selectors={};
    L.items.filter(function(it){return it.cat==='ss';}).forEach(function(it){(selectors[it.tag]||(selectors[it.tag]=[])).push(it);it.label='';});
    Object.keys(selectors).forEach(function(tag){
      var its=selectors[tag],top=Math.min.apply(null,its.map(function(it){return it.rows[0];}));
      var bars=[];
      L.drawing.forEach(function(p){
        var ps=p.t==='line'?[[p.x1,p.y1],[p.x2,p.y2]]:p.t==='wire'?p.pts:[];
        for(var i=1;i<ps.length;i++)if(ps[i-1][1]===ps[i][1]&&ps[i][1]<top&&its.every(function(it){return it.x>=Math.min(ps[i-1][0],ps[i][0])&&it.x<=Math.max(ps[i-1][0],ps[i][0]);}))bars.push({y1:ps[i][1]});
      });
      var common=bars.length?Math.max.apply(null,bars.map(function(p){return p.y1;})):top-26;
      L.drawing.push({t:'text',x:its.reduce(function(n,it){return n+it.x;},0)/its.length,y:common-22,s:tag,anchor:'middle'});
    });
    // 전선 끝이 다른 전선에 닿는 T자·분기만 표시한다. 단순 교차에는 점을 만들지 않는다.
    var segments=[],ends=[],existing=L.drawing.filter(function(p){return p.t==='dot';});
    L.drawing.forEach(function(p){
      var ps=p.t==='line'&&!p.dash?[[p.x1,p.y1],[p.x2,p.y2]]:p.t==='wire'?p.pts:null;
      if(!ps)return; ps.forEach(function(p){ends.push(p);});
      for(var i=1;i<ps.length;i++)segments.push([ps[i-1],ps[i]]);
    });
    var junctions=[];
    ends.forEach(function(p){
      if(existing.concat(junctions).some(function(q){return Math.hypot(q.x-p[0],q.y-p[1])<.1;}))return;
      var rays={};
      segments.forEach(function(s){
        var a=s[0],b=s[1],dx=b[0]-a[0],dy=b[1]-a[1];
        if(Math.abs(dx*(p[1]-a[1])-dy*(p[0]-a[0]))>.1||p[0]<Math.min(a[0],b[0])-.01||p[0]>Math.max(a[0],b[0])+.01||p[1]<Math.min(a[1],b[1])-.01||p[1]>Math.max(a[1],b[1])+.01)return;
        [a,b].forEach(function(q){if(Math.hypot(q[0]-p[0],q[1]-p[1])>.1)rays[Math.round(Math.atan2(q[1]-p[1],q[0]-p[0])*1000)]=1;});
      });
      if(Object.keys(rays).length>=3)junctions.push({t:'dot',x:p[0],y:p[1]});
    });
    L.drawing=L.drawing.concat(junctions);
    area.outerHTML=circuit({layout:L},'blank');area=article.querySelector('.ps-circuit');area.style.height=height+'px';
    var svg=area.querySelector('svg');svg.querySelectorAll('.dr-hit').forEach(function(e){e.remove();});
    var items=root.PIN_VALIDATE.buildItems({layout:L}), byId={};items.forEach(function(it){byId[it.id]=it;});
    var scale=svg.getScreenCTM().a, mm=scale*25.4/96, width=3.74/mm, bh=3.10/mm, gap=.18/mm;
    var obstacles=Array.from(svg.querySelectorAll('text,circle,ellipse,polygon,path,rect,.dr-item line,.dr-item polyline')).filter(function(e){return !e.classList.contains('ps-blank')&&!(e.tagName==='rect'&&+e.getAttribute('width')===L.viewBox[0]);}).map(function(e){return e.getBBox();});
    var placed=[], blanks=Array.from(svg.querySelectorAll('.ps-blank')),groups={};
    blanks.forEach(function(b){(groups[b.dataset.psItem]||(groups[b.dataset.psItem]=[])).push(b);});
    var cItems=[];
    Object.keys(groups).forEach(function(id){
      var group=groups[id],it=byId[id],pending=[],start=placed.length;
      group.forEach(function(mark){
        var x=+mark.dataset.psX,y=+mark.dataset.psY,choices=[];
        var index=+mark.dataset.psIndex,anchor={x:x,y:y};
        if(it.horiz)anchor={x:index?it.x2:it.x1,y:it.y};
        else if(it.rows)anchor={x:it.x,y:it.rows[index]};
        else if(it.cat==='coil'||it.cat==='lamp')anchor={x:it.x,y:L.coilY+(index?1:-1)*(it.shape==='rect'?22:24)};
        else{
          var terminals=Array.from(svg.querySelectorAll('circle')).filter(function(c){return +c.getAttribute('r')<8;}).map(function(c){return {x:+c.getAttribute('cx'),y:+c.getAttribute('cy')};});
          if(it.cat==='main')Array.from(svg.querySelectorAll('rect:not(.ps-blank)')).forEach(function(r){
            var b=r.getBBox();if(b.width<L.viewBox[0]&&x>=b.x&&x<=b.x+b.width){terminals.push({x:x,y:b.y},{x:x,y:b.y+b.height});}
          });
          terminals.sort(function(a,b){return Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y);});
          if(terminals.length)anchor=terminals[0];
        }
        mark.dataset.psAnchorX=anchor.x;mark.dataset.psAnchorY=anchor.y;
        if(it.cat==='flsE'){x=anchor.x;y=anchor.y;}
        if(it.cat==='coil'||it.cat==='lamp'){x=anchor.x;y=anchor.y+(index?1:-1)*(bh/2+gap);}
        // 핀 주변의 작은 격자만 탐색해 기구에서 멀리 떨어지지 않게 한다.
        for(var dx=-4;dx<=4;dx+=.5)for(var dy=-4;dy<=4;dy+=.5)choices.push([dx/mm,dy/mm]);
        choices.sort(function(a,b){return Math.hypot(a[0],a[1])-Math.hypot(b[0],b[1]);});
        var chosen=null;
        for(var i=0;i<choices.length;i++){
          var d=choices[i],box={x:x-width/2+d[0],y:y-bh/2+d[1],width:width,height:bh};
          if(box.x<1||box.y<1||box.x+width>L.viewBox[0]-1||box.y+bh>L.viewBox[1]-1)continue;
          if(obstacles.concat(placed).some(function(o){return intersects(box,o,gap);}))continue;
          chosen=box;break;
        }
        if(chosen){pending.push([mark,chosen]);placed.push(chosen);}
      });
      if(pending.length!==group.length){
        placed.length=start;pending=[];
        var label=Array.from(svg.querySelectorAll('.dr-item text')).find(function(t){return t.closest('.dr-item').dataset.itemId===id;});
        // 별도 기호가 없는 외부 단자 그룹은 바로 곁 단자대 이름을 기준으로 삼는다.
        if(!label){
          var cx=group.reduce(function(n,b){return n+Number(b.dataset.psX);},0)/group.length,cy=Number(group[0].dataset.psY);
          label=Array.from(svg.querySelectorAll('text')).filter(function(t){return /^TB\d+$/.test(t.textContent);}).sort(function(a,b){var x=a.getBBox(),y=b.getBBox();return Math.hypot(x.x-cx,x.y-cy)-Math.hypot(y.x-cx,y.y-cy);})[0];
        }
        if(label){
          var lb=label.getBBox(),total=group.length*width+(group.length-1)*gap,offsets=[];
          for(var dx=-6;dx<=6;dx+=.5)for(var dy=-6;dy<=6;dy+=.5)offsets.push([dx/mm,dy/mm]);
          offsets.sort(function(a,b){return Math.hypot(a[0],a[1])-Math.hypot(b[0],b[1]);});
          var rest=obstacles.filter(function(o){return !(o.x===lb.x&&o.y===lb.y&&o.width===lb.width&&o.height===lb.height);}).concat(placed);
          for(var k=0;k<offsets.length;k++){
            var d=offsets[k],labelBox={x:lb.x+d[0],y:lb.y+d[1],width:lb.width,height:lb.height};
            var box={x:labelBox.x+lb.width+gap,y:labelBox.y+(lb.height-bh)/2,width:total,height:bh};
            if(labelBox.x<1||box.x+total>L.viewBox[0]-1||Math.min(box.y,labelBox.y)<1||Math.max(box.y+bh,labelBox.y+lb.height)>L.viewBox[1]-1)continue;
            if(rest.some(function(o){return intersects(box,o,gap/2)||intersects(labelBox,o,gap/2);}))continue;
            label.setAttribute('transform','translate('+d[0]+' '+d[1]+')');
            obstacles=rest.concat([labelBox]);
            group.forEach(function(mark,i){var b={x:box.x+i*(width+gap),y:box.y,width:width,height:bh};pending.push([mark,b]);placed.push(b);});cItems.push(id);break;
          }
        }
      }
      if(pending.length!==group.length){group.forEach(function(b){b.classList.add('ps-unplaced');});return;}
      pending.forEach(function(p){var b=p[0],box=p[1];['x','y','width','height'].forEach(function(k){b.setAttribute(k,box[k]);});b.dataset.psMode=cItems.indexOf(id)>=0?'C':'B';});
    });
    article._psPinLayout={factor:factor,cItems:cItems,junctions:junctions,existingDots:existing.length};
  }
  // 종이에 붙인 뒤 mm 배율로 계산한다. 회로 번호나 정답은 배치 판단에 쓰지 않는다.
  function fitMarks(article) {
    var svg=article.querySelector('.ps-circuit svg'); if(!svg) return;
    var marks=Array.from(svg.querySelectorAll('.ps-blank,.ps-number')); if(!marks.length) return;
    var scale=svg.getScreenCTM().a, mm=scale*25.4/96, vb=svg.viewBox.baseVal;
    var textObstacles=Array.from(svg.querySelectorAll('text:not(.ps-reference-pin)')).map(function(e){return e.getBBox();});
    var shapes=Array.from(svg.querySelectorAll('circle,ellipse,polygon,rect')).filter(function(e){return !e.closest('.ps-number')&&!e.classList.contains('ps-blank')&&!(e.tagName==='circle'&&+e.getAttribute('r')<8);}).map(function(e){return e.getBBox();}).filter(function(b){return b.width>0&&b.height>0&&b.width<vb.width*.8&&b.height<vb.height*.8;});
    // 번호 뒤 흰 바탕만 옆 글자를 덮는 경우 먼저 바탕을 글자 크기로 줄인다.
    // 번호 글자 자체가 겹치지 않으면 원래 위치를 유지한다.
    var numberTexts=Array.from(svg.querySelectorAll('.ps-reference-pin'));
    svg.querySelectorAll('.ps-number').forEach(function(g){
      var rect=g.querySelector('rect'),text=g.querySelector('text'),b=rect.getBBox();
      if(textObstacles.concat(numberTexts.filter(function(t){return t!==text;}).map(function(t){return t.getBBox();})).some(function(t){return intersects(b,t,0);})) {
        var t=text.getBBox();rect.setAttribute('x',t.x-.5);rect.setAttribute('y',t.y-.5);rect.setAttribute('width',t.width+1);rect.setAttribute('height',t.height+1);
      }
    });
    var placed=[], ns='http://www.w3.org/2000/svg';
    marks.forEach(function(mark){
      var blank=mark.classList.contains('ps-blank'), x=+mark.dataset.psX,y=+mark.dataset.psY;
      var resized=false;
      if(blank) {var oldWidth=+mark.getAttribute('width'),width=Math.max(oldWidth,3.72/mm);resized=width>oldWidth;mark.setAttribute('width',width);mark.setAttribute('x',x-width/2);}
      var box=(blank?mark:mark.querySelector('text')).getBBox(), chosen=null, gap=(blank?.18:.05)/mm;
      var offsets=[[0,0]], step=box.height+gap;
      for(var ring=1;ring<=8;ring++) {
        offsets.push([0,ring*step],[0,-ring*step],[ring*(box.width+gap),0],[-ring*(box.width+gap),0]);
        for(var side=-1;side<=1;side+=2) for(var vertical=-1;vertical<=1;vertical+=2) offsets.push([side*ring*(box.width+gap)/2,vertical*ring*step]);
      }
      offsets.sort(function(a,b){return Math.hypot(a[0],a[1])-Math.hypot(b[0],b[1]);});
      for(var i=0;i<offsets.length;i++) {
        var dx=offsets[i][0],dy=offsets[i][1], candidate={x:box.x+dx,y:box.y+dy,width:box.width,height:box.height};
        if(candidate.x<1||candidate.y<1||candidate.x+candidate.width>vb.width-1||candidate.y+candidate.height>vb.height-1)continue;
        // 처음부터 제자리에 있던 빈칸은 유지하고, 넓히거나 옮길 때 기구 도형도 피한다.
        if(textObstacles.concat(blank&&(resized||dx||dy)?shapes:[],placed).some(function(b){return intersects(candidate,b,gap);}))continue;
        chosen={box:candidate,dx:dx,dy:dy};break;
      }
      if(!chosen){mark.classList.add('ps-unplaced');return;}
      mark.classList.remove('ps-unplaced');
      if(chosen.dx||chosen.dy) {
        mark.setAttribute('transform','translate('+chosen.dx+' '+chosen.dy+')');
        var line=document.createElementNS(ns,'line'),b=chosen.box;
        line.setAttribute('class','ps-leader');line.setAttribute('x1',x);line.setAttribute('y1',y);
        line.setAttribute('x2',Math.max(b.x,Math.min(x,b.x+b.width)));line.setAttribute('y2',Math.max(b.y,Math.min(y,b.y+b.height)));
        line.setAttribute('stroke','#65747d');line.setAttribute('stroke-width','0.9');svg.insertBefore(line,mark);
      }
      placed.push(chosen.box);
    });
  }
  root.PRINT_SHEET={studentInput:studentInput,render:render,inspect:inspect,prepare:prepare};
})(typeof window==='undefined'?globalThis:window);
