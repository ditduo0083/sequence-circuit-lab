/*
 * 결선하기·단자대 번호매기기 — 001번 결선 데이터 (2026-09-26, 요청 0028 프로토타입)
 * ------------------------------------------------------------------
 * 원본: 전기기능사-001-A4, 2025-08-04.pdf 5쪽(배관 및 기구 배치도)·6쪽(제어판 내부 기구 배치도)·7쪽(회로도)·요구사항
 *       원본 그림은 넣지 않는다. 치수·순서만 읽어 좌표로 적었고, 그림은 panel-render.js 가 새로 그린다.
 * 점 ID: '001/태그:핀' — 핀번호 적기(circuit-001.js answerKey)와 같은 번호. 새로 더한 이름은 F(퓨즈)·TB1~TB6 뿐.
 * 검사: node 검사/결선검사.cjs 001
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
  W['001'] = {
    id: '001', circuit: '001',
    title: '전기기능사 001 · 결선하기',
    source: { doc: '전기기능사-001-A4, 2025-08-04.pdf', pipingPage: 5, panelPage: 6, circuitPage: 7 },

    wireTypes: {
      'main-L1': { kind: 'main', label: '주회로 L1', size: '2.5㎟', color: '갈색', ink: '#8b4a1f' },
      'main-L2': { kind: 'main', label: '주회로 L2', size: '2.5㎟', color: '흑색', ink: '#1b1b1b' },
      'main-L3': { kind: 'main', label: '주회로 L3', size: '2.5㎟', color: '회색', ink: '#8a9099' },
      aux: { kind: 'aux', label: '보조회로', size: '1.5㎟', color: '황색', ink: '#e0a800' },
      pe: { kind: 'pe', label: '보호도체', size: '2.5㎟', color: '녹색-황색', ink: '#2f9e44', stripe: '#f2c200' }
    },

    /* 제어판 내부 기구 배치(6쪽): 400×420, 위에서 50(TB5 중심)·145(윗줄 중심)·275(아랫줄 중심)·370(TB6 중심) */
    panel: {
      size: [400, 420],
      lanes: [86, 210, 332],          // 선을 가로로 돌리는 통로 y (단자대–윗줄, 윗줄–아랫줄, 아랫줄–단자대 사이)
      gutters: [12, 388],             // 선을 세로로 돌리는 판 가장자리 x
      devices: {
        TB5: { type: 'tb-strip', n: 20, blocks: [10, 10], place: 'top', x: 74, y: 35, w: 251, h: 30, label: 'TB5' },
        F: { type: 'fuse-2p', x: 34, y: 114, w: 32, h: 57, label: '퓨즈' },
        EOCR: { type: 'socket-12p', x: 84, y: 108, w: 64, h: 72 },
        MCCB: { type: 'mccb-3p', x: 165, y: 110, w: 69, h: 69 },
        X: { type: 'socket-8p', x: 254, y: 111, w: 51, h: 66 },
        FR: { type: 'socket-8p', x: 314, y: 111, w: 51, h: 66 },
        T: { type: 'socket-8p', x: 44, y: 241, w: 53, h: 67 },
        FLS: { type: 'socket-8p', x: 124, y: 241, w: 52, h: 67 },
        MC1: { type: 'socket-12p', x: 206, y: 239, w: 62, h: 70 },
        MC2: { type: 'socket-12p', x: 287, y: 239, w: 63, h: 70 },
        TB6: { type: 'tb-strip', n: 20, blocks: [10, 10], place: 'bottom', x: 74, y: 355, w: 251, h: 30, label: 'TB6' }
      }
    },

    /* 배관 및 기구 배치도(5쪽). 제어함 400×420 중심 (0,0). 위쪽 관 x = -100·0·+100, 아래쪽 관 x = -150·-50·+50·+150 */
    piping: {
      box: { w: 400, h: 420, label: '제어함' },
      boxes: [
        { id: 'PB', x: -750, y: -210, attach: 'top', label: '푸시버튼', devices: [{ tag: 'PB1', type: 'pb', kind: 'a' }, { tag: 'PB0', type: 'pb', kind: 'b' }] },
        { id: 'SSB', x: -450, y: -210, attach: 'top', label: '셀렉터 스위치', devices: [{ tag: 'SS', type: 'ss' }] },
        { id: 'TB1', x: 0, y: -650, attach: 'bottom', label: '전원', devices: [{ tag: 'TB1', type: 'tb', pins: ['L1', 'L2', 'L3', 'PE'], sides: false, orient: 'h', label: 'TB1' }] },
        { id: 'RLGL', x: 500, y: -210, attach: 'top', label: '램프', devices: [{ tag: 'RL', type: 'lamp' }, { tag: 'GL', type: 'lamp' }] },
        { id: 'YLBZ', x: -550, y: 210, attach: 'bottom', label: '램프·부저', devices: [{ tag: 'YL', type: 'lamp' }, { tag: 'BZ', type: 'bz' }] },
        { id: 'TB3', x: -600, y: 710, attach: 'right', label: '전동기 M2', devices: [{ tag: 'TB3', type: 'tb', pins: ['U2', 'V2', 'W2', 'PE'], sides: false, orient: 'v', label: 'TB3' }] },
        { id: 'TB4', x: 50, y: 760, attach: 'top', label: '플로트레스', devices: [{ tag: 'TB4', type: 'tb', pins: ['E1', 'E2', 'E3'], sides: false, orient: 'h', label: 'TB4', spare: 1 }] },
        { id: 'TB2', x: 600, y: 610, attach: 'left', label: '전동기 M1', devices: [{ tag: 'TB2', type: 'tb', pins: ['U1', 'V1', 'W1', 'PE'], sides: false, orient: 'v', label: 'TB2' }] },
        { id: 'J', kind: 'jbox', x: -450, y: -610, label: 'J' }
      ],
      pipes: [
        { id: 'T1', kind: 'flex', pts: [[-100, -210], [-100, -610], [-450, -610]] },
        { id: 'T2', kind: 'flex', pts: [[-450, -610], [-750, -610], [-750, -210]] },
        { id: 'T3', kind: 'pe', pts: [[-450, -610], [-450, -210]] },
        { id: 'T4', kind: 'cable', pts: [[0, -210], [0, -650]] },
        { id: 'T5', kind: 'pe', pts: [[100, -210], [100, -610], [500, -610], [500, -210]] },
        { id: 'B1', kind: 'flex', pts: [[-150, 210], [-150, 610], [-550, 610], [-550, 210]] },
        { id: 'B2', kind: 'pe', pts: [[-50, 210], [-50, 710], [-600, 710]] },
        { id: 'B3', kind: 'flex', pts: [[50, 210], [50, 760]] },
        { id: 'B4', kind: 'pe', pts: [[150, 210], [150, 610], [600, 610]] }
      ],
      pipeKinds: { pe: { no: '①', label: 'PE 전선관' }, flex: { no: '②', label: '플렉시블 전선관' }, cable: { no: '③', label: '케이블' } }
    },

    /* 제어함 단자대 TB5(위)·TB6(아래), 각각 10P 두 개. 배관도 순서: 위쪽 관 왼쪽부터 ⓐⓑⓒⓓ → TB5, 아래쪽 관 왼쪽부터 ⓔⓕⓖⓗ → TB6.
     * 자리: 관이 제어함을 나가는 자리 바로 안쪽 칸에(layout 'pipe', 작성자 답변 2026-09-27). 그룹 사이 gap 칸 이상 띄움.
     *       기구 순서대로 붙이고 한두 칸씩 띄우려면 layout: 'pack', gap: 1 또는 2. 칸 번호는 엔진이 계산한다(at 을 적으면 그 칸부터).
     * 구간(nets)에서는 칸 번호 대신 별칭 '001/TB@바깥점' 을 쓴다 → 자리를 바꿔도 구간은 그대로.
     * basic = 수업 기본 배치, common = 심화(같은 점을 한 칸으로 묶음, 공통은 그룹 맨 앞). 한 칸에 묶는 점은 배열.
     * 셀렉터 스위치는 기본부터 SS·A·M 세 칸(N 두 개를 스위치에서 묶어 SS) — 작성자 답변 */
    terminalBlocks: {
      useCommon: false,
      layout: 'block',                // 요청 0043: 관 덩어리를 10P 블록에 나눠 담고(경계 안 넘음) 블록 안에서 양끝으로 벌린다
      strips: { TB5: { place: 'top', blocks: [10, 10], label: '제어함 위쪽 단자대' }, TB6: { place: 'bottom', blocks: [10, 10], label: '제어함 아래쪽 단자대' } },
      groups: [
        { id: 'a', mark: 'ⓐ', name: 'PB0·PB1', strip: 'TB5', box: 'PB', pipes: ['T1', 'T2'],
          basic: ['001/PB0:N', '001/PB0:C', '001/PB1:N', '001/PB1:O'],
          common: [['001/PB0:C', '001/PB1:N'], '001/PB0:N', '001/PB1:O'],
          commonNote: 'PB0 C와 PB1 N은 같은 점(MAN)이라 버튼 상자에서 이어 한 칸으로 줄일 수 있어요.' },
        { id: 'b', mark: 'ⓑ', name: 'SS', strip: 'TB5', box: 'SSB', pipes: ['T1', 'T3'],
          basic: [['001/SS:SS#ssA', '001/SS:SS#ssM'], '001/SS:A', '001/SS:M'],
          note: '셀렉터 스위치는 N 두 개를 스위치에서 묶어(SS) 한 칸으로 내보내요. 칸은 SS·A·M 세 개(SS·M·A 순서도 괜찮아요).' },
        { id: 'c', mark: 'ⓒ', name: 'TB1(전원)', strip: 'TB5', box: 'TB1', pipes: ['T4'],
          basic: ['001/TB1:L1', '001/TB1:L2', '001/TB1:L3', '001/TB1:PE'] },
        { id: 'd', mark: 'ⓓ', name: 'RL·GL', strip: 'TB5', box: 'RLGL', pipes: ['T5'],
          basic: ['001/RL:1', '001/RL:2', '001/GL:1', '001/GL:2'],
          common: [['001/RL:2', '001/GL:2'], '001/RL:1', '001/GL:1'],
          commonNote: 'RL 2와 GL 2는 둘 다 N이라 램프 상자에서 이어 한 칸으로 줄일 수 있어요.' },
        { id: 'e', mark: 'ⓔ', name: 'YL·BZ', strip: 'TB6', box: 'YLBZ', pipes: ['B1'],
          basic: ['001/YL:1', '001/YL:2', '001/BZ:1', '001/BZ:2'],
          common: [['001/YL:2', '001/BZ:2'], '001/YL:1', '001/BZ:1'],
          commonNote: 'YL 2와 BZ 2는 둘 다 N이라 한 칸으로 줄일 수 있어요.' },
        { id: 'f', mark: 'ⓕ', name: 'TB3(M2)', strip: 'TB6', box: 'TB3', pipes: ['B2'],
          basic: ['001/TB3:U2', '001/TB3:V2', '001/TB3:W2', '001/TB3:PE'] },
        { id: 'g', mark: 'ⓖ', name: 'TB4(FLS)', strip: 'TB6', box: 'TB4', pipes: ['B3'],
          basic: ['001/TB4:E1', '001/TB4:E2', '001/TB4:E3'],
          note: 'E3 칸 안쪽 나사에는 FLS 1번(E3) 선과 마지막 접지선, 이렇게 2가닥이 들어가요. 그래서 접지 건너 묶기는 E3 칸에서 끝나요.' },
        { id: 'h', mark: 'ⓗ', name: 'TB2(M1)', strip: 'TB6', box: 'TB2', pipes: ['B4'],
          basic: ['001/TB2:U1', '001/TB2:V1', '001/TB2:W1', '001/TB2:PE'] }
      ]
    },

    /* 회로도(circuit-001.js)에 칸이 없는 점의 좌표 */
    circuitPoints: {
      '001/TB1:L1': [70, 50], '001/TB1:L2': [115, 50], '001/TB1:L3': [160, 50], '001/TB1:PE': [205, 50],
      '001/TB2:U1': [70, 550], '001/TB2:V1': [115, 550], '001/TB2:W1': [160, 550], '001/TB2:PE': [205, 550],
      '001/TB3:U2': [240, 550], '001/TB3:V2': [285, 550], '001/TB3:W2': [330, 550], '001/TB3:PE': [370, 550],
      '001/TB4:E1': [783, 745], '001/TB4:E2': [815, 745], '001/TB4:E3': [847, 745],
      '001/F:1': [240, 188], '001/F:3': [280, 188], '001/F:2': [240, 212], '001/F:4': [280, 212]
    },

    nets: [
      /* ---------- 주회로 ---------- */
      { id: 'L1in', group: 'main', label: '전원 L1 → MCCB', wire: 'main-L1', chain: ['001/TB1:L1', '001/TB@TB1:L1', '001/MCCB:1'],
        note: 'TB1에서 오는 케이블은 TB5 바깥쪽에, MCCB로 가는 선은 TB5 안쪽에 물려요.' },
      { id: 'L2in', group: 'main', label: '전원 L2 → MCCB', wire: 'main-L2', chain: ['001/TB1:L2', '001/TB@TB1:L2', '001/MCCB:2'] },
      { id: 'L3in', group: 'main', label: '전원 L3 → MCCB', wire: 'main-L3', chain: ['001/TB1:L3', '001/TB@TB1:L3', '001/MCCB:3'] },
      { id: 'L1a', group: 'main', label: 'MCCB 부하측 L1 = EOCR 1 = 퓨즈 1차 왼쪽', wire: 'main-L1', chain: ['001/MCCB:7', '001/EOCR:1', '001/F:1'],
        note: '세 점이 한 구간이에요. 퓨즈 1차 쪽도 주회로 선(갈색 2.5㎟)을 써요.' },
      { id: 'L2a', group: 'main', label: 'MCCB 부하측 L2 = EOCR 2', wire: 'main-L2', chain: ['001/MCCB:8', '001/EOCR:2'] },
      { id: 'L3a', group: 'main', label: 'MCCB 부하측 L3 = EOCR 3 = 퓨즈 1차 오른쪽', wire: 'main-L3', chain: ['001/MCCB:9', '001/EOCR:3', '001/F:2'],
        note: '퓨즈 1차 쪽도 주회로 선(회색 2.5㎟)을 써요.' },
      { id: 'L1b', group: 'main', label: 'EOCR 7(U) = MC1 1 = MC2 1', wire: 'main-L1', chain: ['001/EOCR:7', '001/MC1:1', '001/MC2:1'] },
      { id: 'L2b', group: 'main', label: 'EOCR 8(V) = MC1 2 = MC2 2', wire: 'main-L2', chain: ['001/EOCR:8', '001/MC1:2', '001/MC2:2'] },
      { id: 'L3b', group: 'main', label: 'EOCR 9(W) = MC1 3 = MC2 3', wire: 'main-L3', chain: ['001/EOCR:9', '001/MC1:3', '001/MC2:3'] },
      { id: 'U1', group: 'main', label: 'MC1 7 → TB2 U1', wire: 'main-L1', chain: ['001/MC1:7', '001/TB@TB2:U1', '001/TB2:U1'] },
      { id: 'V1', group: 'main', label: 'MC1 8 → TB2 V1', wire: 'main-L2', chain: ['001/MC1:8', '001/TB@TB2:V1', '001/TB2:V1'] },
      { id: 'W1', group: 'main', label: 'MC1 9 → TB2 W1', wire: 'main-L3', chain: ['001/MC1:9', '001/TB@TB2:W1', '001/TB2:W1'] },
      { id: 'U2', group: 'main', label: 'MC2 7 → TB3 U2', wire: 'main-L1', chain: ['001/MC2:7', '001/TB@TB3:U2', '001/TB3:U2'] },
      { id: 'V2', group: 'main', label: 'MC2 8 → TB3 V2', wire: 'main-L2', chain: ['001/MC2:8', '001/TB@TB3:V2', '001/TB3:V2'] },
      { id: 'W2', group: 'main', label: 'MC2 9 → TB3 W2', wire: 'main-L3', chain: ['001/MC2:9', '001/TB@TB3:W2', '001/TB3:W2'] },

      /* ---------- 보호도체 ---------- */
      { id: 'PE', group: 'pe', label: '보호도체(PE) + FLS E3 접지', wire: 'pe',
        chains: [
          ['001/TB1:PE', '001/TB@TB1:PE', '001/TB@TB3:PE', '001/TB3:PE'],
          ['001/TB@TB3:PE', '001/TB@TB2:PE', '001/TB2:PE'],
          ['001/TB@TB2:PE', '001/TB@TB4:E3'],
          { pts: ['001/FLS:1', '001/TB@TB4:E3', '001/TB4:E3'], wire: 'aux' }
        ],
        note: '입력 단자대(TB1) PE에서 제어판 단자대를 거쳐 출력 단자대(TB3·TB2) PE까지 잇고, 마지막에 TB6의 E3 칸으로 가요. E3 칸 안쪽 나사에는 FLS 1번(E3) 선과 이 접지선 2가닥만 들어가므로, 접지는 꼭 E3 칸에서 끝나야 해요. FLS 1번 → E3 선은 보조회로 선이에요.' },

      /* ---------- 보조회로 ---------- */
      { id: 'H', circuit: 'H', group: 'aux', label: '제어 전원 L1쪽(퓨즈 2차 왼쪽)', wire: 'aux', chain: ['001/F:3', '001/EOCR:6', '001/EOCR:10'],
        note: '퓨즈 2차부터는 보조회로 선(황색 1.5㎟)이에요. EOCR 전원(6)과 트립 접점 공통(10)으로 가요.' },
      { id: 'ALM', circuit: 'ALM', group: 'aux', label: 'EOCR a접점(5) → FR', wire: 'aux', chain: ['001/EOCR:5', '001/FR:2', '001/FR:8'] },
      { id: 'YLc', circuit: 'YLc', group: 'aux', label: 'FR a접점 → YL', wire: 'aux', chain: ['001/FR:6', '001/TB@YL:1', '001/YL:1'] },
      { id: 'BZc', circuit: 'BZc', group: 'aux', label: 'FR b접점 → BZ', wire: 'aux', chain: ['001/FR:5', '001/TB@BZ:1', '001/BZ:1'] },
      { id: 'R', circuit: 'R', group: 'aux', label: 'EOCR b접점(4) 뒤 모선 R', wire: 'aux',
        chains: [['001/EOCR:4', '001/TB@SS:SS#ssA', '001/X:1', '001/MC1:4', '001/MC2:4'], ['001/TB@SS:SS#ssA', '001/SS:SS#ssA', '001/SS:SS#ssM']],
        note: 'SS의 N 두 개는 스위치에서 서로 이어(공통 SS) TB5 한 칸(SS)으로 내보내요.' },
      { id: 'AUTO', circuit: 'AUTO', group: 'aux', label: 'SS 자동(A) → FLS 전원·접점', wire: 'aux', chain: ['001/SS:A', '001/TB@SS:A', '001/FLS:5', '001/FLS:4'] },
      { id: 'Xc', circuit: 'Xc', group: 'aux', label: 'FLS 접점 → X 코일', wire: 'aux', chain: ['001/FLS:3', '001/X:2'] },
      { id: 'MS', circuit: 'MS', group: 'aux', label: 'SS 수동(M) → PB0', wire: 'aux', chain: ['001/SS:M', '001/TB@SS:M', '001/TB@PB0:N', '001/PB0:N'],
        note: '두 점이 모두 제어판 밖에 있어요. 각자 TB5로 들어와 TB5 안쪽에서 SS M 칸과 PB0 N 칸을 이어요.' },
      { id: 'MAN', circuit: 'MAN', group: 'aux', label: 'PB0 뒤 = PB1 앞 = T 순시 a', wire: 'aux',
        chains: [['001/PB0:C', '001/TB@PB0:C', '001/TB@PB1:N', '001/PB1:N'], ['001/TB@PB1:N', '001/T:1']] },
      { id: 'CM', circuit: 'CM', group: 'aux', label: 'PB1 뒤 = MC1 코일 쪽', wire: 'aux', chain: ['001/PB1:O', '001/TB@PB1:O', '001/T:3', '001/T:8', '001/X:8', '001/X:3', '001/MC1:6'] },
      { id: 'Tc', circuit: 'Tc', group: 'aux', label: 'X b접점 → T 코일', wire: 'aux', chain: ['001/X:5', '001/T:2'] },
      { id: 'M2c', circuit: 'M2c', group: 'aux', label: 'T 한시 a접점 → MC2 코일', wire: 'aux', chain: ['001/T:6', '001/MC2:6'] },
      { id: 'RLc', circuit: 'RLc', group: 'aux', label: 'MC1 a접점 → RL', wire: 'aux', chain: ['001/MC1:10', '001/TB@RL:1', '001/RL:1'] },
      { id: 'GLc', circuit: 'GLc', group: 'aux', label: 'MC2 a접점 → GL', wire: 'aux', chain: ['001/MC2:10', '001/TB@GL:1', '001/GL:1'] },
      { id: 'E1', group: 'aux', label: 'FLS E1(7) → TB4 E1', wire: 'aux', chain: ['001/FLS:7', '001/TB@TB4:E1', '001/TB4:E1'] },
      { id: 'E2', group: 'aux', label: 'FLS E2(8) → TB4 E2', wire: 'aux', chain: ['001/FLS:8', '001/TB@TB4:E2', '001/TB4:E2'] },
      { id: 'N', circuit: 'N', group: 'aux', label: '제어 전원 L3쪽(퓨즈 2차 오른쪽) = 공통 귀선 N', wire: 'aux',
        chains: [
          ['001/F:4', '001/EOCR:12', '001/X:7', '001/FR:7', '001/TB@RL:2', '001/TB@GL:2'],
          ['001/F:4', '001/T:7', '001/TB@YL:2', '001/TB@BZ:2', '001/FLS:6', '001/MC1:12', '001/MC2:12'],
          ['001/TB@RL:2', '001/RL:2'], ['001/TB@GL:2', '001/GL:2'], ['001/TB@YL:2', '001/YL:2'], ['001/TB@BZ:2', '001/BZ:2']
        ],
        note: '점이 가장 많은 구간이에요. 한 단자에 2가닥까지만 되므로 퓨즈 2차 오른쪽에서 두 갈래로 나눠 이어요.' }
    ]
  };
})(typeof window === 'undefined' ? globalThis : window);
