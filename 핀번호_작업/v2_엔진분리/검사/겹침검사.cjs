#!/usr/bin/env node
/*
 * 그림 겹침 검사기 (요청 0041) — 브라우저 없이 node 만으로 돈다.
 *   node 검사/겹침검사.cjs 004            회로 하나
 *   node 검사/겹침검사.cjs all            전기 001~018 + 승강기 e01~e10
 *   node 검사/겹침검사.cjs 004 --rev 75755e7   그 커밋의 회로·결선 데이터로 검사(엔진은 지금 것)
 *   --info  정보 항목도 모두 적는다   --json  결과를 JSON 으로
 *
 * 기존 검사기(검사하기·결선검사)는 데이터가 맞는지를 본다. 이 검사기는 "화면에 그린 모양"이 학생을 헷갈리게 하는지를 본다.
 *
 * [회로도] circuit-NNN.js 의 layout(drawing·items) 과 핀번호 엔진의 칸 규칙(pin-validate.js buildItems)으로 모양을 다시 만든다.
 *   오류  원 관통   : 선이 다른 기구의 코일·램프·전동기 원(또는 BZ 네모) 속을 지나간다. 흰 바탕에 가려 두 기구가 이어진 것처럼 보인다(0039 004).
 *                     선의 양 끝이 아닌 꺾인 점·중간이 원 안에 있으면 '지나감'. 선 끝이 원 안·원 둘레에 있으면 그 기구의 선이다.
 *   오류  단자 가림 : 입력 칸(30×20)이 단자 원을 덮는다(0039 e07).
 *   오류  막대 교차 : 선이 접점 막대를 가로지른다(0039 e07).
 *   경고  칸 관통   : 선이 입력 칸을 뚫고 지나간다(0039 005~008). 주회로처럼 칸이 선 위에 놓이도록 설계한 칸은 제외.
 *   정보  원 안 시작: 선이 자기 기구 원 안에서 시작해 원에 가려진다(0040 FLS 전극, 설계대로).
 *   정보  비접속 교차: 두 선이 점 없이 교차한다(도면 관례상 비접속, 0039·0040 에서 허용).
 * [배관도] wire-NNN.js 의 piping 을 결선·단자대 페이지와 같은 함수(panel-render.js drawPiping)로 그린 SVG 를 읽는다(승강기는 배관도 없음).
 *   오류  상자 관통 : 관 선이 기구 상자·외부 단자대(TB1 등)·제어함을 뚫고 지나간다(0046 009).
 *   경고  글자 겹침 : 관 번호(①②③)·상자 이름·기구 이름 글자끼리 겹친다.
 *   경고  글자 가림 : 관 선이 글자를 지나간다 / 글자가 다른 상자 위에 놓인다.
 *   경고  상자 겹침 : 상자끼리 겹친다.
 *   정보  관 번호가 다른 관 위에 놓임.
 *   (요청 0052 추가)
 *   오류  관 겹침   : 서로 다른 관이 같은 선 위를 겹쳐 지나간다(공선 중복, 012 B3·B4). 한 관처럼 보인다.
 *   오류  반대쪽 상자: 아래쪽 단자대(TB6) 그룹의 기구 상자가 제어함 위쪽 절반에 있거나, 위쪽(TB5) 그룹 상자가 아래쪽 절반에 있다.
 *   경고  관 교차   : 관끼리 8각 박스(J)가 아닌 곳에서 교차한다.
 *   경고  관 붙어 감: 서로 다른 관이 10px 안으로 나란히 붙어 간다(제어함 가장자리 포함).
 * 글자 크기는 글꼴 없이 어림한다(한글 1.0em, 영문·숫자 0.6em). 그래서 글자 겹침은 1px 넘게 겹칠 때만 잡는다.
 * 종료코드: 오류가 있으면 1.
 */
const path = require('node:path'), fs = require('node:fs'), vm = require('node:vm'), cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
global.window = global;
for (const f of ['device-library', 'pin-validate', 'diagram-render', 'panel-library', 'wire-validate', 'panel-render']) require(path.join(root, '공용', f + '.js'));
const PV = global.PIN_VALIDATE, PR = global.PANEL_RENDER;

