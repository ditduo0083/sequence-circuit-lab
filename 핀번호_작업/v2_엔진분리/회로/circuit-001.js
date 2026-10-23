/*
 * 핀번호 적기 v2 — 001번 회로 데이터 (2026-09-21)
 * ------------------------------------------------------------------
 * 이 파일만 고치면 새 회로를 만들 수 있다. 엔진(공용/pin-engine.js)은 열지 않는다.
 * 원본: 전기기능사-001-A4, 2025-08-04.pdf 6·7·9쪽 (원본 그림은 넣지 않는다. 좌표는 우리 방식으로 새로 잡은 것)
 * 앱 대조: 접점 id = 회로 앱(circuit-diagram.js)의 this.contact 첫 인자, 코일 id = 'coil-' + 앱 load id
 *
 * 구성
 *   devices   : 태그 → 기구 라이브러리 종류(device-library.js). 번호가 없는 기구는 type:null + cat
 *   answerKey : 칸 번호 순서대로 [위(왼쪽), 아래(오른쪽)]. 주회로는 극마다 [위, 아래]
 *   rules     : 채점 규칙(선생님 확정). 보통 그대로 둔다
 *   layout    : 회로도 그림(drawing), 칸을 가진 항목(items), 입력 순서(order)
 *     drawing 도형: rect, text, term, dot, line, wire, breaker, mc, fuse, motor, earth,
 *                   item(그 항목의 기호를 이 순서에 그림), items(남은 접점·코일을 items 순서대로 그림)
 *     items 종류(cat): contact · pb · ss(접점) / coil · lamp(코일·램프·부저) / main(주회로 극) / flsE(FLS 전극)
 *     net      : 같은 선으로 이어진 단자는 같은 이름. 전원 모선은 R, 공통 귀선은 N 처럼
 */
