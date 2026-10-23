/* 승강기기능사 e07 · 단계별 설명·기기 안내 (요청 0025)
 * 설명 문장은 원본 7-5쪽 회로와 회로 데이터 synopsis의 동작 순서를 따라 새로 쓴 것이다. 공단 원문 문장은 쓰지 않았다.
 */
window.circuitId = 'e07';
window.circuitHints = {
  EOCR: 'EOCR ↔ 운전 모선 앞의 b접점과 YL 앞의 a접점. 이 회로의 운전 모선에는 PB0가 없습니다.',
  PB0: 'PB0 ↔ T 코일 바로 앞의 b접점. 누르면 T가 떨어지고, T 순시 a접점(자기유지)이 열려 전체가 멈춥니다.',
  PB1: 'PB1 ↔ 기동 a접점. 손을 떼면 T 순시 a접점이 대신 전원을 이어 줍니다.',
  T: 'T 코일 ↔ 순시 a(자기유지), 한시 b(MC1 앞), 한시 a(MC2 앞). 설정시간이 지나면 Y 기동이 Δ 운전으로 바뀝니다.',
  FR: 'FR 코일 ↔ a접점(RL 쪽)과 b접점(GL 쪽). MC2가 들어오면 여자되어 간격마다 두 접점을 바꿔 RL·GL을 번갈아 켭니다.',
  MC1: 'MC1(Y 접촉기) 코일 ↔ 주접점 3개(X·Y·Z를 한 점으로), MC2 앞의 b접점(인터록), RL 앞의 a접점.',
  MC2: 'MC2(Δ 접촉기) 코일 ↔ 주접점 3개(Z·X·Y에 L1·L2·L3), MC1 앞의 b접점(인터록), FR 앞의 a접점.',
  M: '6단자 전동기 M ↔ MC1이 X·Y·Z를 묶으면 Y, MC2가 다른 상에 이으면 Δ.'
};
window.createCircuitLessons = function (model) {
  const fresh = () => { const m = new CircuitModel(); for (const k of CircuitModel.SETTINGS) m.set(k, model[k]); return m; };
  const item = (m, heading, title, description, focus = '') => ({ snapshot: m.snapshot(), heading, title, description, focus });
  const d = model.delay, iv = model.interval, lessons = {};

  const a = fresh(), star = [];
  star.push(item(a, '전원 투입 전', 'MCCB를 넣기 전입니다.', '모든 코일과 전동기가 정지해 있습니다.'));
  a.set('power', true);
  star.push(item(a, '전원 ON · 기동 대기', '전원을 넣으면 EOCR b접점 뒤 운전 모선에 전원이 옵니다.', '이 회로는 PB0가 모선이 아니라 T 코일 앞에 있습니다.', 'EOCR'));
  a.set('start', true);
  star.push(item(a, 'PB1 누름 · Y 기동', 'PB1을 누르면 T와 MC1이 여자됩니다.', 'MC1 주접점이 권선 끝 X·Y·Z를 묶어 Y 결선으로 기동하고, MC1 a접점으로 RL이 켜집니다.', 'MC1'));
  a.set('start', false);
  star.push(item(a, 'PB1 놓음 · 자기유지', 'T 순시 a접점이 PB1 대신 S 모선을 살려 둡니다.', 'T가 Y 기동 시간을 셉니다.', 'T'));
  lessons.star = star;

  const b = fresh(), delta = []; b.set('power', true); b.set('start', true); b.set('start', false); b.tick(d);
  delta.push(item(b, 'T 완료 · Δ 운전', 'T 한시 b접점이 열려 MC1이 떨어지고, 한시 a접점과 MC1 b접점을 거쳐 MC2가 여자됩니다.', 'Δ 결선으로 운전합니다. MC2 a접점이 FR에 전원을 주고, FR의 첫 간격에는 b접점이 닫혀 있어 GL이 켜집니다.', 'MC2'));
  b.tick(iv);
  delta.push(item(b, 'FR 전환 · RL 켜짐', `${iv}초 뒤 FR 접점이 바뀌어 a접점으로 RL이 켜지고 GL은 꺼집니다.`, 'Δ 운전 중에는 RL과 GL이 번갈아 켜집니다. MC1은 떨어져 있지만 FR a접점을 거쳐 RL에 전원이 갑니다.', 'FR'));
  b.tick(iv);
  delta.push(item(b, 'FR 전환 · GL 켜짐', '다음 간격에는 다시 GL이 켜집니다.', '자유 조작에서 교대 점등을 계속 볼 수 있습니다.', 'FR'));
  lessons.delta = delta;

  const e = fresh(), stop = []; e.set('power', true); e.set('start', true); e.set('start', false); e.tick(d + 0.5);
  stop.push(item(e, 'Δ 운전 중', '전동기가 Δ 결선으로 운전 중입니다.', 'PB0는 T 코일 앞에 있습니다. 누르면 어떻게 될까요?', 'PB0'));
  e.set('stop', true);
  stop.push(item(e, 'PB0 누름 · 정지', 'T 코일이 떨어지면서 T 순시 a접점(자기유지)이 열려 S 모선이 끊깁니다.', 'MC2와 FR이 복귀하고 전동기가 멈춥니다.', 'PB0'));
  e.set('stop', false); e.set('start', true); e.set('start', false); e.tick(1);
  stop.push(item(e, '다시 Y 기동', 'PB0를 놓고 PB1을 누르면 Y 기동부터 다시 시작합니다.', '', 'MC1'));
  e.set('trip', true);
  stop.push(item(e, 'EOCR 동작 · YL 점등', 'EOCR b접점이 운전 모선을 끊어 전동기가 멈추고, a접점이 YL을 켭니다.', '이 회로의 YL은 EOCR a접점으로 바로 켜집니다(점멸 없음).', 'EOCR'));
  e.set('trip', false);
  stop.push(item(e, 'RESET · 재기동 대기', 'EOCR을 복귀하면 YL이 꺼집니다.', 'PB1을 눌러야 다시 기동합니다.', 'EOCR'));
  lessons.alarm = stop;
  return lessons;
};
window.circuitTimerText = (s, t) => t.on ? (t.done ? '완료 · Δ 운전(MC2)' : '계시 중 · Y 기동(MC1)') : s.run ? '대기 · PB1으로 기동' : '운전 전원 없음';
window.explainCircuitState = s => {
  if (!s.power) return ['전원 OFF · 승강기 07', 'MCCB가 꺼져 있습니다.', 'MCCB를 켠 뒤 PB1을 눌러 보세요.'];
  if (s.trip) return ['과부하 · 운전 차단', 'EOCR 동작 · YL이 켜져 있습니다.', 'RESET으로 복귀하세요.'];
  if (s.mc2) return ['Δ 운전 · 표시등 교대', s.frOut ? 'FR a접점이 닫혀 RL이 켜져 있습니다.' : 'FR b접점이 닫혀 GL이 켜져 있습니다.', `FR이 ${s.interval}초마다 접점을 바꿔 RL·GL이 번갈아 켜집니다. PB0를 누르면 정지합니다.`];
  if (s.mc1) return ['Y 기동 · T 계시 중', s.stop ? 'PB0를 누르는 동안 T가 떨어져 있습니다. PB1을 누르고 있어서 MC1만 들어와 있습니다.' : 'T 순시 a접점이 자기유지하고 있습니다.', `T가 ${s.delay}초를 세면 Δ 운전으로 바뀝니다.`];
  if (s.stop) return ['PB0 누름', 'T 코일 앞 PB0 b접점이 열려 있습니다.', 'PB0를 놓고 PB1을 눌러야 기동합니다.'];
  return ['전원 ON · 기동 대기', '운전 모선이 대기 중입니다.', 'PB1을 눌러 Y 기동을 시작해 보세요.'];
};
