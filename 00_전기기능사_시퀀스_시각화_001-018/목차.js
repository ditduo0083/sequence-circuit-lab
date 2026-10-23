/**
 * KSE 시퀀스 실습 포털 목차 제어 스크립트
 * - 과목 필터 바 (전체 28 / 전기기능사 18 / 승강기기능사 10) 전환
 * - 과목별 2단 세부필터 및 실시간 통합 검색 (과목 전용 검색어 및 세분화 키워드 대응)
 * - 자릿수 가변 라우팅 정규식(/c/NNN/, /e/NN/) 및 카드 실습 줄(회로해석·핀번호·단자대·결선) 자동 생성
 */

const search = document.querySelector('#search');
const courseChips = [...document.querySelectorAll('.course-chip')];
const cards = [...document.querySelectorAll('.card')];
const count = document.querySelector('#result-count');
const noResults = document.querySelector('#no-results');
const resetBtn = document.querySelector('#reset-filter');

// 1. 카드 실습 줄 (요청 0053 B안): 윗줄 '▶ 시뮬레이션'(HTML) 아래에 '실습' 이름표 + 같은 폭 칸 버튼을 만든다.
//    주소는 시뮬레이션 링크(c/NNN/, e/NN/sim/)에서 과정·번호를 읽어 만든다. 승강기는 단자대 단계가 없다.
const practiceStages = {
  c: [['interpret', '① 회로해석'], ['pin', '② 핀번호'], ['tb', '③ 단자대'], ['wire', '④ 결선']],
  e: [['interpret', '① 회로해석'], ['pin', '② 핀번호'], ['wire', '③ 결선']]
};
// 아직 배포 전인 칸은 'c/001/tb' 식으로 넣으면 '준비 중'(누를 수 없음)으로 보인다.
const notReady = new Set([]);

function practiceHref(course, circuit, stage) {
  if (location.protocol === 'file:') {
    // 파일로 열 때: 저장소의 v2 원본 페이지 (전기 회로해석은 v2 원본이 템플릿 하나라 서버 주소 그대로)
    const v2 = '../핀번호_작업/v2_엔진분리/';
    if (course === 'e') return `${v2}e${circuit}/${stage === 'interpret' ? '' : stage + '/'}index.html`;
    if (stage === 'pin') return `${v2}${circuit}/index.html`;
    if (stage !== 'interpret') return `${v2}${circuit}/${stage}/index.html`;
  }
  if (course === 'e' && stage === 'interpret') return `e/${circuit}/`;
  return `${course}/${circuit}/${stage}/`;
}

cards.forEach((card) => {
  const links = card.querySelector('.links');
  const href = links?.querySelector('a.primary')?.getAttribute('href') || '';
  const match = href.match(/^([ce])\/([0-9a-zA-Z]+)/);
  if (!match || links.querySelector('.practice')) return;
  const [, course, circuit] = match;
  const stages = practiceStages[course];

  const row = document.createElement('div');
  row.className = 'practice';
  row.setAttribute('role', 'group');
  row.setAttribute('aria-label', '실습');
  const label = document.createElement('span');
  label.className = 'practice-label';
  label.textContent = '실습';
  label.setAttribute('aria-hidden', 'true');
  const btns = document.createElement('div');
  btns.className = 'practice-btns';
  btns.style.setProperty('--n', stages.length);
  stages.forEach(([stage, text]) => {
    const ready = !notReady.has(`${course}/${circuit}/${stage}`);
    const el = document.createElement(ready ? 'a' : 'span');
    el.textContent = text;
    el.dataset.stage = stage;
    if (ready) el.href = practiceHref(course, circuit, stage);
    else { el.className = 'pending'; el.title = '준비 중'; }
    btns.append(el);
  });
  row.append(label, btns);
  links.append(row);
});

// 2. 상태 관리
let currentCourse = 'all'; // 'all': 전체 28개, 'c': 전기기능사, 'e': 승강기기능사
let group = 'all';

// URL 해시 또는 쿼리스트링 초기 감지 (#e, #c, #all 또는 ?course=e)
const initHash = location.hash.replace('#', '').toLowerCase();
const urlParams = new URLSearchParams(location.search);
const initCourse = urlParams.get('course')?.toLowerCase() || initHash;
if (initCourse === 'e' || initCourse === 'elev' || initCourse === 'elevator') {
  currentCourse = 'e';
} else if (initCourse === 'c' || initCourse === 'craft') {
  currentCourse = 'c';
} else {
  currentCourse = 'all';
}

