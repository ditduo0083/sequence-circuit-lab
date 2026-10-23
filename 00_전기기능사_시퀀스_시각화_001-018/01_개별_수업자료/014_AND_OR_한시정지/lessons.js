window.circuitNumber=14;
window.circuitHints={
 X1:'LS1 감지로 여자되는 보조 릴레이입니다. 1번 AND 조건과 2번 OR 조건에 각각 접점을 제공합니다.',
 X2:'LS2 감지로 여자되는 보조 릴레이입니다. X1과 함께 M1에는 직렬, M2에는 병렬 조건을 만듭니다.',
 T1:'PB1을 놓은 뒤 순시 a로 자기유지하고, 설정시간 후 한시 b가 열려 MC1·T1을 함께 소자시킵니다.',
 T2:'PB2를 놓은 뒤 순시 a로 자기유지하고, 설정시간 후 한시 b가 열려 MC2·T2를 함께 소자시킵니다.',
 LS1:'감지하면 X1이 여자됩니다. 14번에서는 운전 중 해제도 해당 X 접점 조건을 즉시 바꿉니다.',
 LS2:'감지하면 X2가 여자됩니다. M1은 LS1·LS2 모두, M2는 어느 하나 이상을 요구합니다.',
 MC1:'T1과 병렬로 여자되어 M1·RL을 켭니다. MC1 b는 WL 준비등을 끕니다.',
 MC2:'T2와 병렬로 여자되어 M2·GL을 켭니다. MC2 b는 WL 준비등을 끕니다.',
 WL:'MC1 b와 MC2 b의 직렬입니다. 두 모터가 모두 정지한 준비 상태에서만 점등합니다.',
 EOCR:'트립 시 운전 버스를 끊어 X·T·MC를 모두 소자하고 경보용 a접점으로 YL을 켭니다.'
};
window.createCircuitLessons=function(model){
 const fresh=()=>{const m=new CircuitModel();m.set('delay1',model.delay1);m.set('delay2',model.delay2);return m;};
 const item=(m,heading,title,description,focus='')=>({snapshot:m.snapshot(),heading,title,description,focus});
 const pulse=(m,key)=>{m.set(key,true);m.set(key,false);};
 const lessons={};
 const a=fresh(),first=[];a.set('power',true);
 first.push(item(a,'전원 ON · WL 준비등','MC1·MC2가 모두 소자되어 WL이 점등합니다.','LS1과 LS2가 X1·X2 릴레이를 각각 제어합니다.','WL'));
 a.set('ls1',true);first.push(item(a,'LS1만 감지','X1은 켜지지만 PB1을 눌러도 M1은 기동하지 않습니다.','M1 분기의 X1·X2 접점은 직렬 AND 조건입니다.','X1'));
 a.set('ls2',true);first.push(item(a,'LS1·LS2 모두 감지','X1·X2가 모두 여자되어 PB1 기동 조건이 완성됩니다.','아직 PB1을 누르지 않아 WL은 계속 켜져 있습니다.','X2'));
 a.set('start1',true);first.push(item(a,'PB1 누름 · M1 운전','T1·MC1·M1·RL이 켜지고 MC1 b가 열려 WL은 소등합니다.','T1 순시 a도 즉시 닫혀 PB1을 우회합니다.','T1'));
 a.set('start1',false);first.push(item(a,'PB1 놓음 · T1 자기유지','PB1을 놓아도 T1 순시 a가 운전을 유지합니다.','단, X1·X2 직렬 조건은 계속 남아 있습니다.','T1'));
 a.set('ls1',false);first.push(item(a,'LS1 해제 · M1 즉시 정지','X1 접점이 열려 T1·MC1·M1·RL이 소자되고 WL이 다시 켜집니다.','14번은 운전 중 센서 조건 변화가 즉시 반영됩니다.','LS1'));
 a.set('ls1',true);pulse(a,'start1');a.tick(a.delay1);first.push(item(a,'T1 설정시간 완료','T1 한시 b가 순간 열려 T1·MC1과 M1을 정지시킵니다.','T1 소자 뒤 순시 자기유지도 열려 재기동하지 않습니다.','T1'));
 a.set('stop',true);first.push(item(a,'PB0 · 공통 정지','X1·X2를 포함한 운전 버스가 차단되고 WL도 꺼집니다.','PB0를 놓으면 센서 릴레이와 WL은 현재 입력을 다시 평가합니다.','PB0'));lessons.branch1=first;
 const b=fresh(),second=[];b.set('power',true);b.set('ls1',true);
 second.push(item(b,'LS1만 감지 · OR 조건 성립','X1 하나만 켜져도 M2 기동 조건이 성립합니다.','2번 분기의 X1·X2 접점은 병렬 OR입니다.','X1'));
 b.set('start2',true);second.push(item(b,'PB2 누름 · M2 운전','T2·MC2·M2·GL이 켜지고 WL은 소등합니다.','T2 순시 a가 PB2를 우회합니다.','T2'));
 b.set('start2',false);second.push(item(b,'PB2 놓음 · T2 자기유지','X1이 감지된 동안 M2 운전이 유지됩니다.','PB2만 우회하며 센서 OR 조건은 계속 남습니다.','T2'));
 b.set('ls1',false);second.push(item(b,'모든 LS 해제 · M2 정지','X1·X2가 모두 소자되어 OR 경로가 끊깁니다.','T2·MC2·M2·GL이 꺼지고 WL이 켜집니다.','LS1'));
 b.set('ls2',true);pulse(b,'start2');second.push(item(b,'LS2만 감지 · 재기동','X2 하나만으로도 PB2 경로가 성립하여 M2가 운전합니다.','LS1과 LS2 어느 쪽이든 하나 이상이면 됩니다.','X2'));
 b.set('ls1',true);second.push(item(b,'두 LS 모두 감지','M2 운전은 그대로이며 병렬 경로가 두 갈래 모두 닫힙니다.','한 접점이 열려도 다른 접점이 남아 운전을 유지합니다.','X2'));
 b.tick(b.delay2);second.push(item(b,'T2 설정시간 완료','T2 한시 b가 열려 M2·GL이 정지하고 WL이 켜집니다.','센서가 남아 있어도 새 PB2 입력 전에는 재기동하지 않습니다.','T2'));
 b.set('stop',true);second.push(item(b,'PB0 · 공통 정지','모든 제어 코일과 표시가 정지 상태로 돌아갑니다.','EOCR 경보 분기는 별도로 확인합니다.','PB0'));lessons.branch2=second;
 const c=fresh(),mixed=[];c.set('power',true);c.set('ls1',true);c.set('ls2',true);pulse(c,'start1');pulse(c,'start2');
 mixed.push(item(c,'두 LS·두 PB · 두 모터 운전','M1과 M2가 동시에 운전하고 WL은 소등합니다.','T1과 T2는 서로 독립적으로 계시합니다.','WL'));
 c.set('ls1',false);mixed.push(item(c,'LS1 해제 · M1만 정지','M1의 AND 경로는 끊기지만 M2의 OR 경로에는 X2가 남습니다.','RL은 꺼지고 GL은 켜진 상태입니다.','LS1'));
 c.set('ls2',false);mixed.push(item(c,'LS2도 해제 · M2 정지','OR 경로까지 모두 열려 두 모터가 정지하고 WL이 켜집니다.','AND와 OR 조건의 차이를 접점 흐름으로 비교하세요.','WL'));
 c.set('ls1',true);c.set('ls2',true);pulse(c,'start1');pulse(c,'start2');c.tick(c.delay1);mixed.push(item(c,'T1 먼저 완료','M1은 자동 정지하지만 T2·M2는 계속 계시·운전합니다.','MC1 b가 닫혀도 MC2 b가 열려 WL은 아직 꺼져 있습니다.','MC1'));
 c.tick(Math.max(0,c.delay2-c.delay1));mixed.push(item(c,'T2도 완료','두 모터가 모두 정지해 MC1 b·MC2 b가 닫히고 WL이 점등합니다.','각 타이머 완료가 자기 분기만 정지시킵니다.','WL'));
 c.set('stop',true);mixed.push(item(c,'PB0 · 모두 차단','공통 운전 버스가 열려 센서 릴레이까지 소자됩니다.','버튼을 놓으면 현재 LS 상태로 X1·X2와 WL만 복귀합니다.','PB0'));lessons.together=mixed;
 const e=fresh(),alarm=[];e.set('power',true);e.set('ls1',true);e.set('ls2',true);pulse(e,'start1');
 alarm.push(item(e,'M1 운전 · 보호 전','EOCR 운전 b와 경보 a의 위치를 확인합니다.','정상 운전 중 WL은 MC1 b 때문에 소등합니다.','EOCR'));
 e.set('trip',true);alarm.push(item(e,'EOCR 트립 · YL 점등','X·T·MC와 모터가 모두 정지하고 YL만 켜집니다.','EOCR 코일과 경보 분기는 PB0 앞에서 공급됩니다.','EOCR'));
 e.set('stop',true);alarm.push(item(e,'트립 중 PB0','PB0를 눌러도 YL은 계속 켜집니다.','운전 분기와 경보 분리가 화면 통전 경로에 표시됩니다.','PB0'));
 e.set('stop',false);e.set('trip',false);alarm.push(item(e,'RESET · 현재 LS 재평가','X1·X2와 WL은 다시 켜지지만 모터 자기유지는 복구되지 않습니다.','재운전에는 PB1 또는 PB2가 필요합니다.','X1'));
 e.set('stop',true);alarm.push(item(e,'PB0 · 전체 정지','제어회로와 전동기 동작이 모두 멈춥니다.','계시 중이던 시간도 남지 않습니다.','PB0'));lessons.alarm=alarm;
 return lessons;
};
window.circuitTimerText=(s,i)=>s['timerOn'+i]?'계시 중 · M'+i+' 운전':s.runPower?'기동 조건 대기 · 0초':'전원 차단 · 0초';
window.circuitWLText=s=>s.wl?'두 MC 소자 · 준비등 점등':'운전 중 또는 공통 차단 · WL 소등';
window.explainCircuitState=s=>{
 if(!s.power)return ['전원 OFF · 도면 014','MCCB를 켜면 EOCR과 WL 준비등이 켜집니다.','M1은 LS1 AND LS2, M2는 LS1 OR LS2 조건입니다.'];
 if(s.trip)return ['과부하 · YL 점등','운전 버스가 차단되어 모터와 WL이 꺼졌습니다.','RESET 뒤 센서 릴레이는 현재 LS를 다시 평가합니다.'];
 if(s.stop)return ['PB0 · 공통 정지','X·T·MC와 모든 모터를 차단합니다.','PB0를 놓아도 모터는 새 기동 버튼을 기다립니다.'];
 if(s.mc1&&s.mc2)return ['두 모터 운전','T1·T2가 독립적으로 계시 중입니다.','어느 타이머든 완료하면 해당 모터만 정지합니다.'];
 if(s.mc1)return ['M1 운전 · AND 조건','LS1·LS2가 모두 감지된 상태입니다.','어느 LS든 해제하거나 T1이 완료되면 M1이 정지합니다.'];
 if(s.mc2)return ['M2 운전 · OR 조건','LS1·LS2 중 하나 이상이 감지된 상태입니다.','두 LS가 모두 해제되거나 T2가 완료되면 M2가 정지합니다.'];
 return ['기동 대기 · WL 점등','X1 '+(s.x1?'여자':'소자')+' · X2 '+(s.x2?'여자':'소자'),s.x1&&s.x2?'PB1·PB2 모두 기동 가능':s.x1||s.x2?'PB2만 기동 가능':'LS를 먼저 감지하세요.'];
};
