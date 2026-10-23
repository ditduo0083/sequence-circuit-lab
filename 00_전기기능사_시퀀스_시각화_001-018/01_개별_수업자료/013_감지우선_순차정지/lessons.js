window.circuitNumber=13;
window.circuitHints={
 X1:'PB1·X1 a·LS1 a의 병렬 경로로 기동합니다. T2 한시 b가 열리면 소자되며, 그때 X1 자기유지도 함께 풀립니다.',
 X2:'PB2 또는 T1 한시 a로 기동하고 X2 a로 자기유지합니다. MC2와 직접 병렬이므로 X2가 켜지면 M2·GL도 즉시 켜집니다.',
 T1:'X1 계통에서 MC1 b를 거쳐 계시합니다. LS2 감지로 MC1이 켜지면 T1은 즉시 소자되고, 완료하면 T1 한시 a가 X2를 기동합니다.',
 T2:'X2 계통에서 X1 a를 거쳐 계시합니다. 완료 순간 T2 한시 b가 X1 계통을 끊고, X1 소자 뒤 T2도 복귀합니다.',
 LS1:'PB1과 X1 자기유지 접점에 병렬인 기동 접점입니다. OFF→ON→OFF로 순간 감지해도 X1이 자기유지합니다.',
 LS2:'X1이 유지된 상태에서 MC1을 직접 기동합니다. MC1 b가 T1을 끊으므로 M1 운전 중에는 T1이 0초로 복귀합니다.',
 MC1:'LS2 감지 시 M1과 RL을 켭니다. 보조 b는 T1 계시를 멈추고, 보조 a는 RL을 켭니다.',
 MC2:'X2와 같은 공급점에 직접 연결됩니다. PB2 또는 T1 완료로 X2가 켜지면 M2·GL이 운전합니다.',
 WL:'T1 순시 a와 T2 순시 a의 병렬입니다. 두 타이머 중 하나라도 여자되면 즉시 켜지며 완료 표시가 아닙니다.',
 EOCR:'트립 시 운전용 b가 열려 X·T·MC를 모두 복귀시키고 경보용 a로 YL을 켭니다. RESET 뒤에는 현재 입력을 다시 평가합니다.'
};

