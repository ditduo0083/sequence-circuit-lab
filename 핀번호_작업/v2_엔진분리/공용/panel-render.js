/*
 * 결선하기 — 제어판 배치도·배관도 그리기 (2026-09-26, 요청 0028)
 * ------------------------------------------------------------------
 * 원본 도면 그림을 쓰지 않는다. 결선 데이터(wire-NNN.js)의 좌표(mm)만 읽어 SVG 로 새로 그린다.
 * 읽는 것: panel-library.js(단자 배치), wire-validate.js(점 ID 풀기), diagram-render.js(글자 도우미)
 *
 *   var PR = window.PANEL_RENDER;
 *   PR.drawPanel(W, { edges, hl, labels })   → 제어판 배치도 SVG 문자열
 *   PR.drawPiping(W, { hlGroups, hlPipes, hlPoints, strips, common, cellHl }) → 배관도(+ 위·아래 단자대 띠) SVG 문자열
 *   edges: [{ a, aSide, b, bSide, wire, state: 'active'|'done', no }]  (wire-validate.expandNet 결과에 state 를 붙인 것)
 *   hl   : { '001/EOCR:1': 1, '001/TB5:11@int': 1, … }  강조할 단자(단자대는 '@ext'·'@int')
 *   누르기(요청 0030 자유 탐색): 단자는 모두 <g class="pr-term" data-key="점 ID(@ext/@int)">, 단자대 띠 칸은 <g class="pr-cell" data-cell="TB5:7"> 로 감싼다.
 *   페이지 엔진이 이 속성으로 누른 점을 찾는다(배치도·배관도 모두).
 *   요청 0062(직접 연결해 보기): edges 에 id 를 붙이면 그 선을 <g class="pr-wire" data-wire="id"> 로 감싼다(누르면 지우기). mark: 'bad' 면 빨간 테두리(단락), 'warn' 이면 주황 테두리(주의).
 *   id 가 없으면 그림은 전과 같다. route 는 선 경로 계산(학생 선 미리 보기용).
 */
