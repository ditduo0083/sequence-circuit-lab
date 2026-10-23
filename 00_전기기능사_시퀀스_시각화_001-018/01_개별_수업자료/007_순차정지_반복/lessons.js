window.circuitNumber=7;
window.circuitHints={
 X:'PB1 병렬 X a접점이 수동 자기유지합니다. 운전부 상단 X a접점은 FR b접점 분기에 전원을 공급합니다.',
 T:'FR b가 닫힌 첫 구간에만 계시합니다. T 한시 b는 MC1, 한시 a는 MC2를 제어하며 두 번째 구간에는 소자·복귀합니다.',
 FR:'첫 구간에는 b접점이 닫혀 T와 모터 분기를 공급합니다. 두 번째 구간에는 열려 T와 두 모터를 함께 끕니다.',
 MC1:'T 한시 b가 닫힌 동안 M1·RL이 켜집니다. T 설정시간은 FR 간격보다 짧아야 합니다.',
 MC2:'T 한시 a가 닫힌 뒤 M2·GL이 켜집니다. FR b가 열리면 T와 함께 꺼집니다.',
 EOCR:'트립은 운전 전원을 끊고 YL·BZ를 동시에 계속 동작시킵니다.',
 FLS:'자동 감지 접점은 X·FR에 전원을 공급합니다. 감지를 해제하면 순환 시간이 초기화됩니다.'};
