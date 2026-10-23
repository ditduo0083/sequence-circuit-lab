/*
 * 핀번호 적기 - 기구 라이브러리 (초안 v0.1, 2026-09-20)
 * ------------------------------------------------------------------
 * 상태: 초안. 데이터 형식은 사용자 승인 전이다. 웹 페이지에 아직 연결하지 않는다.
 * 원본: 한국산업인력공단 전기기능사 공개도면(2025-08-04) 9페이지
 *       "5) 기구의 내부 결선도 및 구성도"
 *       001~009번: 9개 기구 그림 / 010~018번: 6개 기구 그림 (그림 파일 바이트 동일 확인)
 * 원칙: 여기 들어간 핀 번호는 모두 원본 9페이지에서 육안으로 읽은 값이다.
 *       원본에 없는 번호(셀렉터 스위치, 푸시버튼, 램프, 부저, MCCB)는 넣지 않았다.
 *       기존 수업자료(pptx)에서 관찰한 번호 쓰는 방식은 사용자 확정 전까지 넣지 않는다.
 *
 * 읽는 법 (브라우저에서 <script src="device-library.js"></script> 로 읽는다. fetch 없음)
 *   window.PIN_DEVICE_LIBRARY.types['relay-8p'].pins['3']   -> 핀 정보
 *   window.PIN_DEVICE_LIBRARY.types['relay-8p'].contacts    -> 접점 목록(a/b, 공통단자)
 *
 * 고유 ID 규칙 (단자대/결선 단계도 같은 ID를 쓴다)
 *   기구 종류 ID : 'mc-12p' 처럼 소문자-하이픈. 바꾸지 않는다.
 *   핀 ID        : '<종류ID>:<핀번호>'            예) 'relay-8p:3'
 *   접점 ID      : '<종류ID>/<접점키>'            예) 'relay-8p/set1-a'
 *   회로 안 기구 : '<회로번호>/<태그>'            예) '001/X'
 *   회로 안 핀   : '<회로번호>/<태그>:<핀번호>'   예) '001/X:3'
 *
 * needsReview: true 인 항목은 원본에서 읽었지만 해석에 판단이 들어간 것이다.
 */
