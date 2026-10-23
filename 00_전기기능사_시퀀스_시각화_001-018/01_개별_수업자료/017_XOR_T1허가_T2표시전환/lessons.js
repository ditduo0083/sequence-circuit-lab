window.circuitNumber=17;
window.circuitHints={
 T1:'PB1과 병렬인 순시 a로 M1을 자기유지합니다. 설정시간 뒤 한시 a가 PB2 계통을 허가합니다.',
 T2:'PB2와 병렬인 순시 a로 자기유지합니다. 완료 시 한시 b가 MC2를 끄고 한시 a가 WL을 켭니다.',
 X1:'LS1 감지 때 여자됩니다. M1 XOR 조건에서는 X1 a와 X1 b가 서로 다른 분기에 있습니다.',
 X2:'LS2 감지 때 여자됩니다. M1은 X1과 X2 중 정확히 하나만 여자될 때 허가됩니다.',
 LS1:'X1 코일을 직접 제어합니다. LS2와 감지 상태가 달라야 M1 운전이 가능합니다.',
 LS2:'X2 코일을 직접 제어합니다. LS1과 감지 상태가 같아지면 M1·T1이 정지합니다.',
 MC1:'T1과 병렬로 여자되어 M1을 운전하고 MC1 a로 RL을 켭니다.',
 MC2:'T2 한시 b가 닫힌 동안 M2를 운전하고 MC2 a로 GL을 켭니다.',
 WL:'T2 설정시간이 끝나 한시 a가 닫히면 점등합니다.',
 EOCR:'트립 시 운전 버스를 끊고 경보용 a접점으로 YL을 켭니다.'
};
window.createCircuitLessons=function(model){
 const fresh=()=>{const m=new CircuitModel();m.set('delay1',model.delay1);m.set('delay2',model.delay2);return m;};
 const item=(m,heading,title,description,focus='')=>({snapshot:m.snapshot(),heading,title,description,focus});
 const pulse=(m,key)=>{m.set(key,true);m.set(key,false);};
 const lessons={};

 const a=fresh(),xor=[];a.set('power',true);
 xor.push(item(a,'전원 ON · 입력 대기','EOCR만 공급되고 두 모터는 정지합니다.','LS1은 X1, LS2는 X2 코일을 직접 제어합니다.','EOCR'));
 a.set('ls1',true);xor.push(item(a,'LS1만 감지 · XOR 허가','X1 a·X2 b 직렬 경로가 닫힙니다.','두 센서 중 정확히 하나만 감지되어 PB1 기동이 가능합니다.','X1'));
 a.set('start1',true);xor.push(item(a,'PB1 누름 · M1/T1 기동','MC1·T1이 여자되어 M1이 회전하고 RL이 켜집니다.','T1 순시 a가 PB1과 병렬로 닫힙니다.','PB1'));
 a.set('start1',false);xor.push(item(a,'PB1 놓음 · T1 자기유지','T1 순시 a가 M1·T1 운전을 유지합니다.','XOR 센서 조건은 자기유지 뒤에도 계속 직렬로 유효합니다.','T1'));
 a.set('ls2',true);xor.push(item(a,'LS1·LS2 모두 감지','X1 a·X2 b와 X1 b·X2 a 경로가 모두 열려 M1·T1이 정지합니다.','센서 상태가 같아지면 XOR 조건이 성립하지 않습니다.','X2'));
 a.set('ls1',false);xor.push(item(a,'LS2만 감지 · 반대 XOR 경로','X1 b·X2 a 직렬 경로가 닫혀 PB1 기동이 다시 가능합니다.','이번에는 오른쪽 XOR 분기를 사용합니다.','X1'));
 pulse(a,'start1');xor.push(item(a,'PB1 재기동 · M1 운전','반대 센서 조합에서도 M1·T1이 정상 자기유지됩니다.','두 XOR 분기가 같은 결과를 만드는지 비교하세요.','T1'));
 a.set('ls2',false);xor.push(item(a,'두 센서 모두 해제 · 정지','두 센서가 모두 해제되어도 XOR는 거짓이므로 M1·T1이 정지합니다.','한쪽 감지 상태가 반드시 필요합니다.','LS2'));lessons.branch1=xor;

 const b=fresh(),second=[];b.set('power',true);b.set('ls1',true);pulse(b,'start1');
 second.push(item(b,'M1 운전 · T1 계시','XOR 조건에서 M1·T1이 운전하며 T1은 설정시간을 셉니다.','T1 한시 a는 아직 열려 PB2 계통을 허가하지 않습니다.','T1'));
 b.set('start2',true);second.push(item(b,'T1 완료 전 PB2','PB2를 눌러도 T1 한시 a가 열려 M2는 기동하지 않습니다.','PB2는 T1 설정시간 완료 뒤에만 허가됩니다.','PB2'));
 b.set('start2',false);b.tick(b.delay1);second.push(item(b,'T1 완료 · PB2 허가','T1 한시 a가 닫혔지만 PB2를 누르기 전이라 M2는 정지합니다.','이제 PB2 기동 경로가 준비됐습니다.','T1'));
 b.set('start2',true);second.push(item(b,'PB2 누름 · M2/T2 기동','T2·MC2가 여자되어 M2가 운전하고 GL이 켜집니다.','T2 순시 a가 PB2와 병렬로 자기유지합니다.','PB2'));
 b.set('start2',false);second.push(item(b,'PB2 놓음 · T2 자기유지','T2 순시 a가 M2·T2 운전을 유지합니다.','T1 한시 a 허가는 계속 필요합니다.','T2'));
 b.set('ls2',true);second.push(item(b,'센서 조건 상실 · 전체 운전 정지','LS1·LS2가 모두 감지되어 M1·T1이 소자되고 T1 한시 a도 열립니다.','그 결과 T2·M2도 함께 정지합니다.','LS2'));
 b.set('stop',true);second.push(item(b,'PB0 · 공통 정지','제어회로와 두 전동기 동작이 모두 정지합니다.','계시 시간과 자기유지도 초기화됩니다.','PB0'));lessons.branch2=second;

 const c=fresh(),change=[];c.set('power',true);c.set('ls1',true);pulse(c,'start1');c.tick(c.delay1);pulse(c,'start2');
 change.push(item(c,'M2 기동 · T2 계시','M1·RL과 M2·GL이 함께 켜지고 T2가 계시합니다.','T2 한시 b는 닫힘, 한시 a는 열림입니다.','T2'));
 c.tick(Math.max(0,c.delay2-.1));change.push(item(c,'T2 설정시간 직전','M2·GL은 운전 중이고 WL은 아직 꺼져 있습니다.','한시 접점은 설정시간 전 상태를 유지합니다.','T2'));
 c.tick(.1);change.push(item(c,'T2 완료 · M2에서 WL로 전환','T2 한시 b가 열려 M2·GL이 꺼지고 한시 a가 닫혀 WL이 켜집니다.','T2 코일과 자기유지는 계속 유지됩니다.','WL'));
 c.set('stop',true);change.push(item(c,'PB0 · 완료 상태 해제','T1·T2와 모든 운전 부하가 정지하고 WL도 꺼집니다.','정지 뒤 잔여 계시는 남지 않습니다.','PB0'));
 c.set('stop',false);c.set('start2',true);change.push(item(c,'정지 해제 뒤 PB2','T1 계시가 다시 끝나지 않아 PB2를 눌러도 M2는 기동하지 않습니다.','T1 허가를 처음부터 다시 만들어야 합니다.','T1'));lessons.together=change;

 const e=fresh(),alarm=[];e.set('power',true);e.set('ls1',true);pulse(e,'start1');
 alarm.push(item(e,'M1 운전 · 보호 전','M1·RL과 T1이 운전 중입니다.','EOCR 운전 b와 경보 a의 위치를 확인합니다.','EOCR'));
 e.set('trip',true);alarm.push(item(e,'EOCR 트립 · YL 점등','운전 버스가 끊겨 X·T·MC와 두 모터가 정지하고 YL만 켜집니다.','경보 분기는 PB0 앞에서 공급됩니다.','EOCR'));
 e.set('stop',true);alarm.push(item(e,'트립 중 PB0','PB0를 눌러도 YL은 계속 켜집니다.','EOCR 경보 a 분기가 운전 버스와 분리되어 있습니다.','PB0'));
 e.set('stop',false);e.set('trip',false);alarm.push(item(e,'RESET · 현재 센서 재평가','LS1에 따라 X1은 다시 여자되지만 T1 자기유지는 복구되지 않습니다.','PB1을 새로 눌러야 M1이 기동합니다.','X1'));
 e.set('stop',true);alarm.push(item(e,'PB0 · 전체 정지','제어회로와 전동기 동작이 모두 정지합니다.','실제 설비 전에는 보호장치 사양도 확인해야 합니다.','PB0'));lessons.alarm=alarm;
 return lessons;
};
window.circuitTimerText=(s,i)=>i===1?(s.timerOn1?(s.done1?'완료 · PB2 허가':'M1 운전 · PB2 허가 계시'):s.runPower?'XOR+PB1 대기 · 0초':'전원 차단 · 0초'):(s.timerOn2?(s.done2?'완료 · M2 정지 / WL 점등':'M2 운전 · 전환 계시'):s.runPower?'T1 완료+PB2 대기 · 0초':'전원 차단 · 0초');
window.circuitWLText=s=>s.wl?'T2 완료 · WL 점등':s.timerOn2?'M2 운전 구간 · WL 소등':'전환 계통 정지 · WL 소등';
window.explainCircuitState=s=>{
 if(!s.power)return ['전원 OFF · 도면 017','MCCB를 켜면 EOCR에 전원이 공급됩니다.','LS1→X1, LS2→X2 상태부터 확인하세요.'];
 if(s.trip)return ['과부하 · YL 점등','운전 버스가 차단되어 두 모터가 정지했습니다.','RESET 뒤 현재 센서 입력을 다시 평가합니다.'];
 if(s.stop)return ['PB0 · 공통 정지','X·T·MC와 두 모터를 모두 차단합니다.','PB0를 놓아도 자기유지는 자동 복구되지 않습니다.'];
 if(s.wl)return ['T2 완료 · WL 점등','T2 한시 b가 MC2를 끄고 한시 a가 WL을 켰습니다.','PB0 또는 T1 허가 상실로 정지할 수 있습니다.'];
 if(s.mc1&&s.mc2)return ['두 모터 운전','M1은 T1 순시 a, M2는 T2 순시 a로 자기유지 중입니다.','센서 XOR가 깨지면 T1 허가와 함께 두 계통이 정지합니다.'];
 if(s.mc2)return ['M2 운전 · T2 자기유지','T1 한시 a가 허가하고 T2 한시 b가 닫혀 있습니다.','T2 완료 시 M2·GL에서 WL로 전환됩니다.'];
 if(s.mc1)return ['M1 운전 · XOR 유지','센서 하나만 감지되어 T1 순시 a로 자기유지 중입니다.','T1 완료 뒤 PB2를 누를 수 있습니다.'];
 if(!s.sensorXor)return ['센서 XOR 불성립','LS1·LS2가 둘 다 감지되거나 둘 다 해제되어 M1은 정지합니다.','한쪽 센서만 감지한 뒤 PB1을 누르세요.'];
 return ['센서 XOR 성립 · PB1 대기','X1과 X2 중 정확히 하나만 여자되었습니다.','PB1을 누르면 M1·T1이 기동합니다.'];
};
