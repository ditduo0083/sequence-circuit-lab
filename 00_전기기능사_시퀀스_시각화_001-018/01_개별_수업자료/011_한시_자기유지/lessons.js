window.circuitNumber=11;
window.circuitHints={X1:'X1은 PB1 또는 T1 한시 a가 공급합니다. X1 b접점은 반대쪽 T2를 끊습니다. X1 a 자기유지 회로가 아닙니다.',X2:'X2는 PB2 또는 T2 한시 a가 공급합니다. X2 b접점은 반대쪽 T1을 끊어 이전 타이머 유지를 해제합니다.',T1:'PB1과 병렬인 T1 한시 a는 설정시간 후 닫힙니다. 그때까지 PB1을 계속 눌러야 자기유지가 남습니다.',T2:'PB2를 설정시간 이상 누르면 T2 한시 a로 유지합니다. X1이 여자되면 T2는 차단되어 유지 접점이 열립니다.',LS1:'LS1은 MC1에 직접 이어집니다. PB1 누름 중에도 X1 분기에 전원이 있으면 감지 즉시 M1이 켜집니다.',LS2:'LS2는 MC2에 직접 이어집니다. 타이머는 모터 기동 지연이 아니라 버튼을 놓은 뒤 유지하는 조건입니다.',MC1:'LS1 감지로 켜집니다. 보조 a는 RL, 보조 b는 WL의 1번 대기 경로입니다.',MC2:'LS2 감지로 켜집니다. 보조 a는 GL, 보조 b는 WL의 2번 대기 경로입니다.',WL:'X1 a→MC1 b와 X2 a→MC2 b가 병렬입니다. 전원이 공급된 계통 중 모터가 대기하는 경로가 있으면 켜집니다.',EOCR:'트립은 공통 운전선을 끊고 YL만 켭니다. PB0를 눌러도 트립 경보 YL은 유지됩니다.'};

