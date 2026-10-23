/* 승강기기능사 e04 · 동작 보기 모델 (요청 0025)
 * 전동기 1대 3상 정역 · T1 한시 a 로 T2 기동(T2 순시 a 자기유지) → T2 한시 b 로 정회전 정지, MC1 b 거쳐 역회전.
 *   T1 코일은 T2 한시 b 뒤(MC2 b 앞 점)에서 전원을 받는다 → T2 가 끝나면 T1 도 소자된다(원본 7-5쪽, 요청 0025 에서 데이터 수정).
 *   표시등이 앞 회로와 반대: MC1 a → GL, MC2 a → RL.
 * 제어회로(데이터 net 이름):
 *   H ─EOCR b─ P ─PB0 b─ R,  R ─(PB1 a ∥ T1 순시 a)─ S ─T2 한시 b─ M1a
 *   M1a ─ T1 코일,  M1a ─MC2 b─ MC1 코일(정회전)
 *   R ─(T1 한시 a ∥ T2 순시 a)─ T2c ─ T2 코일,  T2c ─MC1 b─ MC2 코일(역회전)
 *   R ─MC1 a─ GL,  R ─MC2 a─ RL,  H ─EOCR a─ YL
 * 접점 이름(state().contacts 의 키)은 회로 데이터 circuit-e04.js 의 layout.items id 와 같다.
 * → 검증/netlist-check.cjs 가 이 모델의 접점 상태를 데이터의 결선(net)에 넣어 코일 여자가 같은지 대조한다.
 */
(function (root) {
  'use strict';
  const INPUTS = ['power', 'start', 'stop', 'trip', 'delay1', 'delay2'];
  const DEFAULTS = { delay1: 3, delay2: 4 };
  class CircuitModel {
    constructor() { this.reset(); }
    reset() {
      Object.assign(this, {
        power: false, start: false, stop: false, trip: false,
        delay1: DEFAULTS.delay1, delay2: DEFAULTS.delay2,
        timerOn1: false, timerOn2: false, elapsed1: 0, elapsed2: 0, done1: false, done2: false,
        mc1: false, mc2: false
      });
      this.settle();
    }
    set(key, value) {
      if (!INPUTS.includes(key)) throw new Error('Unknown input: ' + key);
      if (key.startsWith('delay')) value = Math.max(1, Math.min(30, Number(value) || DEFAULTS[key]));
      else value = !!value;
      this[key] = value; this.settle(); return this.state();
    }
    settle() {
      this.runPower = this.power && !this.trip;          // P: EOCR 운전용 b접점 통과
      this.run = this.runPower && !this.stop;            // R: PB0 b접점 통과 (운전 모선)
      this.alarm = this.power && this.trip;              // EOCR 경보용 a접점 통과
      for (let pass = 0; pass < 16; pass++) {
        const before = this.key();
        const S = this.run && (this.start || this.timerOn1);          // PB1 a ∥ T1 순시 a
        const M1a = S && !this.done2;                                 // T2 한시 b 뒤 점
        this.timerOn1 = M1a;                                          // T1 코일
        this.timer(1);
        this.mc1 = M1a && !this.mc2;                                  // MC2 b → MC1(정회전)
        this.timerOn2 = this.run && (this.done1 || this.timerOn2);    // T1 한시 a ∥ T2 순시 a(자기유지) → T2 코일
        this.timer(2);
        this.mc2 = this.timerOn2 && !this.mc1;                        // MC1 b → MC2(역회전)
        this.yl = this.alarm;                                         // EOCR a → YL
        if (before === this.key()) break;
        if (pass === 15) throw new Error('Relay state did not settle');
      }
    }
    timer(i) {
      if (!this['timerOn' + i]) this['elapsed' + i] = 0;
      this['elapsed' + i] = Math.min(this['elapsed' + i], this['delay' + i]);
      this['done' + i] = this['timerOn' + i] && this['elapsed' + i] >= this['delay' + i] - 1e-8;
    }
    key() { return [this.timerOn1, this.timerOn2, this.done1, this.done2, this.mc1, this.mc2, this.yl, this.elapsed1, this.elapsed2].join('|'); }
    // 시간 진행: 타이머가 설정시간에 닿는 순간마다 멈춰 접점을 다시 계산한다(한 번에 큰 시간을 넣어도 결과가 같다).
    tick(seconds) {
      let remaining = Math.max(0, Number(seconds) || 0);
      for (let events = 0; remaining > 1e-10; events++) {
        if (events > 256) throw new Error('Timer event limit');
        let dt = remaining;
        for (const i of [1, 2]) if (this['timerOn' + i] && !this['done' + i]) dt = Math.min(dt, Math.max(0, this['delay' + i] - this['elapsed' + i]));
        for (const i of [1, 2]) if (this['timerOn' + i]) this['elapsed' + i] = Math.min(this['delay' + i], this['elapsed' + i] + dt);
        remaining = Math.max(0, remaining - dt); this.settle();
      }
      this.settle(); return this.state();
    }
    state() {
      const s = {};
      for (const k of Object.keys(this)) s[k] = this[k];
      s.contacts = {
        eocrNC: !this.trip,
        pb0: !this.stop,
        eocrNO: this.trip,
        mc2Lamp: this.mc2,
        mc1Lamp: this.mc1,
        pb1: this.start,
        t1Hold: this.timerOn1,
        t2DelayNC: !this.done2,
        mc2Interlock: !this.mc2,
        t1DelayNO: this.done1,
        t2Hold: this.timerOn2,
        mc1Interlock: !this.mc1
      };
      s.loads = { EOCR: this.power, YL: this.yl, RL: this.mc2, GL: this.mc1, MC1: this.mc1, T1: this.timerOn1, MC2: this.mc2, T2: this.timerOn2 };
      s.motors = [{ id: 'M', run: this.mc1 || this.mc2, reverse: this.mc2, text: this.mc1 ? '정회전' : this.mc2 ? '역회전' : '정지' }];
      s.timers = [
        { id: 'T1', key: 'delay1', on: this.timerOn1, done: this.done1, elapsed: this.elapsed1, delay: this.delay1 },
        { id: 'T2', key: 'delay2', on: this.timerOn2, done: this.done2, elapsed: this.elapsed2, delay: this.delay2 }
      ];
      return s;
    }
    snapshot() { return JSON.parse(JSON.stringify(this)); }
    restore(data) { Object.assign(this, data); this.settle(); return this.state(); }
  }
  CircuitModel.INPUTS = INPUTS;
  CircuitModel.SETTINGS = ['delay1', 'delay2'];
  CircuitModel.MOMENTARY = ['start', 'stop'];
  CircuitModel.INTERLOCK = true;   // MC1·MC2 b접점 인터록이 있는 회로(검사에서 동시 투입을 오류로 본다)
  if (typeof module !== 'undefined' && module.exports) module.exports = CircuitModel;
  else root.CircuitModel = CircuitModel;
})(typeof window === 'undefined' ? globalThis : window);
