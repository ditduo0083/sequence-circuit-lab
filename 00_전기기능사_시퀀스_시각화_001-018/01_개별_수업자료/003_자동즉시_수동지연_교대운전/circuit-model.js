(function(root){
  'use strict';
  class CircuitModel{
    constructor(){this.reset();}
    reset(){
      this.power=false;this.mode='M';this.sensor=false;this.start=false;this.stop=false;this.trip=false;
      this.x=false;this.timerOn=false;this.elapsed=0;this.delay=5;this.fr=false;this.alternatingElapsed=0;this.interval=2;
      this.settle();
    }
    set(key,value){
      if(!['power','mode','sensor','start','stop','trip','delay','interval'].includes(key))throw new Error('Unknown input: '+key);
      if(key==='mode'&&value!==this.mode){this.timerOn=false;this.x=false;this.elapsed=0;this.alternatingElapsed=0;}
      if(key==='delay')value=Math.max(1,Math.min(30,Number(value)||5));
      if(key==='interval'){value=Math.max(.5,Math.min(10,Number(value)||2));if(value!==this.interval)this.alternatingElapsed=0;}
      this[key]=value;this.settle();return this.state();
    }
    settle(){
      this.runPower=this.power&&!this.trip;
      this.fls=this.runPower&&this.mode==='A';
      const automatic=this.fls&&this.sensor;
      const manual=this.runPower&&this.mode==='M'&&!this.stop;
      this.timerOn=manual&&(this.start||this.timerOn);
      if(!this.timerOn)this.elapsed=0;
      this.elapsed=Math.min(this.elapsed,this.delay);
      this.done=this.timerOn&&this.elapsed>=this.delay-1e-8;
      this.x=this.runPower&&this.mode==='M'&&this.done;
      this.fr=this.runPower&&(automatic||this.x);
      if(!this.fr)this.alternatingElapsed=0;
      this.phase=Math.floor((this.alternatingElapsed+1e-8)/this.interval)%2;
      this.mc1=this.fr&&this.phase===0;
      this.mc2=this.fr&&this.phase===1;
      this.yl=this.power&&this.trip;this.bz=this.yl;
    }
    tick(seconds){
      const dt=Math.max(0,Number(seconds)||0),wasFR=this.fr;
      const untilTimer=this.timerOn?Math.max(0,this.delay-this.elapsed):Infinity;
      if(this.timerOn)this.elapsed=Math.min(this.delay,this.elapsed+dt);
      if(wasFR)this.alternatingElapsed+=dt;
      else if(this.timerOn&&dt>=untilTimer)this.alternatingElapsed+=Math.max(0,dt-untilTimer);
      this.settle();return this.state();
    }
    state(){
      const s={...this};
      s.phaseElapsed=this.fr?this.alternatingElapsed%this.interval:0;
      if(s.phaseElapsed<this.interval&&this.interval-s.phaseElapsed<1e-8)s.phaseElapsed=0;
      s.remaining=this.fr?this.interval-s.phaseElapsed:0;
      s.contacts={eocrNC:!this.trip,eocrNO:this.trip,ssA:this.mode==='A',ssM:this.mode==='M',
        flsContact:this.fls&&this.sensor,pb0:!this.stop,pb1:this.start,tHold:this.timerOn,xFeed:this.x,tDelay:this.done,
        frMC1:this.phase===0,frMC2:this.phase===1,mc1Aux:this.mc1,mc2Aux:this.mc2};
      s.loads={EOCR:this.power,YL:this.yl,BZ:this.bz,FLS:this.fls,X:this.x,T:this.timerOn,FR:this.fr,
        MC1:this.mc1,MC2:this.mc2,RL:this.mc1,GL:this.mc2};
      return s;
    }
    snapshot(){return JSON.parse(JSON.stringify(this));}
    restore(snapshot){Object.assign(this,snapshot);this.settle();return this.state();}
  }
  if(typeof module!=='undefined'&&module.exports)module.exports=CircuitModel;else root.CircuitModel=CircuitModel;
})(typeof window==='undefined'?globalThis:window);