window.createCircuitLessons=function(model){
 const fresh=()=>{const m=new CircuitModel();m.set('delay1',model.delay1);m.set('delay2',model.delay2);return m;};
 const item=(m,heading,title,description,focus='')=>({snapshot:m.snapshot(),heading,title,description,focus});
 const pulse=(m,i)=>{m.set('start'+i,true);m.set('start'+i,false);};
 const lessons={};

 for(const i of [1,2]){
  const m=fresh(),list=[],d=m['delay'+i],lamp=i===1?'RL':'GL';m.set('power',true);
  list.push(item(m,`${i}번 · 짧게 누름과 길게 누름`,`PB${i}을 놓아도 유지되려면 T${i}이 완료되어야 합니다.`,`PB${i} 옆의 접점은 X가 아니라 T${i} 한시 a입니다.`,'T'+i));
  m.set('start'+i,true);list.push(item(m,`PB${i} 누름 · T${i} 시작`,`X${i}·T${i}이 여자되고 WL이 켜집니다.`,`LS${i}은 아직 미감지이므로 모터는 대기합니다.`,'T'+i));
  m.tick(d/2);list.push(item(m,`T${i} 절반 경과 · 누름 유지`,`아직 T${i} 한시 a가 열려 있습니다.`,`수업 예시 ${d}초를 채우기 전에 버튼을 놓아보겠습니다.`,'T'+i));
  m.set('start'+i,false);list.push(item(m,'짧게 누른 뒤 놓음 · 유지 실패',`X${i}·T${i}과 WL이 모두 꺼집니다.`,`T${i}이 완료되지 않아 자기유지 우회 경로가 없습니다.`,'T'+i));
  m.set('start'+i,true);list.push(item(m,`PB${i} 다시 누름 · 새 계시`,`이번에는 ${d}초 이상 계속 누릅니다.`,`이전 계시 시간은 남아 있지 않습니다.`,'T'+i));
  m.tick(d);list.push(item(m,`T${i} 완료 · 한시 a 닫힘`,`T${i} 접점이 PB${i}을 우회하는 길을 만듭니다.`,`이제 버튼을 놓아도 분기에 전원이 유지됩니다.`,'T'+i));
  m.set('start'+i,false);list.push(item(m,`PB${i} 놓음 · 자기유지 성공`,`X${i}·T${i}은 계속 여자됩니다.`,`이 상태에서 LS${i} 감지를 기다립니다. WL은 켜져 있습니다.`,'T'+i));
  m.set('ls'+i,true);list.push(item(m,`LS${i} 감지 · 즉시 M${i} 운전`,`M${i}·${lamp}이 켜지고 WL이 꺼집니다.`,`모터 기동 경로에는 T 한시 접점이 없으므로 추가 지연이 없습니다.`,'LS'+i));
  m.set('ls'+i,false);list.push(item(m,`LS${i} 해제 · 모터만 정지`,`X${i}·T${i} 자기유지는 남고 WL은 다시 켜집니다.`,`타이머는 완료 상태를 유지합니다.`,'LS'+i));
  m.set('ls'+i,true);list.push(item(m,`LS${i} 재감지 · 즉시 재운전`,`PB${i}을 다시 누르거나 시간을 기다릴 필요가 없습니다.`,`전체 해제는 PB0 또는 반대 계통 기동으로 확인합니다.`,'MC'+i));
  lessons['branch'+i]=list;
 }
 const m=fresh(),list=[];m.set('power',true);m.set('start1',true);m.tick(m.delay1);m.set('start1',false);m.set('ls1',true);
 list.push(item(m,'1번 유지 · M1 운전','PB1을 놓은 상태에서 1번이 유지되고 있습니다.','PB2를 누르면 X2 b가 T1 경로에 어떤 영향을 주는지 보세요.','X2'));
 m.set('start2',true);list.push(item(m,'PB2 누름 · 1번 유지 해제','X2가 T1을 끊어 X1·M1이 정지합니다.','X1이 소자되면 X1 b가 닫혀 T2가 계시합니다.','X2'));
 m.tick(m.delay2);m.set('start2',false);list.push(item(m,'T2 완료 · 2번 유지','PB2를 충분히 눌렀다가 놓으면 2번이 유지됩니다.','LS2는 아직 미감지이므로 WL이 켜집니다.','T2'));
 m.set('ls2',true);list.push(item(m,'LS2 감지 · M2 운전','2번 계통의 모터가 즉시 켜집니다.','기존 1번 계통은 자동으로 복구되지 않습니다.','LS2'));
 m.set('start1',true);list.push(item(m,'PB1 누름 · 즉시 M1 운전','LS1이 이미 감지되어 T1 완료 전에도 M1이 켜집니다.','PB2는 놓여 있어 2번 유지가 해제됩니다. 타이머는 모터 기동 지연이 아닙니다.','LS1'));
 m.set('start2',true);list.push(item(m,'두 PB 동시 누름 · T 모두 차단','X1·X2와 두 모터는 켜지고 두 T는 꺼집니다.','원본의 상호 차단은 타이머 분기에 있습니다. 두 LS가 감지된 동시 누름 사례입니다.','T1'));
 m.set('start1',false);list.push(item(m,'PB1만 놓음 · T2 새 계시','M1은 멈추고, PB2 누름으로 M2는 유지됩니다.','X1 b가 다시 닫혀 T2는 0초부터 계시합니다.','T2'));
 m.set('stop',true);m.set('start2',false);list.push(item(m,'PB0 · 전체 정지','타이머 완료 여부와 관계없이 두 계통을 해제합니다.','LS 감지가 남아 있어도 기동 버튼을 놓았다면 다음 PB를 기다립니다.','EOCR'));
 lessons.together=list;
 const e=fresh(),alarm=[];e.set('power',true);e.set('start1',true);e.tick(e.delay1);e.set('start1',false);e.set('ls1',true);
 alarm.push(item(e,'M1 운전 · 과부하 전','유지된 운전을 EOCR 트립으로 끊어보겠습니다.','YL 경보 분기는 운전 접점과 PB0보다 앞에 있습니다.','EOCR'));
 e.set('trip',true);alarm.push(item(e,'과부하 · YL 점등','X·T·모터·WL은 꺼지고 YL만 켜집니다.','한시 자기유지 접점도 열림으로 복귀합니다.','EOCR'));
 e.tick(10);alarm.push(item(e,'경보 지속','YL은 계속 켜져 있습니다.','이 도면에는 FR이나 부저가 없습니다.','EOCR'));
 e.set('trip',false);alarm.push(item(e,'RESET · 새 누름 대기','기동 버튼을 놓은 상태라면 자동으로 유지되지 않습니다.','T 계시는 0초에서 다시 시작해야 합니다.','T1'));
 e.set('start1',true);alarm.push(item(e,'PB1 누름 · LS1 감지 중','M1은 즉시 켜지고 T1은 새 계시를 시작합니다.','T1 완료 전에는 PB1을 놓으면 운전이 해제됩니다.','LS1'));
 e.set('start1',false);alarm.push(item(e,'곧바로 놓음 · 운전 해제','모터가 한 번 돌았어도 자기유지가 성립한 것은 아닙니다.','T1 완료 여부와 모터 운전 여부를 구분하세요.','T1'));
 e.set('start1',true);e.tick(e.delay1);e.set('start1',false);alarm.push(item(e,'충분히 누른 후 놓음 · 유지','다시 T1 시간을 채우면 M1 운전이 유지됩니다.','현재 LS1 감지 입력이 남아 있습니다.','T1'));
 e.set('power',false);alarm.push(item(e,'전원 OFF · 전체 차단','MCCB를 끄면 EOCR 전원도 꺼집니다.','전원 재투입만으로 이전 타이머 유지가 복구되지 않습니다.','EOCR'));
 lessons.alarm=alarm;return lessons;
};
window.circuitTimerText=(s,i)=>s['done'+i]?'완료 · 버튼 놓아도 유지':s['timerOn'+i]?'PB'+i+' 누름 유지 · 자기유지 준비':s['x'+i]?'반대 X 여자 · T 차단':'기동 대기 · 0초';
window.circuitWLText=s=>s.wl?'선택 계통 모터 대기':s.mc1||s.mc2?'선택 계통 운전 중':'선택 계통 없음';
window.explainCircuitState=s=>{
 if(!s.power)return ['전원 OFF · 도면 011','MCCB를 켜고 PB1 또는 PB2를 길게 누르세요.','타이머는 모터 기동 지연이 아니라 자기유지 성립 시간을 정합니다.'];
 if(s.trip)return ['과부하 · YL 점등','두 계통의 유지가 해제되었습니다.','RESET 후에는 다시 버튼을 필요한 시간만큼 누릅니다.'];
 if(s.stop)return ['PB0 · 전체 정지','X·T와 모터를 모두 해제합니다.','기동 버튼을 놓은 뒤 PB0를 놓으면 새 누름을 기다립니다.'];
 if(s.x1&&s.x2)return ['두 PB 동시 누름 · T 차단','두 X가 상대 타이머를 모두 차단하고 있습니다.','각 LS가 감지되면 모터는 켜집니다. 원본에 없는 모터 금지 접점을 추가하지 않았습니다.'];
 const i=s.x1?1:s.x2?2:0;if(!i)return ['기동 대기','PB1 또는 PB2를 설정시간 이상 누르세요.','짧게 눌렀다 놓으면 타이머가 복귀합니다.'];
 if(s['done'+i])return [i+'번 자기유지 · '+(s['mc'+i]?'모터 운전':'감지 대기'),'버튼을 놓아도 T'+i+' 한시 a가 유지합니다.','LS 감지에는 즉시 반응합니다. 다른 PB는 기존 타이머 유지를 해제합니다.'];
 return [i+'번 누름 중 · T 계시',s['mc'+i]?'LS가 이미 감지되어 모터는 즉시 운전합니다.':'LS 미감지로 모터는 기다립니다.','T 완료 전에 버튼을 놓으면 X·T·모터가 꺼집니다.'];
};