(function (root) {
  'use strict';
  var PL = root.PANEL_LIBRARY, WM = root.WIRE_MODEL, DR = root.DIAGRAM_RENDER;
  var INK = '#1f2933', MUTED = '#9aa5b1', HL = '#1d4ed8', HL_SOFT = '#dbe6ff';
  var FONT = DR ? DR.FONT : "'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif";
  function tx(x, y, s, size, extra) { return '<text x="' + r1(x) + '" y="' + r1(y) + '" font-size="' + (size || 12) + '" font-family="' + FONT + '"' + (/\sfill=/.test(extra || '') ? '' : ' fill="' + INK + '"') + (extra || '') + '>' + s + '</text>'; }
  function r1(v) { return Math.round(v * 10) / 10; }
  function copyObj(o) { var c = {}; for (var k in o) c[k] = o[k]; return c; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ------------------------------------------------------------ 제어판 */
  var S = 2.2, M = 24;                       // 1 mm = 2.2 px, 둘레 여백
  function panelTerminals(W, opts) {
    var cid = W.circuit || W.id, out = {};
    Object.keys(W.panel.devices).forEach(function (tag) {
      var d = W.panel.devices[tag];
      PL.terminals(d, opts).forEach(function (t) {
        var key = cid + '/' + tag + ':' + t.pin + (t.side ? '@' + t.side : '');
        out[key] = { x: M + t.x * S, y: M + t.y * S, dir: t.dir, pin: t.pin, tag: tag, side: t.side, dev: d };
      });
    });
    return out;
  }
  function termKey(p, side) { return p + (side ? '@' + side : ''); }

  function drawContact(tag, d, terms, hl) {
    var x = M + d.x * S, y = M + d.y * S, w = d.w * S, h = d.h * S, o = [];
    o.push('<g class="pr-dev" data-tag="' + esc(tag) + '"><rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" rx="3" fill="#fff" stroke="' + INK + '" stroke-width="1.3"/>');
    o.push('<circle cx="' + r1(x + w * .31) + '" cy="' + r1(y + h * .16) + '" r="' + r1(h * .09) + '" fill="' + (d.type === 'ss' ? '#555' : d.kind === 'b' ? '#c83c3c' : '#24875d') + '" stroke="' + INK + '"/>');
    if (d.type === 'ss') o.push('<path d="M' + r1(x + w * .31 - h * .05) + ',' + r1(y + h * .12) + ' l' + r1(h * .1) + ',' + r1(h * .08) + '" stroke="#fff" stroke-width="2"/>');
    o.push(tx(x + w * .63, y + h * .2, esc(tag + (d.type === 'ss' ? ' · 옆면' : '')), Math.min(11, w * .19), ' text-anchor="middle"'));
    PL.contactRows(d).forEach(function (r, j) {
      var ry = y + h * (j ? .81 : .47);
      var rh = Math.min(26, h * .3);
      o.push('<rect x="' + r1(x + w * .06) + '" y="' + r1(ry - rh / 2) + '" width="' + r1(w * .88) + '" height="' + r1(rh) + '" rx="2" fill="#f6f7f8" stroke="#a8b0b8" stroke-width="0.6"/>' + tx(x + w / 2, ry + 3, r.name, Math.min(10, w * .17), ' text-anchor="middle"'));
    });
    Object.keys(terms).forEach(function (k) {
      var t = terms[k]; if (t.tag !== tag) return;
      var on = hl[k], radius = on ? 10 : 8;
      o.push('<g class="pr-term" data-key="' + esc(k) + '"><title>' + esc(tag + ' ' + PL.contactName(d, t.pin)) + '</title><circle cx="' + r1(t.x) + '" cy="' + r1(t.y) + '" r="' + radius + '" fill="' + (on ? HL : '#fff') + '" stroke="' + (on ? HL : INK) + '" stroke-width="' + (on ? 2 : 1.2) + '"/></g>');
    });
    o.push('</g>'); return o.join('');
  }
  function drawDevice(tag, d, terms, hl, cid, opts) {
    if (opts && opts.physicalContacts && (d.type === 'pb' || d.type === 'ss')) return drawContact(tag, d, terms, hl);
    var o = [], x = M + d.x * S, y = M + d.y * S, w = d.w * S, h = d.h * S;
    var isTB = d.type === 'tb-strip' || d.type === 'tb';
    o.push('<g class="pr-dev" data-tag="' + tag + '">');
    o.push('<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" rx="' + (isTB ? 2 : 6) + '" fill="' + (isTB ? '#f6f7f9' : '#fff') + '" stroke="' + INK + '" stroke-width="1.3"/>');
    if (d.type === 'tb-strip') {
      var n = d.n || 20, cw = w / n, acc = 0;
      for (var i = 1; i < n; i++) o.push('<line x1="' + r1(x + cw * i) + '" y1="' + r1(y) + '" x2="' + r1(x + cw * i) + '" y2="' + r1(y + h) + '" stroke="#c5ced6" stroke-width="1"/>');
      (d.blocks || []).forEach(function (b, k) { acc += b; if (k < d.blocks.length - 1) o.push('<line x1="' + r1(x + cw * acc) + '" y1="' + r1(y - 3) + '" x2="' + r1(x + cw * acc) + '" y2="' + r1(y + h + 3) + '" stroke="' + INK + '" stroke-width="2"/>'); });
      for (var j = 1; j <= n; j++) o.push(tx(x + cw * (j - 0.5), y + h / 2 + 4, j, 10, ' text-anchor="middle" fill="#52606d"'));
      o.push(tx(x - 8, y + h / 2 + 5, d.label || tag, 14, ' text-anchor="end" font-weight="700"'));
      o.push(tx(x + w + 8, y + (d.place === 'bottom' ? h - 4 : 12), '바깥쪽 ' + (d.place === 'bottom' ? '▼' : '▲'), 10, ' fill="#52606d"'));
    } else if (d.type === 'tb') {
      var pins = d.pins || [], cw2 = w / pins.length;
      for (var q = 1; q < pins.length; q++) o.push('<line x1="' + r1(x + cw2 * q) + '" y1="' + r1(y) + '" x2="' + r1(x + cw2 * q) + '" y2="' + r1(y + h) + '" stroke="#c5ced6" stroke-width="1"/>');
      pins.forEach(function (pn, q2) { o.push(tx(x + cw2 * (q2 + 0.5), y + h / 2 + 4, esc(pn), 10, ' text-anchor="middle" font-weight="700" fill="#52606d"')); });
      o.push(tx(x + w / 2, d.place === 'bottom' ? y + h + 15 : y - 6, esc(d.label || tag), 12, ' text-anchor="middle" font-weight="700"'));
    } else {
      var label = d.label || tag;
      if (d.type === 'lamp' || d.type === 'bz') {
        o.push('<circle cx="' + r1(x + w / 2) + '" cy="' + r1(y + h * 0.42) + '" r="' + r1(Math.min(w, h) * 0.3) + '" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>');
        o.push(tx(x + w / 2, y + h * 0.42 + 5, label, 13, ' text-anchor="middle" font-weight="700"'));
      } else if (d.type === 'pb') {
        o.push('<circle cx="' + r1(x + w / 2) + '" cy="' + r1(y + h * 0.58) + '" r="' + r1(Math.min(w, h) * 0.26) + '" fill="#e5e7eb" stroke="' + INK + '" stroke-width="1.4"/>');
        o.push(tx(x + w / 2, y + h * 0.58 + 5, label, 12, ' text-anchor="middle" font-weight="700"'));
      } else {
        o.push(tx(x + w / 2, y + h / 2 + 6, label, d.type === 'fuse-2p' ? 12 : 16, ' text-anchor="middle" font-weight="700"'));
        var tn = (PL.types[d.type] || {}).name;
        if (tn && d.type !== 'fuse-2p') o.push(tx(x + w / 2, y + h / 2 + 20, tn, 9, ' text-anchor="middle" fill="#52606d"'));
      }
      if (d.type === 'socket-12p' || d.type === 'socket-8p') o.push('<path d="M' + r1(x + w / 2 - 6) + ',' + r1(y + h) + ' v-5 h12 v5" fill="none" stroke="' + INK + '" stroke-width="1.1"/>');
    }
    // 단자
    Object.keys(terms).forEach(function (k) {
      var t = terms[k]; if (t.tag !== tag) return;
      var on = hl[k] || hl[k.replace(/@(ext|int)$/, '')];
      var r = isTB ? 6 : 8;
      o.push('<g class="pr-term" data-key="' + esc(k) + '"><circle cx="' + r1(t.x) + '" cy="' + r1(t.y) + '" r="' + (on ? r + 2 : r) + '" fill="' + (on ? HL : '#fff') + '" stroke="' + (on ? HL : INK) + '" stroke-width="' + (on ? 2 : 1.2) + '"/>');
      if (!isTB) {
        var lbl = String(t.pin).replace(/#.*$/, '');
        o.push(tx(t.x, t.y + 3.5, esc(lbl), lbl.length > 2 ? 7.5 : 10, ' text-anchor="middle" font-weight="700"' + (on ? ' fill="#fff"' : '')));
      } else if (!on) {
        o.push('<line x1="' + r1(t.x - 3.5) + '" y1="' + r1(t.y - 3.5) + '" x2="' + r1(t.x + 3.5) + '" y2="' + r1(t.y + 3.5) + '" stroke="#9aa5b1"/>');
      }
      o.push('</g>');
    });
    o.push('</g>');
    return o.join('');
  }

  function laneFor(W, t) {
    var lanes = W.panel.lanes || [], y = (t.y - M) / S, best = null;
    lanes.forEach(function (l) {
      if (t.dir === 'up' && l < y && (best === null || l > best)) best = l;
      if (t.dir === 'down' && l > y && (best === null || l < best)) best = l;
    });
    if (best === null) best = t.dir === 'up' ? y - 8 : y + 8;
    return M + best * S;
  }
  function route(W, a, b, k) {
    var o = ((k % 9) - 4) * 1.5 * S, la = laneFor(W, a) + o, lb = laneFor(W, b) + o;
    if (Math.abs(la - lb) < 0.5) return [[a.x, a.y], [a.x, la], [b.x, la], [b.x, b.y]];
    var g = W.panel.gutters || [8, W.panel.size[0] - 8], mid = ((a.x + b.x) / 2 - M) / S;
    var gx = M + (mid < W.panel.size[0] / 2 ? g[0] : g[1]) * S + o;
    return [[a.x, a.y], [a.x, la], [gx, la], [gx, lb], [b.x, lb], [b.x, b.y]];
  }
  function wireSvg(pts, type, state) {
    var d = pts.map(function (p) { return r1(p[0]) + ',' + r1(p[1]); }).join(' ');
    var ink = (type || {}).ink || INK;
    if (state === 'done') return '<polyline points="' + d + '" fill="none" stroke="' + ink + '" stroke-width="1.6" stroke-opacity="0.35" stroke-linejoin="round"/>';
    var o = '<polyline points="' + d + '" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/>' +
      '<polyline points="' + d + '" fill="none" stroke="' + ink + '" stroke-width="3.6" stroke-linejoin="round"/>';
    if (type && type.stripe) o += '<polyline points="' + d + '" fill="none" stroke="' + type.stripe + '" stroke-width="3.6" stroke-dasharray="7 7" stroke-linejoin="round"/>';
    return o;
  }
  function badge(x, y, n) {
    return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="9" fill="' + HL + '" stroke="#fff" stroke-width="1.5"/>' + tx(x, y + 4, n, 11, ' text-anchor="middle" font-weight="700" fill="#fff"');
  }

  function drawPanel(W, opts) {
    opts = opts || {};
    var cid = W.circuit || W.id, hl = opts.hl || {}, terms = panelTerminals(W, opts), size = W.panel.size;
    var vw = size[0] * S + 2 * M, vh = size[1] * S + 2 * M, o = [], top = [];
    o.push('<rect x="0" y="0" width="' + r1(vw) + '" height="' + r1(vh) + '" fill="#fff"/>');
    o.push('<rect x="' + M + '" y="' + M + '" width="' + r1(size[0] * S) + '" height="' + r1(size[1] * S) + '" fill="#fbfaf7" stroke="' + INK + '" stroke-width="2"/>');
    (W.panel.decor || []).forEach(function (d) {
      o.push('<rect x="' + r1(M + d.x * S) + '" y="' + r1(M + d.y * S) + '" width="' + r1(d.w * S) + '" height="' + r1(d.h * S) + '" rx="6" fill="none" stroke="' + INK + '" stroke-width="1.2"/>');
      if (d.label) o.push(tx(M + d.x * S + 6, M + d.y * S - 5, d.label, 11, ' fill="#52606d"'));
    });
    // 선: 먼저 끝난 선(옅게), 그다음 지금 구간
    var edges = opts.edges || [], types = W.wireTypes || {};
    function pos(p, side) { return terms[termKey(p, side)] || terms[p]; }
    ['done', 'active'].forEach(function (st) {
      edges.forEach(function (e, k) {
        if ((e.state || 'active') !== st) return;
        var a = pos(e.a, e.aSide), b = pos(e.b, e.bSide);
        if (a && b) {
          var pts = route(W, a, b, k);
          if (e.id != null) {   // 요청 0062 직접 연결해 보기: 학생이 그은 선 — 누를 수 있게 감싸고, 굵은 투명 선으로 누르는 폭을 넓힌다
            var dd = pts.map(function (p) { return r1(p[0]) + ',' + r1(p[1]); }).join(' ');
            o.push('<g class="pr-wire" data-wire="' + e.id + '">' + (e.mark === 'bad' || e.mark === 'warn' ? '<polyline points="' + dd + '" fill="none" stroke="' + (e.mark === 'bad' ? '#d92d20' : '#f79009') + '" stroke-width="11" stroke-opacity="0.45" stroke-linejoin="round"/>' : '') +
              wireSvg(pts, types[e.wire], st) + '<polyline points="' + dd + '" fill="none" stroke="#000" stroke-opacity="0" stroke-width="14" stroke-linejoin="round"/></g>');
            return;
          }
          o.push(wireSvg(pts, types[e.wire], st));
          if (st === 'active' && e.no) { var m = pts[Math.floor((pts.length - 1) / 2)], n2 = pts[Math.floor((pts.length - 1) / 2) + 1]; top.push(badge((m[0] + n2[0]) / 2, (m[1] + n2[1]) / 2, e.no)); }
        } else if (st === 'active' && (a || b)) {
          // 제어판 밖으로 나가는 선: 단자대 바깥쪽 나사에서 짧게 빼고 행선지를 적는다
          var t = a || b, other = a ? e.b : e.a, dy = t.dir === 'up' ? -1 : 1, len = 30;
          var p2 = [[t.x, t.y], [t.x, t.y + dy * len]];
          o.push(wireSvg(p2, types[e.wire], 'active'));
          o.push('<polygon points="' + r1(t.x - 5) + ',' + r1(t.y + dy * (len - 2)) + ' ' + r1(t.x + 5) + ',' + r1(t.y + dy * (len - 2)) + ' ' + r1(t.x) + ',' + r1(t.y + dy * (len + 7)) + '" fill="' + HL + '"/>');
          var lab = (opts.labels && opts.labels[other]) || other.split('/')[1];
          var ly = t.y + dy * (len + 10);
          top.push(tx(t.x + 4, ly, esc(lab), 11, ' text-anchor="' + (dy < 0 ? 'start' : 'end') + '" transform="rotate(-90 ' + r1(t.x + 4) + ' ' + r1(ly) + ')" font-weight="700" fill="' + HL + '" paint-order="stroke" stroke="#fff" stroke-width="3"'));
          if (e.no) top.push(badge(t.x + 14, t.y + dy * len * 0.55, e.no));
        }
      });
    });
    Object.keys(W.panel.devices).forEach(function (tag) { o.push(drawDevice(tag, W.panel.devices[tag], terms, hl, cid, opts)); });
    return '<svg viewBox="0 0 ' + r1(vw) + ' ' + r1(vh) + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="제어판 배치도">' + o.join('') + top.join('') + '</svg>';
  }

  /* ------------------------------------------------------------ 단자대 띠 (배관도 위·아래, 단자대 번호매기기) */
  function shortLabel(key) {
    var r = WM.parseRef(key); if (!r) return [key, ''];
    var pin = r.pin;
    if (/^SS#ssM$/.test(pin)) return ['SS', 'N(M)'];
    if (/^SS#ssA$/.test(pin)) return ['SS', 'N(A)'];
    return [r.tag, pin];
  }
  function cellLabel(entry) {
    if (!Array.isArray(entry)) return shortLabel(entry);
    if (entry.every(function (p) { return /:SS#ss[MA]$/.test(p); })) return ['SS', '공통'];
    var ls = entry.map(shortLabel);
    var tags = ls.map(function (l) { return l[0]; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    return [tags.join('·'), ls.map(function (l) { return tags.length === 1 ? l[1].replace(/\(.*\)$/, '') : l[1]; }).join('·')];
  }
  /* 한 띠의 칸 목록: [{ pos, group, entry }] */
  function groupCells(W, g, common) { return WM.groupCells(W, g, common); }
  function stripCells(W, stripId, common) {
    var TB = W.terminalBlocks, cells = {};
    (TB.groups || []).forEach(function (g) {
      if (g.strip !== stripId) return;
      groupCells(W, g, common).forEach(function (c) { cells[c.pos] = { pos: c.pos, group: g, entry: c.entry }; });
    });
    return cells;
  }
  var GROUP_TINT = ['#fff4c2', '#dff3e4', '#e3ecff', '#fde2e1', '#efe4ff', '#d9f2f2', '#ffe8cc', '#e8eef3'];
  function drawStrip(W, stripId, x0, y0, cw, opts) {
    var TB = W.terminalBlocks, s = TB.strips[stripId], n = s.blocks.reduce(function (a, b) { return a + b; }, 0);
    // 0098 학생용: 권장 배치·번호를 읽거나 생성하기 전에 빈 띠만 반환한다.
    if (opts.blankStrips) {
      var blank = [tx(x0, y0 - 12, stripId + ' (10P+10P)', 13, ' font-weight="700"')];
      for (var bi = 0; bi < n; bi++) blank.push('<g class="ps-tb-blank"><rect x="' + r1(x0 + bi * cw) + '" y="' + r1(y0) + '" width="' + cw + '" height="58" fill="#fff" stroke="#8a96a3"/></g>');
      blank.push('<line x1="' + r1(x0 + 10 * cw) + '" y1="' + r1(y0 - 4) + '" x2="' + r1(x0 + 10 * cw) + '" y2="' + r1(y0 + 62) + '" stroke="#1f2933" stroke-width="3"/>');
      return blank.join('');
    }
    var cells = stripCells(W, stripId, opts.common), o = [], ch = 58, gi = {};
    (TB.groups || []).forEach(function (g, i) { gi[g.id] = i; });
    o.push(tx(x0, y0 - 30, (s.label || stripId) + ' · ' + stripId + ' (' + s.blocks.join('P+') + 'P)', 13, ' font-weight="700"'));
    var acc = 0, bounds = {};
    for (var p = 1; p <= n; p++) {
      var x = x0 + (p - 1) * cw, c = cells[p], hot = c && opts.hlGroups && opts.hlGroups[c.group.id];
      var cellOn = opts.cellHl && opts.cellHl[stripId + ':' + p];
      var fill = c ? (hot || !opts.hlGroups ? GROUP_TINT[gi[c.group.id] % GROUP_TINT.length] : '#f4f5f7') : '#fff';
      o.push('<g class="pr-cell" data-cell="' + stripId + ':' + p + '"><rect x="' + r1(x) + '" y="' + r1(y0) + '" width="' + r1(cw) + '" height="' + ch + '" fill="' + fill + '" stroke="' + (cellOn ? HL : '#8a96a3') + '" stroke-width="' + (cellOn ? 3 : 1) + '"/>');
      o.push(tx(x + cw / 2, y0 + 13, p + (c && Array.isArray(c.entry) ? ' 공통' : ''), c && Array.isArray(c.entry) ? 9 : 10, ' text-anchor="middle" fill="' + (c && Array.isArray(c.entry) ? '#b42318' : '#52606d') + '"' + (c && Array.isArray(c.entry) ? ' font-weight="700"' : '')));
      if (c) {
        var lb = cellLabel(c.entry), dim = opts.hlGroups && !hot;
        o.push(tx(x + cw / 2, y0 + 32, esc(lb[0]), lb[0].length > 4 ? 9 : 11, ' text-anchor="middle" font-weight="700"' + (dim ? ' fill="#9aa5b1"' : '')));
        o.push(tx(x + cw / 2, y0 + 47, esc(lb[1]), lb[1].length > 5 ? 8.5 : 11, ' text-anchor="middle"' + (dim ? ' fill="#9aa5b1"' : '')));
        var b = bounds[c.group.id] = bounds[c.group.id] || { x1: x, x2: x + cw, g: c.group };
        b.x2 = x + cw;
      }
      o.push('</g>');
      if (p === acc + s.blocks[0] && p < n) { }
    }
    acc = 0;
    s.blocks.forEach(function (b, k) { acc += b; if (k < s.blocks.length - 1) o.push('<line x1="' + r1(x0 + acc * cw) + '" y1="' + r1(y0 - 4) + '" x2="' + r1(x0 + acc * cw) + '" y2="' + r1(y0 + ch + 4) + '" stroke="' + INK + '" stroke-width="3"/>'); });
    Object.keys(bounds).forEach(function (id) {
      var b = bounds[id], hot = !opts.hlGroups || opts.hlGroups[id], yy = s.place === 'bottom' ? y0 + ch + 20 : y0 - 10;
      o.push(tx((b.x1 + b.x2) / 2, yy, b.g.mark + ' ' + esc(b.g.name), 12, ' text-anchor="middle" font-weight="700"' + (hot ? ' fill="' + HL + '"' : ' fill="#9aa5b1"')));
    });
    return o.join('');
  }

  /* ------------------------------------------------------------ 배관도 */
  var SP = 0.5;
  function boxGeom(b, opts) {
    // 상자 크기(px). 실제 치수보다 크게 그려 단자 번호가 보이게 한다
    if (b.kind === 'jbox') return { w: 34, h: 34 };
    var d = b.devices || [], first = d[0] || {};
    if (first.type === 'tb') {
      var n = (first.pins || []).length + (first.spare || 0);
      return first.orient === 'v' ? { w: 46, h: n * 26 + 14, tb: true } : { w: n * 30 + 14, h: 40, tb: true };
    }
    var rows = deviceRows(b);
    var physical = opts && opts.physicalContacts && d.some(function (v) { return v.type === 'pb' || v.type === 'ss'; });
    return { w: 60 + Math.max.apply(null, rows.map(function (r) { return r.pins.length; }).concat([2])) * 30, h: Math.max(rows.length * 34 + 12, physical ? 80 : 0), rows: rows };
  }
  /* 상자 안 줄: 기구마다 한 줄. 셀렉터 스위치는 M쪽·A쪽 두 줄로 나눠 N 두 개를 구별한다 */
  function deviceRows(b) {
    var rows = [];
    (b.devices || []).forEach(function (d) {
      var ts = PL.terminals({ type: d.type, kind: d.kind, x: 0, y: 0, w: 1, h: 1 }).map(function (t) { return t.pin; });
      if (d.type === 'ss') { rows.push({ tag: d.tag, name: 'SS M쪽', pins: ['SS#ssM', 'M'] }); rows.push({ tag: d.tag, name: 'SS A쪽', pins: ['SS#ssA', 'A'] }); }
      else rows.push({ tag: d.tag, name: d.tag, pins: ts });
    });
    return rows;
  }
  /* 상자 자리(px)와 상자 이름 글자 자리. drawPiping 이 그리기 전에 그림 범위를 잴 때도 쓴다 */
  function boxPlace(b, X, Y, opts) {
    if (b.kind === 'jbox') return null;
    var g = boxGeom(b, opts), ax = X(b.x), ay = Y(b.y), x, y;
    if (b.attach === 'top') { x = ax - g.w / 2; y = ay; }
    else if (b.attach === 'bottom') { x = ax - g.w / 2; y = ay - g.h; }
    else if (b.attach === 'left') { x = ax; y = ay - g.h / 2; }
    else { x = ax - g.w; y = ay - g.h / 2; }
    return {
      g: g, x: x, y: y,
      lx: b.attach === 'right' ? x - 6 : b.attach === 'left' ? x + g.w + 6 : x + g.w / 2,
      ly: b.attach === 'bottom' ? y - 8 : b.attach === 'top' ? y + g.h + 16 : y - 8,
      anchor: b.attach === 'right' ? 'end' : b.attach === 'left' ? 'start' : 'middle',
      head: g.tb ? (b.devices[0].label || b.id) + (b.label ? ' · ' + b.label : '') : (b.label || '')
    };
  }
  // 글자 폭 어림(글꼴 없이): 한글·원문자 1.05em, 그 밖 0.62em — 굵은 글씨 기준으로 넉넉히
  function textW(s, size) { var w = 0; for (var i = 0; i < s.length; i++) w += (s.charCodeAt(i) > 0x2000 ? 1.05 : 0.62) * size; return w; }
  function drawPiping(W, opts) {
    opts = opts || {};
    var P = W.piping, cid = W.circuit || W.id, o = [], top = [];
    var minX = -900, maxX = 780, minY = -780, maxY = 900;
    var stripH = opts.strips ? 130 : 0, cw = 40, stripW = 20 * cw;
    var vw = Math.max((maxX - minX) * SP, stripW + 90) + 20, ox = (vw - (maxX - minX) * SP) / 2;
    function X(x) { return ox + (x - minX) * SP; }
    function Y(y) { return stripH + (y - minY) * SP; }
    var vh = stripH * 2 + (maxY - minY) * SP;
    // 요청 0058: 상자·상자 이름 글자가 그림 범위(maxX 780 등) 밖으로 나가면 잘리던 것 — 그만큼 그림 폭·높이를 넓힌다
    var ext = { l: Infinity, r: -Infinity, b: -Infinity };
    (P.boxes || []).forEach(function (b) {
      var q = boxPlace(b, X, Y, opts); if (!q) return;
      var tw = q.head ? textW(q.head, 12) : 0, tl = q.anchor === 'end' ? q.lx - tw : q.anchor === 'middle' ? q.lx - tw / 2 : q.lx;
      ext.l = Math.min(ext.l, q.x, tl); ext.r = Math.max(ext.r, q.x + q.g.w, tl + tw); ext.b = Math.max(ext.b, q.y + q.g.h, q.ly + 4);
    });
    var PAD = 10, grow = { l: Math.max(0, PAD - ext.l), r: Math.max(0, ext.r + PAD - vw), b: Math.max(0, ext.b + PAD - (vh - stripH)) };
    ox += grow.l; vw += grow.l + grow.r; vh += grow.b;
    o.push('<rect x="0" y="0" width="' + r1(vw) + '" height="' + r1(vh) + '" fill="#fff"/>');
    var hp = opts.hlPipes || {}, hb = opts.hlBoxes || {}, hpt = opts.hlPoints || {};
    (P.boxes || []).forEach(function (b) {   // 강조한 관이 지나는 8각 박스도 강조
      if (b.kind === 'jbox' && (P.pipes || []).some(function (p) { return hp[p.id] && p.pts.some(function (q) { return q[0] === b.x && q[1] === b.y; }); })) { hb = copyObj(hb); hb[b.id] = 1; }
    });
    // 관
    (P.pipes || []).forEach(function (p) {
      var on = hp[p.id], d = p.pts.map(function (q) { return r1(X(q[0])) + ',' + r1(Y(q[1])); }).join(' ');
      o.push('<polyline points="' + d + '" fill="none" stroke="' + (on ? HL : '#3e4c59') + '" stroke-width="' + (on ? 7 : 4.5) + '" stroke-linejoin="round" stroke-linecap="round"' + (on ? '' : '') + '/>');
      var k = (P.pipeKinds || {})[p.kind] || {}, a = p.pts[0], b = p.pts[1];
      var mx = X((a[0] + b[0]) / 2), my = Y((a[1] + b[1]) / 2), vert = Math.abs(a[0] - b[0]) < 1;
      top.push('<circle cx="' + r1(mx + (vert ? 14 : 0)) + '" cy="' + r1(my + (vert ? 0 : -14)) + '" r="9" fill="#fff" stroke="' + (on ? HL : INK) + '"/>' + tx(mx + (vert ? 14 : 0), my + (vert ? 4 : -10), k.no || '', 11, ' text-anchor="middle" font-weight="700"' + (on ? ' fill="' + HL + '"' : '')));
    });
    // 제어함
    var bx = X(-P.box.w / 2), by = Y(-P.box.h / 2), bw = P.box.w * SP, bh = P.box.h * SP;
    o.push('<rect x="' + r1(bx) + '" y="' + r1(by) + '" width="' + r1(bw) + '" height="' + r1(bh) + '" fill="#fbfaf7" stroke="' + INK + '" stroke-width="2.2"/>');
    o.push('<rect x="' + r1(bx + 30) + '" y="' + r1(by + 12) + '" width="' + r1(bw - 60) + '" height="10" fill="' + (opts.hlStrip === 'TB5' ? HL_SOFT : '#eef1f4') + '" stroke="' + INK + '"/>' + tx(bx + bw / 2, by + 36, 'TB5', 10, ' text-anchor="middle" font-weight="700"'));
    o.push('<rect x="' + r1(bx + 30) + '" y="' + r1(by + bh - 22) + '" width="' + r1(bw - 60) + '" height="10" fill="' + (opts.hlStrip === 'TB6' ? HL_SOFT : '#eef1f4') + '" stroke="' + INK + '"/>' + tx(bx + bw / 2, by + bh - 28, 'TB6', 10, ' text-anchor="middle" font-weight="700"'));
    o.push(tx(bx + bw / 2, by + bh / 2 + 4, esc(P.box.label || '제어함') + ' (' + P.box.w + '×' + P.box.h + ')', 13, ' text-anchor="middle" font-weight="700"'));
    // 상자·외부 단자대
    (P.boxes || []).forEach(function (b) {
      var ax = X(b.x), ay = Y(b.y), on = hb[b.id];
      if (b.kind === 'jbox') {
        o.push('<circle cx="' + r1(ax) + '" cy="' + r1(ay) + '" r="17" fill="#fff" stroke="' + (on ? HL : INK) + '" stroke-width="2.4"/>' + tx(ax, ay + 6, 'J', 17, ' text-anchor="middle" font-weight="700"'));
        return;
      }
      var q = boxPlace(b, X, Y, opts), g = q.g, x = q.x, y = q.y, lx = q.lx, ly = q.ly, anchor = q.anchor, head = q.head;
      o.push('<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(g.w) + '" height="' + r1(g.h) + '" rx="' + (g.tb ? 2 : 6) + '" fill="' + (on ? '#f1f5ff' : '#fff') + '" stroke="' + (on ? HL : INK) + '" stroke-width="' + (on ? 2.4 : 1.4) + '"/>');
      if (head) o.push(tx(lx, ly, esc(head), 12, ' text-anchor="' + anchor + '" font-weight="700"' + (on ? ' fill="' + HL + '"' : '')));
      if (g.tb) {
        var d = b.devices[0], n = d.pins.length + (d.spare || 0);
        for (var i = 0; i < n; i++) {
          var pin = d.pins[i], cx = d.orient === 'v' ? x + g.w / 2 : x + 7 + 30 * i + 15, cy = d.orient === 'v' ? y + 7 + 26 * i + 13 : y + g.h / 2;
          var key = cid + '/' + d.tag + ':' + pin, pon = pin && hpt[key];
          if (pin) o.push('<g class="pr-term" data-key="' + esc(key) + '">');
          o.push('<circle cx="' + r1(cx) + '" cy="' + r1(cy) + '" r="11" fill="' + (pon ? HL : pin ? '#fff' : '#f1f3f5') + '" stroke="' + (pon ? HL : INK) + '"/>');
          if (pin) o.push(tx(cx, cy + 4, pin, pin.length > 2 ? 8 : 10, ' text-anchor="middle" font-weight="700"' + (pon ? ' fill="#fff"' : '')) + '</g>');
        }
      } else {
        if (opts.physicalContacts && (b.devices || []).some(function (d) { return d.type === 'pb' || d.type === 'ss'; })) {
          var devices = b.devices || [], dw = (g.w - 6 - (devices.length - 1) * 3) / devices.length;
          devices.forEach(function (dev, di) {
            var d = { type: dev.type, kind: dev.kind, x: (x + 3 + di * (dw + 3) - M) / S, y: (y + 3 - M) / S, w: dw / S, h: (g.h - 6) / S }, terms = {};
            PL.terminals(d, opts).forEach(function (t) { var key = cid + '/' + dev.tag + ':' + t.pin; terms[key] = { tag: dev.tag, pin: t.pin, x: M + t.x * S, y: M + t.y * S }; });
            o.push(drawContact(dev.tag, d, terms, hpt));
          });
          return;
        }
        g.rows.forEach(function (row, r) {
          var ry = y + 6 + r * 34 + 17;
          o.push(tx(x + 8, ry + 4, esc(row.name), row.name.length > 3 ? 10 : 12, ' font-weight="700"'));
          row.pins.forEach(function (pin, i) {
            var t = { pin: pin }, cx = x + 58 + 30 * i + 2, key = cid + '/' + row.tag + ':' + t.pin, pon = hpt[key];
            var lbl = String(t.pin).replace(/^SS#ss([MA])$/, 'N');
            o.push('<g class="pr-term" data-key="' + esc(key) + '"><circle cx="' + r1(cx) + '" cy="' + r1(ry) + '" r="11" fill="' + (pon ? HL : '#fff') + '" stroke="' + (pon ? HL : INK) + '"/>' + tx(cx, ry + 4, lbl, 10, ' text-anchor="middle" font-weight="700"' + (pon ? ' fill="#fff"' : '')) + '</g>');
          });
        });
      }
    });
    // 관 범례
    Object.keys(P.pipeKinds || {}).forEach(function (k, i) { var pk = P.pipeKinds[k]; o.push(tx(vw - 16, Y(minY) + 18 + i * 18, pk.no + ' ' + esc(pk.label), 12, ' text-anchor="end"')); });
    if (opts.strips && W.terminalBlocks) {
      var sx = (vw - stripW) / 2;
      o.push(drawStrip(W, 'TB5', sx, 50, cw, opts));
      o.push(drawStrip(W, 'TB6', sx, vh - stripH + 30, cw, opts));
    }
    return '<svg viewBox="0 0 ' + r1(vw) + ' ' + r1(vh) + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="배관도">' + o.join('') + top.join('') + '</svg>';
  }

  var api = { drawPanel: drawPanel, drawPiping: drawPiping, drawStrip: drawStrip, stripCells: stripCells, groupCells: groupCells, cellLabel: cellLabel, shortLabel: shortLabel, panelTerminals: panelTerminals, termKey: termKey, route: route };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PANEL_RENDER = api;
})(typeof window === 'undefined' ? globalThis : window);