window.createCircuitLessons=function(model){
  const delay=model.delay,interval=model.interval;
  const fresh=()=>{const m=new CircuitModel();m.set('delay',delay);m.set('interval',interval);return m;};
  const entry=(m,heading,title,description,focus='')=>({snapshot:m.snapshot(),heading,title,description,focus});
  const pulse=m=>{m.set('start',true);m.set('start',false);};
  const a=fresh(),auto=[],m=fresh(),manual=[],e=fresh(),alarm=[];
  auto.push(entry(a,'전원 OFF · 도면 007','M1 → M2 → 두 모터 정지를 반복합니다.','T는 FR의 첫 구간에만 동작합니다. 설정은 T < FR 조건을 지킵니다.'));
  a.set('power',true);auto.push(entry(a,'전원 ON · 대기','EOCR에 전원을 공급합니다.','아직 X·FR과 모터는 동작하지 않습니다.','EOCR'));
  a.set('mode','A');auto.push(entry(a,'A 선택 · 감지 대기','FLS가 감지를 기다립니다.','감지 접점 아래에는 X와 FR의 공통 전원이 있습니다.','FLS'));
  a.set('sensor',true);auto.push(entry(a,'① M1 운전 · T 계시','감지 즉시 X·FR·T와 M1이 켜집니다.','FR b와 T 한시 b가 모두 닫혀 M1·RL이 켜집니다.','T'));
  a.tick(delay);auto.push(entry(a,'② M2 운전 · T 완료','T 완료 시 M1에서 M2로 전환합니다.','T 한시 b가 열리고 한시 a가 닫힙니다. FR b는 아직 닫혀 있어 M2·GL이 켜집니다.','T'));
  a.tick(interval-delay);auto.push(entry(a,'③ 두 모터 정지 · T 복귀','FR b가 열리면 T와 두 모터가 모두 꺼집니다.','X·FR은 여자 상태지만 출력 분기 전원은 끊깁니다. T는 0초로 초기화됩니다.','FR'));
  a.tick(interval);auto.push(entry(a,'① M1 재운전 · 새 주기','다음 FR 구간에서 M1부터 다시 운전합니다.','FR b가 닫히고 T는 새로 계시합니다. ① → ② → ③을 반복합니다.','FR'));
  a.set('sensor',false);auto.push(entry(a,'감지 해제 · 전체 정지','감지 해제는 순환을 끝내고 시간을 초기화합니다.','X·FR까지 소자되는 정지이며, 주기 안의 휴지 구간과 구별하세요.','FLS'));
  m.set('power',true);manual.push(entry(m,'수동 대기','PB1과 병렬인 X a접점이 자기유지합니다.','기동하면 자동과 같은 세 단계가 반복됩니다.','X'));
  m.set('start',true);manual.push(entry(m,'PB1 누름 · ① M1','X·FR·T와 M1이 즉시 여자됩니다.','FR 첫 구간에서는 T 한시 b가 MC1 경로를 연결합니다.','X'));
  m.set('start',false);manual.push(entry(m,'PB1 놓음 · X 유지','PB1을 놓아도 X 자기유지로 순환합니다.','T는 FR b 뒤에 있으므로 계속 여자되는 코일은 아닙니다.','X'));
  m.tick(delay);manual.push(entry(m,'② M2 · T 완료','T 완료 후 M2가 운전합니다.',`M2 구간은 기본적으로 FR ${interval}초 중 T ${delay}초를 제외한 ${Number((interval-delay).toFixed(2))}초입니다.`,'T'));
  m.tick(interval-delay);manual.push(entry(m,'③ 정지 · FR 두 번째 구간','T와 두 모터가 모두 소자됩니다.',`FR은 여자되어 다음 ${interval}초 구간을 셉니다. X 자기유지도 유지됩니다.`,'FR'));
  m.tick(interval);manual.push(entry(m,'① M1 · 반복','FR b가 닫혀 M1과 T가 다시 켜집니다.','T가 새로 시간을 세며 같은 순환이 이어집니다.','T'));
  m.set('stop',true);manual.push(entry(m,'PB0 누름 · 순환 종료','PB0가 X의 자기유지를 끊습니다.','X·FR·T와 모터가 모두 소자되고 순환 시간이 초기화됩니다.','X'));
  m.set('stop',false);manual.push(entry(m,'PB0 놓음 · 기동 대기','PB1을 다시 누르면 ① M1부터 시작합니다.','PB0 해제만으로는 순환을 재개하지 않습니다.','X'));
  e.set('power',true);pulse(e);e.tick(delay);alarm.push(entry(e,'② M2 · 과부하 전','M2 운전 중 과부하를 확인합니다.','운전 전원과 별도 경보 분기의 연결을 비교하세요.','EOCR'));
  e.set('trip',true);alarm.push(entry(e,'과부하 · YL + BZ','운전은 차단되고 경보는 함께 동작합니다.','X·FR·T는 소자되고 시간은 초기화됩니다.','EOCR'));
  e.tick(interval*2);alarm.push(entry(e,'경보 유지','YL·BZ는 시간이 지나도 계속 동작합니다.','경보는 FR의 순환과 무관합니다.','EOCR'));
  e.set('trip',false);alarm.push(entry(e,'수동 RESET · 대기','PB1을 놓은 수동 상태는 기동을 기다립니다.','자기유지는 트립 때 해제되었습니다.','X'));
  e.set('mode','A');e.set('sensor',true);alarm.push(entry(e,'자동 감지 · ① M1','자동 감지 시 M1부터 바로 시작합니다.','T와 FR은 0초부터 계시합니다.','FLS'));
  e.set('trip',true);alarm.push(entry(e,'자동 중 과부하','자동 운전도 차단되고 YL·BZ가 켜집니다.','감지 입력이 남아 있어도 EOCR b가 운전 전원을 끊습니다.','EOCR'));
  e.set('trip',false);alarm.push(entry(e,'자동 RESET · ① M1','감지 유지 중 RESET하면 M1부터 즉시 재기동합니다.','이전 주기의 잔여시간을 이어 쓰지 않습니다.','T'));
  e.tick(delay);alarm.push(entry(e,'자동 복귀 · ② M2','T 설정시간 뒤 M2로 전환합니다.','다음에는 두 모터 정지 구간을 거쳐 M1로 돌아갑니다.','T'));
  return {auto,manual,alarm};
};
window.circuitReadout=s=>({timer:s.timerOn?(s.done?'T 완료 · M2 운전':'T 계시 · M1 운전'):s.fr?'T 소자 · 0초로 복귀':'T 대기 · T < FR',fr:s.fr?(s.phase===1?'FR · ③ 정지 구간':s.done?'FR · ② M2 구간':'FR · ① M1 구간'):'FR · 순환 대기',next:s.fr?(s.phase===1?'M1까지 '+s.remaining.toFixed(1):s.done?'정지까지 '+s.remaining.toFixed(1):'M2까지 '+Math.max(0,s.delay-s.elapsed).toFixed(1))+'초':'기동 즉시 M1부터'});
window.explainCircuitState=s=>{
 if(!s.power)return ['전원 OFF · 도면 007','MCCB를 켜세요.','T < FR 조건으로 M1 → M2 → 정지를 반복합니다.'];
 if(s.trip)return ['과부하 · YL + BZ','모터는 정지하고 경보는 계속 동작합니다.','수동 RESET은 PB1 대기, 자동 감지 유지 RESET은 즉시 M1부터 재기동합니다.'];
 if(s.fr&&s.phase===1)return ['③ 두 모터 정지','FR b가 열려 T와 모터 분기를 차단했습니다.','X·FR은 계속 여자되어 있습니다. T는 소자·복귀하고 다음 구간에서 M1부터 새로 시작합니다.'];
 if(s.mc2)return ['② M2 운전','T 한시 a는 닫힘, 한시 b는 열림입니다.','FR b는 아직 닫혀 M2·GL이 켜집니다. FR 간격이 끝나면 T와 두 모터가 꺼집니다.'];
 if(s.mc1)return ['① M1 운전','FR b와 T 한시 b가 닫혀 M1·RL이 켜집니다.','T 설정시간 후 M2로 전환하고, FR 구간이 끝나면 두 모터가 정지합니다.'];
 return [s.mode==='A'?'자동 감지 대기':'수동 기동 대기',s.mode==='A'?'FLS 감지를 켜세요.':'PB1을 눌렀다 놓으세요.','T와 FR의 시간을 바꾸어 세 구간의 길이를 비교할 수 있습니다.'];
};
