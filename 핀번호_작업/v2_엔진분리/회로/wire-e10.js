/*
 * 결선하기 — 승강기기능사 e10 결선 데이터 (2026-09-26, 요청 0028 프로토타입)
 * ------------------------------------------------------------------
 * 원본: 승강기기능사-10-A4, 2022-02-28.pdf 4쪽(기구 배치도, 척도 NS)·5쪽(회로도)·요구사항
 *       원본 그림은 넣지 않는다. 기구 순서와 대략의 비율만 읽어 400×260 판에 옮겼고, 그림은 panel-render.js 가 새로 그린다.
 * 승강기 과제: 단자대 번호매기기 단계가 없다(배관 작업 없음, 결정 D0007). 기구에 바로 결선한다.
 *   - 도면의 MCCB는 생략하고 직결한다(요구사항) → omit.MCCB
 *   - 전원(L1 L2 L3)과 부하(U V W)는 단자대로 대체한다(요구사항) → TB1(전원), TB2(출력). Y-Δ 회로는 TB3(X Y Z)까지(작성자 답변)
 *   - 주회로 2.5㎟ 적색(압착단자), 보조회로 1.5㎟ 청색. 한 단자에 3가닥 이상 금지. 기구와 기구 사이 배선 금지
 * 점 ID: 'e10/태그:핀' — 핀번호 적기(circuit-e10.js answerKey)와 같은 번호. 새로 더한 이름은 TB1(전원)·TB2(출력)뿐(수업에서 부르는 이름).
 * 검사: node 검사/결선검사.cjs e10
 */