const args = process.argv.slice(2);
const opt = { info: args.includes('--info'), json: args.includes('--json'), rev: null };
const ri = args.indexOf('--rev'); if (ri >= 0) opt.rev = args[ri + 1];
const target = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--rev');
if (!target) { console.error('쓰는 법: node 검사/겹침검사.cjs 004 | all [--rev 커밋] [--info] [--json]'); process.exit(2); }
const ALL = [...Array(18)].map((_, i) => String(i + 1).padStart(3, '0')).concat([...Array(10)].map((_, i) => 'e' + String(i + 1).padStart(2, '0')));
const ids = target === 'all' ? ALL : [target];

/* ------------------------------------------------------------ 데이터 읽기 */
const repoTop = path.resolve(root, '..', '..');
function readData(kind, id) {
  const rel = '핀번호_작업/v2_엔진분리/회로/' + kind + '-' + id + '.js';
  if (opt.rev) { try { return cp.execFileSync('git', ['show', opt.rev + ':' + rel], { cwd: repoTop, maxBuffer: 1 << 26 }).toString(); } catch (e) { return null; } }
  const f = path.join(repoTop, rel); return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
}
function load(kind, id) {
  const src = readData(kind, id); if (!src) return null;
  const key = kind === 'circuit' ? 'PIN_CIRCUITS' : 'PIN_WIRING'; global[key] = {};
  vm.runInThisContext(src, { filename: kind + '-' + id + '.js' });
  return global[key][id];
}

/* ------------------------------------------------------------ 기하 도우미 */
const d2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function segPtDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
  let t = L ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L : 0; t = Math.max(0, Math.min(1, t));
  return Math.hypot(a[0] + t * dx - p[0], a[1] + t * dy - p[1]);
}
function segInter(a, b, c, d) {             // 두 선분의 교점(끝점 여부 포함) 또는 null
  const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]], den = r[0] * s[1] - r[1] * s[0];
  if (Math.abs(den) < 1e-9) return null;
  const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den, u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den, e = 1e-6;
  if (t < -e || t > 1 + e || u < -e || u > 1 + e) return null;
  return { x: a[0] + t * r[0], y: a[1] + t * r[1], endA: t < 0.02 || t > 0.98, endB: u < 0.02 || u > 0.98, t, u };
}
function segRectLen(a, b, R, pad) {         // 선분이 사각형(안쪽으로 pad 줄임) 안에 들어간 길이
  const x0 = R.x + pad, y0 = R.y + pad, x1 = R.x + R.w - pad, y1 = R.y + R.h - pad; if (x1 <= x0 || y1 <= y0) return 0;
  let t0 = 0, t1 = 1; const dx = b[0] - a[0], dy = b[1] - a[1];
  for (const [p, q] of [[-dx, a[0] - x0], [dx, x1 - a[0]], [-dy, a[1] - y0], [dy, y1 - a[1]]]) {
    if (Math.abs(p) < 1e-12) { if (q < 0) return 0; continue; }
    const r = q / p; if (p < 0) { if (r > t1) return 0; if (r > t0) t0 = r; } else { if (r < t0) return 0; if (r < t1) t1 = r; }
  }
  return Math.max(0, t1 - t0) * Math.hypot(dx, dy);
}
function segCircleLen(a, b, c, r) {         // 선분이 원 안에 들어간 길이
  const n = 200; let k = 0; for (let i = 0; i <= n; i++) { const p = [a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]; if (d2(p, c) < r) k++; }
  return k / (n + 1) * d2(a, b);
}
const rectOverlap = (A, B) => Math.max(0, Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x)) * Math.max(0, Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y));
const f1 = (v) => Math.round(v * 10) / 10;
const pt = (p) => '(' + f1(p[0]) + ',' + f1(p[1]) + ')';

