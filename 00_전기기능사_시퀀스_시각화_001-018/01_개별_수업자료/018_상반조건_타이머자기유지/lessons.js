window.circuitNumber=18;
window.circuitHints={
 T1:'M1 기동과 동시에 여자됩니다. 순시 a는 PB1·X1 a·X2 b 전체를 우회해 자기유지하고, 한시 a는 설정시간 후 WL을 켭니다.',
 T2:'M2 기동과 동시에 여자됩니다. 순시 a는 PB2·X1 b·X2 a 전체를 우회해 자기유지하고, 한시 a는 설정시간 후 WL을 켭니다.',
 X1:'LS1 감지 동안 여자됩니다. M1 최초기동에는 a접점, M2 최초기동에는 b접점이 쓰입니다.',
 X2:'LS2 감지 동안 여자됩니다. M1 최초기동에는 b접점, M2 최초기동에는 a접점이 쓰입니다.',
 LS1:'X1 코일을 직접 제어합니다. 최초기동 조건만 결정하며 이미 성립한 T 자기유지에는 영향을 주지 않습니다.',
 LS2:'X2 코일을 직접 제어합니다. 최초기동 조건만 결정하며 이미 성립한 T 자기유지에는 영향을 주지 않습니다.',
 MC1:'T1과 병렬로 여자되어 M1을 운전하고 MC1 a로 RL을 켭니다.',
 MC2:'T2와 병렬로 여자되어 M2를 운전하고 MC2 a로 GL을 켭니다.',
 WL:'T1 한시 a와 T2 한시 a가 병렬이므로 어느 타이머든 완료하면 점등합니다.',
 EOCR:'트립 시 운전 버스를 끊고 경보용 a접점으로 YL을 켭니다.'
};
window.createCircuitLessons=function(model){
 const fresh=()=>{const m=new CircuitModel();m.set('delay1',model.delay1);m.set('delay2',model.delay2);return m;};
 const item=(m,heading,title,description,focus='')=>({snapshot:m.snapshot(),heading,title,description,focus});
 const lessons={};

 const a=fresh(),first=[];a.set('power',true);
 first.push(item(a,'전원 ON · EOCR 대기','EOCR만 공급되고 두 모터는 정지합니다.','M1 최초기동 조건은 LS1 감지·LS2 해제입니다.','EOCR'));
 a.set('ls1',true);first.push(item(a,'LS1 감지 · X1 여자','X1 a는 닫히고 X1 b는 열립니다.','LS2가 해제되어 X2 b도 닫혀 있으므로 M1 조건이 준비됩니다.','X1'));
 a.set('start1',true);first.push(item(a,'PB1 누름 · M1/T1 기동','PB1·X1 a·X2 b 직렬 경로가 완성되어 MC1·T1·M1·RL이 켜집니다.','T1 순시 a도 즉시 닫혀 최초기동 조건 전체를 우회합니다.','PB1'));
 a.set('start1',false);first.push(item(a,'PB1 놓음 · T1 자기유지','T1 순시 a가 M1·T1 운전을 계속 유지합니다.','LS 접점은 이제 최초기동 경로에만 남습니다.','T1'));
 a.set('ls1',false);a.set('ls2',true);first.push(item(a,'LS 조건 반전 · M1 변화 없음','X1·X2 상태가 바뀌어도 T1 우회 경로로 M1·RL이 계속 운전합니다.','원본 동작사항의 “감지가 변해도 변화 없음”을 재현합니다.','T1'));
 a.tick(a.delay1);first.push(item(a,'T1 완료 · WL 점등','T1 한시 a가 닫혀 WL이 켜집니다.','MC1·T1·M1·RL은 계속 켜져 있습니다.','WL'));
 a.set('stop',true);first.push(item(a,'PB0 · 전체 정지','운전 버스가 열려 T1·MC1·M1·RL·WL이 모두 꺼집니다.','계시 시간과 자기유지가 초기화됩니다.','PB0'));lessons.branch1=first;

 const b=fresh(),second=[];b.set('power',true);
 second.push(item(b,'전원 ON · M2 조건 대기','M2 최초기동 조건은 LS1 해제·LS2 감지입니다.','X1 b와 X2 a가 함께 닫혀야 합니다.','EOCR'));
 b.set('ls2',true);second.push(item(b,'LS2 감지 · X2 여자','X1 b와 X2 a가 닫혀 M2 조건이 준비됩니다.','LS1은 해제 상태입니다.','X2'));
 b.set('start2',true);second.push(item(b,'PB2 누름 · M2/T2 기동','PB2·X1 b·X2 a 직렬 경로가 완성되어 MC2·T2·M2·GL이 켜집니다.','T2 순시 a도 즉시 닫혀 최초기동 조건 전체를 우회합니다.','PB2'));
 b.set('start2',false);second.push(item(b,'PB2 놓음 · T2 자기유지','T2 순시 a가 M2·T2 운전을 계속 유지합니다.','LS 접점 변화가 자기유지 경로를 끊지 않습니다.','T2'));
 b.set('ls1',true);b.set('ls2',false);second.push(item(b,'LS 조건 반전 · M2 변화 없음','X1·X2 상태가 바뀌어도 T2 우회 경로로 M2·GL이 계속 운전합니다.','최초기동 조건만 바뀌며 운전은 유지됩니다.','T2'));
 b.tick(b.delay2);second.push(item(b,'T2 완료 · WL 점등','T2 한시 a가 닫혀 WL이 켜집니다.','MC2·T2·M2·GL은 계속 켜져 있습니다.','WL'));
 b.set('stop',true);second.push(item(b,'PB0 · 전체 정지','운전 회로와 M2·GL·WL이 모두 정지합니다.','PB0를 놓아도 새 PB 입력 없이는 재기동하지 않습니다.','PB0'));lessons.branch2=second;

 const c=fresh(),both=[];c.set('power',true);c.set('ls1',true);c.set('start1',true);
 both.push(item(c,'M1 기동 · T1 계시','M1은 LS1 감지·LS2 해제 조건으로 기동했습니다.','버튼을 놓으면 T1 순시 a가 유지합니다.','T1'));
 c.set('start1',false);c.set('ls1',false);c.set('ls2',true);c.set('start2',true);
 both.push(item(c,'LS 반전 후 M2 기동','M1은 유지된 채 M2도 LS1 해제·LS2 감지 조건으로 기동합니다.','두 모터와 두 타이머는 동시에 운전할 수 있습니다.','T2'));
 c.set('start2',false);c.tick(c.delay1);
 both.push(item(c,'T1 먼저 완료 · WL 점등','T1 한시 a가 닫혀 WL이 켜집니다.','T2는 아직 계시 중이며 모터 운전에는 변화가 없습니다.','T1'));
 c.tick(Math.max(0,c.delay2-c.delay1));
 both.push(item(c,'T2도 완료 · WL 계속 점등','두 한시 a접점이 모두 닫혔지만 WL은 하나입니다.','병렬 OR이므로 어느 한쪽만 닫혀도 점등합니다.','WL'));
 c.set('ls1',true);c.set('ls2',false);both.push(item(c,'두 LS 변화 · 두 모터 유지','T1·T2 순시 a 우회 경로가 각각 남아 동작 변화가 없습니다.','한시 완료 상태와 WL도 유지됩니다.','T1'));
 c.set('stop',true);both.push(item(c,'PB0 · 두 자기유지 해제','T1·T2·MC1·MC2와 두 모터·모든 운전등이 꺼집니다.','PB0는 두 운전 분기의 공통 정지입니다.','PB0'));lessons.together=both;

 const e=fresh(),alarm=[];e.set('power',true);e.set('ls1',true);e.set('start1',true);e.set('start1',false);
 alarm.push(item(e,'M1 운전 · 보호 전','M1·RL과 T1이 켜져 있습니다.','EOCR 운전 b와 경보 a의 위치를 확인합니다.','EOCR'));
 e.set('trip',true);alarm.push(item(e,'EOCR 트립 · YL 점등','운전 버스가 끊겨 X·T·MC와 모터가 정지하고 YL만 켜집니다.','경보 분기는 PB0 앞에서 공급됩니다.','EOCR'));
 e.set('stop',true);alarm.push(item(e,'트립 중 PB0','PB0를 눌러도 YL은 계속 켜집니다.','EOCR 경보 a 분기가 운전 버스와 분리되어 있기 때문입니다.','PB0'));
 e.set('stop',false);e.set('trip',false);alarm.push(item(e,'RESET · 초기 운전 상태','YL은 꺼지고 현재 LS에 따라 X1만 여자됩니다.','T1 자기유지는 복구되지 않아 새 PB1 입력을 기다립니다.','EOCR'));
 e.set('stop',true);alarm.push(item(e,'PB0 · 전체 정지','제어회로와 전동기 동작이 모두 정지합니다.','계시 중 정지 뒤 지연 점등은 남지 않습니다.','PB0'));lessons.alarm=alarm;
 return lessons;
};
window.circuitTimerText=(s,i)=>i===1?(s.timerOn1?(s.done1?'완료 · WL 기동 접점 닫힘':'M1 운전 · WL 지연 계시'):s.runPower?'M1 기동 대기 · 0초':'전원 차단 · 0초'):(s.timerOn2?(s.done2?'완료 · WL 기동 접점 닫힘':'M2 운전 · WL 지연 계시'):s.runPower?'M2 기동 대기 · 0초':'전원 차단 · 0초');
window.circuitWLText=s=>s.wl?(s.done1&&s.done2?'T1·T2 완료 · WL 점등':s.done1?'T1 완료 · WL 점등':'T2 완료 · WL 점등'):'한시 완료 대기 · WL 소등';
window.explainCircuitState=s=>{
 if(!s.power)return ['전원 OFF · 도면 018','MCCB를 켜면 EOCR에 전원이 공급됩니다.','M1과 M2는 서로 반대 LS 조합으로 최초 기동합니다.'];
 if(s.trip)return ['과부하 · YL 점등','운전 버스가 차단되어 두 모터가 정지했습니다.','RESET 뒤 현재 LS 입력만 다시 평가합니다.'];
 if(s.stop)return ['PB0 · 공통 정지','T·MC와 두 모터를 모두 차단합니다.','PB0를 놓아도 새 PB 입력 전에는 운전하지 않습니다.'];
 if(s.mc1&&s.mc2)return [s.wl?'두 모터 운전 · WL 점등':'두 모터 운전 · 동시 계시','T1·T2 순시 a가 각 기동 조건 전체를 우회합니다.','LS 상태가 바뀌어도 두 운전은 유지됩니다.'];
 if(s.mc1)return [s.wl?'M1 운전 · WL 점등':'M1 운전 · T1 계시','T1 순시 a로 자기유지 중입니다.','LS 변화는 운전 중인 M1에 영향을 주지 않습니다.'];
 if(s.mc2)return [s.wl?'M2 운전 · WL 점등':'M2 운전 · T2 계시','T2 순시 a로 자기유지 중입니다.','LS 변화는 운전 중인 M2에 영향을 주지 않습니다.'];
 if(s.x1&&!s.x2)return ['M1 최초기동 조건 준비','X1 a와 X2 b가 닫혔습니다.','PB1을 누르면 MC1·T1이 함께 여자됩니다.'];
 if(!s.x1&&s.x2)return ['M2 최초기동 조건 준비','X1 b와 X2 a가 닫혔습니다.','PB2를 누르면 MC2·T2가 함께 여자됩니다.'];
 return ['전원 ON · 입력 대기','EOCR은 정상이고 운전 회로는 PB 입력을 기다립니다.','LS1·LS2 조합을 선택한 뒤 알맞은 PB를 누르세요.'];
};