window.createCircuitLessons=function(model){
 const fresh=()=>{const m=new CircuitModel();m.set('delay1',model.delay1);m.set('delay2',model.delay2);return m;};
 const item=(m,heading,title,description,focus='')=>({snapshot:m.snapshot(),heading,title,description,focus});
 const pulse=(m,key)=>{m.set(key,true);m.set(key,false);};
 const lessons={};

 const a=fresh(),first=[];a.set('power',true);
 first.push(item(a,'PB1·LS1 기동 경로','X1 계통은 두 가지 순간 입력으로 시작할 수 있습니다.','PB1과 LS1은 X1 a 자기유지 접점과 병렬입니다.','X1'));
 a.set('start1',true);first.push(item(a,'PB1 누름 · X1·T1 여자','X1과 T1이 켜지고 WL이 즉시 점등합니다.','T1 순시 a는 코일 여자와 함께 닫히지만, X2용 한시 a는 아직 열려 있습니다.','T1'));
 a.set('start1',false);first.push(item(a,'PB1 놓음 · X1 자기유지','PB1을 놓아도 X1 a를 통해 X1과 T1이 유지됩니다.','LS1을 순간 감지했다 놓아도 같은 결과입니다.','X1'));
 a.tick(a.delay1/2);a.set('ls2',true);first.push(item(a,'LS2 감지 · M1 운전','MC1·M1·RL이 켜지고 MC1 b가 T1을 끊습니다.','T1 시간은 0초로 복귀하고 WL도 소등합니다.','LS2'));
 a.tick(a.delay1+1);first.push(item(a,'LS2 유지 · T1 차단','M1은 계속 운전하지만 시간이 지나도 X2는 기동하지 않습니다.','MC1 b가 열린 동안 T1은 계시하지 않습니다.','MC1'));
 a.set('ls2',false);first.push(item(a,'LS2 해제 · M1 정지 / T1 재계시','MC1·M1·RL은 꺼지고 T1·WL이 다시 켜집니다.','T1은 이전 값이 아니라 0초부터 새로 계시합니다.','T1'));
 a.tick(a.delay1);first.push(item(a,'T1 완료 · X2·M2·T2 기동','T1 한시 a가 X2를 켜고 M2·GL이 운전합니다.','X1 a도 닫혀 있으므로 T2가 동시에 계시를 시작합니다.','T2'));
 a.tick(a.delay2);first.push(item(a,'T2 완료 · X1 계통 해제','T2 한시 b가 순간 열려 X1·T1·T2를 소자시킵니다.','X2 자기유지는 남아 M2·GL만 계속 운전하고 WL은 꺼집니다.','X1'));
 a.set('stop',true);first.push(item(a,'PB0 · 전체 정지','X2 자기유지와 M2 운전까지 모두 해제됩니다.','PB0를 놓아도 새 기동 입력 전에는 운전하지 않습니다.','EOCR'));
 lessons.branch1=first;

 const b=fresh(),timers=[];b.set('power',true);pulse(b,'ls1');
 timers.push(item(b,'LS1 순간 감지 · X1 기동','LS1 OFF→ON→OFF 뒤에도 X1·T1은 자기유지됩니다.','기계적 감지 접점과 자기유지 접점을 함께 확인하세요.','LS1'));
 b.tick(b.delay1-.1);timers.push(item(b,'T1 완료 직전','WL은 켜져 있지만 T1 한시 a는 아직 열려 있습니다.','순시 접점과 한시 접점의 역할이 다릅니다.','T1'));
 b.tick(.1);timers.push(item(b,'T1 완료 · X2 합류','X2·MC2가 여자되어 M2·GL이 켜지고 T2가 0초부터 시작합니다.','T1과 T2가 동시에 여자되어도 각 설정시간은 따로 계산됩니다.','X2'));
 b.tick(b.delay2-.1);timers.push(item(b,'T2 완료 직전','T2 한시 b가 아직 닫혀 있어 X1 계통이 유지됩니다.','현재 M2는 X2 자기유지로 운전 중입니다.','T2'));
 b.tick(.1);timers.push(item(b,'T2 완료 · X1만 해제','T2 b가 열리는 순간 X1이 소자되고 T2도 복귀합니다.','X2·M2·GL은 계속 운전합니다.','T2'));
 pulse(b,'start1');timers.push(item(b,'PB1 재기동 · T2 새 계시','M2 운전 중 PB1을 누르면 X1·T1·T2가 다시 여자됩니다.','T2는 새 주기로 0초부터 계시합니다.','PB1'));
 b.set('stop',true);timers.push(item(b,'PB0 · 계시 중 정지','두 자기유지와 남아 있던 시간이 모두 지워집니다.','PB0 뒤에 시간이 지나도 지연 기동은 발생하지 않습니다.','PB0'));
 lessons.branch2=timers;

 const c=fresh(),mixed=[];c.set('power',true);pulse(c,'start2');
 mixed.push(item(c,'PB2 순간 누름 · M2 즉시 운전','X2·MC2·M2·GL이 즉시 켜집니다.','X1이 꺼져 있어 X1 a가 열린 상태이므로 T2와 WL은 켜지지 않습니다.','MC2'));
 mixed.push(item(c,'PB2 놓음 · X2 자기유지','PB2를 놓아도 X2 a가 M2 운전을 유지합니다.','PB2 단독 기동에는 타이머 지연이 없습니다.','X2'));
 pulse(c,'start1');mixed.push(item(c,'PB1 추가 · T1·T2 동시 계시','X1이 켜지면서 T1과 T2가 함께 여자되고 WL이 점등합니다.','M2는 계속 운전합니다.','WL'));
 c.set('ls2',true);mixed.push(item(c,'LS2 감지 · 두 모터 운전','MC1·M1·RL이 켜지고 T1은 MC1 b에 의해 소자됩니다.','T2는 X1·X2가 모두 유지되어 계속 계시하고 WL도 켜져 있습니다.','MC1'));
 c.set('ls2',false);mixed.push(item(c,'LS2 해제 · T1 재계시','M1은 멈추고 T1이 0초부터 다시 시작합니다.','T2는 중단되지 않고 계속 계시합니다.','T1'));
 c.tick(c.delay2);mixed.push(item(c,'T2 완료 · M2만 유지','X1 계통과 M1·T1·T2가 모두 복귀합니다.','X2 자기유지로 M2·GL은 계속 켜져 있습니다.','MC2'));
 c.set('stop',true);mixed.push(item(c,'PB0 · 전체 정지','PB2로 시작한 M2도 공통 PB0에서 정지합니다.','다음 운전은 PB1·PB2 또는 LS1 순간 감지로 다시 시작합니다.','PB0'));
 lessons.together=mixed;

 const e=fresh(),alarm=[];e.set('power',true);pulse(e,'start1');e.tick(e.delay1);e.set('ls2',true);
 alarm.push(item(e,'두 모터 운전 · 보호 동작 전','M1·RL과 M2·GL이 모두 켜진 상태입니다.','운전용 EOCR b와 경보용 EOCR a를 비교합니다.','EOCR'));
 e.set('trip',true);alarm.push(item(e,'과부하 · YL만 점등','EOCR b가 열려 X·T·MC와 두 모터가 모두 정지합니다.','운전 분기 앞의 경보용 EOCR a는 닫혀 YL이 계속 켜집니다.','EOCR'));
 e.tick(10);alarm.push(item(e,'과부하 유지','시간이 지나도 YL은 켜지고 계시는 진행되지 않습니다.','PB0는 EOCR 경보 분기 뒤에 있지 않아 YL을 끄지 않습니다.','EOCR'));
 e.set('stop',true);alarm.push(item(e,'트립 중 PB0','PB0를 눌러도 YL은 계속 켜집니다.','경보 분기와 운전 분기가 분리되어 있기 때문입니다.','PB0'));
 e.set('stop',false);e.set('trip',false);alarm.push(item(e,'RESET · 초기 상태','X1·X2 자기유지와 타이머 시간은 복구되지 않습니다.','LS2가 감지 중이어도 LS2는 X1 기동 접점이 아니므로 PB 입력을 기다립니다.','X1'));
 pulse(e,'start1');alarm.push(item(e,'PB1 재기동 · LS2 감지 중','X1과 MC1·M1·RL이 즉시 켜집니다.','MC1 b가 T1을 차단해 WL은 꺼진 상태입니다.','MC1'));
 e.set('stop',true);alarm.push(item(e,'PB0 · 재기동 계통 정지','운전 중 언제든 PB0가 X1과 모터를 정지시킵니다.','접점이 실제 설치된 공통 운전 분기만 차단합니다.','PB0'));
 e.set('stop',false);e.tick(e.delay1+e.delay2);alarm.push(item(e,'PB0 놓음 · 지연 동작 없음','시간이 지나도 모터는 다시 켜지지 않습니다.','자기유지와 타이머가 모두 초기화되었습니다.','T1'));
 lessons.alarm=alarm;
 return lessons;
};