/* ------------------------------------------------------------ 회로도 */
function checkCircuit(C) {
  const L = C.layout, items = PV.buildItems(C), out = [];
  const add = (level, kind, msg, box) => out.push({ part: '회로도', level, kind, msg, box });
  const itemName = (it) => it.tag + (it.title ? ' ' + it.title : '') + ' [' + it.id + ']';
  // 선: drawing 의 wire(꺾은선)·line(점선 제외). 이름은 drawing 번호
  const wires = [];
  (L.drawing || []).forEach((p, i) => {
    if (p.t === 'wire') wires.push({ id: 'drawing[' + i + ']', pts: p.pts });
    else if (p.t === 'line' && !p.dash) wires.push({ id: 'drawing[' + i + ']', pts: [[p.x1, p.y1], [p.x2, p.y2]] });
  });
  const dots = (L.drawing || []).filter((p) => p.t === 'dot').map((p) => [p.x, p.y]);
  // 단자 원: term 도형 + 접점 위·아래 + 가로 기구 양끝 + 차단기·접촉기 주접점
  const terms = [];
  (L.drawing || []).forEach((p) => {
    if (p.t === 'term') terms.push({ c: [p.x, p.y], who: '단자' });
    if (p.t === 'breaker' || p.t === 'mc') { terms.push({ c: [p.x, p.y1], who: p.t }); terms.push({ c: [p.x, p.y2], who: p.t }); }
  });
  // 몸통(원·네모)과 접점 막대
  const bodies = [], bars = [];
  items.forEach((it) => {
    if (it.cat === 'main' || it.cat === 'flsE') return;
    if (it.cat === 'coil' || it.cat === 'lamp') {
      if (it.shape === 'rect') bodies.push({ rect: { x: it.x - 22, y: L.coilY - 22, w: 44, h: 44 }, name: itemName(it) });
      else bodies.push({ c: [it.x, L.coilY], r: 24, name: itemName(it) });
      return;
    }
    if (it.horiz) {
      const ym = it.y + 6; bars.push({ a: [it.x1 - 6, ym], b: [it.x2 + 6, ym], name: itemName(it) });
      terms.push({ c: [it.x1, it.y], who: it.id }, { c: [it.x2, it.y], who: it.id });
      return;
    }
    if (it.rows) {
      const bx = it.kind === 'a' ? it.x + 10 : it.x - 5;
      bars.push({ a: [bx, it.yT - 8], b: [bx, it.yB + 8], name: itemName(it) });
      terms.push({ c: [it.x, it.yT], who: it.id }, { c: [it.x, it.yB], who: it.id });
    }
  });
  (L.drawing || []).forEach((p) => { if (p.t === 'motor') bodies.push({ c: [p.x, p.y], r: 24, name: '전동기 ' + (p.s || '') }); });
  // 입력 칸
  const slots = [];
  items.forEach((it) => (it.slots || []).forEach((s, k) => slots.push({ R: { x: s.x - 15, y: s.y - 10, w: 30, h: 20 }, c: [s.x, s.y], name: it.id + '.' + k })));

  // 원 관통 / 원 안 시작
  wires.forEach((w) => bodies.forEach((B) => {
    let inside = 0; for (let i = 1; i < w.pts.length; i++) inside += B.rect ? segRectLen(w.pts[i - 1], w.pts[i], B.rect, 1) : segCircleLen(w.pts[i - 1], w.pts[i], B.c, B.r - 1);
    if (inside < 1) return;
    const ends = [w.pts[0], w.pts[w.pts.length - 1]];
    const near = (p) => B.rect ? (p[0] >= B.rect.x - 1 && p[0] <= B.rect.x + B.rect.w + 1 && p[1] >= B.rect.y - 1 && p[1] <= B.rect.y + B.rect.h + 1) : d2(p, B.c) <= B.r + 1;
    const own = ends.some(near);
    const box = B.rect ? B.rect : { x: B.c[0] - B.r, y: B.c[1] - B.r, w: 2 * B.r, h: 2 * B.r };
    if (own) add('정보', '원 안 시작', w.id + ' 선이 ' + B.name + ' 원 안에서 시작해 ' + f1(inside) + 'px 가 원에 가려짐(설계대로면 문제없음)', box);
    else add('오류', '원 관통', w.id + ' 선이 ' + B.name + ' 원 속을 ' + f1(inside) + 'px 지나감 — 흰 바탕에 가려 두 기구가 이어진 것처럼 보임. 선: ' + w.pts.map(pt).join('→'), box);
  }));
  // 칸 관통(칸이 선 위에 놓이도록 설계한 칸은 제외)
  wires.forEach((w) => slots.forEach((S) => {
    let inside = 0, onLine = false;
    for (let i = 1; i < w.pts.length; i++) { inside += segRectLen(w.pts[i - 1], w.pts[i], S.R, 0.5); if (segPtDist(S.c, w.pts[i - 1], w.pts[i]) <= 1) onLine = true; }
    if (inside < 1 || onLine) return;
    add('경고', '칸 관통', w.id + ' 선이 입력 칸 ' + S.name + ' ' + pt(S.c) + ' 을 ' + f1(inside) + 'px 뚫고 지나감(칸의 흰 바탕에 선이 끊겨 보임)', S.R);
  }));
  // 단자 가림
  slots.forEach((S) => terms.forEach((T) => {
    const cx = Math.max(S.R.x, Math.min(T.c[0], S.R.x + S.R.w)), cy = Math.max(S.R.y, Math.min(T.c[1], S.R.y + S.R.h));
    if (Math.hypot(cx - T.c[0], cy - T.c[1]) < 4.2 - 0.3) add('오류', '단자 가림', '입력 칸 ' + S.name + ' ' + pt(S.c) + ' 이 단자 원 ' + pt(T.c) + ' 을 덮음', { x: Math.min(S.R.x, T.c[0] - 5), y: Math.min(S.R.y, T.c[1] - 5), w: 40, h: 30 });
  }));
  // 막대 교차
  wires.forEach((w) => bars.forEach((Bm) => {
    for (let i = 1; i < w.pts.length; i++) {
      const q = segInter(w.pts[i - 1], w.pts[i], Bm.a, Bm.b); if (!q || q.endA) continue;
      const dot = dots.some((d) => d2(d, [q.x, q.y]) < 1);
      add('오류', '막대 교차', w.id + ' 선이 ' + Bm.name + ' 접점 막대를 ' + pt([q.x, q.y]) + ' 에서 가로지름' + (dot ? '(접속점 있음)' : ''), { x: q.x - 20, y: q.y - 20, w: 40, h: 40 });
    }
  }));
  // 선끼리 점 없는 교차(정보)
  for (let a = 0; a < wires.length; a++) for (let b = a + 1; b < wires.length; b++) {
    const A = wires[a], B = wires[b];
    for (let i = 1; i < A.pts.length; i++) for (let j = 1; j < B.pts.length; j++) {
      const q = segInter(A.pts[i - 1], A.pts[i], B.pts[j - 1], B.pts[j]); if (!q || q.endA || q.endB) continue;
      if (dots.some((d) => d2(d, [q.x, q.y]) < 1)) continue;
      add('정보', '비접속 교차', A.id + ' × ' + B.id + ' 가 ' + pt([q.x, q.y]) + ' 에서 점 없이 교차(비접속 표시)', { x: q.x - 15, y: q.y - 15, w: 30, h: 30 });
    }
  }
  return out;
}

