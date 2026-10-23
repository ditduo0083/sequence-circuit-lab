/*
 * 결선하기 — 세 번째 모드 '직접 연결해 보기' (2026-09-28 요청 0062, 1단계 001 시제품)
 * ------------------------------------------------------------------
 * 흐름(작성자 답변 2026-09-28): ① 회로도에서 선·핀번호 칸을 눌러 '지금 연결할 구간'을 고른다(자유 탐색과 같은 hit 판정)
 *   ② 배치도에서 그 구간의 단자를 하나씩 눌러(점 A → 점 B) 잇는다. 잇는 순서는 자유.
 *   ③ 선마다 바로 판정(작성자 결정 2026-09-28): 채점은 연결점만 본다.
 *      - 두 점이 같은 구간이면 그 구간의 선으로 인정한다. 고른 구간이 아니면 '구간 8의 선으로 넣었어요' + 회로도에서 그 구간을 잠깐 강조.
 *      - 오류(빨간 선)는 서로 다른 구간의 두 점을 이은 경우(단락)뿐. 쓰지 않는 단자·바깥쪽 나사·한 나사 3가닥은 주의(주황).
 *      구간의 점이 모두 한 덩어리가 되면 바로 '완성' + 회로도 색칠, 다음 미완성 구간을 추천(무시 가능).
 *   선 색은 그 구간의 선 종류(wire-NNN.js 구간의 wire: 주회로 L1·L2·L3 / 보조 / PE)로 자동. 학생이 선 종류를 고르지 않는다.
 *   나중에 '전선 종류·색 고르기'를 붙일 때: wireFor() 가 고른 종류를 돌려주게 하고, judge() 에 선 종류 판정을 더한다(선마다 wire 는 이미 저장한다).
 *   구간 순서는 자유. 진행률 'n구간 중 m 완성'. 구역 필터를 고르면 그 구역만.
 *   FEEDBACK = 'instant' 만 만든다. 나중에 '다 긋고 마지막에 한 번 채점'(시험 모드)을 붙일 때는 선에 net 을 비워 두고
 *   grade() 를 끝에 한 번 부르면 된다(grade 는 선의 net 이 없으면 점 덩어리만으로 단락·빠짐을 판정한다).
 * 단자대 칸: 권장 배치(terminalBlocks.layout 'block' 규칙)의 칸으로 고정한다(작성자 답변). 칸은 결선 데이터에서 계산해 받으므로
 *   (WIRE_MODEL.resolveAliases) 나중에 '학생이 칸 정하기'로 넓힐 때는 model(W) 에 다른 칸 배정을 넣은 W 를 주면 된다.
 * 회로 데이터(circuit-NNN.js·wire-NNN.js)는 읽기만 한다. 새 데이터 필드는 쓰지 않는다.
 * 불러오기: wire-engine.js 가 필요할 때 같은 폴더에서 이 파일을 붙인다(페이지 HTML 은 고치지 않는다).
 *
 * 채점 (node 에서도 쓴다: 검사/결선_실습시험.cjs)
 *   점  = 배치도 단자. 단자대 칸은 바깥쪽(@ext)·안쪽(@int) 나사가 따로 있지만 전기적으로는 한 점(칸)이다.
 *   주어진 선 = 제어판 밖으로 나가는 선(단자대 바깥쪽 ↔ 버튼·램프·전원 등, 바깥 상자 안 건너 묶기). 배관 작업 몫이라 미리 그어 둔다.
 *   구간(net)마다 '제어판 안에서 이어야 할 점'(= 구간의 점 중 제어판 안 단자) 이 모두 한 덩어리로 이어지면 완성.
 *   연결 순서는 따지지 않는다: 학생 선 + 주어진 선으로 이어진 점 덩어리만 본다.
 *   단락 = 한 덩어리에 두 구간 이상의 점이 섞임. 주의 = 한 나사 3가닥 이상 · 바깥쪽 나사 사용 · 쓰지 않는 단자.
 *
 *   var P = WIRE_PRACTICE;  var M = P.model(W);  var g = P.grade(M, [{ a, b, wire, net }], zoneNetIds|null);  P.judge(M, 선)
 *   g.nets[id] = { status: 'done'|'part'|'none'|'short'|'given', missing, shortWith: [id…] }, g.warnings = [{ type, … }],
 *   g.bad = { 선 번호: 'short'|'unused'|'ext' }   ('short' = 서로 다른 구간의 두 점을 이음 → 빨강. 나머지는 주의 → 주황)
 */
