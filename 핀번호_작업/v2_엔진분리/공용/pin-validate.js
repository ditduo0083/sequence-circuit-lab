/*
 * 핀번호 적기 v2 — 회로 데이터 검사기 (2026-09-21)
 * 브라우저: 엔진이 시작할 때 자동으로 돌린다. 오류가 있으면 화면 맨 위에 빨간 상자로 보여 주고 멈춘다.
 * node   : 검사/검사하기.cjs 가 같은 함수를 쓴다.
 * 결과  : { errors: [문장], warnings: [문장] }  (모든 문장은 한글)
 */
(function (root) {
  'use strict';
  var SOCKET_CATS = { contact: 1, coil: 1 };
  var PLAIN_CATS = { pb: 1, ss: 1, lamp: 1 };
  var KINDS = { a: 1, b: 1 };
  var FEATS = { '': 1, ovl: 1, fl: 1, td: 1, pb: 1, ss: 1, ls: 1 };
  var TIMINGS = { instant: 1, delay: 1 };
  var CATS = { contact: 1, pb: 1, ss: 1, coil: 1, lamp: 1, main: 1, flsE: 1 };
  var PRIMS = { rect: 1, text: 1, term: 1, dot: 1, line: 1, wire: 1, breaker: 1, mc: 1, fuse: 1, motor: 1, earth: 1, item: 1, items: 1 };

  /* 엔진과 같은 규칙으로 칸 목록을 만든다 (엔진도 이 함수를 쓴다) */
  function buildItems(C) {
    var L = C.layout, items = [];
    (L.main || []).forEach(function (m) {
      (m.xs || []).forEach(function (x, i) {
        items.push({ id: 'main-' + m.tag + '-' + i, cat: 'main', tag: m.tag, pole: i, optional: !!m.optional,
          slots: [{ x: x, y: m.slotY[0] }, { x: x, y: m.slotY[1] }], title: m.tag + ' 주회로 ' + ['L1', 'L2', 'L3'][i] + '상' });
      });
    });
    (L.items || []).forEach(function (src) {
      var it = {}; for (var k in src) it[k] = src[k];
      if (it.rows) { it.yT = it.rows[0]; it.yB = it.rows[1]; }
      if (!it.slots) {
        if (it.cat === 'coil' || it.cat === 'lamp') {
          var cy = L.coilY, n = it.nets || [];
          it.slots = [{ x: it.x - 30, y: cy - 44, net: n[0] }, { x: it.x - 30, y: cy + 44, net: n[1] }];
        } else if (it.rows) {
          var nn = it.nets || [];
          it.slots = [{ x: it.x - 28, y: it.yT, net: nn[0] }, { x: it.x - 28, y: it.yB, net: nn[1] }];
        }
      } else {
        it.slots = it.slots.map(function (s) { var o = {}; for (var q in s) o[q] = s[q]; return o; });
      }
      items.push(it);
    });
    return items;
  }

  function validate(Lib, C) {
    var E = [], W = [];
    function err(m) { E.push(m); } function warn(m) { W.push(m); }
    if (!C || !C.id) { err('회로 데이터가 없거나 id가 없습니다.'); return { errors: E, warnings: W }; }
    if (!C.layout) { err('layout(그림·칸 정보)이 없습니다.'); return { errors: E, warnings: W }; }
    var L = C.layout, dev = C.devices || {}, key = C.answerKey || {};
    if (!L.viewBox || L.viewBox.length !== 2) err('layout.viewBox 는 [가로, 세로] 두 숫자여야 합니다.');
    if (typeof L.coilY !== 'number') err('layout.coilY(코일 중심 y)가 숫자가 아닙니다.');

    // 1. 기구
    Object.keys(dev).forEach(function (tag) {
      var d = dev[tag];
      if (d.type && !Lib.types[d.type]) err('기구 ' + tag + ': 라이브러리에 없는 종류 "' + d.type + '" 입니다. device-library.js 의 types 이름을 확인하세요.');
      if (!d.type && !d.cat) err('기구 ' + tag + ': type(라이브러리 종류)도 cat(번호 없는 기구 종류)도 없습니다.');
    });

    var items;
    try { items = buildItems(C); } catch (e) { err('칸 목록을 만들 수 없습니다: ' + e.message); return { errors: E, warnings: W }; }
    var byId = {};
    items.forEach(function (it) {
      if (byId[it.id]) err('칸 항목 id "' + it.id + '" 가 두 번 나옵니다.');
      byId[it.id] = it;
    });

    // 2. 항목별 검사
    items.forEach(function (it) {
      var where = '항목 ' + it.id + '(' + (it.title || it.tag) + ')';
      if (!CATS[it.cat]) { err(where + ': cat "' + it.cat + '" 은 쓸 수 없습니다. contact·pb·ss·coil·lamp·main·flsE 중 하나'); return; }
      if (it.cat !== 'main' && !dev[it.tag]) { err(where + ': devices 에 없는 기구 태그 "' + it.tag + '" 입니다.'); return; }
      if (it.cat === 'main' && it.tag !== 'MCCB' && !dev[it.tag]) err(where + ': devices 에 없는 기구 태그 "' + it.tag + '" 입니다.');
      var d = dev[it.tag] || {}, t = d.type && Lib.types[d.type];
      if (!it.title) warn(where + ': title(학생에게 보이는 이름)이 없습니다.');
      if (!it.slots || !it.slots.length) { err(where + ': 칸(slots)이 없습니다. rows 또는 slots 를 넣으세요.'); return; }
      it.slots.forEach(function (s, i) {
        if (typeof s.x !== 'number' || typeof s.y !== 'number') err(where + ' 칸 ' + (i + 1) + ': x·y 좌표가 숫자가 아닙니다.');
        else if (L.viewBox && (s.x < 15 || s.y < 10 || s.x > L.viewBox[0] - 15 || s.y > L.viewBox[1] - 10)) err(where + ' 칸 ' + (i + 1) + ': 그림 밖(' + s.x + ',' + s.y + ')에 있습니다.');
        if ((it.cat === 'contact' || it.cat === 'coil') && !s.net) err(where + ' 칸 ' + (i + 1) + ': net(전기적 점 이름)이 없습니다. 같은 선으로 이어진 단자는 같은 이름을 씁니다.');
      });
      if (it.cat === 'contact' || it.cat === 'pb' || it.cat === 'ss') {
        if (!KINDS[it.kind]) err(where + ': kind 는 "a" 또는 "b" 여야 합니다.');
        if (it.feat !== undefined && !FEATS[it.feat]) err(where + ': feat(접점 모양) "' + it.feat + '" 은 없습니다. 빈칸·ovl·fl·td·pb·ss·ls 중 하나');
        if (it.timing && !TIMINGS[it.timing]) err(where + ': timing 은 instant(순시) 또는 delay(한시) 입니다.');
        if (!it.horiz && !(it.rows && it.rows.length === 2 && it.rows[0] < it.rows[1])) err(where + ': rows 는 [위 단자 y, 아래 단자 y] (위 < 아래) 여야 합니다.');
      }
      if (it.cat === 'contact') {
        if (!t) { err(where + ': 기구 ' + it.tag + ' 는 라이브러리 종류가 없어 contact 로 쓸 수 없습니다. 번호 없는 기구는 pb·ss 를 쓰세요.'); return; }
        var cs = t.contacts.filter(function (c) { return c.kind === it.kind && (!it.timing || c.timing === it.timing); });
        if (!cs.length) err(where + ': ' + t.name + ' 에는 ' + (it.timing ? (it.timing === 'delay' ? '한시 ' : '순시 ') : '') + it.kind + '접점이 없습니다.');
        if (d.type === 'timer-8p' && !it.timing) err(where + ': 타이머 접점은 timing(instant 순시 / delay 한시)을 꼭 적어야 합니다.');
        if (d.type === 'timer-8p' && it.timing === 'delay' && it.feat !== 'td') warn(where + ': 한시 접점인데 삼각형 모양(feat:"td")이 아닙니다.');
        if (d.type === 'timer-8p' && it.timing === 'instant' && it.feat) warn(where + ': 순시 접점에는 모양 표시를 붙이지 않습니다(feat:"").');
        if (d.type === 'flicker-8p' && it.feat !== 'fl') warn(where + ': 플리커 접점인데 검은 마름모(feat:"fl")가 아닙니다.');
        if (d.type === 'eocr-12p' && it.feat !== 'ovl') warn(where + ': EOCR 접점인데 × 표시(feat:"ovl")가 아닙니다.');
        if (d.type === 'ls-2p' && it.feat !== 'ls') warn(where + ': 리밋스위치 접점인데 리밋스위치 모양(feat:"ls")이 아닙니다.');
      }
      if ((it.cat === 'coil') && !t) err(where + ': 기구 ' + it.tag + ' 는 라이브러리 종류가 없어 coil 로 쓸 수 없습니다. 램프·부저는 lamp 를 쓰세요.');
      if (it.cat === 'pb' && d.cat !== 'pb') err(where + ': pb 항목인데 devices 의 ' + it.tag + ' 가 cat:"pb" 가 아닙니다.');
      if (it.cat === 'ss' && d.cat !== 'ss') err(where + ': ss 항목인데 devices 의 ' + it.tag + ' 가 cat:"ss" 가 아닙니다.');
      if (it.cat === 'ss' && !it.sub) err(where + ': 셀렉터 접점은 sub("A" 또는 "M")가 있어야 합니다.');
      if (it.cat === 'lamp' && d.cat !== 'lamp') err(where + ': lamp 항목인데 devices 의 ' + it.tag + ' 가 cat:"lamp" 가 아닙니다.');
      if (it.cat === 'flsE' && d.type !== 'fls-8p') err(where + ': FLS 전극 항목은 fls-8p 기구에만 씁니다.');
      if (it.cat === 'main' && it.tag !== 'MCCB' && t && !t.contacts.some(function (c) { return c.kind === 'main'; })) err(where + ': ' + t.name + ' 에는 주접점이 없습니다.');
    });

    // 3. 정답표
    function pinOK(t, p) { return !!(t && t.pins[p]); }
    items.forEach(function (it) {
      var where = '정답표 ' + it.id;
      var k = it.cat === 'main' ? (key['main-' + it.tag] || [])[it.pole] : key[it.id];
      if (!k) { err(where + ': 정답이 없습니다.'); return; }
      if (k.length !== it.slots.length) { err(where + ': 칸이 ' + it.slots.length + '개인데 정답은 ' + k.length + '개입니다.'); return; }
      var d = dev[it.tag] || {}, t = d.type && Lib.types[d.type];
      if (it.cat === 'contact') {
        k.forEach(function (p) { if (!pinOK(t, p)) err(where + ': ' + (t ? t.name : it.tag) + ' 에 없는 핀 ' + p + ' 입니다.'); });
        var ok = t && t.contacts.some(function (c) {
          var a = c.pins.map(function (p) { return d.type === 'eocr-12p' && p === '11' ? '10' : p; });
          var top = c.common ? (d.type === 'eocr-12p' && c.common === '11' ? '10' : c.common) : a[0];
          var other = a[0] === top ? a[1] : a[0];
          return c.kind === it.kind && (!it.timing || c.timing === it.timing) && k[0] === top && k[1] === other;
        });
        if (t && !ok) err(where + ': [' + k.join(', ') + '] 는 ' + t.name + ' 의 ' + it.kind + '접점(공통 또는 앞 번호를 위에)이 아닙니다.');
      } else if (it.cat === 'coil') {
        if (t && t.coil && (k[0] !== t.coil.pins[0] || k[1] !== t.coil.pins[1])) err(where + ': ' + t.name + ' 코일은 [' + t.coil.pins.join(', ') + '] 입니다. 지금 [' + k.join(', ') + ']');
      } else if (it.cat === 'lamp') {
        if (k.join() !== '1,2') err(where + ': 램프·부저 정답은 [1, 2] 입니다.');
      } else if (it.cat === 'pb') {
        var want = it.kind === 'b' ? 'N,C' : 'N,O'; if (k.join() !== want) err(where + ': 푸시버튼 ' + it.kind + '접점 정답은 [' + want.replace(',', ', ') + '] 입니다.');
      } else if (it.cat === 'ss') {
        if (k[0] !== 'SS' || k[1] !== it.sub) err(where + ': 셀렉터 정답은 [SS, ' + it.sub + '] 입니다.');
      } else if (it.cat === 'main') {
        var e = [String(it.pole + 1), String(it.pole + 7)];
        if (k[0] !== e[0] || k[1] !== e[1]) err(where + ': ' + ['L1', 'L2', 'L3'][it.pole] + '상 정답은 [' + e.join(', ') + '] 입니다.');
      } else if (it.cat === 'flsE') {
        if (t && t.electrodes && k.join() !== [t.electrodes.E1, t.electrodes.E2, t.electrodes.E3].join()) err(where + ': FLS 전극 정답은 E1·E2·E3 = ' + [t.electrodes.E1, t.electrodes.E2, t.electrodes.E3].join('·') + ' 입니다.');
      }
    });
    Object.keys(key).forEach(function (k) {
      if (/^main-/.test(k)) { if (!items.some(function (it) { return it.cat === 'main' && 'main-' + it.tag === k; })) err('정답표 ' + k + ': 이 주회로 칸이 layout.main 에 없습니다.'); }
      else if (!byId[k]) err('정답표 ' + k + ': 이 id 를 가진 칸 항목이 없습니다.');
    });

    // 4. 같은 기구 핀 ↔ net 일관성 (정답표 기준)
    var pinNets = {};
    items.forEach(function (it) {
      if (it.cat !== 'contact' && it.cat !== 'coil') return;
      var d = dev[it.tag] || {}, k = key[it.id]; if (!k) return;
      it.slots.forEach(function (s, i) {
        var p = d.type === 'eocr-12p' && k[i] === '11' ? '10' : k[i];
        var kk = it.tag + ':' + p; (pinNets[kk] = pinNets[kk] || []).push({ net: s.net, id: it.id });
      });
    });
    Object.keys(pinNets).forEach(function (kk) {
      var nets = pinNets[kk].map(function (x) { return x.net; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
      if (nets.length > 1) err('정답표: ' + kk.replace(':', '의 ') + '번 핀을 서로 다른 net(' + nets.join(', ') + ')에 적게 되어 있습니다. 실제 결선하면 합선입니다. 정답이나 net 이름을 확인하세요. (' + pinNets[kk].map(function (x) { return x.id; }).join(', ') + ')');
    });
    // 5. 코일·접점 개수
    var use = {};
    items.forEach(function (it) { (use[it.tag] = use[it.tag] || { contact: 0, coil: 0 }); if (it.cat === 'contact') use[it.tag].contact++; if (it.cat === 'coil') use[it.tag].coil++; });
    Object.keys(dev).forEach(function (tag) {
      var d = dev[tag], t = d.type && Lib.types[d.type], u = use[tag] || { contact: 0, coil: 0 };
      if (!t) return;
      if (t.coil && u.contact > 0 && u.coil === 0) err('기구 ' + tag + ': 접점은 ' + u.contact + '개 있는데 코일 칸이 없습니다.');
      if (!t.coil && u.coil > 0) err('기구 ' + tag + ': ' + t.name + ' 에는 코일이 없습니다. coil 칸을 지우세요.');
      if (u.coil > 1) err('기구 ' + tag + ': 코일 칸이 ' + u.coil + '개입니다. 기구 하나에 코일은 하나입니다.');
      var maxC = t.contacts.filter(function (c) { return c.kind === 'a' || c.kind === 'b'; }).length;
      if (u.contact > maxC) err('기구 ' + tag + ': 접점 칸이 ' + u.contact + '개인데 ' + t.name + ' 이 가진 a·b 접점은 ' + maxC + '개뿐입니다.');
      if (u.contact === 0 && u.coil === 0 && !items.some(function (it) { return it.tag === tag; })) warn('기구 ' + tag + ': devices 에는 있는데 회로도에 칸이 하나도 없습니다.');
    });

    // 6. 입력 순서
    var order = L.order || [];
    var seen = {};
    order.forEach(function (id) {
      if (seen[id]) err('order: "' + id + '" 가 두 번 나옵니다.'); seen[id] = 1;
      if (!byId[id]) err('order: "' + id + '" 라는 칸 항목이 없습니다.');
    });
    items.forEach(function (it) { if (!seen[it.id]) err('order: 칸 항목 "' + it.id + '" 가 입력 순서에 없습니다.'); });

    // 7. 그림 도형
    (L.drawing || []).forEach(function (p, i) {
      if (!PRIMS[p.t]) err('drawing ' + (i + 1) + '번째: 도형 종류 "' + p.t + '" 는 없습니다.');
      if (p.t === 'item' && !byId[p.id]) err('drawing ' + (i + 1) + '번째: item "' + p.id + '" 라는 칸 항목이 없습니다.');
    });
    if (!(L.drawing || []).some(function (p) { return p.t === 'items'; })) warn('drawing 에 {t:"items"} 가 없어 접점·코일 기호가 그려지지 않습니다.');

    // 8. 칸 겹침
    var all = [];
    items.forEach(function (it) { it.slots.forEach(function (s, i) { all.push({ s: s, n: it.id + ' 칸' + (i + 1) }); }); });
    for (var i = 0; i < all.length; i++) for (var j = i + 1; j < all.length; j++) {
      var a = all[i].s, b = all[j].s;
      if (Math.abs(a.x - b.x) < 30 && Math.abs(a.y - b.y) < 20) warn('칸이 겹칩니다: ' + all[i].n + ' 과 ' + all[j].n + ' (' + a.x + ',' + a.y + ')');
    }
    return { errors: E, warnings: W, items: items };
  }

  var api = { validate: validate, buildItems: buildItems };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PIN_VALIDATE = api;
})(typeof window === 'undefined' ? globalThis : window);