window.circuitTimerText=(s,i)=>{
 if(i===1){if(s.done1)return '완료 · X2 기동 접점 닫힘';if(s.timerOn1)return '계시 중 · X2 기동 준비';if(s.x1&&s.mc1)return 'MC1 운전 · T1 차단';return 'X1 계통 미기동 · 0초';}
 if(s.timerOn2)return '계시 중 · X1 해제 준비';if(s.x2&&!s.x1)return 'X1 소자 · T2 무여자';return 'X1·X2 동시 성립 대기';
};
window.circuitWLText=s=>s.wl?'T 코일 여자 · 순시 표시':'T1·T2 모두 소자';
window.explainCircuitState=s=>{
 if(!s.power)return ['전원 OFF · 도면 013','MCCB를 켜고 PB1·PB2 또는 LS1을 조작하세요.','T1은 X2를 기동하고 T2는 X1 계통을 해제합니다.'];
 if(s.trip)return ['과부하 · YL 점등','EOCR 운전 접점이 열려 모든 운전 부하가 정지했습니다.','RESET 뒤 자기유지는 복구되지 않으며 현재 입력을 다시 평가합니다.'];
 if(s.stop)return ['PB0 · 전체 정지','X1·X2 자기유지와 두 타이머를 모두 복귀시킵니다.','PB0는 운전 분기 공통 정지이며 YL 경보 분기는 차단하지 않습니다.'];
 if(!s.x1&&!s.x2)return ['기동 대기','PB1·PB2 또는 LS1을 조작하세요.','LS2만 감지해도 X1이 없으므로 M1은 기동하지 않습니다.'];
 if(s.x2&&!s.x1)return ['M2 단독 운전','X2 자기유지로 M2·GL이 계속 켜져 있습니다.','PB1을 누르면 X1이 합류하고 T2 계시가 시작됩니다.'];
 if(s.mc1&&s.mc2)return ['두 모터 운전',s.timerOn2?'T2가 X1 해제 시간을 계시 중입니다.':'두 계통이 여자되었습니다.','MC1 b 때문에 T1은 소자되어도 T2는 X1 a를 통해 계속 계시합니다.'];
 if(s.mc1)return ['M1 운전 · T1 소자','LS2가 MC1을 켜고 MC1 b가 T1을 차단했습니다.','LS2를 해제하면 M1은 멈추고 T1이 0초부터 다시 시작합니다.'];
 if(s.x2)return ['M2 운전 · T2 계시','T1 완료로 X2·M2가 기동했고 T2가 X1 해제를 준비합니다.','T2 완료 뒤 X1 계통만 소자되고 X2는 유지됩니다.'];
 return ['X1 자기유지 · T1 계시',s.done1?'T1 한시 a가 X2를 기동했습니다.':'LS2 미감지로 T1이 계시 중입니다.','WL은 T 코일이 여자되는 즉시 켜지는 순시 표시입니다.'];
};
