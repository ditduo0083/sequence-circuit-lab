/*
 * 결선하기·단자대 번호매기기 — 011번 결선 데이터 (2026-09-27, 요청 0031 데이터 확장)
 * ------------------------------------------------------------------
 * 원본: 전기기능사-011-A4, 2025-08-04.pdf 5쪽(배관 및 기구 배치도)·6쪽(제어판 내부 기구 배치도)·7쪽(회로도)·요구사항
 *       원본 그림은 넣지 않는다. 치수·순서만 읽어 좌표로 적었고, 그림은 panel-render.js 가 새로 그린다.
 * 점 ID: '011/태그:핀' — 핀번호 적기(circuit-011.js answerKey)와 같은 번호. 새로 더한 이름은 F(퓨즈)·TB1~TB6 뿐.
 * 검사: node 검사/결선검사.cjs 011
 *
 * 구성
 *   wireTypes      : 선 종류(요구사항: 주회로 2.5㎟ L1 갈색·L2 흑색·L3 회색, 보조 1.5㎟ 황색, 보호도체 2.5㎟ 녹색-황색)
 *   panel          : 제어판(400×420 mm) 안 기구 자리. 판 왼쪽 위가 (0,0)
 *   piping         : 배관도. 제어함 중심이 (0,0), 단위 mm, 아래가 +y
 *   terminalBlocks : 제어함 위쪽 TB5·아래쪽 TB6 (10P+10P) 배치. 배관도 순서 ⓐ~ⓗ
 *   circuitPoints  : 회로도에 칸이 없는 점(TB1~TB4, 퓨즈)의 회로도 좌표
 *   nets           : 구간(전기적으로 같은 점). 이 순서대로 설명한다. chain = 선을 잇는 순서
 */
