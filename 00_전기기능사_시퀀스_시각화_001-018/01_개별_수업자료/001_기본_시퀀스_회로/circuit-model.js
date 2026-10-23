/* 001 시뮬레이션 모델 — 얇은 틀 (요청 0091). 동작 규칙은 circuit-spec-001.js, 공통 계산은 sim-core.js.
 * 전역 이름(CircuitModel)·메서드·필드 이름은 바뀌지 않았다. */
(function (root) {
  'use strict';
  const Core = root.SimCore || (typeof require !== 'undefined' ? require('./sim-core.js') : null);
  const spec = root.CircuitSpec001 || (typeof require !== 'undefined' ? require('./circuit-spec-001.js') : null);
  const CircuitModel = Core.createModel(spec);
  if (typeof module !== 'undefined' && module.exports) module.exports = CircuitModel;
  else root.CircuitModel = CircuitModel;
})(typeof window === 'undefined' ? globalThis : window);
