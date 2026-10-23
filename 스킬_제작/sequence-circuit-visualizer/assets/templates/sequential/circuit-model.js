(function (root) {
  'use strict';
  class CircuitModel {
    constructor() { this.reset(); }
    reset() {
      this.power = false; this.mode = 'M'; this.sensor = false;
      this.start = false; this.stop = false; this.trip = false;
      this.timerOn = false; this.elapsed = 0; this.delay = 5;
      this.alarmElapsed = 0; this.interval = 1; this.settle();
    }
    set(key, value) {
      if (!['power', 'mode', 'sensor', 'start', 'stop', 'trip', 'delay', 'interval'].includes(key)) throw new Error('Unknown input: ' + key);
      if (key === 'mode' && value !== this.mode) { this.timerOn = false; this.elapsed = 0; }
      if (key === 'delay') value = Math.max(1, Math.min(30, Number(value) || 5));
      if (key === 'interval') value = Math.max(.5, Math.min(3, Number(value) || 1));
      this[key] = value; this.settle(); return this.state();
    }
    settle() {
      this.runPower = this.power && !this.trip;
      this.fls = this.runPower && this.mode === 'A';
      this.x = this.fls && this.sensor;
      const manual = this.runPower && this.mode === 'M' && !this.stop;
      this.timerOn = manual && !this.x && (this.start || this.timerOn);
      if (!this.timerOn) this.elapsed = 0;
      this.done = this.timerOn && this.elapsed >= this.delay - 1e-8;
      this.mc1 = this.runPower && (this.x || (manual && (this.start || this.timerOn)));
      this.mc2 = this.mc1 && this.done;
      this.fr = this.power && this.trip;
      if (!this.fr) this.alarmElapsed = 0;
      this.bz = this.fr && Math.floor((this.alarmElapsed + 1e-8) / this.interval) % 2 === 0;
      this.yl = this.fr && !this.bz;
    }
    tick(seconds) {
      const dt = Math.max(0, Number(seconds) || 0);
      if (this.timerOn) this.elapsed = Math.min(this.delay, this.elapsed + dt);
      if (this.fr) this.alarmElapsed += dt;
      this.settle(); return this.state();
    }
    state() {
      const state = {};
      for (const key of Object.keys(this)) state[key] = this[key];
      state.contacts = {
        eocrNC: !this.trip, eocrNO: this.trip, ssA: this.mode === 'A', ssM: this.mode === 'M',
        flsContact: this.fls && this.sensor, pb0: !this.stop, pb1: this.start,
        tHold: this.timerOn, tDelay: this.done, xNO: this.x, xNC: !this.x,
        mc1Aux: this.mc1, mc2Aux: this.mc2,
        frYL: this.yl, frBZ: !this.yl
      };
      state.loads = {EOCR: this.power, FLS: this.fls, X: this.x, T: this.timerOn,
        MC1: this.mc1, MC2: this.mc2, RL: this.mc1, GL: this.mc2, FR: this.fr, YL: this.yl, BZ: this.bz};
      return state;
    }
    snapshot() { return JSON.parse(JSON.stringify(this)); }
    restore(data) { Object.assign(this, data); this.settle(); return this.state(); }
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = CircuitModel;
  else root.CircuitModel = CircuitModel;
})(typeof window === 'undefined' ? globalThis : window);
