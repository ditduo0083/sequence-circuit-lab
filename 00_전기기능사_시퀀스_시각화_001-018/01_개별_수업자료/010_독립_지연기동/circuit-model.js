(function(root){
  'use strict';
  class CircuitModel{
    constructor(){this.reset();}
    reset(){this.power=false;this.start1=false;this.start2=false;this.stop=false;this.ls1=false;this.ls2=false;this.trip=false;this.x1=false;this.x2=false;this.elapsed1=0;this.elapsed2=0;this.delay1=3;this.delay2=5;this.settle();}
    set(key,value){
      if(!['power','start1','start2','stop','ls1','ls2','trip','delay1','delay2'].includes(key))throw new Error('Unknown input: '+key);
      if(key==='delay1'||key==='delay2')value=Math.max(1,Math.min(30,Number(value)||3));
      this[key]=value;this.settle();return this.state();
    }
    settle(){
      this.runPower=this.power&&!this.trip&&!this.stop;
      this.x1=this.runPower&&(this.start1||this.x1);this.x2=this.runPower&&(this.start2||this.x2);
      for(const i of [1,2]){
        this['timerOn'+i]=this['x'+i]&&this['ls'+i];
        if(!this['timerOn'+i])this['elapsed'+i]=0;
        this['elapsed'+i]=Math.min(this['elapsed'+i],this['delay'+i]);
        this['done'+i]=this['timerOn'+i]&&this['elapsed'+i]>=this['delay'+i]-1e-8;
        this['mc'+i]=this['x'+i]&&this['done'+i];
      }
      this.wl=this.runPower&&((this.x1&&!this.mc1)||(this.x2&&!this.mc2));this.yl=this.power&&this.trip;
    }
    tick(seconds){const dt=Math.max(0,Number(seconds)||0);for(const i of [1,2])if(this['timerOn'+i])this['elapsed'+i]=Math.min(this['delay'+i],this['elapsed'+i]+dt);this.settle();return this.state();}
    state(){const s={...this};s.contacts={eocrNC:!this.trip,eocrNO:this.trip,pb0:!this.stop,pb1:this.start1,pb2:this.start2,x1Hold:this.x1,x2Hold:this.x2,ls1:this.ls1,ls2:this.ls2,t1MC1:this.done1,t2MC2:this.done2,x1WL:this.x1,x2WL:this.x2,mc1NC:!this.mc1,mc2NC:!this.mc2,mc1Aux:this.mc1,mc2Aux:this.mc2};
      s.loads={EOCR:this.power,X1:this.x1,T1:this.timerOn1,MC1:this.mc1,X2:this.x2,T2:this.timerOn2,MC2:this.mc2,WL:this.wl,RL:this.mc1,GL:this.mc2,YL:this.yl};return s;}
    snapshot(){return JSON.parse(JSON.stringify(this));}
    restore(snapshot){Object.assign(this,snapshot);this.settle();return this.state();}
  }
  if(typeof module!=='undefined'&&module.exports)module.exports=CircuitModel;else root.CircuitModel=CircuitModel;
})(typeof window==='undefined'?globalThis:window);