(function (root) {
  'use strict';
  var W = root.PIN_WIRING = root.PIN_WIRING || {};
  W['e10'] = {
    id: 'e10', circuit: 'e10',
    title: '승강기기능사 10 · 결선하기',
    source: { doc: '승강기기능사-10-A4, 2022-02-28.pdf', panelPage: 4, circuitPage: 5 },
    omit: { MCCB: '도면의 MCCB는 생략하고 직결(요구사항)' },

    wireTypes: {
      main: { kind: 'main', label: '주회로', size: '2.5㎟', color: '적색', ink: '#d62828' },
      aux: { kind: 'aux', label: '보조회로', size: '1.5㎟', color: '청색', ink: '#1f5fd1' }
    },

    /* 기구 배치도(4쪽): 위 YL/RL/GL·TB1, 가운데 FR·T·MC1·MC2·EOCR, 아래 PB1/PB0·TB2(U1/V1/W1)·TB3(U2/V2/W2) */
    panel: {
      size: [400, 260],
      lanes: [87, 171],
      gutters: [8, 392],
      decor: [
        { x: 20, y: 22, w: 174, h: 54, label: '램프 상자' },
        { x: 20, y: 185, w: 103, h: 43, label: '푸시버튼 상자' }
      ],
      devices: {
        YL: { type: 'lamp', x: 27, y: 28, w: 40, h: 40 },
        RL: { type: 'lamp', x: 81, y: 28, w: 40, h: 40 },
        GL: { type: 'lamp', x: 136, y: 28, w: 40, h: 40 },
        TB1: { type: 'tb', pins: ['L1', 'L2', 'L3'], place: 'top', x: 312, y: 36, w: 66, h: 29, label: 'TB1(전원)' },
        FR: { type: 'socket-8p', x: 21, y: 98, w: 54, h: 59 },
        T: { type: 'socket-8p', x: 97, y: 98, w: 54, h: 59 },
        MC1: { type: 'socket-12p', x: 173, y: 98, w: 54, h: 59 },
        MC2: { type: 'socket-12p', x: 249, y: 98, w: 54, h: 59 },
        EOCR: { type: 'socket-12p', x: 325, y: 98, w: 54, h: 59 },
        PB1: { type: 'pb', kind: 'a', x: 27, y: 188, w: 40, h: 38, termSide: 'top' },
        PB0: { type: 'pb', kind: 'b', x: 76, y: 188, w: 40, h: 38, termSide: 'top' },
        TB2: { type: 'tb', pins: ['U1', 'V1', 'W1'], place: 'bottom', x: 222, y: 187, w: 66, h: 29, label: 'TB2(M1)' },
        TB3: { type: 'tb', pins: ['U2', 'V2', 'W2'], place: 'bottom', x: 312, y: 187, w: 66, h: 29, label: 'TB3(M2)' }
      }
    },

    circuitPoints: {
      'e10/TB1:L1': [70, 59], 'e10/TB1:L2': [115, 59], 'e10/TB1:L3': [160, 59],
      'e10/TB2:U1': [70, 535], 'e10/TB2:V1': [115, 535], 'e10/TB2:W1': [160, 535],
      'e10/TB3:U2': [230, 535], 'e10/TB3:V2': [275, 535], 'e10/TB3:W2': [320, 535]
    },

    nets: [
      /* ---------- 주회로 (전원 쪽 두 구간에는 제어 전원 보조선이 함께 붙는다) ---------- */
      { id: 'H', circuit: 'H', group: 'main', label: 'TB1 L1 = EOCR 1 = 제어 전원 H', wire: 'main',
        chains: [['e10/TB1:L1', 'e10/EOCR:1'], { pts: ['e10/EOCR:1', 'e10/EOCR:6', 'e10/EOCR:10'], wire: 'aux' }],
        note: 'MCCB가 없으므로(생략) TB1 L1이 EOCR 1번으로 바로 가요(적색). 제어 전원은 EOCR 1번에서 보조선(청색)으로 따서 EOCR 전원(6)과 트립 접점 공통(10)으로 보내요. EOCR 1번에는 주회로선 1가닥 + 보조선 1가닥.' },
      { id: 'L2', group: 'main', label: 'TB1 L2 = EOCR 2', wire: 'main', chain: ['e10/TB1:L2', 'e10/EOCR:2'] },
      { id: 'N', circuit: 'N', group: 'main', label: 'TB1 L3 = EOCR 3 = 공통 귀선 N', wire: 'main',
        chains: [['e10/TB1:L3', 'e10/EOCR:3'], { pts: ['e10/EOCR:3', 'e10/EOCR:12', 'e10/FR:7', 'e10/T:7', 'e10/MC1:12', 'e10/MC2:12', 'e10/YL:2', 'e10/GL:2', 'e10/RL:2'], wire: 'aux' }],
        note: 'TB1 L3은 EOCR 3번으로 가고(적색), 제어회로의 공통 귀선 N은 EOCR 3번에서 보조선(청색)으로 따서 코일·램프의 아래쪽 단자를 차례로 이어요.' },
      { id: 'L1b', group: 'main', label: 'EOCR 7 = MC1 1 = MC2 1', wire: 'main', chain: ['e10/EOCR:7', 'e10/MC1:1', 'e10/MC2:1'] },
      { id: 'L2b', group: 'main', label: 'EOCR 8 = MC1 2 = MC2 2', wire: 'main', chain: ['e10/EOCR:8', 'e10/MC1:2', 'e10/MC2:2'] },
      { id: 'L3b', group: 'main', label: 'EOCR 9 = MC1 3 = MC2 3', wire: 'main', chain: ['e10/EOCR:9', 'e10/MC1:3', 'e10/MC2:3'] },
      { id: 'U1', group: 'main', label: 'MC1 7 → TB2 U1', wire: 'main', chain: ['e10/MC1:7', 'e10/TB2:U1'] },
      { id: 'V1', group: 'main', label: 'MC1 8 → TB2 V1', wire: 'main', chain: ['e10/MC1:8', 'e10/TB2:V1'] },
      { id: 'W1', group: 'main', label: 'MC1 9 → TB2 W1', wire: 'main', chain: ['e10/MC1:9', 'e10/TB2:W1'] },
      { id: 'U2', group: 'main', label: 'MC2 7 → TB3 U2', wire: 'main', chain: ['e10/MC2:7', 'e10/TB3:U2'] },
      { id: 'V2', group: 'main', label: 'MC2 8 → TB3 V2', wire: 'main', chain: ['e10/MC2:8', 'e10/TB3:V2'] },
      { id: 'W2', group: 'main', label: 'MC2 9 → TB3 W2', wire: 'main', chain: ['e10/MC2:9', 'e10/TB3:W2'] },

      /* ---------- 보조회로 ---------- */
      { id: 'R', circuit: 'R', group: 'aux', label: 'EOCR b접점 뒤 PB1·T 자기유지 앞', wire: 'aux', chain: ['e10/EOCR:4', 'e10/PB1:N', 'e10/T:1'] },
      { id: 'S', circuit: 'S', group: 'aux', label: 'PB1·T 자기유지 뒤 운전 모선', wire: 'aux', chain: ['e10/PB1:O', 'e10/T:3', 'e10/PB0:N', 'e10/T:8', 'e10/FR:8', 'e10/MC1:4'] },
      { id: 'Tc', circuit: 'Tc', group: 'aux', label: 'PB0 b접점 → T 코일', wire: 'aux', chain: ['e10/PB0:C', 'e10/T:2'] },
      { id: 'FRc', circuit: 'FRc', group: 'aux', label: 'T 한시 b접점 → FR 코일', wire: 'aux', chain: ['e10/T:5', 'e10/FR:2'] },
      { id: 'M1c', circuit: 'M1c', group: 'aux', label: 'FR b접점 → MC1 코일', wire: 'aux', chain: ['e10/FR:5', 'e10/MC1:6'] },
      { id: 'M2c', circuit: 'M2c', group: 'aux', label: 'FR a접점·T a접점 → MC2 코일과 보조접점', wire: 'aux', chain: ['e10/FR:6', 'e10/T:6', 'e10/MC2:6', 'e10/MC2:4'] },
      { id: 'RLc', circuit: 'RLc', group: 'aux', label: 'MC1 a접점 → RL', wire: 'aux', chain: ['e10/MC1:10', 'e10/RL:1'] },
      { id: 'GLc', circuit: 'GLc', group: 'aux', label: 'MC2 a접점 → GL', wire: 'aux', chain: ['e10/MC2:10', 'e10/GL:1'] },
      { id: 'YLc', circuit: 'YLc', group: 'aux', label: 'EOCR a접점 → YL', wire: 'aux', chain: ['e10/EOCR:5', 'e10/YL:1'] }
    ]
  };
})(typeof window === 'undefined' ? globalThis : window);
