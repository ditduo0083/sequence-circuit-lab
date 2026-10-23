window.circuitHints={
  X:'X 코일 ↔ PB1과 병렬인 자기유지 a접점, FR 공급 분기의 a접점. 두 접점 모두 X와 함께 동작합니다.',
  T:'T 코일 ↔ FR 위의 한시 a접점. X와 함께 계시를 시작하고, 설정시간 뒤 교대 운전을 허용합니다.',
  FR:'FR 코일 ↔ MC1·MC2 앞의 교대 접점. T의 지연이 끝나면 M1부터 시작해 번갈아 운전합니다.',
  MC1:'MC1 코일 ↔ M1 주접점 3개와 RL 앞의 보조 a접점. FR의 M1 차례에만 여자됩니다.',
  MC2:'MC2 코일 ↔ M2 주접점 3개와 GL 앞의 보조 a접점. FR의 M2 차례에만 여자됩니다.',
  EOCR:'EOCR ↔ 운전 차단 b접점과 경보 a접점. 과부하 시 YL·BZ는 동시에 계속 동작합니다.',
  FLS:'FLS 전원 ↔ X·T로 이어지는 감지 접점. A 위치에서 감지 입력에 따라 기동과 정지를 결정합니다.'
};
window.createCircuitLessons=function(model){
  const delay=model.delay,interval=model.interval;
  const fresh=()=>{const m=new CircuitModel();m.set('delay',delay);m.set('interval',interval);return m;};
  const make=(m,title,description,focus,heading=title)=>({snapshot:m.snapshot(),title,description,focus,heading});
  const a=fresh(),auto=[];
  auto.push(make(a,'전원을 넣기 전입니다.','이번 회로는 설정시간을 기다린 뒤 M1과 M2를 번갈아 운전합니다. 먼저 전원 경로를 살펴보세요.','','전원 투입 전 · 도면 ②'));
  a.set('power',true);auto.push(make(a,'MCCB를 켜면 EOCR에 전원이 공급됩니다.','운전용 b접점은 닫혀 있습니다. 아직 X가 여자되지 않았으므로 타이머와 모터는 동작하지 않습니다.','EOCR','전원 ON · 기동 대기'));
  a.set('mode','A');auto.push(make(a,'A를 선택하면 FLS가 감지를 기다립니다.','FLS 전원은 들어왔지만 감지 접점은 열려 있습니다. FLS 접점 아래에서 X와 T가 병렬로 연결된 점을 보세요.','FLS','자동 선택 · 감지 대기'));
  a.set('sensor',true);auto.push(make(a,'수위 감지 시 X와 T가 함께 여자됩니다.','X의 a접점은 닫히지만 T의 한시 접점은 아직 열려 있습니다. 두 모터 모두 설정시간을 기다립니다.','T','감지 동작 · X와 T ON'));
  a.tick(delay);auto.push(make(a,'설정시간이 지나면 M1부터 운전합니다.',`${delay}초 후 T의 한시 a접점이 닫혀 FR에 전원이 공급됩니다. 첫 차례는 MC1·M1이며 RL이 켜집니다.`,'FR','지연 완료 · M1 운전'));
  a.tick(interval);auto.push(make(a,'FR이 전환되면 M1은 멈추고 M2가 운전합니다.',`교대 간격 ${interval}초 후 MC1 경로는 열리고 MC2 경로는 닫힙니다. RL은 꺼지고 GL이 켜집니다.`,'FR','교대 운전 · M2 차례'));
  a.tick(interval);auto.push(make(a,'다음 차례에는 다시 M1이 운전합니다.','X와 T, FR의 전원은 계속 유지됩니다. T를 다시 기다리지 않고 FR만 설정 간격으로 두 모터를 교대시킵니다.','FR','교대 운전 · M1 차례'));
  a.set('sensor',false);auto.push(make(a,'수위 감지가 해제되면 교대 운전이 정지합니다.','X·T 소자 → X와 T 접점 열림 → FR 소자. 타이머와 교대 시간이 초기화되고 두 모터가 정지합니다.','FLS','감지 해제 · 교대 운전 정지'));
  const m=fresh(),manual=[];m.set('power',true);
  manual.push(make(m,'M을 선택하고 PB1으로 기동합니다.','PB1과 병렬로 연결된 접점의 이름은 X입니다. 이 접점이 수동 자기유지를 담당합니다.','X','수동 선택 · 기동 대기'));
  m.set('start',true);manual.push(make(m,'PB1을 누르면 X와 T가 여자됩니다.','X의 두 a접점이 닫힙니다. 타이머 계시는 시작되지만 FR 앞의 T 접점은 열려 있어 두 모터는 정지합니다.','X','PB1 누름 · X와 T ON'));
  m.set('start',false);manual.push(make(m,'PB1을 놓아도 X 접점이 자기유지합니다.','전원은 PB0 → X 자기유지 접점 → X·T 코일로 공급됩니다. 기동 버튼을 계속 누를 필요가 없습니다.','X','PB1 놓음 · X 자기유지'));
  m.tick(delay/2);manual.push(make(m,'설정시간 전에는 두 모터가 모두 대기합니다.',`수업 예시: ${delay}초 중 ${delay/2}초 경과. X는 여자되어 있어도 T의 한시 접점이 아직 교대 운전을 막고 있습니다.`,'T','초기 지연 · 두 모터 대기'));
  m.tick(delay/2);manual.push(make(m,'T의 한시 접점이 닫히면 FR과 MC1이 동작합니다.','M1과 RL이 먼저 켜집니다. 이제부터는 FR의 교대 간격이 M1·M2의 운전 차례를 결정합니다.','FR','지연 완료 · M1 운전'));
  m.tick(interval);manual.push(make(m,'다음 차례에는 M2와 GL이 켜집니다.','M1과 RL은 꺼지고 M2와 GL이 켜집니다. 정상 동작에서는 두 모터가 동시에 운전하지 않습니다.','MC2','교대 운전 · M2 차례'));
  m.set('stop',true);manual.push(make(m,'PB0를 누르면 자기유지와 교대 운전이 해제됩니다.','X·T·FR이 모두 소자되어 두 모터가 정지합니다. 초기 지연 시간과 교대 시간도 0으로 돌아갑니다.','X','PB0 누름 · 운전 정지'));
  m.set('stop',false);manual.push(make(m,'PB0를 놓아도 기동 대기 상태를 유지합니다.','PB1과 X의 자기유지 접점이 열려 있습니다. 다시 PB1을 누르면 처음부터 설정시간을 기다린 뒤 M1이 기동합니다.','X','PB0 놓음 · 재기동 대기'));
  const e=fresh(),alarm=[];e.set('power',true);e.set('start',true);e.set('start',false);e.tick(delay+interval);
  alarm.push(make(e,'M2 차례에 과부하가 발생한다고 가정해 봅니다.','FR은 두 모터의 교대 운전을 담당하고 있습니다. 과부하 경보는 좌측의 별도 EOCR 접점에 연결되어 있습니다.','EOCR','정상 교대 운전 · M2 차례'));
  e.set('trip',true);alarm.push(make(e,'EOCR이 동작하면 YL과 BZ가 함께 켜집니다.','운전용 b접점은 열려 X·T·FR과 모터가 정지합니다. 경보용 a접점은 닫혀 YL과 BZ에 동시에 전원을 공급합니다.','EOCR','과부하 · YL + BZ 동작'));
  e.tick(interval*2);alarm.push(make(e,'시간이 지나도 황색 램프와 부저는 계속 동작합니다.','이번 회로의 경보는 교대하지 않습니다. FR은 이미 소자되어 있고, YL·BZ는 EOCR 접점 뒤에 병렬로 연결되어 있습니다.','EOCR','과부하 유지 · 경보 지속'));
  e.set('trip',false);alarm.push(make(e,'M 위치에서 RESET하면 경보가 해제됩니다.','X의 자기유지는 이미 해제되었습니다. PB1을 놓은 상태이므로 두 모터는 기동을 기다립니다.','X','수동에서 RESET · 기동 대기'));
  e.set('mode','A');e.set('sensor',true);e.tick(delay);alarm.push(make(e,'자동 감지 상태에서 리셋 결과도 살펴봅니다.','A 위치에서 감지 조건이 성립하면 X·T가 동작하고 설정시간 후 교대 운전이 시작됩니다.','FLS','자동 감지 유지 · M1 운전'));
  e.set('trip',true);alarm.push(make(e,'자동 운전 중 과부하가 발생했습니다.','FLS 감지 입력은 남아 있지만 운전 전원은 차단되었습니다. YL·BZ는 동시에 동작합니다.','EOCR','자동 운전 중 과부하'));
  e.set('trip',false);alarm.push(make(e,'감지 조건이 남아 있으면 RESET 후 T가 다시 계시합니다.','경보는 꺼지고 X·T가 여자됩니다. 모터는 즉시 기동하지 않고, 초기 지연 시간을 다시 기다립니다.','T','자동에서 RESET · 초기 지연 재시작'));
  e.tick(delay);alarm.push(make(e,'설정시간 후 M1부터 교대 운전을 다시 시작합니다.','이후에는 FR 설정 간격으로 M1 → M2 → M1 순서가 반복됩니다.','FR','자동 복귀 · M1부터 재운전'));
  return {auto,manual,alarm};
};
window.explainCircuitState=function(s){
  const mode=s.mode==='A'?'자동':'수동';
  if(!s.power)return ['전원 투입 전 · 도면 ②','MCCB가 OFF입니다.','MCCB를 켜고 A 또는 M을 선택하세요. 이번 회로는 초기 지연 뒤 두 모터를 교대 운전합니다.'];
  if(s.trip)return ['과부하 · YL + BZ 동작','모터는 정지하고 YL·BZ가 동시에 동작합니다.','EOCR의 운전용 b접점은 열리고 경보용 a접점은 닫혔습니다. FR은 소자되어 있으며 경보는 교대하지 않습니다.'];
  if(s.fr)return [`${mode} 교대 운전 · ${s.mc1?'M1':'M2'} 차례`,s.mc1?'M1·RL이 켜지고 M2·GL은 꺼져 있습니다.':'M2·GL이 켜지고 M1·RL은 꺼져 있습니다.',s.mode==='A'&&s.stop?'PB0는 수동 분기에 있으므로 자동 교대 운전은 유지됩니다. FLS 감지를 해제하면 정지합니다.':`T는 초기 지연을 마쳤습니다. FR이 ${s.interval}초 간격으로 두 모터를 번갈아 켭니다.`];
  if(s.timerOn)return [`${mode} 운전 준비 · T 계시 중`,'X와 T가 여자되고 두 모터는 설정시간을 기다립니다.',s.mode==='A'?'FLS 감지 접점 → X·T 코일. T의 한시 접점이 닫히면 FR과 M1이 먼저 동작합니다.':s.start?'PB1을 통해 X·T에 전원이 공급됩니다. PB1과 병렬인 X 접점도 닫혀 자기유지 경로가 만들어졌습니다.':'PB1을 놓아도 X 접점이 자기유지합니다. T의 설정시간 후 FR과 M1이 동작합니다.'];
  if(s.mode==='A')return ['자동 선택 · 감지 대기','FLS에 전원이 공급되고 감지를 기다립니다.','감지 입력을 켜면 X·T가 여자됩니다. 감지가 해제되면 자기유지 없이 자동 운전이 정지합니다.'];
  if(s.stop)return ['수동 정지 · PB0 누름','PB0가 열려 X의 자기유지가 해제되었습니다.','X·T·FR과 두 모터가 정지합니다. PB0를 놓고 PB1을 다시 누르면 초기 지연부터 시작합니다.'];
  return ['수동 선택 · 기동 대기','PB1을 눌렀다 놓아 보세요.',s.sensor?'M 위치에서는 감지 입력이 있어도 FLS 전원은 OFF입니다. PB1으로 기동하면 X가 자기유지합니다.':'X가 자기유지하며 T가 시간을 셉니다. 설정시간 후 M1부터 교대 운전을 시작합니다.'];
};
