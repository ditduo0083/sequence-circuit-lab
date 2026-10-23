(function(root){
 'use strict';
 class CircuitModel{
  constructor(){this.reset();}
  reset(){
   this.power=false;this.start1=false;this.start2=false;this.stop=false;
   this.ls1=false;this.ls2=false;this.trip=false;
   this.x1=false;this.x2=false;this.elapsed1=0;this.elapsed2=0;
   this.done1=false;this.done2=false;this.timerOn1=false;this.timerOn2=false;
   this.delay1=3;this.delay2=5;this.settle();
  }
  set(key,value){
   if(!['power','start1','start2','stop','ls1','ls2','trip','delay1','delay2'].includes(key))throw new Error('Unknown input: '+key);
   if(key==='delay1'||key==='delay2')value=Math.max(1,Math.min(30,Number(value)||(key==='delay1'?3:5)));
   this[key]=value;this.settle();return this.state();
  }
  settle(){
   this.runPower=this.power&&!this.trip&&!this.stop;
   for(let pass=0;pass<16;pass++){
    const previous=[this.x1,this.x2,this.timerOn1,this.timerOn2,this.done1,this.done2,this.elapsed1,this.elapsed2].join('|');
    // PB1·X1 a·LS1 a 병렬 뒤 T2 한시 b가 X1을 공급한다.
    this.x1=this.runPower&&!this.done2&&(this.start1||this.ls1||this.x1);
    // PB2·X2 a·T1 한시 a 병렬은 X2와 MC2를 즉시 자기유지한다.
    this.x2=this.runPower&&(this.start2||this.x2||this.done1);
    this.mc1=this.runPower&&this.x1&&this.ls2;
    this.mc2=this.runPower&&this.x2;
    // MC1 b는 T1을 차단하고, X1 a는 X2 계통에서 T2를 허가한다.
    this.timerOn1=this.runPower&&this.x1&&!this.mc1;
    this.timerOn2=this.runPower&&this.x2&&this.x1;
    for(const i of [1,2]){
     if(!this['timerOn'+i])this['elapsed'+i]=0;
     this['elapsed'+i]=Math.min(this['elapsed'+i],this['delay'+i]);
     this['done'+i]=this['timerOn'+i]&&this['elapsed'+i]>=this['delay'+i]-1e-8;
    }
    if(previous===[this.x1,this.x2,this.timerOn1,this.timerOn2,this.done1,this.done2,this.elapsed1,this.elapsed2].join('|'))break;
    if(pass===15)throw new Error('Relay state did not settle');
   }
   this.wl=this.timerOn1||this.timerOn2;
   this.yl=this.power&&this.trip;
  }
  tick(seconds){
   let remaining=Math.max(0,Number(seconds)||0);
   // 접점 전환 시점에서 시간을 나누어 새로 여자된 T2에는 남은 시간만 준다.
   for(let events=0;remaining>1e-10;events++){
    if(events>10)throw new Error('Timer event limit');
    let dt=remaining;
    for(const i of [1,2])if(this['timerOn'+i]&&!this['done'+i])dt=Math.min(dt,Math.max(0,this['delay'+i]-this['elapsed'+i]));
    if(dt<=1e-10){
     for(const i of [1,2])if(this['timerOn'+i]&&this['delay'+i]-this['elapsed'+i]<1e-8)this['elapsed'+i]=this['delay'+i];
     this.settle();continue;
    }
    for(const i of [1,2])if(this['timerOn'+i])this['elapsed'+i]=Math.min(this['delay'+i],this['elapsed'+i]+dt);
    remaining=Math.max(0,remaining-dt);this.settle();
   }
   this.settle();return this.state();
  }
  state(){
   const s={...this};
   s.contacts={
    eocrNC:!this.trip,eocrNO:this.trip,pb0:!this.stop,
    pb1:this.start1,pb2:this.start2,ls1:this.ls1,ls2:this.ls2,
    x1Hold:this.x1,x2Hold:this.x2,t2StopX1:!this.done2,
    t1StartX2:this.done1,mc1Gate:!this.mc1,x1GateT2:this.x1,
    t1WL:this.timerOn1,t2WL:this.timerOn2,mc1Aux:this.mc1,mc2Aux:this.mc2
   };
   s.loads={EOCR:this.power,X1:this.x1,T1:this.timerOn1,MC1:this.mc1,X2:this.x2,T2:this.timerOn2,MC2:this.mc2,WL:this.wl,RL:this.mc1,GL:this.mc2,YL:this.yl};
   return s;
  }
  snapshot(){return JSON.parse(JSON.stringify(this));}
  restore(snapshot){Object.assign(this,snapshot);this.settle();return this.state();}
 }
 if(typeof module!=='undefined'&&module.exports)module.exports=CircuitModel;else root.CircuitModel=CircuitModel;
})(typeof window==='undefined'?globalThis:window);
