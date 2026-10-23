/* 승강기기능사 e04 · 동작 회로도 (요청 0023·0025)
 * 위쪽 CircuitDiagram 클래스는 e과정 회로 앱끼리 글자 하나까지 같다(001~018 앱의 접점 기호·통전 경로 계산을 옮김).
 *   - 제어회로: 회로 데이터 circuit-e04.js 의 layout(선·접점·코일 좌표)에서 그린다 → 핀번호·회로해석 페이지와 같은 그림
 *   - 주회로: 묶음별 그리기(정역 reversing / Y-Δ starDelta / 전동기 2대 twoMotors)
 * 회로마다 다른 곳은 맨 아래 CONFIG 세 줄뿐이다. 이 파일은 검사/e과정_시뮬레이션/gen.py 로 만든다.
 */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  /* ======================================================== 공통 부분 (e과정 앱끼리 글자까지 같다) */
  class CircuitDiagram {
    constructor(svg) {
      this.svg = svg; this.nodes = {}; this.edges = []; this.loads = []; this.parts = []; this.mainParts = []; this.dynamicTexts = [];
      const cfg = CircuitDiagram.CONFIG;
      this.C = (window.PIN_CIRCUITS || {})[cfg.id];
      if (!this.C) throw new Error('회로 데이터 circuit-' + cfg.id + '.js 를 circuit-diagram.js 보다 먼저 불러와야 합니다.');
      this.G = CircuitDiagram.GROUPS[cfg.main];
      this.VIEW = this.views();
      this.build(); this.selected = '';
      const content = document.createElementNS(NS, 'g');
      while (svg.firstChild) content.appendChild(svg.firstChild);
      svg.appendChild(content);
      const defs = this.el('defs', {}, svg), clip = this.el('clipPath', { id: 'circuit-crop', clipPathUnits: 'userSpaceOnUse' }, defs);
      const box = this.VIEW.all.split(' ');
      this.crop = this.el('rect', { x: box[0], y: box[1], width: box[2], height: box[3] }, clip);
      content.setAttribute('clip-path', 'url(#circuit-crop)');
      svg.setAttribute('viewBox', this.VIEW.all);
    }
    el(tag, attributes, parent = this.svg, text) {
      const e = document.createElementNS(NS, tag);
      for (const [k, v] of Object.entries(attributes || {})) e.setAttribute(k, v);
      if (text !== undefined) e.textContent = text;
      parent.appendChild(e); return e;
    }
    text(x, y, label, cls = '', parent = this.svg, anchor = 'start') { return this.el('text', { x, y, class: cls, 'text-anchor': anchor }, parent, label); }
    node(id, x, y) { this.nodes[id] = [x, y]; return id; }
    pathBetween(a, b, via = []) { return ['M', ...this.nodes[a], ...via.flatMap(p => ['L', ...p]), 'L', ...this.nodes[b]].join(' '); }
    wire(a, b, via = []) {
      const e = this.el('path', { d: this.pathBetween(a, b, via), class: 'wire' });
      this.edges.push({ a, b, el: e, type: 'wire' }); return e;
    }
    contactSymbol(parent, x1, y1, x2, y2, device, kind) {
      const horizontal = y1 === y2, span = horizontal ? x2 - x1 : y2 - y1;
      const glyph = this.el('g', { class: 'contact-symbol', transform: `translate(${x1} ${y1})${horizontal ? ' rotate(-90)' : ''}` }, parent);
      const links = this.el('path', { class: 'symbol-line contact-links', d: `M-5 0H0 M-5 ${span}H0` }, glyph);
      const moving = this.el('g', { class: 'contact-moving' }, glyph);
      const blade = this.el('path', { class: 'symbol-line contact-bar', d: `M0 -4V${span + 4}` }, moving);
      const mid = span / 2;
      let symbol = 'relay';
      if (/^PB[0-2]$/.test(device)) {
        symbol = 'pushbutton';
        this.el('path', { class: 'symbol-line symbol-feature', d: `M0 ${mid}H11` }, moving);
      } else if (device === 'EOCR') {
        symbol = 'overload';
        this.el('path', { class: 'symbol-line symbol-feature', d: `M-4 ${mid - 4}L4 ${mid + 4} M-4 ${mid + 4}L4 ${mid - 4}` }, moving);
      } else if (device === 'FR') {
        symbol = 'flicker';
        this.el('path', { class: 'symbol-line symbol-feature symbol-filled', d: `M-6 ${mid}L0 ${mid - 4}L6 ${mid}L0 ${mid + 4}Z` }, moving);
      } else if (/^T[12]?$/.test(device) && kind.includes('한시')) {
        symbol = 'timer-delayed';
        this.el('path', { class: 'symbol-line symbol-feature', d: `M0 ${mid - 4}L7 ${mid}L0 ${mid + 4}Z` }, moving);
      } else if (/^T[12]?$/.test(device)) symbol = 'timer-instant';
      for (const cy of [0, span]) this.el('circle', { cx: 0, cy, r: 3.5, class: 'contact-dot' }, glyph);
      parent.setAttribute('data-symbol', symbol);
      return { moving, links, blade, span };
    }
    setContactClosed(symbol, closed) {
      symbol.moving.setAttribute('transform', `translate(${closed ? -5 : 12} 0)`);
      symbol.links.setAttribute('visibility', closed ? 'visible' : 'hidden');
    }
    contact(id, device, a, b, label, kind = 'a', side = 'right') {
      const [x1, y1] = this.nodes[a], [x2, y2] = this.nodes[b]; const horizontal = y1 === y2;
      const g = this.el('g', { class: 'contact', 'data-device': device, 'data-contact': id });
      const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
      this.el('rect', { x: horizontal ? x1 - 6 : x1 - 15, y: horizontal ? y1 - 19 : y1 - 9, width: horizontal ? x2 - x1 + 12 : 40, height: horizontal ? 38 : y2 - y1 + 18, rx: 7, class: 'device-selection' }, g);
      this.el('title', {}, g, label + ' ' + kind + '접점');
      const symbol = this.contactSymbol(g, x1, y1, x2, y2, device, kind);
      const tx = horizontal ? cx : (side === 'left' ? x1 - 16 : x1 + 28), ty = horizontal ? y1 - 21 : cy - 3;
      const visibleLabel = /^T[12]?$/.test(device) ? label + (kind.includes('한시') ? ' 한시' : ' 순시') : label;
      this.text(tx, ty, visibleLabel, '', g, horizontal ? 'middle' : side === 'left' ? 'end' : 'start');
      const stateLabel = this.text(tx, horizontal ? y1 + 24 : cy + 17, '', 'contact-state', g, horizontal ? 'middle' : side === 'left' ? 'end' : 'start');
      this.edges.push({ a, b, id, el: g, type: 'contact', device, symbol, stateLabel, x1, y1, x2, y2, horizontal, kind });
      this.parts.push(g);
    }
    load(id, device, positive, negative, label, kind = 'coil') {
      const [x, top] = this.nodes[positive], [, bottom] = this.nodes[negative], cy = (top + bottom) / 2;
      const g = this.el('g', { class: 'load ' + (kind === 'lamp' ? 'lamp-' + id : ''), 'data-device': device, 'data-load': id });
      this.el('rect', { x: x - 33, y: top - 8, width: 66, height: bottom - top + 16, rx: 8, class: 'device-selection' }, g);
      this.el('circle', { cx: x, cy, r: (bottom - top) / 2, class: 'device-shape' }, g);
      this.text(x, cy + 6, label, '', g, 'middle');
      this.el('title', {}, g, label + (kind === 'coil' ? ' 코일' : ' 표시등'));
      this.loads.push({ id, positive, negative, el: g }); this.parts.push(g);
    }
    // 주회로: on(state) = 전류가 흐름, volt(state) = 전압만 걸림
    mainWire(d, on, volt = on) { const el = this.el('path', { d, class: 'wire' }); this.mainParts.push({ el, on, volt }); return el; }
    mainContact(x, y, device, closed) {
      const g = this.el('g', { class: 'contact', 'data-device': device, 'data-symbol': device === 'MCCB' ? 'breaker' : 'contactor-main' });
      this.el('rect', { x: x - 21, y: y - 8, width: 42, height: 56, rx: 6, class: 'device-selection' }, g);
      const blade = this.el('path', { class: 'symbol-line main-contact-blade' }, g);
      if (device !== 'MCCB') this.el('path', { class: 'symbol-line fixed-contact-tip', d: `M${x + 3} ${y + 1}h5v6` }, g);
      this.el('circle', { cx: x, cy: y, r: 3.5, class: 'contact-dot' }, g);
      this.el('circle', { cx: x, cy: y + 40, r: 3.5, class: 'contact-dot' }, g);
      this.mainParts.push({ el: g, blade, x, y, device, closed, contact: true }); this.parts.push(g);
    }
    motor(x, y, label, device, on, r = 30) {
      const g = this.el('g', { 'data-device': device, class: 'load', 'data-motor': label });
      this.el('rect', { x: x - r - 8, y: y - r - 8, width: 2 * r + 16, height: 2 * r + 16, rx: 10, class: 'device-selection' }, g);
      this.el('circle', { cx: x, cy: y, r, class: 'device-shape' }, g); this.text(x, y + 6, label, '', g, 'middle');
      this.mainParts.push({ el: g, on, motor: true }); this.parts.push(g); return g;
    }
    liveText(x, y, fn, cls = 'motor-mode', anchor = 'middle') { const t = this.text(x, y, '', cls, this.svg, anchor); this.dynamicTexts.push({ el: t, fn }); return t; }
    dotAt(cx, cy) { this.el('circle', { cx, cy, r: 3.8, class: 'junction' }); }
    terminalBlock(y, xs, labels, dy) {
      this.el('rect', { x: xs[0] - 15, y: y - 10, width: xs[2] - xs[0] + 30, height: 20, fill: 'white', stroke: '#9aabae' });
      xs.forEach((x, i) => { this.el('circle', { cx: x, cy: y, r: 3.5, class: 'contact-dot' }); if (labels) this.text(x + [-14, 11, 14][i], y + dy, labels[i], 'small-text', this.svg, 'middle'); });
    }

    /* ---------- 화면 범위: 회로 데이터 좌표에서 계산 */
    views() {
      const C = this.C, W = C.layout.viewBox[0] + 20, H = this.G.busY + 70, it = C.layout.items.filter(x => x.cat !== 'main');
      const isAlarm = x => x.id === 'coil-EOCR' || x.id === 'eocrNO' || (x.nets || []).some(n => n === 'ALM' || n === 'YLc');
      const opX = Math.min(...it.filter(x => !x.horiz && !isAlarm(x)).map(x => x.x)) - 90, alX = Math.max(...it.filter(isAlarm).map(x => x.x)) + 90;
      return { all: `0 0 ${W} ${H}`, control: `350 10 ${W - 350} ${H - 10}`, operation: `${opX} 60 ${W - opX} ${H - 60}`, alarm: `350 60 ${alX - 350} ${H - 60}` };
    }

    /* ---------- 주회로 (묶음별: 회로 데이터 layout 과 같은 좌표) */
    supply() {
      const G = this.G, P = [70, 115, 160], run = G.run, power = s => s.power;
      this.text(190, 44, '주회로', 'section-title'); this.text(190, 64, G.sourceText, 'small-text');
      this.text(420, 24, '제어회로', 'section-title'); this.text(505, 24, '제어 전원 L1–L3 · AC 220V', 'small-text');
      this.el('rect', { x: 55, y: G.termY - 10, width: 120, height: 20, fill: 'white', stroke: '#9aabae' });
      P.forEach((x, i) => {
        this.text(x, G.termY - 20, 'L' + (i + 1), '', this.svg, 'middle');
        const feedOn = s => s.power && (run(s) || i !== 1);   // 제어회로가 L1·L3 에서 전원을 받으므로 두 상은 전원만 넣어도 흐른다
        this.el('circle', { cx: x, cy: G.termY, r: 3.5, class: 'contact-dot' });
        this.mainWire(`M${x} ${G.termY}V115`, feedOn, power); this.mainContact(x, 115, 'MCCB', power);
        this.mainWire(`M${x} 155V${G.eocrY}`, feedOn, power);
      });
      this.el('path', { d: 'M70 136H160', class: 'mechanical' }); this.text(10, 108, 'MCCB', 'small-text');
      const eocr = this.el('g', { 'data-device': 'EOCR' }); this.parts.push(eocr);
      this.el('rect', { x: 46, y: G.eocrY - 8, width: 138, height: 46, rx: 7, class: 'device-selection' }, eocr);
      this.el('rect', { x: 54, y: G.eocrY, width: 122, height: 30, fill: '#f6f9f8', stroke: '#869a9d', 'stroke-width': 2 }, eocr);
      this.text(115, G.eocrY + 21, 'EOCR', '', eocr, 'middle');
      // 제어 전원: L1(MCCB 뒤) → H,  L3 → 아래 모선 N
      this.mainWire(`M70 ${G.feedY}H370`, power); this.dotAt(70, G.feedY);
      this.mainWire(`M160 ${G.feedY + 20}H350V${G.busY}H370`, power); this.dotAt(160, G.feedY + 20);
    }
    // 전동기 1대 정역: MC1 은 그대로, MC2 는 L1 과 L3 를 바꿔 넣는다(L1 → W, L3 → U)
    mainReversing() {
      const P = [70, 115, 160], power = s => s.power, run = s => s.mc1 || s.mc2, live = f => s => s.power && f(s);
      const tapY = [300, 315, 330], retY = [550, 535, 520];
      P.forEach((x, i) => {
        const mx = 230 + 45 * i;
        this.mainWire(`M${x} 265V${tapY[i]}`, live(run), power);
        this.mainWire(`M${x} ${tapY[i]}V420`, live(s => s.mc1), power);
        this.mainWire(`M${x} ${tapY[i]}H${mx}V420`, live(s => s.mc2), power);
        this.dotAt(x, tapY[i]);
        this.mainContact(x, 420, 'MC1', s => s.mc1); this.mainContact(mx, 420, 'MC2', s => s.mc2);
        this.mainWire(`M${x} 460V${retY[i]}`, live(s => s.mc1), live(s => s.mc1));
        this.mainWire(`M${x} ${retY[i]}V605`, live(run), live(run));
      });
      [[230, 520, 160], [275, 535, 115], [320, 550, 70]].forEach(([mx, y, to]) => { this.mainWire(`M${mx} 460V${y}H${to}`, live(s => s.mc2), live(s => s.mc2)); this.dotAt(to, y); });
      this.el('path', { d: 'M70 441H160 M230 441H320', class: 'mechanical' });
      this.text(12, 446, 'MC1'); this.text(334, 446, 'MC2');
      this.terminalBlock(615, P, ['U', 'V', 'W'], 29);
      this.mainWire('M70 625V640L93 668', live(run)); this.mainWire('M115 625V660', live(run)); this.mainWire('M160 625V640L137 668', live(run));
      this.motor(115, 690, 'M', 'M', run);
      this.liveText(115, 748, s => s.mc1 ? '↻ 정회전' : s.mc2 ? '↺ 역회전' : '정지');
    }
    // 6단자 전동기 Y-Δ: U·V·W 는 EOCR 뒤에 늘 연결, MC1 이 X·Y·Z 를 묶으면 Y, MC2 가 L1→Z·L2→X·L3→Y 로 이으면 Δ
    mainStarDelta() {
      const P = [70, 115, 160], power = s => s.power, run = s => s.mc1 || s.mc2, live = f => s => s.power && f(s);
      const tapY = [300, 315, 330];
      P.forEach((x, i) => {
        const mx = 230 + 45 * i;
        this.mainWire(`M${x} 275V${tapY[i]}`, live(run), power);
        this.mainWire(`M${x} ${tapY[i]}V350`, live(run), power);
        this.mainWire(`M${x} ${tapY[i]}H${mx}V600`, live(s => s.mc2), power);
        this.dotAt(x, tapY[i]);
        this.mainContact(mx, 600, 'MC2', s => s.mc2);
      });
      this.terminalBlock(360, P, ['U', 'V', 'W'], 32);
      this.el('rect', { x: 55, y: 510, width: 120, height: 20, fill: 'white', stroke: '#9aabae' });
      ['X', 'Y', 'Z'].forEach((t, i) => { this.el('circle', { cx: P[i], cy: 520, r: 3.5, class: 'contact-dot' }); this.text(P[i] + [-14, 11, 14][i], 506, t, 'small-text', this.svg, 'middle'); });
      this.mainWire('M70 370V405L92 428', live(run), power); this.mainWire('M115 370V418', live(run), power); this.mainWire('M160 370V405L138 428', live(run), power);
      this.mainWire('M92 468L70 490V510', live(run), power); this.mainWire('M115 478V510', live(run), power); this.mainWire('M138 468L160 490V510', live(run), power);
      this.motor(115, 448, 'M', 'M', run);
      const joinY = { 160: 665, 70: 680, 115: 695 };
      P.forEach(x => {
        this.mainWire(`M${x} 530V${joinY[x]}`, live(run), live(run));
        this.mainWire(`M${x} ${joinY[x]}V740`, live(s => s.mc1), live(run));
        this.mainContact(x, 740, 'MC1', s => s.mc1);
        this.mainWire(`M${x} 780V805`, live(s => s.mc1), live(s => s.mc1));
      });
      [[230, 160], [275, 70], [320, 115]].forEach(([mx, to]) => { this.mainWire(`M${mx} 640V${joinY[to]}H${to}`, live(s => s.mc2), live(s => s.mc2)); this.dotAt(to, joinY[to]); });
      this.mainWire('M70 805H160', live(s => s.mc1), live(s => s.mc1)); this.dotAt(115, 805);
      this.el('path', { d: 'M230 621H320 M70 761H160', class: 'mechanical' });
      this.text(334, 626, 'MC2'); this.text(14, 766, 'MC1'); this.text(334, 646, 'Δ 결선', 'small-text'); this.text(14, 786, 'Y 결선', 'small-text');
      this.liveText(115, 848, s => s.mc1 ? 'Y 기동 · X·Y·Z 한 점' : s.mc2 ? 'Δ 운전 · 권선 끝에 다른 상' : '정지');
    }
    // 독립 전동기 2대: MC1 → M1, MC2 → M2
    mainTwoMotors() {
      const P = [70, 115, 160], power = s => s.power, run = s => s.mc1 || s.mc2, live = f => s => s.power && f(s);
      const tapY = [310, 325, 340];
      P.forEach((x, i) => {
        const mx = 230 + 45 * i;
        this.mainWire(`M${x} 265V${tapY[i]}`, live(run), power);
        this.mainWire(`M${x} ${tapY[i]}V420`, live(s => s.mc1), power);
        this.mainWire(`M${x} ${tapY[i]}H${mx}V420`, live(s => s.mc2), power);
        this.dotAt(x, tapY[i]);
        this.mainContact(x, 420, 'MC1', s => s.mc1); this.mainContact(mx, 420, 'MC2', s => s.mc2);
        this.mainWire(`M${x} 460V540`, live(s => s.mc1), live(s => s.mc1));
        this.mainWire(`M${mx} 460V540`, live(s => s.mc2), live(s => s.mc2));
      });
      this.el('path', { d: 'M70 441H160 M230 441H320', class: 'mechanical' });
      this.text(12, 446, 'MC1'); this.text(334, 446, 'MC2');
      this.terminalBlock(550, P, ['U1', 'V1', 'W1'], -16); this.terminalBlock(550, [230, 275, 320], ['U2', 'V2', 'W2'], -16);
      for (const [o, key, name] of [[0, 'mc1', 'M1'], [160, 'mc2', 'M2']]) {
        const f = live(s => s[key]);
        this.mainWire(`M${70 + o} 560V575L${95 + o} 598`, f); this.mainWire(`M${115 + o} 560V592`, f); this.mainWire(`M${160 + o} 560V575L${135 + o} 598`, f);
        this.motor(115 + o, 622, name, key === 'mc1' ? 'M1' : 'M2', s => s[key], 26);
        this.liveText(115 + o, 670, s => s[key] ? '운전' : '정지');
      }
    }

    /* ---------- 제어회로: 회로 데이터 layout(drawing 의 선 + items 의 접점·코일)에서 그대로 그린다
     * 선 끝점이 다른 선의 가운데에 닿으면 그 자리를 이음점으로 나눈다(T 이음). 끝점 없이 엇갈리기만 하면 잇지 않는다.
     * H = 제어 전원 들어오는 점(370, 전원 가지 y), N = 아래 모선 왼쪽 끝(370, 모선 y) */
    controlFromData() {
      const C = this.C, L = C.layout, G = this.G, cY = L.coilY;
      const H = [370, G.feedY], N = [370, G.busY];
      const key = (x, y) => (x === H[0] && y === H[1]) ? 'H' : (x === N[0] && y === N[1]) ? 'N' : `p${x}_${y}`;
      const segs = [];
      for (const d of L.drawing) {
        const pts = d.t === 'line' ? [[d.x1, d.y1], [d.x2, d.y2]] : d.t === 'wire' ? d.pts : null;
        if (!pts) continue;
        for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if (Math.min(a[0], b[0]) >= 365) segs.push([a, b]); }
      }
      const terms = [];
      for (const it of L.items) {
        if (it.cat === 'main') continue;
        if (it.cat === 'coil' || it.cat === 'lamp') terms.push([it.x, cY - 24], [it.x, cY + 24]);
        else if (it.horiz) terms.push([it.x1, it.y], [it.x2, it.y]);
        else terms.push([it.x, it.rows[0]], [it.x, it.rows[1]]);
      }
      const pts = [...terms, ...segs.flat()];
      const onSeg = (p, a, b) => { const cross = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]); if (Math.abs(cross) > 1e-6) return false; const t = ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / ((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2); return t > 1e-9 && t < 1 - 1e-9; };
      const degree = {};
      const addNode = p => { const k = key(p[0], p[1]); if (!this.nodes[k]) this.node(k, p[0], p[1]); return k; };
      const bump = k => { degree[k] = (degree[k] || 0) + 1; };
      for (const [a, b] of segs) {
        const inner = pts.filter(p => onSeg(p, a, b)).map(p => [p, ((p[0] - a[0]) ** 2 + (p[1] - a[1]) ** 2)]).sort((u, v) => u[1] - v[1]).map(u => u[0]);
        const chain = [a, ...inner.filter((p, i, arr) => i === 0 || p[0] !== arr[i - 1][0] || p[1] !== arr[i - 1][1]), b];
        for (let i = 1; i < chain.length; i++) { const u = addNode(chain[i - 1]), v = addNode(chain[i]); if (u === v) continue; this.wire(u, v); bump(u); bump(v); }
      }
      for (const it of L.items) {
        if (it.cat === 'main') continue;
        if (it.cat === 'coil' || it.cat === 'lamp') {
          const p = addNode([it.x, cY - 24]), n = addNode([it.x, cY + 24]);
          this.load(it.tag, it.tag, p, n, it.tag, it.cat === 'lamp' ? 'lamp' : 'coil'); bump(p); bump(n); continue;
        }
        const a = it.horiz ? addNode([it.x1, it.y]) : addNode([it.x, it.rows[0]]), b = it.horiz ? addNode([it.x2, it.y]) : addNode([it.x, it.rows[1]]);
        const kind = (it.timing === 'delay' ? '한시 ' : it.timing === 'instant' ? '순시 ' : '') + it.kind;
        this.contact(it.id, it.tag, a, b, it.label || it.tag, kind); bump(a); bump(b);
      }
      if (!this.nodes.H || !this.nodes.N) throw new Error(C.id + ': 회로 데이터 그림에서 H(370,' + G.feedY + ') 또는 N(370,' + G.busY + ') 점을 찾지 못했습니다.');
      for (const [k, d] of Object.entries(degree)) if (d >= 3) this.dotAt(...this.nodes[k]);
    }
    build() {
      const cfg = CircuitDiagram.CONFIG;
      this.supply();
      ({ reversing: () => this.mainReversing(), starDelta: () => this.mainStarDelta(), twoMotors: () => this.mainTwoMotors() })[cfg.main]();
      this.controlFromData();
      this.text(420, this.G.busY + 56, cfg.caption, 'small-text');
    }

    /* ---------- 상태 그리기 */
    analyze(state) {
      const adjacency = {}; for (const id of Object.keys(this.nodes)) adjacency[id] = [];
      for (const edge of this.edges) { if (edge.type === 'wire' || state.contacts[edge.id]) { adjacency[edge.a].push([edge.b, edge]); adjacency[edge.b].push([edge.a, edge]); } }
      const reach = (start) => { const seen = new Set([start]), q = [start]; while (q.length) { const a = q.pop(); for (const [b] of adjacency[a]) if (!seen.has(b)) { seen.add(b); q.push(b); } } return seen; };
      const high = state.power ? reach('H') : new Set(), low = reach('N'), flow = new Set(), calculatedLoads = {};
      const trace = (from, to) => {
        const visited = new Set();
        function walk(a) { if (a === to) return true; visited.add(a); let found = false; for (const [b, edge] of adjacency[a]) if (!visited.has(b) && walk(b)) { flow.add(edge); found = true; } visited.delete(a); return found; }
        walk(from);
      };
      for (const load of this.loads) { const on = high.has(load.positive) && low.has(load.negative); calculatedLoads[load.id] = on; if (on) { trace('H', load.positive); trace('N', load.negative); } }
      return { high, flow, calculatedLoads };
    }
    update(state) {
      const { high, flow, calculatedLoads } = this.analyze(state); this.calculatedLoads = calculatedLoads;
      for (const edge of this.edges) {
        const live = flow.has(edge), voltage = high.has(edge.a) || high.has(edge.b);
        edge.el.classList.toggle('is-live', live); edge.el.classList.toggle('has-voltage', voltage);
        if (edge.type === 'contact') {
          const closed = state.contacts[edge.id];
          edge.el.setAttribute('data-closed', closed); edge.el.setAttribute('aria-label', edge.id + ' ' + (closed ? '닫힘' : '열림'));
          this.setContactClosed(edge.symbol, closed);
          edge.stateLabel.textContent = edge.kind.replace(/(?:순시|한시) /, '') + ' · ' + (closed ? '닫힘' : '열림');
        }
      }
      for (const load of this.loads) { load.el.classList.toggle('on', calculatedLoads[load.id]); load.el.setAttribute('data-on', calculatedLoads[load.id]); }
      for (const p of this.mainParts) {
        if (p.contact) {
          const closed = !!p.closed(state);
          p.el.setAttribute('data-closed', closed);
          p.el.setAttribute('aria-label', p.device + ' 주접점 ' + (closed ? '닫힘' : '열림'));
          p.blade.setAttribute('d', p.device === 'MCCB'
            ? `M${p.x} ${p.y + 40}C${p.x + 18} ${p.y + 32} ${p.x + 18} ${p.y + 8} ${p.x + (closed ? 0 : 7)} ${p.y + (closed ? 0 : 3)}`
            : `M${p.x} ${p.y + 40}L${p.x + (closed ? 0 : 16)} ${p.y}`);
          p.el.classList.toggle('is-live', closed && state.power); p.el.classList.toggle('has-voltage', !!state.power);
          continue;
        }
        const on = !!p.on(state);
        if (p.motor) { p.el.classList.toggle('on', on); continue; }
        p.el.classList.toggle('is-live', on); p.el.classList.toggle('has-voltage', !!p.volt(state));
      }
      for (const t of this.dynamicTexts) t.el.textContent = t.fn(state);
      this.select(this.selected);
    }
    select(device) { this.selected = device; for (const part of this.parts) part.classList.toggle('selected-device', !!device && part.dataset.device === device); }
    view(mode) {
      const box = this.VIEW[mode] || this.VIEW.all; this.svg.setAttribute('viewBox', box); this.svg.parentElement.dataset.view = mode;
      box.split(' ').forEach((value, i) => this.crop.setAttribute(['x', 'y', 'width', 'height'][i], value));
    }
  }
  // 주회로 묶음: 회로 데이터 layout 의 좌표(묶음 안에서 모두 같다)
  CircuitDiagram.GROUPS = {
    reversing: { termY: 59, eocrY: 235, feedY: 175, busY: 700, sourceText: '3P3W AC 220V', run: s => s.mc1 || s.mc2 },
    starDelta: { termY: 55, eocrY: 245, feedY: 180, busY: 810, sourceText: '3P3W AC 220V', run: s => s.mc1 || s.mc2 },
    twoMotors: { termY: 55, eocrY: 235, feedY: 175, busY: 760, sourceText: '3P AC 220V', run: s => s.mc1 || s.mc2 }
  };
  window.CircuitDiagram = CircuitDiagram;
})();
window.CircuitDiagram.CONFIG = {
  id: 'e04', main: 'reversing',
  caption: "승강기 04 · T1 한시 a로 T2 기동(순시 a 자기유지) → T2 한시 b로 정회전 정지, 역회전 · MC1 a → GL, MC2 a → RL"
};