/* ------------------------------------------------------------ 배관도 */
function textBox(x, y, s, fs, anchor) {
  let w = 0; for (const ch of s) {
    const c = ch.codePointAt(0);
    w += (c >= 0xac00 && c <= 0xd7a3) || (c >= 0x2460 && c <= 0x24ff) || (c >= 0x3130 && c <= 0x318f) ? fs * 1.0 : ch === ' ' ? fs * 0.3 : '·()×.,-'.includes(ch) ? fs * 0.4 : /[A-Z0-9]/.test(ch) ? fs * 0.65 : fs * 0.55;
  }
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return { x: x0, y: y - fs * 0.8, w, h: fs };
}
function checkPiping(W) {
  const out = [], add = (level, kind, msg, box) => out.push({ part: '배관도', level, kind, msg, box });
  const P = W.piping, svg = PR.drawPiping(W, {});
  const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg).slice(1).map(Number);
  const num = (a, k) => { const m = new RegExp('\\s' + k + '="([^"]*)"').exec(a); return m ? m[1] : null; };
  const pipes = [], rects = [], circles = [], texts = [];
  const unesc = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  const pipeList = P.pipes || [], boxList = (P.boxes || []).filter((b) => b.kind !== 'jbox'), jList = (P.boxes || []).filter((b) => b.kind === 'jbox');
  let owner = null, inTerm = false, afterBadge = null, pIdx = 0, bIdx = 0, jIdx = 0, badgeIdx = 0, seenBg = false, seenCtl = false;
  const re = /<(polyline|rect|circle|text|g|\/g)\b([^>]*)>(?:([^<]*)<\/text>)?/g; let m;
  while ((m = re.exec(svg))) {
    const tag = m[1], a = m[2];
    if (tag === 'g') { if (/pr-term/.test(a)) inTerm = true; continue; }
    if (tag === '/g') { inTerm = false; continue; }
    if (tag === 'polyline') {
      const pts = num(a, 'points').trim().split(/\s+/).map((q) => q.split(',').map(Number));
      const p = pipeList[pIdx++]; pipes.push({ id: p ? p.id : '관?', pts, box: P.boxes && p ? (P.boxes.find((b) => p.pts.slice(-1)[0][0] === b.x) || {}).id : null }); continue;
    }
    if (tag === 'rect') {
      const R = { x: +num(a, 'x'), y: +num(a, 'y'), w: +num(a, 'width'), h: +num(a, 'height') };
      if (!seenBg) { seenBg = true; continue; }
      if (/stroke-width="2.2"/.test(a)) { seenCtl = true; owner = '제어함'; rects.push({ R, id: '제어함', ctl: true }); continue; }
      if (+num(a, 'height') === 10 && owner === '제어함') continue;           // 제어함 안 TB5·TB6 띠
      if (num(a, 'rx') != null) { const b = boxList[bIdx++]; owner = b ? b.id : '상자?'; rects.push({ R, id: owner, label: b ? (b.label || (b.devices && b.devices[0] && b.devices[0].label) || b.id) : '' }); continue; }
      continue;
    }
    if (tag === 'circle') {
      const c = [+num(a, 'cx'), +num(a, 'cy')], r = +num(a, 'r');
      if (r === 17) { const j = jList[jIdx++]; owner = 'J:' + (j ? j.id : ''); circles.push({ c, r, id: owner, j: true }); }
      else if (r === 9) { const p = pipeList[badgeIdx++]; afterBadge = { c, r, id: '관번호 ' + (p ? p.id : '?'), pipe: p ? p.id : null }; circles.push({ ...afterBadge, badge: true }); }
      continue;
    }
    if (tag === 'text') {
      const s = unesc(m[3] || ''); if (!s) continue;
      if (inTerm) continue;                                                   // 단자 원 안 핀 이름
      const fs = +num(a, 'font-size'), anchor = num(a, 'text-anchor') || 'start', x = +num(a, 'x'), y = +num(a, 'y');
      if (afterBadge) { afterBadge = null; continue; }                        // 관 번호 원 안 숫자(원으로 따진다)
      if (owner === 'J:' + (jList[jIdx - 1] || {}).id && s === 'J') continue;
      const legend = anchor === 'end' && x > vb[0] - 30;
      texts.push({ s, B: textBox(x, y, s, fs, anchor), owner: legend ? '범례' : owner });
    }
  }
  // 글자 대상: 상자 이름·기구 이름·제어함 글자·범례 + 관 번호 원
  const labels = texts.map((t) => ({ name: '글자 "' + t.s + '"', B: t.B, owner: t.owner }))
    .concat(circles.filter((c) => c.badge).map((c) => ({ name: c.id + ' 표시', B: { x: c.c[0] - c.r, y: c.c[1] - c.r, w: 2 * c.r, h: 2 * c.r }, owner: c.id, pipe: c.pipe, badge: true })));
  const shrink = (B, k) => ({ x: B.x + k, y: B.y + k, w: B.w - 2 * k, h: B.h - 2 * k });
  const HW = 2.25;                                                             // 관 선 두께의 반
  // 관이 상자를 뚫음
  pipes.forEach((p) => rects.forEach((r) => {
    let len = 0; for (let i = 1; i < p.pts.length; i++) len += segRectLen(p.pts[i - 1], p.pts[i], r.R, 1.5);
    if (len >= 1) add('오류', '상자 관통', '관 ' + p.id + ' 선이 ' + (r.ctl ? '제어함' : '상자 ' + r.id + (r.label ? '(' + r.label + ')' : '')) + ' 을 ' + f1(len) + 'px 뚫고 지나감. 관: ' + p.pts.map(pt).join('→'), r.R);
  }));
  // 상자끼리 겹침
  for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
    const o = rectOverlap(rects[i].R, rects[j].R); if (o > 1) add('경고', '상자 겹침', '상자 ' + rects[i].id + ' 과 ' + rects[j].id + ' 이 겹침(' + f1(o) + 'px²)', rects[i].R);
  }
  // 글자끼리 겹침
  for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
    const A = labels[i], B = labels[j];
    const o = rectOverlap(shrink(A.B, 0.5), shrink(B.B, 0.5)); if (o <= 1) continue;
    add('경고', '글자 겹침', A.name + ' 과 ' + B.name + ' 이 겹침(약 ' + f1(o) + 'px²)', { x: Math.min(A.B.x, B.B.x), y: Math.min(A.B.y, B.B.y), w: Math.max(A.B.x + A.B.w, B.B.x + B.B.w) - Math.min(A.B.x, B.B.x), h: Math.max(A.B.y + A.B.h, B.B.y + B.B.h) - Math.min(A.B.y, B.B.y) });
  }
  // 관 선이 글자를 지나감 / 관 번호가 다른 관 위
  pipes.forEach((p) => labels.forEach((t) => {
    if (t.badge && t.pipe === p.id) return;
    let len = 0; const R = { x: t.B.x - HW, y: t.B.y - HW, w: t.B.w + 2 * HW, h: t.B.h + 2 * HW };
    for (let i = 1; i < p.pts.length; i++) len += segRectLen(p.pts[i - 1], p.pts[i], R, t.badge ? 3 : 1);
    if (len < 1) return;
    if (t.badge) add('정보', '관번호 위치', t.name + ' 가 관 ' + p.id + ' 선 위에 놓임', t.B);
    else add('경고', '글자 가림', '관 ' + p.id + ' 선이 ' + t.name + ' 을 지나감(글자가 선에 가림)', t.B);
  }));
  // 글자가 다른 상자 위
  labels.forEach((t) => rects.forEach((r) => {
    if (t.owner === r.id || t.badge) return;
    const o = rectOverlap(shrink(t.B, 1), r.R); if (o > 1) add('경고', '글자 가림', t.name + ' 이 ' + (r.ctl ? '제어함' : '상자 ' + r.id) + ' 위에 놓임(약 ' + f1(o) + 'px²)', t.B);
  }));
  // (0052) 관끼리: 같은 선 위 겹침 / 나란히 붙어 감 / 교차
  const segsOf = (p) => p.pts.slice(1).map((q, i) => [p.pts[i], q]);
  const orient = (s) => Math.abs(s[0][1] - s[1][1]) < 0.5 ? 'h' : Math.abs(s[0][0] - s[1][0]) < 0.5 ? 'v' : 'd';
  const jCenters = circles.filter((c) => c.j).map((c) => c.c);
  const seen = {};
  for (let i = 0; i < pipes.length; i++) for (let j = i + 1; j < pipes.length; j++) {
    const A = pipes[i], B = pipes[j];
    segsOf(A).forEach((sa) => segsOf(B).forEach((sb) => {
      const oa = orient(sa), ob = orient(sb);
      if (oa === ob && oa !== 'd') {
        const k = oa === 'h' ? 0 : 1, gapv = Math.abs(sa[0][1 - k] - sb[0][1 - k]);
        const lo = Math.max(Math.min(sa[0][k], sa[1][k]), Math.min(sb[0][k], sb[1][k])), hi = Math.min(Math.max(sa[0][k], sa[1][k]), Math.max(sb[0][k], sb[1][k]));
        if (hi - lo <= 1) return;
        const box = oa === 'h' ? { x: lo, y: Math.min(sa[0][1], sb[0][1]) - 6, w: hi - lo, h: gapv + 12 } : { x: Math.min(sa[0][0], sb[0][0]) - 6, y: lo, w: gapv + 12, h: hi - lo };
        const key = A.id + B.id + oa + f1(lo) + f1(hi);
        if (seen[key]) return; seen[key] = 1;
        if (gapv < 0.5) add('오류', '관 겹침', '관 ' + A.id + ' 과 ' + B.id + ' 이 ' + (oa === 'h' ? 'y ' + f1(sa[0][1]) + ' 가로선' : 'x ' + f1(sa[0][0]) + ' 세로선') + ' 위를 ' + f1(hi - lo) + 'px 겹쳐 지나감(한 관처럼 보임)', box);
        else if (gapv < 10) add('경고', '관 붙어 감', '관 ' + A.id + ' 과 ' + B.id + ' 이 ' + f1(gapv) + 'px 간격으로 ' + f1(hi - lo) + 'px 나란히 붙어 감', box);
        return;
      }
      const q = segInter(sa[0], sa[1], sb[0], sb[1]); if (!q) return;
      if (q.endA && q.endB) return;                                            // 끝점끼리 만남(J 등)
      if (jCenters.some((c) => d2(c, [q.x, q.y]) < 18)) return;
      add('경고', '관 교차', '관 ' + A.id + ' 과 ' + B.id + ' 이 ' + pt([q.x, q.y]) + ' 에서 교차', { x: q.x - 12, y: q.y - 12, w: 24, h: 24 });
    }));
  }
  // (0052) 관 선이 제어함 가장자리를 따라 붙어 감
  const ctl = rects.find((r) => r.ctl);
  if (ctl) pipes.forEach((p) => segsOf(p).forEach((sg) => {
    const o = orient(sg); if (o === 'd') return;
    const edges = o === 'h' ? [ctl.R.y, ctl.R.y + ctl.R.h] : [ctl.R.x, ctl.R.x + ctl.R.w], k = o === 'h' ? 0 : 1, c = o === 'h' ? sg[0][1] : sg[0][0];
    const span = o === 'h' ? [ctl.R.x, ctl.R.x + ctl.R.w] : [ctl.R.y, ctl.R.y + ctl.R.h];
    const lo = Math.max(Math.min(sg[0][k], sg[1][k]), span[0]), hi = Math.min(Math.max(sg[0][k], sg[1][k]), span[1]);
    if (hi - lo > 10 && edges.some((e) => Math.abs(e - c) < 10)) add('경고', '관 붙어 감', '관 ' + p.id + ' 이 제어함 가장자리를 따라 ' + f1(hi - lo) + 'px 붙어 감', ctl.R);
  }));
  // (0052) 반대쪽 상자: 그룹의 단자대(TB5 위·TB6 아래)와 상자 위치
  if (ctl && W.terminalBlocks) {
    const cy = ctl.R.y + ctl.R.h / 2, place = {}; W.terminalBlocks.groups.forEach((g) => { place[g.box] = (W.terminalBlocks.strips[g.strip] || {}).place; });
    rects.filter((r) => !r.ctl && place[r.id]).forEach((r) => {
      const by = r.R.y + r.R.h / 2;
      if (place[r.id] === 'bottom' && by < cy) add('오류', '반대쪽 상자', '상자 ' + r.id + (r.label ? '(' + r.label + ')' : '') + ' 는 아래쪽 단자대(TB6) 그룹인데 제어함 위쪽 절반에 있음', r.R);
      if (place[r.id] === 'top' && by > cy) add('오류', '반대쪽 상자', '상자 ' + r.id + (r.label ? '(' + r.label + ')' : '') + ' 는 위쪽 단자대(TB5) 그룹인데 제어함 아래쪽 절반에 있음', r.R);
    });
  }
  return { issues: out, vb, svg };
}

