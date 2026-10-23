/*
 * 핀번호 적기 v2 — 공용 엔진 (2026-09-21)
 * ------------------------------------------------------------------
 * 회로마다 고칠 필요가 없는 부분: 회로도 그리기, 기구 그림, 입력, 힌트, 채점, 이미지 저장.
 * 회로별 내용은 회로/circuit-0NN.js 에만 있다. 이 파일은 새 회로를 만들 때 열지 않는다.
 * 읽는 파일: device-library.js(기구 규격), pin-validate.js(데이터 검사기), circuit-0NN.js(회로),
 *           diagram-render.js(회로도 그리기 — 2026-09-23 요청 0018에서 이 파일에서 분리. pin-engine.js 보다 먼저 불러야 한다)
 * 회로 고르기: <body data-circuit="001"> 또는 등록된 회로가 하나면 그것.
 */
(function () {
  'use strict';
  var L = window.PIN_DEVICE_LIBRARY, V = window.PIN_VALIDATE, DR = window.DIAGRAM_RENDER;
  if (!DR) throw new Error('diagram-render.js 를 pin-engine.js 보다 먼저 불러와야 합니다.');
  var which = (document.body && document.body.dataset && document.body.dataset.circuit) || Object.keys(window.PIN_CIRCUITS || {})[0];
  var C = (window.PIN_CIRCUITS || {})[which];
  var KEY = C.answerKey;
  var FONT = "'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif";

  /* ------------------------------------------------------------ 회로 데이터 읽기 */
  var LAY = C.layout, VB = LAY.viewBox, COILY = LAY.coilY;
  var report = V.validate(L, C);
  var items = report.items || [];
  var byId = {}; items.forEach(function (it) { byId[it.id] = it; });
  var ORDER = (LAY.order || []).filter(function (id) { return byId[id]; });
  var SLOTS = [];
  ORDER.forEach(function (id) { byId[id].slots.forEach(function (s, i) { s.item = id; s.idx = i; s.key = id + '.' + i; SLOTS.push(s); }); });
  function tagType(tag) { var d = C.devices[tag]; return d ? d.type : null; }

  /* ------------------------------------------------------------ 상태 */
  var state = { vals: {}, sel: null, grade: null, follow: false, hint: false, deep: false };
  function val(key) { return state.vals[key] || ''; }
  function itemVals(it) { return it.slots.map(function (s) { return val(s.key); }); }
  function expected(it) {
    if (it.cat === 'main') return KEY['main-' + it.tag][it.pole];
    return KEY[it.id];
  }

  /* ------------------------------------------------------------ SVG 도우미 - 삭제됨 (DR 사용) */
  var INK = '#1f2933';

  /* ------------------------------------------------------------ 회로도 */
  var STATUS_STYLE = {
    ok: ['#e3f4ea', '#1f7a4d'], warn: ['#fff3d6', '#9a6200'], bad: ['#fde7e5', '#b42318'], skip: ['#f1f3f5', '#9aa5b1']
  };
  function slotSvg(s) {
    var it = byId[s.item], v = val(s.key), sel = state.sel === s.key, inItem = state.sel && state.sel.split('.')[0] === s.item;
    var fill = v ? '#eef4ff' : '#fff', stroke = '#6b7c8f', sw = 1.2, dash = v ? '' : ' stroke-dasharray="3 2"';
    var g = state.grade && state.grade.items[s.item];
    if (g) { fill = STATUS_STYLE[g.status][0]; stroke = STATUS_STYLE[g.status][1]; sw = 1.8; dash = ''; }
    if (inItem) { stroke = '#1d4ed8'; sw = 1.8; }
    if (sel) { stroke = '#1d4ed8'; sw = 3; }
    var w = 30, h = 20, out = '<g data-slot="' + s.key + '" style="cursor:pointer">' +
      '<rect x="' + (s.x - w / 2) + '" y="' + (s.y - h / 2) + '" width="' + w + '" height="' + h + '" rx="4" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + sw + '"' + dash + '/>';
    if (v) out += DR.tx(s.x, s.y + 5, v, v.length > 2 ? 11 : 14, ' text-anchor="middle" font-weight="700" fill="#0b2a6b"');
    else if (state.follow) {
      var e = expected(it); var ev = it.cat === 'main' || it.cat === 'flsE' ? (it.cat === 'flsE' ? e[s.idx] : e[s.idx]) : e[s.idx];
      if (!(it.optional && !state.follow)) out += DR.tx(s.x, s.y + 5, ev, ev.length > 2 ? 11 : 14, ' text-anchor="middle" fill="#a3adb8"');
    }
    return out + '</g>';
  }

  function drawCircuit() {
    var o = DR.drawBase(LAY, items, byId, COILY, { wrapItems: false });
    SLOTS.forEach(function (s) { o.push(slotSvg(s)); });
    return o.join('');
  }

  /* ------------------------------------------------------------ 기구 그림 (기구 규격을 바탕으로 우리 방식으로 그림) */
  // 0098: 기구 그림은 공용 렌더러 한 곳에서 유지한다.
  var draw12 = DR.deviceFigures.draw12;
  var draw8 = DR.deviceFigures.draw8;
  var drawSocket = DR.deviceFigures.drawSocket;
  var drawPB = DR.deviceFigures.drawPB;
  var drawSS = DR.deviceFigures.drawSS;
  var drawTwo = DR.deviceFigures.drawTwo;
  var drawLS = DR.deviceFigures.drawLS;
  var drawMCCB = DR.deviceFigures.drawMCCB;

  /* ------------------------------------------------------------ 힌트 */
  function contactsFor(it) {
    var type = tagType(it.tag), t = L.types[type];
    return t.contacts.filter(function (c) { return c.kind === it.kind && (!it.timing || c.timing === it.timing); });
  }
  function hintFor(it) {
    var type = tagType(it.tag), t = type && L.types[type];
    if (it.cat === 'contact') {
      var cs = contactsFor(it), pairs = cs.map(function (c) { var p = c.pins.slice(); if (type === 'eocr-12p') p[0] = '10'; return p; });
      var kname = (it.timing === 'delay' ? '한시 ' : it.timing === 'instant' ? '순시 ' : '') + it.kind + '접점';
      var txt = '<b>' + t.name + ' ' + kname + '</b>: ' + pairs.map(function (p) { return p[0] + '–' + p[1]; }).join(' 또는 ') + '. ';
      if (cs[0].common) txt += '공통(' + pairs.map(function (p) { return p[0]; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).join('·') + ')을 위 칸에 적어요.';
      else txt += '앞 번호를 위 칸에 적어요.';
      if (type === 'relay-8p') txt += '<br>선생님 방법: 처음 적는 X 접점에 1, 다음 X 접점에 8. 1이면 a는 3·b는 4, 8이면 a는 6·b는 5.';
      if (type === 'eocr-12p') txt += '<br>10과 11은 안에서 이어져 있어요. 공통은 <b>10</b>으로 통일해요.';
      if (type === 'ls-2p') txt = '<b>리밋스위치 a접점</b>: 위 칸 1, 아래 칸 2. LS1도 LS2도 똑같이 1·2예요. 기구에는 번호가 없고, 선은 TB4 단자대(LS1, LS2 순서)로 나가요.';
      if (it.horiz) txt = txt.replace('위 칸', '왼쪽 칸');
      return { text: txt, pins: [].concat.apply([], pairs) };
    }
    if (it.cat === 'coil') {
      var cp = t.coil.pins; return { text: '<b>' + t.name + ' ' + (it.tag === 'FLS' ? '전원' : '코일') + '</b>: 위 ' + cp[0] + ', 아래 ' + cp[1] + '.', pins: cp.slice() };
    }
    if (it.cat === 'lamp') return { text: '<b>' + (it.tag === 'BZ' ? '부저' : '램프') + '</b>: 단자 이름은 L1·L2지만 1·2로 불러요. 위 1, 아래 2.', pins: ['1', '2'] };
    if (it.cat === 'pb') return { text: '<b>푸시버튼 ' + (it.kind === 'b' ? 'b접점(NC)' : 'a접점(NO)') + '</b>: 위 칸 N, 아래 칸 ' + (it.kind === 'b' ? 'C' : 'O') + '. 버튼 뒷면 ' + (it.kind === 'b' ? 'NC' : 'NO') + ' 블록의 두 단자예요.', pins: ['N', it.kind === 'b' ? 'C' : 'O'] };
    if (it.cat === 'ss') return { text: '<b>셀렉터 스위치</b>: A·M이 묶인 위 칸은 SS(공통), 아래 칸은 ' + it.sub + '. N 두 개를 묶어 SS, C(위)=M, O(아래)=A.', pins: ['SS', it.sub] };
    if (it.cat === 'main') {
      var e = KEY['main-' + it.tag][it.pole];
      return { text: '<b>' + it.tag + ' 주회로 ' + ['L1', 'L2', 'L3'][it.pole] + '상</b>: 위 ' + e[0] + ', 아래 ' + e[1] + '.' + (it.optional ? ' MCCB는 적으면 좋지만 비워도 틀리지 않아요.' : ''), pins: e.slice() };
    }
    if (it.cat === 'flsE') return { text: '<b>FLS 전극</b>: TB4는 왼쪽부터 E1·E2·E3. E1=7, E2=8, E3=1(접지와 같이).', pins: ['7', '8', '1'] };
    return { text: '', pins: [] };
  }

  /* ------------------------------------------------------------ 오른쪽 패널 */
  var panel = document.getElementById('panel');
  function keypadValues(it) {
    var type = tagType(it.tag);
    if (it.cat === 'pb') return ['N', 'C', 'O', '1', '2', '3', '4'];
    if (it.cat === 'ss') return ['SS', 'A', 'M'];
    if (it.cat === 'lamp') return ['1', '2'];
    if (it.cat === 'main' && it.tag === 'MCCB') return ['1', '2', '3', '7', '8', '9'];
    if (type && !L.types[type].socket) return Object.keys(L.types[type].pins);
    var n = type && L.types[type].socket === 'socket-12p' ? 12 : 8, a = [];
    for (var i = 1; i <= n; i++) a.push(String(i));
    return a;
  }
  function renderPanel() {
    if (!state.sel) {
      panel.innerHTML = '<h2>칸을 눌러 시작하세요</h2><p class="empty-panel">회로도의 빈 칸(점선 네모)을 누르면 이 자리에 그 기구의 내부 결선도가 나옵니다.</p>' +
        '<div class="hint">시험장에서도 <b>기구의 내부 결선도</b>를 함께 줍니다. 번호를 외우지 말고, 그림에서 찾아 적는 연습을 해요.</div>';
      return;
    }
    var sk = state.sel, it = byId[sk.split('.')[0]], idx = +sk.split('.')[1], type = tagType(it.tag);
    var h = hintFor(it), hl = state.hint ? h.pins : [], html = [];
    var pos = it.cat === 'flsE' ? 'E' + (idx + 1) : it.horiz ? (idx ? '오른쪽 칸' : '왼쪽 칸') : (idx ? '아래 칸' : '위 칸');
    html.push('<h2>' + it.tag + (type ? ' · ' + L.types[type].name : '') + '</h2><p class="where">' + (it.title || '') + ' · <b>' + pos + '</b></p>');
    if (state.hint && h.text) html.push('<div class="hint">' + h.text + '</div>');
    var g = state.grade && state.grade.items[it.id];
    if (g && g.status !== 'ok') html.push('<div class="hint" style="background:' + STATUS_STYLE[g.status][0] + '"><b style="color:' + STATUS_STYLE[g.status][1] + '">' + ({ warn: '경고', bad: '오답', skip: '' })[g.status] + '</b> ' + g.msg + '</div>');
    html.push('<div class="keypad">' + keypadValues(it).map(function (v) { return '<button data-key="' + v + '">' + v + '</button>'; }).join('') + '<button class="clear" data-key="">지우기</button></div>');
    if (it.cat === 'main' && it.tag === 'MCCB') {
      html.push('<div class="fig">' + drawMCCB(hl) + '<p class="fig-cap">MCCB: 위(전원측) 1·2·3, 아래(부하측) 7·8·9. 시험지에는 그림이 없어요.</p></div>');
      html.push('<div class="photo">실물 사진 자리 — 선생님이 찍은 MCCB 사진이 들어갈 곳</div>');
    } else if (it.cat === 'pb') {
      html.push('<div class="fig">' + drawPB(hl, it) + '<p class="fig-cap">DS 푸시버튼 뒷면: 위 블록 NC, 아래 블록 NO. 왼쪽이 N.</p></div>');
      html.push('<div class="photo">실물 사진 자리 — 푸시버튼 뒷면(NC·NO 글자)</div>');
      html.push('<p class="note">숫자(1·2, 3·4)로 적어도 틀리지는 않지만 경고가 나와요. 실물 버튼에서 1이 어느 단자인지 버튼마다 달라 결선할 때 실수하기 쉬워요.</p>');
    } else if (it.cat === 'ss') {
      html.push('<div class="fig">' + drawSS(hl, it) + '<p class="fig-cap">셀렉터 스위치 옆면: N 두 개를 묶어 SS, C(위)는 M, O(아래)는 A.</p></div>');
      html.push('<div class="photo">실물 사진 자리 — 셀렉터 스위치 옆면(NC·NO 글자)</div>');
    } else if (it.cat === 'lamp') {
      html.push('<div class="fig">' + drawTwo(it.tag === 'BZ' ? '부저' : '램프', hl) + '</div>');
      html.push('<div class="photo">실물 사진 자리 — ' + (it.tag === 'BZ' ? '부저' : '램프') + ' 뒷면</div>');
    } else if (type && !L.types[type].socket) {
      html.push('<div class="fig">' + drawLS(hl) + '<p class="fig-cap">리밋스위치(a접점): 위 1, 아래 2. 시험지에는 번호 그림이 없어요. 선은 TB4로 나가요.</p></div>');
      html.push('<div class="photo">실물 사진 자리 — 리밋스위치</div>');
    } else if (type) {
      var t = L.types[type], is12 = t.socket === 'socket-12p';
      html.push('<div class="fig">' + (is12 ? draw12(type, hl) : draw8(type, hl)) + '<p class="fig-cap">[' + t.name + '] 기구 규격(핀 배치·접점 연결)을 바탕으로 우리 방식으로 그린 그림</p></div>');
      html.push('<div class="fig">' + drawSocket(is12 ? '12' : '8', hl) + '<p class="fig-cap">[' + (is12 ? '12P' : '8P') + ' 소켓(베이스)] 홈이 아래로 오게 놓아요.' + (is12 ? '' : ' 윗줄은 6·5·4·3 순서예요.') + '</p></div>');
    }
    panel.innerHTML = html.join('');
  }

  /* ------------------------------------------------------------ 채점 */
  function norm(type, p) { return type === 'eocr-12p' && p === '11' ? '10' : p; }
  function gradeAll() {
    var res = {}, pinNets = {};
    function note(tag, type, pin, net, id) {
      if (!pin || !net) return;
      var k = tag + ':' + norm(type, pin); (pinNets[k] = pinNets[k] || []).push({ net: net, id: id, pin: pin });
    }
    items.forEach(function (it) {
      var v = itemVals(it), type = tagType(it.tag), r = { status: 'ok', msg: '' };
      var filled = v.filter(Boolean).length;
      if (it.optional && filled === 0) { res[it.id] = { status: 'skip', msg: '비워도 되는 칸' }; return; }
      if (filled < v.length) { res[it.id] = { status: 'bad', msg: '빈 칸이 있어요.' }; return; }
      var t = type && L.types[type];
      if (it.cat === 'contact') {
        var n = v.map(function (p) { return norm(type, p); }), warns = [];
        if (type === 'eocr-12p' && v.indexOf('11') >= 0) warns.push('EOCR 공통은 10으로 통일해서 적어요(11도 안에서 이어져 동작은 해요).');
        var cand = t.contacts.map(function (c) { return { c: c, pins: c.pins.map(function (p) { return norm(type, p); }) }; });
        var match = cand.filter(function (x) { return (x.pins[0] === n[0] && x.pins[1] === n[1]) || (x.pins[0] === n[1] && x.pins[1] === n[0]); });
        var good = match.filter(function (x) { return x.c.kind === it.kind && (!it.timing || x.c.timing === it.timing); })[0];
        if (!good) {
          if (match.length && match[0].c.kind !== it.kind) r = { status: 'bad', msg: 'a접점·b접점이 바뀌었어요. 이 접점은 ' + it.kind + '접점이에요.' };
          else if (match.length) r = { status: 'bad', msg: '순시·한시 접점이 바뀌었어요.' };
          else r = { status: 'bad', msg: type === 'ls-2p' ? '리밋스위치는 위 1, 아래 2로 적어요.' : t.name + '에 없는 접점 번호 짝이에요.' };
        } else {
          var topPin = good.c.common ? norm(type, good.c.common) : good.pins[0];
          if (n[0] !== topPin) {
            var shared = good.c.common && n[1] === topPin && items.some(function (o2) {
              return o2 !== it && o2.tag === it.tag && o2.slots && o2.slots.some(function (s) { return s.net === it.slots[1].net && norm(type, val(s.key)) === topPin; });
            });
            if (shared) r.msg = '공통단자를 다른 접점과 함께 썼어요(심화, 정답).';
            else warns.push(it.horiz ? '왼쪽·오른쪽이 뒤집혔어요. 공통(' + topPin + ')을 왼쪽에 적어요.' : '위아래가 뒤집혔어요. ' + (good.c.common ? '공통(' + topPin + ')' : topPin) + '을 위 칸에 적어요.');
          }
          if (warns.length) r = { status: 'warn', msg: warns.join(' ') };
          it.slots.forEach(function (s) { note(it.tag, type, val(s.key), s.net, it.id); });
        }
      } else if (it.cat === 'coil') {
        var cp = t.coil.pins;
        if (v[0] === cp[0] && v[1] === cp[1]) r = { status: 'ok', msg: '' };
        else if (v[0] === cp[1] && v[1] === cp[0]) r = { status: 'warn', msg: '위아래가 뒤집혔어요. 위 ' + cp[0] + ', 아래 ' + cp[1] + '.' };
        else r = { status: 'bad', msg: (it.tag === 'FLS' ? 'FLS 전원은 ' : '코일은 ') + cp[0] + '·' + cp[1] + '이에요.' };
        it.slots.forEach(function (s) { note(it.tag, type, val(s.key), s.net, it.id); });
      } else if (it.cat === 'lamp') {
        if (v[0] === '1' && v[1] === '2') r = { status: 'ok', msg: '' };
        else if (v[0] === '2' && v[1] === '1') r = { status: 'warn', msg: '위 1, 아래 2로 적어요.' };
        else r = { status: 'bad', msg: '램프·부저는 1·2예요.' };
      } else if (it.cat === 'pb') {
        var want = ['N', it.kind === 'b' ? 'C' : 'O'], digits = v.every(function (p) { return /^[1-4]$/.test(p); });
        if (v[0] === want[0] && v[1] === want[1]) r = { status: 'ok', msg: '' };
        else if (v[0] === want[1] && v[1] === want[0]) r = { status: 'warn', msg: '위 N, 아래 ' + want[1] + '로 적어요.' };
        else if (digits && ((v.indexOf('1') >= 0 && v.indexOf('2') >= 0) || (v.indexOf('3') >= 0 && v.indexOf('4') >= 0)))
          r = { status: 'warn', msg: '숫자로 적었어요. 틀리지는 않지만, 실물 버튼에서 1이 어느 단자인지 확인해야 해요. ' + (it.kind === 'b' ? 'NC' : 'NO') + '(N·' + want[1] + ')로 적기를 권해요.' };
        else r = { status: 'bad', msg: (it.kind === 'b' ? 'b접점은 NC 블록: N·C' : 'a접점은 NO 블록: N·O') + '예요.' };
      } else if (it.cat === 'ss') {
        if (v[0] === 'SS' && v[1] === it.sub) r = { status: 'ok', msg: '' };
        else if (v[0] === 'SS') r = { status: 'bad', msg: '이 접점 아래 칸은 ' + it.sub + '예요.' };
        else r = { status: 'bad', msg: 'A·M이 묶인 위 칸은 SS예요.' };
      } else if (it.cat === 'main') {
        var e = KEY['main-' + it.tag][it.pole], pairs = KEY['main-' + it.tag];
        if (v[0] === e[0] && v[1] === e[1]) r = { status: 'ok', msg: '' };
        else if (v[0] === e[1] && v[1] === e[0]) r = { status: 'warn', msg: '위아래가 뒤집혔어요. 위 ' + e[0] + ', 아래 ' + e[1] + '.' };
        else if (pairs.some(function (p) { return p[0] === v[0] && p[1] === v[1]; })) r = { status: 'warn', msg: 'L1→1, L2→2, L3→3 순서로 적어요.' };
        else r = { status: 'bad', msg: '주회로는 1–7, 2–8, 3–9 짝이에요.' };
      } else if (it.cat === 'flsE') {
        r = v.join() === '7,8,1' ? { status: 'ok', msg: '' } : { status: 'bad', msg: 'E1=7, E2=8, E3=1 이에요.' };
      }
      res[it.id] = r;
    });
    // 같은 단자를 서로 다른 점에 쓴 경우
    Object.keys(pinNets).forEach(function (k) {
      var list = pinNets[k], nets = list.map(function (x) { return x.net; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
      if (nets.length > 1) list.forEach(function (x) { res[x.id] = { status: 'bad', msg: k.split(':')[0] + '의 ' + x.pin + '번 단자를 서로 다른 두 곳에 썼어요. 실제로 결선하면 합선되거나 동작하지 않아요.' }; });
    });
    var W = { ok: 1, warn: 0.5, bad: 0 }, sum = 0, tot = 0, cnt = { ok: 0, warn: 0, bad: 0 };
    ORDER.forEach(function (id) { var g = res[id]; if (g.status === 'skip') return; tot++; cnt[g.status]++; sum += W[g.status]; });
    return { items: res, score: sum, total: tot, cnt: cnt };
  }
  var resultBox = document.getElementById('result');
  function renderResult() {
    if (!state.grade) { resultBox.hidden = true; return; }
    var g = state.grade, html = ['<h3>확인 결과</h3><div><span class="tag-ok">정답 ' + g.cnt.ok + '</span> · <span class="tag-warn">경고 ' + g.cnt.warn + '</span> · <span class="tag-bad">오답 ' + g.cnt.bad + '</span></div><ul>'];
    ORDER.forEach(function (id) {
      var r = g.items[id]; if (r.status === 'ok' && !r.msg) return; if (r.status === 'skip') return;
      html.push('<li data-item="' + id + '"><span class="tag-' + r.status + '">' + ({ ok: '정답', warn: '경고', bad: '오답' })[r.status] + '</span> ' + byId[id].title + ' — ' + r.msg + '</li>');
    });
    html.push('</ul>');
    resultBox.innerHTML = html.join(''); resultBox.hidden = false;
  }

  /* ------------------------------------------------------------ 그리기·입력 */
  var svg = document.getElementById('circuit');
  function render() { svg.innerHTML = drawCircuit(); renderPanel(); renderResult(); }
  function select(key) { state.sel = key; render(); }
  function nextSlot() {
    var i = SLOTS.findIndex(function (s) { return s.key === state.sel; });
    for (var j = i + 1; j < SLOTS.length; j++) if (!val(SLOTS[j].key)) return SLOTS[j].key;
    return SLOTS[Math.min(i + 1, SLOTS.length - 1)].key;
  }
  function setVal(v, advance) {
    if (!state.sel) return;
    if (v) state.vals[state.sel] = v; else delete state.vals[state.sel];
    if (state.grade) state.grade = gradeAll();
    if (advance && v) state.sel = nextSlot();
    render();
  }
  svg.addEventListener('click', function (e) { var g = e.target.closest('[data-slot]'); if (g) select(g.getAttribute('data-slot')); });
  panel.addEventListener('click', function (e) {
    var k = e.target.closest('[data-key]'); if (k) { setVal(k.getAttribute('data-key'), true); return; }
    var p = e.target.closest('[data-pin]'); if (p) setVal(p.getAttribute('data-pin'), true);
  });
  resultBox.addEventListener('click', function (e) { var li = e.target.closest('[data-item]'); if (li) select(li.getAttribute('data-item') + '.0'); });
  document.addEventListener('keydown', function (e) {
    if (!state.sel || /input|select|textarea/i.test(e.target.tagName)) return;
    var it = byId[state.sel.split('.')[0]], allowed = keypadValues(it), cur = val(state.sel), k = e.key.toUpperCase();
    if (/^[0-9]$/.test(k)) {
      var two = cur + k; setVal(allowed.indexOf(two) >= 0 && cur.length === 1 ? two : (allowed.indexOf(k) >= 0 ? k : cur), false); e.preventDefault();
    } else if (k === 'S' && allowed.indexOf('SS') >= 0) { setVal('SS', false); }
    else if (allowed.indexOf(k) >= 0 && /^[A-Z]$/.test(k)) { setVal(k, false); }
    else if (e.key === 'Backspace' || e.key === 'Delete') { setVal('', false); e.preventDefault(); }
    else if (e.key === 'Enter' || e.key === 'Tab') { state.sel = e.shiftKey ? SLOTS[Math.max(0, SLOTS.findIndex(function (s) { return s.key === state.sel; }) - 1)].key : nextSlot(); render(); e.preventDefault(); }
  });
  document.getElementById('optFollow').addEventListener('change', function (e) { state.follow = e.target.checked; state.hint = state.follow; render(); });
  document.getElementById('btnCheck').addEventListener('click', function () { state.grade = gradeAll(); render(); resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
  document.getElementById('btnReset').addEventListener('click', function () { state.vals = {}; state.grade = null; state.sel = null; render(); });
  var deep = document.getElementById('deep');
  deep.innerHTML = '<h3 style="margin:0 0 6px;font-size:16px">심화: 공통단자 함께 쓰기</h3>' +
    '<p style="margin:0">' + (C.deepText || '공통단자를 두 접점이 함께 쓰면 선을 줄일 수 있어요. 이렇게 적어도 정답이에요.') + '</p>' +
    '<p class="note" style="margin:6px 0 0">전기기능사 시험에서는 공통을 함께 쓰지 않아도 감점이 없어요. 헷갈리지 않도록 기본은 서로 다른 조(1조·2조)로 적어요.</p>';
  document.getElementById('btnDeep').addEventListener('click', function () { deep.hidden = !deep.hidden; });
  document.getElementById('btnDeep').hidden = true; deep.hidden = true;   // 2026-09-28 작성자: 심화는 고도화 전까지 숨김(코드·deepText 보존, 이 줄을 지우면 다시 보임)

  /* ------------------------------------------------------------ 이미지 저장 */
  function buildPng(cb) {
    if (!state.grade) state.grade = gradeAll();
    var keepSel = state.sel; state.sel = null; var circuitSvg = drawCircuit(); state.sel = keepSel; render();
    var g = state.grade, lines = [];
    ORDER.forEach(function (id) { var r = g.items[id]; if (r.status === 'warn' || r.status === 'bad') lines.push([r.status, byId[id].title + ' — ' + r.msg]); });
    var W = VB[0], head = 110, listH = 26 * lines.length + 30, H = head + VB[1] + listH;
    var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#1f2933'; ctx.font = 'bold 28px ' + FONT; ctx.fillText(C.title || (C.id + ' 핀번호 적기'), 30, 44);
    var name = document.getElementById('stuName').value || '(이름 없음)', sid = document.getElementById('stuId').value || '(학번 없음)';
    var d = new Date(), ds = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    ctx.font = '20px ' + FONT; ctx.fillText('이름 ' + name + '   학번 ' + sid + '   ' + ds, 30, 80);
    ctx.font = 'bold 22px ' + FONT; ctx.fillText('정답 ' + g.cnt.ok + ' · 경고 ' + g.cnt.warn + ' · 오답 ' + g.cnt.bad, 760, 80);
    var img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, head, VB[0], VB[1]);
      ctx.font = '18px ' + FONT; var y = head + VB[1] + 26;
      lines.forEach(function (l) { ctx.fillStyle = l[0] === 'bad' ? '#b42318' : '#9a6200'; ctx.fillText((l[0] === 'bad' ? '오답 ' : '경고 ') + l[1], 30, y); y += 26; });
      cv.toBlob(function (b) { cb(b); }, 'image/png');
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + VB[0] + ' ' + VB[1] + '" width="' + VB[0] + '" height="' + VB[1] + '">' + circuitSvg + '</svg>');
  }
  function fileName() {
    // 파일 이름은 영문·숫자만 쓴다. 한글 파일 이름은 브라우저·기기에 따라 'download' 로 떨어질 수 있다.
    var id = (document.getElementById('stuId').value || '').replace(/[^0-9A-Za-z-]/g, '');
    var d = new Date(), ymd = '' + d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
    return 'pin-' + C.id + (id ? '-' + id : '') + '-' + ymd + '.png';   // 이름·학번은 그림 안에 적힌다
  }
  document.getElementById('btnSave').addEventListener('click', function () {
    buildPng(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = fileName(); document.body.appendChild(a); a.click(); a.remove(); });
  });
  var shareBtn = document.getElementById('btnShare');
  try { if (navigator.canShare && navigator.canShare({ files: [new File([''], 'a.png', { type: 'image/png' })] })) shareBtn.hidden = false; } catch (e) { }
  shareBtn.addEventListener('click', function () {
    buildPng(function (b) { var f = new File([b], fileName(), { type: 'image/png' }); navigator.share({ files: [f], title: (C.id + ' 핀번호 적기') }).catch(function () { }); });
  });

  var fsBtn = document.getElementById('fullscreen-button');
  if (fsBtn) {
    fsBtn.addEventListener('click', async function () {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch (e) {
        fsBtn.textContent = 'F11로 전체 화면';
      }
    });
    document.addEventListener('fullscreenchange', function () {
      fsBtn.textContent = document.fullscreenElement ? '전체 화면 종료' : '전체 화면';
    });
  }

  // 검사용 (브라우저 콘솔·자동 검사에서 사용)
  function showReport() {
    if (!report.errors.length && !report.warnings.length) return;
    var box = document.createElement('section');
    box.className = 'card datacheck';
    box.innerHTML = '<h3>회로 데이터 검사</h3>' +
      (report.errors.length ? '<p class="tag-bad">오류 ' + report.errors.length + '건 — 고쳐야 화면이 제대로 나옵니다.</p><ul>' + report.errors.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul>' : '') +
      (report.warnings.length ? '<p class="tag-warn">경고 ' + report.warnings.length + '건</p><ul>' + report.warnings.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul>' : '');
    document.body.insertBefore(box, document.body.firstChild.nextSibling);
  }
  showReport();
  window.__pin = window.__pin001 = { buildPng: function (cb) { return buildPng(cb); }, state: state, items: items, SLOTS: SLOTS, gradeAll: gradeAll, render: render, KEY: KEY, byId: byId };
  var h1 = document.querySelector('h1'); if (h1 && C.title) h1.textContent = C.title;
  if (C.title) document.title = document.querySelector('.site-bar')?.dataset.title || C.title;
  render();
})();
