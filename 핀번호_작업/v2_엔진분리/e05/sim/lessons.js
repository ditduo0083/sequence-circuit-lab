/* 승강기기능사 e05 · 단계별 설명·기기 안내 (요청 0025)
 * 설명 문장은 회로 데이터 synopsis의 동작 순서를 따라 새로 쓴 것이다. 공단 원문 문장은 쓰지 않았다.
 */
window.circuitId = 'e05';
window.circuitHints = {
  EOCR: 'EOCR ↔ 운전 모선 앞의 b접점과 YL 앞의 a접점.',
  PB0: 'PB0 ↔ 운전 모선의 b접점. 누르면 모든 운전 코일의 전원을 끊습니다.',
  PB1: 'PB1 ↔ 기동 a접점. 누르면 T1만 여자되고 전동기는 아직 돌지 않습니다.',
  T1: 'T1 코일 ↔ 순시 a(자기유지), 한시 a(T2 기동). T1 설정시간이 기동 지연 시간입니다.',
  T2: 'T2 코일 ↔ 순시 a(MC1 가지), 한시 b(MC1 가지), 한시 a(MC2 가지). 순시 a가 정회전을 시작하고, 한시 접점이 역회전으로 넘깁니다.',
  MC1: 'MC1 코일 ↔ 주접점 3개(정회전), MC2 앞의 b접점(인터록), RL 앞의 a접점.',
  MC2: 'MC2 코일 ↔ 주접점 3개(L1·L3 교환, 역회전), MC1 앞의 b접점(인터록), GL 앞의 a접점.',
  M: '전동기 M ↔ MC1이 닫히면 정회전, MC2가 닫히면 역회전합니다.'
};
window.createCircuitLessons = function (model) {
  const fresh = () => { const m = new CircuitModel(); for (const k of CircuitModel.SETTINGS) m.set(k, model[k]); return m; };
  const item = (m, heading, title, description, focus = '') => ({ snapshot: m.snapshot(), heading, title, description, focus });
  const d1 = model.delay1, d2 = model.delay2, lessons = {};

  const a = fresh(), first = [];
  first.push(item(a, '전원 투입 전', 'MCCB를 넣기 전입니다.', '모든 코일과 전동기가 정지해 있습니다.'));
  a.set('power', true);
  first.push(item(a, '전원 ON · 기동 대기', '전원을 넣으면 EOCR에 전원이 들어갑니다.', '운전 모선까지 전원이 와 있습니다.', 'EOCR'));
  a.set('start', true); a.set('start', false);
  first.push(item(a, 'PB1 · T1만 여자', 'PB1을 누르면 T1이 여자되고 T1 순시 a접점이 자기유지합니다.', '전동기는 아직 돌지 않습니다. MC1 가지의 T2 순시 a접점이 열려 있기 때문입니다. T1이 기동 지연 시간을 셉니다.', 'T1'));
  a.tick(d1);
  first.push(item(a, 'T1 완료 · 정회전', 'T1 한시 a접점이 닫혀 T2가 여자되고, T2 순시 a접점이 곧바로 닫힙니다.', 'T2 한시 b접점은 아직 닫혀 있으므로 MC2 b접점을 거쳐 MC1이 여자되어 정회전하고 RL이 켜집니다.', 'MC1'));
  a.tick(d2 / 2);
  first.push(item(a, 'T2 계시 중 · 정회전 유지', `T2가 ${d2}초 가운데 ${d2 / 2}초를 셌습니다.`, '정회전 시간은 T2 설정시간으로 정해집니다.', 'T2'));
  lessons.delay = first;

  const b = fresh(), rev = []; b.set('power', true); b.set('start', true); b.set('start', false); b.tick(d1); b.tick(Math.max(0, d2 - 0.1));
  rev.push(item(b, 'T2 설정시간 직전', '정회전이 곧 끝납니다.', 'T2 한시 b접점은 MC1 가지에, 한시 a접점은 MC2 가지에 있습니다.', 'T2'));
  b.tick(0.1);
  rev.push(item(b, 'T2 완료 · 역회전', 'T2 한시 b접점이 열려 MC1이 떨어지고, 한시 a접점이 닫혀 MC1 b접점을 거쳐 MC2가 여자됩니다.', '전동기가 역회전하고 GL이 켜집니다. MC2 b접점이 MC1 가지를 막습니다.', 'MC2'));
  b.set('stop', true);
  rev.push(item(b, 'PB0 누름 · 정지', '운전 모선이 끊겨 T1·T2·MC2가 복귀합니다.', '자기유지가 풀립니다.', 'PB0'));
  b.set('stop', false);
  rev.push(item(b, 'PB0 놓음 · 재기동 대기', 'PB1을 다시 누르면 기동 지연부터 다시 시작합니다.', '', 'PB1'));
  lessons.reverse = rev;

  const e = fresh(), alarm = []; e.set('power', true); e.set('start', true); e.set('start', false); e.tick(d1 + 1);
  alarm.push(item(e, '정회전 중 · 과부하 전', '전동기가 정회전 중입니다.', '과부하가 생기면 어떻게 바뀌는지 봅니다.', 'EOCR'));
  e.set('trip', true);
  alarm.push(item(e, 'EOCR 동작 · YL 점등', 'EOCR b접점이 열려 운전 코일이 모두 떨어지고, a접점이 닫혀 YL이 켜집니다.', '', 'EOCR'));
  e.set('trip', false);
  alarm.push(item(e, 'RESET · 재기동 대기', 'EOCR을 복귀하면 YL이 꺼지고 운전 모선에 전원이 돌아옵니다.', 'PB1을 눌러야 다시 기동합니다.', 'EOCR'));
  lessons.alarm = alarm;
  return lessons;
};
window.circuitTimerText = (s, t) => {
  if (t.id === 'T1') return t.on ? (t.done ? '완료 · T2 기동' : '계시 중 · 기동 지연') : s.run ? '대기 · PB1으로 시작' : '운전 전원 없음';
  return t.on ? (t.done ? '완료 · 역회전(MC2)' : '계시 중 · 정회전') : '대기 · T1 완료 뒤 시작';
};
window.explainCircuitState = s => {
  if (!s.power) return ['전원 OFF · 승강기 05', 'MCCB가 꺼져 있습니다.', 'MCCB를 켠 뒤 PB1을 눌러 보세요.'];
  if (s.trip) return ['과부하 · 운전 차단', 'EOCR 동작 · YL이 켜져 있습니다.', 'RESET으로 복귀하세요.'];
  if (s.stop) return ['PB0 누름 · 정지', 'PB0 b접점이 열려 운전 모선이 끊겼습니다.', 'PB1을 다시 눌러야 기동합니다.'];
  if (s.mc2) return ['역회전', 'T2 한시 a접점과 MC1 b접점을 거쳐 MC2가 여자되었습니다.', 'PB0를 누르면 정지합니다.'];
  if (s.mc1) return ['정회전 · T2 계시 중', 'T2 순시 a접점과 한시 b접점을 거쳐 MC1이 여자되었습니다.', `T2가 ${s.delay2}초를 세면 역회전으로 바뀝니다.`];
  if (s.timerOn1) return ['기동 지연 · T1 계시 중', 'T1만 여자되어 있고 전동기는 아직 멈춰 있습니다.', `T1이 ${s.delay1}초를 세면 정회전이 시작됩니다.`];
  return ['전원 ON · 기동 대기', '운전 모선이 대기 중입니다.', 'PB1을 눌러 보세요. 곧바로 돌지 않고 T1 시간만큼 기다립니다.'];
};
