/*
 * 결선하기 — 실물 기구 단자 배치 라이브러리 (2026-09-26, 요청 0028)
 * ------------------------------------------------------------------
 * device-library.js 는 "핀 번호와 역할"(L1, 96, a1 …)을, 이 파일은 "제어판에서 그 단자가 어디에 있는지"만 적는다.
 * device-library.js 는 고치지 않는다. 핀 이름·역할이 필요하면 그 파일을 읽는다.
 *
 * 좌표: 기구 네모(x, y, w, h — mm) 안의 비율. rows[].at = 위에서 몇 % 높이, 단자는 가로로 고르게 놓는다.
 * dir  : 선이 나가는 쪽('up' | 'down'). 결선 그림에서 선을 어느 통로로 돌릴지 정할 때 쓴다.
 *
 * 규칙(핀번호 적기 소켓 그림과 같음)
 *   socket-12p : 윗줄 1~6, 아랫줄 7~12 (홈이 아래)
 *   socket-8p  : 윗줄 6·5·4·3, 아랫줄 7·8·1·2
 *   mccb-3p    : 위 1·2·3(전원측), 아래 7·8·9(부하측)
 *   fuse-2p    : 위 1·2(1차: 왼쪽 L1, 오른쪽 L3), 아래 3·4(2차: 왼쪽 L1, 오른쪽 L3)
 *   tb-strip   : 제어함 단자대(10P+10P). 칸마다 바깥쪽(ext)·안쪽(int) 나사 두 개. place 'top' 이면 바깥쪽이 위
 *   tb         : 외부·승강기 단자대. pins 를 데이터에서 받는다(['L1','L2','L3','PE'] 등)
 *   lamp·bz    : 1·2 · pb : N·C(b접점) 또는 N·O(a접점) · ss : SS(M쪽)·M·SS(A쪽)·A
 */
