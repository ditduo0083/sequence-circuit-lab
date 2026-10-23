/*
 * 핀번호 적기 v2 — 002번 회로 데이터 (2026-09-21)
 * ------------------------------------------------------------------
 * 원본: 전기기능사-002-A4, 2025-08-04.pdf 6·7·9쪽 (원본 그림은 넣지 않는다. 좌표는 우리 방식으로 새로 잡은 것)
 * 초안: 검사/앱에서_초안뽑기.cjs 002 로 회로 앱에서 뽑은 뒤 원본 7쪽과 한 줄씩 대조해 고쳤다.
 * 앱과 다른 점: ssM 은 원본대로 b접점(앱은 a). 작성자 결정(D0006-2) — 앱은 그대로 둔다.
 * 주회로(TB1·MCCB·EOCR·MC1·MC2·TB2·TB3)는 001과 같아서 001의 그림을 그대로 쓴다.
 * 형식 설명은 circuit-001.js 머리말을 본다.
 */
(function (root) {
  'use strict';
  var C = root.PIN_CIRCUITS = root.PIN_CIRCUITS || {};
  C['002'] = {
    id: '002',
    title: '전기기능사 002 · 핀번호 적기',
    subject: '전기기능사',
    source: { doc: '전기기능사-002-A4, 2025-08-04.pdf', legendPage: 6, circuitPage: 7, devicePage: 9 },
    app: { folder: '002_지연후_교대운전' },

    devices: {
      MC1: { type: 'mc-12p' }, MC2: { type: 'mc-12p' }, EOCR: { type: 'eocr-12p' },
      X: { type: 'relay-8p' }, T: { type: 'timer-8p' }, FR: { type: 'flicker-8p' }, FLS: { type: 'fls-8p' },
      SS: { type: null, cat: 'ss' }, PB0: { type: null, cat: 'pb' }, PB1: { type: null, cat: 'pb' },
      YL: { type: null, cat: 'lamp' }, GL: { type: null, cat: 'lamp' }, RL: { type: null, cat: 'lamp' },
      BZ: { type: null, cat: 'lamp' }, MCCB: { type: null, cat: 'main' }
    },

    answerKey: {
      eocrNC: ['10', '4'], eocrNO: ['10', '5'],
      ssA: ['SS', 'A'], ssM: ['SS', 'M'],
      pb0: ['N', 'C'], pb1: ['N', 'O'],
      flsContact: ['4', '3'],
      // X: 두 접점 모두 a. 선생님 방법대로 먼저 적는 자기유지(PB1 옆) 1–3, 다음(윗줄) 8–6. 순서를 바꿔 적어도 정답
      xHold: ['1', '3'], xNO: ['8', '6'],
      tDelay: ['8', '6'],
      // FR: 공통 8을 두 접점이 같은 점(FR 코일 위)에서 함께 쓴다. b 8–5(MC1), a 8–6(MC2)
      frMC1: ['8', '5'], frMC2: ['8', '6'],
      mc1Aux: ['4', '10'], mc2Aux: ['4', '10'],
      'coil-EOCR': ['6', '12'], 'coil-YL': ['1', '2'], 'coil-BZ': ['1', '2'], 'coil-FLS': ['5', '6'],
      'coil-X': ['2', '7'], 'coil-T': ['2', '7'], 'coil-FR': ['2', '7'],
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

    deepText: '002 회로에서 FR의 b접점(MC1 위)과 a접점(MC2 위)은 위 끝이 <b>같은 점</b>(FR 코일 위)이에요. 그래서 플리커릴레이의 공통 8 하나로 두 접점을 함께 쓰고, b는 8–5, a는 8–6으로 적어요. 8번 단자에서 선 하나만 나가도 두 접점이 모두 동작해요.',

    synopsis: {
      text: "MCCB를 투입하고 EOCR이 정상일 때 운전 b접점을 거쳐 제어 전원이 공급된다. SS를 A에 두면 FLS가 수위를 감시하고, 감지 접점이 닫히면 X와 T가 함께 여자된다. SS를 M에 두고 PB1을 누를 때도 X와 T가 여자되며, X의 자기유지 a접점이 버튼을 놓은 뒤 계시를 이어 준다. X의 다른 a접점은 운전선을 준비하지만 T의 한시 a접점이 열려 있는 동안 두 전동기는 정지한다. T의 설정시간이 끝나면 한시 a접점이 닫혀 FR이 여자된다. 처음에는 FR b접점으로 MC1·M1·RL이 동작하고, FR이 전환되면 a접점으로 MC2·M2·GL이 동작한다. 이후 두 전동기는 FR 간격에 따라 교대한다. 자동 감지 해제나 수동 PB0 누름은 X·T·FR을 복귀시켜 운전을 멈춘다. EOCR이 과부하를 검출하면 운전 b접점이 열리고 경보 a접점이 닫혀 YL과 BZ가 함께 동작한다.",
      verified: true
    },
    interpretQuestions: [
      {"id":"q1","prompt":"자동에서 수위를 감지하면 X와 T에 전원을 보내는 접점은?","answerItemIds":["flsContact"],"multi":false,"explain":"FLS a접점이 닫혀 X·T 공급점이 통전돼요."},
      {"id":"q2","prompt":"수동에서 PB1을 놓은 뒤에도 X와 T를 유지하는 접점은?","answerItemIds":["xHold"],"multi":false,"explain":"PB1과 병렬인 X a접점이 유지 경로예요."},
      {"id":"q3","prompt":"X가 여자되어 운전선의 전원을 이어 주는 접점은?","answerItemIds":["xNO"],"multi":false,"explain":"윗줄의 X a접점이 T 한시 접점 앞까지 전원을 보내요."},
      {"id":"q4","prompt":"초기 대기 시간이 끝난 뒤 FR을 기동시키는 접점은?","answerItemIds":["tDelay"],"multi":false,"explain":"T 한시 a접점은 설정시간이 지나야 닫혀요."},
      {"id":"q5","prompt":"FR의 첫 구간에 M1을 운전시키는 접점은?","answerItemIds":["frMC1"],"multi":false,"explain":"FR b접점이 MC1에 전원을 보내요."},
      {"id":"q6","prompt":"FR이 전환된 뒤 M2를 운전시키는 접점은?","answerItemIds":["frMC2"],"multi":false,"explain":"FR a접점이 닫히면 MC2가 여자돼요."},
      {"id":"q7","prompt":"수동 운전을 멈추기 위해 누르는 접점은?","answerItemIds":["pb0"],"multi":false,"explain":"PB0 b접점이 열리면 자기유지가 풀려요."},
      {"id":"q8","prompt":"과부하 때 정상 운전 전원을 끊는 접점은?","answerItemIds":["eocrNC"],"multi":false,"explain":"EOCR b접점이 열려 운전 분기를 차단해요."},
      {"id":"q9","prompt":"EOCR 경보 접점으로 함께 전원을 받는 부하를 모두 고르세요.","answerItemIds":["coil-YL","coil-BZ"],"multi":true,"explain":"YL과 BZ는 같은 경보 공급점에 연결돼요."}
    ],

    layout: {
      viewBox: [1500, 810],
      coilY: 590,

      main: [
        { tag: 'MCCB', xs: [70, 115, 160], slotY: [80, 160], optional: true },
        { tag: 'EOCR', xs: [70, 115, 160], slotY: [236, 301] },
        { tag: 'MC1', xs: [70, 115, 160], slotY: [400, 480] },
        { tag: 'MC2', xs: [240, 285, 330], slotY: [400, 480] }
      ],

      items: [
        { id: 'eocrNC', cat: 'contact', tag: 'EOCR', kind: 'b', feat: 'ovl', horiz: true, x1: 460, x2: 500, y: 80, label: 'EOCR',
          title: 'EOCR 접점 (맨 위 가로, b접점)', slots: [{ x: 460, y: 56, net: 'H' }, { x: 500, y: 56, net: 'R' }] },
        { id: 'eocrNO', cat: 'contact', tag: 'EOCR', kind: 'a', feat: 'ovl', x: 530, rows: [340, 380], nets: ['H', 'ALM'], label: 'EOCR', title: 'EOCR 접점 (a접점, YL·BZ 위)' },
        { id: 'ssA', cat: 'ss', tag: 'SS', kind: 'a', feat: 'ss', x: 810, rows: [125, 165], nets: ['R', 'AUTO'], label: '', sub: 'A', title: 'SS 자동(A)쪽 접점' },
        { id: 'ssM', cat: 'ss', tag: 'SS', kind: 'b', feat: 'ss', x: 910, rows: [125, 165], nets: ['R', 'MS'], label: 'SS', sub: 'M', title: 'SS 수동(M)쪽 접점',
          appKind: 'a', appKindNote: '원본은 b접점 기호, 앱은 a접점 기호. 핀 번호·채점은 a/b와 무관. 작성자 결정(D0006-2): 앱은 그대로 둔다' },
        { id: 'pb0', cat: 'pb', tag: 'PB0', kind: 'b', feat: 'pb', x: 910, rows: [225, 265], nets: ['MS', 'MAN'], label: 'PB0', title: 'PB0 (b접점, 적색)' },
        { id: 'flsContact', cat: 'contact', tag: 'FLS', kind: 'a', feat: '', x: 810, rows: [340, 380], nets: ['AUTO', 'XT'], label: 'FLS', title: 'FLS 접점 (a접점)' },
        { id: 'pb1', cat: 'pb', tag: 'PB1', kind: 'a', feat: 'pb', x: 910, rows: [340, 380], nets: ['MAN', 'XT'], label: 'PB1', title: 'PB1 (a접점, 녹색)' },
        { id: 'xHold', cat: 'contact', tag: 'X', kind: 'a', feat: '', x: 1000, rows: [340, 380], nets: ['MAN', 'XT'], label: 'X', title: 'X 접점 (PB1 옆 자기유지, a접점)' },
        { id: 'xNO', cat: 'contact', tag: 'X', kind: 'a', feat: '', x: 1090, rows: [125, 165], nets: ['R', 'XO'], label: 'X', title: 'X 접점 (윗줄, a접점)' },
        { id: 'tDelay', cat: 'contact', tag: 'T', kind: 'a', timing: 'delay', feat: 'td', x: 1090, rows: [225, 265], nets: ['XO', 'FRc'], label: 'T', title: 'T 접점 (X 아래, 한시 a접점)' },
        { id: 'frMC1', cat: 'contact', tag: 'FR', kind: 'b', feat: 'fl', x: 1180, rows: [470, 510], nets: ['FRc', 'M1c'], label: 'FR', title: 'FR 접점 (MC1 위, b접점)' },
        { id: 'frMC2', cat: 'contact', tag: 'FR', kind: 'a', feat: 'fl', x: 1270, rows: [470, 510], nets: ['FRc', 'M2c'], label: 'FR', title: 'FR 접점 (MC2 위, a접점)' },
        { id: 'mc1Aux', cat: 'contact', tag: 'MC1', kind: 'a', feat: '', x: 1340, rows: [125, 165], nets: ['R', 'RLc'], label: 'MC1', title: 'MC1 보조 접점 (RL 위, a접점)' },
        { id: 'mc2Aux', cat: 'contact', tag: 'MC2', kind: 'a', feat: '', x: 1440, rows: [125, 165], nets: ['R', 'GLc'], label: 'MC2', title: 'MC2 보조 접점 (GL 위, a접점)' },
        { id: 'coil-EOCR', cat: 'coil', tag: 'EOCR', x: 430, nets: ['H', 'N'], title: 'EOCR 코일' },
        { id: 'coil-YL', cat: 'lamp', tag: 'YL', x: 530, nets: ['ALM', 'N'], title: 'YL 램프' },
        { id: 'coil-BZ', cat: 'lamp', tag: 'BZ', x: 610, shape: 'rect', nets: ['ALM', 'N'], title: 'BZ 부저' },
        { id: 'coil-FLS', cat: 'coil', tag: 'FLS', x: 670, nets: ['AUTO', 'N'], title: 'FLS 전원' },
        { id: 'coil-X', cat: 'coil', tag: 'X', x: 810, nets: ['XT', 'N'], title: 'X 코일' },
        { id: 'coil-T', cat: 'coil', tag: 'T', x: 910, nets: ['XT', 'N'], title: 'T 코일' },
        { id: 'coil-FR', cat: 'coil', tag: 'FR', x: 1090, nets: ['FRc', 'N'], title: 'FR 코일' },
        { id: 'coil-MC1', cat: 'coil', tag: 'MC1', x: 1180, nets: ['M1c', 'N'], title: 'MC1 코일' },
        { id: 'coil-MC2', cat: 'coil', tag: 'MC2', x: 1270, nets: ['M2c', 'N'], title: 'MC2 코일' },
        { id: 'coil-RL', cat: 'lamp', tag: 'RL', x: 1340, nets: ['RLc', 'N'], title: 'RL 램프' },
        { id: 'coil-GL', cat: 'lamp', tag: 'GL', x: 1440, nets: ['GLc', 'N'], title: 'GL 램프' },
        { id: 'fls-E', cat: 'flsE', tag: 'FLS', title: 'FLS 전극 → TB4 (E1·E2·E3)', slots: [{ x: 693, y: 792 }, { x: 725, y: 792 }, { x: 757, y: 792 }] }
      ],

      order: ['main-MCCB-0', 'main-MCCB-1', 'main-MCCB-2', 'main-EOCR-0', 'main-EOCR-1', 'main-EOCR-2',
        'main-MC1-0', 'main-MC1-1', 'main-MC1-2', 'main-MC2-0', 'main-MC2-1', 'main-MC2-2',
        'eocrNC', 'coil-EOCR', 'eocrNO', 'coil-YL', 'coil-BZ', 'coil-FLS', 'fls-E',
        'ssA', 'flsContact', 'coil-X', 'ssM', 'pb0', 'pb1', 'xHold', 'coil-T',
        'xNO', 'tDelay', 'coil-FR', 'frMC1', 'coil-MC1', 'frMC2', 'coil-MC2', 'mc1Aux', 'coil-RL', 'mc2Aux', 'coil-GL'],

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
        // EOCR 코일 · EOCR a → YL·BZ
        { t: 'line', x1: 430, y1: 80, x2: 430, y2: 566 }, { t: 'line', x1: 430, y1: 614, x2: 430, y2: 700 },
        { t: 'wire', pts: [[430, 300], [530, 300], [530, 340]] },
        { t: 'line', x1: 530, y1: 380, x2: 530, y2: 566 }, { t: 'line', x1: 530, y1: 614, x2: 530, y2: 700 },
        { t: 'wire', pts: [[530, 430], [610, 430], [610, 568]] }, { t: 'line', x1: 610, y1: 612, x2: 610, y2: 700 },
        // 자동(A) 계통: SS A → FLS 전원 · FLS 접점
        { t: 'line', x1: 810, y1: 80, x2: 810, y2: 125 }, { t: 'line', x1: 810, y1: 165, x2: 810, y2: 340 }, { t: 'line', x1: 810, y1: 380, x2: 810, y2: 566 }, { t: 'line', x1: 810, y1: 614, x2: 810, y2: 700 },
        { t: 'wire', pts: [[810, 300], [670, 300], [670, 566]] }, { t: 'line', x1: 670, y1: 614, x2: 670, y2: 700 },
        // 수동(M) 계통: SS M → PB0 → PB1 ∥ X
        { t: 'line', x1: 910, y1: 80, x2: 910, y2: 125 }, { t: 'line', x1: 910, y1: 165, x2: 910, y2: 225 }, { t: 'line', x1: 910, y1: 265, x2: 910, y2: 340 },
        { t: 'line', x1: 910, y1: 380, x2: 910, y2: 566 }, { t: 'line', x1: 910, y1: 614, x2: 910, y2: 700 },
        { t: 'wire', pts: [[910, 300], [1000, 300], [1000, 340]] }, { t: 'wire', pts: [[1000, 380], [1000, 430], [810, 430]] },
        // X a → T 한시 a → FR 코일 · FR b/a → MC1·MC2
        { t: 'line', x1: 1090, y1: 80, x2: 1090, y2: 125 }, { t: 'line', x1: 1090, y1: 165, x2: 1090, y2: 225 }, { t: 'line', x1: 1090, y1: 265, x2: 1090, y2: 566 }, { t: 'line', x1: 1090, y1: 614, x2: 1090, y2: 700 },
        { t: 'line', x1: 1090, y1: 430, x2: 1270, y2: 430 },
        { t: 'line', x1: 1180, y1: 430, x2: 1180, y2: 470 }, { t: 'line', x1: 1180, y1: 510, x2: 1180, y2: 566 }, { t: 'line', x1: 1180, y1: 614, x2: 1180, y2: 700 },
        { t: 'line', x1: 1270, y1: 430, x2: 1270, y2: 470 }, { t: 'line', x1: 1270, y1: 510, x2: 1270, y2: 566 }, { t: 'line', x1: 1270, y1: 614, x2: 1270, y2: 700 },
        // MC1 a → RL, MC2 a → GL
        { t: 'line', x1: 1340, y1: 80, x2: 1340, y2: 125 }, { t: 'line', x1: 1340, y1: 165, x2: 1340, y2: 566 }, { t: 'line', x1: 1340, y1: 614, x2: 1340, y2: 700 },
        { t: 'line', x1: 1440, y1: 80, x2: 1440, y2: 125 }, { t: 'line', x1: 1440, y1: 165, x2: 1440, y2: 566 }, { t: 'line', x1: 1440, y1: 614, x2: 1440, y2: 700 },
        // FLS 전극 → TB4
        { t: 'wire', pts: [[692, 602], [693, 602], [693, 745]] }, { t: 'wire', pts: [[694, 591], [725, 591], [725, 745]] }, { t: 'wire', pts: [[692, 580], [757, 580], [757, 745]] },
        { t: 'dot', x: 757, y: 722 }, { t: 'wire', pts: [[757, 722], [776, 722]] }, { t: 'earth', x: 776, y: 722 },
        { t: 'rect', x: 680, y: 735, w: 90, h: 20 }, { t: 'text', x: 646, y: 750, s: 'TB4', size: 13 },
        { t: 'term', x: 693, y: 745 }, { t: 'text', x: 693, y: 772, s: 'E1', size: 11, anchor: 'middle' },
        { t: 'term', x: 725, y: 745 }, { t: 'text', x: 725, y: 772, s: 'E2', size: 11, anchor: 'middle' },
        { t: 'term', x: 757, y: 745 }, { t: 'text', x: 757, y: 772, s: 'E3', size: 11, anchor: 'middle' },
        // 접점·코일 기호 (items 순서)
        { t: 'items' },
        { t: 'line', x1: 829, y1: 145, x2: 907, y2: 145, dash: true },
        // 접속점
        { t: 'dot', x: 430, y: 80 }, { t: 'dot', x: 810, y: 80 }, { t: 'dot', x: 910, y: 80 }, { t: 'dot', x: 1090, y: 80 }, { t: 'dot', x: 1340, y: 80 },
        { t: 'dot', x: 430, y: 300 }, { t: 'dot', x: 810, y: 300 }, { t: 'dot', x: 910, y: 300 }, { t: 'dot', x: 530, y: 430 },
        { t: 'dot', x: 810, y: 430 }, { t: 'dot', x: 910, y: 430 }, { t: 'dot', x: 1090, y: 430 }, { t: 'dot', x: 1180, y: 430 },
        { t: 'dot', x: 430, y: 700 }, { t: 'dot', x: 530, y: 700 }, { t: 'dot', x: 610, y: 700 }, { t: 'dot', x: 670, y: 700 }, { t: 'dot', x: 810, y: 700 },
        { t: 'dot', x: 910, y: 700 }, { t: 'dot', x: 1090, y: 700 }, { t: 'dot', x: 1180, y: 700 }, { t: 'dot', x: 1270, y: 700 }, { t: 'dot', x: 1340, y: 700 }
      ]
    }
  };
})(typeof window === 'undefined' ? globalThis : window);
