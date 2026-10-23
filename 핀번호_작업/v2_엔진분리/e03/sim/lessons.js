/* 승강기기능사 e03 · 단계별 설명·기기 안내 (요청 0025)
 * 설명 문장은 원본 7-5쪽 회로를 따라 새로 쓴 것이다. 공단 원문 문장은 쓰지 않았다.
 * 주의: 회로 데이터 synopsis 는 "정·역이 번갈아 반복된다"고 적었지만, 실제 회로는 T2 한시 b 가 T1 코일을 끊는 순간
 *       T1 순시 a(자기유지)도 열려 S 모선이 끊기므로 한 번씩 돌고 멈춘다(보고 0025). 이 앱은 회로대로 보여 준다.
 */
window.circuitId = 'e03';
window.circuitHints = {
  EOCR: 'EOCR ↔ 운전 모선 앞의 b접점과 YL 앞의 a접점. 과부하가 나면 b는 열려 운전을 끊고 a는 닫혀 YL을 켭니다.',
  PB0: 'PB0 ↔ 운전 모선의 b접점. 누르는 동안 열려 모든 운전 코일을 끊습니다.',
  PB1: 'PB1 ↔ 기동 a접점. 손을 떼면 T1 순시 a접점이 대신 전원을 이어 줍니다.',
  T1: 'T1 코일 ↔ 순시 a(자기유지), 한시 b(MC1 앞), 한시 a(MC2·T2 앞). T1 코일 앞에는 T2 한시 b접점이 있습니다.',
  T2: 'T2 코일 ↔ T1 코일 앞의 한시 b접점. T2 설정시간이 지나면 T1을 끊어 자기유지까지 풀어 버립니다.',
  MC1: 'MC1 코일 ↔ 주접점 3개(정회전), MC2 앞의 b접점(인터록), RL 앞의 a접점.',
  MC2: 'MC2 코일 ↔ 주접점 3개(L1·L3 교환, 역회전), MC1 앞의 b접점(인터록), GL 앞의 a접점.',
  M: '전동기 M ↔ MC1이 닫히면 정회전, MC2가 닫히면 역회전합니다.'
};
window.createCircuitLessons = function (model) {
  const fresh = () => { const m = new CircuitModel(); for (const k of CircuitModel.SETTINGS) m.set(k, model[k]); return m; };
  const item = (m, heading, title, description, focus = '') => ({ snapshot: m.snapshot(), heading, title, description, focus });
  const d1 = model.delay1, d2 = model.delay2, lessons = {};

  const a = fresh(), fwd = [];
  fwd.push(item(a, '전원 투입 전', 'MCCB를 넣기 전입니다.', '모든 코일과 전동기가 정지해 있습니다.'));
  a.set('power', true);
  fwd.push(item(a, '전원 ON · 기동 대기', '전원을 넣으면 EOCR에 전원이 들어갑니다.', 'EOCR b접점과 PB0 b접점을 지나 운전 모선까지 전원이 와 있습니다.', 'EOCR'));
  a.set('start', true);
  fwd.push(item(a, 'PB1 누름 · 정회전', 'PB1을 누르면 T2 한시 b접점을 거쳐 T1이, T1 한시 b·MC2 b접점을 거쳐 MC1이 여자됩니다.', '전동기가 정회전하고 RL이 켜집니다. T1이 정회전 시간을 셉니다.', 'MC1'));
  a.set('start', false);
  fwd.push(item(a, 'PB1 놓음 · 자기유지', 'T1 순시 a접점이 PB1 대신 S 모선을 살려 둡니다.', '이 자기유지가 T1 코일 상태에 달려 있다는 점을 기억해 두세요. 나중에 이것 때문에 회로가 멈춥니다.', 'T1'));
  a.tick(d1 / 2);
  fwd.push(item(a, 'T1 계시 중', `T1이 ${d1}초 가운데 ${d1 / 2}초를 셌습니다.`, 'MC1이 여자된 동안 MC1 b접점이 MC2 가지를 막고 있습니다(인터록).', 'T1'));
  lessons.forward = fwd;

  const b = fresh(), rev = []; b.set('power', true); b.set('start', true); b.set('start', false); b.tick(d1);
  rev.push(item(b, 'T1 완료 · 역회전', 'T1 한시 b접점이 열려 MC1이 떨어지고, 한시 a접점이 닫혀 T2와 MC2가 여자됩니다.', 'MC2 주접점이 L1·L3를 바꿔 넣어 전동기가 역회전하고 GL이 켜집니다. T2가 역회전 시간을 셉니다.', 'MC2'));
  b.tick(Math.max(0, d2 - 0.1));
  rev.push(item(b, 'T2 설정시간 직전', '역회전 중이고 T2가 곧 끝납니다.', 'T2 한시 b접점은 T1 코일 앞에 있습니다. 이 접점이 열리면 무슨 일이 생길까요?', 'T2'));
  b.tick(0.1);
  rev.push(item(b, 'T2 완료 · 전체 정지', 'T2 한시 b접점이 열려 T1이 소자되고, T1 순시 a접점(자기유지)도 열립니다.', 'PB1은 이미 떨어져 있으므로 S 모선 전체가 끊겨 MC2·T2까지 떨어지고 전동기가 멈춥니다. 정·역을 한 번씩 돌고 끝나는 회로입니다.', 'T1'));
  rev.push(item(b, '다시 기동하려면', 'T2 한시 b접점은 다시 닫혔지만 자기유지가 풀려 저절로 돌지 않습니다.', 'PB1을 다시 누르면 정회전부터 한 번 더 진행합니다. (PB1을 계속 누르고 있으면 끝날 때마다 다시 시작합니다 — 자유 조작에서 확인해 보세요.)', 'PB1'));
  lessons.reverse = rev;

  const e = fresh(), alarm = []; e.set('power', true); e.set('start', true); e.set('start', false); e.tick(d1 / 2);
  alarm.push(item(e, '정회전 중 · 과부하 전', '전동기가 정회전 중입니다.', '과부하가 생기면 운전 회로와 경보가 어떻게 바뀌는지 봅니다.', 'EOCR'));
  e.set('trip', true);
  alarm.push(item(e, 'EOCR 동작 · YL 점등', 'EOCR b접점이 열려 모든 운전 코일이 떨어지고, a접점이 닫혀 YL이 켜집니다.', 'YL은 과부하가 풀릴 때까지 켜져 있습니다.', 'EOCR'));
  e.set('stop', true);
  alarm.push(item(e, '트립 중 PB0', 'PB0를 눌러도 YL은 그대로 켜져 있습니다.', 'YL 가지는 EOCR a접점으로 H에서 바로 전원을 받기 때문입니다.', 'PB0'));
  e.set('stop', false); e.set('trip', false);
  alarm.push(item(e, 'RESET · 재기동 대기', 'EOCR을 복귀하면 YL이 꺼지고 운전 모선에 전원이 돌아옵니다.', 'PB1을 눌러야 다시 기동합니다.', 'EOCR'));
  lessons.alarm = alarm;
  return lessons;
};
window.circuitTimerText = (s, t) => {
  if (t.id === 'T1') return t.on ? (t.done ? '완료 · 역회전 중' : '계시 중 · 정회전') : s.run ? '대기 · PB1으로 기동' : '운전 전원 없음';
  return t.on ? (t.done ? '완료 · T1 끊음' : '계시 중 · 역회전') : '대기 · T1 완료 뒤 시작';
};
window.explainCircuitState = s => {
  if (!s.power) return ['전원 OFF · 승강기 03', 'MCCB가 꺼져 있습니다.', 'MCCB를 켠 뒤 PB1을 눌러 보세요.'];
  if (s.trip) return ['과부하 · 운전 차단', 'EOCR 동작 · YL이 켜져 있습니다.', 'RESET으로 복귀하세요.'];
  if (s.stop) return ['PB0 누름 · 정지', 'PB0 b접점이 열려 운전 모선이 끊겼습니다.', 'PB1을 다시 눌러야 기동합니다.'];
  if (s.mc2) return ['역회전 · T2 계시 중', 'T1 한시 a접점과 MC1 b접점을 거쳐 MC2가 여자되었습니다.', `T2가 ${s.delay2}초를 세면 T1을 끊어 전체가 멈춥니다.`];
  if (s.mc1) return ['정회전 · T1 계시 중', s.start ? 'PB1을 누르는 동안 T1·MC1이 여자됩니다.' : 'T1 순시 a접점이 자기유지하고 있습니다.', `T1이 ${s.delay1}초를 세면 역회전으로 바뀝니다.`];
  return ['전원 ON · 기동 대기', '운전 모선이 대기 중입니다.', 'PB1을 눌러 기동해 보세요. 정·역을 한 번씩 돌고 멈춥니다.'];
};
