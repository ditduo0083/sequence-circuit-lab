/* 승강기기능사 e01 · 단계별 설명·기기 안내 (요청 0023)
 * 설명 문장은 회로 데이터 synopsis의 동작 순서를 따라 새로 쓴 것이다. 공단 원문 문장은 쓰지 않았다.
 */
window.circuitId = 'e01';
window.circuitHints = {
  EOCR: 'EOCR ↔ 운전 모선 앞의 b접점과 경보 가지의 a접점. 과부하가 나면 b는 열려 운전을 끊고 a는 닫혀 T2·YL에 전원을 줍니다.',
  PB0: 'PB0 ↔ 운전 모선의 b접점. 누르는 동안 열려 T1·MC1·MC2의 전원을 모두 끊습니다.',
  PB1: 'PB1 ↔ 기동 a접점. 누르는 동안만 닫히고, 손을 떼면 T1 순시 a접점이 대신 전원을 이어 줍니다.',
  T1: 'T1 코일 ↔ 순시 a(자기유지), 한시 b(MC1 앞), 한시 a(MC2 앞). 설정시간이 지나면 한시 b는 열리고 한시 a는 닫혀 정회전이 역회전으로 바뀝니다.',
  T2: 'T2 코일 ↔ YL 앞의 한시 b접점. 과부하 경보가 시작되고 설정시간이 지나면 YL을 끕니다.',
  MC1: 'MC1 코일 ↔ 주접점 3개(L1·L2·L3 → U·V·W, 정회전), MC2 앞의 b접점(인터록), RL 앞의 a접점.',
  MC2: 'MC2 코일 ↔ 주접점 3개(L1과 L3를 바꿔 넣음, 역회전), MC1 앞의 b접점(인터록), GL 앞의 a접점.',
  M: '전동기 M ↔ MC1이 닫히면 정회전, MC2가 닫히면 L1·L3가 바뀌어 역회전합니다.'
};
window.createCircuitLessons = function (model) {
  const fresh = () => { const m = new CircuitModel(); for (const k of CircuitModel.SETTINGS) m.set(k, model[k]); return m; };
  const item = (m, heading, title, description, focus = '') => ({ snapshot: m.snapshot(), heading, title, description, focus });
  const d1 = model.delay1, d2 = model.delay2, lessons = {};

  const a = fresh(), fwd = [];
  fwd.push(item(a, '전원 투입 전', 'MCCB를 넣기 전입니다.', '모든 코일과 전동기가 정지해 있습니다. 전원을 넣으면 어느 기기에 먼저 전원이 들어갈까요?'));
  a.set('power', true);
  fwd.push(item(a, '전원 ON · 기동 대기', '전원을 넣으면 EOCR에 전원이 들어갑니다.', 'EOCR b접점과 PB0 b접점이 닫혀 있어 운전 모선까지 전원이 와 있습니다. PB1과 T1 순시 a접점이 열려 있어 아직 아무 코일도 여자되지 않습니다.', 'EOCR'));
  a.set('start', true);
  fwd.push(item(a, 'PB1 누름 · 정회전 기동', 'PB1을 누르면 T1과 MC1이 여자됩니다.', 'T1 한시 b접점과 MC2 b접점이 닫혀 있으므로 MC1이 여자되어 전동기가 정회전하고, MC1 a접점으로 RL이 켜집니다. T1은 이때부터 시간을 셉니다.', 'MC1'));
  a.set('start', false);
  fwd.push(item(a, 'PB1 놓음 · 자기유지', 'PB1을 놓아도 T1 순시 a접점이 운전을 유지합니다.', 'T1 순시 a접점이 PB1과 병렬로 닫혀 있어, 버튼에서 손을 떼도 T1·MC1에 전원이 계속 공급됩니다.', 'T1'));
  a.tick(d1 / 2);
  fwd.push(item(a, 'T1 계시 중 · 정회전 유지', `T1이 설정시간 ${d1}초 가운데 ${d1 / 2}초를 셌습니다.`, '순시 접점은 이미 바뀌었지만 한시 접점은 아직 그대로입니다. MC1이 여자된 동안 MC1 b접점이 열려 있어 MC2는 들어올 수 없습니다(인터록).', 'MC1'));
  lessons.forward = fwd;

  const b = fresh(), rev = []; b.set('power', true); b.set('start', true); b.set('start', false); b.tick(Math.max(0, d1 - 0.1));
  rev.push(item(b, 'T1 설정시간 직전', '정회전 중이고 T1 설정시간이 곧 끝납니다.', 'T1 한시 b접점은 닫혀 MC1을 살리고, 한시 a접점은 열려 MC2 가지를 막고 있습니다. 설정시간이 끝나면 어떻게 바뀔까요?', 'T1'));
  b.tick(0.1);
  rev.push(item(b, 'T1 완료 · 역회전 전환', 'T1 한시 b접점이 열려 MC1이 떨어지고, 한시 a접점이 닫혀 MC2가 들어옵니다.', 'MC1이 떨어지면서 MC1 b접점이 다시 닫히므로 MC2가 여자됩니다. MC2 주접점은 L1과 L3를 바꿔 넣어 전동기가 역회전하고, GL이 켜집니다.', 'MC2'));
  rev.push(item(b, '역회전 · 인터록', 'MC2가 여자된 동안 MC2 b접점이 MC1 가지를 끊습니다.', '정회전·역회전 접촉기가 동시에 들어가면 두 상이 단락됩니다. MC1·MC2의 b접점이 서로의 코일 앞에 있어 동시 투입을 막습니다. T1은 자기유지로 계속 여자되어 역회전이 이어집니다.', 'MC2'));
  b.set('stop', true);
  rev.push(item(b, 'PB0 누름 · 정지', 'PB0를 누르면 운전 모선이 끊겨 모든 코일이 복귀합니다.', 'T1·MC2가 소자되고 전동기가 멈춥니다. T1의 자기유지와 계시 시간도 함께 풀립니다.', 'PB0'));
  b.set('stop', false);
  rev.push(item(b, 'PB0 놓음 · 재기동 대기', 'PB0를 놓아도 다시 돌지 않습니다.', 'PB1과 T1 순시 a접점이 모두 열려 있기 때문입니다. PB1을 다시 누르면 정회전부터 다시 시작합니다.', 'PB1'));
  lessons.reverse = rev;

  const e = fresh(), alarm = []; e.set('power', true); e.set('start', true); e.set('start', false); e.tick(d1 + 1);
  alarm.push(item(e, '역회전 운전 중 · 과부하 전', '전동기가 역회전 중입니다.', '여기서 과부하가 생기면 운전 회로와 경보 회로가 각각 어떻게 바뀌는지 봅니다.', 'EOCR'));
  e.set('trip', true);
  alarm.push(item(e, 'EOCR 동작 · YL 점등', 'EOCR b접점이 열려 전동기가 멈추고, a접점이 닫혀 T2와 YL에 전원이 들어갑니다.', 'T1·MC1·MC2가 모두 소자됩니다. YL은 T2 한시 b접점을 거쳐 켜지고, T2는 시간을 세기 시작합니다.', 'EOCR'));
  e.tick(d2 / 2);
  alarm.push(item(e, 'T2 계시 중 · YL 점등 유지', `T2가 설정시간 ${d2}초를 세는 동안 YL이 켜져 있습니다.`, 'T2 한시 b접점은 설정시간이 끝날 때까지 닫혀 있습니다.', 'T2'));
  e.tick(d2 / 2);
  alarm.push(item(e, 'T2 완료 · YL 소등', 'T2 설정시간이 지나면 한시 b접점이 열려 YL이 꺼집니다.', 'EOCR은 여전히 동작 중이어서 T2 코일에는 전원이 남아 있습니다. 경보등만 일정 시간 켜졌다 꺼지는 구조입니다.', 'T2'));
  e.set('trip', false);
  alarm.push(item(e, 'RESET · 재기동 대기', 'EOCR을 복귀하면 T2가 소자되고 운전 모선에 다시 전원이 옵니다.', '자기유지가 이미 풀렸으므로 전동기는 저절로 돌지 않습니다. PB1을 눌러야 다시 정회전부터 시작합니다.', 'EOCR'));
  lessons.alarm = alarm;
  return lessons;
};
window.circuitTimerText = (s, t) => {
  if (t.id === 'T1') return t.on ? (t.done ? '완료 · 역회전(MC2) 운전' : '계시 중 · 정회전(MC1) 운전') : s.run ? '대기 · PB1으로 기동' : '운전 전원 없음';
  return t.on ? (t.done ? '완료 · YL 소등' : '계시 중 · YL 점등') : '대기 · EOCR 정상';
};
window.explainCircuitState = s => {
  if (!s.power) return ['전원 OFF · 승강기 01', 'MCCB가 꺼져 있습니다.', 'MCCB를 켠 뒤 PB1을 눌러 보세요.'];
  if (s.trip) return ['과부하 · 운전 차단', s.yl ? 'EOCR 동작 · YL이 켜져 있습니다.' : 'EOCR 동작 · T2 완료로 YL이 꺼졌습니다.', `EOCR b접점이 운전 모선을 끊고 a접점이 T2·YL에 전원을 줍니다. T2 설정시간(${s.delay2}초)이 지나면 YL이 꺼집니다. RESET으로 복귀하세요.`];
  if (s.stop) return ['PB0 누름 · 정지', 'PB0 b접점이 열려 운전 모선이 끊겼습니다.', '자기유지가 풀립니다. PB0를 놓아도 PB1을 다시 눌러야 기동합니다.'];
  if (s.mc2) return ['역회전 운전', 'T1 한시 a접점과 MC1 b접점을 거쳐 MC2가 여자되었습니다.', 'MC2 주접점이 L1·L3를 바꿔 넣어 전동기가 역회전합니다. PB0를 누르면 정지합니다.'];
  if (s.mc1) return ['정회전 운전 · T1 계시 중', s.start ? 'PB1을 누르는 동안 T1·MC1이 여자됩니다.' : 'T1 순시 a접점이 자기유지하고 있습니다.', `T1이 ${s.delay1}초를 세면 한시 접점이 바뀌어 역회전으로 넘어갑니다.`];
  return ['전원 ON · 기동 대기', 'EOCR에 전원이 들어가고 운전 모선이 대기 중입니다.', 'PB1을 눌러 정회전으로 기동해 보세요.'];
};
