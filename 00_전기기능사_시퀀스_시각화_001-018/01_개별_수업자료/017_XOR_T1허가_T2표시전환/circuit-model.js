(function(root){
 'use strict';
 class CircuitModel{
  constructor(){this.reset();}
  reset(){
   this.power=false;this.start1=false;this.start2=false;this.stop=false;this.ls1=false;this.ls2=false;this.trip=false;
   this.x1=false;this.x2=false;this.timerOn1=false;this.timerOn2=false;this.mc1=false;this.mc2=false;
   this.elapsed1=0;this.elapsed2=0;this.done1=false;this.done2=false;this.delay1=3;this.delay2=5;this.settle();
  }
  set(key,value){
   if(!['power','start1','start2','stop','ls1','ls2','trip','delay1','delay2'].includes(key))throw new Error('Unknown input: '+key);
   if(key==='delay1'||key==='delay2')value=Math.max(1,Math.min(30,Number(value)||(key==='delay1'?3:5)));
   this[key]=value;this.settle();return this.state();
  }
  settle(){
   this.runPower=this.power&&!this.trip&&!this.stop;
   for(let pass=0;pass<16;pass++){
    const previous=[this.x1,this.x2,this.timerOn1,this.timerOn2,this.mc1,this.mc2,this.done1,this.done2,this.elapsed1,this.elapsed2].join('|');
    this.x1=this.runPower&&this.ls1;
    this.x2=this.runPower&&this.ls2;
    const xor=(this.x1&&!this.x2)||(!this.x1&&this.x2);this.sensorXor=xor;
    this.timerOn1=this.runPower&&xor&&(this.start1||this.timerOn1);
    this.mc1=this.timerOn1;
    this.timerOn2=this.runPower&&this.done1&&(this.start2||this.timerOn2);
    this.mc2=this.timerOn2&&!this.done2;
    this.wl=this.timerOn2&&this.done2;
    for(const i of [1,2]){
     if(!this['timerOn'+i])this['elapsed'+i]=0;
     this['elapsed'+i]=Math.min(this['elapsed'+i],this['delay'+i]);
     this['done'+i]=this['timerOn'+i]&&this['elapsed'+i]>=this['delay'+i]-1e-8;
    }
    if(previous===[this.x1,this.x2,this.timerOn1,this.timerOn2,this.mc1,this.mc2,this.done1,this.done2,this.elapsed1,this.elapsed2].join('|'))break;
    if(pass===15)throw new Error('Relay state did not settle');
   }
   this.yl=this.power&&this.trip;
  }
  tick(seconds){
   let remaining=Math.max(0,Number(seconds)||0);
   const eventLimit=Math.ceil(remaining/Math.min(this.delay1,this.delay2))*4+16;
   for(let events=0;remaining>1e-10;events++){
    if(events>eventLimit)throw new Error('Timer event limit');
    let dt=remaining;
    for(const i of [1,2])if(this['timerOn'+i]&&!this['done'+i])dt=Math.min(dt,Math.max(0,this['delay'+i]-this['elapsed'+i]));
    if(dt<=1e-10){for(const i of [1,2])if(this['timerOn'+i]&&this['delay'+i]-this['elapsed'+i]<1e-8)this['elapsed'+i]=this['delay'+i];this.settle();continue;}
    for(const i of [1,2])if(this['timerOn'+i])this['elapsed'+i]=Math.min(this['delay'+i],this['elapsed'+i]+dt);
    remaining=Math.max(0,remaining-dt);this.settle();
   }
   this.settle();return this.state();
  }
  state(){
   const s={...this};
   s.sensorXor=(this.x1&&!this.x2)||(!this.x1&&this.x2);
   s.contacts={
    eocrNC:!this.trip,eocrNO:this.trip,pb0:!this.stop,ls1:this.ls1,ls2:this.ls2,
    pb1:this.start1,t1Hold:this.timerOn1,x1A:this.x1,x2B:!this.x2,x1B:!this.x1,x2A:this.x2,
    mc1Aux:this.mc1,pb2:this.start2,t2Hold:this.timerOn2,t1Enable:this.done1,
    t2Motor:!this.done2,t2Lamp:this.done2,mc2Aux:this.mc2
   };
   s.loads={EOCR:this.power,X1:this.x1,X2:this.x2,MC1:this.mc1,T1:this.timerOn1,RL:this.mc1,MC2:this.mc2,WL:this.wl,T2:this.timerOn2,GL:this.mc2,YL:this.yl};
   return s;
  }
  snapshot(){return JSON.parse(JSON.stringify(this));}
  restore(snapshot){Object.assign(this,snapshot);this.settle();return this.state();}
 }
 if(typeof module!=='undefined'&&module.exports)module.exports=CircuitModel;else root.CircuitModel=CircuitModel;
})(typeof window==='undefined'?globalThis:window);