(function (root) {
  'use strict';

  var types = {
    'socket-12p': { name: '12P 소켓', rows: [{ at: 0.11, dir: 'up', pins: ['1', '2', '3', '4', '5', '6'] }, { at: 0.89, dir: 'down', pins: ['7', '8', '9', '10', '11', '12'] }] },
    'socket-8p': { name: '8P 소켓', rows: [{ at: 0.11, dir: 'up', pins: ['6', '5', '4', '3'] }, { at: 0.89, dir: 'down', pins: ['7', '8', '1', '2'] }] },
    'mccb-3p': { name: '배선용 차단기', rows: [{ at: 0.12, dir: 'up', pins: ['1', '2', '3'] }, { at: 0.88, dir: 'down', pins: ['7', '8', '9'] }],
      names: { '1': '위(전원측) 1 · L1', '2': '위(전원측) 2 · L2', '3': '위(전원측) 3 · L3', '7': '아래(부하측) 7 · L1', '8': '아래(부하측) 8 · L2', '9': '아래(부하측) 9 · L3' } },
    'fuse-2p': { name: '퓨즈홀더(2P)', rows: [{ at: 0.1, dir: 'up', pins: ['1', '2'] }, { at: 0.9, dir: 'down', pins: ['3', '4'] }],
      names: { '1': '1차 왼쪽(L1)', '2': '1차 오른쪽(L3)', '3': '2차 왼쪽(L1)', '4': '2차 오른쪽(L3)' } },
    'lamp': { name: '램프', pins: ['1', '2'] },
    'bz': { name: '부저', pins: ['1', '2'] },
    'pb': { name: '푸시버튼', pinsByKind: { a: ['N', 'O'], b: ['N', 'C'] } },
    'ls': { name: '리밋스위치', pins: ['1', '2'] },
    'ss': { name: '셀렉터 스위치', pins: ['SS#ssM', 'M', 'SS#ssA', 'A'],
      names: { 'SS#ssM': 'SS 공통(M쪽 N)', 'M': 'SS M(C)', 'SS#ssA': 'SS 공통(A쪽 N)', 'A': 'SS A(O)' }, nameHasTag: true },
    'tb': { name: '단자대' },
    'tb-strip': { name: '단자대(10P+10P)' }
  };

  /* 기구 하나의 단자 목록 → [{ pin, x, y, dir, side? }] (판 좌표 mm)
   * dev: { type, x, y, w, h, pins?, kind?, termSide?('top'|'bottom'), place?('top'|'bottom'), n? } */
  function terminals(dev, opts) {
    var t = types[dev.type], out = [];
    if (!t) return out;
    var x = dev.x, y = dev.y, w = dev.w, h = dev.h;
    function rowAt(pins, at, dir, side) {
      pins.forEach(function (p, i) { out.push({ pin: p, x: x + w * (i + 0.5) / pins.length, y: y + h * at, dir: dir, side: side }); });
    }
    if (opts && opts.physicalContacts && (dev.type === 'pb' || dev.type === 'ss')) {
      contactRows(dev).forEach(function (r, j) {
        r.pins.forEach(function (p, i) { out.push({ pin: p, x: x + w * (i ? .8 : .2), y: y + h * (j ? .81 : .47), dir: j ? 'down' : 'up', contact: r.name }); });
      });
      return out;
    }
    if (t.rows) { t.rows.forEach(function (r) { rowAt(r.pins, r.at, r.dir); }); return out; }
    if (dev.type === 'tb-strip' || dev.type === 'tb') {
      var pins = dev.pins || (function () { var a = []; for (var i = 1; i <= (dev.n || 20); i++) a.push(String(i)); return a; })();
      var top = dev.place !== 'bottom';           // top: 바깥쪽(ext)이 위
      if (dev.sides === false) { rowAt(pins, 0.5, dev.dir || 'down'); return out; }
      rowAt(pins, 0.25, 'up', top ? 'ext' : 'int');
      rowAt(pins, 0.75, 'down', top ? 'int' : 'ext');
      return out;
    }
    var list = dev.pins || t.pins || (t.pinsByKind && t.pinsByKind[dev.kind || 'a']) || [];
    var bottom = dev.termSide !== 'top';
    rowAt(list, bottom ? 0.86 : 0.14, bottom ? 'down' : 'up');
    return out;
  }

  /* 사람이 읽는 단자 이름. devLib = window.PIN_DEVICE_LIBRARY (소켓 기구의 L1·96 같은 표시를 붙인다) */
  function pinName(dev, pin, devLib, circuitType) {
    var t = types[dev.type] || {};
    if (t.names && t.names[pin]) return t.names[pin];
    if (dev.type === 'tb-strip') return pin + '번';
    if (circuitType && devLib && devLib.types[circuitType]) {
      var p = devLib.types[circuitType].pins[pin];
      if (p && p.mark) return pin + '번(' + p.mark + ')';
    }
    if (/^socket-/.test(dev.type)) return pin + '번';
    return pin;
  }

  // 결선 전용. 기본 terminals()와 핀번호/단자대의 논리 ID는 그대로 둔다.
  function contactRows(dev) {
    if (dev.type === 'ss') return [{ name: 'NC', pins: ['SS#ssM', 'M'] }, { name: 'NO', pins: ['SS#ssA', 'A'] }];
    return [{ name: 'NC', pins: dev.kind === 'b' ? ['N', 'C'] : ['NC-L', 'NC-R'] }, { name: 'NO', pins: dev.kind === 'b' ? ['NO-L', 'NO-R'] : ['N', 'O'] }];
  }
  function contactName(dev, pin) {
    var name = pin;
    contactRows(dev).forEach(function (r) { var i = r.pins.indexOf(pin); if (i >= 0) name = r.name + (i ? ' 오른쪽' : ' 왼쪽'); });
    return name;
  }
  var api = { types: types, terminals: terminals, pinName: pinName, contactRows: contactRows, contactName: contactName };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PANEL_LIBRARY = api;
})(typeof window === 'undefined' ? globalThis : window);
