#!/usr/bin/env node
/*
 * 결선하기 '직접 연결해 보기'(요청 0062) 채점 시험. 흐름: 회로도에서 구간 고르기 → 배치도에서 잇기(선마다 바로 판정, judge)
 * 작성자 결정(2026-09-28): 채점은 연결점만 본다(선 종류 판정 없음). 빨강(단락)은 서로 다른 구간의 두 점을 이은 선뿐.
 *   node 검사/결선_실습시험.cjs            → 001·e01 사례 시험 (하나라도 틀리면 종료코드 1)
 *   node 검사/결선_실습시험.cjs --all      → 위 + 28개 회로 모두 '정답대로 이으면 전 구간 완성'인지 훑기(2단계 준비)
 * 채점은 공용/wire-practice.js 의 model·grade 를 그대로 쓴다(브라우저와 같은 코드).
 */
const path = require('node:path');
const root = path.resolve(__dirname, '..');
global.window = global;
['공용/device-library.js', '공용/pin-validate.js', '공용/diagram-render.js', '공용/panel-library.js', '공용/wire-validate.js', '공용/panel-render.js', '공용/wire-practice.js']
  .forEach((f) => require(path.join(root, f)));
const P = global.WIRE_PRACTICE, WM = global.WIRE_MODEL;
const libs = { Lib: global.PIN_DEVICE_LIBRARY, PV: global.PIN_VALIDATE, PL: global.PANEL_LIBRARY };

function load(id) {
  require(path.join(root, '회로/circuit-' + id + '.js'));
  require(path.join(root, '회로/wire-' + id + '.js'));
  const W = global.PIN_WIRING[id], C = global.PIN_CIRCUITS[id];
  const rep = WM.validate(W, C, libs);
  return { W, C, rep, M: P.model(W) };
}
// 점(칸) → 누를 단자 키: 나사가 둘인 단자대는 안쪽
const key = (M, p) => (M.terms[p] ? p : p + '@int');
// 정답과 다른 순서로 잇기: 구간의 제어판 안 점을 거꾸로 한 줄로 잇는다(한 단자 2가닥 이하, 선 색은 구간 종류)
function reorder(M, W) {
  const out = [];
  W.nets.forEach((n) => {
    const pts = M.need[n.id].slice().reverse();
    for (let i = 0; i + 1 < pts.length; i++) {
      const a = key(M, pts[i]), b = key(M, pts[i + 1]);
      out.push({ a, b, wire: n.wire, net: n.id });
    }
  });
  return out;
}
const firstPart = (M, W) => W.nets.find((n) => M.need[n.id].length >= 2 && M.base[n.id] > 1);

let fail = 0;
function expect(name, ok, detail) { console.log((ok ? '  ✔ ' : '  ✘ ') + name + (ok ? '' : '  ← ' + detail)); if (!ok) fail++; }

