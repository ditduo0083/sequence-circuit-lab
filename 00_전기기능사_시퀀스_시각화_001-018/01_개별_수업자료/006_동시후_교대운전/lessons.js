window.circuitNumber=6;
window.circuitHints={
 X:'자동 감지로 X가 여자되면 운전용 a접점은 닫히고, T 코일 앞의 b접점은 열려 자동에서 T 계시를 막습니다.',
 T:'수동 자기유지는 PB1 병렬 T 순시 a접점입니다. 한시 a는 FR 기동, 한시 b는 MC2 동시 운전 경로를 제어합니다.',
 FR:'T 완료 후 수동에서만 교대합니다. MC1측 b접점과 MC2측 a접점이 번갈아 닫힙니다.',
 MC1:'MC1 코일과 RL은 직접 병렬 연결입니다. 원본에는 RL 앞의 MC1 보조접점이 없습니다.',
 MC2:'MC2 코일과 GL도 직접 병렬 연결입니다. T 한시 b 또는 FR a 중 한 경로가 닫히면 함께 켜집니다.',
 EOCR:'운전용 b접점은 트립 시 열리고, 경보용 a접점은 닫혀 YL과 BZ를 동시에 켭니다.',
 FLS:'A에서 전원을 받습니다. 감지 시 X가 여자되고 두 모터가 즉시 함께 운전합니다.'};
