/* 001 기본 시퀀스 회로 — 동작 규칙 데이터 (요청 0091). 규칙 없는 계산은 sim-core.js 에 있다.
 * 식은 원래 circuit-model.js 의 settle()·state() 식을 그대로 옮겼다(this → s). 순서가 곧 동작이다.
 *   runPower → FLS → X → (수동 운전 조건) → T 자기유지 → T 경과·완료 → MC1 → MC2 → FR → 경보 경과 → BZ → YL */
(function (root) {
  'use strict';
  const Core = root.SimCore || (typeof require !== 'undefined' ? require('./sim-core.js') : null);
  const spec = {
    id: '001',
    // 키 순서가 state()·snapshot() 결과 순서다. settle()이 나중에 만드는 신호는 steps 순서대로 뒤에 붙는다.
    initial: {
      power: false, mode: 'M', sensor: false, start: false, stop: false, trip: false,
      timerOn: false, elapsed: 0, delay: 5, alarmElapsed: 0, interval: 1
    },
    inputs: {
      power: {},
      mode: { resetTimersOnChange: ['T'] },
      sensor: {}, start: {}, stop: {}, trip: {},
      delay: { range: { min: 1, max: 30, fallback: 5 } },
      interval: { range: { min: .5, max: 3, fallback: 1 } }
    },
    timers: { T: { on: 'timerOn', elapsed: 'elapsed', delay: 'delay', done: 'done' } },
    flickers: { F: { active: 'fr', elapsed: 'alarmElapsed', interval: 'interval' } },
    steps: [
      { set: 'runPower', expr: s => s.power && !s.trip },
      { set: 'fls', expr: s => s.runPower && s.mode === 'A' },
      { set: 'x', expr: s => s.fls && s.sensor },
      { local: 'manual', expr: s => s.runPower && s.mode === 'M' && !s.stop },
      { set: 'timerOn', expr: (s, l) => l.manual && !s.x && (s.start || s.timerOn) },   // 자기유지: 이전 timerOn 을 읽는다
      { timer: 'T' },
      { set: 'mc1', expr: (s, l) => s.runPower && (s.x || (l.manual && (s.start || s.timerOn))) },
      { set: 'mc2', expr: s => s.mc1 && s.done },
      { set: 'fr', expr: s => s.power && s.trip },
      { flicker: 'F' },
      { set: 'bz', expr: s => s.fr && Core.flickerEven(s.alarmElapsed, s.interval) },
      { set: 'yl', expr: s => s.fr && !s.bz }
    ],
    // 접점·부하 표: 이름은 circuit-diagram.js 의 접점 id·부하 id 와 같다.
    contacts: {
      eocrNC: s => !s.trip, eocrNO: s => s.trip, ssA: s => s.mode === 'A', ssM: s => s.mode === 'M',
      flsContact: s => s.fls && s.sensor, pb0: s => !s.stop, pb1: s => s.start,
      tHold: s => s.timerOn, tDelay: s => s.done, xNO: s => s.x, xNC: s => !s.x,
      mc1Aux: s => s.mc1, mc2Aux: s => s.mc2,
      frYL: s => s.yl, frBZ: s => !s.yl
    },
    loads: {
      EOCR: s => s.power, FLS: s => s.fls, X: s => s.x, T: s => s.timerOn,
      MC1: s => s.mc1, MC2: s => s.mc2, RL: s => s.mc1, GL: s => s.mc2, FR: s => s.fr, YL: s => s.yl, BZ: s => s.bz
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = spec;
  else root.CircuitSpec001 = spec;
})(typeof window === 'undefined' ? globalThis : window);
