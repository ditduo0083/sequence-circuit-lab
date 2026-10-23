/* 승강기기능사 e10 · 단계별 설명·기기 안내 (요청 0025)
 * 설명 문장은 원본 7-5쪽 회로와 회로 데이터 synopsis의 동작 순서를 따라 새로 쓴 것이다. 공단 원문 문장은 쓰지 않았다.
 */
window.circuitId = 'e10';
window.circuitHints = {
  EOCR: 'EOCR ↔ 운전 모선 앞의 b접점과 YL 앞의 a접점.',
  PB0: 'PB0 ↔ T 코일 바로 앞의 b접점. 누르면 T가 떨어지고 자기유지가 풀려 전체가 멈춥니다.',
  PB1: 'PB1 ↔ 기동 a접점. 손을 떼면 T 순시 a접점이 대신 전원을 이어 줍니다.',
  T: 'T 코일 ↔ 순시 a(자기유지), 한시 b(FR 앞), 한시 a(MC2 앞, FR a와 병렬). 설정시간 동안 교대 운전, 그 뒤 두 대 모두 운전.',
  FR: 'FR 코일 ↔ MC1 앞의 b접점과 MC2 앞의 a접점. 간격마다 두 접점을 바꿔 M1·M2를 번갈아 돌립니다.',
  MC1: 'MC1 코일 ↔ M1 주접점 3개, RL 앞의 a접점. 이 회로에는 인터록 b접점이 없습니다.',
  MC2: 'MC2 코일 ↔ M2 주접점 3개, GL 앞의 a접점. 이 회로에는 인터록 b접점이 없습니다.',
  M1: '전동기 M1 ↔ MC1 주접점.', M2: '전동기 M2 ↔ MC2 주접점.'
};
window.createCircuitLessons = function (model) {
  const fresh = () => { const m = new CircuitModel(); for (const k of CircuitModel.SETTINGS) m.set(k, model[k]); return m; };
  const item = (m, heading, title, description, focus = '') => ({ snapshot: m.snapshot(), heading, title, description, focus });
  const d = model.delay, iv = model.interval, lessons = {};

  const a = fresh(), alt = [];
  alt.push(item(a, '전원 투입 전', 'MCCB를 넣기 전입니다.', '두 전동기와 모든 코일이 정지해 있습니다.'));
  a.set('power', true);
  alt.push(item(a, '전원 ON · 기동 대기', '전원을 넣으면 EOCR b접점 뒤 운전 모선에 전원이 옵니다.', 'PB0는 T 코일 앞에 있습니다.', 'EOCR'));
  a.set('start', true); a.set('start', false);
  alt.push(item(a, 'PB1 · M1 운전', 'T가 여자되어 자기유지하고, T 한시 b접점을 거쳐 FR이 여자됩니다.', 'FR 첫 간격에는 b접점이 닫혀 MC1이 여자되고 M1이 운전합니다(RL 점등). a접점은 열려 있어 M2는 쉽니다.', 'MC1'));
  a.tick(iv);
  alt.push(item(a, 'FR 전환 · M2 운전', `${iv}초 뒤 FR 접점이 바뀌어 b접점은 열리고 a접점은 닫힙니다.`, 'M1이 멈추고 MC2가 여자되어 M2가 운전합니다(GL 점등). 두 전동기가 번갈아 돕니다.', 'FR'));
  a.tick(iv);
  alt.push(item(a, 'FR 전환 · M1 운전', '다음 간격에는 다시 M1이 돌고 M2가 쉽니다.', `T 설정시간(${d}초) 동안 교대 운전을 되풀이합니다.`, 'FR'));
  lessons.alt = alt;

  const b = fresh(), both = []; b.set('power', true); b.set('start', true); b.set('start', false); b.tick(Math.max(0, d - 0.1));
  both.push(item(b, 'T 설정시간 직전', '교대 운전이 곧 끝납니다.', 'T 한시 b접점은 FR 앞에, 한시 a접점은 FR a접점과 나란히 MC2 앞에 있습니다.', 'T'));
  b.tick(0.1);
  both.push(item(b, 'T 완료 · 두 대 운전', 'T 한시 b접점이 열려 FR이 복귀하고, 한시 a접점이 닫혀 MC2가 계속 여자됩니다.', 'FR이 복귀하면 FR b접점이 닫힌 그대로이므로 MC1도 여자됩니다. 이 회로에는 인터록이 없어 M1·M2가 함께 운전합니다.', 'T'));
  b.set('stop', true);
  both.push(item(b, 'PB0 누름 · 정지', 'T가 떨어지면서 자기유지가 풀려 MC1·MC2가 모두 복귀합니다.', '', 'PB0'));
  lessons.both = both;

  const e = fresh(), stop = []; e.set('power', true); e.set('start', true); e.set('start', false); e.tick(d + 1);
  stop.push(item(e, '두 대 운전 중 · 과부하 전', 'M1·M2가 함께 운전 중입니다.', '과부하가 생기면 어떻게 바뀌는지 봅니다.', 'EOCR'));
  e.set('trip', true);
  stop.push(item(e, 'EOCR 동작 · YL 점등', 'EOCR b접점이 운전 모선을 끊어 두 전동기가 멈추고, a접점이 YL을 켭니다.', '', 'EOCR'));
  e.set('trip', false);
  stop.push(item(e, 'RESET · 재기동 대기', 'EOCR을 복귀하면 YL이 꺼집니다.', 'PB1을 눌러야 다시 기동합니다.', 'EOCR'));
  lessons.alarm = stop;
  return lessons;
};
window.circuitTimerText = (s, t) => t.on ? (t.done ? '완료 · M1·M2 함께 운전' : '계시 중 · FR 교대 운전') : s.run ? '대기 · PB1으로 기동' : '운전 전원 없음';
window.explainCircuitState = s => {
  if (!s.power) return ['전원 OFF · 승강기 10', 'MCCB가 꺼져 있습니다.', 'MCCB를 켠 뒤 PB1을 눌러 보세요.'];
  if (s.trip) return ['과부하 · 운전 차단', 'EOCR 동작 · YL이 켜져 있습니다.', 'RESET으로 복귀하세요.'];
  if (s.done && s.mc1 && s.mc2) return ['두 대 운전', 'FR이 복귀해 FR b로 MC1, T 한시 a로 MC2가 여자되어 있습니다.', '인터록이 없는 회로라 두 전동기가 함께 돕니다. PB0를 누르면 정지합니다.'];
  if (s.fr) return ['M1·M2 교대 · T 계시 중', s.mc1 ? 'FR b접점이 닫혀 M1이 운전 중입니다.' : 'FR a접점이 닫혀 M2가 운전 중입니다.', `T가 ${s.delay}초를 세면 두 대 모두 운전합니다.`];
  if (s.stop) return ['PB0 누름', 'T 코일 앞 PB0 b접점이 열려 있습니다.', 'PB0를 놓고 PB1을 눌러야 기동합니다.'];
  return ['전원 ON · 기동 대기', '운전 모선이 대기 중입니다.', 'PB1을 눌러 보세요.'];
};
