/* 승강기기능사 e08 · 단계별 설명·기기 안내 (요청 0025)
 * 설명 문장은 회로 데이터 synopsis의 동작 순서를 따라 새로 쓴 것이다. 공단 원문 문장은 쓰지 않았다.
 */
window.circuitId = 'e08';
window.circuitHints = {
  EOCR: 'EOCR ↔ 운전 모선 앞의 b접점과 YL 앞의 a접점. 두 전동기의 공통 주회로를 감시합니다.',
  PB0: 'PB0 ↔ T 코일 바로 앞의 b접점. 누르면 T가 떨어지고 자기유지가 풀려 전체가 멈춥니다.',
  PB1: 'PB1 ↔ 기동 a접점. 손을 떼면 T 순시 a접점이 대신 전원을 이어 줍니다.',
  T: 'T 코일 ↔ 순시 a(자기유지), 한시 b(MC1 앞), 한시 a(FR 앞). 설정시간 동안 M1이 돌고, 그 뒤 FR이 시작됩니다.',
  FR: 'FR 코일 ↔ MC2 앞의 a접점. 간격마다 a접점이 열리고 닫혀 M2가 돌다 멈추다를 되풀이합니다.',
  MC1: 'MC1 코일 ↔ M1 주접점 3개, MC2 앞의 b접점(인터록), RL 앞의 a접점.',
  MC2: 'MC2 코일 ↔ M2 주접점 3개, MC1 앞의 b접점(인터록), GL 앞의 a접점.',
  M1: '전동기 M1 ↔ MC1 주접점.', M2: '전동기 M2 ↔ MC2 주접점.'
};
window.createCircuitLessons = function (model) {
  const fresh = () => { const m = new CircuitModel(); for (const k of CircuitModel.SETTINGS) m.set(k, model[k]); return m; };
  const item = (m, heading, title, description, focus = '') => ({ snapshot: m.snapshot(), heading, title, description, focus });
  const d = model.delay, iv = model.interval, lessons = {};

  const a = fresh(), m1 = [];
  m1.push(item(a, '전원 투입 전', 'MCCB를 넣기 전입니다.', '두 전동기와 모든 코일이 정지해 있습니다.'));
  a.set('power', true);
  m1.push(item(a, '전원 ON · 기동 대기', '전원을 넣으면 EOCR b접점 뒤 운전 모선에 전원이 옵니다.', 'PB0는 모선이 아니라 T 코일 앞에 있습니다.', 'EOCR'));
  a.set('start', true);
  m1.push(item(a, 'PB1 누름 · M1 운전', 'PB1을 누르면 T가 여자되고, T 한시 b·MC2 b접점을 거쳐 MC1이 여자됩니다.', 'M1이 운전하고 RL이 켜집니다.', 'MC1'));
  a.set('start', false);
  m1.push(item(a, 'PB1 놓음 · 자기유지', 'T 순시 a접점이 PB1 대신 전원을 이어 줍니다.', `T가 ${d}초 동안 M1 운전 시간을 셉니다.`, 'T'));
  lessons.m1 = m1;

  const b = fresh(), m2 = []; b.set('power', true); b.set('start', true); b.set('start', false); b.tick(d);
  m2.push(item(b, 'T 완료 · M1 정지, FR 기동', 'T 한시 b접점이 열려 MC1·M1이 멈추고, 한시 a접점이 닫혀 FR이 여자됩니다.', 'FR의 첫 간격에는 a접점이 열려 있어 M2는 아직 돌지 않습니다.', 'FR'));
  b.tick(iv);
  m2.push(item(b, 'FR a 닫힘 · M2 운전', `${iv}초 뒤 FR a접점이 닫혀 MC1 b접점을 거쳐 MC2가 여자됩니다.`, 'M2가 운전하고 GL이 켜집니다.', 'MC2'));
  b.tick(iv);
  m2.push(item(b, 'FR a 열림 · M2 정지', '다음 간격에는 FR a접점이 열려 M2가 멈춥니다.', `이렇게 ${iv}초마다 M2가 돌다 멈추다를 되풀이합니다(간헐 운전).`, 'FR'));
  lessons.m2 = m2;

  const e = fresh(), stop = []; e.set('power', true); e.set('start', true); e.set('start', false); e.tick(d + iv);
  stop.push(item(e, 'M2 간헐 운전 중', 'M2가 FR에 맞춰 운전 중입니다.', 'PB0는 T 코일 앞에 있습니다. 누르면 어떻게 될까요?', 'PB0'));
  e.set('stop', true);
  stop.push(item(e, 'PB0 누름 · 정지', 'T가 떨어지면서 T 순시 a접점(자기유지)이 열려 S 모선이 끊깁니다.', 'FR·MC2가 복귀하고 두 전동기 모두 멈춥니다.', 'PB0'));
  e.set('stop', false); e.set('start', true); e.set('start', false);
  e.set('trip', true);
  stop.push(item(e, 'EOCR 동작 · YL 점등', 'EOCR b접점이 운전 모선을 끊어 전동기가 멈추고, a접점이 YL을 켭니다.', '', 'EOCR'));
  e.set('trip', false);
  stop.push(item(e, 'RESET · 재기동 대기', 'EOCR을 복귀하면 YL이 꺼집니다.', 'PB1을 눌러야 다시 M1부터 기동합니다.', 'EOCR'));
  lessons.alarm = stop;
  return lessons;
};
window.circuitTimerText = (s, t) => t.on ? (t.done ? '완료 · FR로 M2 간헐 운전' : '계시 중 · M1 운전') : s.run ? '대기 · PB1으로 기동' : '운전 전원 없음';
window.explainCircuitState = s => {
  if (!s.power) return ['전원 OFF · 승강기 08', 'MCCB가 꺼져 있습니다.', 'MCCB를 켠 뒤 PB1을 눌러 보세요.'];
  if (s.trip) return ['과부하 · 운전 차단', 'EOCR 동작 · YL이 켜져 있습니다.', 'RESET으로 복귀하세요.'];
  if (s.fr) return ['M2 간헐 운전', s.mc2 ? 'FR a접점이 닫혀 M2가 운전 중입니다.' : 'FR a접점이 열려 M2가 쉬고 있습니다.', `FR이 ${s.interval}초마다 접점을 바꿉니다. PB0를 누르면 정지합니다.`];
  if (s.mc1) return ['M1 운전 · T 계시 중', s.start ? 'PB1을 누르는 동안 T·MC1이 여자됩니다.' : 'T 순시 a접점이 자기유지하고 있습니다.', `T가 ${s.delay}초를 세면 M1이 멈추고 FR이 시작됩니다.`];
  if (s.stop) return ['PB0 누름', 'T 코일 앞 PB0 b접점이 열려 있습니다.', 'PB0를 놓고 PB1을 눌러야 기동합니다.'];
  return ['전원 ON · 기동 대기', '운전 모선이 대기 중입니다.', 'PB1을 눌러 보세요.'];
};
