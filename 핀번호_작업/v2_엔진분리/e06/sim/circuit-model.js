/* 승강기기능사 e06 · 동작 보기 모델 (요청 0023, 2026-09-26)
 * 6단자 전동기 Y-Δ 기동(MC1 = Y 성형 접촉기, MC2 = Δ 델타 접촉기) · T 한시 전환 · EOCR 경보는 FR(플리커)로 YL 점멸.
 * 접점 이름(state().contacts 의 키)은 회로 데이터 circuit-e06.js 의 layout.items id 와 같다.
 * → 검증/netlist-check.cjs 가 이 모델의 접점 상태를 데이터의 결선(net)에 넣어 코일 여자가 같은지 대조한다.
 *
 * 제어회로(데이터 net 이름):
 *   H ─EOCR b─ P ─PB0 b─ R
 *   R ─(PB1 a ∥ T 순시 a)─ S ─ T 코일
 *   S ─T 한시 b─ MC2 b ─ MC1 코일(Y)
 *   S ─T 한시 a─ MC1 b ─ MC2 코일(Δ)
 *   R ─MC1 a─ RL,  R ─MC2 a─ GL
 *   H ─EOCR a─ ALM ─ FR 코일,  ALM ─FR b─ YL   (FR 이 간격마다 접점을 바꿔 YL 점멸)
 * FR 은 001 회로 앱과 같은 약속: 여자된 첫 간격은 접점이 그대로(b 닫힘 → YL 켜짐), 다음 간격에 바뀐다.
 */
(function (root) {
  'use strict';
  const INPUTS = ['power', 'start', 'stop', 'trip', 'delay', 'interval'];
  const DEFAULTS = { delay: 5, interval: 1 };
  class CircuitModel {
    constructor() { this.reset(); }
    reset() {
      Object.assign(this, {
        power: false, start: false, stop: false, trip: false,
        delay: DEFAULTS.delay, interval: DEFAULTS.interval,
        timerOn: false, elapsed: 0, done: false, mc1: false, mc2: false,
        fr: false, frElapsed: 0, frOut: false
      });
      this.settle();
    }
    set(key, value) {
      if (!INPUTS.includes(key)) throw new Error('Unknown input: ' + key);
      if (key === 'delay') value = Math.max(1, Math.min(30, Number(value) || DEFAULTS.delay));
      else if (key === 'interval') value = Math.max(0.5, Math.min(3, Number(value) || DEFAULTS.interval));
      else value = !!value;
      this[key] = value; this.settle(); return this.state();
    }
    settle() {
      this.runPower = this.power && !this.trip;          // P: EOCR 운전용 b접점 통과
      this.run = this.runPower && !this.stop;            // R: PB0 b접점 통과 (운전 모선)
      this.alarm = this.power && this.trip;              // ALM: EOCR 경보용 a접점 통과
      for (let pass = 0; pass < 16; pass++) {
        const before = this.key();
        // S 모선: PB1 a 와 T 순시 a(자기유지)가 병렬. T 코일은 S 에 바로 붙어 있다.
        this.timerOn = this.run && (this.start || this.timerOn);
        if (!this.timerOn) this.elapsed = 0;
        this.elapsed = Math.min(this.elapsed, this.delay);
        this.done = this.timerOn && this.elapsed >= this.delay - 1e-8;
        const S = this.timerOn;
        // Y 기동: T 한시 b + MC2 b(인터록). Δ 운전: T 한시 a + MC1 b(인터록).
        this.mc1 = S && !this.done && !this.mc2;
        this.mc2 = S && this.done && !this.mc1;
        // 경보: EOCR a → FR 코일, FR b → YL
        this.fr = this.alarm;
        if (!this.fr) this.frElapsed = 0;
        this.frOut = this.fr && Math.floor((this.frElapsed + 1e-8) / this.interval) % 2 === 1;
        this.yl = this.fr && !this.frOut;
        if (before === this.key()) break;
        if (pass === 15) throw new Error('Relay state did not settle');
      }
    }
    key() { return [this.timerOn, this.done, this.mc1, this.mc2, this.fr, this.frOut, this.yl, this.elapsed].join('|'); }
    // 시간 진행: 타이머 완료·FR 전환 순간마다 멈춰 접점을 다시 계산한다(한 번에 큰 시간을 넣어도 결과가 같다).
    tick(seconds) {
      let remaining = Math.max(0, Number(seconds) || 0);
      for (let events = 0; remaining > 1e-10; events++) {
        if (events > 4096) throw new Error('Timer event limit');
        let dt = remaining;
        if (this.timerOn && !this.done) dt = Math.min(dt, Math.max(0, this.delay - this.elapsed));
        if (this.fr) { const next = (Math.floor((this.frElapsed + 1e-8) / this.interval) + 1) * this.interval; dt = Math.min(dt, Math.max(1e-9, next - this.frElapsed)); }
        if (this.timerOn) this.elapsed = Math.min(this.delay, this.elapsed + dt);
        if (this.fr) this.frElapsed += dt;
        remaining = Math.max(0, remaining - dt); this.settle();
      }
      this.settle(); return this.state();
    }
    state() {
      const s = {};
      for (const k of Object.keys(this)) s[k] = this[k];
      s.contacts = {
        eocrNC: !this.trip, pb0: !this.stop, eocrNO: this.trip, frYL: !this.frOut,
        pb1: this.start, tHold: this.timerOn, tDelayNC: !this.done, mc2Interlock: !this.mc2,
        tDelayNO: this.done, mc1Interlock: !this.mc1, mc1Lamp: this.mc1, mc2Lamp: this.mc2
      };
      s.loads = { EOCR: this.power, FR: this.fr, YL: this.yl, T: this.timerOn, MC1: this.mc1, MC2: this.mc2, RL: this.mc1, GL: this.mc2 };
      s.motors = [{ id: 'M', run: this.mc1 || this.mc2, reverse: false, text: this.mc1 ? 'Y 기동' : this.mc2 ? 'Δ 운전' : '정지' }];
      s.timers = [{ id: 'T', key: 'delay', on: this.timerOn, done: this.done, elapsed: this.elapsed, delay: this.delay }];
      s.flicker = { on: this.fr, out: this.frOut, interval: this.interval };
      return s;
    }
    snapshot() { return JSON.parse(JSON.stringify(this)); }
    restore(data) { Object.assign(this, data); this.settle(); return this.state(); }
  }
  CircuitModel.INPUTS = INPUTS;
  CircuitModel.SETTINGS = ['delay', 'interval'];
  CircuitModel.MOMENTARY = ['start', 'stop'];
  CircuitModel.INTERLOCK = true;   // MC1·MC2 b접점 인터록이 있는 회로(검사에서 동시 투입을 오류로 본다)
  if (typeof module !== 'undefined' && module.exports) module.exports = CircuitModel;
  else root.CircuitModel = CircuitModel;
})(typeof window === 'undefined' ? globalThis : window);
