/*
 * 결선하기 — 공용 엔진 (2026-09-26 요청 0028 프로토타입, 2026-09-27 요청 0030 구역 필터·자유 탐색)
 * ------------------------------------------------------------------
 * 회로마다 고칠 필요가 없는 부분: 회로도 강조, 제어판 배치도·배관도, 구간 설명, 단계 넘기기, 구역 나눠 보기, 자유 탐색.
 * 회로별 내용은 회로/circuit-NNN.js(회로도·핀번호)와 회로/wire-NNN.js(결선 데이터)에만 있다. 새 데이터 필드는 쓰지 않는다.
 * 불러오는 순서: steps.js, device-library.js, pin-validate.js, circuit-NNN.js, diagram-render.js,
 *               panel-library.js, wire-validate.js, panel-render.js, wire-NNN.js, wire-engine.js
 *
 * 보는 방법 두 가지 (시뮬레이션 페이지의 "단계별 설명 ↔ 자유 조작" 토글과 같은 자리·같은 조작)
 *   순서대로 보기(기본) : 처음 → 구간들 → 완성. [이전]·[다음], ←·→ 키
 *   자유 탐색          : 회로도의 선·핀번호 칸, 또는 배치도·배관도의 단자·단자대 칸을 누르면 그 점이 속한 구간을 찾아 보여 준다(양방향)
 *   직접 연결해 보기    : (요청 0062) 회로도에서 구간을 고르고 배치도 단자를 눌러 직접 선을 긋는다(선마다 바로 판정). 화면·채점은 wire-practice.js 에 있고,
 *                        이 엔진이 같은 폴더에서 불러 붙인다(페이지 HTML 은 그대로). 1단계는 PRACTICE_READY 회로만, 나머지는 ?draft=1 일 때만 단추가 보인다.
 * 구역 나눠 보기 (시뮬레이션의 view-tabs 와 같은 모양): 전체 / 주회로 / 제어회로 / 보호도체(있을 때만)
 *   구역 = net.group, 그리고 체인의 선 종류(kind)가 다르면 그 구역에도 넣는다(WIRE_MODEL.netZones). 두 모드 모두에 적용된다.
 */
