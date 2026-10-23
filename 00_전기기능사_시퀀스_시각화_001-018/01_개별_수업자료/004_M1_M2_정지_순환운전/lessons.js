window.circuitHints={
  X:'X 코일 ↔ PB1 병렬 자기유지 a접점, FR 교대부 앞의 허가 a접점. 자동 감지 또는 수동 PB1으로 여자됩니다.',
  T:'T 코일 ↔ MC2 앞의 한시 b접점. FR의 M2 구간에서 함께 여자되고, 설정시간 뒤 MC2만 먼저 끕니다.',
  FR:'FR 코일 ↔ MC1 경로와 M2·T 경로의 교대 접점. 한 위상은 M1, 다음 위상은 M2와 T에 전원을 공급합니다.',
  MC1:'MC1 코일 ↔ M1 주접점 3개와 RL 보조 a접점. FR의 첫 위상에 여자됩니다.',
  MC2:'MC2 코일 ↔ M2 주접점 3개와 GL 보조 a접점. 두 번째 FR 위상 중 T 완료 전까지만 여자됩니다.',
  EOCR:'EOCR ↔ 운전 차단 b접점과 경보 a접점. 과부하 시 운전은 멈추고 YL·BZ가 동시에 계속 동작합니다.',
  FLS:'FLS 전원 ↔ X·FR 공통점으로 이어지는 감지 a접점. 자동 운전의 기동·정지를 결정합니다.'
};
window.createCircuitLessons=function(model){
  const delay=model.delay,interval=model.interval;
  const fresh=()=>{const m=new CircuitModel();m.set('delay',delay);m.set('interval',interval);return m;};
  const make=(m,title,description,focus,heading=title)=>({snapshot:m.snapshot(),title,description,focus,heading});
  const a=fresh(),auto=[];
  auto.push(make(a,'전원을 넣기 전입니다.','004 회로는 ① M1 운전 → ② M2 운전 → ③ 두 모터 정지를 반복합니다. T 설정시간은 FR 위상 시간보다 짧아야 합니다.','','전원 투입 전 · 도면 004'));
  a.set('power',true);auto.push(make(a,'MCCB를 켜면 EOCR에 전원이 공급됩니다.','운전용 EOCR b접점은 닫혀 있습니다. 아직 감지 입력이 없으므로 X·FR과 모터는 정지합니다.','EOCR','전원 ON · 기동 대기'));
  a.set('mode','A');auto.push(make(a,'A를 선택하면 FLS가 감지를 기다립니다.','FLS 코일에는 전원이 공급되지만 감지 접점은 열려 있습니다.','FLS','자동 선택 · 감지 대기'));
  a.set('sensor',true);auto.push(make(a,'감지 즉시 X·FR이 여자되고 M1이 운전합니다.','X 허가접점과 FR의 첫 접점이 닫혀 MC1·M1·RL에 전원이 공급됩니다. T는 소자 상태입니다.','FR','① 자동 감지 · M1 운전'));
  a.tick(interval);auto.push(make(a,'FR이 전환되면 M2와 T가 함께 동작합니다.',`FR ${interval}초 경계에서 MC1 경로가 열리고 M2·T 경로가 닫힙니다. T 한시 b접점은 아직 닫혀 있습니다.`,'T','② FR 전환 · M2 + T'));
  a.tick(delay);auto.push(make(a,'T 설정시간 뒤 M2가 먼저 정지합니다.',`T ${delay}초 경계에서 한시 b접점이 열립니다. FR의 두 번째 위상은 남아 있어 T는 여자되지만 두 모터와 두 램프는 모두 꺼집니다.`,'T','③ T 완료 · 두 모터 정지'));
  a.tick(interval-delay);auto.push(make(a,'다음 FR 위상에서 다시 M1이 운전합니다.','M2·T 경로가 끊겨 T가 복귀하고, MC1 경로가 닫혀 ①부터 순환을 반복합니다.','FR','순환 복귀 · M1 운전'));
  a.set('sensor',false);auto.push(make(a,'감지 해제 시 전체 자동 운전이 정지합니다.','FLS 접점이 열려 X·FR이 소자되고 모든 시간과 위상이 초기화됩니다.','FLS','감지 해제 · 자동 정지'));
  const m=fresh(),manual=[];m.set('power',true);
  manual.push(make(m,'M 위치에서는 PB1으로 X와 FR을 기동합니다.','PB1과 병렬인 X a접점이 수동 자기유지를 담당합니다.','X','수동 선택 · 기동 대기'));
  m.set('start',true);manual.push(make(m,'PB1을 누르면 X·FR·MC1이 여자됩니다.','X 허가접점이 닫혀 FR 교대부에 전원을 공급하고, 첫 위상에서 M1과 RL이 즉시 켜집니다.','X','PB1 누름 · M1 기동'));
  m.set('start',false);manual.push(make(m,'PB1을 놓아도 X 접점이 자기유지합니다.','전원은 PB0 → X 자기유지 접점 → X·FR 코일로 계속 공급됩니다.','X','PB1 놓음 · X 자기유지'));
  m.tick(interval);manual.push(make(m,'FR 위상이 바뀌어 M2와 T가 동작합니다.','M1·RL은 꺼지고 M2·GL이 켜집니다. T는 이 순간부터 시간을 셉니다.','FR','② 수동 교대 · M2 + T'));
  m.tick(delay/2);manual.push(make(m,'T 설정시간 전에는 M2가 계속 운전합니다.',`${delay}초 중 ${(delay/2).toFixed(1)}초 경과. T 한시 b접점이 아직 닫혀 있습니다.`,'T','M2 운전 · T 계시 중'));
  m.tick(delay/2);manual.push(make(m,'T 완료 시 M2가 정지해 무동작 구간이 생깁니다.','T 한시 b접점이 열려 MC2를 끕니다. FR이 다음 위상으로 바뀔 때까지 T만 여자됩니다.','T','③ T 완료 · 두 모터 정지'));
  m.tick(interval-delay);manual.push(make(m,'FR이 다시 전환되면 M1이 운전합니다.','T가 소자되어 b접점이 복귀하고, 첫 FR 경로가 MC1·M1·RL을 다시 켭니다.','FR','순환 복귀 · M1 운전'));
  m.set('stop',true);manual.push(make(m,'PB0를 누르면 자기유지와 순환 운전이 해제됩니다.','X·FR·T와 두 접촉기가 모두 소자되고 시간은 0으로 돌아갑니다.','X','PB0 누름 · 수동 정지'));
  const e=fresh(),alarm=[];e.set('power',true);e.set('start',true);e.set('start',false);e.tick(interval+delay/2);
  alarm.push(make(e,'M2와 T가 동작 중일 때 과부하를 가정합니다.','EOCR의 운전 b접점과 경보 a접점이 어떻게 바뀌는지 확인하세요.','EOCR','정상 운전 · M2 + T'));
  e.set('trip',true);alarm.push(make(e,'EOCR 트립 시 운전은 멈추고 YL·BZ가 켜집니다.','운전용 b접점은 열리고 경보용 a접점은 닫힙니다. X·FR·T와 모터는 모두 소자됩니다.','EOCR','과부하 · YL + BZ'));
  e.tick(interval);alarm.push(make(e,'시간이 지나도 경보는 동시에 계속 동작합니다.','YL과 BZ는 FR 교대부와 분리된 병렬 부하입니다.','EOCR','과부하 유지 · 경보 지속'));
  e.set('trip',false);alarm.push(make(e,'M 위치에서 RESET하면 기동 대기로 돌아갑니다.','트립 중 X 자기유지가 풀렸고 PB1을 놓은 상태이므로 자동 재기동하지 않습니다.','X','수동 RESET · 기동 대기'));
  e.set('mode','A');e.set('sensor',true);alarm.push(make(e,'자동 감지가 유지되면 M1부터 즉시 재기동합니다.','현재 입력을 다시 평가하여 X·FR과 MC1이 여자됩니다.','FLS','자동 감지 · M1 재기동'));
  e.tick(interval+delay);alarm.push(make(e,'두 번째 위상에서 T가 완료되어 두 모터가 정지합니다.','RESET 뒤에도 ① M1 → ② M2+T → ③ 정지 순서를 처음부터 반복합니다.','T','자동 순환 · 무동작 구간'));
  e.set('trip',true);alarm.push(make(e,'무동작 구간에서도 EOCR 트립은 경보를 켭니다.','운전 회로는 차단되고 YL·BZ가 동시에 동작합니다.','EOCR','자동 운전 중 과부하'));
  e.set('trip',false);alarm.push(make(e,'감지가 남아 있으면 RESET 직후 M1부터 시작합니다.','FR 위상과 T 시간은 초기화되어 첫 구간으로 복귀합니다.','FR','자동 RESET · M1부터 재시작'));
  return {auto,manual,alarm};
};
window.explainCircuitState=function(s){
  if(!s.power)return ['전원 투입 전 · 도면 004','MCCB가 OFF입니다.','MCCB를 켜고 자동 감지 또는 수동 PB1으로 3단계 순환을 시작하세요.'];
  if(s.trip)return ['과부하 · YL + BZ 동작','모터는 정지하고 YL·BZ가 동시에 동작합니다.','EOCR 운전 b접점은 열리고 경보 a접점은 닫혔습니다. RESET하면 현재 입력을 다시 평가합니다.'];
  if(s.fr&&s.mc1)return ['① M1 운전 · T 소자','M1·RL이 켜지고 M2·GL은 꺼져 있습니다.',`FR 첫 위상은 ${s.interval}초입니다. 다음 위상에서 M2와 T가 함께 시작합니다.`];
  if(s.fr&&s.mc2)return ['② M2 운전 · T 계시','M2·GL이 켜지고 M1·RL은 꺼져 있습니다.',`T 한시 b접점은 닫혀 있습니다. ${s.delay}초가 되면 MC2만 먼저 소자됩니다.`];
  if(s.fr&&s.done)return ['③ 두 모터 정지 · T 여자','M1·M2와 RL·GL이 모두 꺼져 있습니다.',`T b접점이 열렸지만 FR의 두 번째 위상이 ${s.remaining.toFixed(1)}초 남았습니다. 다음 FR 전환에서 M1이 다시 시작합니다.`];
  if(s.mode==='A')return ['자동 선택 · 감지 대기','FLS에 전원이 공급되고 감지를 기다립니다.','감지 시 X·FR이 여자되어 M1부터 3단계 순환을 시작합니다. PB0는 수동 분기에만 있습니다.'];
  if(s.stop)return ['수동 정지 · PB0 누름','PB0가 열려 X 자기유지가 해제되었습니다.','X·FR·T와 두 모터가 정지합니다. PB0를 놓고 PB1을 다시 누르세요.'];
  return ['수동 선택 · 기동 대기','PB1을 눌렀다 놓아 보세요.',s.sensor?'M 위치에서는 FLS 감지 입력만으로 기동하지 않습니다.':'X가 자기유지하고 FR이 M1 → M2+T → 정지 순서를 만듭니다.'];
};
