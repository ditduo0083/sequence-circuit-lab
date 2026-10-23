/* 교사용 빈 유인물 선택. 원본은 studentInput 경계에서 좁힌 뒤에만 렌더러에 전달한다. */
(function(){
  'use strict';
  const script=document.currentScript,own=new URL(script.src),dataRoot=new URL(script.dataset.dataRoot,own),logo=new URL(script.dataset.logo,location.href).href;
  const $=id=>document.getElementById(id),kinds={interpret:'회로해석',pin:'핀번호',tb:'단자대',wire:'결선'};
  const groups={c:Array.from({length:18},(_,i)=>String(i+1).padStart(3,'0')),e:Array.from({length:10},(_,i)=>'e'+String(i+1).padStart(2,'0'))};
  const ids=Object.values(groups).flat(),chosen=new Set(['001']),selectedKinds=new Set(Object.keys(kinds)),cache=new Map();
  // 0098 기준본의 머리말 표기. 나머지는 회로 번호로 표시한다(렌더링 특례가 아닌 제목 데이터).
  const captions={'001':'기본 시퀀스 회로','e01':'정역 전환','018':'상반 조건·타이머 자기유지'};
  let jobs=[],position=0,revision=0,busy=false;
  function addScript(name){
    if(!cache.has(name))cache.set(name,new Promise((resolve,reject)=>{const el=document.createElement('script');const url=new URL(name,dataRoot);url.search=own.search;el.src=url.href;el.onload=resolve;el.onerror=()=>{cache.delete(name);el.remove();reject(Error('회로 자료를 불러오지 못했습니다. 다시 시도해 주세요.'));};document.head.append(el);}));
    return cache.get(name);
  }
  async function load(id,kind){await addScript('circuit-'+id+'.js');if(kind==='tb'||kind==='wire')await addScript('wire-'+id+'.js');}
  function make(job){
    const C=window.PIN_CIRCUITS[job.id],W=window.PIN_WIRING?.[job.id];
    const input=PRINT_SHEET.studentInput(job.kind,C,W,[]);
    return PRINT_SHEET.render(job.kind,input,{id:job.id,course:job.id.startsWith('e')?'승강기기능사':'전기기능사',title:captions[job.id]||'회로 '+job.id,logoUrl:logo});
  }
  function prepare(article){PRINT_SHEET.prepare(article);const r=PRINT_SHEET.inspect(article);if(r.errors.length)throw Error(r.errors.join(' / '));}
  async function decoded(article){await document.fonts.ready;await Promise.all([...article.querySelectorAll('img')].map(im=>im.decode()));}
  function fitPreview(){const a=$('previewScale').querySelector('article');if(!a)return;const factor=Math.min(1,$('previewViewport').clientWidth/a.offsetWidth);$('previewScale').style.width=a.offsetWidth+'px';$('previewScale').style.transform='scale('+factor+')';$('previewScale').style.marginRight=-(a.offsetWidth*(1-factor))+'px';$('previewViewport').style.height=(a.offsetHeight*factor+12)+'px';}
  function pager(){$('pagePosition').textContent=jobs.length?(position+1)+' / '+jobs.length+' · '+jobs[position].id+' '+kinds[jobs[position].kind]:'선택한 쪽이 없습니다';$('previous').disabled=busy||position<=0;$('next').disabled=busy||position>=jobs.length-1;}
  async function preview(){
    const token=++revision;$('previewScale').replaceChildren();$('printDocument').replaceChildren();pager();if(!jobs.length)return;
    try{const job=jobs[position];await load(job.id,job.kind);if(token!==revision)return;const a=make(job);$('previewScale').style.transform='';$('previewScale').style.marginRight='0';$('previewScale').append(a);await decoded(a);if(token!==revision)return;prepare(a);fitPreview();$('status').textContent='';}catch(e){if(token===revision)$('status').textContent=e.message;}
  }
  function refresh(){
    jobs=ids.filter(id=>chosen.has(id)).flatMap(id=>Object.keys(kinds).filter(k=>selectedKinds.has(k)&&!(id.startsWith('e')&&k==='tb')).map(kind=>({id,kind})));
    if(document.querySelector('[name="sort"]:checked').value==='kind')jobs.sort((a,b)=>Object.keys(kinds).indexOf(a.kind)-Object.keys(kinds).indexOf(b.kind)||ids.indexOf(a.id)-ids.indexOf(b.id));
    position=0;$('pageCount').textContent='총 '+jobs.length+'쪽';$('selectionCount').textContent=chosen.size+'개 회로';$('elevatorNote').hidden=![...chosen].some(id=>id.startsWith('e'));$('printAll').disabled=!jobs.length||busy;
    document.querySelectorAll('[data-circuit-choice]').forEach(el=>{el.checked=chosen.has(el.value);});preview();
  }
  function rangeOptions(){const list=groups[$('rangeCourse').value];for(const key of ['rangeFrom','rangeTo']){$(key).replaceChildren(...list.map(id=>new Option(id,id)));} $('rangeTo').value=list.at(-1);}
  async function preparePrint(){
    if(busy||!jobs.length)return false;busy=true;++revision;const selected=jobs.slice();$('printDocument').replaceChildren();$('printAll').disabled=true;$('circuits').inert=true;document.querySelector('.pp-controls').inert=true;pager();
    try{
      await Promise.all(selected.map(j=>load(j.id,j.kind)));
      const articles=selected.map(make);$('printDocument').append(...articles);await document.fonts.ready;await Promise.all(articles.map(decoded));
      for(let i=0;i<articles.length;i++){prepare(articles[i]);if(i%6===0){$('status').textContent='인쇄 준비 '+(i+1)+' / '+articles.length;await new Promise(requestAnimationFrame);}}
      $('status').textContent=articles.length+'쪽 인쇄 준비가 끝났습니다.';return true;
    }catch(e){$('printDocument').replaceChildren();$('status').textContent=e.message;return false;}
    finally{busy=false;$('circuits').inert=false;document.querySelector('.pp-controls').inert=false;$('printAll').disabled=!jobs.length;pager();}
  }
  for(const [course,list]of Object.entries(groups)){
    const title=document.createElement('p');title.className='pp-course';title.textContent=course==='c'?'전기기능사':'승강기기능사';const box=document.createElement('div');box.className='pp-group';
    for(const id of list){const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.value=id;input.dataset.circuitChoice='';input.addEventListener('change',()=>{input.checked?chosen.add(id):chosen.delete(id);refresh();});label.append(input,id);box.append(label);} $('circuits').append(title,box);
  }
  for(const [kind,name]of Object.entries(kinds)){const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.value=kind;input.checked=true;input.dataset.kindChoice='';input.addEventListener('change',()=>{input.checked?selectedKinds.add(kind):selectedKinds.delete(kind);refresh();});label.append(input,name);$('kinds').append(label);}
  const params=new URLSearchParams(location.search),validCircuits=(params.get('c')||'').split(',').filter(id=>ids.includes(id)),validKinds=(params.get('k')||'').split(',').filter(k=>Object.hasOwn(kinds,k));
  if(validCircuits.length){chosen.clear();validCircuits.forEach(id=>chosen.add(id));}if(validKinds.length){selectedKinds.clear();validKinds.forEach(k=>selectedKinds.add(k));document.querySelectorAll('[data-kind-choice]').forEach(el=>{el.checked=selectedKinds.has(el.value);});}
  $('selectAll').onclick=()=>{ids.forEach(id=>chosen.add(id));refresh();};$('selectNone').onclick=()=>{chosen.clear();refresh();};$('rangeCourse').onchange=rangeOptions;
  $('selectRange').onclick=()=>{const list=groups[$('rangeCourse').value],a=list.indexOf($('rangeFrom').value),b=list.indexOf($('rangeTo').value);list.slice(Math.min(a,b),Math.max(a,b)+1).forEach(id=>chosen.add(id));refresh();};
  document.querySelectorAll('[name="sort"]').forEach(el=>{el.onchange=refresh;});$('previous').onclick=()=>{if(position>0){position--;preview();}};$('next').onclick=()=>{if(position<jobs.length-1){position++;preview();}};
  $('printAll').onclick=async()=>{if(await preparePrint())window.print();};window.addEventListener('resize',fitPreview);window.addEventListener('afterprint',()=>{$('printDocument').replaceChildren();});
  // 쪽 목록은 사본으로 제공한다. 검증도 인쇄 버튼과 같은 준비 경로를 쓴다.
  window.PRINT_PAGE={preparePrint,get jobs(){return jobs.map(j=>({...j}));}};
  document.querySelectorAll('.pp-note').forEach(el=>{if(el.textContent.includes('A4 세로'))el.innerHTML=el.innerHTML.replace('A4 세로','A4 · 승강기 결선은 가로');});
  rangeOptions();refresh();
})();