(function () {
  'use strict';
  var SELF_SRC = document.currentScript && document.currentScript.src;
  var PRACTICE_READY = 'all';   // 요청 0064: 28개 공개(총괄 검수, 결선_실습시험 --all 통과)
  var START_PRACTICE = location.hash === '#practice';   // 첫 그리기가 주소의 #를 지우기 전에 기억(새로고침하면 연습 화면으로)
  var Lib = window.PIN_DEVICE_LIBRARY, PV = window.PIN_VALIDATE, DR = window.DIAGRAM_RENDER;
  var PL = window.PANEL_LIBRARY, WM = window.WIRE_MODEL, PR = window.PANEL_RENDER;
  var which = document.body.dataset.circuit;
  var C = (window.PIN_CIRCUITS || {})[which], W = (window.PIN_WIRING || {})[which];
  var libs = { Lib: Lib, PV: PV, PL: PL };
  var HL = '#1d4ed8', ZONE_INK = '#7fa2ec', HOVER = '#f59e0b';
  var $ = function (s) { return document.querySelector(s); };
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* 요청 0030 이전에 복사한 페이지(모드 막대·표시용 span 없음)도 그대로 돌도록, 없는 요소는 여기서 만든다 */
  (function ensureUi() {
    var bar = $('.wire-bar');
    if (!$('#wZones') && bar) {
      var nav = document.createElement('nav'); nav.className = 'wire-modebar'; nav.setAttribute('aria-label', '보는 방법');
      nav.innerHTML = '<div class="view-tabs" role="group" aria-label="구역 나눠 보기" id="wZones"></div><div class="wire-mode"><span class="wire-mode-badge" id="wModeBadge">순서대로 보기</span><button type="button" id="wFree" class="free-button" aria-pressed="false">자유 탐색으로 전환</button></div>';
      bar.parentNode.insertBefore(nav, bar);
    }
    var done = $('#wDone');
    if (done && !$('#wDoneText')) {
      var lab = done.parentNode, sp = document.createElement('span'); sp.id = 'wDoneText';
      [].slice.call(lab.childNodes).forEach(function (n) { if (n.nodeType === 3) lab.removeChild(n); });
      lab.appendChild(document.createTextNode(' ')); lab.appendChild(sp);
    }
    var cs = $('#wCircuit'), h3 = cs && cs.previousElementSibling;
    if (h3 && !$('#wCircuitTitle') && h3.tagName === 'H3') h3.id = 'wCircuitTitle';
  })();

  /* ------------------------------------------------------------ 데이터 검사 (오류가 있으면 멈춘다) */
  var report = WM.validate(W, C, libs);
  var box = $('#wireCheck');
  if (report.errors.length) {
    box.hidden = false;
    box.innerHTML = '<h3>결선 데이터 오류 ' + report.errors.length + '건 — 고친 뒤 다시 여세요</h3><ul>' + report.errors.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>';
    return;
  }

  var idx = WM.deviceIndex(W), cid = W.circuit || W.id;
  var pv = PV.validate(Lib, C), items = pv.items, byId = {};
  items.forEach(function (it) { byId[it.id] = it; });
  var cidx = WM.circuitIndex(C, PV).filter(function (c) { return !(W.omit || {})[c.tag]; });
  var segs = report.segs;                                   // 구간 id → 회로도 선분
  var nets = W.nets;
  var EDGES = nets.map(function (n) { return WM.expandNet(W, n, idx); });
  var GROUP = { main: '주회로', pe: '보호도체', aux: '제어회로' };
  var hasPiping = !!W.piping;
  var netIdx = {}; nets.forEach(function (n, i) { netIdx[n.id] = i; });
  var POINT_NET = WM.pointNets(W);                          // 점 → 구간 id (자유 탐색 역인덱스)
  var ZONES_OF = nets.map(function (n) { return WM.netZones(W, n); });
  var ZONES = ['all'].concat(['main', 'aux', 'pe'].filter(function (z) { return ZONES_OF.some(function (zs) { return zs.indexOf(z) >= 0; }); }));
  var ZONE_NAME = { all: '전체', main: '주회로', aux: '제어회로', pe: '보호도체' };

  /* ------------------------------------------------------------ 상태 */
  var state = { zone: 'all', free: false, practice: false, step: 0, pick: -1, picked: null, notice: null, hover: -1, showDone: true, showPins: true, view: 'panel' };
  var ZI = [], STEPS = [];
  function inZone(i, z) { z = z || state.zone; return z === 'all' || ZONES_OF[i].indexOf(z) >= 0; }
  function buildSteps() {
    ZI = []; nets.forEach(function (n, i) { if (inZone(i)) ZI.push(i); });
    STEPS = [{ kind: 'intro' }].concat(ZI.map(function (i, z) { return { kind: 'net', net: nets[i], i: i, z: z }; }), [{ kind: 'end' }]);
  }
  buildSteps();
  var h = /^#(.+)$/.exec(location.hash || '');
  if (h && netIdx[decodeURIComponent(h[1])] != null) state.step = 1 + ZI.indexOf(netIdx[decodeURIComponent(h[1])]);

  function where(p) { var r = WM.parseRef(p), e = r && idx[r.tag]; return e ? e.where : null; }
  function name(p) { return WM.describe(W, C, p, libs, idx); }
  function sideName(s) { return s === 'ext' ? '바깥쪽' : s === 'int' ? '안쪽' : ''; }
  function pointsWithSides(ni) {
    var out = {};
    EDGES[ni].forEach(function (e) { out[e.a + (e.aSide ? '@' + e.aSide : '')] = 1; out[e.b + (e.bSide ? '@' + e.bSide : '')] = 1; });
    return out;
  }
  function zonePoints() {
    var on = {};
    if (state.zone === 'all') return on;
    ZI.forEach(function (i) { WM.pointsOf(nets[i]).forEach(function (p) { on[p] = 1; }); });
    return on;
  }
  /* 지금 보여 줄 장면: 순서대로 보기는 STEPS[step], 자유 탐색은 고른 구간(없으면 'free') */
  function current() {
    if (!state.free) return STEPS[state.step];
    if (state.pick >= 0) return { kind: 'net', net: nets[state.pick], i: state.pick, z: ZI.indexOf(state.pick) };
    return { kind: 'free' };
  }

  /* ------------------------------------------------------------ 회로도 */
  var circuitSvg = $('#wCircuit');
  circuitSvg.setAttribute('viewBox', '0 0 ' + C.layout.viewBox[0] + ' ' + C.layout.viewBox[1]);
  var BASE = DR.drawBase(C.layout, items, byId, C.layout.coilY, { wrapItems: false }).join('');
  function pinBox(x, y, txt, look) {
    var w = 30, hh = 20, on = look === 'on', zn = look === 'zone';
    return '<rect x="' + (x - w / 2) + '" y="' + (y - hh / 2) + '" width="' + w + '" height="' + hh + '" rx="4" fill="' + (on ? HL : '#fff') + '" stroke="' + (on || zn ? HL : '#b7c0ca') + '" stroke-width="' + (on || zn ? 2 : 1) + '"/>' +
      DR.tx(x, y + 5, esc(txt), txt.length > 2 ? 11 : 14, ' text-anchor="middle" font-weight="700" fill="' + (on ? '#fff' : zn ? HL : '#7b8794') + '"');
  }
  function segLines(id, ink, width, op) {
    return (segs[id] || []).map(function (s) {
      return '<line x1="' + s.x1 + '" y1="' + s.y1 + '" x2="' + s.x2 + '" y2="' + s.y2 + '" stroke="' + ink + '" stroke-width="' + width + '" stroke-linecap="round" stroke-opacity="' + op + '"/>';
    }).join('');
  }
  function drawCircuit(net) {
    var o = [BASE], pts = net ? WM.pointsOf(net) : [], on = {}, zoned = !net && state.zone !== 'all', zp = zoned ? zonePoints() : {};
    pts.forEach(function (p) { on[p] = 1; });
    if (net || zoned) o.push('<rect x="0" y="0" width="' + C.layout.viewBox[0] + '" height="' + C.layout.viewBox[1] + '" fill="#fff" fill-opacity="0.62"/>');
    if (zoned) ZI.forEach(function (i) { o.push(segLines(nets[i].id, ZONE_INK, 4, 0.9)); });
    if (net) o.push(segLines(net.id, HL, 5, 0.9));
    cidx.forEach(function (c) {
      var look = on[c.ref] ? 'on' : zp[c.ref] ? 'zone' : 'off';
      if (look === 'off' && !state.showPins) return;
      o.push(pinBox(c.slot.x, c.slot.y, c.pin.replace(/#.*$/, ''), look));
    });
    Object.keys(W.circuitPoints || {}).forEach(function (k) {
      if (!on[k] && !zp[k]) return;
      var q = W.circuitPoints[k];
      o.push('<circle cx="' + q[0] + '" cy="' + q[1] + '" r="9" fill="none" stroke="' + (on[k] ? HL : ZONE_INK) + '" stroke-width="3"/>');
    });
    o.push('<g id="wHover" pointer-events="none"></g>');
    circuitSvg.innerHTML = o.join('');
    state.hover = -1;
  }
  /* 누른 자리(화면 좌표) → 가장 가까운 핀번호 칸 · circuitPoints · 칠한 선 → { ni, ref } */
  function svgPoint(ev) {
    var m = circuitSvg.getScreenCTM(); if (!m) return null;
    var pt = circuitSvg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
    var p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y, k: 1 / (Math.abs(m.a) || 1) };
  }
  function segDist(p, s) {
    var dx = s.x2 - s.x1, dy = s.y2 - s.y1, L2 = dx * dx + dy * dy, t = L2 ? ((p.x - s.x1) * dx + (p.y - s.y1) * dy) / L2 : 0;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(s.x1 + t * dx - p.x, s.y1 + t * dy - p.y);
  }
  function hitCircuit(p) {
    var tol = Math.max(8, 14 * p.k), best = null;
    function cand(d, ni, ref) { if (ni == null || d > tol) return; if (!best || d < best.d) best = { d: d, ni: ni, ref: ref }; }
    cidx.forEach(function (c) {
      var dx = Math.max(Math.abs(p.x - c.slot.x) - 15, 0), dy = Math.max(Math.abs(p.y - c.slot.y) - 10, 0);
      cand(Math.hypot(dx, dy) - 0.5, netIdx[POINT_NET[c.ref]], c.ref);   // 칸 안을 누르면 선보다 먼저
    });
    Object.keys(W.circuitPoints || {}).forEach(function (k) { var q = W.circuitPoints[k]; cand(Math.max(Math.hypot(p.x - q[0], p.y - q[1]) - 9, 0) - 0.5, netIdx[POINT_NET[k]], k); });
    Object.keys(segs).forEach(function (id) { (segs[id] || []).forEach(function (s) { cand(segDist(p, s), netIdx[id], null); }); });
    return best;
  }

  /* ------------------------------------------------------------ 배치도·배관도 */
  var board = $('#wBoard');
  function labelsFor(ni) {
    var lab = {};
    WM.pointsOf(nets[ni]).forEach(function (p) { if (where(p) === 'piping') lab[p] = PR.shortLabel(p).join(' '); });
    return lab;
  }
  function drawBoard(step) {
    var ni = step.kind === 'net' ? step.i : -1, edges = [], hl = {}, end = step.kind === 'end';
    var upto = end ? ZI.length : step.kind === 'net' ? step.z : 0;
    ZI.forEach(function (k, z) {
      if (k === ni) { EDGES[k].forEach(function (e, j) { var c = copy(e); c.state = 'active'; c.no = j + 1; edges.push(c); }); return; }
      var faint = state.free ? state.showDone : (z < upto && (state.showDone || end));
      if (!faint) return;
      EDGES[k].forEach(function (e) { var c = copy(e); c.state = end && !state.free ? 'active' : 'done'; if (c.outside && end) return; edges.push(c); });
    });
    if (ni >= 0) hl = pointsWithSides(ni);
    if (state.view === 'piping' && hasPiping) {
      var o = { strips: true, hlPoints: {}, hlPipes: {}, hlBoxes: {}, cellHl: {}, hlGroups: null };
      if (ni >= 0) {
        var pts = WM.pointsOf(nets[ni]), groups = {};
        pts.forEach(function (p) {
          var r = WM.parseRef(p);
          if (where(p) === 'piping') o.hlPoints[p] = 1;
          if (idx[r.tag] && idx[r.tag].dev.type === 'tb-strip') o.cellHl[r.tag + ':' + r.pin] = 1;
        });
        (W.terminalBlocks.groups || []).forEach(function (g) {
          if ([].concat.apply([], g.basic).some(function (p) { return o.hlPoints[p]; })) { groups[g.id] = 1; (g.pipes || []).forEach(function (pp) { o.hlPipes[pp] = 1; }); o.hlBoxes[g.box] = 1; }
        });
        o.hlGroups = groups;
      }
      o.physicalContacts = true;
      board.innerHTML = PR.drawPiping(W, o);
    } else {
      board.innerHTML = PR.drawPanel(W, { edges: edges, hl: hl, labels: ni >= 0 ? labelsFor(ni) : {}, physicalContacts: true });
    }
  }
  function copy(e) { var o = {}; for (var k in e) o[k] = e[k]; return o; }
  /* 배치도·배관도에서 누른 곳 → 점 ID */
  function boardRef(target) {
    var t = target.closest && target.closest('[data-key],[data-cell]');
    if (!t || !board.contains(t)) return null;
    if (t.dataset.key) return t.dataset.key.replace(/@(ext|int)$/, '');
    return cid + '/' + t.dataset.cell;
  }

  /* ------------------------------------------------------------ 설명 카드 */
  var info = $('#wInfo');
  function swatch(t) {
    var st = t.stripe ? 'background:repeating-linear-gradient(90deg,' + t.ink + ' 0 7px,' + t.stripe + ' 7px 14px)' : 'background:' + t.ink;
    return '<span class="wi-swatch" style="' + st + '"></span>';
  }
  function wireSpec(wire) { var t = W.wireTypes[wire]; return swatch(t) + t.color + ' ' + t.size + ' <span class="muted">(' + t.label + ')</span>'; }
  function zoneWord() { return state.zone === 'all' ? '' : '<b>' + ZONE_NAME[state.zone] + '</b> '; }
  function netCard(step, html) {
    var n = step.net, es = EDGES[step.i], pts = WM.pointsOf(n), zs = ZONES_OF[step.i];
    html.push('<div class="wi-head"><span class="wi-tag wi-' + n.group + '">' + GROUP[n.group] + '</span>' +
      zs.slice(1).map(function (z) { return '<span class="wi-tag wi-also">+ ' + GROUP[z] + ' 선</span>'; }).join('') +
      '<span class="muted">' + (state.zone === 'all' ? '구간 ' : ZONE_NAME[state.zone] + ' 구간 ') + (step.z + 1) + ' / ' + ZI.length + (n.circuit ? ' · 회로도 이름 ' + esc(n.circuit) : '') + '</span></div>');
    if (state.free && state.picked) html.push('<p class="wi-found">누른 곳: <b>' + esc(name(state.picked)) + '</b> — 이 점이 속한 구간이에요.</p>');
    html.push('<h2>' + esc(n.label) + '</h2>');
    html.push('<p class="wi-say"><b>이 구간을 연결하세요</b> — 아래 ' + pts.length + '개 점은 모두 같은 점이에요.</p>');
    html.push('<div class="wi-chips">' + pts.map(function (p) { var out = where(p) === 'piping'; return '<span class="wi-chip' + (out ? ' out' : '') + (p === state.picked && state.free ? ' picked' : '') + '" title="' + esc(p) + '">' + esc(name(p)) + (out ? ' <small>제어판 밖</small>' : '') + '</span>'; }).join('<span class="wi-eq">=</span>') + '</div>');
    html.push('<ol class="wi-wires">' + es.map(function (e, j) {
      var t = W.wireTypes[e.wire];
      return '<li><span class="wi-no">' + (j + 1) + '</span>' + esc(name(e.a)) + (e.aSide ? ' <small>' + sideName(e.aSide) + '</small>' : '') + ' <span class="wi-line">' + swatch(t) + '</span> ' + esc(name(e.b)) + (e.bSide ? ' <small>' + sideName(e.bSide) + '</small>' : '') +
        ' <span class="muted">· ' + t.color + ' ' + t.size + (e.jumper ? ' · 바깥 상자 안에서 이음' : e.outside ? ' · 관으로 나감' : '') + '</span></li>';
    }).join('') + '</ol>');
    if (zs.length > 1) html.push('<p class="muted">이 구간에는 ' + zs.map(function (z) { return GROUP[z]; }).join('·') + ' 선이 함께 있어서 ' + zs.map(function (z) { return '‘' + ZONE_NAME[z] + '’'; }).join('·') + ' 구역 어디에서나 보여요.</p>');
    if (n.note) html.push('<p class="wi-note">' + esc(n.note) + '</p>');
  }
  function renderInfo(step) {
    var html = [];
    if (step.kind === 'intro') {
      html.push('<h2>결선하기 — 이렇게 봐요</h2>');
      html.push('<p>회로도에서 <b>선으로 이어진 점들</b>(구간)을 하나씩 골라, 실제 ' + (hasPiping ? '제어판·배관도' : '제어판') + '에서 어느 단자끼리 이어야 하는지 보여 줍니다. <b>다음 ▶</b>을 누르며 ' + zoneWord() + '한 구간씩 따라가세요.' +
        ' 궁금한 곳만 보고 싶으면 <b>자유 탐색으로 전환</b>을 누르고 회로도나 배치도를 직접 눌러요.</p>');
      html.push('<ul class="wi-rules"><li>왼쪽 회로도: <b style="color:' + HL + '">파란 선·칸</b>이 지금 구간, 칸의 숫자는 핀번호 적기에서 적은 번호예요.</li>' +
        '<li>오른쪽 배치도: <b style="color:' + HL + '">파란 단자</b>를 서로 잇습니다. 동그라미 숫자는 선을 긋는 순서예요.</li>' +
        '<li>위의 <b>전체 · 주회로 · 제어회로</b>' + (ZONES.indexOf('pe') >= 0 ? ' · 보호도체' : '') + ' 단추로 한 부분만 골라 볼 수 있어요.</li>' +
        '<li>한 단자에는 선을 <b>2가닥까지</b>만 물려요(3가닥 이상 금지).</li>' +
        (hasPiping ? '<li>제어판 밖 기구(버튼·램프·전원·전동기 단자대)로 가는 선은 모두 <b>TB5·TB6 단자대</b>를 거쳐요. 칸 번호는 <b>단자대 번호매기기</b>의 권장 배치(예시)를 따라 적었어요 — 다르게 배치해도 결선이 같으면 틀린 게 아니에요.</li>' : '<li>승강기 과제는 버튼·램프까지 기구에 바로 결선해요(중계 단자대 없음). MCCB는 없으므로(생략) TB1(전원)에서 EOCR로 바로 가요.</li>') +
        '</ul>');
      html.push('<p class="wi-legend">' + Object.keys(W.wireTypes).map(function (k) { return '<span>' + wireSpec(k) + '</span>'; }).join('') + '</p>');
    } else if (step.kind === 'free') {
      html.push('<h2>자유 탐색 — 궁금한 곳을 눌러 보세요</h2>');
      html.push('<p><b>회로도</b>의 선이나 핀번호 칸, 또는 오른쪽 <b>' + (hasPiping ? '배치도·배관도' : '배치도') + '</b>의 ' + (hasPiping ? '단자·단자대 칸을' : '단자를') + ' 누르면, 그 점과 <b>같은 구간</b>에 있는 점과 이어야 할 선을 모두 보여 줘요. 구간 목록에서 골라도 돼요.</p>');
      if (state.zone !== 'all') html.push('<p class="muted">지금은 ' + zoneWord() + '구간 ' + ZI.length + '개만 옅게 표시하고 있어요. 다른 부분을 누르면 어느 구역인지 알려 줘요.</p>');
      noticeHtml(html);
    } else if (step.kind === 'end') {
      var some = state.zone === 'all' ? '모든 구간' : ZONE_NAME[state.zone] + ' 구간';
      html.push('<h2>완성 — ' + some + ' ' + ZI.length + '개</h2><p>배치도에 ' + (state.zone === 'all' ? '모든' : zoneWord() + '구역의') + ' 선을 그렸어요. 실제 작업에서는 ' + (nets.some(function (n) { return n.group === 'pe'; }) ? '주회로 → 보호도체 → 제어회로' : '주회로 → 제어회로') + ' 순서로, 한 구간을 다 이은 뒤 다음 구간으로 넘어가면 빠뜨리지 않아요.</p>');
      html.push('<p class="muted">전체: 선 ' + report.info.wires + '가닥 · 점 ' + report.info.points + '개 · 한 단자 최대 ' + report.info.maxPerScrew + '가닥</p>');
    } else {
      netCard(step, html);
    }
    info.innerHTML = html.join('');
  }
  function noticeHtml(html) {
    var nt = state.notice; if (!nt) return;
    if (nt.ni == null) { html.push('<p class="wi-note">누른 곳: <b>' + esc(name(nt.ref)) + '</b> — 이 회로에서는 쓰지 않는 단자예요(선을 물리지 않아요).</p>'); return; }
    var n = nets[nt.ni];
    html.push('<p class="wi-note">누른 곳: <b>' + esc(name(nt.ref || WM.pointsOf(n)[0])) + '</b> — 이 점은 <b>' + GROUP[n.group] + '</b> 구간 ‘' + esc(n.label) + '’에 있어요. 지금은 ' + ZONE_NAME[state.zone] + '만 보고 있어요. ' +
      '<button type="button" class="wi-inline" data-go-all="' + nt.ni + '">전체 구역으로 바꿔 보기</button></p>');
  }

  /* ------------------------------------------------------------ 구간 고르기 목록 */
  var sel = $('#wSelect');
  function buildSelect() {
    var o = [], cur = null;
    if (state.free) o.push('<option value="-1">구간 고르기 (' + ZI.length + '개)</option>');
    else o.push('<option value="0">처음 — 이렇게 봐요</option>');
    ZI.forEach(function (i, z) {
      var n = nets[i];
      if (n.group !== cur) { if (cur) o.push('</optgroup>'); cur = n.group; o.push('<optgroup label="' + GROUP[cur] + '">'); }
      o.push('<option value="' + (state.free ? i : z + 1) + '">' + (z + 1) + '. ' + esc(n.label) + '</option>');
    });
    if (cur) o.push('</optgroup>');
    if (!state.free) o.push('<option value="' + (STEPS.length - 1) + '">완성 — ' + (state.zone === 'all' ? '전체' : ZONE_NAME[state.zone]) + ' 보기</option>');
    sel.innerHTML = o.join('');
  }

  /* ------------------------------------------------------------ 그리기 · 이동 */
  function render() {
    if (state.practice && PRACTICE) { PRACTICE.render(); modeUi(); if (history.replaceState) history.replaceState(null, '', '#practice'); return; }
    var step = current();
    renderInfo(step); drawCircuit(step.net); drawBoard(step);
    sel.value = String(state.free ? state.pick : state.step);
    $('#wPrev').disabled = state.free || state.step === 0;
    $('#wNext').disabled = state.free || state.step === STEPS.length - 1;
    $('#wCount').textContent = state.free ? '자유 탐색' : (step.kind === 'net' ? step.z + 1 : step.kind === 'end' ? ZI.length : 0) + ' / ' + ZI.length;
    if (history.replaceState) history.replaceState(null, '', step.net ? '#' + encodeURIComponent(step.net.id) : location.pathname + location.search);
    modeUi();
  }
  function modeUi() {
    // 모드·구역 단추 모양 (시뮬레이션 app.js 와 같은 selected + aria-pressed)
    var fb = $('#wFree'), pb = $('#wPractice');
    fb.classList.toggle('selected', state.free); fb.setAttribute('aria-pressed', String(state.free));
    fb.textContent = '자유 탐색';
    $('#wModeBadge').textContent = state.practice ? '직접 연결해 보기' : state.free ? '자유 탐색' : '순서대로 보기';
    if (pb) { pb.classList.toggle('selected', state.practice); pb.setAttribute('aria-pressed', String(state.practice)); pb.textContent = '직접 연결'; }
    var sq = $('#wSequence'); if (sq) { sq.classList.toggle('selected', !state.free && !state.practice); sq.setAttribute('aria-pressed', String(!state.free && !state.practice)); }
    var progress = $('#wProgress'); if (progress) progress.hidden = state.free || state.practice;
    document.body.classList.toggle('wire-practice', state.practice);
    $('#wDoneText').textContent = state.free ? '다른 구간 선 옅게 보기' : '앞에서 이은 선 보기';
    document.body.classList.toggle('wire-free', state.free);
    zoneBtns.forEach(function (b) { var on = b.dataset.zone === state.zone; b.classList.toggle('selected', on); b.setAttribute('aria-pressed', String(on)); });
    $('#wCircuitTitle').textContent = state.practice ? '회로도 — ① 이을 구간을 누르세요' : state.free ? '회로도 — 선이나 칸을 눌러 보세요' : '회로도';
  }
  function go(k) { leavePractice(); state.free = false; state.step = Math.max(0, Math.min(STEPS.length - 1, k)); render(); }
  function pick(ni, ref) {
    state.notice = null;
    if (ni == null || ni < 0) { state.pick = -1; state.picked = null; if (ref) state.notice = { ref: ref, ni: null }; }
    else if (!inZone(ni)) { state.pick = -1; state.picked = null; state.notice = { ref: ref, ni: ni }; }
    else { state.pick = ni; state.picked = ref || null; }
    render();
  }
  function setZone(z) {
    var keep = state.free ? state.pick : (STEPS[state.step].kind === 'net' ? STEPS[state.step].i : -1), wasEnd = STEPS[state.step].kind === 'end';
    state.zone = z; buildSteps(); buildSelect();
    if (state.free) { if (keep >= 0 && !inZone(keep)) { state.pick = -1; state.picked = null; } state.notice = null; }
    else state.step = keep >= 0 && inZone(keep) ? 1 + ZI.indexOf(keep) : wasEnd ? STEPS.length - 1 : 0;
    render();
  }
  function setFree(on) {
    if (state.practice) { leavePractice(); state.free = false; state.step = 0; }
    var step = current();
    if (on) { state.free = true; state.pick = step.kind === 'net' ? step.i : -1; state.picked = null; state.notice = null; }
    else { state.free = false; state.step = state.pick >= 0 && inZone(state.pick) ? 1 + ZI.indexOf(state.pick) : 0; }
    buildSelect(); render();
  }

  // 구역 단추(시뮬레이션 view-tabs 모양)
  var zoneBox = $('#wZones');
  zoneBox.innerHTML = ZONES.map(function (z) { return '<button type="button" data-zone="' + z + '" aria-pressed="false">' + ZONE_NAME[z] + '</button>'; }).join('');
  var zoneBtns = [].slice.call(zoneBox.querySelectorAll('button'));
  zoneBtns.forEach(function (b) { b.addEventListener('click', function () { setZone(b.dataset.zone); }); });
  $('#wFree').addEventListener('click', function () { setFree(!state.free); });

  /* ------------------------------------------------------------ 직접 연결해 보기 (요청 0062) */
  var PRACTICE = null;
  function leavePractice() { if (!state.practice) return; state.practice = false; if (PRACTICE) PRACTICE.leave(); }
  function setPractice(on) {
    if (!PRACTICE) return;
    if (on) {
      state.practice = true; state.free = false; state.pick = -1; state.picked = null; state.notice = null;
      PRACTICE.enter(); modeUi(); if (history.replaceState) history.replaceState(null, '', '#practice');
    } else { leavePractice(); state.step = 0; buildSelect(); render(); }
  }
  (function loadPractice() {
    var ok = PRACTICE_READY === 'all' || PRACTICE_READY.indexOf(cid) >= 0 || /[?&]draft=1\b/.test(location.search);
    var box = $('.wire-mode'); if (!ok || !box || !SELF_SRC) return;
    var pb = document.createElement('button');
    pb.type = 'button'; pb.id = 'wPractice'; pb.className = 'free-button practice-button'; pb.setAttribute('aria-pressed', 'false'); pb.textContent = '직접 연결해 보기'; pb.disabled = true;
    box.appendChild(pb);
    pb.addEventListener('click', function () { setPractice(!state.practice); });
    var sc = document.createElement('script');
    sc.src = SELF_SRC.replace(/wire-engine\.js(?=[?#]|$)/, 'wire-practice.js');
    sc.onload = function () {
      var WP = window.WIRE_PRACTICE; if (!WP || !WP.mount) { pb.remove(); return; }
      PRACTICE = WP.mount({
        W: W, C: C, cid: cid, nets: nets, idx: idx, board: board, info: info, circuitSvg: circuitSvg, BASE: BASE, cidx: cidx, HL: HL,
        segLines: segLines, pinBox: pinBox, esc: esc, name: name, GROUP: GROUP, ZONE_NAME: ZONE_NAME,
        svgPoint: svgPoint, hitCircuit: hitCircuit, inZone: function (i) { return inZone(i); },
        zi: function () { return ZI; }, zone: function () { return state.zone; }, showPins: function () { return state.showPins; }, active: function () { return state.practice; }, touchChoices: touchChoices
      });
      pb.disabled = false;
      window.wirePage.practice = PRACTICE; window.wirePage.setPractice = setPractice;
      if (workspace) workspace.practiceReady();
      if (START_PRACTICE) setPractice(true);
    };
    sc.onerror = function () { pb.remove(); };
    document.body.appendChild(sc);
  })();

  $('#wPrev').addEventListener('click', function () { go(state.step - 1); });
  $('#wNext').addEventListener('click', function () { go(state.step + 1); });
  sel.addEventListener('change', function () { if (state.free) pick(+sel.value, null); else go(+sel.value); });
  $('#wDone').addEventListener('change', function (e) { state.showDone = e.target.checked; render(); });
  $('#wPins').addEventListener('change', function (e) { state.showPins = e.target.checked; render(); });
  document.addEventListener('keydown', function (e) {
    if (state.free || state.practice || (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName))) return;
    if (e.key === 'ArrowRight') go(state.step + 1);
    if (e.key === 'ArrowLeft') go(state.step - 1);
  });
  info.addEventListener('click', function (e) {
    if (state.practice) return;
    var b = e.target.closest && e.target.closest('[data-go-all]'); if (!b) return;
    var ni = +b.dataset.goAll, ref = state.notice && state.notice.ref;
    setZone('all'); pick(ni, ref);
  });
  // 자유 탐색: 회로도 누르기 · 올려 두면 미리 보기
  circuitSvg.addEventListener('click', function (e) {
    if (!state.free) return;
    var p = svgPoint(e), hit = p && hitCircuit(p);
    if (hit) pick(hit.ni, hit.ref);
  });
  var raf = 0, lastMove = null;
  circuitSvg.addEventListener('pointermove', function (e) {
    if (!state.free || e.pointerType === 'touch') return;
    lastMove = e; if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      var p = svgPoint(lastMove), hit = p && hitCircuit(p), ni = hit ? hit.ni : -1, g = document.getElementById('wHover');
      if (!g || ni === state.hover) return;
      state.hover = ni;
      g.innerHTML = ni >= 0 && ni !== state.pick ? segLines(nets[ni].id, inZone(ni) ? HOVER : '#9aa5b1', 7, 0.55) : '';
      circuitSvg.style.cursor = ni >= 0 ? 'pointer' : '';
    });
  });
  circuitSvg.addEventListener('pointerleave', function () { var g = document.getElementById('wHover'); if (g) g.innerHTML = ''; state.hover = -1; circuitSvg.style.cursor = ''; });
  // 자유 탐색: 배치도·배관도 누르기 (거꾸로 찾기)
  board.addEventListener('click', function (e) {
    if (!state.free) return;
    var ref = boardRef(e.target); if (!ref) return;
    pick(POINT_NET[ref] != null ? netIdx[POINT_NET[ref]] : null, ref);
  });

  var tabs = document.querySelectorAll('.wire-tabs button');
  if (!hasPiping) { var tb = $('.wire-tabs'); if (tb) tb.hidden = true; }
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      state.view = b.dataset.view;
      tabs.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      render();
    });
  });
  var fs = $('#fullscreen-button');
  if (fs) fs.addEventListener('click', function () { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); });
  if (report.warnings.length && window.console) console.warn('결선 데이터 경고', report.warnings);
  var workspace = mountWorkspace();
  buildSelect();
  render();
  // 검사용(브라우저 시험에서 상태 확인)
  window.wirePage = { state: state, zones: ZONES, zoneNets: function () { return ZI.map(function (i) { return nets[i].id; }); }, pick: pick, setZone: setZone, setFree: setFree, go: go, hitCircuit: hitCircuit, workspace: workspace };

  // 0069: A안. 페이지 HTML·회로 데이터에 배치 분기를 넣지 않고 모든 결선 페이지에 적용.
  function touchChoices(choices, choose) {
    if (choices.length < 2) return false;
    var dialog = $('#wTouchChoices');
    if (!dialog) {
      dialog = document.createElement('dialog'); dialog.id = 'wTouchChoices'; dialog.setAttribute('aria-labelledby', 'wTouchTitle'); document.body.appendChild(dialog);
      dialog.addEventListener('pointerdown', function () { dialog._waitPointer = false; }, true);
      dialog.addEventListener('click', function (e) { if (dialog._waitPointer && e.detail) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
    }
    dialog.innerHTML = '<h2 id="wTouchTitle">누를 단자를 골라주세요</h2><p>가까이 있는 단자는 크게 골라요. 그림을 확대해도 돼요.</p><div class="w-touch-list"></div><button type="button" class="w-touch-cancel">취소</button>';
    choices.forEach(function (c) { var b = document.createElement('button'); b.type = 'button'; b.textContent = c.label; b.dataset.touchKey = c.key; b.onclick = function () { dialog.close(); choose(c.key); }; dialog.querySelector('.w-touch-list').appendChild(b); });
    dialog.querySelector('.w-touch-cancel').onclick = function () { dialog.close(); };
    // 승강기 실습: 목록을 연 터치의 후속 click이 새 목록의 취소/단자까지 누르지 않게 한다.
    // 다음 pointerdown이나 키보드 조작부터 선택한다. 전기·자유 탐색의 동작은 유지한다.
    dialog._waitPointer = state.practice && !hasPiping;
    dialog.showModal(); return true;
  }
  function mountWorkspace() {
    document.body.classList.add('wire-workspace');
    var main = $('.wire-main'), shell = document.createElement('div'), controls = document.createElement('div');
    shell.className = 'w-workspace'; controls.className = 'w-controls'; main.before(shell); shell.append(controls, main);
    var modebar = $('.wire-modebar'); controls.appendChild(modebar);
    var sq = document.createElement('button'); sq.id = 'wSequence'; sq.type = 'button'; sq.textContent = '순서대로'; sq.onclick = function () { if (state.practice) setPractice(false); else setFree(false); }; $('.wire-mode').prepend(sq);
    var options = document.createElement('details'); options.className = 'w-options'; options.innerHTML = '<summary>⋯ 표시</summary><div class="w-options-body"></div>'; modebar.appendChild(options);
    var optionBody = options.lastChild; optionBody.appendChild($('#wZones'));
    [$('#wDone').parentNode, $('#wPins').parentNode].forEach(function (e) { optionBody.appendChild(e); });
    var tools = document.createElement('details'); tools.id = 'wTools'; tools.innerHTML = '<summary>구간 · 도구 ▾</summary><div class="w-tools-body"></div>'; tools.lastChild.appendChild($('.wire-bar')); controls.appendChild(tools);
    var progress = document.createElement('nav'); progress.id = 'wProgress'; progress.setAttribute('aria-label', '순서대로 구간 이동');
    progress.append($('#wPrev'), $('#wCount'), $('#wNext')); tools.before(progress);
    // 가로 화면은 구간 목록과 이전·다음을 한 줄로, 세로·휴대폰은 기존 접힘 유지.
    var landscape = matchMedia('(min-width:600px) and (orientation:landscape)'), segmentBar = sel.parentNode;
    function placeSegment() {
      if (landscape.matches) progress.insertBefore(sel, $('#wCount'));
      else segmentBar.prepend(sel);
    }
    landscape.addEventListener('change', placeSegment); placeSegment();
    var help = document.createElement('details'); help.id = 'wHelp'; help.innerHTML = '<summary><span class="w-help-icon">?</span><span id="wBrief"></span><span class="w-help-more">설명 ▾</span></summary><div class="w-help-body"></div>'; help.lastChild.appendChild(info);
    var note = $('body > p.note'); if (note) help.lastChild.appendChild(note); controls.appendChild(help);
    function brief() {
      var step = current(), ni = state.practice && PRACTICE ? PRACTICE.state.cur : step.i, n = nets[ni], text;
      if (n) {
        var edges = EDGES[ni], spec = W.wireTypes[edges.length ? edges[0].wire : n.wire];
        text = (state.practice ? '구간 ' + (ni + 1) + ' · ' + GROUP[n.group] : n.label) + ' · ' + spec.color + ' ' + spec.size + (edges.length > 1 ? ' 외 ' + (edges.length - 1) + '가닥' : '');
      } else text = state.practice ? '회로도에서 구간을 고른 뒤 단자 두 곳을 이어요' : state.free ? '회로도·배치도의 궁금한 곳을 눌러 보세요' : '다음을 눌러 한 구간씩 연결해 보세요';
      var el = $('#wBrief'); el.textContent = text; el.title = text;
    }
    new MutationObserver(brief).observe(info, { childList: true });
    var circuitCard = circuitSvg.parentNode, ch = document.createElement('div'), cv = document.createElement('div'); ch.className = 'w-figure-head'; cv.className = 'w-circuit-viewport';
    ch.appendChild($('#wCircuitTitle')); cv.appendChild(circuitSvg); circuitCard.append(ch, cv);
    var bh = document.createElement('div'); bh.className = 'w-board-head'; var bt = $('.wire-tabs') || board.parentNode.querySelector('h2,h3'); board.before(bh); if (bt) bh.appendChild(bt);
    var cz = figureZoom(cv, function () { return circuitSvg; }, ch, function () { return false; }, touchCircuit);
    var bz = figureZoom(board, function () { return board.querySelector('svg'); }, bh, function () { return state.practice; }, touchBoard);
    function touchCircuit(e) {
      if (!state.free && !state.practice) return false;
      var m = circuitSvg.getScreenCTM(), found = [], used = {};
      cidx.forEach(function (c) { var pt = circuitSvg.createSVGPoint(); pt.x = c.slot.x; pt.y = c.slot.y; pt = pt.matrixTransform(m); var ni = netIdx[POINT_NET[c.ref]]; if (ni != null && !used[ni] && Math.hypot(pt.x-e.clientX,pt.y-e.clientY) <= 22) { used[ni] = true; found.push({key: ni, label: state.practice ? '구간 ' + (ni+1) + ' · ' + GROUP[nets[ni].group] : nets[ni].label}); } });
      return touchChoices(found, function (ni) { if (state.practice) PRACTICE.pickNet(ni); else pick(ni, null); });
    }
    function touchBoard(e) {
      if (!state.free) return false;
      var found = [], used = {};
      board.querySelectorAll('[data-key],[data-cell]').forEach(function (el) { var ref = boardRef(el), shape = el.querySelector('circle,rect') || el, r = shape.getBoundingClientRect(); if (ref && !used[ref] && Math.hypot(r.x+r.width/2-e.clientX,r.y+r.height/2-e.clientY) <= 22) { used[ref] = true; found.push({key: ref,label: name(ref)}); } });
      return touchChoices(found, function (ref) { pick(netIdx[POINT_NET[ref]], ref); });
    }
    var compact = matchMedia('(max-width: 1100px), (max-height: 650px), (orientation: portrait)');
    function fit() { tools.open = !compact.matches; options.open = false; help.open = false; cz.fit(); bz.fit(); if (PRACTICE) PRACTICE.fit(); }
    var raf; window.addEventListener('resize', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); });
    document.addEventListener('keydown', function (e) { if(e.key === 'Escape') { help.open = false; options.open = false; if(compact.matches)tools.open = false; } });
    // Opening one overlay closes the others, without changing mode or drawn wires.
    [tools,help,options].forEach(function (d) { d.addEventListener('toggle', function () { if (!d.open) return; [help,options].forEach(function (x) { if(x!==d)x.open=false; }); if(d!==tools&&compact.matches)tools.open=false; }); });
    fit(); brief();
    return { fit: fit, brief: brief, circuitZoom: cz, boardZoom: bz, practiceReady: function () { var legend = $('.wp-legend'); if(legend)optionBody.appendChild(legend); brief(); } };
  }
  // Shared diagram zoom/pan for guidance, exploration and the practice circuit.
  // The practice board retains its own viewBox and wire-placement handlers.
  function figureZoom(host, getSvg, head, inactive, touchTap) {
    var bar = document.createElement('div'); bar.className = 'w-zoom'; bar.setAttribute('role','group'); bar.setAttribute('aria-label',head.className==='w-board-head'?'배치도 확대':'회로도 확대');
    bar.innerHTML='<button type="button" data-wzoom="out" aria-label="작게">−</button><button type="button" data-wzoom="fit">맞춤</button><button type="button" data-wzoom="in" aria-label="크게">+</button>'; head.appendChild(bar);
    var s=null, base=null, z=1,x=0,y=0, points={}, gesture=null, suppress=0;
    function sync(){var next=getSvg();if(next!==s){s=next;base=s?s.viewBox.baseVal:null;base=base?{x:base.x,y:base.y,w:base.width,h:base.height}:null;z=1;x=base?base.x:0;y=base?base.y:0;}return s&&base;}
    function apply(){if(inactive()||!sync())return;var w=base.w/z,h=base.h/z;x=Math.max(base.x,Math.min(base.x+base.w-w,x));y=Math.max(base.y,Math.min(base.y+base.h-h,y));s.setAttribute('viewBox',[x,y,w,h].join(' '));host.classList.toggle('w-zoomed',z>1);bar.firstChild.disabled=z<=1;bar.lastChild.disabled=z>=6;}
    function fit(){if(inactive())return;if(!sync())return;z=1;x=base.x;y=base.y;apply();}
    function zoom(n,cx,cy){if(!sync())return;var p=s.createSVGPoint();p.x=cx;p.y=cy;p=p.matrixTransform(s.getScreenCTM().inverse());var rx=(p.x-x)/(base.w/z),ry=(p.y-y)/(base.h/z);z=Math.max(1,Math.min(6,n));x=p.x-rx*base.w/z;y=p.y-ry*base.h/z;apply();}
    bar.onclick=function(e){var b=e.target.closest('[data-wzoom]');if(!b||!sync())return;if(b.dataset.wzoom==='fit')fit();else{var r=s.getBoundingClientRect();zoom(z*(b.dataset.wzoom==='in'?1.5:1/1.5),r.x+r.width/2,r.y+r.height/2);}};
    host.addEventListener('pointerdown',function(e){if(inactive()||!sync())return;points[e.pointerId]={x:e.clientX,y:e.clientY};var ids=Object.keys(points);if(ids.length===1)gesture={type:'tap',x:e.clientX,y:e.clientY,lx:e.clientX,ly:e.clientY};else if(ids.length===2){var a=points[ids[0]],b=points[ids[1]];gesture={type:'pinch',d:Math.hypot(a.x-b.x,a.y-b.y)||1,z:z};}});
    host.addEventListener('pointermove',function(e){if(inactive()||!points[e.pointerId]||!gesture)return;points[e.pointerId]={x:e.clientX,y:e.clientY};var ids=Object.keys(points);if(gesture.type==='pinch'&&ids.length===2){var a=points[ids[0]],b=points[ids[1]];zoom(gesture.z*Math.hypot(a.x-b.x,a.y-b.y)/gesture.d,(a.x+b.x)/2,(a.y+b.y)/2);return;}if(gesture.type==='tap'&&Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>8)gesture.type='pan';if(gesture.type==='pan'){try{host.setPointerCapture(e.pointerId);}catch(_){}var dx=e.clientX-gesture.lx,dy=e.clientY-gesture.ly;gesture.lx=e.clientX;gesture.ly=e.clientY;if(z>1){var m=s.getScreenCTM();x-=dx/m.a;y-=dy/m.d;apply();}else if(innerWidth<600&&e.pointerType!=='mouse')window.scrollBy(0,-dy);}});
    function up(e){if(!points[e.pointerId])return;delete points[e.pointerId];var g=gesture;if(g&&g.type!=='tap')suppress=performance.now()+400;if(g&&g.type==='tap'&&e.type!=='pointercancel'&&e.pointerType!=='mouse'&&touchTap&&touchTap(e))suppress=performance.now()+400;gesture=Object.keys(points).length?{type:'done'}:null;}
    host.addEventListener('pointerup',up);host.addEventListener('pointercancel',up);
    host.addEventListener('click',function(e){if(performance.now()<suppress){e.preventDefault();e.stopImmediatePropagation();}},true);
    new MutationObserver(function(){if(getSvg()!==s&&!inactive())fit();}).observe(host,{childList:true});fit();
    return {fit:fit,scale:function(){return z;}};
  }
})();
