window.circuitNumber=16;
window.circuitHints={
 T1:'LS1 감지로 즉시 여자됩니다. 순시 a는 M2 허가, 한시 a는 설정시간 후 M1 자동 기동에 사용합니다.',
 T2:'LS2 감지로 여자됩니다. 순시 a는 X2를 기동하고, 한시 b/a는 설정시간 후 M2 정지와 WL 점등을 전환합니다.',
 X1:'PB1 또는 T1 한시 a로 여자된 뒤 X1 a접점으로 M1 운전을 자기유지합니다.',
 X2:'PB2 또는 T2 순시 a로 기동되며 X2 a로 자기유지합니다. 단, T1 순시 a 허가가 계속 필요합니다.',
 LS1:'T1 코일을 직접 제어합니다. 해제 후에도 이미 여자된 X1의 M1 운전은 유지되지만 M2 허가는 사라집니다.',
 LS2:'T2 코일을 직접 제어합니다. 감지 중 설정시간 후 M2가 정지하고 WL이 켜지며, 해제하면 M2가 재운전합니다.',
 MC1:'X1과 병렬로 여자되어 M1을 운전하고 MC1 a로 RL을 켭니다.',
 MC2:'T2 한시 b가 닫힌 동안 M2를 운전하고 MC2 a로 GL을 켭니다.',
 WL:'X2 유지 상태에서 T2 설정시간이 끝나 한시 a가 닫히면 점등합니다.',
 EOCR:'트립 시 운전 버스를 끊고 경보용 a접점으로 YL을 켭니다.'
};
window.createCircuitLessons=function(model){
 const fresh=()=>{const m=new CircuitModel();m.set('delay1',model.delay1);m.set('delay2',model.delay2);return m;};
 const item=(m,heading,title,description,focus='')=>({snapshot:m.snapshot(),heading,title,description,focus});
 const pulse=(m,key)=>{m.set(key,true);m.set(key,false);};
 const lessons={};

 const a=fresh(),first=[];a.set('power',true);
 first.push(item(a,'전원 ON · EOCR 대기','EOCR만 공급되고 두 모터와 표시등은 꺼져 있습니다.','LS1은 T1, LS2는 T2 코일을 직접 제어합니다.','EOCR'));
 a.set('start1',true);first.push(item(a,'PB1 누름 · M1 즉시 기동','X1·MC1·M1·RL이 켜집니다.','PB1과 X1 a는 병렬이므로 버튼을 놓아도 운전이 유지됩니다.','PB1'));
 a.set('start1',false);first.push(item(a,'PB1 놓음 · X1 자기유지','X1 a가 PB1을 우회해 M1·RL을 계속 운전합니다.','LS1 상태와 무관한 수동 기동 경로입니다.','X1'));
 a.set('stop',true);first.push(item(a,'PB0 · 수동 운전 정지','공통 운전 버스가 열려 X1·MC1과 M1이 정지합니다.','PB0를 놓으면 새 입력을 다시 평가합니다.','PB0'));
 a.set('stop',false);a.set('ls1',true);first.push(item(a,'LS1 감지 · T1 계시','T1 코일과 T1 순시 a가 즉시 켜지고 M1은 아직 정지합니다.','설정시간이 지나면 T1 한시 a가 M1을 자동 기동합니다.','T1'));
 a.tick(a.delay1);first.push(item(a,'T1 설정시간 완료 · M1 자동 기동','T1 한시 a가 닫혀 X1·MC1·M1·RL이 켜집니다.','X1 a가 즉시 자기유지 경로를 만듭니다.','T1'));
 a.set('ls1',false);first.push(item(a,'LS1 해제 · M1 변화 없음','T1은 소자되지만 X1 자기유지로 M1·RL은 계속 켜집니다.','원본 동작사항의 “M1 동작 변화 없음”을 재현합니다.','X1'));
 a.set('stop',true);first.push(item(a,'PB0 · 전체 정지','자기유지와 잔여 시간이 모두 초기화됩니다.','PB0 해제 뒤 자동 재기동은 현재 LS 입력에 따릅니다.','PB0'));lessons.branch1=first;

 const b=fresh(),second=[];b.set('power',true);
 second.push(item(b,'LS1 해제 · M2 허가 없음','PB2를 눌러도 T1 순시 a가 열려 있어 M2는 기동하지 않습니다.','M2 분기의 공통 허가는 LS1→T1 순시 a입니다.','T1'));
 b.set('start2',true);second.push(item(b,'PB2 누름 · 기동 불가','PB2는 닫혔지만 T1 순시 a가 열려 X2·MC2는 꺼져 있습니다.','LS1을 감지하면 같은 PB2 입력으로 기동 경로가 완성됩니다.','PB2'));
 b.set('ls1',true);second.push(item(b,'LS1 감지 · M2 기동','T1 순시 a가 닫혀 X2·MC2·M2·GL이 켜집니다.','X2 a가 PB2를 우회하는 자기유지 경로를 만듭니다.','X2'));
 b.set('start2',false);second.push(item(b,'PB2 놓음 · X2 자기유지','LS1이 감지된 동안 X2 a로 M2·GL이 계속 운전합니다.','T2는 LS2가 해제되어 계시하지 않습니다.','X2'));
 b.set('ls1',false);second.push(item(b,'LS1 해제 · M2 정지','T1 순시 a 허가가 열려 X2·MC2·M2·GL이 모두 꺼집니다.','X2 자기유지는 T1 허가 접점을 우회하지 않습니다.','LS1'));
 b.set('ls1',true);pulse(b,'start2');second.push(item(b,'LS1 감지 후 PB2 재기동','X2·MC2·M2·GL이 다시 켜집니다.','PB2와 X2 a의 병렬 관계를 확인하세요.','PB2'));
 b.set('stop',true);second.push(item(b,'PB0 · 공통 정지','T1·X2·MC2와 두 모터 운전이 모두 차단됩니다.','경보 분기는 별도로 확인합니다.','PB0'));lessons.branch2=second;

 const c=fresh(),change=[];c.set('power',true);c.set('ls1',true);c.set('ls2',true);
 change.push(item(c,'LS1·LS2 감지 · M2 자동 기동','T1·T2가 여자되고 T2 순시 a로 X2·MC2·M2·GL이 켜집니다.','T1 순시 a가 M2 분기를 허가하며 T2는 전환 시간을 계시합니다.','T2'));
 c.tick(Math.max(0,c.delay2-.1));change.push(item(c,'T2 설정시간 직전','M2·GL이 운전 중이고 WL은 아직 꺼져 있습니다.','T2 한시 b는 닫힘, 한시 a는 열림 상태입니다.','T2'));
 c.tick(.1);change.push(item(c,'T2 완료 · M2에서 WL로 전환','T2 한시 b가 열려 MC2·M2·GL이 꺼지고 한시 a가 닫혀 WL이 켜집니다.','X2 자기유지는 유지되어 전환 회로에 전원이 남습니다.','WL'));
 c.set('ls2',false);change.push(item(c,'LS2 해제 · M2 재운전','T2가 소자되어 한시 b는 닫히고 한시 a는 열립니다.','MC2·M2·GL이 다시 켜지고 WL은 꺼집니다.','LS2'));
 c.set('ls2',true);change.push(item(c,'LS2 재감지 · 새로 계시','T2가 0초부터 다시 계시하며 M2는 설정시간까지 운전합니다.','이전 완료 시간은 남지 않습니다.','T2'));
 c.set('ls1',false);change.push(item(c,'LS1 해제 · M2 계통 차단','T1 순시 a가 열려 X2·MC2·WL 계통이 모두 정지합니다.','M1이 이미 X1로 유지 중이면 M1에는 영향이 없습니다.','LS1'));
 c.set('stop',true);change.push(item(c,'PB0 · 전체 정지','운전 회로와 전동기 동작이 모두 멈춥니다.','두 타이머의 잔여 시간도 초기화됩니다.','PB0'));lessons.together=change;

 const e=fresh(),alarm=[];e.set('power',true);pulse(e,'start1');e.set('ls1',true);pulse(e,'start2');
 alarm.push(item(e,'두 모터 운전 · 보호 전','M1·RL과 M2·GL이 켜진 상태입니다.','EOCR 운전 b와 경보 a의 위치를 확인합니다.','EOCR'));
 e.set('trip',true);alarm.push(item(e,'EOCR 트립 · YL 점등','운전 버스가 끊겨 T·X·MC와 두 모터가 정지하고 YL만 켜집니다.','경보 분기는 PB0 앞에서 공급됩니다.','EOCR'));
 e.set('stop',true);alarm.push(item(e,'트립 중 PB0','PB0를 눌러도 YL은 계속 켜집니다.','EOCR 경보 a 분기가 운전 버스와 분리되어 있기 때문입니다.','PB0'));
 e.set('stop',false);e.set('trip',false);alarm.push(item(e,'RESET · 현재 LS 재평가','T1이 다시 계시하고, LS1이 남아 있어도 X1 수동 자기유지는 복구되지 않습니다.','LS2가 해제 상태이므로 M2도 새 PB2 또는 LS2 감지를 기다립니다.','T1'));
 e.set('stop',true);alarm.push(item(e,'PB0 · 전체 정지','제어회로와 전동기 동작이 모두 정지합니다.','계시 중 정지 뒤 지연 동작은 남지 않습니다.','PB0'));lessons.alarm=alarm;
 return lessons;
};
window.circuitTimerText=(s,i)=>i===1?(s.timerOn1?(s.done1?'완료 · M1 기동 접점 닫힘':'LS1 감지 · M1 지연 계시'):s.runPower?'LS1 감지 대기 · 0초':'전원 차단 · 0초'):(s.timerOn2?(s.done2?'완료 · M2 정지 / WL 점등':'LS2 감지 · 전환 계시'):s.runPower?'LS2 감지 대기 · 0초':'전원 차단 · 0초');
window.circuitWLText=s=>s.wl?'T2 완료 · WL 점등':s.x2?'M2 운전 구간 · WL 소등':'전환 계통 정지 · WL 소등';
window.explainCircuitState=s=>{
 if(!s.power)return ['전원 OFF · 도면 016','MCCB를 켜면 EOCR에 전원이 공급됩니다.','LS1은 T1, LS2는 T2를 직접 제어합니다.'];
 if(s.trip)return ['과부하 · YL 점등','운전 버스가 차단되어 두 모터가 정지했습니다.','RESET 뒤 현재 LS 입력부터 다시 평가합니다.'];
 if(s.stop)return ['PB0 · 공통 정지','T·X·MC와 두 모터를 모두 차단합니다.','PB0를 놓으면 유지 중인 LS 입력은 다시 반영됩니다.'];
 if(s.wl)return ['T2 완료 · WL 점등','T2 한시 b가 MC2를 끄고 한시 a가 WL을 켰습니다.','LS2를 해제하면 M2가 다시 운전하고 WL은 꺼집니다.'];
 if(s.mc1&&s.mc2)return ['두 모터 운전','M1은 X1, M2는 X2로 자기유지 중입니다.','M2는 T1 순시 a 허가와 T2 전환 상태의 영향을 받습니다.'];
 if(s.mc1)return ['M1 운전 · X1 자기유지','PB1 또는 T1 완료로 기동했습니다.','LS1을 해제해도 X1 a로 계속 운전합니다.'];
 if(s.mc2)return ['M2 운전 · X2 자기유지','T1 순시 a가 허가하고 T2 한시 b가 닫혀 있습니다.','T2 완료 또는 LS1 해제 시 M2가 정지합니다.'];
 if(s.timerOn1)return ['T1 계시 중','LS1 감지로 T1이 여자되었습니다.','완료 시 T1 한시 a가 M1을 자동 기동합니다.'];
 return ['전원 ON · 입력 대기','EOCR은 정상이고 운전 회로는 입력을 기다립니다.','PB1 또는 LS1/LS2 감지를 선택하세요.'];
};