/* ------------------------------------------------------------ 실행 */
const results = [];
for (const id of ids) {
  const C = load('circuit', id), W = load('wire', id), res = { id, circuit: [], piping: [], note: [] };
  if (!C) res.note.push('회로 데이터 없음'); else res.circuit = checkCircuit(C);
  if (!W) res.note.push('결선 데이터 없음(배관도 검사 생략)');
  else if (!W.piping || !W.piping.box) res.note.push('배관도 없음(승강기)');
  else { const pr = checkPiping(W); res.piping = pr.issues; res.pipingViewBox = pr.vb; }
  results.push(res);
}
const count = (list, lv) => list.filter((x) => x.level === lv).length;
if (opt.json) { console.log(JSON.stringify(results, null, 1)); }
else {
  for (const r of results) {
    const all = r.circuit.concat(r.piping);
    console.log('겹침 ' + r.id + (opt.rev ? ' @' + opt.rev : '') + ' — 회로도: 오류 ' + count(r.circuit, '오류') + ' · 경고 ' + count(r.circuit, '경고') + ' · 정보 ' + count(r.circuit, '정보') +
      ' / 배관도: ' + (r.note.some((n) => /배관도/.test(n)) ? '해당 없음' : '오류 ' + count(r.piping, '오류') + ' · 경고 ' + count(r.piping, '경고') + ' · 정보 ' + count(r.piping, '정보')));
    all.filter((x) => x.level !== '정보' || opt.info).forEach((x) => console.log('  [' + x.level + '·' + x.part + '·' + x.kind + '] ' + x.msg));
  }
  if (results.length > 1) {
    const tot = (lv) => results.reduce((n, r) => n + count(r.circuit.concat(r.piping), lv), 0);
    console.log('\n합계 ' + results.length + '개 회로 — 오류 ' + tot('오류') + ' · 경고 ' + tot('경고') + ' · 정보 ' + tot('정보'));
  }
}
process.exitCode = results.some((r) => count(r.circuit.concat(r.piping), '오류')) ? 1 : 0;   // exit() 는 긴 출력이 파이프에서 잘린다
