/* 승강기기능사 e04 · 단계별 설명·기기 안내 (요청 0025)
 * 설명 문장은 회로 데이터 synopsis의 동작 순서와 원본 7-5쪽을 따라 새로 쓴 것이다. 공단 원문 문장은 쓰지 않았다.
 */
window.circuitId = 'e04';
window.circuitHints = {
  EOCR: 'EOCR ↔ 운전 모선 앞의 b접점과 YL 앞의 a접점.',
  PB0: 'PB0 ↔ 운전 모선의 b접점. 누르면 T1·T2·MC1·MC2의 전원을 모두 끊습니다.',
  PB1: 'PB1 ↔ 기동 a접점. 손을 떼면 T1 순시 a접점이 대신 전원을 이어 줍니다.',
  T1: 'T1 코일 ↔ 순시 a(자기유지), 한시 a(T2 기동). T1 코일은 T2 한시 b접점 뒤에서 전원을 받습니다.',
  T2: 'T2 코일 ↔ 순시 a(T2 자기유지), 한시 b(MC1·T1 앞). T2 설정시간이 지나면 정회전 쪽을 끊습니다.',
  MC1: 'MC1 코일 ↔ 주접점 3개(정회전), MC2 앞의 b접점(인터록), GL 앞의 a접점. 이 회로는 정회전 표시가 GL입니다.',
  MC2: 'MC2 코일 ↔ 주접점 3개(L1·L3 교환, 역회전), MC1 앞의 b접점(인터록), RL 앞의 a접점.',
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
  fwd.push(item(a, 'PB1 누름 · 정회전', 'PB1 → T2 한시 b접점 → T1 코일과 MC2 b접점 → MC1 코일이 여자됩니다.', '전동기가 정회전합니다. 이 회로는 MC1 a접점이 GL을 켭니다(앞 회로들과 색이 반대).', 'MC1'));
  a.set('start', false);
  fwd.push(item(a, 'PB1 놓음 · 자기유지', 'T1 순시 a접점이 PB1 대신 전원을 이어 줍니다.', 'T1이 첫 번째 시간을 셉니다.', 'T1'));
  a.tick(d1);
  fwd.push(item(a, 'T1 완료 · T2 기동', 'T1 한시 a접점이 닫혀 T2가 여자되고, T2 순시 a접점이 곧바로 자기유지합니다.', '전동기는 아직 정회전 중입니다. 이제 T2가 두 번째 시간을 셉니다.', 'T2'));
  lessons.forward = fwd;

  const b = fresh(), rev = []; b.set('power', true); b.set('start', true); b.set('start', false); b.tick(d1); b.tick(Math.max(0, d2 - 0.1));
  rev.push(item(b, 'T2 설정시간 직전', '정회전 중이고 T2가 곧 끝납니다.', 'T2 한시 b접점은 MC1과 T1 코일 앞에 있습니다.', 'T2'));
  b.tick(0.1);
  rev.push(item(b, 'T2 완료 · 역회전', 'T2 한시 b접점이 열려 MC1과 T1이 떨어지고, MC1 b접점이 닫혀 MC2가 여자됩니다.', 'MC2는 T2의 자기유지 가지에서 전원을 받으므로 T1이 떨어져도 계속 운전합니다. 전동기가 역회전하고 RL이 켜집니다.', 'MC2'));
  rev.push(item(b, '역회전 · 인터록', 'MC2가 여자된 동안 MC2 b접점이 MC1 가지를 막습니다.', 'T1이 떨어져 자기유지가 풀렸지만, T2 순시 a접점이 운전 모선에서 바로 T2·MC2를 붙잡고 있습니다.', 'T2'));
  b.set('stop', true);
  rev.push(item(b, 'PB0 누름 · 정지', '운전 모선이 끊겨 T2·MC2가 복귀합니다.', 'T2 자기유지도 풀립니다.', 'PB0'));
  b.set('stop', false);
  rev.push(item(b, 'PB0 놓음 · 재기동 대기', 'PB1을 다시 누르면 정회전부터 시작합니다.', '', 'PB1'));
  lessons.reverse = rev;

  const e = fresh(), alarm = []; e.set('power', true); e.set('start', true); e.set('start', false); e.tick(d1 + d2 + 1);
  alarm.push(item(e, '역회전 중 · 과부하 전', '전동기가 역회전 중입니다.', '과부하가 생기면 어떻게 바뀌는지 봅니다.', 'EOCR'));
  e.set('trip', true);
  alarm.push(item(e, 'EOCR 동작 · YL 점등', 'EOCR b접점이 열려 운전 코일이 모두 떨어지고, a접점이 닫혀 YL이 켜집니다.', 'T2 자기유지도 풀립니다.', 'EOCR'));
  e.set('trip', false);
  alarm.push(item(e, 'RESET · 재기동 대기', 'EOCR을 복귀하면 YL이 꺼지고 운전 모선에 전원이 돌아옵니다.', 'PB1을 눌러야 다시 기동합니다.', 'EOCR'));
  lessons.alarm = alarm;
  return lessons;
};
window.circuitTimerText = (s, t) => {
  if (t.id === 'T1') return t.on ? (t.done ? '완료 · T2 기동' : '계시 중 · 정회전') : s.mc2 ? '소자 · T2 한시 b로 끊김' : s.run ? '대기 · PB1으로 기동' : '운전 전원 없음';
  return t.on ? (t.done ? '완료 · 역회전(MC2)' : '계시 중 · 정회전 유지') : '대기 · T1 완료 뒤 시작';
};
window.explainCircuitState = s => {
  if (!s.power) return ['전원 OFF · 승강기 04', 'MCCB가 꺼져 있습니다.', 'MCCB를 켠 뒤 PB1을 눌러 보세요.'];
  if (s.trip) return ['과부하 · 운전 차단', 'EOCR 동작 · YL이 켜져 있습니다.', 'RESET으로 복귀하세요.'];
  if (s.stop) return ['PB0 누름 · 정지', 'PB0 b접점이 열려 운전 모선이 끊겼습니다.', 'PB1을 다시 눌러야 기동합니다.'];
  if (s.mc2) return ['역회전 · RL', 'T2 자기유지 가지에서 MC1 b접점을 거쳐 MC2가 여자되었습니다.', 'PB0를 누르면 정지합니다.'];
  if (s.mc1 && s.timerOn2) return ['정회전 · T2 계시 중', 'T1이 끝나 T2가 기동하고 자기유지하고 있습니다.', `T2가 ${s.delay2}초를 세면 역회전으로 바뀝니다.`];
  if (s.mc1) return ['정회전 · T1 계시 중', s.start ? 'PB1을 누르는 동안 T1·MC1이 여자됩니다.' : 'T1 순시 a접점이 자기유지하고 있습니다.', `T1이 ${s.delay1}초를 세면 T2가 기동합니다.`];
  return ['전원 ON · 기동 대기', '운전 모선이 대기 중입니다.', 'PB1을 눌러 정회전으로 기동해 보세요.'];
};
