/*
 * 회로도 그리기 공용 모듈 (2026-09-23, 요청 0018)
 * ------------------------------------------------------------------
 * pin-engine.js(핀번호 적기)와 interpret-engine.js(회로해석)가 같은 회로도를 그리도록
 * pin-engine.js 안에 있던 SVG 도우미·기호 그리기·도형 순회를 이 파일로 옮겼다.
 * 출력은 옮기기 전과 글자 하나까지 같다(검사: scratch/20260923_0018_회로해석엔진).
 *
 * 쓰는 법
 *   var DR = window.DIAGRAM_RENDER;
 *   var parts = DR.drawBase(C.layout, items, byId, C.layout.coilY, { wrapItems: false });
 *   svg.innerHTML = parts.join('');
 *
 * drawBase 옵션
 *   wrapItems : true 면 접점·코일 기호마다 <g data-item-id="…" data-tag="…" class="dr-item"> 로 감싼다(회로해석 클릭용)
 *   itemClass : function(it) → 추가 class 문자열(선택·정답 표시). wrapItems 일 때만 쓴다
 * 칸(slot)은 그리지 않는다. 핀번호 엔진이 그 뒤에 칸을 붙인다.
 */
(function (root) {
  'use strict';
  var INK = '#1f2933';
  var FONT = "'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif";

  /* ------------------------------------------------------------ SVG 도우미 */
  function strokeAttrs(extra) {
    extra = extra || '';
    return (/\sstroke="/.test(extra) ? '' : ' stroke="' + INK + '"') + (/stroke-width=/.test(extra) ? '' : ' stroke-width="1.6"') + extra;
  }
  function ln(x1, y1, x2, y2, extra) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"' + strokeAttrs(extra) + '/>'; }
  function pl(pts, extra) { return '<polyline points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="none"' + strokeAttrs(extra) + '/>'; }
  function tx(x, y, s, size, extra) { return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 14) + '" font-family="' + FONT + '"' + (/\sfill="/.test(extra || '') ? '' : ' fill="' + INK + '"') + (extra || '') + '>' + s + '</text>'; }
  function term(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4.2" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/>'; }
  function dot(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="3.8" fill="' + INK + '"/>'; }
  function feature(feat, bx, ym) {
    if (feat === 'ovl') return ln(bx - 5, ym - 5, bx + 5, ym + 5) + ln(bx - 5, ym + 5, bx + 5, ym - 5);
    if (feat === 'fl') return '<polygon points="' + (bx - 6) + ',' + ym + ' ' + bx + ',' + (ym - 7) + ' ' + (bx + 6) + ',' + ym + ' ' + bx + ',' + (ym + 7) + '" fill="' + INK + '"/>';
    // 한시 접점: 닫힌 삼각형 (기존 회로 앱 접점개선판과 같은 모양)
    if (feat === 'td') return '<polygon points="' + bx + ',' + (ym - 5) + ' ' + (bx + 8) + ',' + ym + ' ' + bx + ',' + (ym + 5) + '" fill="#fff" stroke="' + INK + '" stroke-width="1.6"/>';
    if (feat === 'pb') return ln(bx, ym, bx + 9, ym);
    if (feat === 'ss') return ln(bx, ym, bx + 9, ym) + ln(bx + 5, ym + 4, bx + 9, ym);
    return '';
  }
  // 리밋스위치: 막대 옆 네모(기존 회로 앱과 같은 모양). 막대 전체 길이가 필요해서 따로 그린다
  function featureLS(bx, y1, y2) {
    return pl([[bx, y1], [bx + 7, y1], [bx + 7, y2], [bx, y2]]);
  }
  function contactV(x, yT, yB, kind, feat) {
    var bx = kind === 'a' ? x + 10 : x - 5, ym = (yT + yB) / 2;
    return ln(bx, yT - 8, bx, yB + 8, ' stroke-width="2"') + (feat === 'ls' ? featureLS(bx, yT - 8, yB + 8) : feature(feat, bx, ym)) + term(x, yT) + term(x, yB);
  }
  function coilShape(it, coilY) {
    var x = it.x, y = coilY;
    if (it.shape === 'rect') return '<rect x="' + (x - 22) + '" y="' + (y - 22) + '" width="44" height="44" fill="#fff" stroke="' + INK + '" stroke-width="1.6"/>' +
      ln(x + 22, y - 22, x + 28, y + 18) + tx(x, y + 5, 'BZ', 14, ' text-anchor="middle" font-weight="700"');
    return '<circle cx="' + x + '" cy="' + y + '" r="24" fill="#fff" stroke="' + INK + '" stroke-width="1.6"/>' +
      tx(x, y + 5, it.tag, it.tag.length > 3 ? 11 : 14, ' text-anchor="middle" font-weight="700"');
  }
  function earth(x, y) { return ln(x, y, x, y + 10) + ln(x - 10, y + 10, x + 10, y + 10) + ln(x - 6, y + 14, x + 6, y + 14) + ln(x - 2, y + 18, x + 2, y + 18); }

  /* ------------------------------------------------------------ 기호 하나 (접점·코일·램프) */
  function symbolOf(it, coilY) {
    var out = '';
    if (it.horiz) {
      var ym = it.y + 6;
      var featOut = (it.feat === 'pb') ? ln((it.x1 + it.x2) / 2, ym, (it.x1 + it.x2) / 2, ym - 11) : feature(it.feat, (it.x1 + it.x2) / 2, ym);
      out += ln(it.x1 - 6, ym, it.x2 + 6, ym, ' stroke-width="2"') + featOut + term(it.x1, it.y) + term(it.x2, it.y);
      if (it.label) {
        var ty = (it.slots && it.slots[0]) ? it.slots[0].y - 20 : it.y - 45;
        out += tx((it.x1 + it.x2) / 2, ty, it.label, 13, ' text-anchor="middle" font-weight="700"');
      }
      return out;
    }
    if (it.cat === 'coil' || it.cat === 'lamp') return coilShape(it, coilY);
    out += contactV(it.x, it.yT, it.yB, it.kind, it.feat);
    if (it.label) out += tx(it.x + (it.kind === 'a' ? 18 : 12) + (it.feat === 'td' ? 7 : it.feat === 'ls' ? 8 : 0), (it.yT + it.yB) / 2 + 5, it.label, 14, ' font-weight="700"');
    if (it.sub) out += tx(it.x + 10, it.yB + 26, it.sub, 14, ' font-weight="700"');
    return out;
  }

  /* 항목 기호가 차지하는 네모(클릭 영역·강조 테두리). 회로해석에서만 쓴다 */
  function itemBox(it, coilY) {
    if (it.horiz) {
      // 가로 접점: 기호 + 위쪽 이름표(symbolOf 와 같은 위치)까지 덮는다
      var top = it.label ? ((it.slots && it.slots[0]) ? it.slots[0].y - 20 : it.y - 45) - 16 : it.y - 16;
      return { x: Math.min(it.x1, it.x2) - 14, y: top, w: Math.abs(it.x2 - it.x1) + 28, h: it.y + 16 - top };
    }
    if (it.cat === 'coil' || it.cat === 'lamp') return { x: it.x - 30, y: coilY - 30, w: 60, h: 60 };
    if (it.yT === undefined) return null;
    var right = it.x + (it.label ? 18 + (it.feat === 'td' ? 7 : it.feat === 'ls' ? 8 : 0) + 11 * String(it.label).length : 22);
    return { x: it.x - 14, y: it.yT - 14, w: right - (it.x - 14) + 4, h: it.yB - it.yT + 28 + (it.sub ? 18 : 0) };
  }
  function wrap(it, svg, opts, coilY) {
    if (!opts.wrapItems) return svg;
    var b = itemBox(it, coilY), extra = opts.itemClass ? opts.itemClass(it) : '';
    var hit = b ? '<rect class="dr-hit" x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h + '" rx="6"/>' : '';
    return '<g class="dr-item' + (extra ? ' ' + extra : '') + '" data-item-id="' + it.id + '" data-tag="' + it.tag + '">' + hit + svg + '</g>';
  }

  /* ------------------------------------------------------------ 회로도 전체 (칸 제외) */
  function drawBase(LAY, items, byId, coilY, opts) {
    opts = opts || {};
    var o = [], VB = LAY.viewBox;
    o.push('<rect x="0" y="0" width="' + VB[0] + '" height="' + VB[1] + '" fill="#fff"/>');
    var drawn = {};
    (LAY.drawing || []).forEach(function (p) {
      var extra = (p.dash ? ' stroke-dasharray="3 3"' : '') + (p.sw && p.t === 'line' ? ' stroke-width="' + p.sw + '"' : '');
      if (p.t === 'rect') o.push('<rect x="' + p.x + '" y="' + p.y + '" width="' + p.w + '" height="' + p.h + '" fill="#fff" stroke="' + INK + '" stroke-width="' + (p.sw || 1.4) + '"/>');
      else if (p.t === 'text') o.push(tx(p.x, p.y, p.s, p.size || 14, (p.anchor ? ' text-anchor="' + p.anchor + '"' : '') + (p.bold === false ? '' : ' font-weight="700"')));
      else if (p.t === 'term') o.push(term(p.x, p.y));
      else if (p.t === 'dot') o.push(dot(p.x, p.y));
      else if (p.t === 'line') o.push(ln(p.x1, p.y1, p.x2, p.y2, extra || undefined));
      else if (p.t === 'wire') o.push(pl(p.pts));
      else if (p.t === 'breaker') o.push('<path d="M' + p.x + ',' + p.y2 + ' Q' + (p.x + 14) + ',' + ((p.y1 + p.y2) / 2) + ' ' + (p.x + 4) + ',' + (p.y1 + 3) + '" fill="none" stroke="' + INK + '" stroke-width="1.8"/>', term(p.x, p.y1), term(p.x, p.y2));
      else if (p.t === 'mc') o.push('<path d="M' + p.x + ',' + p.y2 + ' L' + (p.x + 11) + ',' + (p.y1 + 5) + '" fill="none" stroke="' + INK + '" stroke-width="1.8"/>', '<path d="M' + (p.x + 4) + ',' + (p.y1 - 1) + ' q7,-2 6,6" fill="none" stroke="' + INK + '" stroke-width="1.4"/>', term(p.x, p.y1), term(p.x, p.y2));
      else if (p.t === 'fuse') o.push('<rect x="' + p.x + '" y="' + (p.y - 6) + '" width="40" height="12" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>', ln(p.x + 4, p.y + 4, p.x + 36, p.y - 4));
      else if (p.t === 'motor') o.push('<circle cx="' + p.x + '" cy="' + p.y + '" r="24" fill="#fff" stroke="' + INK + '" stroke-width="1.6"/>', tx(p.x, p.y + 6, p.s, 16, ' text-anchor="middle" font-weight="700"'));
      else if (p.t === 'earth') o.push(earth(p.x, p.y));
      else if (p.t === 'item') { if (byId[p.id]) { o.push(wrap(byId[p.id], symbolOf(byId[p.id], coilY), opts, coilY)); drawn[p.id] = 1; } }
      else if (p.t === 'items') items.forEach(function (it) {
        if (drawn[it.id] || it.cat === 'main' || it.cat === 'flsE') return;
        drawn[it.id] = 1; o.push(wrap(it, symbolOf(it, coilY), opts, coilY));
      });
    });
    return o;
  }

  /* 회로해석에서 고를 수 있는 항목(기호가 그려지는 접점·코일·램프) */
  function drawableItems(LAY, items, byId) {
    var ids = {};
    (LAY.drawing || []).forEach(function (p) {
      if (p.t === 'item' && byId[p.id]) ids[p.id] = 1;
      if (p.t === 'items') items.forEach(function (it) { if (it.cat !== 'main' && it.cat !== 'flsE') ids[it.id] = 1; });
    });
    return ids;
  }

  var api = {
    INK: INK, FONT: FONT,
    strokeAttrs: strokeAttrs, ln: ln, pl: pl, tx: tx, term: term, dot: dot, feature: feature, featureLS: featureLS,
    contactV: contactV, coilShape: coilShape, earth: earth, symbolOf: symbolOf, itemBox: itemBox,
    drawBase: drawBase, drawableItems: drawableItems
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DIAGRAM_RENDER = api;
})(typeof window === 'undefined' ? globalThis : window);

/* 0098: 핀번호 엔진에서 옮긴 순수 기구 그림. 회로·정답·학생 상태를 읽지 않는다. */
(function (root) {
  'use strict';
  var DR = root.DIAGRAM_RENDER, L = root.PIN_DEVICE_LIBRARY, INK = '#1f2933';
  var HL = '#1d4ed8';
  function pinGroup(pin, inner, hl) {
    return '<g data-pin="' + pin + '" style="cursor:pointer">' + inner + (hl ? '' : '') + '</g>';
  }
  function draw12(type, hlPins) {
    var t = L.types[type], mc = type === 'mc-12p', o = [];
    var top = mc ? ['(L1)', '(L2)', '(L3)', '(a1)', '(b1)', '(A1)'] : ['(L1)', '(L2)', '(L3)', '(96)', '(98)', '(A1)'];
    var bot = mc ? ['(U)', '(V)', '(W)', '(a2)', '(b2)', '(A2)'] : ['(U)', '(V)', '(W)', '(95)', '(97)', '(A2)'];
    o.push('<rect x="4" y="4" width="322" height="' + (mc ? 282 : 266) + '" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>');
    for (var i = 0; i < 6; i++) {
      var x = 40 + i * 50, pt = String(i + 1), pb = String(i + 7);
      o.push(DR.tx(x, 26, top[i], 11, ' text-anchor="middle" font-weight="700"'), DR.tx(x, 250, bot[i], 11, ' text-anchor="middle" font-weight="700"'));
      if (mc && i < 3) o.push(DR.tx(x, 268, ['(X)', '(Y)', '(Z)'][i], 11, ' text-anchor="middle" font-weight="700"'));
      // 내부
      if (mc && i < 3) {
        o.push(DR.ln(x, 71, x, 108), DR.ln(x, 165, x, 201), '<path d="M' + x + ',156 L' + (x + 11) + ',118" stroke="' + INK + '" stroke-width="1.8" fill="none"/>',
          '<path d="M' + (x + 4) + ',112 q7,-2 6,6" stroke="' + INK + '" stroke-width="1.4" fill="none"/>', DR.term(x, 112), DR.term(x, 160));
      } else if (!mc && i < 3) {
        o.push(DR.ln(x, 71, x, 201));
      } else if (i === 5) {
        o.push(DR.ln(x, 71, x, 114), DR.ln(x, 158, x, 201), '<circle cx="' + x + '" cy="136" r="22" fill="#fff" stroke="' + INK + '" stroke-width="1.6"/>', DR.tx(x, 141, '전원', 12, ' text-anchor="middle" font-weight="700"'));
      } else {
        var kind = mc ? (i === 3 ? 'a' : 'b') : (i === 3 ? 'b' : 'a');
        o.push(DR.ln(x, 71, x, 108), DR.ln(x, 164, x, 201));
        var bx = kind === 'a' ? x + 12 : x - 5;
        o.push(DR.ln(bx, 104, bx, 168, ' stroke-width="2"'), DR.term(x, 112), DR.term(x, 160));
        if (!mc) o.push(DR.feature('ovl', bx, 136));
      }
      [[pt, 50, 66], [pb, 232, 206]].forEach(function (p) {
        var on = hlPins.indexOf(p[0]) >= 0;
        o.push(pinGroup(p[0], '<rect x="' + (x - 20) + '" y="' + (p[1] - 18) + '" width="40" height="' + (p[0] === pt ? 44 : 30) + '" fill="' + (on ? '#dbe6ff' : 'transparent') + '" rx="6" transform="translate(0,' + (p[0] === pt ? 0 : -8) + ')"/>' +
          DR.tx(x, p[1] + (p[0] === pt ? 0 : 0), p[0], 18, ' text-anchor="middle" font-weight="700"' + (on ? ' fill="' + HL + '"' : '')) + DR.term(x, p[2])));
      });
    }
    if (!mc) {
      o.push('<rect x="18" y="116" width="142" height="40" fill="#fff" stroke="' + INK + '" stroke-width="1.6"/>', DR.tx(89, 143, 'EOCR', 18, ' text-anchor="middle" font-weight="700"'));
      o.push(DR.ln(190, 182, 240, 182), DR.dot(190, 182), DR.dot(240, 182));
    }
    return '<svg viewBox="0 0 330 ' + (mc ? 290 : 274) + '" xmlns="http://www.w3.org/2000/svg">' + o.join('') + '</svg>';
  }

  var P8 = { '1': [162, 193], '2': [123, 153], '3': [123, 95], '4': [162, 57], '5': [218, 57], '6': [258, 95], '7': [258, 153], '8': [218, 193] };
  function hcont(x1, x2, y, kind, feat) {
    var by = kind === 'a' ? y - 7 : y + 5, o = DR.ln(x1 - 5, by, x2 + 5, by, ' stroke-width="2"') + DR.term(x1, y) + DR.term(x2, y);
    var xm = (x1 + x2) / 2;
    if (feat === 'td') o += '<polygon points="' + (xm - 6) + ',' + by + ' ' + xm + ',' + (by - 8) + ' ' + (xm + 6) + ',' + by + '" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/>';
    if (feat === 'fl') o += '<polygon points="' + (xm - 6) + ',' + by + ' ' + xm + ',' + (by - 7) + ' ' + (xm + 6) + ',' + by + ' ' + xm + ',' + (by + 7) + '" fill="' + INK + '"/>';
    return o;
  }
  function hopPath(pts) { return '<path d="' + pts + '" fill="none" stroke="' + INK + '" stroke-width="1.5"/>'; }
  function draw8(type, hlPins) {
    var o = [], cx = 190, cy = 125;
    o.push('<circle cx="' + cx + '" cy="' + cy + '" r="102" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>');
    o.push('<circle cx="190" cy="118" r="20" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>', '<circle cx="190" cy="140" r="6" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>', '<rect x="183" y="130" width="14" height="10" fill="#fff"/>');
    var ac = function () {
      o.push(DR.ln(123, 167, 123, 272, ' stroke-width="1.5"'), DR.ln(258, 167, 258, 272, ' stroke-width="1.5"'));
      o.push(DR.ln(128, 262, 253, 262), '<polygon points="123,262 131,258 131,266" fill="' + INK + '"/><polygon points="258,262 250,258 250,266" fill="' + INK + '"/>');
      o.push(DR.tx(190, 255, 'AC 220V', 12, ' text-anchor="middle" font-weight="700"'));
    };
    var rightSet = function (feat, bRow) {
      o.push(DR.ln(232, 57, 305, 57, ' stroke-width="1.5"'), DR.ln(272, 95, 305, 95, ' stroke-width="1.5"'));
      o.push(hcont(310, 340, 57, 'b', feat), hcont(310, 340, 95, 'a', feat));
      o.push(DR.pl([[345, 57], [358, 57], [358, 95], [345, 95]]), DR.dot(358, 76));
      o.push(hopPath('M358,76 L370,76 L370,240 L264,240 A6,6 0 0 0 252,240 L218,240 L218,207'));
    };
    if (type === 'relay-8p') {
      o.push(DR.ln(148, 57, 75, 57, ' stroke-width="1.5"'), DR.ln(109, 95, 75, 95, ' stroke-width="1.5"'));
      o.push(hcont(40, 70, 57, 'b'), hcont(40, 70, 95, 'a'));
      o.push(DR.pl([[35, 57], [22, 57], [22, 95], [35, 95]]), DR.dot(22, 76));
      o.push(hopPath('M22,76 L10,76 L10,240 L117,240 A6,6 0 0 1 129,240 L162,240 L162,207'));
      rightSet(''); ac();
    } else if (type === 'timer-8p') {
      o.push(DR.pl([[109, 95], [28, 95], [28, 113]]));
      o.push(DR.ln(38, 111, 38, 159, ' stroke-width="2"'), DR.term(28, 117), DR.term(28, 153));
      o.push(hopPath('M28,157 L28,240 L117,240 A6,6 0 0 1 129,240 L162,240 L162,207'));
      rightSet('td'); ac();
    } else if (type === 'flicker-8p') {
      rightSet('fl'); ac();
    } else if (type === 'fls-8p') {
      o.push(DR.ln(109, 95, 75, 95, ' stroke-width="1.5"'), DR.ln(109, 153, 75, 153, ' stroke-width="1.5"'));
      o.push(hcont(40, 70, 95, 'a'), hcont(40, 70, 153, 'b'));
      o.push(DR.pl([[35, 95], [22, 95], [22, 153], [35, 153]]), DR.dot(22, 124), DR.pl([[148, 57], [10, 57], [10, 124], [22, 124]]));
      o.push(DR.ln(232, 57, 312, 57, ' stroke-width="1.5"'), DR.ln(272, 95, 312, 95, ' stroke-width="1.5"'));
      o.push(DR.ln(304, 62, 304, 90), '<polygon points="304,57 300,65 308,65" fill="' + INK + '"/><polygon points="304,95 300,87 308,87" fill="' + INK + '"/>', DR.tx(314, 81, 'AC 220V', 10, ' font-weight="700"'));
      o.push('<rect x="322" y="128" width="50" height="128" fill="none" stroke="' + INK + '" stroke-dasharray="4 3"/>');
      o.push(DR.ln(272, 153, 346, 153, ' stroke-width="1.5"'), DR.ln(232, 193, 346, 193, ' stroke-width="1.5"'), DR.pl([[162, 207], [162, 240], [346, 240]]), DR.dot(162, 240), DR.pl([[162, 240], [110, 240]]), DR.earth(110, 240));
      [['E1', 153], ['E2', 193], ['E3', 240]].forEach(function (e) { o.push(DR.term(350, e[1]), DR.tx(350, e[1] - 9, e[0], 11, ' text-anchor="middle" font-weight="700"')); });
    }
    Object.keys(P8).forEach(function (p) {
      var on = hlPins.indexOf(p) >= 0, q = P8[p];
      o.push(pinGroup(p, '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="14" fill="' + (on ? '#dbe6ff' : '#fff') + '" stroke="' + (on ? HL : INK) + '" stroke-width="' + (on ? 2.4 : 1.5) + '"/>' +
        DR.tx(q[0], q[1] + 6, p, 17, ' text-anchor="middle" font-weight="700"' + (on ? ' fill="' + HL + '"' : ''))));
    });
    return '<svg viewBox="0 0 380 285" xmlns="http://www.w3.org/2000/svg">' + o.join('') + '</svg>';
  }
  function screw(x, y) { return '<rect x="' + (x - 15) + '" y="' + (y - 15) + '" width="30" height="30" fill="#fff" stroke="' + INK + '" stroke-width="1.3"/><circle cx="' + x + '" cy="' + y + '" r="10" fill="#fff" stroke="' + INK + '" stroke-width="1.3"/>' + DR.ln(x - 6, y - 6, x + 6, y + 6, ' stroke-width="1.3"') + DR.ln(x - 6, y + 6, x + 6, y - 6, ' stroke-width="1.3"'); }
  function drawSocket(kind, hlPins) {
    var o = [], n = kind === '12' ? 6 : 4, gap = 50, w = n * gap + 30;
    var top = kind === '12' ? ['1', '2', '3', '4', '5', '6'] : ['6', '5', '4', '3'];
    var bot = kind === '12' ? ['7', '8', '9', '10', '11', '12'] : ['7', '8', '1', '2'];
    o.push('<rect x="10" y="8" width="' + w + '" height="186" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>');
    var cx = 10 + w / 2;
    o.push('<circle cx="' + cx + '" cy="101" r="' + 26 + '" fill="#fff" stroke="' + INK + '" stroke-width="1.3"/><circle cx="' + cx + '" cy="101" r="' + 13 + '" fill="#fff" stroke="' + INK + '" stroke-width="1.3"/>');
    var holes = kind === '12' ? 12 : 8, rr = 19;
    for (var h = 0; h < holes; h++) { var a = (h + 0.5) / holes * Math.PI * 2; o.push('<circle cx="' + (cx + rr * Math.sin(a)) + '" cy="' + (101 + rr * Math.cos(a)) + '" r="4" fill="#fff" stroke="' + INK + '"/>'); }
    top.forEach(function (p, i) {
      var x = 35 + i * gap, on = hlPins.indexOf(p) >= 0;
      o.push(pinGroup(p, screw(x, 30) + '<rect x="' + (x - 18) + '" y="48" width="36" height="24" rx="5" fill="' + (on ? '#dbe6ff' : 'transparent') + '"/>' + DR.tx(x, 67, p, 17, ' text-anchor="middle" font-weight="700"' + (on ? ' fill="' + HL + '"' : ''))));
    });
    bot.forEach(function (p, i) {
      var x = 35 + i * gap, on = hlPins.indexOf(p) >= 0;
      o.push(pinGroup(p, screw(x, 172) + '<rect x="' + (x - 18) + '" y="130" width="36" height="24" rx="5" fill="' + (on ? '#dbe6ff' : 'transparent') + '"/>' + DR.tx(x, 149, p, 17, ' text-anchor="middle" font-weight="700"' + (on ? ' fill="' + HL + '"' : ''))));
    });
    o.push(DR.tx(w + 8, 212, '하측부 ▲', 12, ' text-anchor="end"'));
    return '<svg viewBox="0 0 ' + (w + 20) + ' 218" xmlns="http://www.w3.org/2000/svg">' + o.join('') + '</svg>';
  }
  function termBtn(x, y, value, label, hl) {
    var on = hl.indexOf(value) >= 0;
    return pinGroup(value, '<circle cx="' + x + '" cy="' + y + '" r="16" fill="' + (on ? '#dbe6ff' : '#fff') + '" stroke="' + (on ? HL : INK) + '" stroke-width="' + (on ? 2.4 : 1.4) + '"/>' + DR.tx(x, y + 6, label, 15, ' text-anchor="middle" font-weight="700"' + (on ? ' fill="' + HL + '"' : '')));
  }
  function drawPB(hl, it) {
    var o = [];
    o.push('<circle cx="70" cy="110" r="52" fill="#f3f4f6" stroke="' + INK + '"/>', DR.tx(70, 115, '버튼 뒷면', 12, ' text-anchor="middle"'));
    var isNC = !it || it.kind === 'b';
    var isNO = it && it.kind === 'a';
    [['NC', 55, 'C'], ['NO', 150, 'O']].forEach(function (b) {
      var active = (b[0] === 'NC' && isNC) || (b[0] === 'NO' && isNO);
      var curHl = active ? hl : [];
      o.push('<rect x="140" y="' + (b[1] - 34) + '" width="180" height="68" rx="6" fill="' + (active ? '#fff' : '#fafafa') + '" stroke="' + (active ? INK : '#c5ced6') + '"/>', DR.tx(230, b[1] - 16, b[0], 14, ' text-anchor="middle" font-weight="700"' + (active ? '' : ' fill="#88929b"')));
      o.push(termBtn(175, b[1] + 8, 'N', 'N', curHl), termBtn(285, b[1] + 8, b[2], b[2], curHl));
    });
    return '<svg viewBox="0 0 330 200" xmlns="http://www.w3.org/2000/svg">' + o.join('') + '</svg>';
  }
  function drawSS(hl, it) {
    var o = [];
    var isA = it && (it.id === 'ssA' || it.sub === 'A' || /자동|SS-A/.test(it.title || ''));
    var lever = isA ? DR.ln(35, 150, 85, 90, ' stroke-width="8" stroke-linecap="round"') : DR.ln(35, 90, 85, 150, ' stroke-width="8" stroke-linecap="round"');
    o.push('<circle cx="60" cy="120" r="46" fill="#f3f4f6" stroke="' + INK + '"/>', lever, DR.tx(10, 58, '수동(M)', 12, isA ? '' : ' font-weight="700" fill="#1d4ed8"'), DR.tx(112, 58, '자동(A)', 12, ' text-anchor="end"' + (isA ? ' font-weight="700" fill="#1d4ed8"' : '')));
    o.push('<rect x="130" y="20" width="190" height="200" rx="6" fill="#fff" stroke="' + INK + '"/>', DR.ln(200, 120, 320, 120, ' stroke-dasharray="4 3"'));
    o.push(DR.tx(225, 40, 'NC (위)', 12, ' text-anchor="middle" font-weight="700"'), DR.tx(225, 140, 'NO (아래)', 12, ' text-anchor="middle" font-weight="700"'));
    o.push(DR.ln(170, 86, 170, 154, ' stroke-width="3" stroke="#b42318"'), DR.tx(178, 125, 'SS', 13, ' font-weight="700" fill="#b42318"'));
    var hlTop = !isA ? hl : [];
    var hlBottom = isA ? hl : [];
    o.push(termBtn(170, 70, 'SS', 'N', hlTop), termBtn(170, 170, 'SS', 'N', hlBottom), termBtn(280, 70, 'M', 'C', hlTop), termBtn(280, 170, 'A', 'O', hlBottom));
    o.push(DR.tx(280, 104, '→ M', 13, ' text-anchor="middle" font-weight="700"'), DR.tx(280, 204, '→ A', 13, ' text-anchor="middle" font-weight="700"'));
    return '<svg viewBox="0 0 330 230" xmlns="http://www.w3.org/2000/svg">' + o.join('') + '</svg>';
  }
  function drawTwo(name, hl) {
    var o = [];
    o.push('<circle cx="165" cy="85" r="70" fill="#f3f4f6" stroke="' + INK + '"/>', DR.tx(165, 30, name + ' 뒷면', 12, ' text-anchor="middle"'));
    o.push(termBtn(125, 95, '1', '1', hl), termBtn(205, 95, '2', '2', hl), DR.tx(125, 130, '(L1)', 11, ' text-anchor="middle"'), DR.tx(205, 130, '(L2)', 11, ' text-anchor="middle"'));
    return '<svg viewBox="0 0 330 170" xmlns="http://www.w3.org/2000/svg">' + o.join('') + '</svg>';
  }
  // 리밋스위치: 기구 번호가 없어 우리 반 규칙(위 1·아래 2)을 그림으로 보여 준다. 선은 TB4로 나간다
  function drawLS(hl) {
    var o = [], bx = 150;
    o.push('<rect x="40" y="45" width="70" height="90" rx="6" fill="#f3f4f6" stroke="' + INK + '"/>', DR.tx(75, 95, 'LS', 14, ' text-anchor="middle" font-weight="700"'));
    o.push(DR.ln(75, 45, 75, 22), '<circle cx="75" cy="16" r="7" fill="#fff" stroke="' + INK + '" stroke-width="1.6"/>', DR.tx(75, 160, '리밋스위치', 11, ' text-anchor="middle"'));
    o.push(DR.ln(bx + 10, 52, bx + 10, 128, ' stroke-width="2"'), DR.featureLS(bx + 10, 52, 128), DR.ln(bx, 60, bx, 40), DR.ln(bx, 120, bx, 140));
    o.push(termBtn(bx, 40, '1', '1', hl), termBtn(bx, 140, '2', '2', hl), DR.tx(bx + 30, 94, 'a접점', 12));
    o.push(DR.ln(bx + 20, 40, 250, 40, ' stroke-dasharray="4 3"'), DR.ln(bx + 20, 140, 250, 140, ' stroke-dasharray="4 3"'));
    o.push('<rect x="250" y="28" width="60" height="124" rx="4" fill="#fff" stroke="' + INK + '"/>', DR.tx(280, 94, 'TB4', 13, ' text-anchor="middle" font-weight="700"'));
    return '<svg viewBox="0 0 330 175" xmlns="http://www.w3.org/2000/svg">' + o.join('') + '</svg>';
  }
  function drawMCCB(hl) {
    var o = [];
    o.push('<rect x="80" y="10" width="170" height="190" rx="8" fill="#f3f4f6" stroke="' + INK + '"/>', DR.tx(165, 108, 'MCCB', 14, ' text-anchor="middle" font-weight="700"'));
    ['1', '2', '3'].forEach(function (p, i) { o.push(termBtn(115 + i * 50, 40, p, p, hl)); });
    ['7', '8', '9'].forEach(function (p, i) { o.push(termBtn(115 + i * 50, 170, p, p, hl)); });
    o.push(DR.tx(40, 44, '전원측', 11, ' text-anchor="middle"'), DR.tx(40, 174, '부하측', 11, ' text-anchor="middle"'));
    return '<svg viewBox="0 0 330 210" xmlns="http://www.w3.org/2000/svg">' + o.join('') + '</svg>';
  }

  DR.deviceFigures = { draw12: draw12, draw8: draw8, drawSocket: drawSocket, drawPB: drawPB, drawSS: drawSS, drawTwo: drawTwo, drawLS: drawLS, drawMCCB: drawMCCB };
})(typeof window === "undefined" ? globalThis : window);
