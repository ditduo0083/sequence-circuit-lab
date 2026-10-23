/* 승강기기능사 e06 · 단계별 설명·기기 안내 (요청 0023)
 * 설명 문장은 회로 데이터 synopsis의 동작 순서를 따라 새로 쓴 것이다. 공단 원문 문장은 쓰지 않았다.
 */
window.circuitId = 'e06';
window.circuitHints = {
  EOCR: 'EOCR ↔ 운전 모선 앞의 b접점과 경보 가지의 a접점. 과부하가 나면 b는 열려 운전을 끊고 a는 닫혀 FR·YL에 전원을 줍니다.',
  PB0: 'PB0 ↔ 운전 모선의 b접점. 누르는 동안 열려 T·MC1·MC2의 전원을 모두 끊습니다.',
  PB1: 'PB1 ↔ 기동 a접점. 누르는 동안만 닫히고, 손을 떼면 T 순시 a접점이 대신 전원을 이어 줍니다.',
  T: 'T 코일 ↔ 순시 a(자기유지), 한시 b(MC1 앞), 한시 a(MC2 앞). 설정시간이 지나면 한시 b는 열리고 한시 a는 닫혀 Y 기동이 Δ 운전으로 바뀝니다.',
  FR: 'FR 코일 ↔ YL 앞의 b접점. FR은 설정 간격마다 접점을 바꾸므로 YL이 켜졌다 꺼졌다(점멸) 합니다.',
  MC1: 'MC1(Y 접촉기) 코일 ↔ 주접점 3개(권선 끝 X·Y·Z를 한 점으로 묶음), MC2 앞의 b접점(인터록), RL 앞의 a접점.',
  MC2: 'MC2(Δ 접촉기) 코일 ↔ 주접점 3개(권선 끝 Z·X·Y에 L1·L2·L3를 연결), MC1 앞의 b접점(인터록), GL 앞의 a접점.',
  M: '6단자 전동기 M ↔ U·V·W는 EOCR 뒤에 늘 연결되어 있고, 권선 끝 X·Y·Z를 MC1이 묶으면 Y(성형), MC2가 다른 상에 이으면 Δ(델타)가 됩니다.'
};
window.createCircuitLessons = function (model) {
  const fresh = () => { const m = new CircuitModel(); for (const k of CircuitModel.SETTINGS) m.set(k, model[k]); return m; };
  const item = (m, heading, title, description, focus = '') => ({ snapshot: m.snapshot(), heading, title, description, focus });
  const d = model.delay, iv = model.interval, lessons = {};

  const a = fresh(), star = [];
  star.push(item(a, '전원 투입 전', 'MCCB를 넣기 전입니다.', '모든 코일과 전동기가 정지해 있습니다. 6단자 전동기는 U·V·W와 X·Y·Z 여섯 단자를 씁니다.'));
  a.set('power', true);
  star.push(item(a, '전원 ON · 기동 대기', '전원을 넣으면 EOCR에 전원이 들어갑니다.', '권선 앞쪽 U·V·W에는 전압이 걸리지만, 권선 끝 X·Y·Z가 어디에도 연결되지 않아 전류가 흐르지 않습니다. 운전 모선도 PB1을 기다립니다.', 'EOCR'));
  a.set('start', true);
  star.push(item(a, 'PB1 누름 · Y 기동', 'PB1을 누르면 T와 MC1이 여자됩니다.', 'MC1 주접점이 권선 끝 X·Y·Z를 한 점으로 묶어 Y(성형) 결선으로 기동합니다. 권선마다 걸리는 전압이 낮아 기동 전류가 작습니다. MC1 a접점으로 RL이 켜집니다.', 'MC1'));
  a.set('start', false);
  star.push(item(a, 'PB1 놓음 · 자기유지', 'PB1을 놓아도 T 순시 a접점이 운전을 유지합니다.', 'T 순시 a접점이 PB1과 병렬로 닫혀 있어 T·MC1에 전원이 계속 공급됩니다. T는 Y 기동 시간을 셉니다.', 'T'));
  a.tick(d / 2);
  star.push(item(a, 'T 계시 중 · Y 기동 유지', `T가 설정시간 ${d}초 가운데 ${d / 2}초를 셌습니다.`, 'MC1이 여자된 동안 MC1 b접점이 열려 MC2가 들어올 수 없습니다. Y와 Δ가 동시에 들어가면 전원이 단락되므로 이 인터록이 꼭 필요합니다.', 'MC1'));
  lessons.star = star;

  const b = fresh(), delta = []; b.set('power', true); b.set('start', true); b.set('start', false); b.tick(Math.max(0, d - 0.1));
  delta.push(item(b, 'T 설정시간 직전', 'Y 기동 중이고 T 설정시간이 곧 끝납니다.', 'T 한시 b접점은 닫혀 MC1을 살리고, 한시 a접점은 열려 MC2 가지를 막고 있습니다.', 'T'));
  b.tick(0.1);
  delta.push(item(b, 'T 완료 · Δ 운전 전환', 'T 한시 b접점이 열려 MC1이 떨어지고, 한시 a접점이 닫혀 MC2가 들어옵니다.', 'MC1이 떨어져 Y 결선이 풀리고 MC1 b접점이 다시 닫히면 MC2가 여자됩니다. MC2 주접점이 권선 끝 Z·X·Y에 L1·L2·L3를 이어 Δ(델타) 결선으로 운전하고, GL이 켜집니다.', 'MC2'));
  delta.push(item(b, 'Δ 운전 · 인터록', 'MC2가 여자된 동안 MC2 b접점이 MC1 가지를 끊습니다.', 'T는 자기유지로 계속 여자되어 있어 Δ 운전이 이어집니다. MC1·MC2의 b접점이 서로의 코일 앞에 있어 두 접촉기가 동시에 들어가지 않습니다.', 'MC2'));
  b.set('stop', true);
  delta.push(item(b, 'PB0 누름 · 정지', 'PB0를 누르면 운전 모선이 끊겨 모든 코일이 복귀합니다.', 'T·MC2가 소자되어 전동기가 멈추고 자기유지도 풀립니다.', 'PB0'));
  b.set('stop', false);
  delta.push(item(b, 'PB0 놓음 · 재기동 대기', 'PB0를 놓아도 다시 돌지 않습니다.', 'PB1을 다시 누르면 항상 Y 기동부터 시작합니다.', 'PB1'));
  lessons.delta = delta;

  const e = fresh(), alarm = []; e.set('power', true); e.set('start', true); e.set('start', false); e.tick(d + 1);
  alarm.push(item(e, 'Δ 운전 중 · 과부하 전', '전동기가 Δ 결선으로 운전 중입니다.', '과부하가 생기면 운전 회로와 경보 회로가 각각 어떻게 바뀌는지 봅니다.', 'EOCR'));
  e.set('trip', true);
  alarm.push(item(e, 'EOCR 동작 · FR 여자 · YL 켜짐', 'EOCR b접점이 열려 전동기가 멈추고, a접점이 닫혀 FR과 YL 가지에 전원이 들어갑니다.', 'T·MC1·MC2가 모두 소자됩니다. FR이 여자된 첫 간격에는 FR b접점이 닫힌 그대로라 YL이 켜집니다.', 'EOCR'));
  e.tick(iv);
  alarm.push(item(e, 'FR 전환 · YL 꺼짐', `${iv}초가 지나 FR 접점이 바뀌면 b접점이 열려 YL이 꺼집니다.`, 'FR(플리커 릴레이)은 여자된 동안 정해진 간격마다 접점을 바꿉니다.', 'FR'));
  e.tick(iv);
  alarm.push(item(e, 'FR 전환 · YL 다시 켜짐', '다음 간격에는 b접점이 다시 닫혀 YL이 켜집니다.', `이렇게 ${iv}초마다 YL이 켜졌다 꺼졌다 합니다. 자유 조작에서 이 점멸을 계속 볼 수 있습니다.`, 'FR'));
  e.set('trip', false);
  alarm.push(item(e, 'RESET · 재기동 대기', 'EOCR을 복귀하면 FR이 소자되어 YL이 꺼지고 운전 모선에 다시 전원이 옵니다.', '자기유지가 풀렸으므로 전동기는 저절로 돌지 않습니다. PB1을 눌러야 Y 기동부터 다시 시작합니다.', 'EOCR'));
  lessons.alarm = alarm;
  return lessons;
};
window.circuitTimerText = (s, t) => t.on ? (t.done ? '완료 · Δ 운전(MC2)' : '계시 중 · Y 기동(MC1)') : s.run ? '대기 · PB1으로 기동' : '운전 전원 없음';
window.explainCircuitState = s => {
  if (!s.power) return ['전원 OFF · 승강기 06', 'MCCB가 꺼져 있습니다.', 'MCCB를 켠 뒤 PB1을 눌러 보세요.'];
  if (s.trip) return ['과부하 · 운전 차단', s.yl ? 'EOCR 동작 · YL 켜짐(FR b접점 닫힘)' : 'EOCR 동작 · YL 꺼짐(FR b접점 열림)', `EOCR b접점이 운전 모선을 끊고 a접점이 FR에 전원을 줍니다. FR이 ${s.interval}초마다 접점을 바꿔 YL이 점멸합니다. RESET으로 복귀하세요.`];
  if (s.stop) return ['PB0 누름 · 정지', 'PB0 b접점이 열려 운전 모선이 끊겼습니다.', '자기유지가 풀립니다. PB0를 놓아도 PB1을 다시 눌러야 기동합니다.'];
  if (s.mc2) return ['Δ 운전', 'T 한시 a접점과 MC1 b접점을 거쳐 MC2가 여자되었습니다.', 'MC2 주접점이 권선 끝에 다른 상을 이어 Δ 결선으로 운전합니다. PB0를 누르면 정지합니다.'];
  if (s.mc1) return ['Y 기동 · T 계시 중', s.start ? 'PB1을 누르는 동안 T·MC1이 여자됩니다.' : 'T 순시 a접점이 자기유지하고 있습니다.', `MC1이 X·Y·Z를 묶어 Y로 기동 중입니다. T가 ${s.delay}초를 세면 Δ 운전으로 바뀝니다.`];
  return ['전원 ON · 기동 대기', 'EOCR에 전원이 들어가고 운전 모선이 대기 중입니다.', 'PB1을 눌러 Y 기동을 시작해 보세요.'];
};
