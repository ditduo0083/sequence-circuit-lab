#!/usr/bin/env node
/*
 * 회로 앱에서 핀번호 데이터 초안 뽑기 (2026-09-21)
 *   node 검사/앱에서_초안뽑기.cjs 002 "<앱 폴더>/circuit-diagram.js" > 회로/circuit-002.초안.js
 *
 * 앱의 circuit-diagram.js 에서 접점 id·기구·종류(a/b, 순시/한시)와 배선으로 이어진 점(net)을 읽어
 * 핀번호 데이터의 devices·items·order·answerKey 초안을 만든다.
 *   - net 이름은 앱 노드 이름에서 따온다(n_<대표노드>). 그대로 써도 되고 알아보기 쉽게 바꿔도 된다.
 *   - 좌표(x, rows)는 0으로 둔다. 회로도를 보고 사람이 채운다.
 *   - 정답표는 선생님 규칙으로 자동 제안한다. 릴레이처럼 조가 둘인 기구는 나온 순서대로 1조→2조.
 *     자동 제안한 칸은 '// 확인' 주석을 달아 둔다. 반드시 검증표와 대조한다.
 *   - 주회로(main)·FLS 전극·번호 없는 기구(푸시버튼·셀렉터·램프·부저)는 앱에 정보가 없어 빈칸으로 둔다.
 *   - 리밋스위치(LS1·LS2)는 ls-2p 로 잡고 정답 [1, 2] 를 넣는다(작성자 결정 2026-09-21).
 */
const path = require('node:path'), fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
global.window = global;
require(path.join(root, '공용/device-library.js'));
const Lib = global.PIN_DEVICE_LIBRARY;

const id = process.argv[2], appFile = process.argv[3];
if (!id || !appFile) { console.error('쓰는 법: node 검사/앱에서_초안뽑기.cjs 002 "<앱 폴더>/circuit-diagram.js"'); process.exit(2); }

const TYPE_BY_TAG = t => /^MC\d?$/.test(t) ? 'mc-12p' : /^EOCR$/.test(t) ? 'eocr-12p' : /^T\d?$/.test(t) ? 'timer-8p'
  : /^FR\d?$/.test(t) ? 'flicker-8p' : /^X\d?$/.test(t) ? 'relay-8p' : /^FLS$/.test(t) ? 'fls-8p' : /^LS\d?$/.test(t) ? 'ls-2p' : null;
const PLAIN_CAT = t => /^PB\d?$/.test(t) ? 'pb' : /^SS\d?$/.test(t) ? 'ss' : /^(YL|GL|RL|WL|BZ)$/.test(t) ? 'lamp' : null;

