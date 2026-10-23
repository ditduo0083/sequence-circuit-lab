window.circuitHints={
  X:'X 코일 ↔ FR 공급 분기의 a접점. 수동에서 T의 한시 a접점이 닫힌 뒤 X가 여자되어 교대 운전 경로를 만듭니다.',
  T:'T 코일 ↔ PB1과 병렬인 순시 a접점, X 앞의 한시 a접점. 수동 기동을 유지하고 설정시간 뒤 X를 여자합니다.',
  FR:'FR 코일 ↔ MC1·MC2 앞의 교대 접점. 자동은 감지 즉시, 수동은 T 완료 뒤 M1부터 번갈아 운전합니다.',
  MC1:'MC1 코일 ↔ M1 주접점 3개와 RL 앞의 보조 a접점. FR의 M1 차례에만 여자됩니다.',
  MC2:'MC2 코일 ↔ M2 주접점 3개와 GL 앞의 보조 a접점. FR의 M2 차례에만 여자됩니다.',
  EOCR:'EOCR ↔ 운전 차단 b접점과 경보 a접점. 과부하 시 YL·BZ는 동시에 계속 동작합니다.',
  FLS:'FLS 전원 ↔ FR 공급 공통점으로 이어지는 감지 a접점. 자동에서는 T 지연 없이 교대 운전을 시작합니다.'
};
window.createCircuitLessons=function(model){
  const delay=model.delay,interval=model.interval;
  const fresh=()=>{const m=new CircuitModel();m.set('delay',delay);m.set('interval',interval);return m;};
  const make=(m,title,description,focus,heading=title)=>({snapshot:m.snapshot(),title,description,focus,heading});
  const a=fresh(),auto=[];
  auto.push(make(a,'전원을 넣기 전입니다.','003 회로는 자동 감지 시 T 지연 없이 M1부터 교대 운전합니다. 자동과 수동의 기동 경로를 비교해 보세요.','','전원 투입 전 · 도면 003'));
  a.set('power',true);auto.push(make(a,'MCCB를 켜면 EOCR에 전원이 공급됩니다.','운전용 EOCR b접점은 닫혀 있습니다. 아직 자동 감지나 수동 기동이 없으므로 모터는 정지합니다.','EOCR','전원 ON · 기동 대기'));
  a.set('mode','A');auto.push(make(a,'A를 선택하면 FLS가 감지를 기다립니다.','FLS 코일에는 전원이 공급되지만 감지 접점은 열려 있습니다. T와 X는 수동 기동 경로에 있어 소자 상태입니다.','FLS','자동 선택 · 감지 대기'));
  a.set('sensor',true);auto.push(make(a,'수위 감지 즉시 FR과 MC1이 동작합니다.','FLS a접점이 닫혀 FR 공급 공통점에 바로 전원이 들어갑니다. T를 기다리지 않고 M1이 회전하며 RL이 켜집니다.','FLS','자동 감지 · M1 즉시 운전'));
  a.tick(interval);auto.push(make(a,'FR이 전환되면 M2와 GL이 켜집니다.',`교대 간격 ${interval}초 후 MC1 경로는 열리고 MC2 경로는 닫힙니다. 두 모터가 동시에 운전하지 않습니다.`,'FR','자동 교대 · M2 차례'));
  a.tick(interval);auto.push(make(a,'다음 차례에는 다시 M1이 운전합니다.','자동 운전 내내 T와 X는 소자 상태이며, FR만 설정 간격으로 M1과 M2를 번갈아 켭니다.','FR','자동 교대 · M1 차례'));
  a.set('stop',true);auto.push(make(a,'자동 운전 중 PB0를 눌러도 운전은 유지됩니다.','PB0는 수동 분기에만 있습니다. 자동 정지는 FLS 감지 해제 또는 SS를 M으로 전환하여 이루어집니다.','FLS','자동 운전 · PB0 영향 없음'));
  a.set('sensor',false);auto.push(make(a,'수위 감지가 해제되면 교대 운전이 정지합니다.','FLS a접점이 열리면서 FR과 접촉기가 소자됩니다. 교대 시간도 초기화되고 두 모터가 정지합니다.','FLS','감지 해제 · 자동 정지'));
  const m=fresh(),manual=[];m.set('power',true);
  manual.push(make(m,'M 위치에서는 PB1으로 T를 기동합니다.','PB1과 병렬인 접점의 이름은 T입니다. 이 순시 a접점이 수동 자기유지를 담당합니다.','T','수동 선택 · 기동 대기'));
  m.set('start',true);manual.push(make(m,'PB1을 누르면 T만 먼저 여자됩니다.','T 순시 a접점이 즉시 닫혀 유지 경로를 만듭니다. 한시 a접점은 아직 열려 있어 X·FR과 모터는 정지합니다.','T','PB1 누름 · T 계시 시작'));
  m.set('start',false);manual.push(make(m,'PB1을 놓아도 T 접점이 자기유지합니다.','전원은 PB0 → T 순시 a접점 → T 코일로 계속 공급됩니다. X는 아직 소자 상태입니다.','T','PB1 놓음 · T 자기유지'));
  m.tick(delay/2);manual.push(make(m,'설정시간 전에는 두 모터가 모두 대기합니다.',`수업 예시: ${delay}초 중 ${(delay/2).toFixed(1)}초 경과. T 한시 a접점이 열려 있어 X와 FR 경로는 아직 만들어지지 않습니다.`,'T','수동 지연 · 두 모터 대기'));
  m.tick(delay/2);manual.push(make(m,'T 설정시간에 X·FR·MC1이 동작합니다.','T 한시 a접점이 닫혀 X가 여자되고, X a접점이 FR 공급 공통점을 연결합니다. M1과 RL이 먼저 켜집니다.','X','수동 지연 완료 · M1 운전'));
  m.tick(interval);manual.push(make(m,'FR의 다음 차례에는 M2가 운전합니다.','M1과 RL은 꺼지고 M2와 GL이 켜집니다. T와 X는 계속 여자되어 FR 공급을 유지합니다.','FR','수동 교대 · M2 차례'));
  m.set('stop',true);manual.push(make(m,'PB0를 누르면 수동 자기유지가 해제됩니다.','T 소자 → 한시 접점 열림 → X·FR 소자 순으로 운전 경로가 끊기고 두 모터가 정지합니다.','T','PB0 누름 · 수동 정지'));
  m.set('stop',false);manual.push(make(m,'PB0를 놓아도 기동 대기 상태를 유지합니다.','T 순시 a접점이 이미 열려 있으므로 자동으로 재기동하지 않습니다. 다시 PB1을 눌러야 합니다.','T','PB0 놓음 · 재기동 대기'));
  const e=fresh(),alarm=[];e.set('power',true);e.set('start',true);e.set('start',false);e.tick(delay+interval);
  alarm.push(make(e,'수동 교대 운전 중 과부하가 발생한다고 가정합니다.','T와 X가 유지되고 FR은 M2 차례를 공급합니다. EOCR의 운전 접점과 경보 접점 변화를 확인하세요.','EOCR','정상 교대 운전 · M2 차례'));
  e.set('trip',true);alarm.push(make(e,'EOCR이 동작하면 YL과 BZ가 함께 켜집니다.','운전용 b접점은 열려 T·X·FR과 모터가 정지합니다. 경보용 a접점은 닫혀 YL과 BZ에 동시에 전원을 공급합니다.','EOCR','과부하 · YL + BZ 동작'));
  e.tick(interval*2);alarm.push(make(e,'시간이 지나도 황색 램프와 부저는 계속 동작합니다.','경보는 FR 교대부와 분리된 병렬 부하입니다. FR은 소자되어 있고 YL·BZ는 지속 동작합니다.','EOCR','과부하 유지 · 경보 지속'));
  e.set('trip',false);alarm.push(make(e,'M 위치에서 RESET하면 기동 대기로 돌아갑니다.','트립 중 T 자기유지가 해제되었습니다. PB1을 놓은 현재 입력에서는 자동 재기동하지 않습니다.','T','수동 RESET · 기동 대기'));
  e.set('mode','A');e.set('sensor',true);alarm.push(make(e,'자동 감지 상태에서는 M1이 즉시 운전합니다.','FLS 접점이 FR에 직접 전원을 공급하므로 T 지연 없이 M1부터 교대 운전합니다.','FLS','자동 감지 · M1 즉시 운전'));
  e.set('trip',true);alarm.push(make(e,'자동 운전 중 과부하가 발생했습니다.','FLS 감지 입력은 남아 있지만 운전용 EOCR b접점이 열려 모터가 정지하고 YL·BZ가 켜집니다.','EOCR','자동 운전 중 과부하'));
  e.set('trip',false);alarm.push(make(e,'감지가 유지되면 RESET 직후 M1이 재기동합니다.','현재 입력을 다시 평가하여 FLS 접점이 곧바로 FR을 여자합니다. 자동 경로에는 T 초기 지연이 없습니다.','FLS','자동 RESET · M1 즉시 재기동'));
  e.tick(interval);alarm.push(make(e,'FR 설정시간 후 M2 차례로 전환됩니다.','복귀 뒤에도 M1 → M2 → M1 순서로 교대하며, RESET 시 FR 위상은 M1부터 새로 시작합니다.','FR','자동 복귀 · M2 차례'));
  return {auto,manual,alarm};
};
window.explainCircuitState=function(s){
  const mode=s.mode==='A'?'자동':'수동';
  if(!s.power)return ['전원 투입 전 · 도면 003','MCCB가 OFF입니다.','MCCB를 켜고 A 또는 M을 선택하세요. 자동은 감지 즉시, 수동은 T 지연 후 교대 운전합니다.'];
  if(s.trip)return ['과부하 · YL + BZ 동작','모터는 정지하고 YL·BZ가 동시에 동작합니다.','EOCR의 운전용 b접점은 열리고 경보용 a접점은 닫혔습니다. RESET하면 현재 모드와 입력을 다시 평가합니다.'];
  if(s.fr){
    const path=s.mode==='A'?'FLS 감지 접점이 FR에 직접 전원을 공급합니다. T와 X는 동작하지 않습니다.':`T 완료 후 X 접점이 FR에 전원을 공급합니다. FR이 ${s.interval}초 간격으로 두 모터를 교대합니다.`;
    return [`${mode} 교대 운전 · ${s.mc1?'M1':'M2'} 차례`,s.mc1?'M1·RL이 켜지고 M2·GL은 꺼져 있습니다.':'M2·GL이 켜지고 M1·RL은 꺼져 있습니다.',s.mode==='A'&&s.stop?'PB0는 수동 분기에 있으므로 자동 운전은 유지됩니다. '+path:path];
  }
  if(s.timerOn)return ['수동 운전 준비 · T 계시 중','T가 여자되고 두 모터는 설정시간을 기다립니다.',s.start?'PB1을 통해 T에 전원이 공급됩니다. PB1과 병렬인 T 순시 접점도 닫혀 유지 경로가 만들어졌습니다.':'PB1을 놓아도 T 순시 접점이 자기유지합니다. 설정시간 후 X와 FR이 동작합니다.'];
  if(s.mode==='A')return ['자동 선택 · 감지 대기','FLS에 전원이 공급되고 감지를 기다립니다.','감지 입력이 켜지면 FR과 M1이 T 지연 없이 즉시 동작합니다. 감지가 해제되면 자동 운전이 정지합니다.'];
  if(s.stop)return ['수동 정지 · PB0 누름','PB0가 열려 T의 자기유지가 해제되었습니다.','T·X·FR과 두 모터가 정지합니다. PB0를 놓고 PB1을 다시 누르면 T가 처음부터 계시합니다.'];
  return ['수동 선택 · 기동 대기','PB1을 눌렀다 놓아 보세요.',s.sensor?'M 위치에서는 감지 입력이 있어도 FLS 전원은 OFF입니다. PB1으로 T를 기동해야 합니다.':'T 순시 접점이 PB1을 자기유지하고, 설정시간 뒤 X가 FR 경로를 연결합니다.'];
};
