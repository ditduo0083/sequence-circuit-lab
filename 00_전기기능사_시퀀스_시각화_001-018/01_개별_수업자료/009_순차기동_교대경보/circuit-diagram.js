(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  class CircuitDiagram {
    constructor(svg) {
      this.svg = svg; this.nodes = {}; this.edges = []; this.loads = []; this.parts = []; this.mainParts = [];
      this.build(); this.selected = '';
      const content=document.createElementNS(NS,'g');
      while(svg.firstChild)content.appendChild(svg.firstChild);
      svg.appendChild(content);
      const defs=this.el('defs',{},svg),clip=this.el('clipPath',{id:'circuit-crop',clipPathUnits:'userSpaceOnUse'},defs);
      this.crop=this.el('rect',{x:0,y:0,width:1670,height:720},clip);
      content.setAttribute('clip-path','url(#circuit-crop)');
    }
    el(tag, attributes, parent = this.svg, text) {
      const e = document.createElementNS(NS, tag);
      for (const [k,v] of Object.entries(attributes || {})) e.setAttribute(k,v);
      if (text !== undefined) e.textContent = text;
      parent.appendChild(e); return e;
    }
    text(x,y,label,cls='',parent=this.svg,anchor='start') { return this.el('text',{x,y,class:cls,'text-anchor':anchor},parent,label); }
    node(id,x,y) { this.nodes[id] = [x,y]; return id; }
    pathBetween(a,b,via=[]) { return ['M',...this.nodes[a], ...via.flatMap(p=>['L',...p]), 'L',...this.nodes[b]].join(' '); }
    wire(a,b,via=[]) {
      const e = this.el('path',{d:this.pathBetween(a,b,via),class:'wire'});
      this.edges.push({a,b,el:e,type:'wire'}); return e;
    }
    contactSymbol(parent,x1,y1,x2,y2,device,kind) {
      // Local terminals are vertical. Rotating the entire symbol keeps the
      // horizontal EOCR contact and its cross consistent with the source.
      const horizontal=y1===y2, span=horizontal?x2-x1:y2-y1;
      const glyph=this.el('g',{class:'contact-symbol',transform:`translate(${x1} ${y1})${horizontal?' rotate(-90)':''}`},parent);
      const links=this.el('path',{class:'symbol-line contact-links',d:`M-5 0H0 M-5 ${span}H0`},glyph);
      const moving=this.el('g',{class:'contact-moving'},glyph);
      const blade=this.el('path',{class:'symbol-line contact-bar',d:`M0 -4V${span+4}`},moving);
      const mid=span/2;
      let symbol='relay';
      if(/^PB[0-2]$/.test(device)){
        symbol='pushbutton';
        this.el('path',{class:'symbol-line symbol-feature',d:`M0 ${mid}H11`},moving);
      }else if(/^LS[12]$/.test(device)){
        symbol='limit-switch';
        this.el('path',{class:'symbol-line symbol-feature',d:`M0 -4H7V${span+4}H0`},moving);
      }else if(device==='SS'){
        symbol='selector';
        this.el('path',{class:'symbol-line symbol-feature',d:`M0 ${mid}H12 M4 ${mid+5}L10 ${mid}`},moving);
      }else if(device==='EOCR'){
        symbol='overload';
        this.el('path',{class:'symbol-line symbol-feature',d:`M-4 ${mid-4}L4 ${mid+4} M-4 ${mid+4}L4 ${mid-4}`},moving);
      }else if(device==='FR'){
        symbol='flicker';
        this.el('path',{class:'symbol-line symbol-feature symbol-filled',d:`M-6 ${mid}L0 ${mid-4}L6 ${mid}L0 ${mid+4}Z`},moving);
      }else if(/^T[12]?$/.test(device)&&kind.includes('한시')){
        symbol='timer-delayed';
        this.el('path',{class:'symbol-line symbol-feature',d:`M0 ${mid-4}L7 ${mid}L0 ${mid+4}Z`},moving);
      }else if(/^T[12]?$/.test(device))symbol='timer-instant';
      for(const cy of [0,span])this.el('circle',{cx:0,cy,r:3.5,class:'contact-dot'},glyph);
      parent.setAttribute('data-symbol',symbol);
      return {moving,links,blade,span};
    }
    setContactClosed(symbol,closed) {
      // A closed bar touches the left sides of both fixed terminals;
      // an open bar sits to their right, as in the supplied drawing.
      symbol.moving.setAttribute('transform',`translate(${closed?-5:12} 0)`);
      symbol.links.setAttribute('visibility',closed?'visible':'hidden');
    }
    contact(id,device,a,b,label,kind='a',side='right') {
      const [x1,y1] = this.nodes[a], [x2,y2] = this.nodes[b]; const horizontal = y1 === y2;
      const g = this.el('g',{class:'contact','data-device':device,'data-contact':id});
      const cx=(x1+x2)/2, cy=(y1+y2)/2;
      this.el('rect',{x:horizontal?x1-6:x1-15,y:horizontal?y1-19:y1-9,width:horizontal?x2-x1+12:40,height:horizontal?38:y2-y1+18,rx:7,class:'device-selection'},g);
      this.el('title',{},g,label+' '+kind+'접점');
      const symbol=this.contactSymbol(g,x1,y1,x2,y2,device,kind);
      const tx=horizontal?cx:(side==='left'?x1-22:x1+28), ty=horizontal?y1-21:device==='SS'?y1-12:cy-3;
      const visibleLabel=/^T[12]?$/.test(device)?label+(kind.includes('한시')?' 한시':' 순시'):label;
      this.text(tx,ty,visibleLabel,'',g,horizontal?'middle':side==='left'?'end':'start');
      const stateLabel = this.text(tx,horizontal?y1+24:device==='SS'?y2+20:cy+17,'','contact-state',g,horizontal?'middle':side==='left'?'end':'start');
      this.edges.push({a,b,id,el:g,type:'contact',device,symbol,stateLabel,x1,y1,x2,y2,horizontal,kind});
      this.parts.push(g);
    }
    load(id,device,positive,negative,label,kind='coil') {
      const [x,top] = this.nodes[positive], [,bottom] = this.nodes[negative], cy=(top+bottom)/2;
      const g=this.el('g',{class:'load '+(kind==='lamp'?'lamp-'+id:''),'data-device':device,'data-load':id});
      this.el('rect',{x:x-33,y:top-8,width:66,height:bottom-top+16,rx:8,class:'device-selection'},g);
      if(kind==='buzzer') this.el('rect',{x:x-22,y:top,width:44,height:bottom-top,class:'device-shape'},g);
      else this.el('circle',{cx:x,cy,r:(bottom-top)/2,class:'device-shape'},g);
      this.text(x,cy+6,label,'',g,'middle');
      this.el('title',{},g,label+(kind==='coil'?' 코일':kind==='lamp'?' 표시등':' 부저'));
      this.loads.push({id,positive,negative,el:g}); this.parts.push(g);
    }
    mainWire(d,section,phase=0) {
      const el=this.el('path',{d,class:'wire'}); this.mainParts.push({el,section,phase}); return el;
    }
    mainContact(x,y,device,section,phase=-1) {
      const g=this.el('g',{class:'contact','data-device':device,'data-symbol':device==='MCCB'?'breaker':'contactor-main'});
      this.el('rect',{x:x-21,y:y-8,width:42,height:56,rx:6,class:'device-selection'},g);
      const blade=this.el('path',{class:'symbol-line main-contact-blade'},g);
      if(device!=='MCCB')this.el('path',{class:'symbol-line fixed-contact-tip',d:`M${x+3} ${y+1}h5v6`},g);
      this.el('circle',{cx:x,cy:y,r:3.5,class:'contact-dot'},g);
      this.el('circle',{cx:x,cy:y+40,r:3.5,class:'contact-dot'},g);
      this.mainParts.push({el:g,blade,x,y,section,phase,device,contact:true});this.parts.push(g);
    }
    earth(x,y) { this.el('path',{d:`M${x} ${y}v12m-15 0h30m-23 6h16m-11 6h6`,class:'earth'}); }
    build() {
      this.text(35,38,'주회로','section-title');this.text(420,38,'제어회로','section-title');
      this.text(35,62,'3P3W AC 220V','small-text');this.text(420,62,'제어 전원 L1–L3 · AC 220V','small-text');
      const phases=[55,95,135];
      phases.forEach((x,i)=>{
        this.text(x,89,'L'+(i+1),'',this.svg,'middle');
        this.mainWire(`M${x} 97V123`,'source',i);this.mainContact(x,123,'MCCB','power',i);
        this.mainWire(`M${x} 163V${[190,190,208][i]}`,'main-feed',i);
        this.mainWire(`M${x} ${[190,190,208][i]}V${[315,300,285][i]}`,'main-upper',i);
        this.mainWire(`M${x} ${[315,300,285][i]}V390`,'load1-upper',i);
        this.mainWire(`M${x} ${[315,300,285][i]}H${225+i*40}V390`,'load2-upper',i);
        this.mainContact(x,390,'MC1','mc1');this.mainContact(225+i*40,390,'MC2','mc2');
        this.mainWire(`M${x} 430V487L${75+i*20} 511`,'load1',i);
        this.mainWire(`M${225+i*40} 430V487L${245+i*20} 511`,'load2',i);
        this.text(x,470,['U1','V1','W1'][i],'small-text',this.svg,'middle');
        this.text(225+i*40,470,['U2','V2','W2'][i],'small-text',this.svg,'middle');
      });
      this.text(14,115,'MCCB','small-text',this.svg,'start');
      this.el('path',{d:'M55 144H135',class:'mechanical'});
      this.el('path',{d:'M55 410H135 M225 410H305',class:'mechanical'});
      this.text(40,369,'MC1');this.text(217,369,'MC2');
      const sensor=this.el('g',{'data-device':'EOCR'});this.parts.push(sensor);
      this.el('rect',{x:31,y:234,width:128,height:54,rx:7,class:'device-selection'},sensor);
      this.el('rect',{x:38,y:242,width:114,height:37,fill:'#f6f9f8',stroke:'#869a9d','stroke-width':2},sensor);
      this.text(95,267,'EOCR','',sensor,'middle');
      this.mainWire('M55 190H318','control-feed');this.mainWire('M344 190H400V100H435','control-feed');
      this.mainWire('M135 208H346','control-feed');this.mainWire('M372 208H388V605H435','control-feed');
      [[318,190],[346,208]].forEach(([x,y])=>{this.el('rect',{x,y:y-7,width:26,height:14,fill:'white',stroke:'#829798','stroke-width':1.5});this.el('path',{d:`M${x} ${y+6}l26 -12`,stroke:'#829798','stroke-width':1.5});});
      this.text(316,170,'FUSE','small-text');
      for(const [x,id,key] of [[95,'M1','mc1'],[265,'M2','mc2']]){
        const g=this.el('g',{'data-device':key==='mc1'?'MC1':'MC2',class:'load','data-motor':id});
        this.el('rect',{x:x-41,y:501,width:82,height:78,rx:10,class:'device-selection'},g);
        this.el('circle',{cx:x,cy:540,r:34,class:'device-shape'},g);this.text(x,546,id,'',g,'middle');
        this.mainParts.push({el:g,section:key,motor:true});this.parts.push(g);
        this.text(x,592,'전동기 '+(id==='M1'?'1':'2'),'small-text',this.svg,'middle');
      }
      this.text(175,89,'PE','',this.svg,'middle');this.el('path',{d:'M175 98V625 M129 540H175 M299 540H350V625',class:'earth'});this.earth(175,625);this.earth(350,625);

      const n=(id,x,y)=>this.node(id,x,y),w=(a,b,via)=>this.wire(a,b,via);
      n('H',435,100);n('alarmTap',510,100);n('eocrIn',545,100);n('run',590,100);
      w('H','alarmTap');w('alarmTap','eocrIn');this.contact('eocrNC','EOCR','eocrIn','run','EOCR','b');
      const tops=[['xTop',810],['aTop',910],['mTop',1190],['tTop',1370],['rlTop',1480],['glTop',1580]],bottoms=[435,510,610,700,910,1010,1190,1270,1370,1480,1580];
      let last='run';for(const [id,x]of tops){n(id,x,100);w(last,id);last=id;}
      for(let i=0;i<bottoms.length;i++){n('r'+bottoms[i],bottoms[i],605);if(i)w('r'+bottoms[i-1],'r'+bottoms[i]);}
      const coil=(id,x,device=id,kind='coil')=>{n(id+'P',x,522);n(id+'N',x,568);this.load(id,device,id+'P',id+'N',id,kind);w(id+'N','r'+x);};
      const c=(id,device,x,y,kind='a',label=device)=>{n(id+'In',x,y);n(id+'Out',x,y+40);this.contact(id,device,id+'In',id+'Out',label,kind);};
      const dot=id=>{const [cx,cy]=this.nodes[id];this.el('circle',{cx,cy,r:3.8,class:'junction'});};
      coil('EOCR',435);w('H','EOCRP');

      c('eocrNO','EOCR',510,335);n('alarmBus',510,425);w('alarmTap','eocrNOIn');w('eocrNOOut','alarmBus');
      coil('FR',510);w('alarmBus','FRP');
      for(const [id,x,kind]of [['YL',610,'a'],['BZ',700,'b']]){c('fr'+id,'FR',x,465,kind);w('alarmBus','fr'+id+'In',[[x,425]]);coil(id,x,'FR',id==='BZ'?'buzzer':'lamp');w('fr'+id+'Out',id+'P');}
      c('xNO','X',810,155);w('xTop','xNOIn');
      c('ssA','SS',910,155,'a','SS · A');c('ssM','SS',1190,155,'a','SS · M');w('aTop','ssAIn');w('mTop','ssMIn');
      this.selectorLink=this.el('path',{class:'mechanical selector-link'});
      n('autoBus',910,285);w('ssAOut','autoBus');coil('FLS',1010);w('autoBus','FLSP',[[1010,285]]);
      c('flsContact','FLS',910,335);w('autoBus','flsContactIn');n('motor1Bus',910,425);w('flsContactOut','motor1Bus');w('xNOOut','motor1Bus',[[810,425]]);coil('MC1',910);w('motor1Bus','MC1P');
      c('pb0','PB0',1190,220,'b');w('ssMOut','pb0In');n('manualBus',1190,285);w('pb0Out','manualBus');
      c('pb1','PB1',1190,335);c('xHold','X',1270,335);w('manualBus','pb1In');w('manualBus','xHoldIn',[[1270,285]]);
      n('manualCommon',1190,425);w('pb1Out','manualCommon');w('xHoldOut','manualCommon',[[1270,425]]);
      coil('X',1190);coil('T',1270);w('manualCommon','XP');w('manualCommon','TP',[[1190,470],[1270,470]]);
      c('tMC2','T',1370,155,'한시 a');w('tTop','tMC2In');coil('MC2',1370);w('tMC2Out','MC2P');
      for(const [id,x,top,device]of [['RL',1480,'rlTop','MC1'],['GL',1580,'glTop','MC2']]){c(device.toLowerCase()+'Aux',device,x,155);w(top,device.toLowerCase()+'AuxIn');coil(id,x,device,'lamp');w(device.toLowerCase()+'AuxOut',id+'P');}
      ['H','alarmTap','xTop','aTop','mTop','tTop','rlTop','alarmBus','autoBus','motor1Bus','manualBus','manualCommon'].forEach(dot);
      this.el('path',{d:'M1023 560H1045V653 M1030 550H1065V653 M1035 540H1085V653',class:'earth'});
      this.el('rect',{x:1034,y:642,width:62,height:24,fill:'white',stroke:'#bac6c6'});
      [1045,1065,1085].forEach((x,i)=>{this.el('circle',{cx:x,cy:653,r:3.5,fill:'white',stroke:'#78948d'});this.text(x,684,'E'+(i+1),'small-text',this.svg,'middle');});
      this.text(1010,660,'TB4','small-text',this.svg,'end');this.text(930,707,'FLS 전극 입력 · 감지 / 해제로 조작','small-text');
      this.el('path',{d:'M1032 536H1099V541',class:'earth'});this.earth(1099,541);
      this.text(28,698,'PE 보호접지 · 정상 통전 경로에서 제외','small-text');
    }
    analyze(state) {
      const adjacency={};for(const id of Object.keys(this.nodes))adjacency[id]=[];
      for(const edge of this.edges){if(edge.type==='wire'||state.contacts[edge.id]){adjacency[edge.a].push([edge.b,edge]);adjacency[edge.b].push([edge.a,edge]);}}
      const reach=(start)=>{const seen=new Set([start]),q=[start];while(q.length){const a=q.pop();for(const [b] of adjacency[a])if(!seen.has(b)){seen.add(b);q.push(b);}}return seen;};
      const high=state.power?reach('H'):new Set(),low=reach('r435'),flow=new Set(),calculatedLoads={};
      const trace=(from,to)=>{
        const visited=new Set();
        function walk(a){if(a===to)return true;visited.add(a);let found=false;for(const [b,edge] of adjacency[a])if(!visited.has(b)&&walk(b)){flow.add(edge);found=true;}visited.delete(a);return found;}
        walk(from);
      };
      for(const load of this.loads){const on=high.has(load.positive)&&low.has(load.negative);calculatedLoads[load.id]=on;if(on){trace('H',load.positive);trace('r435',load.negative);}}
      return {high,flow,calculatedLoads};
    }
    update(state) {
      const {high,flow,calculatedLoads}=this.analyze(state);this.calculatedLoads=calculatedLoads;
      for(const edge of this.edges){
        const live=flow.has(edge),voltage=high.has(edge.a)||high.has(edge.b);
        edge.el.classList.toggle('is-live',live);edge.el.classList.toggle('has-voltage',voltage);
        if(edge.type==='contact'){
          const closed=state.contacts[edge.id];
          edge.el.setAttribute('data-closed',closed);edge.el.setAttribute('aria-label',edge.id+' '+(closed?'닫힘':'열림'));
          this.setContactClosed(edge.symbol,closed);
          edge.stateLabel.textContent=edge.device==='SS'?(closed?'선택됨':'선택 해제'):edge.kind.replace(/(?:순시|한시) /,'')+' · '+(closed?'닫힘':'열림');
        }
      }
      if(this.selectorLink)this.selectorLink.setAttribute('d',`M${this.nodes.ssAIn[0]+(state.contacts.ssA?-5:12)} ${this.nodes.ssAIn[1]+20}H${this.nodes.ssMIn[0]+(state.contacts.ssM?-5:12)}`);
      for(const load of this.loads){load.el.classList.toggle('on',calculatedLoads[load.id]);load.el.setAttribute('data-on',calculatedLoads[load.id]);}
      for(const p of this.mainParts){
        let on=false,voltage=false;
        if(p.section==='mc1'||p.section==='load1') on=state.mc1;
        else if(p.section==='mc2'||p.section==='load2')on=state.mc2;
        else if(p.section==='load1-upper'){on=state.mc1;voltage=state.power;}
        else if(p.section==='load2-upper'){on=state.mc2;voltage=state.power;}
        else if(p.section==='main-upper'){on=state.mc1||state.mc2;voltage=state.power;}
        else if(p.section==='control-feed')on=state.power;
        else {on=state.power&&(state.mc1||state.mc2||p.phase!==1);voltage=state.power;}
        if(p.contact){
          const closed=p.section==='power'?state.power:state[p.section];
          p.el.setAttribute('data-closed',closed);
          p.el.setAttribute('aria-label',p.device+' 주접점 '+(closed?'닫힘':'열림'));
          p.blade.setAttribute('d',p.device==='MCCB'
            ?`M${p.x} ${p.y+40}C${p.x+18} ${p.y+32} ${p.x+18} ${p.y+8} ${p.x+(closed?0:7)} ${p.y+(closed?0:3)}`
            :`M${p.x} ${p.y+40}L${p.x+(closed?0:16)} ${p.y}`);
          if(p.section!=='power')on=closed;
        }
        p.el.classList.toggle('has-voltage',voltage);p.el.classList.toggle(p.motor?'on':'is-live',on);
      }
      this.select(this.selected);
    }
    select(device){this.selected=device;for(const part of this.parts)part.classList.toggle('selected-device',!!device&&part.dataset.device===device);}
    view(mode){
      const boxes={all:'0 0 1670 720',control:'400 45 1270 665',operation:'770 85 900 545',alarm:'400 45 385 585'};
      const box=boxes[mode]||boxes.all;this.svg.setAttribute('viewBox',box);this.svg.parentElement.dataset.view=mode;
      box.split(' ').forEach((value,i)=>this.crop.setAttribute(['x','y','width','height'][i],value));

    }
  }
  window.CircuitDiagram=CircuitDiagram;
})();