(function (root) {
  'use strict';

  var SRC_A = '전기기능사-001-A4, 2025-08-04.pdf';   // 001~009 대표
  var SRC_B = '전기기능사-010-A4, 2025-08-04.pdf';   // 010~018 대표
  function src(pos, alsoB) {
    var s = [{ doc: SRC_A, page: 9, pos: pos, appliesTo: '001-009' }];
    if (alsoB) s.push({ doc: SRC_B, page: 9, pos: alsoB, appliesTo: '010-018' });
    return s;
  }

  var types = {

    /* ---------------- 12P 기구 ---------------- */
    'mc-12p': {
      name: '전자접촉기', socket: 'socket-12p',
      source: src('1행 1열 [전자접촉기]', '1행 1열 [전자접촉기]'),
      pins: {
        '1':  { mark: 'L1', role: 'main-line' },
        '2':  { mark: 'L2', role: 'main-line' },
        '3':  { mark: 'L3', role: 'main-line' },
        '4':  { mark: 'a1', role: 'aux-a' },
        '5':  { mark: 'b1', role: 'aux-b' },
        '6':  { mark: 'A1', role: 'coil' },
        '7':  { mark: 'U', mark2: 'X', role: 'main-load' },
        '8':  { mark: 'V', mark2: 'Y', role: 'main-load' },
        '9':  { mark: 'W', mark2: 'Z', role: 'main-load' },
        '10': { mark: 'a2', role: 'aux-a' },
        '11': { mark: 'b2', role: 'aux-b' },
        '12': { mark: 'A2', role: 'coil' }
      },
      contacts: [
        { key: 'main-1', kind: 'main', pins: ['1', '7'] },
        { key: 'main-2', kind: 'main', pins: ['2', '8'] },
        { key: 'main-3', kind: 'main', pins: ['3', '9'] },
        { key: 'aux-a',  kind: 'a',    pins: ['4', '10'] },
        { key: 'aux-b',  kind: 'b',    pins: ['5', '11'] }
      ],
      coil: { pins: ['6', '12'], label: '전원' }
    },

    'eocr-12p': {
      name: 'EOCR', socket: 'socket-12p',
      source: src('1행 2열 [EOCR]', '1행 2열 [EOCR]'),
      pins: {
        '1':  { mark: 'L1', role: 'main-line' },
        '2':  { mark: 'L2', role: 'main-line' },
        '3':  { mark: 'L3', role: 'main-line' },
        '4':  { mark: '96', role: 'trip-b' },
        '5':  { mark: '98', role: 'trip-a' },
        '6':  { mark: 'A1', role: 'power' },
        '7':  { mark: 'U', role: 'main-load' },
        '8':  { mark: 'V', role: 'main-load' },
        '9':  { mark: 'W', role: 'main-load' },
        '10': { mark: '95', role: 'trip-common' },
        '11': { mark: '97', role: 'trip-common' },
        '12': { mark: 'A2', role: 'power' }
      },
      contacts: [
        { key: 'main-1', kind: 'main', pins: ['1', '7'], note: 'EOCR 본체(CT) 관통' },
        { key: 'main-2', kind: 'main', pins: ['2', '8'] },
        { key: 'main-3', kind: 'main', pins: ['3', '9'] },
        { key: 'trip-b', kind: 'b', pins: ['10', '4'], common: '10', symbol: 'overload' },
        { key: 'trip-a', kind: 'a', pins: ['11', '5'], common: '11', symbol: 'overload' }
      ],
      internalLinks: [
        { pins: ['10', '11'], note: '그림에서 10(95)과 11(97) 아래쪽이 점(●)과 선으로 연결됨', needsReview: true }
      ],
      coil: { pins: ['6', '12'], label: '전원' }
    },

    /* ---------------- 8P 기구 (원형 그림, 키 홈이 아래) ---------------- */
    'timer-8p': {
      name: '타이머', socket: 'socket-8p',
      source: src('2행 1열 [타이머]', '2행 1열 [타이머]'),
      pins: {
        '1': { role: 'instant-contact' },
        '2': { role: 'power' },
        '3': { role: 'instant-contact' },
        '4': { role: 'unused', note: '그림에 연결선 없음' },
        '5': { role: 'delay-contact' },
        '6': { role: 'delay-contact' },
        '7': { role: 'power' },
        '8': { role: 'delay-common' }
      },
      contacts: [
        { key: 'instant-a', kind: 'a', timing: 'instant', pins: ['1', '3'], note: '왼쪽 세로 접점(순시 a)' },
        { key: 'delay-b',   kind: 'b', timing: 'delay',   pins: ['8', '5'], common: '8' },
        { key: 'delay-a',   kind: 'a', timing: 'delay',   pins: ['8', '6'], common: '8' }
      ],
      coil: { pins: ['2', '7'], label: 'AC 220V' }
    },

    'flicker-8p': {
      name: '플리커릴레이', socket: 'socket-8p', groups: ['001-009'],
      source: src('2행 2열 [플리커릴레이]'),
      pins: {
        '1': { role: 'unused' }, '2': { role: 'power' }, '3': { role: 'unused' },
        '4': { role: 'unused' }, '5': { role: 'flicker-contact' }, '6': { role: 'flicker-contact' },
        '7': { role: 'power' }, '8': { role: 'flicker-common' }
      },
      contacts: [
        { key: 'fl-b', kind: 'b', pins: ['8', '5'], common: '8', symbol: 'flicker' },
        { key: 'fl-a', kind: 'a', pins: ['8', '6'], common: '8', symbol: 'flicker' }
      ],
      coil: { pins: ['2', '7'], label: 'AC 220V' }
    },

    'relay-8p': {
      name: '8P 릴레이', socket: 'socket-8p',
      source: src('3행 1열 [8P 릴레이]', '2행 2열 [8P 릴레이]'),
      pins: {
        '1': { role: 'set1-common' }, '2': { role: 'coil' }, '3': { role: 'set1' }, '4': { role: 'set1' },
        '5': { role: 'set2' }, '6': { role: 'set2' }, '7': { role: 'coil' }, '8': { role: 'set2-common' }
      },
      contacts: [
        { key: 'set1-b', kind: 'b', pins: ['1', '4'], common: '1', set: 1 },
        { key: 'set1-a', kind: 'a', pins: ['1', '3'], common: '1', set: 1 },
        { key: 'set2-b', kind: 'b', pins: ['8', '5'], common: '8', set: 2 },
        { key: 'set2-a', kind: 'a', pins: ['8', '6'], common: '8', set: 2 }
      ],
      coil: { pins: ['2', '7'], label: 'AC 220V' }
    },

    'fls-8p': {
      name: '플로트레스 스위치', socket: 'socket-8p', groups: ['001-009'],
      source: src('3행 2열 [플로트레스 스위치]'),
      pins: {
        '1': { role: 'electrode', mark: 'E3', note: '접지 기호와 연결' },
        '2': { role: 'out' }, '3': { role: 'out' }, '4': { role: 'out-common' },
        '5': { role: 'power' }, '6': { role: 'power' },
        '7': { role: 'electrode', mark: 'E1' },
        '8': { role: 'electrode', mark: 'E2' }
      },
      contacts: [
        { key: 'out-a', kind: 'a', pins: ['4', '3'], common: '4' },
        { key: 'out-b', kind: 'b', pins: ['4', '2'], common: '4' }
      ],
      coil: { pins: ['5', '6'], label: 'AC 220V (5·6 오른쪽 위)' },
      electrodes: { E1: '7', E2: '8', E3: '1' },
      earth: { pin: '1' }
    },

    /* ---------------- 번호가 원본에 없는 기구 ---------------- */
    'ss-2pos': {
      name: '셀렉터 스위치', socket: null, groups: ['001-009'],
      source: src('3행 3열 [셀렉터 스위치]'),
      positions: { left: 'M (수동)', right: 'A (자동)', bottomMark: '하측부 ▲' },
      pins: {},
      contacts: [],
      needsReview: true,
      note: '원본 9페이지에는 단자 번호가 없다. 지급재료 목록(11페이지)에 "25∅, 1a1b"만 있다. 번호 규칙은 사용자 결정 대기.'
    },

    /* 리밋스위치 (010~018, TB4로 나감) — 2026-09-21 추가 */
    'ls-2p': {
      name: '리밋스위치', socket: null, groups: ['010-018'],
      source: [{ decision: '작성자 결정 2026-09-21', appliesTo: '010-018' },
               { doc: SRC_B, page: 7, pos: '시퀀스 회로도 LS1·LS2 (010~018 모두 a접점, 육안 확인)' }],
      pins: {
        '1': { role: 'contact', note: '위 칸 (가로면 왼쪽)' },
        '2': { role: 'contact', note: '아래 칸 (가로면 오른쪽)' }
      },
      contacts: [
        { key: 'a', kind: 'a', pins: ['1', '2'] }
      ],
      tb: 'TB4',
      needsReview: true,
      note: '9쪽 기구 그림이 없다. 기구에 번호가 적혀 있지 않고 선은 TB4 단자대(LS1, LS2 순서)로 나간다. ' +
            '핀 칸에는 위 1·아래 2를 적는다(선생님 규칙, 램프와 같은 방식). LS1·LS2 모두 같은 정답이다. ' +
            '010 페이지를 만든 뒤 선생님이 한 번 눌러 보고 확인하면 needsReview 를 뗀다.'
    }
  };

  /* ---------------- 소켓(베이스) 배치 ---------------- */
  var sockets = {
    'socket-12p': {
      name: '12P 소켓(베이스)',
      source: src('1행 3열 [12P 소켓(베이스) 구성도]', '1행 3열 [12P 소켓(베이스) 구성도]'),
      // 그림을 정면에서 본 순서, 왼쪽 -> 오른쪽
      rows: { top: ['1', '2', '3', '4', '5', '6'], bottom: ['7', '8', '9', '10', '11', '12'] },
      bottomMark: '하측부 ▲ (오른쪽 아래, 12번 아래)',
      keyGroove: 'bottom',
      centerHoles: 12,
      note: '가운데 원의 12개 구멍에는 번호가 없다.'
    },
    'socket-8p': {
      name: '8P 소켓(베이스)',
      source: src('2행 3열 [8P 소켓(베이스) 구성도]', '2행 3열 [8P 소켓(베이스) 구성도]'),
      rows: { top: ['6', '5', '4', '3'], bottom: ['7', '8', '1', '2'] },
      bottomMark: '하측부 ▲ (오른쪽 아래, 2번 아래)',
      keyGroove: 'bottom',
      centerHoles: 8,
      note: '윗줄이 오른쪽에서 왼쪽으로 3-4-5-6, 아랫줄이 7-8-1-2 이다. 유의사항 20): 8P 기구는 모두 같은 8P 소켓을 쓴다.'
    }
  };

  /* 8P 기구 원형 그림의 핀 위치(키 홈 아래, 정면). 재작도용. 시계 방향 읽기. */
  var pinFace8 = {
    source: src('2행 1열·2행 2열·3행 1열·3행 2열 원형 그림'),
    order: ['1', '2', '3', '4', '5', '6', '7', '8'],
    // 대략 위치: 1 아래-왼쪽, 2 왼쪽-아래, 3 왼쪽-위, 4 위-왼쪽, 5 위-오른쪽, 6 오른쪽-위, 7 오른쪽-아래, 8 아래-오른쪽
    approx: {
      '1': 'bottom-left', '2': 'left-lower', '3': 'left-upper', '4': 'top-left',
      '5': 'top-right', '6': 'right-upper', '7': 'right-lower', '8': 'bottom-right'
    },
    keyGroove: 'bottom (가운데 원 아래 홈)',
    needsReview: true,
    note: '각도는 그림 비율로만 읽은 근사치. 재작도할 때 원본과 겹쳐서 확인 필요.'
  };

  root.PIN_DEVICE_LIBRARY = {
    version: '0.1-draft',
    date: '2026-09-20',
    status: 'draft-awaiting-approval',
    types: types,
    sockets: sockets,
    pinFace8: pinFace8,
    pinId: function (typeId, pin) { return typeId + ':' + pin; }
  };
})(typeof window === 'undefined' ? globalThis : window);
