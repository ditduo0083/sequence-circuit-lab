/*
 * 결선하기 — 결선 데이터 모델 + 검사기 (2026-09-26, 요청 0028)
 * ------------------------------------------------------------------
 * 브라우저: wire-engine.js·tb-engine.js 가 시작할 때 돌린다(오류가 있으면 화면 위에 빨간 상자).
 * node   : 검사/결선검사.cjs 가 같은 함수를 쓴다.
 * 읽는 것: 회로 데이터(circuit-NNN.js), 결선 데이터(wire-NNN.js), device-library.js, pin-validate.js(칸 목록 만들기), panel-library.js
 *
 * 점 ID: '<회로>/<태그>:<핀>' (핀번호 v2와 같은 형식). 셀렉터 스위치 N 두 개만 '<회로>/SS:SS#ssM' 처럼 '#칸항목id' 를 붙인다.
 * 이 파일은 회로 데이터·기존 엔진을 고치지 않는다. 읽기만 한다.
 */
(function (root) {
  'use strict';

  /* ------------------------------------------------------------ 점 ID */
  function parseRef(ref) {
    var m = /^([^/]+)\/([^:]+):(.+)$/.exec(ref || '');
    if (!m) return null;
    return { circuit: m[1], tag: m[2], pin: m[3] };
  }

  /* ------------------------------------------------------------ 기구 위치(제어판 안 / 밖) */
  function deviceIndex(W) {
    var idx = {};
    var P = W.panel || {};
    Object.keys(P.devices || {}).forEach(function (tag) { idx[tag] = { where: 'panel', dev: P.devices[tag], tag: tag }; });
    ((W.piping || {}).boxes || []).forEach(function (b) {
      (b.devices || []).forEach(function (d) { idx[d.tag] = { where: 'piping', dev: d, box: b, tag: d.tag }; });
    });
    return idx;
  }
  function hasSides(entry) {
    if (!entry || entry.where !== 'panel') return false;
    var t = entry.dev.type;
    return t === 'tb-strip' || (t === 'tb' && entry.dev.sides !== false);
  }

  /* 기구 하나의 단자(판 좌표) — panel 기구만. piping 기구는 panel-render 가 따로 놓는다 */
  function terminalMap(W, PL) {
    var map = {}, idx = deviceIndex(W), cid = W.circuit || W.id;
    Object.keys(idx).forEach(function (tag) {
      var e = idx[tag];
      var terms = PL.terminals(e.where === 'panel' ? e.dev : dummyGeom(e.dev));
      terms.forEach(function (t) {
        var key = cid + '/' + tag + ':' + t.pin;
        var slot = map[key] = map[key] || { key: key, tag: tag, pin: t.pin, where: e.where, entry: e, sides: {} };
        if (t.side) slot.sides[t.side] = t; else slot.pos = t;
      });
    });
    return map;
  }
  function dummyGeom(d) { var o = {}; for (var k in d) o[k] = d[k]; o.x = 0; o.y = 0; o.w = 1; o.h = 1; return o; }

  /* ------------------------------------------------------------ 구간 → 선 목록 */
  function chainsOf(net) {
    var list = [];
    if (net.chain) list.push({ pts: net.chain, wire: net.wire });
    (net.chains || []).forEach(function (c) { list.push(Array.isArray(c) ? { pts: c, wire: net.wire } : { pts: c.pts, wire: c.wire || net.wire }); });
    return list;
  }
  function pointsOf(net) {
    var seen = {}, out = [];
    chainsOf(net).forEach(function (c) { c.pts.forEach(function (p) { if (!seen[p]) { seen[p] = 1; out.push(p); } }); });
    return out;
  }
  /* 선 하나 = { a, b, aSide, bSide, wire, outside(바깥 기구로 나가는 선인지) } */
  function expandNet(W, net, idx) {
    idx = idx || deviceIndex(W);
    var edges = [];
    function whereOf(key) { var r = parseRef(key); var e = r && idx[r.tag]; return e ? e.where : null; }
    function side(key, other) {
      var r = parseRef(key); var e = r && idx[r.tag];
      if (!hasSides(e)) return null;
      return whereOf(other) === 'piping' ? 'ext' : 'int';
    }
    chainsOf(net).forEach(function (c) {
      for (var i = 0; i + 1 < c.pts.length; i++) {
        var a = c.pts[i], b = c.pts[i + 1];
        edges.push({ net: net.id, a: a, b: b, aSide: side(a, b), bSide: side(b, a), wire: c.wire,
          outside: whereOf(a) === 'piping' || whereOf(b) === 'piping',
          jumper: whereOf(a) === 'piping' && whereOf(b) === 'piping' });   // 바깥 상자 안에서 건너 묶는 선
      }
    });
    return edges;
  }

  /* ------------------------------------------------------------ 단자대 그룹 → 칸 [{ pos, entry }]
   * entry 는 점 하나 또는 배열(한 칸에 묶는 점들). common=true 면 심화 배치.
   * 자리 정하기(terminalBlocks.layout, 작성자 답변 2026-09-27):
   *   'pipe'(기본) : 관이 제어함을 나가는 자리 바로 안쪽 칸에 그 그룹을 둔다(관 위치 = 칸 위치).
   *                  같은 관을 나눠 쓰는 그룹(J 박스)은 붙여서 한 덩어리로. 덩어리 사이는 gap(기본 1) 칸 이상 띄운다.
   *   'pack'       : 1번 칸부터 기구 그룹 차례로, 그룹 사이 gap 칸씩 띄운다.
   *   'block'      : (요청 0043, 작성자 확정 규칙) 10P 블록(blocks, 예 [10,10] → 1~10 ‖ 11~20) 단위로 배치한다.
   *                  ① 단위는 '관 덩어리': 첫 관(pipes[0])이 같은 이웃 그룹(J 박스에서 나눠 쓰는 관)은 빈칸 없이 붙인다.
   *                  ② 관 순서대로 덩어리를 블록에 채운다. 덩어리는 블록 경계를 넘지 않는다(안 들어가면 다음 블록).
   *                  ③ 블록 안에서는 양끝으로 벌린다: 덩어리가 둘 이상이면 첫 덩어리는 블록 왼쪽 끝, 마지막은 오른쪽 끝,
   *                     가운데 덩어리는 사이 빈칸을 고르게. 덩어리가 하나면 앞 블록은 왼쪽 끝, 뒤 블록은 오른쪽 끝(20번).
   *                     예: 위쪽 관 ab(J)·c·d → ab 1~, c 11~, d ~20 / a·b·cd(J) → a 1~, b ~10, cd ~20.
   *                  ④ 칸이 모자라 ②가 안 되면(009 TB5) 피할 수 없는 덩어리 하나만 경계를 넘기고 나머지는 ①~③대로(out._straddle).
   *                  gap 은 쓰지 않는다.
   *   그룹에 at 을 적으면 그 칸부터(수동). 계산이 안 되면(관·단자대 좌표 없음, 칸 부족) 'pack' 으로 둔다. */
  function stripLayout(W, sid, common) {
    var TB = W.terminalBlocks, gap = TB.gap == null ? 1 : TB.gap, mode = TB.layout || 'pipe';
    var gs = TB.groups.filter(function (g) { return g.strip === sid; });
    var len = function (g) { return (common && g.common ? g.common : g.basic).length; };
    var s = TB.strips[sid] || {}, n = (s.blocks || [20]).reduce(function (x, y) { return x + y; }, 0), out = {};
    function pack() { var st = 1; gs.forEach(function (g) { out[g.id] = g.at || st; st = (g.at || st) + len(g) + gap; }); return out; }
    if (mode === 'block' && !gs.some(function (g) { return g.at; })) {
      // 0078: 공통단자로 칸 수가 줄어도 관의 블록은 기본 배치와 같다.
      // 기본부터 경계를 넘을 수밖에 없으면 기존 '되는 데까지' 계산을 유지한다.
      var preferred = common ? blockLayout(gs, function (g) { return g.basic.length; }, s.blocks || [n]) : null;
      if (preferred && Object.keys(preferred._straddle).length) preferred = null;
      return blockLayout(gs, len, s.blocks || [n], preferred);
    }
    var dev = W.panel && W.panel.devices && W.panel.devices[sid], P = W.piping || {};
    if (mode !== 'pipe' || !dev || !P.pipes || gs.some(function (g) { return g.at; })) return pack();
    var pipes = {}; P.pipes.forEach(function (p) { pipes[p.id] = p; });
    var x0 = dev.x - W.panel.size[0] / 2, pitch = dev.w / (dev.n || n), hw = (P.box || {}).w / 2;
    var cl = [];                                         // 덩어리: 첫 관이 같은 이웃 그룹들
    gs.forEach(function (g) {
      var p = pipes[(g.pipes || [])[0]]; if (!p) return;
      var last = cl[cl.length - 1];
      if (last && last.pipe === p.id) { last.gs.push(g); last.total += gap + len(g); }
      else { var q = p.pts[0], ex = Math.abs(q[0] + hw) < 1 ? x0 : Math.abs(q[0] - hw) < 1 ? x0 + n * pitch : q[0]; cl.push({ pipe: p.id, gs: [g], total: len(g), ex: ex }); }
    });
    if (cl.reduce(function (k, c) { return k + c.gs.length; }, 0) !== gs.length) return pack();
    var mg = Math.max(gap, 1);
    cl.forEach(function (c) { c.start = Math.round((c.ex - x0) / pitch + 0.5 - (c.total - 1) / 2); });
    cl.forEach(function (c, i) { c.start = Math.max(c.start, 1, i ? cl[i - 1].start + cl[i - 1].total + mg : 1); });
    for (var i = cl.length - 1; i >= 0; i--) { var lim = i === cl.length - 1 ? n : cl[i + 1].start - 1 - mg; if (cl[i].start + cl[i].total - 1 > lim) cl[i].start = lim - cl[i].total + 1; }
    if (cl.some(function (c, i) { return c.start < 1 || (i && c.start <= cl[i - 1].start + cl[i - 1].total); })) return pack();
    cl.forEach(function (c) { var st = c.start; c.gs.forEach(function (g) { out[g.id] = st; st += len(g) + gap; }); });
    return out;
  }
  /* 'block' 배치(위 설명 ①~④). 반환 { 그룹 id: 첫 칸 }, 경계를 넘길 수밖에 없던 그룹은 out._straddle[id] = true */
  function blockLayout(gs, len, blocks, preferred) {
    var ends = blockEnds(blocks), starts = ends.map(function (e, k) { return e - blocks[k] + 1; }), out = {}, units = [];
    Object.defineProperty(out, '_straddle', { value: {}, enumerable: false });
    gs.forEach(function (g) {                              // ① 관 덩어리
      var u = units[units.length - 1], p = (g.pipes || [])[0];
      if (u && p && u.pipe === p) { u.gs.push(g); u.L += len(g); } else units.push({ pipe: p, gs: [g], L: len(g) });
    });
    function fitsFrom(i, k) {                              // units[i..] 가 k번 블록부터 경계 없이 들어가나(순서대로 채우기)
      var used = 0;
      for (; i < units.length; i++) {
        if (k >= blocks.length || units[i].L > blocks[k]) return false;
        if (used + units[i].L > blocks[k]) { k++; used = 0; i--; continue; }
        used += units[i].L;
      }
      return true;
    }
    // ② 블록에 나누기. per[k] = { units, inL(앞 블록에서 넘어온 칸 수), outL(다음 블록으로 넘기는 칸 수) }
    var per = blocks.map(function () { return { units: [], inL: 0, outL: 0 }; }), k = 0, used = 0;
    units.forEach(function (u, i) {
      if (preferred) { var target = ends.findIndex(function (e) { return preferred[u.gs[0].id] <= e; }); per[target].units.push(u); return; }
      while (k < blocks.length - 1 && used + u.L > blocks[k] && fitsFrom(i, k + 1)) { k++; used = per[k].inL; }
      if (used + u.L <= blocks[k] || k === blocks.length - 1) { per[k].units.push(u); used += u.L; return; }
      // ④ 칸이 모자람: 이 덩어리가 k 블록 끝에서 시작해 다음 블록으로 넘어간다
      var here = blocks[k] - used; u.straddle = true; u.gs.forEach(function (g) { out._straddle[g.id] = true; });
      per[k].outL = here; per[k].straddler = u; k++; per[k].inL = u.L - here; used = per[k].inL;
    });
    // ③ 블록 안에서 양끝으로 벌리기
    per.forEach(function (b, k) {
      var lo = starts[k] + b.inL, hi = ends[k] - b.outL, T = b.units.reduce(function (x, u) { return x + u.L; }, 0), slack = hi - lo + 1 - T, m = b.units.length;
      var pos = [];
      if (m === 1) pos = [k === 0 || (b.outL && !b.inL) ? lo : hi - b.units[0].L + 1];
      else if (m > 1) { var at = lo; b.units.forEach(function (u, j) { pos.push(at); at += u.L + (j < m - 1 ? Math.floor(slack / (m - 1)) + (j < slack % (m - 1) ? 1 : 0) : 0); }); }
      b.units.forEach(function (u, j) { var st = pos[j]; u.gs.forEach(function (g) { out[g.id] = st; st += len(g); }); });
      if (b.straddler) { var st = ends[k] - b.outL + 1; b.straddler.gs.forEach(function (g) { out[g.id] = st; st += len(g); }); }
    });
    return out;
  }
  /* 블록 끝 칸 번호: [10, 10] → [10, 20] */
  function blockEnds(blocks) { var e = [], t = 0; blocks.forEach(function (b) { t += b; e.push(t); }); return e; }
  function groupCells(W, g, common) {
    var list = common && g.common ? g.common : g.basic, start = stripLayout(W, g.strip, common)[g.id] || 1;
    return list.map(function (e, k) { return { pos: start + k, entry: e }; });
  }
  /* 결선 구간 안의 단자대 칸 별칭 '001/TB@PB0:N' → 그 점이 배정된 칸 '001/TB5:1'.
   * 칸 번호를 구간에 직접 적지 않으므로 단자대 자리를 바꿔도 구간 데이터는 그대로다. validate 가 먼저 부른다(한 번만 바꿈) */
  function resolveAliases(W) {
    if (W._resolved || !W.terminalBlocks) return W;
    var cid = W.circuit || W.id, cellOf = {};
    W.terminalBlocks.groups.forEach(function (g) {
      groupCells(W, g, false).forEach(function (c) { [].concat(c.entry).forEach(function (p) { cellOf[p] = cid + '/' + g.strip + ':' + c.pos; }); });
    });
    function fix(p) { var m = /^([^/]+)\/TB@(.+)$/.exec(p); return m && cellOf[m[1] + '/' + m[2]] ? cellOf[m[1] + '/' + m[2]] : p; }
    W.nets.forEach(function (n) {
      if (n.chain) n.chain = n.chain.map(fix);
      if (n.chains) n.chains = n.chains.map(function (c) { return Array.isArray(c) ? c.map(fix) : { pts: c.pts.map(fix), wire: c.wire }; });
    });
    Object.defineProperty(W, '_resolved', { value: true, enumerable: false });
    return W;
  }

  /* ------------------------------------------------------------ 배관도 순서 검토
   * 규칙(0028 작성자 답변 뒤 정리): 그룹의 첫 관(g.pipes[0])이 제어함 둘레에서 나가는 점으로 정한다.
   *   위 변 → TB5(place 'top'), 아래 변 → TB6(place 'bottom'), 옆 변 → 제어함 중심보다 위면 TB5, 아래면 TB6.
   *   한 띠 안에서는 나가는 점의 x 가 작은(왼쪽) 그룹부터. 옆 변은 왼쪽 변 = 가장 왼쪽, 오른쪽 변 = 가장 오른쪽.
   *   같은 관을 여럿이 나눠 쓰면(8각 박스 J 에서 갈라짐) 도착 상자의 x 가 작은 쪽부터.
   *   그룹 안에서는 상자 속 기구 순서(위 → 아래), 가로 단자대는 왼쪽부터, 세로 단자대는 위부터(요구사항의 L1 L2 L3 PE / U V W PE / E1 E2 E3 순서).
   * 반환: { expected: {strip: [그룹 id…]}, problems: [오류 문장], boxOrder: [] (0043부터 비움: 그룹 안 기구 순서는 자유) } */
  function pipeOrder(W) {
    var P = W.piping || {}, TB = W.terminalBlocks, out = { expected: {}, problems: [], boxOrder: [] };
    if (!TB || !P.box) return out;
    var pipes = {}, boxes = {}; (P.pipes || []).forEach(function (p) { pipes[p.id] = p; }); (P.boxes || []).forEach(function (b) { boxes[b.id] = b; });
    var hw = P.box.w / 2, hh = P.box.h / 2, keyOf = {};
    TB.groups.forEach(function (g) {
      var p = pipes[(g.pipes || [])[0]], b = boxes[g.box];
      if (!p || !b) { out.problems.push('단자대 그룹 ' + g.id + ': 관(pipes) 또는 상자(box)가 배관도에 없습니다.'); return; }
      var q = p.pts[0], side = Math.abs(q[1] + hh) < 1 ? 'top' : Math.abs(q[1] - hh) < 1 ? 'bottom' : Math.abs(q[0] + hw) < 1 ? 'left' : Math.abs(q[0] - hw) < 1 ? 'right' : null;
      if (!side) { out.problems.push('단자대 그룹 ' + g.id + ': 첫 관 ' + p.id + ' 이 제어함 둘레에서 시작하지 않습니다(관 pts 첫 점).'); return; }
      var place = side === 'top' || side === 'bottom' ? side : (q[1] < 0 ? 'top' : 'bottom');
      var strip = TB.strips[g.strip] || {};
      if (strip.place !== place) out.problems.push('단자대 그룹 ' + g.mark + ' ' + g.name + ': 관이 제어함 ' + ({ top: '위', bottom: '아래' })[place] + '쪽으로 나가는데 ' + g.strip + '(' + strip.place + ')에 배정했습니다.');
      var x = side === 'left' ? -1e6 + q[1] : side === 'right' ? 1e6 + q[1] : q[0];
      keyOf[g.id] = [x, b.x];
      // 그룹 안 기구 순서는 자유(요청 0043 규칙 3: PB0·PB1 / PB1·PB0 모두 정답)라 상자 속 순서와 비교하지 않는다.
      // 대신 한 기구의 단자는 붙어 있어야 한다(RL1·RL2 사이에 다른 기구 칸이 끼면 오류).
      var runs = []; [].concat.apply([], g.basic).forEach(function (pt) { var t = parseRef(pt).tag; if (runs[runs.length - 1] !== t) runs.push(t); });
      var split = runs.filter(function (t, i) { return runs.indexOf(t) !== i; });
      if (split.length) out.problems.push('단자대 그룹 ' + g.mark + ' ' + g.name + ': ' + split.filter(function (t, i, a) { return a.indexOf(t) === i; }).join('·') + ' 의 단자가 붙어 있지 않습니다(칸 순서 ' + runs.join('·') + '). 한 기구 단자는 붙여서 적어요.');
    });
    Object.keys(TB.strips).forEach(function (sid) {
      var gs = TB.groups.filter(function (g) { return g.strip === sid && keyOf[g.id]; });
      var sorted = gs.slice().sort(function (a, b) { var ka = keyOf[a.id], kb = keyOf[b.id]; return ka[0] - kb[0] || ka[1] - kb[1]; });
      out.expected[sid] = sorted.map(function (g) { return g.id; });
      if (sorted.map(function (g) { return g.id; }).join() !== gs.map(function (g) { return g.id; }).join())
        out.problems.push(sid + ' 그룹 순서가 배관도 순서와 다릅니다: 지금 ' + gs.map(function (g) { return g.mark; }).join('') + ', 배관도 순서 ' + sorted.map(function (g) { return g.mark; }).join('') + ' (관이 제어함에서 나가는 자리 왼쪽 → 오른쪽).');
    });
    return out;
  }

  /* ------------------------------------------------------------ 점 → 구간 역인덱스, 구역, 퀴즈 (요청 0030)
   * 새 데이터는 없다. 모두 기존 nets(chain/chains·group·wire)와 terminalBlocks 에서 계산한다.
   *   pointNets(W)      : { '001/EOCR:1': 'L1a', … }  자유 탐색에서 누른 점 → 구간
   *   netZones(W, net)  : ['main'] / ['main','aux'] …  net.group 이 첫째, 체인의 선 종류(kind)가 다르면 그 구역에도 넣는다
   *                       (예: 승강기 H 구간은 group 'main' 이지만 제어 전원 보조선이 있어 제어회로 구역에서도 보인다).
   *                       단 group 'pe'(보호도체)는 보호도체 구역에만 둔다.
   *   tbQuizPairs(W)    : 단자대 퀴즈 "한 칸에 묶어도 되나" 문제. 같은 그룹(같은 상자·관) 안의 두 바깥 점.
   *                       yes = 같은 구간(묶어도 됨), no = 그룹마다 헷갈리기 쉬운 다른 구간 한 쌍(같은 핀 이름 우선) */
  function pointNets(W) {
    resolveAliases(W);
    var out = {};
    W.nets.forEach(function (n) { pointsOf(n).forEach(function (p) { out[p] = n.id; }); });
    return out;
  }
  function netZones(W, net) {
    var z = [net.group], types = W.wireTypes || {};
    if (net.group === 'pe') return z;                  // 보호도체 구간은 보호도체 구역에만(FLS E3 접지 보조선이 있어도)
    chainsOf(net).forEach(function (c) { var k = (types[c.wire] || {}).kind; if (k && z.indexOf(k) < 0) z.push(k); });
    return z;
  }
  function tbQuizPairs(W) {
    var TB = W.terminalBlocks, out = { yes: [], no: [] };
    if (!TB) return out;
    var netOf = pointNets(W);
    function pinName(p) { return String(parseRef(p).pin).replace(/#.*$/, ''); }
    TB.groups.forEach(function (g) {
      var pts = [].concat.apply([], g.basic.map(function (c) { return [].concat(c); })), negs = [];
      for (var i = 0; i < pts.length; i++) for (var j = i + 1; j < pts.length; j++) {
        var a = pts[i], b = pts[j], na = netOf[a], nb = netOf[b];
        if (!na || !nb) continue;
        var pr = { a: a, b: b, group: g.id, netA: na, netB: nb, same: na === nb };
        if (pr.same) out.yes.push(pr);
        else { pr.samePin = pinName(a) === pinName(b); pr.near = j - i === 1 ? j : 0; negs.push(pr); }
      }
      negs.sort(function (x, y) { return (y.samePin - x.samePin) || (y.near - x.near); });
      if (negs.length) out.no.push(negs[0]);
    });
    return out;
  }

  /* ------------------------------------------------------------ 회로도 쪽: 칸 ↔ 점 ID */
  function circuitIndex(C, PV) {
    var items = PV.buildItems(C), key = C.answerKey, dev = C.devices, out = [];
    items.forEach(function (it) {
      var exp = it.cat === 'main' ? (key['main-' + it.tag] || [])[it.pole] : key[it.id];
      if (!exp) return;
      it.slots.forEach(function (s, i) {
        var pin = exp[i]; if (pin == null) return;
        var type = (dev[it.tag] || {}).type;
        if (type === 'eocr-12p' && pin === '11') pin = '10';
        if (it.cat === 'ss' && pin === 'SS') pin = 'SS#' + it.id;
        out.push({ ref: C.id + '/' + it.tag + ':' + pin, tag: it.tag, pin: pin, item: it, idx: i, slot: s, net: s.net || null, anchor: anchorOf(it, i, s, C.layout) });
      });
    });
    return out;
  }
  function anchorOf(it, i, s, LAY) {
    if (it.cat === 'main') return [s.x, s.y];
    if (it.cat === 'flsE') return null;
    if (it.horiz) return [i ? it.x2 : it.x1, it.y];
    if (it.cat === 'coil' || it.cat === 'lamp') { var r = it.shape === 'rect' ? 22 : 24; return [it.x, LAY.coilY + (i ? r : -r)]; }
    if (it.rows) return [it.x, i ? it.rows[1] : it.rows[0]];
    return [s.x, s.y];
  }

  /* ------------------------------------------------------------ 회로도 선 덩어리(자동 강조용) */
  var TOL = 5;
  function onSeg(p, s) {
    var dx = s.x2 - s.x1, dy = s.y2 - s.y1, L2 = dx * dx + dy * dy;
    var t = L2 ? ((p[0] - s.x1) * dx + (p[1] - s.y1) * dy) / L2 : 0;
    t = Math.max(0, Math.min(1, t));
    var qx = s.x1 + t * dx - p[0], qy = s.y1 + t * dy - p[1];
    return qx * qx + qy * qy <= TOL * TOL;
  }
  function circuitTopology(C, PV, nets, omit) {
    var LAY = C.layout, segs = [], dots = [];
    (LAY.drawing || []).forEach(function (p) {
      if (p.t === 'line' && !p.dash) segs.push({ x1: p.x1, y1: p.y1, x2: p.x2, y2: p.y2 });
      else if (p.t === 'wire') for (var i = 0; i + 1 < p.pts.length; i++) segs.push({ x1: p.pts[i][0], y1: p.pts[i][1], x2: p.pts[i + 1][0], y2: p.pts[i + 1][1] });
      else if (p.t === 'dot') dots.push([p.x, p.y]);
    });
    // 주회로 기구 몸통 끊기: 극마다 위·아래 칸 사이(열린 구간)를 세로선에서 뺀다
    var cuts = [];
    (LAY.main || []).forEach(function (m) { m.xs.forEach(function (x) { cuts.push({ x: x, y0: Math.min(m.slotY[0], m.slotY[1]), y1: Math.max(m.slotY[0], m.slotY[1]) }); }); });
    var pieces = [];
    segs.forEach(function (s) {
      var list = [s];
      if (s.x1 === s.x2) cuts.forEach(function (c) {
        if (Math.abs(c.x - s.x1) > 0.5) return;
        var next = [];
        list.forEach(function (q) {
          var lo = Math.min(q.y1, q.y2), hi = Math.max(q.y1, q.y2);
          if (hi <= c.y0 || lo >= c.y1) { next.push(q); return; }
          if (lo < c.y0) next.push({ x1: q.x1, y1: lo, x2: q.x1, y2: c.y0 });
          if (hi > c.y1) next.push({ x1: q.x1, y1: c.y1, x2: q.x1, y2: hi });
        });
        list = next;
      });
      list.forEach(function (q) { pieces.push(q); });
    });
    // 이어 붙이기: 끝점이 다른 선 위에 있거나, 접속점(dot) 위를 함께 지나면 한 덩어리
    var par = pieces.map(function (_, i) { return i; });
    function find(i) { while (par[i] !== i) { par[i] = par[par[i]]; i = par[i]; } return i; }
    function uni(a, b) { a = find(a); b = find(b); if (a !== b) par[a] = b; }
    for (var i = 0; i < pieces.length; i++) for (var j = i + 1; j < pieces.length; j++) {
      var a = pieces[i], b = pieces[j];
      if (onSeg([a.x1, a.y1], b) || onSeg([a.x2, a.y2], b) || onSeg([b.x1, b.y1], a) || onSeg([b.x2, b.y2], a)) uni(i, j);
    }
    dots.forEach(function (d) { var hit = []; pieces.forEach(function (s, k) { if (onSeg(d, s)) hit.push(k); }); for (var k = 1; k < hit.length; k++) uni(hit[0], hit[k]); });
    pieces.forEach(function (s, k) { s.comp = find(k); });
    // 덩어리 이름: 닿은 점(anchor)의 구간 id
    var refNet = {}; nets.forEach(function (n) { pointsOf(n).forEach(function (p) { refNet[p] = n.id; }); });
    var compNets = {};
    function mark(pt, netId, why) {
      pieces.forEach(function (s) { if (onSeg(pt, s)) { (compNets[s.comp] = compNets[s.comp] || {})[netId] = (compNets[s.comp][netId] || []).concat([why]); } });
    }
    var cidx = circuitIndex(C, PV);
    cidx.forEach(function (c) {
      if (!c.anchor || (omit && omit[c.tag])) return;
      var nid = refNet[c.ref]; if (nid) mark(c.anchor, nid, c.ref);
    });
    return { pieces: pieces, compNets: compNets, cidx: cidx, mark: mark };
  }
  /* 구간 id → 강조할 선분 목록. 두 구간이 닿은 덩어리는 칠하지 않는다 */
  function netSegments(topo, circuitPoints, nets) {
    circuitPoints = circuitPoints || {};
    var refNet = {}; nets.forEach(function (n) { pointsOf(n).forEach(function (p) { refNet[p] = n.id; }); });
    Object.keys(circuitPoints).forEach(function (ref) { if (refNet[ref]) topo.mark(circuitPoints[ref], refNet[ref], ref); });
    var out = {}, conflicts = [];
    Object.keys(topo.compNets).forEach(function (comp) {
      var ids = Object.keys(topo.compNets[comp]);
      if (ids.length > 1) { conflicts.push({ comp: comp, nets: topo.compNets[comp] }); return; }
      topo.pieces.forEach(function (s) { if (String(s.comp) === comp) (out[ids[0]] = out[ids[0]] || []).push(s); });
    });
    return { byNet: out, conflicts: conflicts };
  }

  /* ------------------------------------------------------------ 사람이 읽는 이름 */
  function describe(W, C, key, libs, idx) {
    idx = idx || deviceIndex(W);
    var r = parseRef(key); if (!r) return key;
    var e = idx[r.tag], PL = libs.PL, dl = libs.Lib;
    var ctype = C && C.devices && C.devices[r.tag] ? C.devices[r.tag].type : null;
    if (!e) return r.tag + ' ' + r.pin;
    if (e.dev.type === 'tb-strip') return r.tag + ' ' + r.pin + '번';
    if (e.dev.type === 'tb') return (e.dev.label || r.tag) + ' ' + r.pin;
    var name = PL.pinName(e.dev, r.pin, dl, ctype);
    if ((PL.types[e.dev.type] || {}).nameHasTag) return name;
    var tagName = e.dev.label || (r.tag === 'F' ? '퓨즈' : r.tag);
    return tagName + ' ' + name;
  }

  /* ------------------------------------------------------------ 검사 */
  var MAIN_ROLES = { 'main-line': 1, 'main-load': 1 };
  function validate(W, C, libs) {
    var E = [], Wn = [], info = {};
    function err(m) { E.push(m); } function warn(m) { Wn.push(m); }
    var Lib = libs.Lib, PV = libs.PV, PL = libs.PL;
    if (!W || !W.nets) { err('결선 데이터(nets)가 없습니다.'); return { errors: E, warnings: Wn }; }
    if (!C) { err('회로 데이터 ' + W.circuit + ' 를 찾지 못했습니다. circuit-' + W.circuit + '.js 를 먼저 불러오세요.'); return { errors: E, warnings: Wn }; }
    resolveAliases(W);
    var idx = deviceIndex(W), tmap = terminalMap(W, PL), omit = W.omit || {}, cid = W.circuit || W.id;
    var types = W.wireTypes || {};

    // 1. 점 ID
    var netOf = {}, ids = {};
    W.nets.forEach(function (n) {
      if (!n.id) err('id 가 없는 구간이 있습니다.');
      if (ids[n.id]) err('구간 id "' + n.id + '" 가 두 번 나옵니다.'); ids[n.id] = 1;
      if (!chainsOf(n).length) err('구간 ' + n.id + ': chain/chains 가 없습니다.');
      chainsOf(n).forEach(function (c) {
        if (!c.wire || !types[c.wire]) err('구간 ' + n.id + ': 선 종류 "' + c.wire + '" 가 wireTypes 에 없습니다.');
        if (c.pts.length < 2) err('구간 ' + n.id + ': 점이 하나뿐인 체인이 있습니다.');
      });
      pointsOf(n).forEach(function (p) {
        var r = parseRef(p);
        if (!r || r.circuit !== cid) { err('구간 ' + n.id + ': 점 "' + p + '" 의 형식이 틀렸습니다(' + cid + '/태그:핀).'); return; }
        if (!idx[r.tag]) err('구간 ' + n.id + ': "' + r.tag + '" 기구가 제어판·배관도 데이터에 없습니다.');
        else if (!tmap[p]) err('구간 ' + n.id + ': "' + p + '" — ' + r.tag + ' 에는 "' + r.pin + '" 단자가 없습니다.');
        if (omit[r.tag]) err('구간 ' + n.id + ': 생략한 기구(' + r.tag + ')의 점이 들어 있습니다.');
        if (netOf[p] && netOf[p] !== n.id) err('점 ' + p + ' 이 두 구간(' + netOf[p] + ', ' + n.id + ')에 있습니다. 실제로 결선하면 합선입니다.');
        netOf[p] = n.id;
      });
    });

    // 2~3. 회로 데이터와 대조
    var cidx = circuitIndex(C, PV), circNetToWire = {}, seenRef = {};
    cidx.forEach(function (c) {
      if (omit[c.tag]) return;
      seenRef[c.ref] = 1;
      var nid = netOf[c.ref];
      if (!nid) { err('회로도 ' + c.item.id + ' 칸' + (c.idx + 1) + ' 의 핀 ' + c.ref + ' 가 어느 구간에도 없습니다(결선 빠짐).'); return; }
      if (c.net) {
        (circNetToWire[c.net] = circNetToWire[c.net] || {})[nid] = 1;
        var n = W.nets.filter(function (x) { return x.id === nid; })[0];
        if (n.circuit && n.circuit !== c.net) err('구간 ' + nid + ': circuit 은 "' + n.circuit + '" 인데 회로도 ' + c.item.id + ' 칸은 net "' + c.net + '" 입니다.');
        (n._circ = n._circ || {})[c.net] = 1;
      }
    });
    Object.keys(circNetToWire).forEach(function (cn) {
      var ws = Object.keys(circNetToWire[cn]);
      if (ws.length > 1) err('회로도 net "' + cn + '" 가 두 구간(' + ws.join(', ') + ')으로 나뉘었습니다. 한 구간으로 합치세요.');
    });
    W.nets.forEach(function (n) {
      var cs = Object.keys(n._circ || {}); delete n._circ;
      if (cs.length > 1) err('구간 ' + n.id + ' 에 회로도 net 이 여러 개(' + cs.join(', ') + ') 섞였습니다. 합선입니다.');
      pointsOf(n).forEach(function (p) {
        var r = parseRef(p); if (!r || !C.devices[r.tag]) return;
        if (!seenRef[p]) warn('구간 ' + n.id + ': ' + p + ' 는 회로도 칸에 없는 핀입니다(회로도와 다시 확인).');
      });
    });
    Object.keys(C.devices).forEach(function (tag) { if (!omit[tag] && !idx[tag]) err('회로 기구 ' + tag + ' 가 제어판·배관도 데이터에 없습니다.'); });

    // 4. 선이 구간의 모든 점을 잇는가
    var allEdges = [];
    W.nets.forEach(function (n) {
      var pts = pointsOf(n), par = {};
      pts.forEach(function (p) { par[p] = p; });
      function f(x) { while (par[x] !== x) x = par[x] = par[par[x]]; return x; }
      var edges = expandNet(W, n, idx);
      edges.forEach(function (e) { par[f(e.a)] = f(e.b); allEdges.push(e); if (e.a === e.b) err('구간 ' + n.id + ': 같은 점을 잇는 선(' + e.a + ')이 있습니다.'); });
      var roots = {}; pts.forEach(function (p) { roots[f(p)] = 1; });
      if (Object.keys(roots).length > 1) err('구간 ' + n.id + ': 선이 끊겨 있습니다(체인끼리 공유하는 점이 없음).');
    });
    info.wires = allEdges.length;

    // 4-2. 회로도 선 덩어리 ↔ 구간
    var topo = circuitTopology(C, PV, W.nets, omit);
    var ns = netSegments(topo, W.circuitPoints, W.nets);
    ns.conflicts.forEach(function (c) {
      err('회로도 선 한 덩어리에 두 구간이 닿았습니다: ' + Object.keys(c.nets).map(function (k) { return k + '(' + c.nets[k].join(', ') + ')'; }).join(' / '));
    });
    info.highlighted = Object.keys(ns.byNet).length;
    W.nets.forEach(function (n) { if (!ns.byNet[n.id]) warn('구간 ' + n.id + ': 회로도에서 칠할 선을 찾지 못했습니다(칸만 강조됩니다).'); });
    Object.keys(W.circuitPoints || {}).forEach(function (k) { if (!netOf[k]) warn('circuitPoints ' + k + ' 가 어느 구간에도 없습니다.'); });
    // 4-3. 자유 탐색(요청 0030): 모든 구간을 회로도에서 누를 수 있는가(핀번호 칸 · 칠한 선 · circuitPoints 중 하나)
    var clickable = {};
    cidx.forEach(function (c) { if (!omit[c.tag] && netOf[c.ref]) clickable[netOf[c.ref]] = 1; });
    Object.keys(W.circuitPoints || {}).forEach(function (k) { if (netOf[k]) clickable[netOf[k]] = 1; });
    Object.keys(ns.byNet).forEach(function (k) { clickable[k] = 1; });
    W.nets.forEach(function (n) { if (!clickable[n.id]) warn('구간 ' + n.id + ': 회로도에서 누를 곳(칸·선·circuitPoints)이 없어 자유 탐색에서 회로도로는 찾을 수 없습니다.'); });
    info.clickable = Object.keys(clickable).length;

    // 5. 한 나사에 3가닥 금지
    var cnt = {};
    allEdges.forEach(function (e) {
      [[e.a, e.aSide], [e.b, e.bSide]].forEach(function (x) { var k = x[0] + (x[1] ? '@' + x[1] : ''); cnt[k] = (cnt[k] || 0) + 1; });
    });
    Object.keys(cnt).forEach(function (k) { if (cnt[k] > 2) err('한 단자에 선 ' + cnt[k] + '가닥: ' + k.replace('@ext', ' (바깥쪽 나사)').replace('@int', ' (안쪽 나사)') + ' — 3가닥 이상 금지.'); });
    info.maxPerScrew = Object.keys(cnt).reduce(function (m, k) { return Math.max(m, cnt[k]); }, 0);

    // 6. 제어판 밖 기구는 단자대를 거친다 + 단자대 배치
    //    바깥 기구끼리 바로 잇는 선은 같은 상자 안에서 건너 묶는 선(예: 셀렉터 N 두 개 → SS)만 된다
    var TBA = W.terminalBlocks;
    allEdges.forEach(function (e) {
      if (!e.outside) return;
      var ra = parseRef(e.a), rb = parseRef(e.b), ea = idx[ra.tag], eb = idx[rb.tag];
      if (ea.where === 'piping' && eb.where === 'piping') {
        if (ea.box !== eb.box) err('구간 ' + e.net + ': 제어판 밖 기구끼리 바로 잇는 선(' + e.a + ' – ' + e.b + ')이 있습니다. 서로 다른 상자라 단자대를 거쳐야 합니다.');
        return;
      }
      var inside = ea.where === 'panel' ? e.a : e.b, ie = idx[parseRef(inside).tag];
      if (ie.dev.type !== 'tb-strip') err('구간 ' + e.net + ': 제어판 밖으로 나가는 선(' + e.a + ' – ' + e.b + ')이 제어판 단자대를 거치지 않습니다.');
    });
    if (TBA) {
      var alloc = {}, cellOf = {};
      (TBA.groups || []).forEach(function (g) {
        var s = (TBA.strips || {})[g.strip];
        if (!s) { err('단자대 그룹 ' + g.id + ': strip "' + g.strip + '" 이 없습니다.'); return; }
        var n = s.blocks.reduce(function (a, b) { return a + b; }, 0);
        groupCells(W, g, false).forEach(function (c) {
          var key = cid + '/' + g.strip + ':' + c.pos, pts = [].concat(c.entry);
          if (c.pos < 1 || c.pos > n) err('단자대 그룹 ' + g.id + ': ' + g.strip + ' ' + c.pos + '번은 없는 칸입니다(1~' + n + ').');
          if (alloc[key]) err('단자대 ' + key + ' 에 두 그룹의 점을 배정했습니다.');
          alloc[key] = pts;
          pts.forEach(function (p) {
            cellOf[p] = key;
            var e = idx[parseRef(p).tag];
            if (!e || e.where !== 'piping') err('단자대 그룹 ' + g.id + ': ' + p + ' 는 제어판 밖 기구가 아닙니다.');
          });
        });
        if (groupCells(W, g, true).slice(-1)[0].pos > n) err('단자대 그룹 ' + g.id + ': 공통 배치가 ' + g.strip + ' 칸 수를 넘습니다.');
        if ((TBA.layout || 'pipe') === 'block') {             // 요청 0043: 한 그룹은 10P 블록 경계를 넘지 않는다
          var ends = blockEnds(s.blocks), big = Math.max.apply(null, s.blocks);
          if (g.basic.length > big) err('단자대 그룹 ' + g.mark + ' ' + g.name + ': ' + g.basic.length + '칸이라 ' + big + 'P 블록 하나에 들어가지 않습니다.');
          [false, true].forEach(function (cm) {
            var cs = groupCells(W, g, cm), a = cs[0].pos, z = cs[cs.length - 1].pos, unavoid = (stripLayout(W, g.strip, cm)._straddle || {})[g.id];
            ends.forEach(function (e) {
              if (!(a <= e && z > e && z <= n)) return;
              if (unavoid) (info.tbStraddle = info.tbStraddle || []).push(g.strip + ' ' + g.mark + g.name + (cm ? '(공통)' : '') + ' ' + a + '~' + z);   // 칸이 모자라 피할 수 없음(규칙 ④)
              else err('단자대 그룹 ' + g.mark + ' ' + g.name + (cm ? '(공통 배치)' : '') + ': ' + g.strip + ' ' + a + '~' + z + '번이 ' + e + '‖' + (e + 1) + ' 블록 경계를 넘습니다.');
            });
          });
        }
        [g.basic, g.common || []].forEach(function (list) {
          list.forEach(function (c) {
            if (!Array.isArray(c)) return;
            var ns2 = c.map(function (p) { return netOf[p]; });
            if (ns2.some(function (x) { return x !== ns2[0]; })) err('단자대 그룹 ' + g.id + ': ' + c.join(' + ') + ' 는 같은 구간이 아니라 한 칸에 묶을 수 없습니다.');
          });
        });
        var flat = function (l) { return [].concat.apply([], l.map(function (c) { return [].concat(c); })).sort().join(); };
        if (g.common && flat(g.common) !== flat(g.basic)) err('단자대 그룹 ' + g.id + ': common 과 basic 의 점이 서로 다릅니다.');
      });
      // 배관도 순서: 그룹이 쓰는 첫 관이 제어함에서 나가는 자리로 순서를 정한다(pipeOrder 참고)
      var po = pipeOrder(W);
      po.problems.forEach(function (m) { err(m); });
      po.boxOrder.forEach(function (m) { warn(m); });
      info.pipeOrder = po.expected;
      var qp = tbQuizPairs(W);                              // 단자대 퀴즈(요청 0030): 그룹 순서 정답 = po.expected, 묶기 문제 수
      info.quiz = { order: po.expected, yes: qp.yes.length, no: qp.no.length };
      // 결선 구간과 배치가 맞는지: 단자대 칸 ↔ 바깥 점 선은 배치대로, 칸마다 바깥으로 나가는 선이 꼭 하나
      var outCount = {};
      allEdges.forEach(function (e) {
        if (!e.outside || e.jumper) return;
        var tb = idx[parseRef(e.a).tag].where === 'panel' ? e.a : e.b, out = tb === e.a ? e.b : e.a;
        outCount[tb] = (outCount[tb] || 0) + 1;
        if ((alloc[tb] || []).indexOf(out) < 0) err('구간 ' + e.net + ': ' + out + ' 는 단자대 배치상 ' + (cellOf[out] || '(배치 없음)') + ' 인데 선은 ' + tb + ' 로 갑니다.');
      });
      Object.keys(alloc).forEach(function (k) {
        if (outCount[k] !== 1) err('단자대 ' + k + ' (' + alloc[k].join(' + ') + ') 에서 바깥으로 나가는 선이 ' + (outCount[k] || 0) + '가닥입니다(1가닥이어야 함).');
      });
      info.tb = alloc;
    }

    // 7. 선 종류: 두 끝이 모두 주회로 단자면 주회로선, 한 끝이라도 보조 단자면 보조선, PE 단자는 보호도체선
    function endKind(p) {
      var r = parseRef(p), e = idx[r.tag];
      if (!e) return 'any';
      if (e.dev.type === 'tb-strip') return 'any';
      if (e.dev.type === 'tb') return r.pin === 'PE' ? 'pe' : /^E\d$/.test(r.pin) ? 'aux' : 'main';
      if (r.tag === 'MCCB') return 'main';
      if (e.dev.type === 'fuse-2p') return (r.pin === '1' || r.pin === '2') ? 'main' : 'aux';
      var ct = C.devices[r.tag] && C.devices[r.tag].type, pi = ct && Lib.types[ct] && Lib.types[ct].pins[r.pin];
      if (pi && MAIN_ROLES[pi.role]) return 'main';
      return 'aux';
    }
    allEdges.forEach(function (e) {
      var kind = (types[e.wire] || {}).kind, ka = endKind(e.a), kb = endKind(e.b), want;
      if (ka === 'pe' || kb === 'pe') want = 'pe';
      else if (ka === 'aux' || kb === 'aux') want = 'aux';
      else if (ka === 'main' || kb === 'main') want = 'main';
      if (want && kind !== want) err('구간 ' + e.net + ': ' + e.a + ' – ' + e.b + ' 는 ' + ({ main: '주회로', aux: '보조회로', pe: '보호도체' })[want] + ' 선이어야 하는데 ' + e.wire + ' 입니다.');
    });
    W.nets.forEach(function (n) {
      var mains = {}; expandNet(W, n, idx).forEach(function (e) { if ((types[e.wire] || {}).kind === 'main') mains[e.wire] = 1; });
      if (Object.keys(mains).length > 1) err('구간 ' + n.id + ': 주회로 선 종류가 섞였습니다(' + Object.keys(mains).join(', ') + ').');
    });

    info.nets = W.nets.length;
    info.points = Object.keys(netOf).length;
    return { errors: E, warnings: Wn, info: info, topo: topo, segs: ns.byNet };
  }

  var api = {
    parseRef: parseRef, deviceIndex: deviceIndex, hasSides: hasSides, terminalMap: terminalMap,
    chainsOf: chainsOf, pointsOf: pointsOf, expandNet: expandNet, groupCells: groupCells, stripLayout: stripLayout, blockEnds: blockEnds, resolveAliases: resolveAliases, pipeOrder: pipeOrder,
    circuitIndex: circuitIndex, circuitTopology: circuitTopology, netSegments: netSegments,
    describe: describe, validate: validate,
    pointNets: pointNets, netZones: netZones, tbQuizPairs: tbQuizPairs
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WIRE_MODEL = api;
})(typeof window === 'undefined' ? globalThis : window);