function cases(id) {
  const { W, rep, M } = load(id);
  console.log(`\n[${id}] 데이터 오류 ${rep.errors.length} · 구간 ${W.nets.length} · 주어진 선(제어판 밖) ${M.given.length} · 정답 선(제어판 안) ${M.answer.length}`);
  expect('모델: 정답 선의 단자가 모두 배치도에 있음', !M.problems.length, M.problems.join(' / '));
  const S = (edges, zone) => P.grade(M, edges, zone || null);
  // 1. 정답 그대로
  let g = S(M.answer);
  expect(`정답대로 모두 이으면 전 구간 완성 (${g.sum.done}/${g.sum.total}, 주의 ${g.sum.warn})`, g.sum.all, JSON.stringify(g.warnings).slice(0, 200));
  // 2. 다른 순서
  const alt = reorder(M, W);
  g = S(alt);
  expect(`순서를 바꿔 이어도 전 구간 완성 (${alt.length}가닥, ${g.sum.done}/${g.sum.total}, 주의 ${g.sum.warn})`, g.sum.all, JSON.stringify(g.warnings).slice(0, 300));
  // 3. 빈 판
  g = S([]);
  expect('아무것도 안 이으면 완성 0', g.sum.done === 0 && !g.sum.short, JSON.stringify(g.sum));
  // 4. 빠짐: 한 구간의 정답 선 하나를 뺌
  const n4 = firstPart(M, W), i4 = M.answer.findIndex((e) => e.net === n4.id);
  g = S(M.answer.filter((e, i) => i !== i4));
  expect(`빠짐: ${n4.id} 선 하나 뺌 → ${n4.id} 만 '덜 이음/아직', 빠진 연결 1`, ['part', 'none'].includes(g.nets[n4.id].status) && g.nets[n4.id].missing === 1 && g.sum.done === g.sum.total - 1, JSON.stringify(g.nets[n4.id]));
  // 5. 단락: 서로 다른 두 구간의 점을 이음
  const nets = W.nets.filter((n) => M.base[n.id] > 1), A = nets[0], B = nets[nets.length - 1];
  const sa = key(M, M.need[A.id][M.need[A.id].length - 1]), sb = key(M, M.need[B.id][M.need[B.id].length - 1]);
  g = S(M.answer.concat([{ a: sa, b: sb, wire: M.answer[0].wire }]));
  expect(`단락: ${A.id}–${B.id} 이음 → 두 구간 모두 단락, 그 선 표시`, g.nets[A.id].status === 'short' && g.nets[B.id].status === 'short' && g.nets[A.id].shortWith.includes(B.id) && g.bad[M.answer.length] === 'short' && g.sum.short === 2, JSON.stringify([g.nets[A.id], g.nets[B.id]]));
  // 6. 한 나사 3가닥: 정답 + 같은 구간 안에서 한 단자에 선 하나 더(첫 정답 선의 a 끝, 이미 2가닥인 곳을 찾음)
  const cnt = {}; M.answer.concat(M.given).forEach((e) => [e.a, e.b].forEach((k) => { cnt[k] = (cnt[k] || 0) + 1; }));
  const e6 = M.answer.find((e) => cnt[e.a] === 2 && M.need[e.net].length >= 2);
  const other6 = M.need[e6.net].map((p) => key(M, p)).find((k) => P.nodeOf(k) !== P.nodeOf(e6.a));
  g = S(M.answer.concat([{ a: e6.a, b: other6, wire: e6.wire }]));
  expect(`3가닥: ${e6.a} 에 한 가닥 더 → 한 나사 3가닥 주의, 구간은 여전히 완성`, g.warnings.some((w) => w.type === 'screw' && w.key === e6.a && w.count === 3) && !g.sum.short && g.sum.done === g.sum.total, JSON.stringify(g.warnings));
  // 7. 선 종류는 채점하지 않는다: 모든 선을 보조선으로 바꿔도 전 구간 완성, 주의 0
  const auxKey = Object.keys(M.types).find((k) => M.types[k].kind === 'aux');
  g = S(M.answer.map((e) => Object.assign({}, e, { wire: auxKey })));
  expect('선 종류는 보지 않음: 모든 선을 보조선으로 해도 전 구간 완성·주의 0', g.sum.all, JSON.stringify(g.sum));
  // 8. 바깥쪽 나사 · 쓰지 않는 단자
  const ext = Object.keys(M.terms).find((k) => /@ext$/.test(k) && M.netOf[P.nodeOf(k)]);
  if (ext) {
    const nn = M.netOf[P.nodeOf(ext)], o8 = M.need[nn].map((p) => key(M, p)).find((k) => P.nodeOf(k) !== P.nodeOf(ext));
    g = S([{ a: ext, b: o8, wire: M.answer[0].wire }]);
    expect(`바깥쪽 나사: ${ext} 에 제어판 안 선 → 바깥쪽 나사 주의`, g.warnings.some((w) => w.type === 'ext' && w.key === ext), JSON.stringify(g.warnings));
  }
  const unused = Object.keys(M.terms).find((k) => !M.netOf[P.nodeOf(k)] && !/@ext$/.test(k));
  if (unused) {
    g = S(M.answer.concat([{ a: M.answer[0].a, b: unused, wire: M.answer[0].wire }]));
    expect(`쓰지 않는 단자: ${unused} 에 선 → 주의, 그 선 표시`, g.warnings.some((w) => w.type === 'unused') && g.bad[M.answer.length] === 'unused', JSON.stringify(g.warnings));
  }
  // 10. 즉시 판정(judge): 연결점만 본다
  const J = (a, b) => P.judge(M, { a, b });
  const nA = W.nets.find((n) => M.answer.filter((e) => e.net === n.id).length >= 2), eA = M.answer.find((e) => e.net === nA.id);
  const nB = W.nets.find((n) => n.id !== nA.id && M.answer.some((e) => e.net === n.id)), eB = M.answer.find((e) => e.net === nB.id);
  expect(`즉시 판정: ${nA.id} 정답 선 → 통과`, J(eA.a, eA.b) === '');
  expect(`즉시 판정: ${nB.id} 점끼리(고른 구간이 ${nA.id} 여도) → 통과 = ${nB.id} 의 선으로 인정`, J(eB.a, eB.b) === '' && S([{ a: eB.a, b: eB.b, wire: eB.wire, net: nB.id }]).bad[0] === undefined);
  expect(`즉시 판정: ${nA.id} 점 – ${nB.id} 점 → 단락(short, 빨강)`, J(eA.a, eB.b) === 'short' && S([{ a: eA.a, b: eB.b, wire: eA.wire, net: nA.id }]).bad[0] === 'short');
  if (unused) expect('즉시 판정: 쓰지 않는 단자 → unused(주의)', J(eA.a, unused) === 'unused');
  if (ext) { const nn = M.netOf[P.nodeOf(ext)], o = M.need[nn].map((p) => key(M, p)).find((k) => P.nodeOf(k) !== P.nodeOf(ext));
    expect('즉시 판정: 바깥쪽 나사 → ext(주의)', J(ext, o) === 'ext' && S([{ a: ext, b: o, wire: M.answer[0].wire, net: nn }]).bad[0] === 'ext'); }
  // 11. 구간 하나를 한 가닥씩(순서대로·거꾸로) 이으면 마지막 가닥에서 바로 '완성'
  const big = W.nets.filter((n) => M.answer.filter((e) => e.net === n.id).length >= 3).sort((x, y) => M.need[y.id].length - M.need[x.id].length)[0];
  [false, true].forEach((rev) => {
    const list = M.answer.filter((e) => e.net === big.id).map((e) => Object.assign({}, e)); if (rev) list.reverse();
    const seq = list.map((e, i) => P.grade(M, list.slice(0, i + 1)).nets[big.id].status);
    expect(`한 가닥씩 ${rev ? '거꾸로 ' : ''}이음(${big.id}, ${list.length}가닥): 마지막에만 완성`, seq[seq.length - 1] === 'done' && seq.slice(0, -1).every((x) => x === 'part'), seq);
  });
  // 9. 구역 필터: 주회로 구간만 채점
  const mainIds = W.nets.filter((n) => WM.netZones(W, n).includes('main')).map((n) => n.id);
  const mainEdges = M.answer.filter((e) => mainIds.includes(e.net));
  g = S(mainEdges, mainIds);
  const gAll = S(mainEdges);
  expect(`구역 필터(주회로 ${mainIds.length}구간): 주회로 선만 이으면 그 구역은 전부 완성, 전체로 보면 미완성`, g.sum.all && Object.keys(g.nets).length === mainIds.length && !gAll.sum.all, JSON.stringify(g.sum) + ' / ' + JSON.stringify(gAll.sum));
}

