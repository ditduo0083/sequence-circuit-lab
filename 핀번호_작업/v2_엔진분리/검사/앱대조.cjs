#!/usr/bin/env node
/*
 * 핀번호 데이터 ↔ 회로 앱(circuit-diagram.js) 자동 대조 (2026-09-21)
 *   node 검사/앱대조.cjs 001 "<회로 앱 폴더>/circuit-diagram.js"
 *
 * 무엇을 대조하나
 *   1) 접점 목록: 앱의 this.contact(id, 기구, …) 와 핀번호 데이터의 접점 항목이 id·기구까지 같은지
 *   2) 접점 종류: 앱의 kind('a','b','순시 a','한시 a' 등)와 핀번호 데이터의 kind·timing 이 같은지
 *   3) 코일·부하: 앱의 load 와 핀번호 데이터의 coil·lamp 항목이 같은지
 *   4) 전기적 점(net): 앱 배선(wire)으로 이어진 단자끼리 묶은 그룹과, 핀번호 데이터의 net 묶음이 같은 모양인지
 *      (이름은 달라도 된다. 어느 단자끼리 한 점인지가 같으면 통과)
 *   5) 사람이 눈으로 볼 목록: 자동으로 확인할 수 없는 것(핀 번호 자체, 주회로, 전극, 글자 기구, 칸 위치)
 *
 * Playwright(크로미움)로 앱의 circuit-diagram.js 를 빈 SVG에 한 번 그려서 접점·배선 정보를 읽는다.
 * 앱 파일은 읽기만 하고 고치지 않는다.
 */
const path = require('node:path'), fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const id = process.argv[2], appFile = process.argv[3];
if (!id || !appFile) { console.error('쓰는 법: node 검사/앱대조.cjs 001 "<앱 폴더>/circuit-diagram.js"'); process.exit(2); }

global.window = global;
require(path.join(root, '공용/device-library.js'));
const V = require(path.join(root, '공용/pin-validate.js'));
require(path.join(root, '회로', 'circuit-' + id + '.js'));
const C = global.PIN_CIRCUITS[id];
const items = V.buildItems(C);

