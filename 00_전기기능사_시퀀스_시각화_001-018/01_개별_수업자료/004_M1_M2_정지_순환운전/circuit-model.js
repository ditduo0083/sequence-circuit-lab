(function(root){
  'use strict';
  class CircuitModel{
    constructor(){this.reset();}
    reset(){
      this.power=false;this.mode='M';this.sensor=false;this.start=false;this.stop=false;this.trip=false;
      this.x=false;this.fr=false;this.frElapsed=0;this.interval=5;this.timerOn=false;this.elapsed=0;this.delay=2;
      this.settle();
    }
    set(key,value){
      if(!['power','mode','sensor','start','stop','trip','delay','interval'].includes(key))throw new Error('Unknown input: '+key);
      if(key==='mode'&&value!==this.mode){this.x=false;this.frElapsed=0;}
      if(key==='delay'){
        value=Math.max(.5,Math.min(29.5,Number(value)||2));this.delay=value;
        if(this.interval<=this.delay){this.interval=Math.min(30,this.delay+.5);this.frElapsed=0;}
        this.settle();return this.state();
      }
      if(key==='interval'){
        value=Math.max(this.delay+.5,Math.min(30,Number(value)||5));
        if(value!==this.interval)this.frElapsed=0;
      }
      this[key]=value;this.settle();return this.state();
    }
    settle(){
      this.runPower=this.power&&!this.trip;
      this.fls=this.runPower&&this.mode==='A';
      const automatic=this.fls&&this.sensor;
      const manual=this.runPower&&this.mode==='M'&&!this.stop;
      this.x=this.runPower&&(automatic||(manual&&(this.start||this.x)));
      this.fr=this.x;
      if(!this.fr)this.frElapsed=0;
      const cycle=this.interval*2,cyclePos=this.fr?this.frElapsed%cycle:0;
      this.phase=cyclePos>=this.interval-1e-8?1:0;
      this.phaseElapsed=this.phase===0?cyclePos:Math.max(0,cyclePos-this.interval);
      this.timerOn=this.fr&&this.phase===1;
      this.elapsed=this.timerOn?Math.min(this.delay,this.phaseElapsed):0;
      this.done=this.timerOn&&this.elapsed>=this.delay-1e-8;
      this.mc1=this.fr&&this.phase===0;
      this.mc2=this.fr&&this.phase===1&&!this.done;
      this.yl=this.power&&this.trip;this.bz=this.yl;
    }
    tick(seconds){
      const dt=Math.max(0,Number(seconds)||0);
      if(this.fr)this.frElapsed+=dt;
      this.settle();return this.state();
    }
    state(){
      const s={...this};
      s.remaining=this.fr?this.interval-this.phaseElapsed:0;
      if(s.remaining<1e-8)s.remaining=this.interval;
      s.contacts={eocrNC:!this.trip,eocrNO:this.trip,ssA:this.mode==='A',ssM:this.mode==='M',
        flsContact:this.fls&&this.sensor,pb0:!this.stop,pb1:this.start,xHold:this.x,xEnable:this.x,
        frMC1:this.phase===0,frM2T:this.fr&&this.phase===1,tDelayNC:!this.done,
        mc1Aux:this.mc1,mc2Aux:this.mc2};
      s.loads={EOCR:this.power,YL:this.yl,BZ:this.bz,FLS:this.fls,X:this.x,FR:this.fr,T:this.timerOn,
        MC1:this.mc1,MC2:this.mc2,RL:this.mc1,GL:this.mc2};
      return s;
    }
    snapshot(){return JSON.parse(JSON.stringify(this));}
    restore(snapshot){Object.assign(this,snapshot);this.settle();return this.state();}
  }
  if(typeof module!=='undefined'&&module.exports)module.exports=CircuitModel;else root.CircuitModel=CircuitModel;
})(typeof window==='undefined'?globalThis:window);
