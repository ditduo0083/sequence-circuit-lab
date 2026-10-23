#!/usr/bin/env node
/*
 * 회로 데이터 검사기 (node용)
 *   node 검사/검사하기.cjs 001
 *   node 검사/검사하기.cjs ../회로/circuit-002.js
 * 브라우저에서 페이지를 열었을 때 나오는 것과 같은 검사를 명령줄에서 돌린다.
 * 오류가 있으면 종료코드 1.
 */
const path = require('node:path'), fs = require('node:fs');
const root = path.resolve(__dirname, '..');
global.window = global;
require(path.join(root, '공용/device-library.js'));
const V = require(path.join(root, '공용/pin-validate.js'));

const arg = process.argv[2];
if (!arg) { console.error('쓰는 법: node 검사/검사하기.cjs 001'); process.exit(2); }
const isFile = (f) => fs.existsSync(f) && fs.statSync(f).isFile();
const file = isFile(arg) ? arg : path.join(root, '회로', 'circuit-' + arg + '.js');
if (!isFile(file)) { console.error('회로 파일이 없습니다: ' + file); process.exit(2); }
require(path.resolve(file));

const id = /circuit-([^./\\]+)\.js$/.exec(file)[1];
const C = (global.PIN_CIRCUITS || {})[id] || Object.values(global.PIN_CIRCUITS || {})[0];
if (!C) { console.error('회로 데이터가 등록되지 않았습니다(window.PIN_CIRCUITS).'); process.exit(2); }

const r = V.validate(global.PIN_DEVICE_LIBRARY, C);
console.log('회로 ' + C.id + ' 검사 — 칸 ' + (r.items || []).reduce((n, it) => n + it.slots.length, 0) + '개, 항목 ' + (r.items || []).length + '개');
if (r.errors.length) { console.log('\n[오류 ' + r.errors.length + '건]'); r.errors.forEach((m, i) => console.log(' ' + (i + 1) + '. ' + m)); }
if (r.warnings.length) { console.log('\n[경고 ' + r.warnings.length + '건]'); r.warnings.forEach((m, i) => console.log(' ' + (i + 1) + '. ' + m)); }
if (!r.errors.length && !r.warnings.length) console.log('오류·경고 없음');
process.exit(r.errors.length ? 1 : 0);
