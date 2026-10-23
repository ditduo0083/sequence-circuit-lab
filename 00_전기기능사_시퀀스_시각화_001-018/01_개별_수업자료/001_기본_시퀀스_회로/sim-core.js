/* 시퀀스 시뮬레이션 모델 코어 (요청 0091) — 001의 circuit-model.js에서 회로 규칙 없는 부분만 추출.
 * 규칙(신호 식·접점/부하 표)은 spec 객체가 가진다. 이 파일에는 회로 이름이 없고 DOM·난수·시계를 쓰지 않는다.
 * spec 모양: initial · inputs · timers · flickers · steps · contacts · loads (circuit-spec-001.js 참고).
 * 식은 JS 함수다. 문자열 해석기·eval은 없다. */
(function (root) {
  'use strict';
  const EPSILON = 1e-8;

  // 플리커(점멸) 위상: 경과시간이 interval 의 짝수 번째 구간이면 true.
  function flickerEven(elapsed, interval) { return Math.floor((elapsed + EPSILON) / interval) % 2 === 0; }

  function createModel(spec) {
    const timers = spec.timers || {}, flickers = spec.flickers || {};
    class CircuitModel {
      constructor() { this.reset(); }
      reset() { Object.assign(this, spec.initial); this.settle(); }
      set(key, value) {
        if (!Object.prototype.hasOwnProperty.call(spec.inputs, key)) throw new Error('Unknown input: ' + key);
        const input = spec.inputs[key];
        if (input.resetTimersOnChange && value !== this[key]) {
          for (const id of input.resetTimersOnChange) { this[timers[id].on] = false; this[timers[id].elapsed] = 0; }
        }
        if (input.range) value = Math.max(input.range.min, Math.min(input.range.max, Number(value) || input.range.fallback));
        this[key] = value; this.settle(); return this.state();
      }
      settle() {
        const local = {};
        for (const step of spec.steps) {
          if (step.timer) {
            const t = timers[step.timer];
            if (!this[t.on]) this[t.elapsed] = 0;
            this[t.done] = this[t.on] && this[t.elapsed] >= this[t.delay] - EPSILON;
          } else if (step.flicker) {
            const f = flickers[step.flicker];
            if (!this[f.active]) this[f.elapsed] = 0;
          } else if (step.local) local[step.local] = step.expr(this, local);
          else this[step.set] = step.expr(this, local);
        }
      }
      tick(seconds) {
        const dt = Math.max(0, Number(seconds) || 0);
        for (const t of Object.values(timers)) if (this[t.on]) this[t.elapsed] = Math.min(this[t.delay], this[t.elapsed] + dt);
        for (const f of Object.values(flickers)) if (this[f.active]) this[f.elapsed] += dt;
        this.settle(); return this.state();
      }
      state() {
        const state = {};
        for (const key of Object.keys(this)) state[key] = this[key];
        state.contacts = {};
        for (const [name, expr] of Object.entries(spec.contacts)) state.contacts[name] = expr(this);
        state.loads = {};
        for (const [name, expr] of Object.entries(spec.loads)) state.loads[name] = expr(this);
        return state;
      }
      snapshot() { return JSON.parse(JSON.stringify(this)); }
      restore(data) { Object.assign(this, data); this.settle(); return this.state(); }
    }
    return CircuitModel;
  }

  const SimCore = { EPSILON, flickerEven, createModel };
  if (typeof module !== 'undefined' && module.exports) module.exports = SimCore;
  else root.SimCore = SimCore;
})(typeof window === 'undefined' ? globalThis : window);
