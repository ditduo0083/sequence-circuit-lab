window.circuitNumber=8;
window.circuitHints={
 X:'자동 감지 시 여자됩니다. X a는 모터 전원을 공급하고 X b는 T 계시를 막아 자동 운전을 계속 유지합니다.',
 T:'PB1 병렬 순시 a접점으로 수동 자기유지합니다. 한시 b가 열리면 두 모터는 정지하지만 T는 계속 여자됩니다.',
 FR:'자동 감지 경로에서 X와 함께 여자됩니다. FR b접점은 황색등 YL을 켜짐부터 주기적으로 점멸시킵니다.',
 MC1:'MC1·MC2 코일은 T 한시 b접점 뒤에 병렬입니다. 같은 시점에 기동·정지합니다.',
 MC2:'MC2와 MC1은 동시에 운전하며 각 보조 a접점으로 GL과 RL을 켭니다.',
 EOCR:'이번 회로의 과부하 경보는 BZ만 동작합니다. YL은 자동 운전 표시등이므로 트립하면 꺼집니다.',
 FLS:'A 감지 시 X·FR과 두 모터를 켭니다. YL은 자동 운전 중 점멸하며 수동 운전에서는 꺼집니다.'};
window.createCircuitLessons=function(model){
  const delay=model.delay,interval=model.interval;
  const fresh=()=>{const m=new CircuitModel();m.set('delay',delay);m.set('interval',interval);return m;};
  const entry=(m,heading,title,description,focus='')=>({snapshot:m.snapshot(),heading,title,description,focus});
  const pulse=m=>{m.set('start',true);m.set('start',false);};
  const a=fresh(),auto=[],m=fresh(),manual=[],e=fresh(),alarm=[];
  auto.push(entry(a,'전원 OFF · 도면 008','자동은 계속 운전, 수동은 설정시간 후 정지합니다.','황색등 YL은 과부하 경보가 아니라 자동 운전 표시등입니다.'));
  a.set('power',true);auto.push(entry(a,'전원 ON · 대기','MCCB를 켜면 EOCR에 전원을 공급합니다.','경보 분기에는 BZ만 연결되어 있습니다.','EOCR'));
  a.set('mode','A');auto.push(entry(a,'A 선택 · 감지 대기','FLS에 전원을 공급합니다.','감지 접점 아래에는 X·FR과 YL 분기가 있습니다.','FLS'));
  a.set('sensor',true);auto.push(entry(a,'자동 감지 · 두 모터 + YL','두 모터가 함께 켜지고 YL은 점등부터 시작합니다.','X a가 모터 전원을 공급합니다. X b는 T를 차단해 시간 정지를 막습니다.','X'));
  a.tick(interval);auto.push(entry(a,'자동 유지 · YL 소등','모터는 계속 운전하고 YL만 꺼집니다.','FR b접점이 열려 YL 경로만 차단합니다.','FR'));
  a.tick(interval);auto.push(entry(a,'자동 유지 · YL 재점등','YL은 주기적으로 켜졌다 꺼집니다.','T는 계시하지 않으며 M1·M2와 RL·GL은 계속 켜집니다.','FR'));
  a.set('sensor',false);auto.push(entry(a,'감지 해제 · 전체 정지','모터와 자동 운전 표시가 함께 꺼집니다.','X·FR이 소자되고 점멸 시간이 초기화됩니다.','FLS'));
  a.set('sensor',true);auto.push(entry(a,'재감지 · YL부터 점등','재감지 시 두 모터와 YL이 다시 켜집니다.','새 FR 주기는 점등 구간부터 시작합니다.','FR'));
  m.set('power',true);manual.push(entry(m,'수동 대기','PB1과 병렬인 T 순시 a접점을 찾으세요.','수동에서는 FR과 YL을 사용하지 않습니다.','T'));
  m.set('start',true);manual.push(entry(m,'PB1 누름 · 두 모터 ON','T와 두 모터가 즉시 켜집니다.','T 한시 b는 아직 닫혀 MC1·MC2에 동시에 전원을 공급합니다.','T'));
  m.set('start',false);manual.push(entry(m,'PB1 놓음 · T 유지','PB1을 놓아도 T 순시 a접점이 자기유지합니다.','전원은 PB0 → T 순시 a → X b → T 코일로 이어집니다.','T'));
  m.tick(delay/2);manual.push(entry(m,'T 계시 중 · 동시 운전','설정시간 전에는 두 모터가 계속 켜져 있습니다.',`T ${delay}초 중 ${delay/2}초가 지났습니다. YL과 FR은 소자 상태입니다.`,'T'));
  m.tick(delay/2);manual.push(entry(m,'T 완료 · 두 모터 정지','T 한시 b가 열려 두 모터가 함께 정지합니다.','T 코일과 순시 자기유지 접점은 계속 여자·닫힘 상태입니다. 모터 정지와 회로 초기화를 구분하세요.','T'));
  pulse(m);manual.push(entry(m,'PB1 재누름 · 정지 유지','PB1을 다시 눌러도 모터는 재기동하지 않습니다.','T가 완료 상태로 자기유지하므로 한시 b가 계속 열려 있습니다. 먼저 PB0로 T를 복귀시켜야 합니다.','T'));
  m.set('stop',true);manual.push(entry(m,'PB0 누름 · T 복귀','PB0가 T 자기유지를 끊고 시간을 초기화합니다.','T 한시 b는 닫힘으로 돌아오지만 기동 전원이 없어 모터는 정지합니다.','T'));
  m.set('stop',false);manual.push(entry(m,'PB0 놓음 · 새 기동 대기','이제 PB1을 누르면 새 시간 운전이 시작됩니다.','PB0 해제만으로는 모터가 켜지지 않습니다.','T'));
  e.set('power',true);e.set('mode','A');e.set('sensor',true);alarm.push(entry(e,'자동 운전 · 과부하 전','YL은 자동 운전 중 점멸하는 표시등입니다.','과부하 경보인 BZ와 연결 경로가 다릅니다.','FR'));
  e.set('trip',true);alarm.push(entry(e,'과부하 · BZ만 동작','모터와 YL은 꺼지고 부저만 울립니다.','EOCR b가 자동 운전 분기를 끊고, 경보 a가 BZ에 전원을 공급합니다.','EOCR'));
  e.tick(interval*2);alarm.push(entry(e,'과부하 유지 · BZ','시간이 지나도 BZ는 계속 켜지고 YL은 꺼져 있습니다.','FR은 소자되어 자동 운전 표시를 하지 않습니다.','EOCR'));
  e.set('trip',false);alarm.push(entry(e,'자동 RESET · 재운전','감지 유지 중 RESET하면 두 모터와 YL이 켜집니다.','FR은 점등 구간부터 다시 시작하고 T는 소자 상태입니다.','X'));
  e.set('mode','M');pulse(e);alarm.push(entry(e,'수동 운전 · YL OFF','수동 운전에서는 모터만 켜지고 YL은 꺼집니다.','T가 수동 운전 시간을 셉니다.','T'));
  e.set('trip',true);alarm.push(entry(e,'수동 중 과부하 · BZ','수동 운전도 차단되고 부저만 울립니다.','T의 자기유지가 해제되고 시간은 초기화됩니다.','EOCR'));
  e.set('trip',false);alarm.push(entry(e,'수동 RESET · 기동 대기','PB1을 놓은 상태에서는 기동을 기다립니다.','자동 감지 입력이 남아 있어도 M 위치에서는 영향을 주지 않습니다.','T'));
  pulse(e);alarm.push(entry(e,'수동 재기동 · 시간 운전','PB1을 누르면 두 모터가 다시 운전합니다.','T를 새로 계시하고 설정시간 뒤 두 모터가 함께 정지합니다.','T'));
  return {auto,manual,alarm};
};
window.circuitReadout=s=>({timer:s.x?'자동 · T 사용 안 함':s.done?'T 완료 · 정지 / 자기유지 중':s.timerOn?'수동 운전 · 정지 시간 계시':'T 대기',fr:s.fr?'FR · YL '+(s.yl?'점등':'소등'):'FR · 자동 표시 대기',next:s.fr?'다음 점멸까지 '+s.remaining.toFixed(1)+'초':s.done?'PB0로 T 복귀 후 재기동':s.timerOn?'정지까지 '+(s.delay-s.elapsed).toFixed(1)+'초':'YL은 자동 운전 표시등'});
window.explainCircuitState=s=>{
 if(!s.power)return ['전원 OFF · 도면 008','MCCB를 켜세요.','자동은 계속 운전과 YL 점멸, 수동은 T 설정시간 뒤 두 모터 정지입니다.'];
 if(s.trip)return ['과부하 · BZ만 동작','모터와 YL은 꺼지고 부저만 울립니다.','YL은 자동 운전 표시등입니다. EOCR 경보 a접점에는 BZ만 연결되어 있습니다.'];
 if(s.x)return ['자동 · 두 모터 / YL '+(s.yl?'점등':'소등'),'두 모터는 계속 운전하며 YL만 점멸합니다.',s.stop?'PB0는 수동 분기에 있습니다. 자동 정지는 FLS 감지를 해제하세요.':'X b가 T를 차단하므로 자동 운전은 T 시간으로 정지하지 않습니다.'];
 if(s.done)return ['수동 시간 완료 · 정지','모터는 꺼졌지만 T 자기유지는 남아 있습니다.','PB1을 다시 눌러도 재기동하지 않습니다. PB0로 T를 복귀시킨 뒤 PB1으로 새 운전을 시작하세요.'];
 if(s.timerOn)return ['수동 시간 운전','두 모터가 함께 운전하고 T가 시간을 셉니다.','T 순시 a는 자기유지, T 한시 b는 두 모터의 시간 정지를 담당합니다.'];
 return [s.mode==='A'?'자동 감지 대기':'수동 기동 대기',s.mode==='A'?'FLS 감지를 켜세요.':'PB1을 눌렀다 놓으세요.','수동 운전에서는 FR과 YL을 사용하지 않습니다.'];
};
