#!/usr/bin/env node
/*
 * 결선 데이터 검사기 (node용, 요청 0028)
 *   node 검사/결선검사.cjs 001
 *   node 검사/결선검사.cjs e01 --표      (단자대 배치표와 구간 목록도 출력)
 * 결선하기·단자대 페이지를 열었을 때 나오는 것과 같은 검사(공용/wire-validate.js)를 명령줄에서 돌린다.
 * 회로 데이터 검사(검사하기.cjs)도 먼저 돌린다. 오류가 있으면 종료코드 1.
 * 요청 0030: 마지막에 자유 탐색(누를 수 있는 구간·구역)과 단자대 퀴즈(관 순서 정답·묶기 문제 수) 요약을 한 줄씩 낸다.
 */
const path = require('node:path'), fs = require('node:fs');
const root = path.resolve(__dirname, '..');
global.window = global;
require(path.join(root, '공용/device-library.js'));
const PV = require(path.join(root, '공용/pin-validate.js'));
const PL = require(path.join(root, '공용/panel-library.js'));
const WM = require(path.join(root, '공용/wire-validate.js'));

const id = process.argv[2], table = process.argv.includes('--표');
if (!id) { console.error('쓰는 법: node 검사/결선검사.cjs 001'); process.exit(2); }
const cf = path.join(root, '회로', 'circuit-' + id + '.js'), wf = path.join(root, '회로', 'wire-' + id + '.js');
for (const f of [cf, wf]) if (!fs.existsSync(f)) { console.error('파일이 없습니다: ' + f); process.exit(2); }
require(cf); require(wf);
const C = global.PIN_CIRCUITS[id], W = global.PIN_WIRING[id];
const Lib = global.PIN_DEVICE_LIBRARY;

const pv = PV.validate(Lib, C);
if (pv.errors.length) { console.log('[회로 데이터 오류] 먼저 검사하기.cjs 로 고치세요.'); pv.errors.forEach((m) => console.log(' - ' + m)); process.exit(1); }

const r = WM.validate(W, C, { Lib, PV, PL });
const i = r.info || {};
console.log('결선 ' + W.id + ' 검사 — 구간 ' + i.nets + '개, 점 ' + i.points + '개, 선 ' + i.wires + '가닥, 한 나사 최대 ' + i.maxPerScrew + '가닥, 회로도 강조 ' + i.highlighted + '구간');
if (r.errors.length) { console.log('\n[오류 ' + r.errors.length + '건]'); r.errors.forEach((m, k) => console.log(' ' + (k + 1) + '. ' + m)); }
if (r.warnings.length) { console.log('\n[경고 ' + r.warnings.length + '건]'); r.warnings.forEach((m, k) => console.log(' ' + (k + 1) + '. ' + m)); }
if (!r.errors.length && !r.warnings.length) console.log('오류·경고 없음');
// 요청 0030: 결선하기 자유 탐색·구역 나눠 보기, 단자대 퀴즈가 이 데이터로 만들어지는지 요약
if (!r.errors.length) {
  const zc = { main: 0, aux: 0, pe: 0 };
  for (const n of W.nets) for (const z of WM.netZones(W, n)) zc[z] = (zc[z] || 0) + 1;
  console.log('자유 탐색: 회로도에서 누를 수 있는 구간 ' + i.clickable + ' / ' + i.nets + ' · 구역 주회로 ' + zc.main + ' · 제어회로 ' + zc.aux + (zc.pe ? ' · 보호도체 ' + zc.pe : '') + ' (두 구역에 걸친 구간은 양쪽에 셈)');
  if (i.quiz) console.log('단자대 퀴즈: 관 순서 ' + Object.keys(i.quiz.order).map((s) => s + ' ' + i.quiz.order[s].join('')).join(' / ') + ' · 한 칸 묶기 문제 묶어도 됨 ' + i.quiz.yes + ' · 안 됨 ' + i.quiz.no);
}

if (table) {
  const libs = { Lib, PV, PL };
  if (i.tb) {
    console.log('\n[단자대 배치 — 공통 안 씀]');
    for (const s of Object.keys(W.terminalBlocks.strips)) {
      const n = W.terminalBlocks.strips[s].blocks.reduce((a, b) => a + b, 0), row = [];
      for (let k = 1; k <= n; k++) { const v = i.tb[W.id + '/' + s + ':' + k]; row.push(k + '=' + (v ? v.map((x) => x.split('/')[1]).join('+') : '·')); }
      console.log(' ' + s + ': ' + row.join('  '));
    }
  }
  console.log('\n[구간]');
  for (const n of W.nets) {
    const es = WM.expandNet(W, n);
    console.log(' ' + n.id.padEnd(5) + ' ' + n.label);
    console.log('       ' + es.map((e) => WM.describe(W, C, e.a, libs) + (e.aSide ? '(' + (e.aSide === 'ext' ? '바깥' : '안') + ')' : '') + ' ─' + (W.wireTypes[e.wire].color) + '─ ' + WM.describe(W, C, e.b, libs) + (e.bSide ? '(' + (e.bSide === 'ext' ? '바깥' : '안') + ')' : '')).join('\n       '));
  }
}
process.exit(r.errors.length ? 1 : 0);