(function (root) {
  'use strict';
  var W = root.PIN_WIRING = root.PIN_WIRING || {};
  W['011'] = {
    id: '011', circuit: '011',
    title: '전기기능사 011 · 결선하기',
    source: { doc: '전기기능사-011-A4, 2025-08-04.pdf', pipingPage: 5, panelPage: 6, circuitPage: 7 },

    wireTypes: {
      'main-L1': { kind: 'main', label: '주회로 L1', size: '2.5㎟', color: '갈색', ink: '#8b4a1f' },
      'main-L2': { kind: 'main', label: '주회로 L2', size: '2.5㎟', color: '흑색', ink: '#1b1b1b' },
      'main-L3': { kind: 'main', label: '주회로 L3', size: '2.5㎟', color: '회색', ink: '#8a9099' },
      aux: { kind: 'aux', label: '보조회로', size: '1.5㎟', color: '황색', ink: '#e0a800' },
      pe: { kind: 'pe', label: '보호도체', size: '2.5㎟', color: '녹색-황색', ink: '#2f9e44', stripe: '#f2c200' }
    },

    /* 원본 6쪽: 위 EOCR·MCCB·F·X2·X1, 아래 MC1·MC2·T2·T1 */
    panel: {
      size: [400, 420],
      lanes: [86, 210, 332],          // 선을 가로로 돌리는 통로 y (단자대–윗줄, 윗줄–아랫줄, 아랫줄–단자대 사이)
      gutters: [12, 388],             // 선을 세로로 돌리는 판 가장자리 x
      devices: {
        TB5: { type: 'tb-strip', n: 20, blocks: [10, 10], place: 'top', x: 74, y: 35, w: 251, h: 30, label: 'TB5' },
        EOCR: { type: 'socket-12p', x: 35, y: 108, w: 64, h: 72 },
        MCCB: { type: 'mccb-3p', x: 115, y: 110, w: 69, h: 69 },
        F: { type: 'fuse-2p', x: 199, y: 114, w: 29, h: 57, label: '퓨즈' },
        X2: { type: 'socket-8p', x: 247, y: 111, w: 51, h: 66 },
        X1: { type: 'socket-8p', x: 307, y: 111, w: 51, h: 66 },
        MC1: { type: 'socket-12p', x: 44, y: 239, w: 62, h: 70 },
        MC2: { type: 'socket-12p', x: 124, y: 239, w: 62, h: 70 },
        T2: { type: 'socket-8p', x: 205, y: 241, w: 52, h: 67 },
        T1: { type: 'socket-8p', x: 285, y: 241, w: 52, h: 67 },
        TB6: { type: 'tb-strip', n: 20, blocks: [10, 10], place: 'bottom', x: 74, y: 355, w: 251, h: 30, label: 'TB6' }
      }
    },

    /* 원본 5쪽: 위 PB2·J→GL/RL·TB1·WL/YL, 아래 PB0/PB1·TB2·TB4·TB3 */
    piping: {
      box: { w: 400, h: 420, label: '제어함' },
      boxes: [
        { id: 'PB2', x: -750, y: -210, attach: 'top', label: '푸시버튼', devices: [{ tag: 'PB2', type: 'pb', kind: 'a' }] },
        { id: 'GLRL', x: -450, y: -210, attach: 'top', label: '램프', devices: [{ tag: 'GL', type: 'lamp' }, { tag: 'RL', type: 'lamp' }] },
        { id: 'TB1', x: 0, y: -650, attach: 'bottom', label: '전원', devices: [{ tag: 'TB1', type: 'tb', pins: ['L1', 'L2', 'L3', 'PE'], sides: false, orient: 'h', label: 'TB1' }] },
        { id: 'WLYL', x: 500, y: -210, attach: 'top', label: '램프', devices: [{ tag: 'WL', type: 'lamp' }, { tag: 'YL', type: 'lamp' }] },
        { id: 'PB', x: -450, y: 210, attach: 'bottom', label: '푸시버튼', devices: [{ tag: 'PB0', type: 'pb', kind: 'b' }, { tag: 'PB1', type: 'pb', kind: 'a' }] },
        { id: 'TB2', x: -600, y: 710, attach: 'right', label: '전동기 M1', devices: [{ tag: 'TB2', type: 'tb', pins: ['U1', 'V1', 'W1', 'PE'], sides: false, orient: 'v', label: 'TB2' }] },
        { id: 'TB4', x: 50, y: 760, attach: 'top', label: 'TB4(LS1·LS2, 4P)', devices: [{ tag: 'LS1', type: 'ls' }, { tag: 'LS2', type: 'ls' }] },
        { id: 'TB3', x: 600, y: 710, attach: 'left', label: '전동기 M2', devices: [{ tag: 'TB3', type: 'tb', pins: ['U2', 'V2', 'W2', 'PE'], sides: false, orient: 'v', label: 'TB3' }] },
        { id: 'J', kind: 'jbox', x: -450, y: -610, label: 'J' }
      ],
      pipes: [
        { id: 'T1', kind: 'flex', pts: [[-100, -210], [-100, -610], [-750, -610], [-750, -210]] },
        { id: 'T2', kind: 'pe', pts: [[-450, -610], [-450, -210]] },
        { id: 'T3', kind: 'cable', pts: [[0, -210], [0, -650]] },
        { id: 'T4', kind: 'pe', pts: [[100, -210], [100, -610], [500, -610], [500, -210]] },
        { id: 'B1', kind: 'pe', pts: [[-150, 210], [-150, 610], [-450, 610], [-450, 210]] },
        { id: 'B2', kind: 'flex', pts: [[-50, 210], [-50, 710], [-600, 710]] },
        { id: 'B3', kind: 'pe', pts: [[50, 210], [50, 760]] },
        { id: 'B4', kind: 'flex', pts: [[150, 210], [150, 710], [600, 710]] }
      ],
      pipeKinds: { pe: { no: '①', label: 'PE 전선관' }, flex: { no: '②', label: '플렉시블 전선관' }, cable: { no: '③', label: '케이블' } }
    },

    /* 원본 5쪽의 관 순서: 위 PB2, GL/RL, TB1, WL/YL. 아래 PB0/PB1, TB2, TB4, TB3.
     * 그룹과 칸 자리는 검토용 초안이며, 칸 번호는 엔진이 계산한다. */
    terminalBlocks: {
      useCommon: false,
      layout: 'block',                // 요청 0043: 관 덩어리를 10P 블록에 나눠 담고(경계 안 넘음) 블록 안에서 양끝으로 벌린다
      strips: { TB5: { place: 'top', blocks: [10, 10], label: '제어함 위쪽 단자대' }, TB6: { place: 'bottom', blocks: [10, 10], label: '제어함 아래쪽 단자대' } },
      groups: [
        { id: 'a', mark: 'ⓐ', name: 'PB2', strip: 'TB5', box: 'PB2', pipes: ['T1'],
          basic: ['011/PB2:N', '011/PB2:O'] },
        { id: 'b', mark: 'ⓑ', name: 'GL·RL', strip: 'TB5', box: 'GLRL', pipes: ['T1', 'T2'],
          basic: ['011/GL:1', '011/GL:2', '011/RL:1', '011/RL:2'],
          common: [['011/GL:2', '011/RL:2'], '011/GL:1', '011/RL:1'],
          commonNote: 'GL 2와 RL 2는 공통 귀선이다.' },
        { id: 'c', mark: 'ⓒ', name: 'TB1(전원)', strip: 'TB5', box: 'TB1', pipes: ['T3'],
          basic: ['011/TB1:L1', '011/TB1:L2', '011/TB1:L3', '011/TB1:PE'] },
        { id: 'd', mark: 'ⓓ', name: 'WL·YL', strip: 'TB5', box: 'WLYL', pipes: ['T4'],
          basic: ['011/WL:1', '011/WL:2', '011/YL:1', '011/YL:2'],
          common: [['011/WL:2', '011/YL:2'], '011/WL:1', '011/YL:1'],
          commonNote: 'WL 2와 YL 2는 공통 귀선이다.' },
        { id: 'e', mark: 'ⓔ', name: 'PB0·PB1', strip: 'TB6', box: 'PB', pipes: ['B1'],
          basic: ['011/PB0:N', '011/PB0:C', '011/PB1:N', '011/PB1:O'],
          common: [['011/PB0:C', '011/PB1:N'], '011/PB0:N', '011/PB1:O'],
          commonNote: 'PB0 C와 PB1 N은 같은 점이다.' },
        { id: 'f', mark: 'ⓕ', name: 'TB2(M1)', strip: 'TB6', box: 'TB2', pipes: ['B2'],
          basic: ['011/TB2:U1', '011/TB2:V1', '011/TB2:W1', '011/TB2:PE'] },
        { id: 'g', mark: 'ⓖ', name: 'TB4(LS1·LS2)', strip: 'TB6', box: 'TB4', pipes: ['B3'],
          basic: ['011/LS1:1', '011/LS1:2', '011/LS2:1', '011/LS2:2'] },
        { id: 'h', mark: 'ⓗ', name: 'TB3(M2)', strip: 'TB6', box: 'TB3', pipes: ['B4'],
          basic: ['011/TB3:U2', '011/TB3:V2', '011/TB3:W2', '011/TB3:PE'] }
      ]
    },

    /* 회로도(circuit-011.js)에 칸이 없는 점의 좌표 */
    circuitPoints: {
      '011/TB1:L1': [70, 50], '011/TB1:L2': [115, 50], '011/TB1:L3': [160, 50], '011/TB1:PE': [205, 50],
      '011/TB2:U1': [70, 550], '011/TB2:V1': [115, 550], '011/TB2:W1': [160, 550], '011/TB2:PE': [205, 550],
      '011/TB3:U2': [240, 550], '011/TB3:V2': [285, 550], '011/TB3:W2': [330, 550], '011/TB3:PE': [370, 550],
      '011/F:1': [240, 188], '011/F:3': [280, 188], '011/F:2': [240, 212], '011/F:4': [280, 212]
    },

    nets: [
      /* ---------- 주회로 ---------- */
      { id: 'L1in', group: 'main', label: '전원 L1 → MCCB', wire: 'main-L1', chain: ['011/TB1:L1', '011/TB@TB1:L1', '011/MCCB:1'],
        note: 'TB1에서 오는 케이블은 TB5 바깥쪽에, MCCB로 가는 선은 TB5 안쪽에 물려요.' },
      { id: 'L2in', group: 'main', label: '전원 L2 → MCCB', wire: 'main-L2', chain: ['011/TB1:L2', '011/TB@TB1:L2', '011/MCCB:2'] },
      { id: 'L3in', group: 'main', label: '전원 L3 → MCCB', wire: 'main-L3', chain: ['011/TB1:L3', '011/TB@TB1:L3', '011/MCCB:3'] },
      { id: 'L1a', group: 'main', label: 'MCCB 부하측 L1 = EOCR 1 = 퓨즈 1차 왼쪽', wire: 'main-L1', chain: ['011/MCCB:7', '011/EOCR:1', '011/F:1'],
        note: '세 점이 한 구간이에요. 퓨즈 1차 쪽도 주회로 선(갈색 2.5㎟)을 써요.' },
      { id: 'L2a', group: 'main', label: 'MCCB 부하측 L2 = EOCR 2', wire: 'main-L2', chain: ['011/MCCB:8', '011/EOCR:2'] },
      { id: 'L3a', group: 'main', label: 'MCCB 부하측 L3 = EOCR 3 = 퓨즈 1차 오른쪽', wire: 'main-L3', chain: ['011/MCCB:9', '011/EOCR:3', '011/F:2'],
        note: '퓨즈 1차 쪽도 주회로 선(회색 2.5㎟)을 써요.' },
      { id: 'L1b', group: 'main', label: 'EOCR 7(U) = MC1 1 = MC2 1', wire: 'main-L1', chain: ['011/EOCR:7', '011/MC1:1', '011/MC2:1'] },
      { id: 'L2b', group: 'main', label: 'EOCR 8(V) = MC1 2 = MC2 2', wire: 'main-L2', chain: ['011/EOCR:8', '011/MC1:2', '011/MC2:2'] },
      { id: 'L3b', group: 'main', label: 'EOCR 9(W) = MC1 3 = MC2 3', wire: 'main-L3', chain: ['011/EOCR:9', '011/MC1:3', '011/MC2:3'] },
      { id: 'U1', group: 'main', label: 'MC1 7 → TB2 U1', wire: 'main-L1', chain: ['011/MC1:7', '011/TB@TB2:U1', '011/TB2:U1'] },
      { id: 'V1', group: 'main', label: 'MC1 8 → TB2 V1', wire: 'main-L2', chain: ['011/MC1:8', '011/TB@TB2:V1', '011/TB2:V1'] },
      { id: 'W1', group: 'main', label: 'MC1 9 → TB2 W1', wire: 'main-L3', chain: ['011/MC1:9', '011/TB@TB2:W1', '011/TB2:W1'] },
      { id: 'U2', group: 'main', label: 'MC2 7 → TB3 U2', wire: 'main-L1', chain: ['011/MC2:7', '011/TB@TB3:U2', '011/TB3:U2'] },
      { id: 'V2', group: 'main', label: 'MC2 8 → TB3 V2', wire: 'main-L2', chain: ['011/MC2:8', '011/TB@TB3:V2', '011/TB3:V2'] },
      { id: 'W2', group: 'main', label: 'MC2 9 → TB3 W2', wire: 'main-L3', chain: ['011/MC2:9', '011/TB@TB3:W2', '011/TB3:W2'] },

      /* ---------- 보호도체 ---------- */
      { id: 'PE', group: 'pe', label: '전원·전동기 보호도체(PE)', wire: 'pe',
        chains: [
          ['011/TB1:PE', '011/TB@TB1:PE', '011/TB@TB3:PE', '011/TB3:PE'],
          ['011/TB@TB3:PE', '011/TB@TB2:PE', '011/TB2:PE']
        ],
        note: '입력 단자대 TB1 PE에서 출력 단자대 TB3·TB2 PE까지 잇는다.' },

      /* ---------- 보조회로 ---------- */
      { id: 'H', circuit: 'n_eocrNOIn', group: 'aux', label: '제어 전원 L1쪽(퓨즈 2차 왼쪽)', wire: 'aux', chain: ['011/F:3', '011/EOCR:6', '011/EOCR:10'],
        note: '퓨즈 2차부터는 보조회로 선(황색 1.5㎟)이에요. EOCR 전원(6)과 트립 접점 공통(10)으로 가요.' },
      { id: 'YLc', circuit: 'n_YLP', group: 'aux', label: 'EOCR a접점 → YL', wire: 'aux', chain: ['011/EOCR:5', '011/TB@YL:1', '011/YL:1'] },
      { id: 'P', circuit: 'n_stopIn', group: 'aux', label: 'EOCR b접점 → PB0', wire: 'aux', chain: ['011/EOCR:4', '011/TB@PB0:N', '011/PB0:N'] },
      { id: 'R', circuit: 'n_mc2AuxIn', group: 'aux', label: 'PB0 뒤 운전 모선', wire: 'aux',
        chains: [
          ['011/PB1:N', '011/TB@PB1:N', '011/TB@PB0:C', '011/PB0:C'],
          ['011/TB@PB0:C', '011/T1:8', '011/TB@PB2:N', '011/T2:8', '011/X1:8', '011/X2:8', '011/MC1:4', '011/MC2:4'],
          ['011/TB@PB2:N', '011/PB2:N']
        ] },
      { id: 'S1', circuit: 'n_x2GateIn', group: 'aux', label: 'PB1·T1 자기유지 뒤 X1·LS1·X2 접점', wire: 'aux',
        chain: ['011/PB1:O', '011/TB@PB1:O', '011/T1:6', '011/X1:2', '011/X2:1', '011/TB@LS1:1', '011/LS1:1'] },
      { id: 'MC1P', circuit: 'n_MC1P', group: 'aux', label: 'LS1 → MC1 코일', wire: 'aux',
        chain: ['011/LS1:2', '011/TB@LS1:2', '011/MC1:6'] },
      { id: 'T1P', circuit: 'n_T1P', group: 'aux', label: 'X2 접점 → T1 코일', wire: 'aux', chain: ['011/X2:4', '011/T1:2'] },
      { id: 'S2', circuit: 'n_x1GateIn', group: 'aux', label: 'PB2·T2 자기유지 뒤 X2·LS2·X1 접점', wire: 'aux',
        chain: ['011/PB2:O', '011/TB@PB2:O', '011/T2:6', '011/X2:2', '011/X1:1', '011/TB@LS2:1', '011/LS2:1'] },
      { id: 'MC2P', circuit: 'n_MC2P', group: 'aux', label: 'LS2 → MC2 코일', wire: 'aux',
        chain: ['011/LS2:2', '011/TB@LS2:2', '011/MC2:6'] },
      { id: 'T2P', circuit: 'n_T2P', group: 'aux', label: 'X1 접점 → T2 코일', wire: 'aux', chain: ['011/X1:4', '011/T2:2'] },
      { id: 'WL1', circuit: 'n_mc1NCIn', group: 'aux', label: 'X1 접점 → MC1 b접점', wire: 'aux', chain: ['011/X1:6', '011/MC1:5'] },
      { id: 'WL2', circuit: 'n_mc2NCIn', group: 'aux', label: 'X2 접점 → MC2 b접점', wire: 'aux', chain: ['011/X2:6', '011/MC2:5'] },
      { id: 'WLc', circuit: 'n_WLP', group: 'aux', label: 'MC1·MC2 b접점 → WL', wire: 'aux', chain: ['011/MC1:11', '011/MC2:11', '011/TB@WL:1', '011/WL:1'] },
      { id: 'RLc', circuit: 'n_RLP', group: 'aux', label: 'MC1 a접점 → RL', wire: 'aux', chain: ['011/MC1:10', '011/TB@RL:1', '011/RL:1'] },
      { id: 'GLc', circuit: 'n_GLP', group: 'aux', label: 'MC2 a접점 → GL', wire: 'aux', chain: ['011/MC2:10', '011/TB@GL:1', '011/GL:1'] },
      { id: 'N', circuit: 'n_r1670', group: 'aux', label: '제어 전원 L3쪽(퓨즈 2차 오른쪽) = 공통 귀선 N', wire: 'aux',
        chains: [
          ['011/F:4', '011/EOCR:12', '011/X1:7', '011/X2:7', '011/T1:7', '011/T2:7', '011/MC1:12', '011/MC2:12', '011/TB@WL:2', '011/TB@YL:2', '011/TB@RL:2', '011/TB@GL:2'],
          ['011/TB@WL:2', '011/WL:2'], ['011/TB@YL:2', '011/YL:2'], ['011/TB@RL:2', '011/RL:2'], ['011/TB@GL:2', '011/GL:2']
        ],
        note: '한 단자에 2가닥까지만 물려 코일과 표시등 공통 귀선을 순서대로 잇는다.' }
    ]
  };
})(typeof window === 'undefined' ? globalThis : window);
