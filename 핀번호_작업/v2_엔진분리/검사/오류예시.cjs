#!/usr/bin/env node
/*
 * 데이터 검사기가 무엇을 잡아내는지 보여 주는 시험.
 *   node 검사/오류예시.cjs
 * 001 데이터를 일부러 틀리게 고친 5가지를 만들어 검사기를 돌리고, 나오는 한글 메시지를 출력한다.
 */
const path = require('node:path');
const root = path.resolve(__dirname, '..');
global.window = global;
require(path.join(root, '공용/device-library.js'));
const V = require(path.join(root, '공용/pin-validate.js'));
require(path.join(root, '회로/circuit-001.js'));
const BASE = JSON.stringify(global.PIN_CIRCUITS['001']);
const load = () => JSON.parse(BASE);

const 사례 = [
  ['1. 없는 기구 태그를 쓴 경우', c => { c.layout.items.find(i => i.id === 'xNO').tag = 'X9'; }],
  ['2. 라이브러리에 없는 핀을 정답으로 적은 경우', c => { c.answerKey['coil-T'] = ['2', '9']; }],
  ['3. 정답표에 없는 칸이 있는 경우', c => { delete c.answerKey.frBZ; }],
  ['4. 같은 핀을 서로 다른 점(net)에 적은 경우', c => { c.answerKey.xNC = ['1', '4']; }],
  ['5. 코일 칸이 빠졌거나 접점 수가 기구보다 많은 경우', c => {
    c.layout.items = c.layout.items.filter(i => i.id !== 'coil-T');
    c.layout.order = c.layout.order.filter(id => id !== 'coil-T');
    delete c.answerKey['coil-T'];
    c.layout.items.push({ id: 'frExtra', cat: 'contact', tag: 'FR', kind: 'a', feat: 'fl', x: 1400, rows: [600, 640], nets: ['ALM', 'N'], label: 'FR', title: '없는 FR 접점' });
    c.layout.order.push('frExtra');
    c.answerKey.frExtra = ['8', '6'];
  }],
  ['6. a접점 자리에 b접점 번호를 적은 경우 (덤)', c => { c.answerKey.frYL = ['8', '5']; }]
];

let bad = 0;
for (const [이름, 고치기] of 사례) {
  const c = load(); 고치기(c);
  const r = V.validate(global.PIN_DEVICE_LIBRARY, c);
  console.log('\n=== ' + 이름);
  if (!r.errors.length && !r.warnings.length) { console.log('  (검사기가 잡지 못함)'); bad++; }
  r.errors.forEach(m => console.log('  [오류] ' + m));
  r.warnings.slice(0, 3).forEach(m => console.log('  [경고] ' + m));
}
const ok = V.validate(global.PIN_DEVICE_LIBRARY, load());
console.log('\n=== 0. 고치지 않은 001 데이터: 오류 ' + ok.errors.length + '건, 경고 ' + ok.warnings.length + '건');
ok.warnings.forEach(m => console.log('  [경고] ' + m));
process.exit(bad ? 1 : 0);