(function (root) {
  'use strict';
  var C = root.PIN_CIRCUITS = root.PIN_CIRCUITS || {};
  C['001'] = {
    id: '001',
    title: '전기기능사 001 · 핀번호 적기',
    subject: '전기기능사',
    source: { doc: '전기기능사-001-A4, 2025-08-04.pdf', legendPage: 6, circuitPage: 7, devicePage: 9 },
    app: { folder: '001_기본_시퀀스_회로' },

    devices: {
      MC1: { type: 'mc-12p' }, MC2: { type: 'mc-12p' }, EOCR: { type: 'eocr-12p' },
      X: { type: 'relay-8p' }, T: { type: 'timer-8p' }, FR: { type: 'flicker-8p' }, FLS: { type: 'fls-8p' },
      SS: { type: null, cat: 'ss' }, PB0: { type: null, cat: 'pb' }, PB1: { type: null, cat: 'pb' },
      YL: { type: null, cat: 'lamp' }, GL: { type: null, cat: 'lamp' }, RL: { type: null, cat: 'lamp' },
      BZ: { type: null, cat: 'lamp' }, MCCB: { type: null, cat: 'main' }
    },

    answerKey: {
      eocrNC: ['10', '4'], eocrNO: ['10', '5'],
      frYL: ['8', '6'], frBZ: ['8', '5'],
      ssA: ['SS', 'A'], ssM: ['SS', 'M'],
      pb0: ['N', 'C'], pb1: ['N', 'O'],
      flsContact: ['4', '3'], tHold: ['1', '3'],
      xNO: ['1', '3'], xNC: ['8', '5'], tDelay: ['8', '6'],
      mc1Aux: ['4', '10'], mc2Aux: ['4', '10'],
      'coil-EOCR': ['6', '12'], 'coil-FR': ['2', '7'], 'coil-YL': ['1', '2'], 'coil-BZ': ['1', '2'],
      'coil-FLS': ['5', '6'], 'coil-X': ['2', '7'], 'coil-T': ['2', '7'],
      'coil-MC1': ['6', '12'], 'coil-MC2': ['6', '12'], 'coil-RL': ['1', '2'], 'coil-GL': ['1', '2'],
      'fls-E': ['7', '8', '1'],
      'main-MCCB': [['1', '7'], ['2', '8'], ['3', '9']],
      'main-EOCR': [['1', '7'], ['2', '8'], ['3', '9']],
      'main-MC1': [['1', '7'], ['2', '8'], ['3', '9']],
      'main-MC2': [['1', '7'], ['2', '8'], ['3', '9']]
    },

    rules: {
      contactReversed: 'warn', coilReversed: 'warn', sharedCommon: 'ok', eocr11: 'warn', pushbuttonDigits: 'warn', mccbOptional: true,
      scoreModes: { half: { ok: 1, warn: 0.5, bad: 0 }, markOnly: { ok: 1, warn: 1, bad: 0 } }
    },

    deepText: '001 회로에서 X의 a접점(윗줄) 아래 끝과 X의 b접점(T 코일 위) 위 끝은 <b>같은 점</b>이에요. 그래서 릴레이 한 조의 공통 1을 그 점에 두고 a접점은 3–1(위 3, 아래 1), b접점은 1–4로 적으면 선 한 가닥을 줄일 수 있어요. 이렇게 적어도 정답이에요.',

    /* 회로해석(요청 0018) — 서술형 모범 답안과 접점 고르기 문제.
     * 문장은 회로 앱의 동작 모델(circuit-model.js)을 보고 새로 쓴 것이다. 공단 원문을 옮기지 않는다.
     * verified: 원문대조(C001 방식, 연속 일치 15자 미만)를 통과하면 true(설계안 B-2). false 인 동안 학생 화면에는 모범 답안이 숨겨진다.
     *   2026-09-23 원문대조 결과 최장 11자 → true. 기록: scratch/20260923_0018_회로해석엔진/4_원문대조_001.* */
    synopsis: {
      text: 'MCCB를 투입하면 EOCR에 전원이 들어가고, EOCR이 정상인 동안 그 b접점을 거쳐 제어회로에 전원이 공급된다. ' +
        'SS를 A(자동) 쪽에 두면 FLS에 전원이 공급되어 수위 감시를 시작한다. 수위가 감지되어 FLS 접점이 닫히면 릴레이 X가 여자된다. ' +
        'X의 a접점이 닫혀 MC1이 여자되므로 전동기 M1이 운전하고 RL이 점등된다. 이때 X의 b접점은 열려 있어 타이머 T는 동작하지 않는다. ' +
        '수위 감지가 풀리면 X가 소자되어 MC1이 복귀하고, M1이 정지하며 RL이 소등된다. ' +
        'SS를 M(수동) 쪽에 두고 PB1을 누르면 MC1과 타이머 T가 함께 여자되고, PB1과 병렬로 연결된 T의 순시 a접점이 닫혀 손을 떼어도 자기유지된다. ' +
        'MC1에 의해 M1이 운전하고 RL이 점등된다. T의 설정 시간이 지나면 한시 a접점이 닫혀 MC2가 여자되고, 전동기 M2가 운전하며 GL이 점등된다. ' +
        '수동 운전 중 PB0을 누르면 자기유지 회로가 끊어져 T·MC1·MC2가 모두 소자되고 두 전동기가 멈춘다. ' +
        '운전 중 과부하로 EOCR이 동작하면 b접점이 열려 제어회로 전원이 끊기므로 모든 운전이 멈추고, a접점이 닫혀 플리커 릴레이 FR이 여자된다. ' +
        'FR의 접점이 설정 간격마다 바뀌어 BZ와 YL이 번갈아 동작하며, EOCR을 리셋하면 경보가 멈춘다.',
      verified: true
    },
    interpretQuestions: [
      { id: 'q1', prompt: 'SS가 A(자동)일 때, 수위를 감지하면 닫혀서 릴레이 X를 여자시키는 접점은?', answerItemIds: ['flsContact'], multi: false,
        explain: 'FLS 접점이 닫히면 X 코일에 전원이 들어가요.' },
      { id: 'q2', prompt: 'X가 여자되었을 때 닫혀서 MC1 코일에 전원을 보내는 X의 접점은?', answerItemIds: ['xNO'], multi: false,
        explain: '윗줄의 X a접점이 모선에서 MC1 쪽으로 전원을 이어 줘요.' },
      { id: 'q3', prompt: '자동 운전 중(X 여자) 타이머 T로 가는 회로를 끊어 T가 동작하지 않게 하는 접점은?', answerItemIds: ['xNC'], multi: false,
        explain: 'T 코일 위의 X b접점은 X가 여자되면 열려요.' },
      { id: 'q4', prompt: '수동 운전에서 PB1을 누르는 순간 함께 여자되는 코일을 모두 고르세요.', answerItemIds: ['coil-MC1', 'coil-T'], multi: true,
        explain: 'PB1을 지난 전원은 MC1 코일로 가고, X b접점을 거쳐 T 코일에도 가요.' },
      { id: 'q5', prompt: 'PB1에서 손을 떼도 MC1과 T가 계속 여자되도록 자기유지를 하는 접점은?', answerItemIds: ['tHold'], multi: false,
        explain: 'PB1과 나란히(병렬) 붙은 T의 순시 a접점이 자기유지를 해요.' },
      { id: 'q6', prompt: 'T의 설정 시간이 지난 뒤 닫혀서 MC2를 여자시키는 접점은?', answerItemIds: ['tDelay'], multi: false,
        explain: '삼각형 표시가 있는 T의 한시 a접점이에요.' },
      { id: 'q7', prompt: '수동 운전 중 누르면 모든 운전을 멈추게 하는 접점은?', answerItemIds: ['pb0'], multi: false,
        explain: 'PB0은 b접점이라 누르면 열려서 자기유지 회로가 끊어져요.' },
      { id: 'q8', prompt: '과부하로 EOCR이 동작하면 열려서 제어회로 전체의 전원을 끊는 접점은?', answerItemIds: ['eocrNC'], multi: false,
        explain: '맨 위 가로줄의 EOCR b접점이 열리면 제어회로에 전원이 가지 않아요.' },
      { id: 'q9', prompt: 'EOCR이 동작했을 때 FR 접점에 의해 번갈아 동작하는 것을 모두 고르세요.', answerItemIds: ['coil-YL', 'coil-BZ'], multi: true,
        explain: 'FR의 a접점 쪽은 YL, b접점 쪽은 BZ라서 둘이 교대로 동작해요.' }
    ],

    layout: {
      viewBox: [1500, 810],
      coilY: 590,

      /* 주회로 극: xs = 극의 x, slotY = [위 칸 y, 아래 칸 y] */
      main: [
        { tag: 'MCCB', xs: [70, 115, 160], slotY: [80, 160], optional: true },
        { tag: 'EOCR', xs: [70, 115, 160], slotY: [236, 301] },
        { tag: 'MC1', xs: [70, 115, 160], slotY: [400, 480] },
        { tag: 'MC2', xs: [240, 285, 330], slotY: [400, 480] }
      ],

      /* 칸을 가진 항목. 이 순서대로 기호를 그린다 */
      items: [
        { id: 'eocrNC', cat: 'contact', tag: 'EOCR', kind: 'b', feat: 'ovl', horiz: true, x1: 460, x2: 500, y: 80, label: 'EOCR',
          title: 'EOCR 접점 (맨 위 가로, b접점)', slots: [{ x: 460, y: 56, net: 'H' }, { x: 500, y: 56, net: 'R' }] },
        { id: 'eocrNO', cat: 'contact', tag: 'EOCR', kind: 'a', feat: 'ovl', x: 530, rows: [340, 380], nets: ['H', 'ALM'], label: 'EOCR', title: 'EOCR 접점 (a접점)' },
        { id: 'frYL', cat: 'contact', tag: 'FR', kind: 'a', feat: 'fl', x: 600, rows: [470, 510], nets: ['ALM', 'YLc'], label: 'FR', title: 'FR 접점 (YL 위, a접점)' },
        { id: 'frBZ', cat: 'contact', tag: 'FR', kind: 'b', feat: 'fl', x: 680, rows: [470, 510], nets: ['ALM', 'BZc'], label: 'FR', title: 'FR 접점 (BZ 위, b접점)' },
        { id: 'ssA', cat: 'ss', tag: 'SS', kind: 'a', feat: 'ss', x: 880, rows: [125, 165], nets: ['R', 'AUTO'], label: '', sub: 'A', title: 'SS 자동(A)쪽 접점' },
        { id: 'ssM', cat: 'ss', tag: 'SS', kind: 'b', feat: 'ss', x: 980, rows: [125, 165], nets: ['R', 'MS'], label: 'SS', sub: 'M', title: 'SS 수동(M)쪽 접점',
          appKind: 'a', appKindNote: '원본은 b접점 기호, 앱은 a접점 기호. 핀 번호·채점은 a/b와 무관. 작성자 결정(2026-09-21): 앱은 그대로 둔다' },
        { id: 'pb0', cat: 'pb', tag: 'PB0', kind: 'b', feat: 'pb', x: 980, rows: [225, 265], nets: ['MS', 'MAN'], label: 'PB0', title: 'PB0 (b접점, 적색)' },
        { id: 'flsContact', cat: 'contact', tag: 'FLS', kind: 'a', feat: '', x: 880, rows: [340, 380], nets: ['AUTO', 'Xc'], label: 'FLS', title: 'FLS 접점 (a접점)' },
        { id: 'pb1', cat: 'pb', tag: 'PB1', kind: 'a', feat: 'pb', x: 980, rows: [340, 380], nets: ['MAN', 'CM'], label: 'PB1', title: 'PB1 (a접점, 녹색)' },
        { id: 'tHold', cat: 'contact', tag: 'T', kind: 'a', timing: 'instant', feat: '', x: 1078, rows: [340, 380], nets: ['MAN', 'CM'], label: 'T', title: 'T 접점 (PB1 옆, 순시 a접점)' },
        { id: 'xNO', cat: 'contact', tag: 'X', kind: 'a', feat: '', x: 1160, rows: [125, 165], nets: ['R', 'CM'], label: 'X', title: 'X 접점 (윗줄, a접점)' },
        { id: 'xNC', cat: 'contact', tag: 'X', kind: 'b', feat: '', x: 980, rows: [470, 510], nets: ['CM', 'Tc'], label: 'X', title: 'X 접점 (T 코일 위, b접점)' },
        { id: 'tDelay', cat: 'contact', tag: 'T', kind: 'a', timing: 'delay', feat: 'td', x: 1250, rows: [470, 510], nets: ['CM', 'M2c'], label: 'T', title: 'T 접점 (MC2 위, 한시 a접점)' },
        { id: 'mc1Aux', cat: 'contact', tag: 'MC1', kind: 'a', feat: '', x: 1330, rows: [125, 165], nets: ['R', 'RLc'], label: 'MC1', title: 'MC1 보조 접점 (RL 위, a접점)' },
        { id: 'mc2Aux', cat: 'contact', tag: 'MC2', kind: 'a', feat: '', x: 1440, rows: [125, 165], nets: ['R', 'GLc'], label: 'MC2', title: 'MC2 보조 접점 (GL 위, a접점)' },
        { id: 'coil-EOCR', cat: 'coil', tag: 'EOCR', x: 430, nets: ['H', 'N'], title: 'EOCR 코일' },
        { id: 'coil-FR', cat: 'coil', tag: 'FR', x: 530, nets: ['ALM', 'N'], title: 'FR 코일' },
        { id: 'coil-YL', cat: 'lamp', tag: 'YL', x: 600, nets: ['YLc', 'N'], title: 'YL 램프' },
        { id: 'coil-BZ', cat: 'lamp', tag: 'BZ', x: 680, shape: 'rect', nets: ['BZc', 'N'], title: 'BZ 부저' },
        { id: 'coil-FLS', cat: 'coil', tag: 'FLS', x: 760, nets: ['AUTO', 'N'], title: 'FLS 전원' },
        { id: 'coil-X', cat: 'coil', tag: 'X', x: 880, nets: ['Xc', 'N'], title: 'X 코일' },
        { id: 'coil-T', cat: 'coil', tag: 'T', x: 980, nets: ['Tc', 'N'], title: 'T 코일' },
        { id: 'coil-MC1', cat: 'coil', tag: 'MC1', x: 1160, nets: ['CM', 'N'], title: 'MC1 코일' },
        { id: 'coil-MC2', cat: 'coil', tag: 'MC2', x: 1250, nets: ['M2c', 'N'], title: 'MC2 코일' },
        { id: 'coil-RL', cat: 'lamp', tag: 'RL', x: 1330, nets: ['RLc', 'N'], title: 'RL 램프' },
        { id: 'coil-GL', cat: 'lamp', tag: 'GL', x: 1440, nets: ['GLc', 'N'], title: 'GL 램프' },
        { id: 'fls-E', cat: 'flsE', tag: 'FLS', title: 'FLS 전극 → TB4 (E1·E2·E3)', slots: [{ x: 783, y: 792 }, { x: 815, y: 792 }, { x: 847, y: 792 }] }
      ],

      /* 입력(Enter/Tab) 순서. 주회로는 main-태그-극번호 */
      order: ['main-MCCB-0', 'main-MCCB-1', 'main-MCCB-2', 'main-EOCR-0', 'main-EOCR-1', 'main-EOCR-2',
        'main-MC1-0', 'main-MC1-1', 'main-MC1-2', 'main-MC2-0', 'main-MC2-1', 'main-MC2-2',
        'eocrNC', 'coil-EOCR', 'eocrNO', 'coil-FR', 'frYL', 'coil-YL', 'frBZ', 'coil-BZ', 'coil-FLS', 'fls-E',
        'ssA', 'flsContact', 'coil-X', 'ssM', 'pb0', 'pb1', 'xNC', 'coil-T', 'tHold', 'xNO', 'coil-MC1',
        'tDelay', 'coil-MC2', 'mc1Aux', 'coil-RL', 'mc2Aux', 'coil-GL'],

      /* 회로도 그림 (그리는 순서대로) */
      drawing: [
        // 주회로: TB1
        { t: 'rect', x: 55, y: 40, w: 165, h: 20 },
        { t: 'text', x: 70, y: 33, s: 'L1', size: 13, anchor: 'middle' }, { t: 'term', x: 70, y: 50 },
        { t: 'text', x: 115, y: 33, s: 'L2', size: 13, anchor: 'middle' }, { t: 'term', x: 115, y: 50 },
        { t: 'text', x: 160, y: 33, s: 'L3', size: 13, anchor: 'middle' }, { t: 'term', x: 160, y: 50 },
        { t: 'text', x: 205, y: 33, s: 'PE', size: 13, anchor: 'middle' }, { t: 'term', x: 205, y: 50 },
        { t: 'text', x: 14, y: 56, s: 'TB1', size: 13 }, { t: 'text', x: 228, y: 56, s: '3P3W AC 220V', size: 12 },
        // 상선 + MCCB
        { t: 'line', x1: 70, y1: 54, x2: 70, y2: 100 }, { t: 'line', x1: 70, y1: 140, x2: 70, y2: 420 }, { t: 'line', x1: 70, y1: 460, x2: 70, y2: 550 }, { t: 'breaker', x: 70, y1: 100, y2: 140 },
        { t: 'line', x1: 115, y1: 54, x2: 115, y2: 100 }, { t: 'line', x1: 115, y1: 140, x2: 115, y2: 420 }, { t: 'line', x1: 115, y1: 460, x2: 115, y2: 550 }, { t: 'breaker', x: 115, y1: 100, y2: 140 },
        { t: 'line', x1: 160, y1: 54, x2: 160, y2: 100 }, { t: 'line', x1: 160, y1: 140, x2: 160, y2: 420 }, { t: 'line', x1: 160, y1: 460, x2: 160, y2: 550 }, { t: 'breaker', x: 160, y1: 100, y2: 140 },
        { t: 'line', x1: 70, y1: 122, x2: 164, y2: 122, dash: true }, { t: 'text', x: 8, y: 126, s: 'MCCB', size: 12 },
        // 퓨즈·제어 전원
        { t: 'dot', x: 70, y: 188 }, { t: 'line', x1: 70, y1: 188, x2: 240, y2: 188 }, { t: 'fuse', x: 240, y: 188 },
        { t: 'wire', pts: [[280, 188], [395, 188], [395, 80]] }, { t: 'text', x: 240, y: 176, s: 'FUSE', size: 12 },
        { t: 'dot', x: 160, y: 212 }, { t: 'line', x1: 160, y1: 212, x2: 240, y2: 212 }, { t: 'fuse', x: 240, y: 212 },
        { t: 'wire', pts: [[280, 212], [385, 212], [385, 700]] },
        // EOCR 본체
        { t: 'rect', x: 45, y: 250, w: 140, h: 35, sw: 1.6 }, { t: 'text', x: 115, y: 273, s: 'EOCR', size: 15, anchor: 'middle' },
        // MC2 분기
        { t: 'dot', x: 70, y: 340 }, { t: 'wire', pts: [[70, 340], [240, 340], [240, 420]] }, { t: 'line', x1: 240, y1: 460, x2: 240, y2: 550 },
        { t: 'dot', x: 115, y: 355 }, { t: 'wire', pts: [[115, 355], [285, 355], [285, 420]] }, { t: 'line', x1: 285, y1: 460, x2: 285, y2: 550 },
        { t: 'dot', x: 160, y: 370 }, { t: 'wire', pts: [[160, 370], [330, 370], [330, 420]] }, { t: 'line', x1: 330, y1: 460, x2: 330, y2: 550 },
        // MC1·MC2 주접점
        { t: 'mc', x: 70, y1: 420, y2: 460 }, { t: 'mc', x: 115, y1: 420, y2: 460 }, { t: 'mc', x: 160, y1: 420, y2: 460 },
        { t: 'line', x1: 76, y1: 442, x2: 166, y2: 442, dash: true },
        { t: 'mc', x: 240, y1: 420, y2: 460 }, { t: 'mc', x: 285, y1: 420, y2: 460 }, { t: 'mc', x: 330, y1: 420, y2: 460 },
        { t: 'line', x1: 246, y1: 442, x2: 336, y2: 442, dash: true },
        { t: 'text', x: 10, y: 446, s: 'MC1', size: 12 }, { t: 'text', x: 186, y: 446, s: 'MC2', size: 12 },
        // PE
        { t: 'line', x1: 205, y1: 54, x2: 205, y2: 550 }, { t: 'dot', x: 205, y: 325 }, { t: 'wire', pts: [[205, 325], [370, 325], [370, 550]] },
        // TB2·TB3·전동기
        { t: 'rect', x: 55, y: 540, w: 165, h: 20 }, { t: 'rect', x: 228, y: 540, w: 157, h: 20 },
        { t: 'term', x: 70, y: 550 }, { t: 'text', x: 70, y: 533, s: 'U1', size: 11, anchor: 'middle' },
        { t: 'term', x: 115, y: 550 }, { t: 'text', x: 115, y: 533, s: 'V1', size: 11, anchor: 'middle' },
        { t: 'term', x: 160, y: 550 }, { t: 'text', x: 160, y: 533, s: 'W1', size: 11, anchor: 'middle' },
        { t: 'term', x: 205, y: 550 }, { t: 'text', x: 205, y: 533, s: 'PE', size: 11, anchor: 'middle' },
        { t: 'term', x: 240, y: 550 }, { t: 'text', x: 240, y: 533, s: 'U2', size: 11, anchor: 'middle' },
        { t: 'term', x: 285, y: 550 }, { t: 'text', x: 285, y: 533, s: 'V2', size: 11, anchor: 'middle' },
        { t: 'term', x: 330, y: 550 }, { t: 'text', x: 330, y: 533, s: 'W2', size: 11, anchor: 'middle' },
        { t: 'term', x: 370, y: 550 }, { t: 'text', x: 370, y: 533, s: 'PE', size: 11, anchor: 'middle' },
        { t: 'text', x: 14, y: 555, s: 'TB2', size: 13 }, { t: 'text', x: 292, y: 580, s: 'TB3', size: 13 },
        { t: 'wire', pts: [[70, 554], [70, 575], [99, 604]] }, { t: 'line', x1: 115, y1: 554, x2: 115, y2: 596 }, { t: 'wire', pts: [[160, 554], [160, 575], [131, 604]] },
        { t: 'motor', x: 115, y: 620, s: 'M1' },
        { t: 'wire', pts: [[139, 620], [205, 620]] }, { t: 'dot', x: 205, y: 620 }, { t: 'line', x1: 205, y1: 554, x2: 205, y2: 650 }, { t: 'earth', x: 205, y: 650 },
        { t: 'wire', pts: [[240, 554], [240, 575], [269, 604]] }, { t: 'line', x1: 285, y1: 554, x2: 285, y2: 596 }, { t: 'wire', pts: [[330, 554], [330, 575], [301, 604]] },
        { t: 'motor', x: 285, y: 620, s: 'M2' },
        { t: 'wire', pts: [[309, 620], [370, 620]] }, { t: 'dot', x: 370, y: 620 }, { t: 'line', x1: 370, y1: 554, x2: 370, y2: 650 }, { t: 'earth', x: 370, y: 650 },

        // 제어회로 모선
        { t: 'line', x1: 395, y1: 80, x2: 460, y2: 80 }, { t: 'line', x1: 500, y1: 80, x2: 1440, y2: 80 }, { t: 'line', x1: 385, y1: 700, x2: 1440, y2: 700 },
        { t: 'item', id: 'eocrNC' },
        // 세로 배선
        { t: 'line', x1: 430, y1: 80, x2: 430, y2: 566 }, { t: 'line', x1: 430, y1: 614, x2: 430, y2: 700 },
        { t: 'wire', pts: [[430, 300], [530, 300], [530, 340]] },
        { t: 'line', x1: 530, y1: 380, x2: 530, y2: 566 }, { t: 'line', x1: 530, y1: 614, x2: 530, y2: 700 },
        { t: 'line', x1: 530, y1: 430, x2: 680, y2: 430 },
        { t: 'line', x1: 600, y1: 430, x2: 600, y2: 470 }, { t: 'line', x1: 600, y1: 510, x2: 600, y2: 566 }, { t: 'line', x1: 600, y1: 614, x2: 600, y2: 700 },
        { t: 'line', x1: 680, y1: 430, x2: 680, y2: 470 }, { t: 'line', x1: 680, y1: 510, x2: 680, y2: 568 }, { t: 'line', x1: 680, y1: 612, x2: 680, y2: 700 },
        { t: 'wire', pts: [[880, 300], [760, 300], [760, 566]] }, { t: 'line', x1: 760, y1: 614, x2: 760, y2: 700 },
        { t: 'line', x1: 880, y1: 80, x2: 880, y2: 125 }, { t: 'line', x1: 880, y1: 165, x2: 880, y2: 340 }, { t: 'line', x1: 880, y1: 380, x2: 880, y2: 566 }, { t: 'line', x1: 880, y1: 614, x2: 880, y2: 700 },
        { t: 'line', x1: 980, y1: 80, x2: 980, y2: 125 }, { t: 'line', x1: 980, y1: 165, x2: 980, y2: 225 }, { t: 'line', x1: 980, y1: 265, x2: 980, y2: 340 },
        { t: 'line', x1: 980, y1: 380, x2: 980, y2: 470 }, { t: 'line', x1: 980, y1: 510, x2: 980, y2: 566 }, { t: 'line', x1: 980, y1: 614, x2: 980, y2: 700 },
        { t: 'wire', pts: [[980, 300], [1078, 300], [1078, 340]] }, { t: 'line', x1: 1078, y1: 380, x2: 1078, y2: 430 }, { t: 'line', x1: 980, y1: 430, x2: 1250, y2: 430 },
        { t: 'line', x1: 1160, y1: 80, x2: 1160, y2: 125 }, { t: 'line', x1: 1160, y1: 165, x2: 1160, y2: 566 }, { t: 'line', x1: 1160, y1: 614, x2: 1160, y2: 700 },
        { t: 'line', x1: 1250, y1: 430, x2: 1250, y2: 470 }, { t: 'line', x1: 1250, y1: 510, x2: 1250, y2: 566 }, { t: 'line', x1: 1250, y1: 614, x2: 1250, y2: 700 },
        { t: 'line', x1: 1330, y1: 80, x2: 1330, y2: 125 }, { t: 'line', x1: 1330, y1: 165, x2: 1330, y2: 566 }, { t: 'line', x1: 1330, y1: 614, x2: 1330, y2: 700 },
        { t: 'line', x1: 1440, y1: 80, x2: 1440, y2: 125 }, { t: 'line', x1: 1440, y1: 165, x2: 1440, y2: 566 }, { t: 'line', x1: 1440, y1: 614, x2: 1440, y2: 700 },
        // FLS 전극 → TB4
        { t: 'wire', pts: [[782, 602], [783, 602], [783, 745]] }, { t: 'wire', pts: [[784, 591], [815, 591], [815, 745]] }, { t: 'wire', pts: [
          [
            782,
            580
          ],
          [
            825,
            580
          ],
          [
            825,
            652
          ],
          [
            847,
            652
          ],
          [
            847,
            745
          ]
        ] },
        { t: 'dot', x: 847, y: 722 }, { t: 'wire', pts: [[847, 722], [866, 722]] }, { t: 'earth', x: 866, y: 722 },
        { t: 'rect', x: 770, y: 735, w: 90, h: 20 }, { t: 'text', x: 736, y: 750, s: 'TB4', size: 13 },
        { t: 'term', x: 783, y: 745 }, { t: 'text', x: 783, y: 772, s: 'E1', size: 11, anchor: 'middle' },
        { t: 'term', x: 815, y: 745 }, { t: 'text', x: 815, y: 772, s: 'E2', size: 11, anchor: 'middle' },
        { t: 'term', x: 847, y: 745 }, { t: 'text', x: 847, y: 772, s: 'E3', size: 11, anchor: 'middle' },
        // 접점·코일 기호 (items 순서)
        { t: 'items' },
        { t: 'line', x1: 899, y1: 145, x2: 977, y2: 145, dash: true },
        // 접속점
        { t: 'dot', x: 430, y: 80 }, { t: 'dot', x: 880, y: 80 }, { t: 'dot', x: 980, y: 80 }, { t: 'dot', x: 1160, y: 80 }, { t: 'dot', x: 1330, y: 80 },
        { t: 'dot', x: 430, y: 300 }, { t: 'dot', x: 880, y: 300 }, { t: 'dot', x: 980, y: 300 }, { t: 'dot', x: 530, y: 430 }, { t: 'dot', x: 600, y: 430 },
        { t: 'dot', x: 980, y: 430 }, { t: 'dot', x: 1078, y: 430 }, { t: 'dot', x: 1160, y: 430 },
        { t: 'dot', x: 430, y: 700 }, { t: 'dot', x: 530, y: 700 }, { t: 'dot', x: 600, y: 700 }, { t: 'dot', x: 680, y: 700 }, { t: 'dot', x: 760, y: 700 },
        { t: 'dot', x: 880, y: 700 }, { t: 'dot', x: 980, y: 700 }, { t: 'dot', x: 1160, y: 700 }, { t: 'dot', x: 1250, y: 700 }, { t: 'dot', x: 1330, y: 700 }
      ]
    }
  };
})(typeof window === 'undefined' ? globalThis : window);
