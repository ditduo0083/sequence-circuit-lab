/* 과정별 학습 단계 줄. 배포가 끝난 번호만 ready 에 추가한다.
 * 2026-09-26 요청 0024 · 결정 D0010 반영:
 *   - 학습 흐름: ① 시뮬레이션 → ② 회로해석 → ③ 핀번호 적기 → ④ 단자대 번호매기기(전기기능사만) → ⑤ 결선하기
 *   - 전기기능사(c):
 *       시뮬레이션 = 회로 앱(/c/NNN/), 회로해석 = /c/NNN/interpret/, 핀번호 = /c/NNN/pin/
 *   - 승강기기능사(e):
 *       시뮬레이션 = 회로 앱(/e/NN/sim/), 회로해석 = /e/NN/, 핀번호 = /e/NN/pin/ (단자대 단계 없음)
 *       ready.sim: ['01', '06'] (나머지 8개는 시뮬레이션 준비 중)
 * 이 파일은 회로 앱(/c/NNN/, /e/NN/sim/)과 핀번호·회로해석 페이지가 함께 쓴다.
 * 2026-09-26 요청 0028: draft 목록 추가(단자대 /c/NNN/tb/, 결선 /c/NNN/wire/·/e/NN/wire/ 프로토타입).
 *   draft 링크는 파일로 열 때, 주소에 ?draft=1 이 있을 때, 단자대·결선 페이지 안에서만 보인다. 배포 승인 뒤 ready 로 옮긴다.
 */