window.createCircuitLessons=function(model){
  const delay=model.delay,interval=model.interval;
  const fresh=()=>{const m=new CircuitModel();m.set('delay',delay);m.set('interval',interval);return m;};
  const entry=(m,heading,title,description,focus='')=>({snapshot:m.snapshot(),heading,title,description,focus});
  const pulse=m=>{m.set('start',true);m.set('start',false);};
  const a=fresh(),auto=[],m=fresh(),manual=[],e=fresh(),alarm=[];
  auto.push(entry(a,'전원 OFF · 도면 006','자동은 동시 운전, 수동은 동시 운전 후 교대입니다.','자동과 수동에서 T 코일 앞 X b접점이 어떻게 달라지는지 비교하세요.'));
  a.set('power',true);auto.push(entry(a,'전원 ON · 대기','MCCB를 켜면 EOCR에 전원을 공급합니다.','운전용 b접점은 닫혀 있지만 아직 기동 조건은 없습니다.','EOCR'));
  a.set('mode','A');auto.push(entry(a,'A 선택 · 감지 대기','FLS에 전원을 공급하고 감지를 기다립니다.','FLS 감지 접점 아래에는 X 코일이 있습니다.','FLS'));
  a.set('sensor',true);auto.push(entry(a,'자동 감지 · 두 모터 ON','X가 여자되어 M1·M2가 함께 운전합니다.','X a접점이 운전선을 공급합니다. FR b와 T 한시 b가 닫혀 두 모터와 RL·GL이 켜집니다.','X'));
  a.tick(delay+interval*2);auto.push(entry(a,'자동 유지 · T와 FR OFF','자동에서는 시간이 지나도 두 모터가 함께 운전합니다.','X b접점이 열려 T는 계시하지 않습니다. T 한시 a도 열려 FR이 꺼져 있습니다.','T'));
  a.set('sensor',false);auto.push(entry(a,'감지 해제 · 정지','감지를 해제하면 X와 모터가 소자됩니다.','X a접점이 열려 운전 분기 전원이 끊깁니다.','FLS'));
  a.set('sensor',true);auto.push(entry(a,'재감지 · 두 모터 ON','다시 감지되면 즉시 두 모터가 함께 기동합니다.','자동 운전에는 T의 기동 지연이나 교대 전환이 없습니다.','X'));
  a.set('mode','M');auto.push(entry(a,'M 전환 · 기동 대기','M으로 바꾸면 PB1을 기다립니다.','자동 감지 입력이 남아 있어도 M에서는 FLS 전원이 차단됩니다.','FLS'));
  m.set('power',true);manual.push(entry(m,'수동 대기','PB1과 병렬인 T 순시 a접점을 찾으세요.','수동 자기유지는 X가 아니라 T가 담당합니다.','T'));
  m.set('start',true);manual.push(entry(m,'PB1 누름 · 동시 기동','T와 두 모터가 즉시 켜집니다.','X는 소자이므로 X b가 닫혀 T에 전원을 공급합니다. T 한시 b는 아직 닫혀 있습니다.','T'));
  m.set('start',false);manual.push(entry(m,'PB1 놓음 · T 자기유지','PB1을 놓아도 T와 모터가 유지됩니다.','전원은 PB0 → T 순시 a접점 → X b → T 코일로 이어집니다.','T'));
  m.tick(delay/2);manual.push(entry(m,'T 계시 중 · 동시 운전','설정시간 전에는 두 모터가 함께 운전합니다.',`T ${delay}초 중 ${delay/2}초 경과. FR은 아직 소자 상태입니다.`,'T'));
  m.tick(delay/2);manual.push(entry(m,'T 완료 · M1부터 교대','T 완료 순간에는 M2가 멈추고 M1이 계속 운전합니다.','T 한시 b가 열리고 한시 a가 닫혀 FR이 시작합니다. 첫 구간은 FR b가 닫혀 M1만 켜집니다.','FR'));
  m.tick(interval);manual.push(entry(m,'FR 전환 · M2 차례','다음 구간에는 M1이 멈추고 M2가 운전합니다.',`이후 ${interval}초 간격으로 M1·RL과 M2·GL이 번갈아 켜집니다.`,'FR'));
  m.set('stop',true);manual.push(entry(m,'PB0 누름 · 정지','T 자기유지와 FR 교대가 해제됩니다.','T와 FR의 시간이 초기화되고 두 모터가 정지합니다.','T'));
  m.set('stop',false);manual.push(entry(m,'PB0 놓음 · 대기','PB1을 다시 누르면 동시 운전부터 시작합니다.','PB0를 놓는 것만으로 다시 기동하지 않습니다.','T'));
  e.set('power',true);pulse(e);e.tick(delay+interval);alarm.push(entry(e,'수동 교대 · 과부하 전','M2 운전 중 과부하를 확인합니다.','FR은 모터 교대를 담당하며 경보 회로는 별도의 EOCR 접점입니다.','EOCR'));
  e.set('trip',true);alarm.push(entry(e,'과부하 · YL + BZ','두 모터는 정지하고 YL·BZ가 함께 켜집니다.','EOCR 운전 b는 열리고 경보 a는 닫힙니다.','EOCR'));
  e.tick(interval*2);alarm.push(entry(e,'경보 유지','시간이 지나도 YL·BZ는 계속 켜져 있습니다.','FR은 소자 상태이며 경보를 교대시키지 않습니다.','EOCR'));
  e.set('trip',false);alarm.push(entry(e,'수동 RESET · 대기','수동 RESET 후에는 PB1을 기다립니다.','T 자기유지는 이미 해제되었습니다.','T'));
  e.set('mode','A');e.set('sensor',true);alarm.push(entry(e,'자동 감지 · 동시 운전','자동 감지 상태에서는 두 모터가 즉시 켜집니다.','T·FR은 계시하지 않습니다.','X'));
  e.set('trip',true);alarm.push(entry(e,'자동 중 과부하','자동 운전도 차단되고 YL·BZ가 동작합니다.','감지 입력이 남아 있어도 운전용 EOCR b가 열려 있습니다.','EOCR'));
  e.set('trip',false);alarm.push(entry(e,'자동 RESET · 즉시 동시 기동','감지 유지 중 RESET하면 두 모터가 함께 재기동합니다.','원본 연결에 별도의 재기동 금지 접점은 없습니다.','X'));
  e.tick(delay+interval);alarm.push(entry(e,'자동 유지 · 동시 운전','자동 복귀 후에도 동시 운전을 유지합니다.','X b가 T를 차단하므로 교대 운전으로 넘어가지 않습니다.','T'));
  return {auto,manual,alarm};
};
window.circuitReadout=s=>({timer:s.x?'자동 · T 사용 안 함':s.done?'T 완료 · 교대 운전':s.timerOn?'동시 운전 · T 계시 중':'T 대기',fr:s.fr?'FR · '+(s.mc1?'M1':'M2')+' 차례':s.x?'FR · 소자 / 자동 동시':'FR · 교대 대기',next:s.fr?'다음 전환까지 '+s.remaining.toFixed(1)+'초':s.timerOn?'교대 시작까지 '+(s.delay-s.elapsed).toFixed(1)+'초':s.x?'두 모터 계속 운전':'수동 T 완료 후 시작'});
window.explainCircuitState=s=>{
 if(!s.power)return ['전원 OFF · 도면 006','MCCB를 켜세요.','자동은 즉시 동시 운전, 수동은 동시 운전 후 교대합니다.'];
 if(s.trip)return ['과부하 · YL + BZ','운전은 정지하고 경보는 계속 동작합니다.','자동 감지 유지 중 RESET하면 두 모터가 즉시 함께 재기동합니다.'];
 if(s.x)return ['자동 · 동시 운전','M1·M2와 RL·GL이 함께 켜집니다.',s.stop?'PB0는 수동 분기만 차단합니다. 자동 정지는 FLS 감지를 해제하세요.':'X b가 T를 차단하므로 T·FR은 동작하지 않습니다.'];
 if(s.fr)return ['수동 교대 · '+(s.mc1?'M1':'M2'),'한 모터씩 번갈아 운전합니다.','T는 완료 상태로 유지되고 FR이 설정 간격으로 두 모터를 전환합니다.'];
 if(s.timerOn)return ['수동 · 동시 운전','T 계시 중에는 두 모터가 함께 운전합니다.','T 순시 a가 자기유지합니다. 완료 시 한시 b가 열리고 한시 a가 FR을 켭니다.'];
 return [s.mode==='A'?'자동 감지 대기':'수동 기동 대기',s.mode==='A'?'FLS 감지를 켜세요.':'PB1을 눌렀다 놓으세요.','자동 감지 해제 또는 수동 PB0는 운전 상태와 시간을 초기화합니다.'];
};
