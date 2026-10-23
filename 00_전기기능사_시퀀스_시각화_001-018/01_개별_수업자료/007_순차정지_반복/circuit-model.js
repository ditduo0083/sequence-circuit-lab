(function(root){
  'use strict';
  class CircuitModel{
    constructor(){this.reset();}
    reset(){
      this.power=false;this.mode='M';this.sensor=false;this.start=false;this.stop=false;this.trip=false;
      this.x=false;this.fr=false;this.alternatingElapsed=0;this.interval=5;this.timerOn=false;this.elapsed=0;this.delay=2;this.settle();
    }
    set(key,value){
      if(!['power','mode','sensor','start','stop','trip','delay','interval'].includes(key))throw new Error('Unknown input: '+key);
      if(key==='mode'&&value!==this.mode){this.x=false;this.alternatingElapsed=0;}
      if(key==='delay'){
        this.delay=Math.max(.5,Math.min(29.5,Number(value)||2));
        if(this.interval<=this.delay){this.interval=this.delay+.5;this.alternatingElapsed=0;}
        this.settle();return this.state();
      }
      if(key==='interval'){value=Math.max(this.delay+.5,Math.min(30,Number(value)||5));if(value!==this.interval)this.alternatingElapsed=0;}
      this[key]=value;this.settle();return this.state();
    }
    settle(){
      this.runPower=this.power&&!this.trip;this.fls=this.runPower&&this.mode==='A';
      this.x=this.runPower&&((this.fls&&this.sensor)||(this.mode==='M'&&!this.stop&&(this.start||this.x)));
      this.fr=this.x;if(!this.fr)this.alternatingElapsed=0;
      let cycle=this.alternatingElapsed%(this.interval*2);
      // Normalize rounding at both FR boundaries, including the start of a new cycle.
      if(this.interval*2-cycle<1e-8)cycle=0;
      if(Math.abs(cycle-this.interval)<1e-8)cycle=this.interval;
      this.phase=cycle>=this.interval?1:0;
      this.phaseElapsed=this.phase===0?cycle:Math.max(0,cycle-this.interval);
      this.timerOn=this.x&&this.phase===0;
      this.elapsed=this.timerOn?Math.min(this.delay,this.phaseElapsed):0;
      this.done=this.timerOn&&this.elapsed>=this.delay-1e-8;
      this.mc1=this.timerOn&&!this.done;this.mc2=this.timerOn&&this.done;
      this.yl=this.power&&this.trip;this.bz=this.yl;
    }
    tick(seconds){const dt=Math.max(0,Number(seconds)||0);if(this.fr)this.alternatingElapsed+=dt;this.settle();return this.state();}
    state(){
      const s={...this};s.remaining=this.fr?this.interval-this.phaseElapsed:0;if(s.remaining<1e-8&&this.fr)s.remaining=this.interval;
      s.contacts={eocrNC:!this.trip,eocrNO:this.trip,ssA:this.mode==='A',ssM:this.mode==='M',flsContact:this.fls&&this.sensor,
        pb0:!this.stop,pb1:this.start,xHold:this.x,xNO:this.x,frGate:this.phase===0,tMC1:!this.done,tMC2:this.done,mc1Aux:this.mc1,mc2Aux:this.mc2};
      s.loads={EOCR:this.power,FLS:this.fls,X:this.x,T:this.timerOn,FR:this.fr,MC1:this.mc1,MC2:this.mc2,RL:this.mc1,GL:this.mc2,YL:this.yl,BZ:this.bz};return s;
    }
    snapshot(){return JSON.parse(JSON.stringify(this));}
    restore(snapshot){Object.assign(this,snapshot);this.settle();return this.state();}
  }
  if(typeof module!=='undefined'&&module.exports)module.exports=CircuitModel;else root.CircuitModel=CircuitModel;
})(typeof window==='undefined'?globalThis:window);
