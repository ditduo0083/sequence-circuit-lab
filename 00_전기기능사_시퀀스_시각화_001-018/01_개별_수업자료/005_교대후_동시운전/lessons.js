window.circuitHints={
  X:'X 코일 ↔ PB1과 병렬인 자기유지 a접점. 자동 감지 또는 수동 PB1으로 X와 T가 함께 여자됩니다.',
  T:'T 코일 ↔ FR 앞 한시 b접점과 MC2 우회 한시 a접점. 완료 시 FR을 끊고 MC2의 별도 경로를 연결합니다.',
  FR:'FR 코일 ↔ MC1 앞 b접점·MC2 앞 a접점. T 완료 전에는 교대하며, 소자되면 b는 닫힘·a는 열림으로 복귀합니다.',
  MC1:'MC1 코일 ↔ M1 주접점과 RL 보조접점. FR b접점이 닫히면 운전하고, T 완료 후에도 계속 운전합니다.',
  MC2:'MC2 코일 ↔ M2 주접점과 GL 보조접점. FR a접점 또는 병렬 T 한시 a접점 중 하나가 닫히면 운전합니다.',
  EOCR:'EOCR ↔ 운전 차단 b접점과 경보 a접점. 트립 시 모터는 정지하고 YL·BZ는 동시에 계속 동작합니다.',
  FLS:'A 위치에서 FLS에 전원을 공급합니다. 감지 접점이 닫히면 공통 운전선에 전원이 연결됩니다.'
};
window.createCircuitLessons=function(model){
  const delay=model.delay,interval=model.interval;
  const fresh=()=>{const m=new CircuitModel();m.set('delay',delay);m.set('interval',interval);return m;};
  const make=(m,title,description,focus,heading=title)=>({snapshot:m.snapshot(),title,description,focus,heading});
  const at=(m,t)=>m.tick(Math.max(0,t-m.elapsed)),before=delay-.01;
  const phaseDescription=m=>`T ${delay}초 전에는 FR이 ${interval}초 간격으로 교대합니다. 현재 ${m.mc1?'FR b접점을 통해 M1·RL':'FR a접점을 통해 M2·GL'}이 켜집니다.`;
  const a=fresh(),auto=[];
  auto.push(make(a,'처음에는 교대, 나중에는 두 모터가 함께 운전합니다.','T의 한시 b접점과 한시 a접점이 서로 다른 경로를 바꾸는 회로입니다. 전원과 정상 접점 상태부터 살펴보세요.','','전원 투입 전 · 도면 005'));
  a.set('power',true);auto.push(make(a,'MCCB를 켜면 EOCR에 전원이 공급됩니다.','EOCR b접점은 닫혀 있지만 X·T와 모터는 기동을 기다립니다.','EOCR','전원 ON · 기동 대기'));
  a.set('mode','A');auto.push(make(a,'A 위치에서 FLS가 감지를 기다립니다.','FLS 전원은 들어오지만 감지 접점은 열려 있습니다. 접점 아래의 공통선은 X·T와 운전부를 함께 공급합니다.','FLS','자동 선택 · 감지 대기'));
  a.set('sensor',true);auto.push(make(a,'감지 즉시 X·T·FR이 여자되고 M1부터 운전합니다.','T 한시 b는 아직 닫혀 FR을 공급합니다. FR의 첫 구간은 b접점 경로이므로 M1·RL이 켜집니다.','FR','감지 동작 · 교대 시작'));
  at(a,Math.min(interval,delay/2));auto.push(make(a,delay<=interval?'이 설정에서는 첫 교대 전에 동시 운전으로 넘어갑니다.':'T가 시간을 세는 동안 FR이 운전 차례를 바꿉니다.',phaseDescription(a),'FR',`T ${a.elapsed}초 · ${a.mc1?'M1':'M2'} 차례`));
  at(a,before);auto.push(make(a,'T 완료 직전까지 교대 운전 경로가 유지됩니다.',phaseDescription(a)+' T 한시 b는 닫힘, 한시 a는 열림입니다.','T','T 완료 직전 · 접점 비교'));
  at(a,delay);auto.push(make(a,'T가 완료되면 두 모터가 함께 운전합니다.','한시 b 열림 → FR 소자 → FR b 복귀로 MC1 여자. 한시 a는 닫혀 FR a를 우회하고 MC2도 여자됩니다.','T','T 완료 · M1 + M2 동시 운전'));
  a.set('sensor',false);auto.push(make(a,'감지를 해제하면 두 모터가 모두 정지합니다.','X·T가 소자되고 T 접점은 복귀합니다. 다시 감지되면 M1부터 교대 운전을 새로 시작합니다.','FLS','감지 해제 · 운전 정지'));
  const m=fresh(),manual=[];m.set('power',true);
  manual.push(make(m,'M 위치에서는 PB1으로 기동합니다.','PB1과 병렬인 X a접점이 자기유지를 담당합니다. PB0는 수동 운전 경로의 정지 버튼입니다.','X','수동 선택 · 기동 대기'));
  m.set('start',true);manual.push(make(m,'PB1을 누르면 M1부터 바로 운전합니다.','X·T·FR이 함께 여자됩니다. X 접점은 자기유지 경로를 만들고 FR은 교대를 시작합니다.','X','PB1 누름 · 교대 시작'));
  m.set('start',false);manual.push(make(m,'PB1을 놓아도 X 접점으로 운전을 유지합니다.','PB0 → X 자기유지 접점 → 공통 운전선이 이어져 T의 계시와 모터 운전이 계속됩니다.','X','PB1 놓음 · X 자기유지'));
  at(m,Math.min(interval,delay/2));manual.push(make(m,delay<=interval?'T가 먼저 완료되므로 M2 단독 차례는 생기지 않습니다.':'T 완료 전에는 두 모터가 번갈아 운전합니다.',phaseDescription(m),'FR',`T ${m.elapsed}초 · ${m.mc1?'M1':'M2'} 차례`));
  at(m,before);manual.push(make(m,'두 T 접점의 현재 상태를 확인합니다.','FR 앞의 한시 b는 닫힘, MC2 우회 경로의 한시 a는 열림입니다. 아직은 FR이 모터 차례를 결정합니다.','T','T 완료 직전 · b 닫힘 / a 열림'));
  at(m,delay);manual.push(make(m,'T 완료 후에는 FR 없이 두 모터가 함께 운전합니다.','FR이 소자되어도 공통 운전선에는 전원이 남습니다. MC1은 FR b, MC2는 T 한시 a를 통해 전원을 받습니다.','T','T 완료 · 동시 운전 유지'));
  m.set('stop',true);manual.push(make(m,'PB0를 누르면 X의 자기유지가 해제됩니다.','공통 운전선이 끊겨 X·T와 모터가 소자됩니다. 타이머와 FR 시간도 초기화됩니다.','X','PB0 누름 · 전체 정지'));
  m.set('stop',false);manual.push(make(m,'PB0를 놓아도 정지 상태를 유지합니다.','PB1을 다시 누르면 M1부터 교대하고, T 설정시간 후 동시 운전으로 전환합니다.','X','PB0 놓음 · 재기동 대기'));
  const e=fresh(),alarm=[];e.set('power',true);e.set('start',true);e.set('start',false);e.tick(delay);
  alarm.push(make(e,'동시 운전 중 과부하가 발생한다고 가정합니다.','현재 T는 완료, FR은 소자 상태입니다. 두 모터는 FR b와 T 한시 a의 서로 다른 경로로 운전합니다.','EOCR','정상 동시 운전 · 과부하 전'));
  e.set('trip',true);alarm.push(make(e,'과부하가 발생하면 모터가 정지하고 YL·BZ가 켜집니다.','EOCR b접점은 운전 전원을 끊습니다. 경보용 a접점이 닫혀 램프와 부저를 함께 켭니다.','EOCR','과부하 · YL + BZ 동작'));
  e.tick(interval*2);alarm.push(make(e,'경보는 교대하지 않고 계속 동작합니다.','YL과 BZ는 경보용 EOCR a접점 뒤에 병렬로 연결됩니다. FR은 경보를 제어하지 않습니다.','EOCR','과부하 유지 · 경보 지속'));
  e.set('trip',false);alarm.push(make(e,'수동에서 RESET하면 기동을 기다립니다.','PB1을 놓은 상태이며 X 자기유지가 해제되어 있으므로 모터는 다시 켜지지 않습니다.','X','수동 RESET · 기동 대기'));
  e.set('mode','A');e.set('sensor',true);alarm.push(make(e,'자동 감지 조건에서는 M1부터 즉시 기동합니다.','X·T·FR이 여자되어 새 교대 운전을 시작합니다. 자동 RESET도 현재 입력 조건을 따릅니다.','FLS','자동 감지 · 교대 시작'));
  e.set('trip',true);alarm.push(make(e,'자동 운전 중에도 과부하는 운전 전원을 끊습니다.','감지 입력은 남아 있지만 FLS와 운전 부하의 전원은 차단됩니다. YL·BZ는 함께 동작합니다.','EOCR','자동 운전 중 과부하'));
  e.set('trip',false);alarm.push(make(e,'감지가 유지되면 RESET 즉시 M1부터 기동합니다.','X·T·FR이 여자되고 T는 0부터 다시 셉니다. 기동 지연 없이 교대 운전이 시작됩니다.','FR','자동 RESET · M1 즉시 기동'));
  e.tick(delay);alarm.push(make(e,'T 설정시간 후에는 다시 동시 운전으로 전환합니다.','FR은 소자되고 MC1·MC2와 RL·GL이 모두 켜집니다. 자동 감지 해제 또는 전원 차단으로 정지합니다.','T','자동 복귀 · 동시 운전'));
  return {auto,manual,alarm};
};
window.explainCircuitState=function(s){
  const mode=s.mode==='A'?'자동':'수동';
  if(!s.power)return ['전원 투입 전 · 도면 005','MCCB가 OFF입니다.','전원을 켜고 A 감지 또는 M의 PB1으로 기동하세요. 처음에는 교대, T 완료 후에는 동시 운전합니다.'];
  if(s.trip)return ['과부하 · YL + BZ 동작','두 모터가 정지하고 램프·부저가 계속 동작합니다.','EOCR b는 열리고 a는 닫혔습니다. 자동 감지 유지 중 RESET하면 M1부터 즉시 재기동합니다.'];
  if(s.done)return [`${mode} · M1 + M2 동시 운전`,'FR은 꺼졌지만 두 모터는 함께 운전합니다.',s.mode==='A'&&s.stop?'PB0는 수동 분기에 있습니다. 자동 운전은 FLS 감지를 해제하면 정지합니다.':'T 한시 b 열림 → FR 소자 → FR b 복귀로 MC1 운전. T 한시 a 닫힘 → MC2 우회 공급.'];
  if(s.fr)return [`${mode} 교대 운전 · ${s.mc1?'M1':'M2'} 차례`,`${s.mc1?'M1·RL':'M2·GL'}이 켜지고 다른 모터는 정지합니다.`,s.mode==='A'&&s.stop?'PB0는 수동 분기에 있으므로 자동 운전은 유지됩니다.':`T는 ${s.delay}초까지 계시 중입니다. FR이 ${s.interval}초 간격으로 교대하며 T 완료 시 동시 운전으로 전환합니다.`];
  if(s.mode==='A')return ['자동 선택 · 감지 대기','FLS에 전원이 공급되고 감지를 기다립니다.','감지되면 X·T·FR과 M1이 바로 켜집니다. 감지를 해제하면 운전과 계시가 초기화됩니다.'];
  if(s.stop)return ['수동 정지 · PB0 누름','PB0가 열려 X 자기유지가 해제되었습니다.','PB0를 놓고 PB1을 다시 누르면 M1부터 교대 운전을 시작합니다.'];
  return ['수동 선택 · 기동 대기','PB1을 눌렀다 놓아 보세요.','X가 자기유지하고 T·FR이 동시에 시간을 셉니다. M1부터 교대하다가 T 완료 후 두 모터가 함께 운전합니다.'];
};