(function (root) {
  'use strict';
  var WM = root.WIRE_MODEL, PR = root.PANEL_RENDER;

  /* ------------------------------------------------------------ 채점 모델 */
  function sideOf(key) { var m = /@(ext|int)$/.exec(key); return m ? m[1] : null; }
  function nodeOf(key) { return String(key).replace(/@(ext|int)$/, ''); }
  function keyOf(p, s) { return p + (s ? '@' + s : ''); }

  function model(W, idx) {
    WM.resolveAliases(W);
    idx = idx || WM.deviceIndex(W);
    var terms = PR.panelTerminals(W, { physicalContacts: true }), netOf = WM.pointNets(W), types = W.wireTypes || {};
    var given = [], answer = [], need = {}, cellOut = {}, problems = [];
    function where(p) { var r = WM.parseRef(p), e = r && idx[r.tag]; return e ? e.where : null; }
    W.nets.forEach(function (n) {
      WM.expandNet(W, n, idx).forEach(function (e) {
        var ka = keyOf(e.a, e.aSide), kb = keyOf(e.b, e.bSide);
        if (e.outside) {
          given.push({ a: ka, b: kb, wire: e.wire, net: n.id, jumper: e.jumper });
          if (!e.jumper) { var pin = where(e.a) === 'panel' ? e.a : e.b, out = pin === e.a ? e.b : e.a; cellOut[pin] = out; }
        } else {
          answer.push({ a: ka, b: kb, wire: e.wire, net: n.id });
          [ka, kb].forEach(function (k) { if (!terms[k]) problems.push('구간 ' + n.id + ': 배치도에 없는 단자 ' + k); });
        }
      });
      var seen = {};
      need[n.id] = WM.pointsOf(n).filter(function (p) { return where(p) === 'panel' && !seen[p] && (seen[p] = 1); });
    });
    var M = { W: W, idx: idx, terms: terms, netOf: netOf, types: types, given: given, answer: answer, need: need, cellOut: cellOut, problems: problems, base: {} };
    // A안: 판 안의 PB(승강기)만 대칭 판정. 전기 외부 PB/SS의 given은 그대로다.
    M.contactPairs = Object.keys(W.panel.devices).filter(function (tag) { return W.panel.devices[tag].type === 'pb'; }).map(function (tag) {
      return [(W.circuit || W.id) + '/' + tag + ':N', (W.circuit || W.id) + '/' + tag + (W.panel.devices[tag].kind === 'b' ? ':C' : ':O')];
    });
    // 주어진 선만으로 이미 한 덩어리인 구간(제어판 안에서 이을 선이 없음) → 'given'
    var uf = unionFind();
    given.forEach(function (e) { uf.join(nodeOf(e.a), nodeOf(e.b)); });
    W.nets.forEach(function (n) { M.base[n.id] = groups(uf, need[n.id]); });
    return M;
  }
  function unionFind() {
    var par = {};
    function find(x) { if (par[x] == null) par[x] = x; while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; }
    return { find: find, join: function (a, b) { par[find(a)] = find(b); } };
  }
  function groups(uf, nodes) { var r = {}; nodes.forEach(function (p) { r[uf.find(p)] = 1; }); return Object.keys(r).length; }

  /* 선 하나 판정 — 연결점만 본다(선 종류는 보지 않음). 반환: '' | 'short'(서로 다른 구간) | 'unused'(쓰지 않는 단자) | 'ext'(바깥쪽 나사) */
  function judgeCore(M, e) {
    var na = M.netOf[nodeOf(e.a)], nb = M.netOf[nodeOf(e.b)];
    if (!na || !nb) return 'unused';
    if (na !== nb) return 'short';
    if (sideOf(e.a) === 'ext' || sideOf(e.b) === 'ext') return 'ext';
    return '';
  }

  function gradeCore(M, edges, zone) {
    var uf = unionFind(), W = M.W, out = { nets: {}, warnings: [], bad: {}, sum: { total: 0, done: 0, short: 0, part: 0 } };
    M.given.forEach(function (e) { uf.join(nodeOf(e.a), nodeOf(e.b)); });
    edges.forEach(function (e) { uf.join(nodeOf(e.a), nodeOf(e.b)); });
    // 덩어리마다 들어 있는 구간
    var compNets = {};
    function mark(p) { var n = M.netOf[p]; if (!n) return; var r = uf.find(p); (compNets[r] = compNets[r] || {})[n] = 1; }
    W.nets.forEach(function (n) { M.need[n.id].forEach(mark); });
    edges.forEach(function (e) { mark(nodeOf(e.a)); mark(nodeOf(e.b)); });
    var inZone = zone ? {} : null; if (zone) zone.forEach(function (id) { inZone[id] = 1; });
    W.nets.forEach(function (n) {
      if (inZone && !inZone[n.id]) return;
      var nodes = M.need[n.id], roots = {}, sw = {};
      nodes.forEach(function (p) { var r = uf.find(p); roots[r] = 1; Object.keys(compNets[r] || {}).forEach(function (x) { if (x !== n.id) sw[x] = 1; }); });
      var k = Object.keys(roots).length, st;
      if (M.base[n.id] <= 1) st = 'given';
      else if (Object.keys(sw).length) st = 'short';
      else if (k === 1) st = 'done';
      else st = k < M.base[n.id] ? 'part' : 'none';
      out.nets[n.id] = { status: st, missing: Math.max(0, k - 1), shortWith: Object.keys(sw), points: nodes.length };
      if (st !== 'given') { out.sum.total++; if (st === 'done') out.sum.done++; if (st === 'short') out.sum.short++; if (st === 'part') out.sum.part++; }
    });
    // 경고: 한 나사 3가닥 이상 · 바깥쪽 나사 · 쓰지 않는 단자 · 선 종류
    var cnt = {}, touched = {}, seen = {};
    M.given.forEach(function (e) { [e.a, e.b].forEach(function (k) { cnt[k] = (cnt[k] || 0) + 1; }); });
    edges.forEach(function (e, i) {
      [e.a, e.b].forEach(function (k) {
        cnt[k] = (cnt[k] || 0) + 1; touched[k] = 1;
        var p = nodeOf(k);
        if (sideOf(k) === 'ext' && !seen['x' + k]) { seen['x' + k] = 1; out.warnings.push({ type: 'ext', key: k }); }
        if (!M.netOf[p]) { out.bad[i] = 'unused'; if (!seen['u' + p]) { seen['u' + p] = 1; out.warnings.push({ type: 'unused', key: k }); } }
      });
      var j = judgeCore(M, e);
      if (j) out.bad[i] = j;
    });
    Object.keys(cnt).forEach(function (k) { if (cnt[k] > 2 && touched[k]) out.warnings.push({ type: 'screw', key: k, count: cnt[k] }); });
    out.sum.warn = out.warnings.length;
    out.sum.all = out.sum.total > 0 && out.sum.done === out.sum.total && !out.warnings.length;
    return out;
  }

  function mappedEdge(e, map) { var c = {}; for (var k in e) c[k] = e[k]; c.a = map[e.a] || e.a; c.b = map[e.b] || e.b; return c; }
  function grade(M, edges, zone) {
    var pairs = M.contactPairs || [];
    if (!pairs.length) return gradeCore(M, edges, zone);
    var best, bestMap, bestScore;
    for (var mask = 0; mask < Math.pow(2, pairs.length); mask++) {
      var map = {}, swaps = 0;
      pairs.forEach(function (pair, i) { if (mask & (1 << i)) { map[pair[0]] = pair[1]; map[pair[1]] = pair[0]; swaps++; } });
      var trial = gradeCore(M, edges.map(function (e) { return mappedEdge(e, map); }), null);
      var score = [trial.sum.short, Object.keys(trial.bad).filter(function (i) { return trial.bad[i] === 'short'; }).length, trial.sum.warn, trial.sum.total - trial.sum.done, Object.keys(trial.nets).reduce(function (n, id) { return n + trial.nets[id].missing; }, 0), swaps];
      var better = !bestScore;
      if (bestScore) for (var i = 0; i < score.length; i++) { if (score[i] !== bestScore[i]) { better = score[i] < bestScore[i]; break; } }
      if (better) { best = trial; bestMap = map; bestScore = score; }
    }
    if (zone) best = gradeCore(M, edges.map(function (e) { return mappedEdge(e, bestMap); }), zone);
    best.warnings.forEach(function (w) { if (w.key) w.key = bestMap[w.key] || w.key; });
    best.pinMap = bestMap;
    return best;
  }
  function judge(M, e, edges) {
    if (!(M.contactPairs || []).length) return judgeCore(M, e);
    var g = grade(M, edges || [e]);
    return judgeCore(M, mappedEdge(e, g.pinMap));
  }

  var api = { model: model, grade: grade, judge: judge, nodeOf: nodeOf, sideOf: sideOf, mount: null };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WIRE_PRACTICE = api;
  if (typeof document === 'undefined') return;

  /* ================================================================== 화면 (wire-engine.js 가 mount(ctx) 로 붙인다) */
  var FEEDBACK = 'instant';   // 선마다 바로 판정. (나중: 'exam' = 다 긋고 마지막에 grade 한 번 — 위 머리말 참고)
  api.mount = function (ctx) {
    var W = ctx.W, esc = ctx.esc, M = model(W, ctx.idx), TYPES = W.wireTypes, TYPE_KEYS = Object.keys(TYPES), NETS = ctx.nets;
    var board = ctx.board, info = ctx.info, circuitSvg = ctx.circuitSvg;
    var OK = '#1f7a4d', BAD = '#d92d20', PICK = '#f97316', HOVER = '#f59e0b', HL = ctx.HL;
    var STORE = 'seq-wire-practice-' + ctx.cid, HAS_OUT = Object.keys(M.cellOut).length > 0;
    var S = { edges: [], cur: -1, flash: -1, sel: null, hint: -1, msg: '', undo: [], name: '', sid: '', saved: true, hover: -1 };
    var Z = { z: 1, x: 0, y: 0, vw: 0, vh: 0 };        // 확대: 배율·보이는 왼쪽 위(그림 좌표)
    var GRADE = null, netIdx = {};
    NETS.forEach(function (n, i) { netIdx[n.id] = i; });
    var infoHome = document.createComment('wInfo 자리'); info.parentNode.insertBefore(infoHome, info);
    function narrow() { return window.matchMedia && window.matchMedia('(max-width: 1100px)').matches; }

    /* ---------- 저장(브라우저 임시 저장 — 새로고침해도 유지) */
    function load() {
      try {
        var d = JSON.parse(window.localStorage.getItem(STORE) || 'null'); if (!d) return;
        S.edges = (d.edges || []).filter(function (e) { return M.terms[e.a] && M.terms[e.b] && TYPES[e.w]; }).map(function (e) { var n = netIdx[e.n] != null ? e.n : M.netOf[nodeOf(e.a)] || null; return { a: e.a, b: e.b, wire: n ? wireFor(n) : e.w, net: n }; });
        if (netIdx[d.cur] != null) S.cur = netIdx[d.cur];
        S.name = d.name || ''; S.sid = d.sid || '';
      } catch (e) { }
    }
    function save() {
      try {
        window.localStorage.setItem(STORE, JSON.stringify({ v: 2, edges: S.edges.map(function (e) { return { a: e.a, b: e.b, w: e.wire, n: e.net }; }), cur: S.cur >= 0 ? NETS[S.cur].id : null, name: S.name, sid: S.sid }));
        S.saved = true;
      } catch (e) { S.saved = false; }
      document.body.dataset.wireUnsaved = S.saved || !S.edges.length ? '' : '1';
    }
    load();

    /* ---------- 이름 */
    function sideWord(s) { return s === 'ext' ? '바깥쪽' : s === 'int' ? '안쪽' : ''; }
    function keyName(k) {
      var p = nodeOf(k), s = sideOf(k), o = M.cellOut[p];
      var ref = WM.parseRef(p), dev = ref && W.panel.devices[ref.tag];
      if (dev && dev.type === 'pb') return ref.tag + ' ' + root.PANEL_LIBRARY.contactName(dev, ref.pin);
      return ctx.name(p) + (s ? ' ' + sideWord(s) : '') + (o ? ' (→ ' + PR.shortLabel(o).join(' ') + ')' : '');
    }
    // 선 색: 그 구간의 선 종류로 자동(작성자 결정). 나중에 '전선 종류·색 고르기'를 붙이면 여기서 고른 종류를 돌려준다
    function wireFor(netId) { var i = netIdx[netId]; return i != null ? NETS[i].wire : TYPE_KEYS[0]; }
    function zoneNets() { return ctx.zi().map(function (i) { return NETS[i]; }); }
    function zoneIds() { return ctx.zone() === 'all' ? null : zoneNets().map(function (n) { return n.id; }); }
    function st(i) { var r = GRADE && GRADE.nets[NETS[i].id]; return r ? r.status : null; }
    function isDone(i) { var s = st(i); return s === 'done' || s === 'given'; }
    // 완성 전 구간은 이름에 답(점 목록)이 드러나지 않게 '구간 k · 제어회로 (회로도 MS)'로만 부른다
    function netTitle(i, full) {
      var n = NETS[i];
      if (full || isDone(i)) return n.label;
      return '구간 ' + (i + 1) + ' · ' + ctx.GROUP[n.group] + (n.circuit ? ' (회로도 ' + n.circuit + ')' : '');
    }
    function nextTodo(from) {                 // 지금 구역에서 from 다음의 미완성 구간(돌아서 처음부터)
      var zi = ctx.zi(), k = zi.indexOf(from);
      for (var j = 1; j <= zi.length; j++) { var i = zi[(k + j + zi.length) % zi.length]; if (i !== from && !isDone(i)) return i; }
      return -1;
    }

    /* ---------- 만들 UI: 도구 줄(선 종류·되돌리기·모두 지우기), 배치도 위 두 줄(지금 구간·진행 / 알림·확대) */
    var bar = document.createElement('div');
    bar.className = 'wp-bar'; bar.id = 'wpBar'; bar.hidden = true;
    bar.innerHTML = '<div class="wp-legend" title="선 색은 구간 종류대로 자동으로 정해져요"><span class="muted">선 색(자동)</span>' + TYPE_KEYS.map(function (k) {
      var t = TYPES[k], sw = t.stripe ? 'background:repeating-linear-gradient(90deg,' + t.ink + ' 0 6px,' + t.stripe + ' 6px 12px)' : 'background:' + t.ink;
      return '<span class="wp-lg"><span class="wp-sw" style="' + sw + '"></span>' + esc(t.label) + '</span>';
    }).join('') + '</div>' +
      '<div class="wp-acts"><span class="wp-prog" id="wpProg"></span><button type="button" id="wpUndo">↶ 한 단계 되돌리기</button><button type="button" id="wpClear">모두 지우기</button></div>';
    var wbar = document.querySelector('.wire-bar');
    wbar.parentNode.insertBefore(bar, wbar.nextSibling);

    var head = document.createElement('div');
    head.className = 'wp-head'; head.hidden = true;
    head.innerHTML = '<div class="wp-now" id="wpNow" aria-live="polite"></div>' +
      '<div class="wp-row"><span class="wp-status" id="wpStatus" aria-live="polite"></span><span class="wp-zoom" role="group" aria-label="확대"><button type="button" data-z="-1" aria-label="작게">−</button><button type="button" data-z="0" aria-label="처음 크기">맞춤</button><button type="button" data-z="1" aria-label="크게">+</button></span></div>';
    board.parentNode.insertBefore(head, board);

    /* ---------- 채점 · 그리기 */
    function regrade() { GRADE = grade(M, S.edges, zoneIds()); return GRADE; }
    function statusWord(s) { return { done: '완성', part: '잇는 중', none: '아직', short: '단락', given: '밖에서 이어짐' }[s]; }

    function drawCircuit() {
      var o = [ctx.BASE], on = {}, g = GRADE;
      o.push('<rect x="0" y="0" width="' + ctx.C.layout.viewBox[0] + '" height="' + ctx.C.layout.viewBox[1] + '" fill="#fff" fill-opacity="0.55"/>');
      if (g) zoneNets().forEach(function (n) {
        var r = g.nets[n.id]; if (!r) return;
        if (r.status === 'done' || r.status === 'given') o.push(ctx.segLines(n.id, OK, 5, 0.85));
        else if (r.status === 'short') o.push(ctx.segLines(n.id, BAD, 5, 0.85));
      });
      if (S.flash >= 0 && S.flash !== S.cur) o.push('<g class="wp-flash">' + ctx.segLines(NETS[S.flash].id, HOVER, 9, 0.8) + '</g>');   // 다른 구간 선으로 넣은 곳 잠깐 강조
      if (S.cur >= 0) { o.push(ctx.segLines(NETS[S.cur].id, HL, 7, 0.9)); WM.pointsOf(NETS[S.cur]).forEach(function (p) { on[p] = 1; }); }
      ctx.cidx.forEach(function (c) {
        if (!on[c.ref] && !ctx.showPins()) return;
        o.push(ctx.pinBox(c.slot.x, c.slot.y, c.pin.replace(/#.*$/, ''), on[c.ref] ? 'on' : 'off'));
      });
      Object.keys(W.circuitPoints || {}).forEach(function (k) {
        if (!on[k]) return; var q = W.circuitPoints[k];
        o.push('<circle cx="' + q[0] + '" cy="' + q[1] + '" r="9" fill="none" stroke="' + HL + '" stroke-width="3"/>');
      });
      o.push('<g id="wpHover" pointer-events="none"></g>');
      circuitSvg.innerHTML = o.join('');
      S.hover = -1;
    }

    function boardEdges() {
      var list = M.given.map(function (e) { return { a: nodeOf(e.a), aSide: sideOf(e.a), b: nodeOf(e.b), bSide: sideOf(e.b), wire: e.wire, state: 'active' }; });
      var curId = S.cur >= 0 ? NETS[S.cur].id : null;
      S.edges.forEach(function (e, i) {
        var bad = GRADE && GRADE.bad[i];
        // 지금 구간 선·틀린 선은 진하게, 다른 구간 선은 옅게
        list.push({ a: nodeOf(e.a), aSide: sideOf(e.a), b: nodeOf(e.b), bSide: sideOf(e.b), wire: e.wire, state: bad || !curId || e.net === curId ? 'active' : 'done', id: i, mark: bad === 'short' ? 'bad' : bad ? 'warn' : '' });
      });
      return list;
    }
    function outLabels() { var o = {}; Object.keys(M.cellOut).forEach(function (p) { var q = M.cellOut[p]; o[q] = PR.shortLabel(q).join(' '); }); return o; }
    var LABELS = outLabels();
    function hintKeys() {
      var hl = {}; if (S.hint < 0) return hl;
      var id = NETS[S.hint].id;
      var map = GRADE && GRADE.pinMap || {};
      M.answer.forEach(function (e) { if (e.net === id) { hl[map[e.a] || e.a] = 1; hl[map[e.b] || e.b] = 1; } });
      M.need[id].forEach(function (p) { var key = map[p] || p; if (!Object.keys(hl).some(function (k) { return nodeOf(k) === key; })) hl[key] = 1; });
      return hl;
    }
    function drawBoard() {
      board.innerHTML = PR.drawPanel(W, { edges: boardEdges(), hl: hintKeys(), labels: LABELS, physicalContacts: true });
      var svg = board.querySelector('svg'); if (!svg) return;
      var vb = svg.viewBox.baseVal; Z.vw = vb.width; Z.vh = vb.height;
      var over = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      over.setAttribute('id', 'wpOver'); over.setAttribute('pointer-events', 'none');
      svg.appendChild(over);
      applyZoom(); drawOver();
    }
    function drawOver(tip) {
      var g = document.getElementById('wpOver'); if (!g) return;
      var o = [], k = 1 / Z.z;
      if (S.sel && M.terms[S.sel]) {
        var t = M.terms[S.sel], ink = TYPES[wireFor(NETS[S.cur].id)].ink;
        if (tip) o.push('<line x1="' + t.x + '" y1="' + t.y + '" x2="' + tip.x + '" y2="' + tip.y + '" stroke="' + ink + '" stroke-width="' + 3 * Math.max(k, 0.5) + '" stroke-dasharray="6 5" stroke-linecap="round"/>');
        o.push('<circle cx="' + t.x + '" cy="' + t.y + '" r="' + Math.max(13, 22 * k) + '" fill="' + PICK + '" fill-opacity="0.18" stroke="' + PICK + '" stroke-width="' + Math.max(2.5, 4 * k) + '"/>');
        o.push('<circle cx="' + t.x + '" cy="' + t.y + '" r="4" fill="' + PICK + '"/>');
      }
      g.innerHTML = o.join('');
    }
    function applyZoom() {
      var svg = board.querySelector('svg'); if (!svg || !Z.vw) return;
      var w = Z.vw / Z.z, h = Z.vh / Z.z;
      Z.x = Math.max(0, Math.min(Z.vw - w, Z.x)); Z.y = Math.max(0, Math.min(Z.vh - h, Z.y));
      svg.setAttribute('viewBox', Z.x + ' ' + Z.y + ' ' + w + ' ' + h);
      board.classList.toggle('wp-zoomed', Z.z > 1.01);
      var zb = head.querySelectorAll('.wp-zoom button');
      zb[0].disabled = Z.z <= 1.01; zb[2].disabled = Z.z >= 5.99;
    }
    function zoomAt(nz, sx, sy) {           // sx, sy: 그림 안 비율(0~1) 자리를 고정한 채 배율 바꾸기
      nz = Math.max(1, Math.min(6, nz));
      var w = Z.vw / Z.z, h = Z.vh / Z.z, px = Z.x + sx * w, py = Z.y + sy * h;
      Z.z = nz; Z.x = px - sx * Z.vw / nz; Z.y = py - sy * Z.vh / nz;
      applyZoom(); drawOver();
    }

    function progress() { var s = GRADE ? GRADE.sum : { total: 0, done: 0 }; return '<b>' + s.total + '</b>구간 중 <b>' + s.done + '</b> 완성'; }
    function nowHtml() {
      var zw = ctx.zone() === 'all' ? '' : ctx.ZONE_NAME[ctx.zone()] + ' ';
      if (S.cur < 0) return '<span class="wp-step">①</span> <b>회로도</b>에서 이을 구간의 선이나 핀번호 칸을 누르세요 <span class="muted">(' + zw + progress().replace(/<\/?b>/g, '') + ')</span>';
      var s = st(S.cur), nt = nextTodo(S.cur);
      return '<span class="wp-step">②</span> 지금 구간: <b class="wp-cur">' + esc(netTitle(S.cur)) + '</b> <span class="wp-st wp-' + s + '">' + statusWord(s) + '</span>' +
        (isDone(S.cur) ? '' : ' <button type="button" class="wp-hint" data-hint="' + S.cur + '" title="힌트: 이 구간 점 보기">' + (S.hint === S.cur ? '힌트 끄기' : '힌트: 점 보기') + '</button>') +
        (isDone(S.cur) && nt >= 0 ? ' <button type="button" class="wp-next primary" data-pick="' + nt + '">다음 구간 ▶ ' + esc(netTitle(nt)) + '</button>' : '') +
        (isDone(S.cur) && nt < 0 ? ' <b class="wp-okt">' + zw + '모든 구간 완성!</b>' : '');
    }
    function statusText() {
      if (S.sel) return '<b class="wp-a">' + esc(keyName(S.sel)) + '</b> 고름 → 이을 단자를 누르세요 <span class="muted">(같은 단자를 다시 누르면 취소)</span>';
      if (S.msg) return S.msg;
      if (S.cur < 0) return '<span class="muted">구간을 고른 뒤 배치도에서 단자 하나 → 이을 단자를 누르면 선이 생겨요.</span>';
      return '<span class="muted">배치도에서 이 구간의 단자 하나 → 이을 단자를 누르세요. 잇는 순서는 자유예요. 선을 누르면 지워져요.</span>';
    }
    function renderInfo() {
      var h = [], g = GRADE, zn = zoneNets(), zw = ctx.zone() === 'all' ? '' : '<b>' + ctx.ZONE_NAME[ctx.zone()] + '</b> ';
      h.push('<h2>직접 연결해 보기</h2>');
      h.push('<p><b>① 회로도</b>에서 이을 구간(선이나 핀번호 칸)을 누르고, <b>② ' + (HAS_OUT ? '제어판 배치도' : '기구 배치도') + '</b>에서 그 구간의 단자를 하나씩 이어요. <b>단자 하나 → 이을 단자</b>를 누르면 선 하나가 생기고, 그은 선을 누르면 지워져요. 선 색은 구간 종류(주회로·보조·PE)대로 자동으로 정해져요.</p>');
      h.push('<ul class="wi-rules"><li>잇는 순서도, 구간 순서도 자유예요. 구간의 점이 모두 이어지면 바로 <b style="color:' + OK + '">완성</b>이 되고 회로도에 초록으로 칠해져요.</li>' +
        (M.contactPairs.length ? '<li>푸시버튼은 <b>위쪽 NC·아래쪽 NO</b>에 구멍이 두 개씩 있어요. 같은 접점의 좌우는 바꿔 이어도 돼요. 쓰지 않는 접점에 이으면 주의로 알려 줘요.</li>' : '') +
        '<li>두 점이 다른 구간이면 그 구간의 선으로 넣어요. <b style="color:' + BAD + '">서로 다른 구간의 두 점</b>을 이으면 단락이라 빨간 선으로 알려 줘요. 선을 누르거나 되돌리기로 지워요.</li>' +
        (HAS_OUT ? '<li>단자대(TB5·TB6)에서 <b>제어판 밖으로 가는 선</b>(파란 화살표)은 미리 그어 두었어요. 칸은 단자대 번호매기기의 권장 배치예요. 제어판 안 선은 단자대 <b>안쪽 나사</b>에 물려요.</li>'
          : '<li>단자대(TB1·TB2)의 <b>바깥쪽 나사에는 선을 물리지 않아요</b>(전원·부하 쪽 결선은 웹 실습에서 다루지 않아요).</li>') +
        '<li>한 단자에는 선을 <b>2가닥까지</b>만 물려요.</li>' + (zw ? '<li>지금은 ' + zw + '구간만 보여요.</li>' : '') + '</ul>');
      if (g) {
        var s = g.sum;
        h.push('<div class="wp-sum' + (s.all ? ' is-all' : '') + '">' + (s.all ? '<b>' + zw + '모든 구간 완성!</b> ' : '') + zw + progress() +
          (s.short ? ' · <span class="wp-bad">단락 ' + s.short + '</span>' : '') + (s.warn ? ' · <span class="wp-warn">주의 ' + s.warn + '</span>' : '') + '</div>');
        h.push(warnHtml(g));
        h.push('<ol class="wp-list">' + zn.map(function (n, z) {
          var r = g.nets[n.id], i = NETS.indexOf(n); if (!r) return '';
          var open = r.status === 'done' || r.status === 'given';
          var detail = r.status === 'short' ? r.shortWith.map(function (x) { return '‘' + esc(netTitle(netIdx[x])) + '’'; }).join('·') + ' 구간과 이어졌어요' :
            r.status === 'part' ? '빠진 연결 ' + r.missing + '곳' : r.status === 'given' ? '제어판 안에서 이을 선 없음' : '';
          return '<li class="wp-' + r.status + (S.cur === i ? ' is-focus' : '') + '" data-pick="' + i + '" title="이 구간 고르기"><span class="wp-no">' + (z + 1) + '</span><span class="wp-st">' + statusWord(r.status) + '</span>' +
            '<span class="wp-name">' + esc(netTitle(i)) + (detail ? ' <small>' + detail + '</small>' : '') + '</span>' +
            (open ? '' : '<button type="button" class="wp-hint" data-hint="' + i + '" title="힌트: 이 구간 점 보기">' + (S.hint === i ? '힌트 끄기' : '힌트') + '</button>') + '</li>';
        }).join('') + '</ol>');
        h.push('<p class="muted">줄을 누르면 그 구간을 ‘지금 연결할 구간’으로 골라요.</p>');
      }
      h.push('<div class="wp-submit"><label>이름 <input type="text" id="wpName" autocomplete="off" value="' + esc(S.name) + '"></label><label>학번 <input type="text" id="wpSid" autocomplete="off" value="' + esc(S.sid) + '"></label>' +
        '<button type="button" id="wpSave">이미지 저장</button><button type="button" id="wpShare" hidden>공유</button>' +
        '<span class="muted">' + (S.saved ? '그은 선은 이 브라우저에 임시 저장돼요(새로 고쳐도 남아요).' : '<b class="wp-bad">이 브라우저는 임시 저장이 안 돼요.</b> 창을 닫기 전에 결과 이미지를 저장하세요.') + '</span></div>');
      info.innerHTML = h.join('');
      try { if (navigator.canShare && navigator.canShare({ files: [new File([''], 'a.png', { type: 'image/png' })] })) document.getElementById('wpShare').hidden = false; } catch (e) { }
    }
    function warnHtml(g) {
      if (!g.warnings.length) return '';
      var seen = {}, li = [];
      g.warnings.forEach(function (w) {
        var t;
        if (w.type === 'screw') t = '<b>' + esc(keyName(w.key)) + '</b>에 선이 ' + w.count + '가닥 — 한 단자에는 2가닥까지만 물려요.';
        else if (w.type === 'ext') t = '<b>' + esc(keyName(w.key)) + '</b> — ' + extWord();
        else if (w.type === 'unused') t = '<b>' + esc(keyName(w.key)) + '</b> — 이 회로에서는 쓰지 않는 단자예요.';
        if (!seen[t]) { seen[t] = 1; li.push('<li>' + t + '</li>'); }
      });
      return '<div class="wp-warns"><b>주의</b><ul>' + li.join('') + '</ul></div>';
    }
    function extWord() { return HAS_OUT ? '단자대 바깥쪽 나사는 제어판 밖과 잇는 자리예요. 제어판 안 선은 안쪽 나사에 물려요.' : '단자대 바깥쪽 나사에는 선을 물리지 않아요. 안쪽 나사에 물려요.'; }
    function renderBar() {
      document.getElementById('wpUndo').disabled = !S.undo.length;
      document.getElementById('wpClear').disabled = !S.edges.length;
      document.getElementById('wpProg').innerHTML = (ctx.zone() === 'all' ? '' : esc(ctx.ZONE_NAME[ctx.zone()]) + ' ') + progress();
      document.getElementById('wpNow').innerHTML = nowHtml();
      document.getElementById('wpStatus').innerHTML = statusText();
    }
    function render() {
      if (S.cur >= 0 && !ctx.inZone(S.cur)) { S.cur = -1; S.hint = -1; }
      regrade(); renderBar(); renderInfo(); drawCircuit(); drawBoard();
    }
    function light() { renderBar(); drawOver(); }   // 고르기만 바뀐 때(그림 다시 안 그림)

    /* ---------- 조작 */
    function snapshot() { S.undo.push(S.edges.map(function (e) { return { a: e.a, b: e.b, wire: e.wire, net: e.net }; })); if (S.undo.length > 200) S.undo.shift(); }
    function changed(msg) { S.msg = msg || ''; save(); render(); }
    function pickNet(i, why) {
      if (i == null || i < 0) { S.msg = why || '이 점은 선을 물리지 않는 자리예요. 다른 선이나 칸을 눌러 보세요.'; light(); return; }
      if (!ctx.inZone(i)) { S.msg = '이 구간은 <b>' + esc(ctx.GROUP[NETS[i].group]) + '</b> 구간이에요. 지금은 ' + esc(ctx.ZONE_NAME[ctx.zone()]) + '만 보고 있어요.'; light(); return; }
      S.cur = i; S.sel = null; S.hint = -1; S.msg = '';
      save(); render();
      if (narrow()) head.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    var delBtn = function (i) { return ' <button type="button" class="wp-del" data-del="' + i + '">이 선 지우기</button>'; };
    function tapTerm(k) {
      if (S.cur < 0) { S.sel = null; S.msg = '<b class="wp-a">먼저 회로도에서 이을 구간</b>(선이나 핀번호 칸)을 누르세요.'; light(); return; }
      if (!S.sel) { S.sel = k; S.msg = ''; light(); return; }
      if (S.sel === k) { S.sel = null; S.msg = '고르기를 취소했어요.'; light(); return; }
      var a = S.sel; S.sel = null;
      if (nodeOf(a) === nodeOf(k)) { S.msg = '같은 칸의 안쪽·바깥쪽 나사는 이미 이어져 있어요. 다른 단자를 고르세요.'; light(); return; }
      var dup = S.edges.some(function (e) { return (e.a === a && e.b === k) || (e.a === k && e.b === a); });
      if (dup) { S.msg = '이미 이은 선이에요.'; light(); return; }
      var preview = grade(M, S.edges.concat([{ a: a, b: k }])), map = preview.pinMap || {};
      var na = M.netOf[map[nodeOf(a)] || nodeOf(a)], nb = M.netOf[map[nodeOf(k)] || nodeOf(k)], cur = NETS[S.cur].id;
      // 두 점이 같은 구간이면 그 구간의 선(고른 구간이 아니어도), 아니면 고른 구간의 선으로 둔다
      var owner = na && na === nb ? na : cur, oi = netIdx[owner], wasDone = isDone(oi);
      var e = { a: a, b: k, wire: wireFor(owner), net: owner }, i = S.edges.length;
      snapshot(); S.edges.push(e); save(); regrade();
      var j = judge(M, e, S.edges), nm = '<b>' + esc(keyName(a)) + '</b> – <b>' + esc(keyName(k)) + '</b>', msg;
      var cnt = {}; M.given.concat(S.edges).forEach(function (x) { [x.a, x.b].forEach(function (q) { cnt[q] = (cnt[q] || 0) + 1; }); });
      var over = [a, k].filter(function (q) { return cnt[q] > 2; });
      if (j === 'short') {
        msg = '<span class="wp-bad">✗ 단락</span> — <b>' + esc(keyName(a)) + '</b>와 <b>' + esc(keyName(k)) + '</b>는 서로 다른 구간이에요.' + delBtn(i);
      } else if (j === 'unused') {
        msg = '<span class="wp-warn">⚠ 쓰지 않는 단자</span> — ' + [a, k].filter(function (q) { return !M.netOf[nodeOf(q)]; }).map(function (q) { return '<b>' + esc(keyName(q)) + '</b>'; }).join('·') + '는 이 회로에서 쓰지 않아요.' + delBtn(i);
      } else {
        var moved = owner !== cur;
        if (moved) { S.flash = oi; setTimeout(function () { if (S.flash === oi) { S.flash = -1; var f = circuitSvg.querySelector('.wp-flash'); if (f) f.remove(); } }, 1800); }
        if (!wasDone && isDone(oi)) {
          var nt = nextTodo(oi);
          msg = (moved ? '<b>' + esc(netTitle(oi, true)) + '</b>의 선으로 넣었어요 — ' : '') + '<b class="wp-okt">✓ 완성!</b> ' + (moved ? '' : esc(NETS[oi].label)) +
            (moved ? '' : nt >= 0 ? ' — 다음 구간을 고르거나 위 ‘다음 구간 ▶’을 누르세요.' : ' — ' + (ctx.zone() === 'all' ? '' : esc(ctx.ZONE_NAME[ctx.zone()]) + ' ') + '모든 구간을 이었어요!');
        } else if (moved) msg = '<span class="wp-okt">✓</span> 지금 구간이 아니라 <b>' + esc(netTitle(oi)) + '</b>의 선으로 넣었어요.';
        else msg = '<span class="wp-okt">✓</span> ' + nm + ' 선을 그었어요';
        if (j === 'ext') msg += ' <span class="wp-warn">⚠ 바깥쪽 나사</span> — ' + extWord() + delBtn(i);
      }
      if (over.length) msg += ' <span class="wp-warn">⚠ ' + over.map(function (q) { return esc(keyName(q)); }).join('·') + '에 선이 3가닥 — 한 단자에는 2가닥까지만 물려요.</span>' + (/data-del/.test(msg) ? '' : delBtn(i));
      S.msg = msg; render();
    }
    function removeWire(i) {
      var e = S.edges[i]; if (!e) return;
      snapshot(); S.edges.splice(i, 1);
      changed('<b>' + esc(keyName(e.a)) + '</b> – <b>' + esc(keyName(e.b)) + '</b> 선을 지웠어요. <span class="muted">(되돌리기로 살릴 수 있어요)</span>');
    }
    function undo() { if (!S.undo.length) return; S.edges = S.undo.pop(); S.sel = null; changed('한 단계 되돌렸어요.'); }
    function clearAll() {
      if (!S.edges.length || !window.confirm('그은 선 ' + S.edges.length + '가닥을 모두 지울까요?')) return;
      snapshot(); S.edges = []; S.hint = -1; S.sel = null; changed('모두 지웠어요. (되돌리기로 살릴 수 있어요)');
    }

    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.id === 'wpUndo') undo();
      else if (b.id === 'wpClear') clearAll();
    });
    function commonClick(e) {                // 힌트·다음 구간·이 선 지우기 (배치도 위 줄과 결과 카드에 같이)
      var hb = e.target.closest('[data-hint]');
      if (hb) { var i = +hb.dataset.hint; S.hint = S.hint === i ? -1 : i; if (S.hint >= 0 && S.cur !== i) S.cur = i; S.msg = ''; save(); render(); return true; }
      var db = e.target.closest('[data-del]');
      if (db) { removeWire(+db.dataset.del); return true; }
      var pb = e.target.closest('[data-pick]');
      if (pb) { pickNet(+pb.dataset.pick); return true; }
      return false;
    }
    head.addEventListener('click', function (e) {
      if (commonClick(e)) return;
      var b = e.target.closest('[data-z]'); if (!b) return;
      var d = +b.dataset.z; if (d === 0) { Z.z = 1; Z.x = 0; Z.y = 0; applyZoom(); drawOver(); } else zoomAt(Z.z * (d > 0 ? 1.5 : 1 / 1.5), 0.5, 0.5);
    });
    info.addEventListener('click', function (e) {
      if (!ctx.active()) return;
      if (e.target.closest('#wpSave')) { buildPng(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = fileName(); document.body.appendChild(a); a.click(); a.remove(); }); return; }
      if (e.target.closest('#wpShare')) { buildPng(function (b) { navigator.share({ files: [new File([b], fileName(), { type: 'image/png' })], title: W.title }).catch(function () { }); }); return; }
      commonClick(e);
    });
    info.addEventListener('input', function (e) {
      if (e.target.id === 'wpName') { S.name = e.target.value; save(); }
      if (e.target.id === 'wpSid') { S.sid = e.target.value; save(); }
    });

    /* ---------- 회로도 누르기(자유 탐색과 같은 hit 판정) · 올려 두면 미리 보기 */
    circuitSvg.addEventListener('click', function (e) {
      if (!ctx.active()) return;
      var p = ctx.svgPoint(e), hit = p && ctx.hitCircuit(p);
      if (hit) pickNet(hit.ni);
    });
    var raf = 0, lastMove = null;
    circuitSvg.addEventListener('pointermove', function (e) {
      if (!ctx.active() || e.pointerType === 'touch') return;
      lastMove = e; if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var p = ctx.svgPoint(lastMove), hit = p && ctx.hitCircuit(p), ni = hit && hit.ni != null ? hit.ni : -1, g = document.getElementById('wpHover');
        if (!g || ni === S.hover) return;
        S.hover = ni;
        g.innerHTML = ni >= 0 && ni !== S.cur ? ctx.segLines(NETS[ni].id, ctx.inZone(ni) ? HOVER : '#9aa5b1', 7, 0.55) : '';
        circuitSvg.style.cursor = ni >= 0 ? 'pointer' : '';
      });
    });
    circuitSvg.addEventListener('pointerleave', function () { if (!ctx.active()) return; var g = document.getElementById('wpHover'); if (g) g.innerHTML = ''; S.hover = -1; circuitSvg.style.cursor = ''; });

    /* ---------- 배치도 누르기 · 끌어 옮기기 · 두 손가락 확대 */
    function svgXY(ev) {
      var svg = board.querySelector('svg'), m = svg && svg.getScreenCTM(); if (!m) return null;
      var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      var p = pt.matrixTransform(m.inverse()); return { x: p.x, y: p.y, k: 1 / (Math.abs(m.a) || 1) };
    }
    function nearestTerm(p, touch) {          // → { k, px(화면 거리) } 또는 null
      var tol = (touch ? 22 : 14) * p.k, best = null;
      Object.keys(M.terms).forEach(function (k) {
        var t = M.terms[k], d = Math.hypot(t.x - p.x, t.y - p.y);
        if (d <= tol && (!best || d < best.d)) best = { d: d, k: k };
      });
      return best && { k: best.k, px: best.d / p.k };
    }
    var ptrs = {}, gest = null;
    board.addEventListener('pointerdown', function (e) {
      if (!ctx.active()) return;
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(ptrs);
      if (ids.length === 1) gest = { kind: 'tap', x0: e.clientX, y0: e.clientY, lx: e.clientX, ly: e.clientY, touch: e.pointerType !== 'mouse' };
      else if (ids.length === 2) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]], r = board.getBoundingClientRect();
        gest = { kind: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, z0: Z.z, cx: ((a.x + b.x) / 2 - r.left) / r.width, cy: ((a.y + b.y) / 2 - r.top) / r.height };
      }
      try { board.setPointerCapture(e.pointerId); } catch (x) { }
    });
    board.addEventListener('pointermove', function (e) {
      if (!ctx.active()) return;
      if (ptrs[e.pointerId]) ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (gest && gest.kind === 'pinch') {
        var ids = Object.keys(ptrs); if (ids.length < 2) return;
        var a = ptrs[ids[0]], b = ptrs[ids[1]];
        var svg = board.querySelector('svg'), r = svg.getBoundingClientRect();
        var cx = ((a.x + b.x) / 2 - r.left) / r.width, cy = ((a.y + b.y) / 2 - r.top) / r.height;
        zoomAt(gest.z0 * Math.hypot(a.x - b.x, a.y - b.y) / gest.d0, Math.max(0, Math.min(1, cx)), Math.max(0, Math.min(1, cy)));
        return;
      }
      if (gest && ptrs[e.pointerId]) {
        if (gest.kind === 'tap' && Math.hypot(e.clientX - gest.x0, e.clientY - gest.y0) > 8) gest.kind = 'pan';
        if (gest.kind === 'pan') {
          var dx = e.clientX - gest.lx, dy = e.clientY - gest.ly; gest.lx = e.clientX; gest.ly = e.clientY;
          if (Z.z > 1.01) { var sv = board.querySelector('svg').getBoundingClientRect(); Z.x -= dx * (Z.vw / Z.z) / sv.width; Z.y -= dy * (Z.vh / Z.z) / sv.height; applyZoom(); drawOver(); }
          else if (gest.touch) window.scrollBy(0, -dy);   // 확대 전에는 손가락으로 끌면 페이지가 내려가게
        }
        return;
      }
      if (S.sel && e.pointerType === 'mouse') { var p = svgXY(e); if (p) drawOver(p); }
    });
    function up(e) {
      if (!ptrs[e.pointerId]) return;
      delete ptrs[e.pointerId];
      var g = gest;
      if (Object.keys(ptrs).length === 0) gest = null;
      else if (g && g.kind === 'pinch') gest = { kind: 'done' };   // 두 손가락 중 하나만 뗌 → 남은 손가락은 누르기로 치지 않는다
      if (!g || g.kind !== 'tap' || e.type === 'pointercancel' || !ctx.active()) return;
      var p = svgXY(e); if (!p) return;
      var near = nearestTerm(p, g.touch);
      if (g.touch && ctx.touchChoices) {
        var choices = Object.keys(M.terms).filter(function (k) { var t = M.terms[k]; return Math.hypot(t.x-p.x,t.y-p.y) <= 22*p.k; }).map(function (k) { return {key:k,label:keyName(k)}; });
        if (ctx.touchChoices(choices, tapTerm)) return;
      }
      var el = document.elementFromPoint(e.clientX, e.clientY), w = el && el.closest && el.closest('[data-wire]');
      if (w && !board.contains(w)) w = null;
      // 손가락 바로 아래가 선이고 단자가 10px 안에 없으면 선(지우기)을 먼저 — 확대 안 한 휴대폰에서도 선을 누를 수 있게
      if (w && (!near || near.px > 10)) { removeWire(+w.dataset.wire); return; }
      if (near) { tapTerm(near.k); return; }
      if (w) { removeWire(+w.dataset.wire); return; }
      if (S.sel) { S.sel = null; S.msg = '고르기를 취소했어요.'; light(); }
    }
    board.addEventListener('pointerup', up);
    board.addEventListener('pointercancel', up);
    board.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') drawOver(); });
    document.addEventListener('keydown', function (e) {
      if (!ctx.active() || (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName))) return;
      if (e.key === 'Escape' && S.sel) { S.sel = null; S.msg = ''; light(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); undo(); }
    });

    /* ---------- 결과 이미지(PNG): 이름·학번·날짜 + 배치도(그은 선) + 구간 완성표 */
    function two(n) { return (n < 10 ? '0' : '') + n; }
    function stamp(d) { return d.getFullYear() + '-' + two(d.getMonth() + 1) + '-' + two(d.getDate()) + ' ' + two(d.getHours()) + ':' + two(d.getMinutes()); }
    function fileName() {
      var id = (S.sid || '').replace(/[^0-9A-Za-z-]/g, ''), d = new Date();
      return 'wire-' + ctx.cid + (id ? '-' + id : '') + '-' + d.getFullYear() + two(d.getMonth() + 1) + two(d.getDate()) + '.png';
    }
    function buildPng(cb) {
      var g = regrade(), FONT = "'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif", CW = 1400, PAD = 40, TW = CW - PAD * 2;
      var keepCur = S.cur; S.cur = -1;           // 그림에는 모든 선을 진하게
      var svgStr = PR.drawPanel(W, { edges: boardEdges(), hl: {}, labels: LABELS, physicalContacts: true }); S.cur = keepCur;
      var vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svgStr), bw = TW, bh = Math.round(TW * (+vb[2]) / (+vb[1]));
      var zn = zoneNets().filter(function (n) { return g.nets[n.id] && g.nets[n.id].status !== 'given'; });
      var rows = Math.ceil(zn.length / 2), LH = 30, wl = [];
      var tmp = document.createElement('div'); tmp.innerHTML = warnHtml(g);
      [].forEach.call(tmp.querySelectorAll('li'), function (l) { wl.push(l.textContent); });
      var nShort = Object.keys(g.bad).filter(function (i) { return g.bad[i] === 'short'; }).length;
      var H = 140 + bh + 30 + 50 + rows * LH + (wl.length ? 50 + wl.length * LH : 0) + 30;
      var cv = document.createElement('canvas'); cv.width = CW; cv.height = H;
      var c = cv.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, CW, H);
      c.fillStyle = '#1f2933'; c.font = 'bold 28px ' + FONT; c.fillText((W.title || '') + ' — 직접 연결해 보기', PAD, 46);
      c.font = '20px ' + FONT; c.fillText('이름 ' + (S.name || '(이름 없음)') + '   학번 ' + (S.sid || '(학번 없음)') + '   ' + stamp(new Date()), PAD, 82);
      var s = g.sum, zw = ctx.zone() === 'all' ? '전체' : ctx.ZONE_NAME[ctx.zone()];
      c.font = 'bold 21px ' + FONT; c.fillStyle = s.all ? OK : '#1f2933';
      c.fillText('[' + zw + '] ' + s.total + '구간 중 ' + s.done + ' 완성   단락 ' + s.short + '   다른 구간끼리 이은 선(단락) ' + nShort + '   주의 ' + s.warn + '   그은 선 ' + S.edges.length + '가닥' + (s.all ? '   — 모든 구간 완성' : ''), PAD, 118);
      var img = new Image();
      img.onload = function () {
        var y = 140; c.drawImage(img, PAD, y, bw, bh); c.strokeStyle = '#d6dde5'; c.strokeRect(PAD + 0.5, y + 0.5, bw - 1, bh - 1);
        y += bh + 30;
        c.fillStyle = '#1d4ed8'; c.font = 'bold 22px ' + FONT; c.fillText('구간 완성표', PAD, y + 24); y += 50;
        var colW = TW / 2;
        zn.forEach(function (n, j) {
          var r = g.nets[n.id], i = NETS.indexOf(n), x = PAD + (j < rows ? 0 : colW), yy = y + (j % rows) * LH;
          c.fillStyle = r.status === 'done' ? OK : r.status === 'short' ? BAD : '#8a5a00';
          c.font = 'bold 18px ' + FONT; c.fillText(statusWord(r.status), x, yy + 20);
          c.fillStyle = '#1f2933'; c.font = '18px ' + FONT;
          var t = (i + 1) + '. ' + netTitle(i) + (r.status === 'part' ? ' · 빠진 연결 ' + r.missing : '');
          while (c.measureText(t).width > colW - 90 && t.length > 4) t = t.slice(0, -2);
          c.fillText(t, x + 80, yy + 20);
        });
        y += rows * LH;
        if (wl.length) {
          y += 20; c.fillStyle = '#b54708'; c.font = 'bold 20px ' + FONT; c.fillText('주의', PAD, y + 20); y += 30;
          c.font = '17px ' + FONT; c.fillStyle = '#3e4c59';
          wl.forEach(function (t) { while (c.measureText(t).width > TW && t.length > 4) t = t.slice(0, -2); c.fillText('· ' + t, PAD, y + 20); y += LH; });
        }
        cv.toBlob(function (b) { cb(b); }, 'image/png');
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr.replace('<svg ', '<svg width="' + bw + '" height="' + bh + '" '));
    }

    return {
      render: render, feedback: FEEDBACK,
      // 연습 중에는 설명·결과 카드를 그림(회로도·배치도) 아래로 옮겨, 배치도가 첫 화면에 가깝게 오게 한다. 나가면 제자리로
      enter: function () { bar.hidden = false; head.hidden = false; S.sel = null; S.msg = ''; var mn = document.querySelector('.wire-main'); if (mn && info.nextElementSibling === mn) mn.parentNode.insertBefore(info, mn.nextSibling); render();
        if (!document.body.classList.contains('wire-workspace') && !narrow() && bar.getBoundingClientRect().top > 8) bar.scrollIntoView({ block: 'start' }); },
      leave: function () { bar.hidden = true; head.hidden = true; S.sel = null; S.hint = -1; if (infoHome.parentNode) infoHome.parentNode.insertBefore(info, infoHome); },
      // 검사용
      state: S, model: M, grade: function () { return regrade(); }, tap: tapTerm, pickNet: pickNet, removeWire: removeWire, undo: undo, zoom: Z, fit: function () { Z.z=1; Z.x=0; Z.y=0; applyZoom(); drawOver(); }, buildPng: buildPng, fileName: fileName,
      setStudent: function (name, sid) { S.name = name; S.sid = sid; save(); },
      setEdges: function (list) { snapshot(); S.edges = list.map(function (e) { var n = e.net || M.netOf[nodeOf(e.a)] || null; return { a: e.a, b: e.b, wire: n ? wireFor(n) : TYPE_KEYS[0], net: n }; }); changed(''); },
      // 회로도에서 그 구간을 누를 자리(그림 좌표): 핀번호 칸 → circuitPoints → 칠한 선 가운데
      circuitSpot: function (id) {
        var c = ctx.cidx.filter(function (x) { return M.netOf[x.ref] === id; })[0];
        if (c) return { x: c.slot.x, y: c.slot.y };
        var k = Object.keys(W.circuitPoints || {}).filter(function (x) { return M.netOf[x] === id; })[0];
        return k ? { x: W.circuitPoints[k][0], y: W.circuitPoints[k][1] } : null;
      }
    };
  };
})(typeof window === 'undefined' ? globalThis : window);
