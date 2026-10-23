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
      this.crop=this.el('rect',{x:0,y:0,width:1760,height:720},clip);
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
      n('stopIn',630,100);n('stopOut',680,100);w('run','stopIn');this.contact('pb0','PB0','stopIn','stopOut','PB0','b');
      const tops=[['branch1',780],['branch2',1090],['wl1Top',1370],['wl2Top',1460],['rlTop',1570],['glTop',1670]],bottoms=[435,510,780,860,960,1090,1170,1270,1370,1570,1670];
      let last='stopOut';for(const [id,x]of tops){n(id,x,100);w(last,id);last=id;}
      for(let i=0;i<bottoms.length;i++){n('r'+bottoms[i],bottoms[i],605);if(i)w('r'+bottoms[i-1],'r'+bottoms[i]);}
      const coil=(id,x,device=id,kind='coil')=>{n(id+'P',x,522);n(id+'N',x,568);this.load(id,device,id+'P',id+'N',id,kind);w(id+'N','r'+x);};
      const c=(id,device,x,y,kind='a',label=device)=>{n(id+'In',x,y);n(id+'Out',x,y+40);this.contact(id,device,id+'In',id+'Out',label,kind);};
      const dot=id=>{const [cx,cy]=this.nodes[id];this.el('circle',{cx,cy,r:3.8,class:'junction'});};
      coil('EOCR',435);w('H','EOCRP');c('eocrNO','EOCR',510,465);w('alarmTap','eocrNOIn');coil('YL',510,'EOCR','lamp');w('eocrNOOut','YLP');

      for(const [i,x]of [[1,780],[2,1090]]){
        c('pb'+i,'PB'+i,x,155);c('t'+i+'Hold','T'+i,x+80,155,'한시 a');w('branch'+i,'pb'+i+'In');w('branch'+i,'t'+i+'HoldIn',[[x+80,100]]);
        n('hold'+i,x,280);w('pb'+i+'Out','hold'+i);w('t'+i+'HoldOut','hold'+i,[[x+80,280]]);
        n('fork'+i,x,400);w('hold'+i,'fork'+i);coil('X'+i,x);w('fork'+i,'X'+i+'P');
        c('ls'+i,'LS'+i,x+80,465);w('fork'+i,'ls'+i+'In',[[x+80,400]]);coil('MC'+i,x+80);w('ls'+i+'Out','MC'+i+'P');
        const opposite=3-i;c('x'+opposite+'Gate','X'+opposite,x+180,465,'b');w('fork'+i,'x'+opposite+'GateIn',[[x+180,400]]);coil('T'+i,x+180);w('x'+opposite+'GateOut','T'+i+'P');
      }
      n('wlBus',1370,340);coil('WL',1370,'WL','lamp');w('wlBus','WLP');
      for(const [i,x]of [[1,1370],[2,1460]]){c('x'+i+'WL','X'+i,x,155);w('wl'+i+'Top','x'+i+'WLIn');c('mc'+i+'NC','MC'+i,x,250,'b');w('x'+i+'WLOut','mc'+i+'NCIn');w('mc'+i+'NCOut','wlBus',i===2?[[1460,340]]:[]);}
      for(const [id,x,top,device]of [['RL',1570,'rlTop','MC1'],['GL',1670,'glTop','MC2']]){c(device.toLowerCase()+'Aux',device,x,155);w(top,device.toLowerCase()+'AuxIn');coil(id,x,device,'lamp');w(device.toLowerCase()+'AuxOut',id+'P');}
      ['H','alarmTap','branch1','branch2','wl1Top','wl2Top','rlTop','hold1','hold2','fork1','fork2','wlBus'].forEach(dot);
      this.text(28,698,'PE 보호접지 · 정상 통전 경로에서 제외','small-text');this.text(820,664,'T 완료 후 자기유지 · LS 감지는 모터 즉시 기동','small-text');
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
      const boxes={all:'0 0 1760 720',control:'400 45 1360 665',operation:'610 60 1150 560',alarm:'400 45 215 580'};
      const box=boxes[mode]||boxes.all;this.svg.setAttribute('viewBox',box);this.svg.parentElement.dataset.view=mode;
      box.split(' ').forEach((value,i)=>this.crop.setAttribute(['x','y','width','height'][i],value));

    }
  }
  window.CircuitDiagram=CircuitDiagram;
})();