cases('001');
cases('e01');

if (process.argv.includes('--all')) {
  console.log('\n[28개 훑기] 정답대로 / 순서 바꿔 이었을 때');
  const ids = [...Array(18)].map((_, i) => String(i + 1).padStart(3, '0')).concat([...Array(10)].map((_, i) => 'e' + String(i + 1).padStart(2, '0')));
  ids.forEach((id) => {
    let r;
    try { r = load(id); } catch (e) { console.log(`  ${id}: 불러오기 실패 ${e.message}`); fail++; return; }
    const { W, M, rep } = r, g = P.grade(M, M.answer, null), g2 = P.grade(M, reorder(M, W), null);
    const given = W.nets.filter((n) => M.base[n.id] <= 1).map((n) => n.id);
    const ok = !rep.errors.length && !M.problems.length && g.sum.all && g2.sum.all;
    if (!ok) fail++;
    console.log(`  ${ok ? '✔' : '✘'} ${id}: 구간 ${W.nets.length} (채점 ${g.sum.total}${given.length ? ', 밖에서 이어짐 ' + given.join('·') : ''}) · 제어판 안 선 ${M.answer.length} · 밖 선 ${M.given.length}` +
      (rep.errors.length ? ` · 데이터 오류 ${rep.errors.length}` : '') + (M.problems.length ? ' · ' + M.problems.join(' / ') : '') +
      (g.sum.all ? '' : ` · 정답 채점 ${JSON.stringify(g.sum)} ${JSON.stringify(g.warnings).slice(0, 160)}`) + (g2.sum.all ? '' : ` · 순서바꿈 ${JSON.stringify(g2.sum)} ${JSON.stringify(g2.warnings).slice(0, 160)}`));
    // 0109: 두 PB의 좌우를 독립적으로 바꾸되, 한 PB의 모든 선 끝에 같은 치환을 적용한다.
    if (M.contactPairs.length) {
      for (let mask = 0; mask < 2 ** M.contactPairs.length; mask++) {
        const map = {}; M.contactPairs.forEach(([a, b], i) => { if (mask & (1 << i)) { map[a] = b; map[b] = a; } });
        const swapped = M.answer.map(e => ({ ...e, a: map[e.a] || e.a, b: map[e.b] || e.b }));
        const grade = P.grade(M, swapped);
        expect(`${id} PB 좌우 조합 ${mask}: 전체 정답·즉시 판정 일치`, grade.sum.all && swapped.every(e => P.judge(M, e, swapped) === ''), JSON.stringify(grade.sum));
        for (const pair of M.contactPairs) {
          const bypass = swapped.concat([{ a: pair[0], b: pair[1] }]);
          expect(`${id} ${pair[0]} 접점 우회선은 단락`, P.grade(M, bypass).bad[swapped.length] === 'short' && !P.grade(M, bypass).sum.all);
        }
      }
      for (const pair of M.contactPairs) {
        const tag = WM.parseRef(pair[0]).tag, d = W.panel.devices[tag];
        const unused = `${id}/${tag}:${d.kind === 'b' ? 'NO-L' : 'NC-L'}`;
        const bad = M.answer.concat([{ a: unused, b: M.answer[0].a }]), grade = P.grade(M, bad);
        expect(`${id} ${unused}: 그림에 남고 연결하면 주황 주의`, !!M.terms[unused] && grade.bad[M.answer.length] === 'unused' && grade.sum.warn > 0 && !grade.sum.all);
        const incident = M.answer.filter(e => e.a === pair[0] || e.b === pair[0]);
        const mixed = M.answer.map(e => e === incident[0] ? { ...e, a: e.a === pair[0] ? pair[1] : e.a, b: e.b === pair[0] ? pair[1] : e.b } : e);
        expect(`${id} ${tag}: 한쪽 선만 반대로 바꾼 혼합 연결은 미완성`, !P.grade(M, mixed).sum.all);
      }
    } else expect(`${id} 외부 PB/SS는 given·대칭 판정 대상 아님`, !M.contactPairs.length);
  });
}
console.log(fail ? `\n실패 ${fail}건` : '\n모두 통과');
process.exit(fail ? 1 : 0);