(async () => {
  const browser = await chromium.launch({ ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}), headless: true });
  const page = await browser.newPage();
  await page.setContent('<svg id="s" viewBox="0 0 1600 800"></svg>');
  await page.addScriptTag({ content: fs.readFileSync(appFile, 'utf-8') });
  const app = await page.evaluate(() => {
    const d = new window.CircuitDiagram(document.getElementById('s'));
    return {
      wires: d.edges.filter(e => e.type === 'wire').map(e => [e.a, e.b]),
      contacts: d.edges.filter(e => e.type === 'contact').map(e => ({ id: e.id, device: e.device, kind: e.kind, a: e.a, b: e.b, x: e.x1, y1: e.y1, y2: e.y2, horizontal: e.horizontal })),
      loads: d.loads.map(l => ({ id: l.id, positive: l.positive, negative: l.negative }))
    };
  });
  await browser.close();

  const parent = {};
  const find = x => (parent[x] === undefined ? (parent[x] = x) : (parent[x] === x ? x : (parent[x] = find(parent[x]))));
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; };
  app.wires.forEach(([a, b]) => union(a, b));
  const net = n => 'n_' + find(n);

  const tags = {};
  app.contacts.forEach(c => tags[c.device] = 1); app.loads.forEach(l => tags[l.id] = 1);
  const devices = {};
  Object.keys(tags).sort().forEach(t => {
    const ty = TYPE_BY_TAG(t), cat = PLAIN_CAT(t);
    devices[t] = ty ? { type: ty } : { type: null, cat: cat || '확인필요' };
  });

  // 정답표 자동 제안
  const used = {};
  function suggest(tag, kind, timing) {
    const ty = devices[tag] && devices[tag].type, t = ty && Lib.types[ty];
    if (!t) return null;
    const cands = t.contacts.filter(c => c.kind === kind && (!timing || c.timing === timing));
    if (!cands.length) return null;
    used[tag] = used[tag] || {};
    // 이미 쓴 공통단자를 우선 재사용하지 않고, 나온 순서대로 다른 조를 쓴다(선생님 방식: 1 → 8)
    const free = cands.find(c => !used[tag][c.common || c.pins[0]]);
    const c = free || cands[0];
    const common = c.common || c.pins[0];
    used[tag][common] = 1;
    const top = ty === 'eocr-12p' && common === '11' ? '10' : common;
    const other = c.pins.find(p => p !== common) || c.pins[1];
    return [top, other];
  }

  const items = [], order = [], key = {};
  app.contacts.forEach(c => {
    const timing = /한시/.test(c.kind) ? 'delay' : /순시/.test(c.kind) ? 'instant' : undefined;
    const kind = /b/.test(c.kind.replace(/[^ab]/g, '')) ? 'b' : 'a';
    const ty = devices[c.device].type;
    const cat = PLAIN_CAT(c.device) === 'pb' ? 'pb' : PLAIN_CAT(c.device) === 'ss' ? 'ss' : 'contact';
    const feat = ty === 'ls-2p' ? 'ls' : ty === 'eocr-12p' ? 'ovl' : ty === 'flicker-8p' ? 'fl' : timing === 'delay' ? 'td' : cat === 'pb' ? 'pb' : cat === 'ss' ? 'ss' : '';
    const it = { id: c.id, cat, tag: c.device, kind, feat, x: 0, rows: [0, 0], nets: [net(c.a), net(c.b)], label: c.device, title: c.device + ' 접점 (' + c.kind + ')' };
    if (timing) it.timing = timing;
    if (cat === 'ss') it.sub = /A/.test(c.id) ? 'A' : 'M';
    items.push(it); order.push(c.id);
    key[c.id] = cat === 'pb' ? (kind === 'b' ? ['N', 'C'] : ['N', 'O']) : cat === 'ss' ? ['SS', it.sub] : (suggest(c.device, kind, timing) || ['?', '?']);
  });
  app.loads.forEach(l => {
    const ty = devices[l.id] && devices[l.id].type, cat = PLAIN_CAT(l.id) === 'lamp' ? 'lamp' : 'coil';
    const it = { id: 'coil-' + l.id, cat, tag: l.id, x: 0, nets: [net(l.positive), net(l.negative)], title: l.id + (cat === 'lamp' ? ' 램프·부저' : ' 코일') };
    items.push(it); order.push(it.id);
    key[it.id] = cat === 'lamp' ? ['1', '2'] : (ty && Lib.types[ty] ? Lib.types[ty].coil.pins.slice() : ['?', '?']);
  });

  const j = o => JSON.stringify(o);
  const lines = [];
  lines.push('/* 자동 생성 초안 — 회로 ' + id + ' (앱 circuit-diagram.js 에서 뽑음, ' + new Date().toISOString().slice(0, 10) + ')');
  lines.push(' * 할 일: 1) x·rows 좌표 채우기  2) drawing(회로도 그림) 그리기  3) 정답표 확인  4) 주회로·FLS 전극·번호 없는 기구 추가');
  lines.push(' * 정답표는 자동 제안이다. 반드시 pin-verification-table.md 와 대조한다. */');
  lines.push("(function (root) {");
  lines.push("  var C = root.PIN_CIRCUITS = root.PIN_CIRCUITS || {};");
  lines.push("  C['" + id + "'] = {");
  lines.push("    id: '" + id + "', title: '전기기능사 " + id + " · 핀번호 적기',");
  lines.push('    devices: ' + j(devices) + ',');
  lines.push('    answerKey: {');
  Object.keys(key).forEach(k => lines.push('      ' + JSON.stringify(k) + ': ' + j(key[k]) + (/\?/.test(j(key[k])) ? ',   // 확인 필요' : ',   // 확인')));
  lines.push('      // main-*, fls-E 는 직접 적는다');
  lines.push('    },');
  lines.push("    rules: { contactReversed: 'warn', coilReversed: 'warn', sharedCommon: 'ok', eocr11: 'warn', pushbuttonDigits: 'warn', mccbOptional: true, scoreModes: { half: { ok: 1, warn: 0.5, bad: 0 }, markOnly: { ok: 1, warn: 1, bad: 0 } } },");
  lines.push('    layout: {');
  lines.push('      viewBox: [1500, 810], coilY: 590,');
  lines.push('      main: [],   // { tag, xs: [x,x,x], slotY: [위, 아래], optional }');
  lines.push('      items: [');
  items.forEach(it => lines.push('        ' + j(it) + ','));
  lines.push('      ],');
  lines.push('      order: ' + j(order) + ',');
  lines.push('      drawing: []   // rect·line·wire·items … 회로도 그림');
  lines.push('    }');
  lines.push('  };');
  lines.push("})(typeof window === 'undefined' ? globalThis : window);");
  console.log(lines.join('\n'));
})();