function updateCatalog() {
  const rawQuery = search.value.trim();
  const query = rawQuery.toLocaleLowerCase('ko-KR');
  let visible = 0;

  // 1. 단일 글자 '전' vs '승' 및 과목 명시어 처리
  const isCraftSpecific = query === '전' || query === '전기' || query === '전기기능사';
  const isElevSpecific = query === '승' || query === '승강기' || query === '승강기기능사';

  cards.forEach((card) => {
    const cardCourse = card.dataset.course || 'c';
    const cardText = (card.dataset.text || '').toLocaleLowerCase('ko-KR');

    // 과목 매칭:
    let courseMatch = false;
    if (isCraftSpecific) {
      courseMatch = cardCourse === 'c';
    } else if (isElevSpecific) {
      courseMatch = cardCourse === 'e';
    } else if (currentCourse === 'all') {
      courseMatch = true;
    } else if (query && cardText.includes(query)) {
      // 탭이 선택된 상태여도 검색어가 다른 과목의 카드와 일치하면 유연하게 표시
      courseMatch = true;
    } else {
      courseMatch = cardCourse === currentCourse;
    }

    // 그룹 서브필터 매칭:
    // 검색어가 없을 때는 그룹 서브필터 엄격 적용,
    // 검색어가 있을 때는 검색어 일치가 우선이므로 group이 'all'이거나 검색 매칭 시 표시
    const groupMatch = !query ? (group === 'all' || card.dataset.group === group) : true;

    // 텍스트 매칭:
    let textMatch = false;
    if (!query) {
      textMatch = true;
    } else if (isCraftSpecific) {
      textMatch = cardCourse === 'c';
    } else if (isElevSpecific) {
      textMatch = cardCourse === 'e';
    } else if (query === 'ls') {
      // 'fls'와 'ls' 구분: 단어 단위 토큰 검사
      const tokens = cardText.split(/\s+/);
      textMatch = tokens.includes('ls');
    } else if (query === 'fls') {
      const tokens = cardText.split(/\s+/);
      textMatch = tokens.includes('fls');
    } else {
      textMatch = cardText.includes(query);
    }

    const isVisible = courseMatch && groupMatch && textMatch;
    card.hidden = !isVisible;
    if (isVisible) visible += 1;
  });

  count.textContent = `${visible}개 자료`;
  if (noResults) {
    noResults.hidden = visible > 0;
  }
}

// 3. 과목 필터 칩 전환 핸들러
function setCourse(newCourse) {
  currentCourse = newCourse;
  courseChips.forEach((chip) => {
    const isActive = chip.dataset.course === currentCourse;
    chip.classList.toggle('active', isActive);
    chip.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // 서브필터 컨테이너 표시 제어: 'all'일 땐 세부 필터 숨김, 'c'/'e'일 땐 해당 과목 표시
  document.querySelectorAll('.filters').forEach((f) => {
    const isVisible = currentCourse !== 'all' && f.classList.contains(`course-${currentCourse}`);
    f.hidden = !isVisible;
    f.style.display = isVisible ? 'flex' : 'none';
  });

  // 서브필터 초기화
  group = 'all';
  if (currentCourse !== 'all') {
    document.querySelectorAll(`.filters.course-${currentCourse} button`).forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === 'all');
    });
  }

  updateCatalog();
}

courseChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    setCourse(chip.dataset.course);
  });
});

// 4. 서브필터 버튼 이벤트 등록
document.querySelectorAll('.filters button').forEach((btn) => {
  btn.addEventListener('click', () => {
    group = btn.dataset.filter;
    btn.parentElement.querySelectorAll('button').forEach((b) => {
      b.classList.toggle('active', b === btn);
    });
    updateCatalog();
  });
});

// 5. 검색창 및 리셋 버튼 이벤트
search.addEventListener('input', updateCatalog);

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    search.value = '';
    group = 'all';
    if (currentCourse !== 'all') {
      document.querySelectorAll(`.filters.course-${currentCourse} button`).forEach((item) => {
        item.classList.toggle('active', item.dataset.filter === 'all');
      });
    }
    updateCatalog();
    search.focus();
  });
}

// 초기화 실행
setCourse(currentCourse);

// 방문자 수 (요청 0048): 서버가 10분마다 만드는 /visits.json 을 읽는다. 실패하면 아무것도 안 보인다.
(function () {
  var el = document.getElementById('visitCount');
  if (!el || !window.fetch) return;
  fetch('/visits.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || typeof d.today !== 'number' || typeof d.total !== 'number') return;
      el.textContent = '오늘 방문 ' + d.today.toLocaleString('ko-KR') + ' · 전체 방문 ' + d.total.toLocaleString('ko-KR');
      el.hidden = false;
    })
    .catch(function () {});
})();