(function () {
  'use strict';
  const courses = {
    c: {
      label: '전기기능사',
      idDigits: 3,                              // 001~018
      stages: [
        { id: 'sim', label: '시뮬레이션' },
        { id: 'interpret', label: '회로해석' },
        { id: 'pin', label: '핀번호 적기' },
        { id: 'tb', label: '단자대 번호매기기' },
        { id: 'wire', label: '결선하기' }
      ],
      ready: {
        sim: 'all',
        interpret: 'all',
        pin: ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '016', '017', '018'],
        tb: 'all',
        wire: 'all'
      },
      // 요청 0028 프로토타입: 배포 전 검수용. 파일로 열 때, 주소에 ?draft=1 이 있을 때, 단자대·결선 페이지 안에서만 링크를 보인다
      draft: { tb: 'all', wire: 'all' },
      interpretPage: 'all',
      // 요청 0056 회로 고르기 목록: 메인 목차(00_통합목차.html) 카드 제목(h2) 그대로. 순서 = 번호 001~018
      titles: ['기본 시퀀스 회로', '지연 후 교대 운전', '자동 즉시·수동 지연 교대', 'M1 → M2 → 정지 순환', '교대 후 동시 운전', '동시 후 교대 운전',
        '순차 정지 반복', '자동 표시·수동 시간 정지', '순차 기동·교대 경보', '두 계통 독립 지연 기동', '한시 자기유지', '타이머 교차 기동',
        '감지 우선·순차 정지', 'AND·OR 한시 정지', '조건 우회·한시 정지', 'T1 지연·T2 표시 전환', 'XOR·T1 허가·T2 전환', '상반 조건·타이머 자기유지']
    },
    e: {
      label: '승강기기능사',
      idDigits: 2,                              // 01~10 (결정 D0008-2)
      stages: [
        { id: 'sim', label: '시뮬레이션' },
        { id: 'interpret', label: '회로해석' },
        { id: 'pin', label: '핀번호 적기' },
        { id: 'wire', label: '결선하기' }       // 단자대 없음(결정 D0007 1장)
      ],
      ready: {
        sim: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
        interpret: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
        pin: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
        wire: 'all'
      },
      draft: { wire: 'all' },                  // 요청 0028 프로토타입(위 c 과정 설명과 같음)
      interpretPage: [],
      // 요청 0056 회로 고르기 목록(메인 목차 카드 제목). 순서 = 번호 01~10
      titles: ['정역 전환', '정지 후 역회전', '정·역 한 번씩', 'T2 자기유지 전환', '지연 기동 정역', 'Y-Δ 기동', 'Y-Δ · 표시등 교대',
        'M1 → M2 간헐', 'M1 간헐 → M2', 'M1·M2 교대 → 동시']
    }
  };
  const scriptSrc = document.currentScript && document.currentScript.src;   // 파일로 열 때 다른 회로 주소의 기준(공용/steps.js)
  const nav = document.querySelector('#steps');
  if (!nav) return;

  const path = location.pathname;
  const match = path.match(/\/([a-zA-Z])\/(\d{2,3})(?:\/(interpret|pin|tb|wire|sim))?\/?(?:index\.html)?$/);
  const isServerStandard = !!match;
  const dataCircuit = document.body.dataset.circuit || '';            // '001' 또는 'e01'
  const courseId = match ? match[1] : (/^[a-zA-Z]/.test(dataCircuit) ? dataCircuit[0] : 'c');
  const number = dataCircuit ? dataCircuit.replace(/^[a-zA-Z]+/, '') : match?.[2];
  const stageInPath = match?.[3] || (/\/(interpret|pin|tb|wire|sim)\/(?:index\.html)?$/.exec(path) || [])[1];
  const stageData = document.body.dataset.stage;
  const onSim = stageInPath === 'sim' || stageData === 'sim';
  const onInterpret = stageInPath === 'interpret' || stageData === 'interpret';
  const onPin = stageInPath === 'pin' || stageData === 'pin';
  const onTb = stageInPath === 'tb' || stageData === 'tb';
  const onWire = stageInPath === 'wire' || stageData === 'wire';

  // 현재 활성 단계 결정
  let current = 'sim';
  if (onSim) current = 'sim';
  else if (onInterpret) current = 'interpret';
  else if (onPin) current = 'pin';
  else if (onTb) current = 'tb';
  else if (onWire) current = 'wire';
  else if (courseId === 'e') {
    current = 'interpret';
  } else {
    current = 'sim';
  }

  const course = courses[courseId];
  if (!course || !number || !new RegExp('^\\d{' + course.idDigits + '}$').test(number)) return;
  const has = (list) => list === 'all' || (list || []).includes(number);
  const hasInterpretPage = has(course.interpretPage);
  const draftQuery = /[?&]draft=1(?:&|$)/.test(location.search);
  const showDraft = location.protocol === 'file:' || draftQuery || onTb || onWire;
  const isDraft = (id) => showDraft && !has(course.ready[id]) && has((course.draft || {})[id]);

  const home = document.querySelector('.home-link');
  if (home && location.protocol === 'file:') {
    home.href = new URL('../../../00_전기기능사_시퀀스_시각화_001-018/index.html', document.currentScript.src).href;
  }

  // 서버 주소
  function serverHref(id) {
    if (id === 'sim') {
      return courseId === 'c' ? `/c/${number}/` : `/e/${number}/sim/`;
    }
    if (id === 'interpret') {
      return courseId === 'c' ? `/c/${number}/interpret/` : `/e/${number}/`;
    }
    return `/${courseId}/${number}/${id}/`;
  }

  // 파일로 열었을 때
  function localHref(id) {
    if (courseId === 'e') {
      const up = (onSim || onPin || stageInPath) ? '../' : '';
      if (id === 'sim') return up + 'sim/index.html';
      if (id === 'interpret') return up + 'index.html';
      return up + id + '/index.html';
    } else {
      const up = (onInterpret || onPin || stageInPath) ? '../' : '';
      if (id === 'sim') return up + 'index.html';
      if (id === 'interpret') return up + 'interpret/index.html';
      return up + id + '/index.html';
    }
  }

  nav.setAttribute('aria-label', '학습 단계');
  course.stages.forEach(({ id, label }) => {
    const ready = has(course.ready[id]) || (id === 'interpret' && (hasInterpretPage || courseId === 'e')) || isDraft(id);
    const active = id === current;
    const element = document.createElement(ready || active ? 'a' : 'span');
    element.textContent = ready || active ? label + (isDraft(id) ? ' (검수용)' : '') : `${label} · 준비 중`;
    if (ready || active) {
      if (active) element.href = location.href;
      else element.href = (location.protocol === 'file:' || !isServerStandard) ? localHref(id) : serverHref(id) + (draftQuery || isDraft(id) ? '?draft=1' : '');
    } else {
      element.className = 'pending';
    }
    if (active) element.setAttribute('aria-current', 'step');
    nav.append(element);
  });

  /* ------------------------------------------------------------ 회로 사이 이동 (요청 0056)
   * 단계 줄 끝에 ◀ 이전 · [회로 고르기 ▾] · 다음 ▶ 를 붙인다. 위의 단계 링크는 건드리지 않는다.
   * - 지금 단계를 유지한다. 이동할 회로에 그 단계가 없으면(승강기 단자대, ready 에 없는 번호) 시뮬레이션으로.
   * - 이전·다음은 같은 과정 안에서만(전기 001↔018, 승강기 01↔10). 끝에서는 흐린 칸.
   * - 핀번호·회로해석에서 적은 답이 있으면 이동 전에 한 번 묻는다(엔진은 고치지 않고 화면에서 확인).
   */
  const pad = (i, digits) => String(i).padStart(digits, '0');
  const circuitsOf = (cid) => courses[cid].titles.map((title, i) => ({ cid, num: pad(i + 1, courses[cid].idDigits), title }));
  const inList = (list, num) => list === 'all' || (list || []).includes(num);
  const draftOnly = (cid, num, id) => showDraft && !inList(courses[cid].ready[id], num) && inList((courses[cid].draft || {})[id], num);
  function stageAvailable(cid, num, id) {
    const c = courses[cid];
    if (!c.stages.some((st) => st.id === id)) return false;
    if (inList(c.ready[id], num)) return true;
    if (id === 'interpret' && (inList(c.interpretPage, num) || cid === 'e')) return true;
    return draftOnly(cid, num, id);
  }
  // 파일로 열 때: 핀번호_작업/v2_엔진분리/ 안의 실제 파일. 없는 단계(전기 시뮬레이션, 001 말고의 전기 회로해석)는 null
  function localFile(cid, num, id) {
    if (cid === 'e') return ({ sim: `e${num}/sim/`, interpret: `e${num}/`, pin: `e${num}/pin/`, wire: `e${num}/wire/` }[id] || null);
    if (id === 'pin') return `${num}/`;
    if (id === 'tb' || id === 'wire') return `${num}/${id}/`;
    if (id === 'interpret' && num === '001') return '회로/interpret.html';
    return null;
  }
  function circuitHref(cid, num) {
    const isFile = location.protocol === 'file:';
    const usable = (id) => stageAvailable(cid, num, id) && (!isFile || localFile(cid, num, id));
    const stage = usable(current) ? current : usable('sim') ? 'sim' : (['pin', 'interpret'].find(usable) || 'sim');
    if (isFile && scriptSrc) {
      const rel = localFile(cid, num, stage) || localFile(cid, num, 'pin') || '';
      return new URL('../' + rel.replace(/\/$/, '/index.html'), scriptSrc).href;
    }
    const draft = draftQuery || draftOnly(cid, num, stage);   // 위 단계 링크와 같은 규칙
    const href = stage === 'sim' ? (cid === 'c' ? `/c/${num}/` : `/e/${num}/sim/`)
      : stage === 'interpret' ? (cid === 'c' ? `/c/${num}/interpret/` : `/e/${num}/`)
        : `/${cid}/${num}/${stage}/`;
    return href + (draft ? '?draft=1' : '');
  }

  // 적은 답이 있는지: 핀번호 = 회로도 칸에 학생이 넣은 글자(진한 남색 글씨), 회로해석 = 접점 고르기에서 고른 것·푼 문제
  //  (동작 설명 쓰기 글은 회로해석 엔진이 브라우저에 저장해 두므로 이동해도 남는다)
  let picked = false;
  if (current === 'interpret') {
    const seen = () => { if (document.querySelector('.ip-picked b, .ip-qdots button.is-ok, .ip-qdots button.is-bad')) picked = true; };
    new MutationObserver(seen).observe(document.body, { childList: true, subtree: true });
    document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('#btnRetry')) setTimeout(() => { picked = false; }); });
  }
  function hasWork() {
    if (current === 'pin') return !!document.querySelector('#circuit [data-slot] text[fill="#0b2a6b"]');
    if (current === 'interpret') return picked;
    if (current === 'wire') return document.body.dataset.wireUnsaved === '1';
    return false;
  }
  const leaveOk = () => !hasWork() || window.confirm('이동하면 적은 내용이 사라져요. 이동할까요?');

  const list = circuitsOf(courseId);
  const at = list.findIndex((c) => c.num === number);
  if (at < 0) return;
  const here = list[at];
  const box = document.createElement('div');
  box.className = 'circuit-nav';
  box.setAttribute('role', 'group');
  box.setAttribute('aria-label', '다른 회로로 이동');

  function stepButton(target, dir) {
    const arrow = dir < 0 ? '◀' : '▶', word = dir < 0 ? '이전' : '다음';
    const el = document.createElement(target ? 'a' : 'span');
    el.className = 'cn-step' + (target ? '' : ' cn-off');
    el.innerHTML = dir < 0 ? `<b class="cn-in" aria-hidden="true">${arrow}</b><b class="cn-in cn-word">${word}</b>`
      : `<b class="cn-in cn-word">${word}</b><b class="cn-in" aria-hidden="true">${arrow}</b>`;
    if (target) {
      el.href = circuitHref(target.cid, target.num);
      el.rel = dir < 0 ? 'prev' : 'next';
      el.title = `${word} 회로: ${target.num} ${target.title}`;
      el.setAttribute('aria-label', el.title);
      el.addEventListener('click', (e) => { if (!leaveOk()) e.preventDefault(); });
    } else {
      el.setAttribute('aria-disabled', 'true');
      el.title = dir < 0 ? '첫 회로예요' : '마지막 회로예요';
      el.setAttribute('aria-label', `${word} 회로 없음`);
    }
    return el;
  }

  const pick = document.createElement('label');
  pick.className = 'cn-pick';
  pick.title = '회로 고르기';
  pick.innerHTML = `<b class="cn-in cn-face" aria-hidden="true"><b class="cn-in cn-num">${here.num}</b><b class="cn-in cn-title">${here.title}</b><b class="cn-in cn-caret">▾</b></b>`;
  const select = document.createElement('select');
  select.setAttribute('aria-label', '회로 고르기');
  Object.keys(courses).forEach((cid) => {
    const group = document.createElement('optgroup');
    group.label = courses[cid].label;
    circuitsOf(cid).forEach((c) => {
      const option = new Option(`${c.num} ${c.title}`, circuitHref(c.cid, c.num));
      if (c.cid === courseId && c.num === number) { option.selected = true; option.defaultSelected = true; }
      group.append(option);
    });
    select.append(group);
  });
  const hereValue = select.value;
  select.addEventListener('change', () => {
    if (select.value === hereValue) return;
    if (!leaveOk()) { select.value = hereValue; return; }
    location.href = select.value;
  });
  window.addEventListener('pageshow', () => { select.value = hereValue; });   // 뒤로 가기로 돌아왔을 때 고른 칸을 지금 회로로
  pick.append(select);

  box.append(stepButton(list[at - 1], -1), pick, stepButton(list[at + 1], 1));
  nav.append(box);

  // 0098-4: 기존 단계·회로 이동 배치는 유지하고 여백에 작은 인쇄 진입만 붙인다.
  if (['interpret','pin','tb','wire'].includes(current)) {
    const entry=document.createElement('a');
    entry.className='teacher-print';entry.title='교사용 유인물';entry.setAttribute('aria-label','교사용 유인물');
    entry.setAttribute('data-html2canvas-ignore','true');
    const printUrl=location.protocol==='file:'?new URL('../print/index.html',scriptSrc):new URL('/print/',location.href);
    printUrl.search=new URLSearchParams({c:courseId==='e'?'e'+number:number,k:current});entry.href=printUrl.href;
    nav.append(entry);
    // 기존 단계 줄의 position·테두리 합성은 바꾸지 않는다.
    const placeEntry=()=>{
      const area=nav.getBoundingClientRect(),width=entry.offsetWidth||18,height=20;
      const bounds=[...nav.children].filter(e=>e!==entry).map(e=>e.getBoundingClientRect());
      const candidates=bounds.flatMap(b=>[{x:b.right+6,y:(b.top+b.bottom)/2},{x:b.left-width-6,y:(b.top+b.bottom)/2}]);
      const spot=candidates.find(p=>p.x>=area.left+2&&p.x+width<=area.right-2&&!bounds.some(b=>p.x<b.right+2&&p.x+width>b.left-2&&p.y-height/2<b.bottom+2&&p.y+height/2>b.top-2));
      entry.style.display=spot?'':'none';if(spot){entry.style.left=spot.x+'px';entry.style.top=spot.y+'px';}
    };
    window.addEventListener('resize',placeEntry);window.addEventListener('scroll',placeEntry,{passive:true});
    new ResizeObserver(placeEntry).observe(nav);window.addEventListener('load',placeEntry);
    const css=document.createElement('link');css.rel='stylesheet';const cssUrl=new URL('print-entry.css',scriptSrc);cssUrl.search=new URL(scriptSrc).search;css.href=cssUrl.href;document.head.append(css);
    css.addEventListener('load',placeEntry);placeEntry();
  }

  if (!document.getElementById('circuit-nav-style')) {
    // 단계 줄 스타일은 페이지마다 다른 파일(공용 CSS·전기 회로 앱 index.html·승강기 sim/styles.css)에 있어서, 새 칸 모양만 여기 한곳에 둔다
    const style = document.createElement('style');
    style.id = 'circuit-nav-style';
    style.textContent = `
#steps .circuit-nav{display:flex;align-items:stretch;gap:6px;margin-left:auto;padding:0;border:0;background:none}
#steps .circuit-nav .cn-in{display:inline;padding:0;border:0;border-radius:0;background:none;font:inherit;color:inherit}
#steps .circuit-nav .cn-step{gap:5px;white-space:nowrap}
#steps .circuit-nav .cn-off{opacity:.4;cursor:default;background:#f7faf9}
#steps .cn-pick{position:relative;display:inline-flex;align-items:center;min-width:0;min-height:26px;padding:0 12px;border:1px solid var(--accent-line,#c2d6d2);border-radius:8px;background:#fff;font-size:13px;font-weight:700;color:var(--accent-ink,#087d76);cursor:pointer}
#steps .cn-pick:hover,#steps .cn-pick:focus-within{border-color:var(--accent-ink,#087d76);background:var(--tint-hover,#e0ece9)}
#steps .cn-pick:focus-within{outline:2px solid var(--accent-ink,#087d76);outline-offset:1px}
#steps .circuit-nav .cn-face{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
#steps .circuit-nav .cn-num{font-weight:800}
#steps .circuit-nav .cn-title{color:var(--ink,#172e38);font-weight:600}
#steps .circuit-nav .cn-caret{font-size:11px}
#steps .cn-pick select{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:16px;border:0}
@media (max-width:600px){#steps .circuit-nav{gap:4px}#steps .circuit-nav .cn-word,#steps .circuit-nav .cn-title{display:none}#steps .cn-pick{padding:0 10px;font-size:12px}}
`;
    document.head.append(style);
  }
})();
