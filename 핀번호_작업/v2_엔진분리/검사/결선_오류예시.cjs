#!/usr/bin/env node
/*
 * 결선 검사기(wire-validate.js)가 무엇을 잡아내는지 보여 주는 시험 (요청 0028).
 *   node 검사/결선_오류예시.cjs
 * 001 결선 데이터를 일부러 틀리게 고친 사례마다 검사기를 돌려, 오류가 1건 이상 나오는지와 첫 메시지를 출력한다.
 * 하나라도 못 잡으면 종료코드 1.
 */
const path = require('node:path');
const root = path.resolve(__dirname, '..');
global.window = global;
require(path.join(root, '공용/device-library.js'));
const PV = require(path.join(root, '공용/pin-validate.js'));
const PL = require(path.join(root, '공용/panel-library.js'));
const WM = require(path.join(root, '공용/wire-validate.js'));
require(path.join(root, '회로/circuit-001.js'));
require(path.join(root, '회로/wire-001.js'));
const C = global.PIN_CIRCUITS['001'];
const BASE = JSON.stringify(global.PIN_WIRING['001']);
const net = (W, id) => W.nets.find((n) => n.id === id);

const 사례 = [
  ['핀을 잘못 적음(X 1 → X 3)', (W) => { net(W, 'R').chains[0][3] = '001/X:3'; }],
  ['점이 빠짐(MC2 4)', (W) => { net(W, 'R').chains[0].pop(); }],
  ['없는 단자(오타)', (W) => { net(W, 'H').chain[1] = '001/EOCR:66'; }],
  ['제어판 밖 기구끼리 바로 이음(단자대 안 거침)', (W) => { net(W, 'MS').chain = ['001/SS:M', '001/PB0:N']; }],
  ['한 단자에 3가닥', (W) => { const n = net(W, 'H'); delete n.chain; n.chains = [['001/F:3', '001/EOCR:6'], ['001/EOCR:6', '001/EOCR:10'], ['001/EOCR:6', '001/F:3']]; }],
  ['주회로를 보조선(황색)으로', (W) => { net(W, 'L1b').wire = 'aux'; }],
  ['퓨즈 2차를 주회로선으로', (W) => { net(W, 'H').wire = 'main-L1'; }],
  ['단자대 배치와 구간이 어긋남(칸 번호를 직접 잘못 적음)', (W) => { net(W, 'YLc').chain = ['001/FR:6', '001/TB6:2', '001/YL:1']; }],
  ['공통으로 묶을 수 없는 점을 묶음', (W) => { W.terminalBlocks.groups[0].common = [['001/PB0:N', '001/PB1:N'], '001/PB0:C', '001/PB1:O']; }],
  ['회로도 net 두 개를 한 구간에(합선)', (W) => { net(W, 'Tc').chain = ['001/X:5', '001/T:2', '001/T:6', '001/MC2:6']; W.nets = W.nets.filter((n) => n.id !== 'M2c'); }],
  ['체인이 끊김', (W) => { const n = net(W, 'CM'); delete n.chain; n.chains = [['001/PB1:O', '001/TB@PB1:O', '001/T:3'], ['001/X:8', '001/X:3', '001/MC1:6'], ['001/T:8', '001/X:8']]; }],
  ['주회로 상 색이 섞임', (W) => { net(W, 'L1a').chain = ['001/MCCB:7', '001/EOCR:1']; net(W, 'L1a').chains = [{ pts: ['001/EOCR:1', '001/F:1'], wire: 'main-L3' }]; }],
  ['접지가 E3 칸을 거쳐 지나감(E3 칸 3가닥)', (W) => { net(W, 'PE').chains = [['001/TB1:PE', '001/TB@TB1:PE', '001/TB@TB3:PE', '001/TB3:PE'], ['001/TB@TB3:PE', '001/TB@TB4:E3', '001/TB@TB2:PE', '001/TB2:PE'], { pts: ['001/FLS:1', '001/TB@TB4:E3', '001/TB4:E3'], wire: 'aux' }]; }],
  ['셀렉터 N을 다른 상자와 바로 이음', (W) => { net(W, 'R').chains[1] = ['001/TB@SS:SS#ssA', '001/SS:SS#ssA', '001/PB0:N']; }],
  ['단자대 그룹 순서가 배관도 순서와 다름(ⓐⓑ 바꿈)', (W) => { const g = W.terminalBlocks.groups; [g[0], g[1]] = [g[1], g[0]]; }],
  ['회로도 좌표가 다른 구간 선에 닿음(circuitPoints)', (W) => { W.circuitPoints['001/TB4:E1'] = [815, 745]; }]
];

let miss = 0;
for (const [이름, 고치기] of 사례) {
  const W = JSON.parse(BASE); 고치기(W);
  const r = WM.validate(W, C, { Lib: global.PIN_DEVICE_LIBRARY, PV, PL });
  console.log((r.errors.length ? '잡음 ' : '못 잡음 ') + 이름 + ' → 오류 ' + r.errors.length + '건');
  if (r.errors.length) console.log('   ' + r.errors[0]); else miss++;
}
const ok = WM.validate(JSON.parse(BASE), C, { Lib: global.PIN_DEVICE_LIBRARY, PV, PL });
console.log('\n원래 데이터: 오류 ' + ok.errors.length + '건, 경고 ' + ok.warnings.length + '건');
// 자리 방식을 바꿔도(관 위치 → 기구 순서대로 한두 칸 띄움) 구간 데이터는 그대로 통과해야 한다
for (const gap of [1, 2]) {
  const W = JSON.parse(BASE); W.terminalBlocks.layout = 'pack'; W.terminalBlocks.gap = gap;
  const r = WM.validate(W, C, { Lib: global.PIN_DEVICE_LIBRARY, PV, PL });
  console.log('자리 방식 pack·gap ' + gap + ': 오류 ' + r.errors.length + '건' + (r.errors.length ? ' — ' + r.errors[0] : ''));
  if (gap === 1 && r.errors.length) miss++;   // 001 은 두 칸씩 띄우면 TB5 가 21칸이 되어 넘친다(검사기가 알려 주는 것이 맞음)
}
process.exit(miss || ok.errors.length ? 1 : 0);