(async () => {
  const browser = await chromium.launch({ ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}), headless: true });
  const page = await browser.newPage();
  await page.setContent('<svg id="s" viewBox="0 0 1600 800"></svg>');
  await page.addScriptTag({ content: fs.readFileSync(appFile, 'utf-8') });
  const app = await page.evaluate(() => {
    const d = new window.CircuitDiagram(document.getElementById('s'));
    const wires = d.edges.filter(e => e.type === 'wire').map(e => [e.a, e.b]);
    const contacts = d.edges.filter(e => e.type === 'contact').map(e => ({ id: e.id, device: e.device, kind: e.kind, a: e.a, b: e.b }));
    const loads = d.loads.map(l => ({ id: l.id, positive: l.positive, negative: l.negative }));
    return { wires, contacts, loads };
  });
  await browser.close();

  // 앱 배선으로 전기적 점 묶기
  const parent = {};
  const find = x => (parent[x] === undefined ? (parent[x] = x) : (parent[x] === x ? x : (parent[x] = find(parent[x]))));
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; };
  app.wires.forEach(([a, b]) => union(a, b));

  const out = { 접점: [], 코일: [], net: [], 사람확인: [], 알고있음: [] };
  const appById = {}; app.contacts.forEach(c => appById[c.id] = c);
  const appLoad = {}; app.loads.forEach(l => appLoad[l.id] = l);
  const pinContacts = items.filter(i => i.cat === 'contact' || i.cat === 'pb' || i.cat === 'ss');
  const pinCoils = items.filter(i => i.cat === 'coil' || i.cat === 'lamp');

  // 1·2 접점
  pinContacts.forEach(it => {
    const a = appById[it.appId || it.id];
    if (!a) { out.접점.push(['없음', it.id + ': 회로 앱에 같은 id의 접점이 없습니다. (앱 id를 appId 로 적어 주세요)']); return; }
    if (a.device !== it.tag) out.접점.push(['다름', it.id + ': 기구가 앱은 ' + a.device + ', 핀번호 데이터는 ' + it.tag]);
    const want = (it.timing === 'delay' ? '한시 ' : it.timing === 'instant' ? '순시 ' : '') + it.kind;
    if (a.kind !== want) {
      // appKind: 앱과 다르다는 것을 알고 받아들인 경우(결정 기록이 있는 것만). 문제로 세지 않고 따로 알린다
      if (it.appKind === a.kind) out.알고있음.push(it.id + ': 앱은 "' + a.kind + '", 핀번호 데이터는 "' + want + '" (알고 있는 차이 — ' + (it.appKindNote || '결정 기록 참고') + ')');
      else out.접점.push(['다름', it.id + ': 접점 종류가 앱은 "' + a.kind + '", 핀번호 데이터는 "' + want + '"']);
    }
  });
  Object.keys(appById).forEach(k => { if (!pinContacts.some(it => (it.appId || it.id) === k)) out.접점.push(['빠짐', k + '(' + appById[k].device + '): 앱에는 있는데 핀번호 데이터에 칸이 없습니다.']); });

  // 3 코일
  pinCoils.forEach(it => {
    const l = appLoad[it.appId || it.id.replace(/^coil-/, '')];
    if (!l) out.코일.push(['없음', it.id + ': 회로 앱에 같은 이름의 코일·부하가 없습니다.']);
  });
  Object.keys(appLoad).forEach(k => { if (!pinCoils.some(it => (it.appId || it.id.replace(/^coil-/, '')) === k)) out.코일.push(['빠짐', k + ': 앱에는 있는데 핀번호 데이터에 코일·부하 칸이 없습니다.']); });

  // 4 net 묶음 비교
  const pairs = [];   // [앱 노드, 핀번호 net]
  pinContacts.forEach(it => {
    const a = appById[it.appId || it.id]; if (!a) return;
    pairs.push([a.a, it.slots[0].net], [a.b, it.slots[1].net]);
  });
  pinCoils.forEach(it => {
    const l = appLoad[it.appId || it.id.replace(/^coil-/, '')]; if (!l) return;
    pairs.push([l.positive, it.slots[0].net], [l.negative, it.slots[1].net]);
  });
  const appToPin = {}, pinToApp = {};
  pairs.forEach(([node, net]) => {
    if (!net) return;
    const g = find(node);
    if (appToPin[g] && appToPin[g] !== net) out.net.push(['다름', '앱에서 한 점인 단자들이 핀번호 데이터에서는 다른 net(' + appToPin[g] + ' / ' + net + ')로 되어 있습니다.']);
    appToPin[g] = appToPin[g] || net;
    if (pinToApp[net] && pinToApp[net] !== g) out.net.push(['다름', 'net "' + net + '" 에 앱에서 서로 떨어진 단자가 함께 묶여 있습니다.']);
    pinToApp[net] = pinToApp[net] || g;
  });

  // 5 사람이 눈으로 볼 목록
  out.사람확인.push('핀 번호 자체(예: 8–6 인지 8–5 인지)는 앱에 없는 정보입니다. 기구 라이브러리와 검증표로 확인하세요.');
  out.사람확인.push('주회로(MCCB·EOCR·MC 1 2 3 / 7 8 9)는 앱 회로 모델에 노드가 없어 대조하지 못합니다.');
  out.사람확인.push('FLS 전극(E1·E2·E3)과 TB4 순서는 유의사항 문서로 확인하세요.');
  const plain = items.filter(i => i.cat === 'pb' || i.cat === 'ss' || i.cat === 'lamp').map(i => i.id);
  out.사람확인.push('번호가 없는 기구(' + plain.join(', ') + ')는 글자(N·C·O·SS·A·M·1·2) 규칙이라 앱과 대조할 수 없습니다.');
  out.사람확인.push('칸 위치와 회로도 그림이 실제 도면과 맞는지는 화면으로 확인하세요.');

  const 문제 = out.접점.length + out.코일.length + out.net.length;
  console.log('회로 ' + id + ' ↔ 앱 대조');
  console.log(' 앱 접점 ' + app.contacts.length + '개 · 부하 ' + app.loads.length + '개 · 배선 ' + app.wires.length + '개');
  console.log(' 핀번호 접점 ' + pinContacts.length + '개 · 코일/부하 ' + pinCoils.length + '개');
  ['접점', '코일', 'net'].forEach(k => {
    console.log('\n[' + k + '] ' + (out[k].length ? out[k].length + '건' : '차이 없음'));
    out[k].forEach(([t, m]) => console.log('  (' + t + ') ' + m));
  });
  if (out.알고있음.length) { console.log('\n[알고 있는 차이] ' + out.알고있음.length + '건 (문제로 세지 않음)'); out.알고있음.forEach(m => console.log('  - ' + m)); }
  console.log('\n[사람이 눈으로 볼 목록]');
  out.사람확인.forEach(m => console.log('  - ' + m));
  process.exit(문제 ? 1 : 0);
})();
