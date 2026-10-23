window.circuitNumber=15;
window.circuitHints={
 X1:'LS1 감지로 여자되는 보조 릴레이입니다. M1은 X1·X2 병렬, M2는 X1·X2 직렬 기동 조건을 사용합니다.',
 X2:'LS2 감지로 여자됩니다. 기동 뒤에는 T 순시 a 자기유지가 센서 조건 전체를 우회합니다.',
 T1:'PB1과 X1 OR X2 기동 조건으로 여자된 뒤 순시 a가 전체 조건을 우회합니다. 한시 b 완료 시 M1을 정지합니다.',
 T2:'PB2와 X1 AND X2 기동 조건으로 여자된 뒤 순시 a가 전체 조건을 우회합니다. 한시 b 완료 시 M2를 정지합니다.',
 LS1:'감지하면 X1이 여자됩니다. 기동 조건에는 쓰이지만 타이머 자기유지 뒤 해제는 운전에 영향을 주지 않습니다.',
 LS2:'감지하면 X2가 여자됩니다. M1은 어느 하나, M2는 둘 모두가 감지되어야 최초 기동합니다.',
 MC1:'T1과 병렬로 여자되어 M1·RL을 켭니다. MC1 b가 열리면 WL 준비등이 꺼집니다.',
 MC2:'T2와 병렬로 여자되어 M2·GL을 켭니다. MC2 b가 열리면 WL 준비등이 꺼집니다.',
 WL:'MC1 b와 MC2 b 직렬입니다. 두 모터가 모두 정지한 준비 상태에서만 점등합니다.',
 EOCR:'트립 시 운전 버스를 끊고 YL을 켭니다. RESET 뒤 모터 자기유지는 복구되지 않습니다.'
};
window.createCircuitLessons=function(model){
 const fresh=()=>{const m=new CircuitModel();m.set('delay1',model.delay1);m.set('delay2',model.delay2);return m;};
 const item=(m,heading,title,description,focus='')=>({snapshot:m.snapshot(),heading,title,description,focus});
 const pulse=(m,key)=>{m.set(key,true);m.set(key,false);};
 const lessons={};
 const a=fresh(),first=[];a.set('power',true);
 first.push(item(a,'전원 ON · WL 준비등','MC1·MC2가 소자되어 WL이 점등합니다.','M1은 LS1 또는 LS2 중 하나 이상을 기동 조건으로 사용합니다.','WL'));
 a.set('ls1',true);first.push(item(a,'LS1만 감지 · OR 기동 준비','X1 하나로 PB1 기동 조건이 성립합니다.','X1·X2 접점은 PB1 뒤에서 병렬입니다.','X1'));
 a.set('start1',true);first.push(item(a,'PB1 누름 · M1 운전','T1·MC1·M1·RL이 켜지고 WL은 소등합니다.','T1 순시 a가 기동 조건 전체를 우회하는 유지 경로를 만듭니다.','T1'));
 a.set('start1',false);a.set('ls1',false);first.push(item(a,'PB1·LS1 해제 · 운전 유지','X1이 소자되어도 T1 순시 a 경로로 M1은 계속 운전합니다.','15번은 기동 뒤 LS 해제가 동작을 바꾸지 않습니다.','T1'));
 a.set('ls2',true);a.set('ls2',false);first.push(item(a,'두 LS 모두 해제','LS1·LS2가 모두 해제되어도 M1 운전은 유지됩니다.','자기유지 접점이 PB와 센서 조건 전체에 병렬입니다.','LS2'));
 a.tick(a.delay1);first.push(item(a,'T1 설정시간 완료','T1 한시 b가 순간 열려 T1·MC1·M1·RL을 정지시킵니다.','MC1 b가 닫혀 WL이 다시 켜집니다.','T1'));
 a.set('stop',true);first.push(item(a,'PB0 · 공통 정지','남아 있는 모든 코일과 시간을 즉시 초기화합니다.','PB0를 놓아도 새 PB 입력 전에는 모터가 재기동하지 않습니다.','PB0'));lessons.branch1=first;

 const b=fresh(),second=[];b.set('power',true);b.set('ls1',true);
 second.push(item(b,'LS1만 감지 · PB2 불성립','X1만 켜져 있어 PB2를 눌러도 M2는 기동하지 않습니다.','M2 최초 기동에는 X1·X2 직렬 AND가 필요합니다.','X1'));
 b.set('start2',true);second.push(item(b,'PB2 누름 · 여전히 대기','X2가 없어 T2·MC2는 여자되지 않습니다.','PB2를 누른 상태에서 LS2가 감지되면 기동 조건이 완성됩니다.','PB2'));
 b.set('ls2',true);second.push(item(b,'LS2 추가 감지 · M2 기동','X1·X2가 모두 닫혀 T2·MC2·M2·GL이 켜집니다.','T2 순시 a가 센서 조건 전체를 우회합니다.','T2'));
 b.set('start2',false);b.set('ls1',false);b.set('ls2',false);second.push(item(b,'PB2·두 LS 해제 · 운전 유지','X1·X2가 모두 소자되어도 T2 자기유지로 M2는 계속 운전합니다.','14번과 가장 크게 다른 지점입니다.','T2'));
 b.tick(b.delay2);second.push(item(b,'T2 설정시간 완료','T2 한시 b가 열려 M2·GL이 정지하고 WL이 켜집니다.','센서가 없어도 완료 전까지 유지되고 완료 뒤 재기동하지 않습니다.','T2'));
 b.set('stop',true);second.push(item(b,'PB0 · 공통 정지','제어회로와 모터를 모두 정지시킵니다.','타이머 잔여 시간도 남지 않습니다.','PB0'));lessons.branch2=second;

 const c=fresh(),mixed=[];c.set('power',true);c.set('ls1',true);c.set('ls2',true);pulse(c,'start1');pulse(c,'start2');
 mixed.push(item(c,'두 LS·두 PB · 두 모터 운전','M1·M2가 함께 운전하고 WL은 소등합니다.','T1·T2 순시 a가 각 기동 조건 전체를 우회합니다.','WL'));
 c.set('ls1',false);mixed.push(item(c,'LS1 해제 · 변화 없음','X1은 소자되지만 두 모터 운전은 유지됩니다.','이미 성립한 T 자기유지가 센서 조건을 우회합니다.','LS1'));
 c.set('ls2',false);mixed.push(item(c,'LS2도 해제 · 변화 없음','X1·X2가 모두 소자되어도 M1·M2는 계속 운전합니다.','원본 동작사항의 “동작의 변화는 없다”를 재현합니다.','LS2'));
 c.tick(c.delay1);mixed.push(item(c,'T1 완료 · M1 정지','M1·RL만 꺼지고 M2·GL은 계속 운전합니다.','MC2 b가 열려 있으므로 WL은 아직 소등입니다.','T1'));
 c.tick(Math.max(0,c.delay2-c.delay1));mixed.push(item(c,'T2 완료 · M2 정지','두 모터가 모두 정지하면서 WL 준비등이 켜집니다.','각 타이머는 자기 분기만 정지합니다.','WL'));
 c.set('stop',true);mixed.push(item(c,'PB0 · 모두 차단','공통 운전 버스가 열려 WL과 모든 코일이 꺼집니다.','PB0 해제 후에는 새 기동 조건과 PB 입력이 필요합니다.','PB0'));lessons.together=mixed;

 const e=fresh(),alarm=[];e.set('power',true);e.set('ls1',true);pulse(e,'start1');
 alarm.push(item(e,'M1 운전 · 보호 전','정상 운전 중 MC1 b가 열려 WL은 소등합니다.','EOCR 운전 b와 경보 a를 비교합니다.','EOCR'));
 e.set('trip',true);alarm.push(item(e,'EOCR 트립 · YL 점등','자기유지와 모터가 모두 정지하고 YL만 켜집니다.','경보 분기는 PB0 앞에서 공급됩니다.','EOCR'));
 e.set('stop',true);alarm.push(item(e,'트립 중 PB0','PB0를 눌러도 YL은 계속 켜집니다.','운전 분기와 경보 분기의 차이입니다.','PB0'));
 e.set('stop',false);e.set('trip',false);alarm.push(item(e,'RESET · 초기 상태','이전 T 자기유지와 시간은 복구되지 않습니다.','현재 LS 조건을 갖추고 PB를 다시 눌러야 합니다.','T1'));
 e.set('stop',true);alarm.push(item(e,'PB0 · 전체 정지','제어회로와 전동기 동작이 모두 멈춥니다.','계시 중 정지 후 늦은 자동 정지는 남지 않습니다.','PB0'));lessons.alarm=alarm;
 return lessons;
};
window.circuitTimerText=(s,i)=>s['timerOn'+i]?'계시 중 · M'+i+' 운전':s.runPower?'기동 조건 대기 · 0초':'전원 차단 · 0초';
window.circuitWLText=s=>s.wl?'두 MC 소자 · 준비등 점등':'운전 중 또는 공통 차단 · WL 소등';
window.explainCircuitState=s=>{
 if(!s.power)return ['전원 OFF · 도면 015','MCCB를 켜면 EOCR과 WL 준비등이 켜집니다.','M1은 OR, M2는 AND로 기동하지만 운전 중 LS 해제 영향은 없습니다.'];
 if(s.trip)return ['과부하 · YL 점등','모든 자기유지와 모터가 정지했습니다.','RESET 뒤에는 기동 조건을 갖추고 PB를 다시 누릅니다.'];
 if(s.stop)return ['PB0 · 공통 정지','두 타이머 자기유지와 모터를 모두 해제합니다.','PB0는 운전 분기만 차단하며 YL 경보와는 분리됩니다.'];
 if(s.mc1&&s.mc2)return ['두 모터 운전','LS 상태가 바뀌어도 타이머 완료 전까지 유지됩니다.','T1·T2가 각 설정시간을 독립적으로 계시합니다.'];
 if(s.mc1)return ['M1 운전 · 조건 우회','T1 순시 a가 PB1과 LS 조건 전체를 우회합니다.','T1 완료 또는 PB0·EOCR 동작 때 정지합니다.'];
 if(s.mc2)return ['M2 운전 · 조건 우회','T2 순시 a가 PB2와 LS 조건 전체를 우회합니다.','T2 완료 또는 PB0·EOCR 동작 때 정지합니다.'];
 return ['기동 대기 · WL 점등','X1 '+(s.x1?'여자':'소자')+' · X2 '+(s.x2?'여자':'소자'),s.x1&&s.x2?'PB1·PB2 모두 기동 가능':s.x1||s.x2?'PB1만 기동 가능':'LS를 먼저 감지하세요.'];
};
