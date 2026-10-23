/*
 * 회로해석 — 공용 엔진 (2026-09-23, 요청 0018 · 결정 D0008)
 * ------------------------------------------------------------------
 * 한 페이지 안에서 탭 세 개로 전환한다.
 *   ① 동작 보기   : 회로도에서 기기별 코일·접점 찾기 + 기존 시뮬레이션(회로 앱) 열기
 *   ② 동작 설명 쓰기 : 학생이 동작을 서술한다. 자동 채점 없음. 모범 답안(synopsis)은 펼쳐 볼 수 있고, 본 사실은 결과 이미지에 남는다
 *                    (요청 0059 B안) 다 쓴 뒤 '나란히 비교'를 누르면 내 설명(계속 고칠 수 있음) | 모범 답안 두 칸.
 *                    모범 답안 문장마다 '내 설명에도 있어요' 스스로 확인(점수 아님) → 결과 이미지에 '스스로 확인 m/n'
 *   ③ 접점 고르기  : 질문(interpretQuestions)을 읽고 회로도에서 접점·코일을 눌러 고른다. 누르면 바로 정답·오답 표시
 * 제출: ②·③ 결과를 한 장의 PNG로 저장(핀번호 적기와 같은 방식, 이름·학번·날짜 포함). 텍스트 업로드 기능은 없다.
 *
 * 읽는 파일(이 순서로): steps.js, device-library.js, pin-validate.js, circuit-NNN.js, diagram-render.js, interpret-engine.js
 * 회로 고르기: <body data-circuit="001"> 또는 등록된 회로가 하나면 그것.
 *
 * 회로 데이터에 더하는 필드 (없어도 페이지는 열린다 — 해당 탭에 "준비 중"이 나온다)
 *   synopsis: { text: '동작 설명 전체(문장은 마침표로 끝냄)', verified: true|false }
 *     verified: 원문대조(C001 방식, 연속 일치 15자 미만) 통과 후 true. true 가 아니면 모범 답안을 학생에게 보이지 않는다.
 *     주소 뒤에 ?draft=1 을 붙이면 선생님 검수용으로 보인다.
 *   interpretQuestions: [{ id:'q1', prompt:'질문', answerItemIds:['coil-MC1'], multi:false, explain:'풀이(선택)' }]
 *     answerItemIds: layout.items 의 id (회로도에 기호가 그려지는 접점·코일·램프만 고를 수 있다. 주회로 극·FLS 전극은 안 됨)
 *     multi:false → 하나 누르면 바로 판정. answerItemIds 가 여러 개면 그중 아무거나 하나가 정답
 *     multi:true  → 여러 개 고른 뒤 '확인'. answerItemIds 전부를 빠짐없이, 더도 덜도 없이 골라야 정답
 */
(function () {
  'use strict';
  var ENGINE_SRC = document.currentScript && document.currentScript.src;
  var L = window.PIN_DEVICE_LIBRARY, V = window.PIN_VALIDATE, DR = window.DIAGRAM_RENDER;
  if (!DR) throw new Error('diagram-render.js 를 interpret-engine.js 보다 먼저 불러와야 합니다.');
  var which = (document.body && document.body.dataset && document.body.dataset.circuit) || Object.keys(window.PIN_CIRCUITS || {})[0];
  var C = (window.PIN_CIRCUITS || {})[which];
  var FONT = DR.FONT;
  var DRAFT = /[?&]draft=1\b/.test(location.search);

  /* ------------------------------------------------------------ 회로 데이터 */
  var LAY = C.layout, VB = LAY.viewBox, COILY = LAY.coilY;
  var report = V.validate(L, C);
  var items = report.items || [];
  var byId = {}; items.forEach(function (it) { byId[it.id] = it; });
  var DRAWABLE = DR.drawableItems(LAY, items, byId);
  var TITLE = C.interpretTitle || String(C.title || C.id).replace(/·\s*핀번호 적기\s*$/, '· 회로해석');
  if (TITLE === C.title) TITLE = C.title + ' · 회로해석';

  // 질문 검사 (엔진이 직접 한다 — pin-validate 는 핀번호용)
  var qErrors = [];
  var QUESTIONS = (C.interpretQuestions || []).filter(function (q, i) {
    var where = '접점 고르기 ' + (q && q.id ? q.id : (i + 1) + '번째');
    if (!q || !q.prompt) { qErrors.push(where + ': prompt(질문 글)가 없습니다.'); return false; }
    if (!q.answerItemIds || !q.answerItemIds.length) { qErrors.push(where + ': answerItemIds(정답 항목)가 없습니다.'); return false; }
    var bad = q.answerItemIds.filter(function (id) { return !DRAWABLE[id]; });
    if (bad.length) { qErrors.push(where + ': 회로도에서 고를 수 없는 항목 ' + bad.join(', ') + ' (layout.items 의 접점·코일·램프 id 인지 확인)'); return false; }
    return true;
  });
  QUESTIONS.forEach(function (q, i) { if (!q.id) q.id = 'q' + (i + 1); });
  var SYN = C.synopsis && C.synopsis.text ? C.synopsis : null;
  var SYN_SHOWABLE = !!(SYN && (SYN.verified === true || DRAFT));

  /* ------------------------------------------------------------ 상태 */
  var MODES = ['watch', 'write', 'pick'];
  var state = {
    mode: MODES.indexOf(location.hash.slice(1)) >= 0 ? location.hash.slice(1) : 'watch',
    focusTag: null,
    peekedAt: null, showModel: false, helpOpen: false, selfChk: {},
    q: 0, picks: {}, done: {}, attempt: 1
  };
  var STORE_KEY = 'seq-interpret-' + C.id + '-answer';
  function storeGet() { try { return window.localStorage.getItem(STORE_KEY) || ''; } catch (e) { return ''; } }
  function storeSet(v) { try { if (v) window.localStorage.setItem(STORE_KEY, v); else window.localStorage.removeItem(STORE_KEY); } catch (e) { } }

  /* ------------------------------------------------------------ 도우미 */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tagType(tag) { var d = C.devices[tag]; return d ? d.type : null; }
  function deviceName(tag) {
    var t = tagType(tag), d = C.devices[tag] || {};
    if (t && L.types[t]) return L.types[t].name;
    return ({ pb: '푸시버튼', ss: '셀렉터 스위치', lamp: tag === 'BZ' ? '부저' : '램프' })[d.cat] || '';
  }
  function coilNote(tag) {
    var t = tagType(tag), T = t && L.types[t];
    if (!T || !T.coil) return '';
    if (t === 'timer-8p') return '코일이 여자되면 순시 접점은 바로, 한시 접점은 설정 시간이 지난 뒤 바뀌어요(a접점은 닫히고 b접점은 열림).';
    if (t === 'eocr-12p') return 'EOCR은 전원이 들어가도 접점이 그대로예요. 과부하를 감지하면 b접점은 열리고 a접점은 닫혀요.';
    if (t === 'fls-8p') return 'FLS는 전원이 들어간 상태에서 전극이 수위를 감지하면 접점이 바뀌어요.';
    if (t === 'flicker-8p') return '코일이 여자되면 접점이 설정 간격마다 번갈아 바뀌어요.';
    return '코일이 여자되면 이 기기의 a접점은 닫히고 b접점은 열려요.';
  }
  function itemTitle(id) { var it = byId[id]; return it ? (it.title || it.id) : id; }
  // 문장 나누기(마침표 뒤 공백 기준). 뒤돌아보기 정규식은 옛 iOS 사파리에서 문법 오류라 쓰지 않는다
  function sentences(text) { return String(text).replace(/([.!?])\s+/g, '$1\n').split('\n').filter(function (x) { return x.trim(); }); }
  function simHref() {
    if (C.simHref) return C.simHref;
    // 승강기 과정 회로 앱(요청 0023): 회로 데이터에 sim: true → 서버 /e/NN/sim/, 파일로 열면 eNN/sim/index.html
    if (C.sim) { var sm = /^([a-z])(\d+)$/.exec(C.id), onServer = /\/[a-z]\/\d{2,3}\/(interpret\/)?(index\.html)?$/.test(location.pathname); return (sm && onServer) ? '/' + sm[1] + '/' + sm[2] + '/sim/' : 'sim/index.html'; }
    if (!C.app) return null;   // 시뮬레이션(회로 앱)이 없는 회로 — 예: 승강기 과정(sim 이 아직 없는 번호)
    if (/\/interpret\/(index\.html)?$/.test(location.pathname)) return location.protocol === 'file:' ? '../index.html' : '../';
    if (C.app && C.app.folder && ENGINE_SRC) return new URL('../../../00_전기기능사_시퀀스_시각화_001-018/01_개별_수업자료/' + C.app.folder + '/index.html', ENGINE_SRC).href;
    return null;
  }
  // 기구 태그 목록(회로도에 기호가 있는 것만, 처음 나온 순서)
  var TAGS = [];
  items.forEach(function (it) { if (DRAWABLE[it.id] && TAGS.indexOf(it.tag) < 0) TAGS.push(it.tag); });

  /* ------------------------------------------------------------ 회로도 */
  var svg = document.getElementById('circuit');
  svg.setAttribute('viewBox', '0 0 ' + VB[0] + ' ' + VB[1]);
  svg.style.setProperty('--svg-width', VB[0] + 'px');
  function curQ() { return QUESTIONS[state.q]; }
  function itemClass(it) {
    var c = [];
    if (state.mode === 'watch') {
      if (state.focusTag && it.tag === state.focusTag) c.push('focus');
    } else if (state.mode === 'pick') {
      var q = curQ(); if (!q) return '';
      var picks = state.picks[q.id] || [], done = state.done[q.id], mine = picks.indexOf(it.id) >= 0, ans = q.answerItemIds.indexOf(it.id) >= 0;
      if (!done) { if (mine) c.push('sel'); }
      else if (mine) c.push(done.correct || ans ? 'ok' : 'bad');
      else if (ans && (q.multi || !done.correct)) c.push('miss');
    }
    return c.join(' ');
  }
  function drawCircuit() {
    var interactive = state.mode !== 'write';
    svg.setAttribute('class', 'ip-circuit mode-' + state.mode + (state.mode === 'watch' && state.focusTag ? ' has-focus' : '') + (interactive ? ' clickable' : ''));
    svg.innerHTML = DR.drawBase(LAY, items, byId, COILY, { wrapItems: interactive, itemClass: itemClass }).join('');
  }

  /* ------------------------------------------------------------ ① 동작 보기 */
  function renderWatch() {
    var h = [], href = simHref();
    h.push('<h2>동작 보기</h2><p class="where">기기 이름을 누르면 그 기기의 코일과 접점이 회로도에 함께 표시돼요. 회로도의 기호를 눌러도 돼요.</p>');
    h.push('<div class="ip-chips" role="group" aria-label="같은 기기 찾기">' + TAGS.map(function (t) {
      return '<button type="button" data-tag="' + esc(t) + '" aria-pressed="' + (state.focusTag === t) + '">' + esc(t) + '</button>';
    }).join('') + '</div>');
    if (state.focusTag) {
      var list = items.filter(function (it) { return it.tag === state.focusTag && DRAWABLE[it.id]; });
      var nm = deviceName(state.focusTag);
      h.push('<div class="hint"><b>' + esc(state.focusTag) + (nm ? ' · ' + esc(nm) : '') + '</b> — 회로도에 ' + list.length + '곳<ul class="ip-list">' +
        list.map(function (it) { return '<li>' + esc(it.title || it.id) + '</li>'; }).join('') + '</ul>' +
        (coilNote(state.focusTag) ? '<span class="note">' + coilNote(state.focusTag) + '</span>' : '') + '</div>');
    }
    h.push('<div class="ip-sim"><h3>시뮬레이션으로 동작 확인</h3>');
    if (href) {
      h.push('<p>스위치를 직접 눌러 보며 전류가 흐르는 길과 코일·접점의 변화를 확인해요. 단계별 설명도 함께 나와요.</p>' +
        '<p><a class="ip-button primary" id="simLink" href="' + esc(href) + '">시뮬레이션 열기 →</a></p>' +
        '<p class="note">같은 창에서 열려요. 위쪽 단계 줄의 <b>회로해석</b>을 누르면 이 화면으로 돌아와요.</p>');
    } else {
      h.push('<p class="note">이 회로의 시뮬레이션은 준비 중이에요.</p>');
    }
    h.push('</div>');
    h.push('<p class="note">다 살펴봤으면 <b>② 동작 설명 쓰기</b>로 넘어가요.</p>');
    return h.join('');
  }

  /* ------------------------------------------------------------ ② 동작 설명 쓰기 */
  var SYN_SENTS = SYN ? sentences(SYN.text) : [];
  function numberedAnswer() { return SYN_SENTS.map(function (_, i) { return (i + 1) + '. '; }).join('\n'); }
  // 번호만 남은 줄은 작성 글·글자 수·제출에서 제외한다. 나머지 학생 글은 그대로 둔다.
  function writtenAnswer(text) { return String(text).split('\n').filter(function (line) { return !/^\s*\d+\.\s*$/.test(line); }).join('\n'); }
  function answerLength() { return writtenAnswer(answerText).length; }
  var answerText = storeGet() || numberedAnswer();
  function selfCount() { var n = 0; for (var k in state.selfChk) if (state.selfChk[k]) n++; return n; }
  function selfSumText() { return '스스로 확인: 모범 답안 ' + SYN_SENTS.length + '문장 중 ' + selfCount() + '문장이 내 설명에도 있어요 (점수 아님)'; }
  function renderWrite() {
    var h = [], cmp = SYN_SHOWABLE && state.showModel;
    // '다 썼어요' 단추는 쓰기 칸 바로 아래 줄에 둔다(1366×768 첫 화면에서도 보이게)
    var open = !cmp && SYN_SHOWABLE ? '<button type="button" id="btnModel" class="primary">다 썼어요 → 모범 답안과 나란히 비교</button>' : '';
    var mine = '<label class="ip-label" for="answer">' + (cmp ? '나의 동작 설명 <span class="note">(고쳐 써도 돼요)</span>' : '나의 동작 설명') + '</label>' +
      '<textarea id="answer" rows="12" spellcheck="false" placeholder="여기에 써요. 기기 이름(MC1, PB1, EOCR 등)은 회로도에 적힌 그대로 써요.">' + esc(answerText) + '</textarea>' +
      '<p class="ip-number-guide">번호마다 한 가지 동작을 써요(누르면 → 여자/소자 → 결과).</p>' +
      '<div class="ip-row"><span id="answerCount" class="note">' + answerLength() + '자</span><button type="button" id="btnClearAnswer" class="quiet">새로 쓰기(지우기)</button><span class="sep"></span>' + open + '</div>';
    h.push('<h2>동작 설명 쓰기</h2>');
    if (cmp) {
      // 나란히 비교: 왼쪽 내 설명(계속 고칠 수 있음) | 오른쪽 모범 답안 + 문장마다 스스로 확인
      h.push('<p class="where">모범 답안과 내 설명을 나란히 비교해 보세요. 빠진 내용은 내 설명 칸에서 고쳐 써도 돼요. 다 되면 <b>이미지 저장</b>을 눌러요.</p>');
      h.push('<div class="ip-compare"><div class="ip-cmp-mine">' + mine + '</div>');
      h.push('<div class="ip-model ip-cmp-model"><h3>모범 답안' + (SYN.verified === true ? '' : ' <span class="tag-warn">(검수 전 초안 — 선생님 확인용)</span>') + '</h3>' +
        '<p class="ip-selfsum" id="selfSum">' + selfSumText() + '</p>' +
        '<ol class="ip-model-text">' + SYN_SENTS.map(function (s, i) {
          return '<li>' + esc(s) + ' <label class="ip-selfchk"><input type="checkbox" data-si="' + i + '"' + (state.selfChk[i] ? ' checked' : '') + '> 내 설명에도 있어요</label></li>';
        }).join('') + '</ol>' +
        '<button type="button" id="btnModel" class="quiet">비교 닫기</button></div></div>');
      return h.join('');
    }
    h.push('<p class="where">회로도를 보고 이 회로가 어떻게 동작하는지 순서대로 써 보세요. 점수는 매기지 않아요.</p>');
    h.push('<details class="ip-help"' + (state.helpOpen ? ' open' : '') + '><summary>쓰는 순서 도움말</summary><ol class="ip-list">' +
      '<li>전원을 넣었을 때 먼저 동작하는 것(대기 상태)</li><li>기동 조건 — 무엇을 누르거나 감지하면 무엇이 여자되는지</li>' +
      '<li>자기유지 — 손을 떼도 계속 동작하는 까닭</li><li>인터록·보호 — 과부하 등 이상이 생기면</li><li>정지 조건</li></ol>' +
      '<span class="note">예) PB1을 누르면 MC1이 여자되고, MC1의 a접점이 닫혀 자기유지된다.</span></details>');
    h.push(mine);
    h.push('<p class="note ip-model-note">' + (!SYN_SHOWABLE ? '모범 답안은 ' + (SYN ? '선생님 검수 중' : '준비 중') + '이에요.' :
      '먼저 스스로 써 본 다음에 열어요. 모범 답안을 열면 결과 이미지에 <b>“모범 답안 열람”</b>이 표시돼요. 다 되면 <b>이미지 저장</b>으로 선생님께 보내요.') + '</p>');
    return h.join('');
  }

  /* ------------------------------------------------------------ ③ 접점 고르기 */
  function pickScore() {
    var ok = 0, done = 0;
    QUESTIONS.forEach(function (q) { var d = state.done[q.id]; if (d) { done++; if (d.correct) ok++; } });
    return { ok: ok, done: done, total: QUESTIONS.length };
  }
  function judge(q, picks) {
    var ans = q.answerItemIds;
    if (!q.multi) return picks.length === 1 && ans.indexOf(picks[0]) >= 0;
    return picks.length === ans.length && ans.every(function (id) { return picks.indexOf(id) >= 0; });
  }
  function renderPick() {
    var h = [];
    if (!QUESTIONS.length) return '<h2>접점 고르기</h2><p class="empty-panel">이 회로의 문제는 준비 중이에요.</p>';
    var q = curQ(), picks = state.picks[q.id] || [], done = state.done[q.id], sc = pickScore();
    h.push('<h2>접점 고르기 <span class="ip-qno">' + (state.q + 1) + ' / ' + QUESTIONS.length + '</span></h2>');
    h.push('<p class="ip-prompt">' + esc(q.prompt) + '</p>');
    h.push('<p class="note">' + (q.multi ? '정답이 여러 개예요. 회로도에서 모두 고른 뒤 <b>확인</b>을 눌러요.' : '회로도에서 알맞은 기호를 하나 누르면 바로 확인돼요.') + '</p>');
    if (!done) {
      h.push('<div class="ip-picked">고른 것: ' + (picks.length ? picks.map(function (id) { return '<b>' + esc(itemTitle(id)) + '</b>'; }).join(', ') : '<span class="note">아직 없음</span>') + '</div>');
      if (q.multi) h.push('<div class="ip-row"><button type="button" class="primary" id="btnJudge"' + (picks.length ? '' : ' disabled') + '>확인</button><button type="button" id="btnUnpick"' + (picks.length ? '' : ' disabled') + '>선택 지우기</button></div>');
    } else {
      h.push('<div class="hint ip-verdict ' + (done.correct ? 'is-ok' : 'is-bad') + '"><b>' + (done.correct ? '정답이에요.' : '다시 생각해 봐요.') + '</b> ' +
        '고른 것: ' + done.picks.map(function (id) { return esc(itemTitle(id)); }).join(', ') + '<br>' +
        (q.multi || !done.correct ? '정답: ' + q.answerItemIds.map(function (id) { return esc(itemTitle(id)); }).join(q.multi ? ', ' : ' 또는 ') : '') +
        (q.explain ? '<br><span class="ip-explain">' + esc(q.explain) + '</span>' : '') + '</div>');
      h.push('<p class="note">회로도 표시: <span class="tag-ok">초록</span> 맞게 고름 · <span class="tag-bad">빨강</span> 잘못 고름 · 점선 초록 = 정답인데 안 고름</p>');
    }
    h.push('<div class="ip-row"><button type="button" id="btnPrev"' + (state.q ? '' : ' disabled') + '>◀ 이전</button><button type="button" id="btnNext"' + (state.q < QUESTIONS.length - 1 ? '' : ' disabled') + '>다음 ▶</button></div>');
    h.push('<div class="ip-qdots" aria-label="문제 목록">' + QUESTIONS.map(function (qq, i) {
      var d = state.done[qq.id], cls = d ? (d.correct ? 'is-ok' : 'is-bad') : '';
      return '<button type="button" data-q="' + i + '" class="' + cls + '"' + (i === state.q ? ' aria-current="true"' : '') + ' title="' + esc(qq.prompt) + '">' + (i + 1) + '</button>';
    }).join('') + '</div>');
    h.push('<p><b>맞힌 문제 ' + sc.ok + ' / ' + sc.total + '</b> <span class="note">(푼 문제 ' + sc.done + (state.attempt > 1 ? ' · ' + state.attempt + '번째 풀이' : '') + ')</span></p>');
    h.push('<button type="button" id="btnRetry" class="quiet">처음부터 다시 풀기</button>');
    return h.join('');
  }
  function pickItem(id) {
    var q = curQ(); if (!q || state.done[q.id] || !DRAWABLE[id]) return;
    var picks = (state.picks[q.id] || []).slice(), i = picks.indexOf(id);
    if (q.multi) { if (i >= 0) picks.splice(i, 1); else picks.push(id); state.picks[q.id] = picks; }
    else { state.picks[q.id] = [id]; state.done[q.id] = { picks: [id], correct: judge(q, [id]) }; }
    render();
  }

  /* ------------------------------------------------------------ 화면 */
  var panel = document.getElementById('panel');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-mode]'));
  function render() {
    tabs.forEach(function (b) { var on = b.getAttribute('data-mode') === state.mode; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
    drawCircuit();
    panel.innerHTML = state.mode === 'watch' ? renderWatch() : state.mode === 'write' ? renderWrite() : renderPick();
    updateProgress();
    layout();
  }
  function updateProgress() {
    var sc = pickScore(), prog = document.getElementById('progress');
    if (prog) prog.textContent = '설명 ' + (writtenAnswer(answerText).trim() ? answerLength() + '자' : '안 씀') + ' · 고르기 ' + sc.ok + '/' + sc.total;
  }
  /* 쓰기 화면 배치(요청 0059 B안) — 모양은 interpret-page.css 의 body[data-ip-mode] 규칙이 정한다.
   *   PC: 회로도를 남은 화면 높이에 맞춤(--ip-main-top), 비교 중엔 오른쪽 칸을 넓힘.
   *   휴대폰·좁은 화면(1100px 이하): 쓰기 칸 먼저, 회로도는 '회로도 펼치기'로 접어 둠(처음엔 접힘) */
  var mainEl = document.querySelector('main'), circBtn = null;
  if (mainEl) {
    circBtn = document.createElement('button');
    circBtn.type = 'button'; circBtn.id = 'btnCircToggle'; circBtn.className = 'quiet ip-circ-toggle';
    document.body.classList.add('ip-circ-closed');
    circBtn.addEventListener('click', function () { document.body.classList.toggle('ip-circ-closed'); layout(); });
    mainEl.parentNode.insertBefore(circBtn, mainEl);
  }
  function layout() {
    var b = document.body;
    b.setAttribute('data-ip-mode', state.mode);
    if (state.mode === 'write' && SYN_SHOWABLE && state.showModel) b.setAttribute('data-ip-compare', ''); else b.removeAttribute('data-ip-compare');
    if (circBtn) circBtn.textContent = b.classList.contains('ip-circ-closed') ? '회로도 펼치기 ▾' : '회로도 접기 ▴';
    if (mainEl) b.style.setProperty('--ip-main-top', Math.round(mainEl.getBoundingClientRect().top + window.scrollY) + 'px');
  }
  window.addEventListener('resize', layout);
  function setMode(m) {
    if (MODES.indexOf(m) < 0 || m === state.mode) return;
    state.mode = m;
    try { history.replaceState(null, '', '#' + m); } catch (e) { }
    render();
  }
  tabs.forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); }); });
  document.querySelector('.ip-tabs').addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var i = MODES.indexOf(state.mode) + (e.key === 'ArrowRight' ? 1 : -1);
    setMode(MODES[(i + MODES.length) % MODES.length]);
    var t = document.querySelector('[data-mode="' + state.mode + '"]'); if (t) t.focus();
    e.preventDefault();
  });
  window.addEventListener('hashchange', function () { var m = location.hash.slice(1); if (MODES.indexOf(m) >= 0) setMode(m); });

  svg.addEventListener('click', function (e) {
    var g = e.target.closest('[data-item-id]'); if (!g) return;
    if (state.mode === 'watch') { var t = g.getAttribute('data-tag'); state.focusTag = state.focusTag === t ? null : t; render(); }
    else if (state.mode === 'pick') pickItem(g.getAttribute('data-item-id'));
  });
  panel.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.hasAttribute('data-tag')) { var t = b.getAttribute('data-tag'); state.focusTag = state.focusTag === t ? null : t; render(); return; }
    if (b.hasAttribute('data-q')) { state.q = +b.getAttribute('data-q'); render(); return; }
    switch (b.id) {
      case 'btnModel': if (!state.showModel && !state.peekedAt) state.peekedAt = new Date(); state.showModel = !state.showModel; render(); break;
      case 'btnClearAnswer': answerText = numberedAnswer(); storeSet(''); render(); break;
      case 'btnPrev': if (state.q > 0) { state.q--; render(); } break;
      case 'btnNext': if (state.q < QUESTIONS.length - 1) { state.q++; render(); } break;
      case 'btnUnpick': state.picks[curQ().id] = []; render(); break;
      case 'btnJudge': var q = curQ(), p = state.picks[q.id] || []; if (p.length) { state.done[q.id] = { picks: p.slice(), correct: judge(q, p) }; render(); } break;
      case 'btnRetry': state.picks = {}; state.done = {}; state.q = 0; state.attempt++; render(); break;
    }
  });
  panel.addEventListener('input', function (e) {
    if (e.target.id !== 'answer') return;
    answerText = e.target.value; storeSet(answerText);
    var c = document.getElementById('answerCount'); if (c) c.textContent = answerLength() + '자';
    updateProgress();
  });
  // 조합 입력 중에는 Enter를 가로채지 않는다. 기존 빈 번호 줄이 있으면 그 줄로 이동한다.
  panel.addEventListener('keydown', function (e) {
    var t = e.target;
    if (t.id !== 'answer' || e.key !== 'Enter' || e.isComposing || e.keyCode === 229 || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || t.selectionStart !== t.selectionEnd) return;
    var pos = t.selectionStart, start = t.value.lastIndexOf('\n', pos - 1) + 1, end = t.value.indexOf('\n', pos);
    if (end < 0) end = t.value.length;
    if (pos !== end) return;
    var line = /^(\s*)(\d+)\.\s*(\S.*)$/.exec(t.value.slice(start, end));
    if (!line) return;
    var next = Number(line[2]) + 1, nextLine = t.value.slice(end + 1).split('\n')[0];
    e.preventDefault();
    if (end < t.value.length && new RegExp('^\\s*' + next + '\\.\\s*$').test(nextLine)) {
      t.setSelectionRange(end + 1 + nextLine.length, end + 1 + nextLine.length);
    } else {
      t.setRangeText('\n' + next + '. ', pos, pos, 'end');
      t.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  // 스스로 확인 체크: 다시 그리지 않고 합계만 고친다(쓰던 글·스크롤 유지)
  panel.addEventListener('change', function (e) {
    var si = e.target.getAttribute && e.target.getAttribute('data-si'); if (si === null || si === undefined) return;
    state.selfChk[si] = e.target.checked;
    var t = document.getElementById('selfSum'); if (t) t.textContent = selfSumText();
  });
  panel.addEventListener('toggle', function (e) { if (e.target.classList && e.target.classList.contains('ip-help')) state.helpOpen = e.target.open; }, true);
  document.addEventListener('keydown', function (e) {
    if (state.mode !== 'pick' || /input|select|textarea/i.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight' && state.q < QUESTIONS.length - 1 && !e.target.closest('.ip-tabs')) { state.q++; render(); }
    else if (e.key === 'ArrowLeft' && state.q > 0 && !e.target.closest('.ip-tabs')) { state.q--; render(); }
  });

  /* ------------------------------------------------------------ 제출 이미지 (PNG) — pin-engine.js 의 저장 방식을 옮겨 옴 */
  function two(n) { return ('0' + n).slice(-2); }
  function stamp(d) { return d.getFullYear() + '-' + two(d.getMonth() + 1) + '-' + two(d.getDate()) + ' ' + two(d.getHours()) + ':' + two(d.getMinutes()); }
  function wrapLines(ctx, text, maxW) {
    var out = [];
    String(text).split(/\n/).forEach(function (para) {
      if (!para.trim()) { out.push(''); return; }
      var line = '';
      Array.from(para).forEach(function (ch) {
        if (ctx.measureText(line + ch).width > maxW && line) { out.push(line); line = ch === ' ' ? '' : ch; }
        else line += ch;
      });
      out.push(line);
    });
    return out;
  }
  function buildPng(cb) {
    var W = 1500, PAD = 36, TW = W - PAD * 2, dH = Math.round(W * VB[1] / VB[0]);
    var meas = document.createElement('canvas').getContext('2d');
    // 글 줄 미리 계산
    meas.font = '20px ' + FONT;
    var submittedAnswer = writtenAnswer(answerText);
    var ansLines = submittedAnswer.trim() ? wrapLines(meas, submittedAnswer.replace(/\s+$/, ''), TW) : ['(작성하지 않음)'];
    var sc = pickScore(), qLines = [];
    QUESTIONS.forEach(function (q, i) {
      var d = state.done[q.id];
      var head = 'Q' + (i + 1) + ' [' + (d ? (d.correct ? '정답' : '오답') : '안 풂') + '] ' + q.prompt;
      var picked = d ? d.picks : (state.picks[q.id] || []);
      var body = '   고른 것: ' + (picked.length ? picked.map(itemTitle).join(', ') : '없음');
      wrapLines(meas, head, TW).forEach(function (l, k) { qLines.push([d ? (d.correct ? 'ok' : 'bad') : 'none', l, k === 0]); });
      wrapLines(meas, body, TW).forEach(function (l) { qLines.push(['sub', l, false]); });
    });
    if (!QUESTIONS.length) qLines.push(['sub', '(이 회로는 접점 고르기 문제가 아직 없음)', false]);
    var LH = 30, head = 120;
    var sec2 = 50 + ansLines.length * LH + 40, sec3 = 50 + qLines.length * LH + 30;
    sec2 += LH;   // 스스로 확인 한 줄(요청 0059)
    var H = head + sec2 + sec3 + 20 + dH + 20;
    var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#1f2933'; ctx.font = 'bold 28px ' + FONT; ctx.fillText(TITLE, PAD, 46);
    var name = document.getElementById('stuName').value || '(이름 없음)', sid = document.getElementById('stuId').value || '(학번 없음)';
    ctx.font = '20px ' + FONT; ctx.fillText('이름 ' + name + '   학번 ' + sid + '   ' + stamp(new Date()), PAD, 84);
    ctx.fillStyle = '#d6dde5'; ctx.fillRect(PAD, 104, TW, 2);
    var y = head;
    // ② 동작 설명
    ctx.fillStyle = '#1d4ed8'; ctx.font = 'bold 22px ' + FONT; ctx.fillText('② 동작 설명', PAD, y + 26);
    ctx.fillStyle = '#5f6b7a'; ctx.font = '17px ' + FONT;
    ctx.fillText('글자 수 ' + answerLength() + '자 · 모범 답안 열람: ' + (state.peekedAt ? '함 (' + two(state.peekedAt.getHours()) + ':' + two(state.peekedAt.getMinutes()) + ')' : '안 함'), PAD + 170, y + 26);
    y += 50;
    ctx.fillStyle = '#5f6b7a'; ctx.font = '17px ' + FONT;
    ctx.fillText(!SYN_SHOWABLE ? '스스로 확인: 모범 답안 준비 중' : !state.peekedAt ? '스스로 확인: 모범 답안을 열지 않음' :
      '스스로 확인 ' + selfCount() + '/' + SYN_SENTS.length + '  (모범 답안 문장 중 내 설명에도 있다고 스스로 표시한 수 · 점수 아님)', PAD, y + 18);
    y += LH; ctx.fillStyle = submittedAnswer.trim() ? '#1f2933' : '#9aa5b1'; ctx.font = '20px ' + FONT;
    ansLines.forEach(function (l) { ctx.fillText(l, PAD, y + 22); y += LH; });
    y += 40;
    // ③ 접점 고르기
    ctx.fillStyle = '#1d4ed8'; ctx.font = 'bold 22px ' + FONT; ctx.fillText('③ 접점 고르기', PAD, y + 26);
    ctx.fillStyle = '#1f2933'; ctx.font = 'bold 19px ' + FONT;
    ctx.fillText('맞힌 문제 ' + sc.ok + ' / ' + sc.total + '   (푼 문제 ' + sc.done + (state.attempt > 1 ? ' · ' + state.attempt + '번째 풀이' : '') + ')', PAD + 190, y + 26);
    y += 50;
    qLines.forEach(function (l) {
      ctx.font = (l[2] ? 'bold ' : '') + '20px ' + FONT;
      ctx.fillStyle = l[0] === 'ok' ? '#1f7a4d' : l[0] === 'bad' ? '#b42318' : l[0] === 'sub' ? '#3e4c59' : '#5f6b7a';
      ctx.fillText(l[1], PAD, y + 22); y += LH;
    });
    y += 30;
    var img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, y, W, dH);
      ctx.strokeStyle = '#d6dde5'; ctx.strokeRect(0.5, y + 0.5, W - 1, dH - 1);
      cv.toBlob(function (b) { cb(b); }, 'image/png');
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + VB[0] + ' ' + VB[1] + '" width="' + W + '" height="' + dH + '">' + DR.drawBase(LAY, items, byId, COILY, {}).join('') + '</svg>');
  }
  function fileName() {
    // 파일 이름은 영문·숫자만 쓴다(한글 파일 이름은 기기에 따라 'download' 로 떨어질 수 있다). 이름·학번은 그림 안에 적힌다
    var id = (document.getElementById('stuId').value || '').replace(/[^0-9A-Za-z-]/g, '');
    var d = new Date(), ymd = '' + d.getFullYear() + two(d.getMonth() + 1) + two(d.getDate());
    return 'interpret-' + C.id + (id ? '-' + id : '') + '-' + ymd + '.png';
  }
  document.getElementById('btnSave').addEventListener('click', function () {
    buildPng(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = fileName(); document.body.appendChild(a); a.click(); a.remove(); });
  });
  var shareBtn = document.getElementById('btnShare');
  try { if (navigator.canShare && navigator.canShare({ files: [new File([''], 'a.png', { type: 'image/png' })] })) shareBtn.hidden = false; } catch (e) { }
  shareBtn.addEventListener('click', function () {
    buildPng(function (b) { var f = new File([b], fileName(), { type: 'image/png' }); navigator.share({ files: [f], title: TITLE }).catch(function () { }); });
  });

  var fsBtn = document.getElementById('fullscreen-button');
  if (fsBtn) {
    fsBtn.addEventListener('click', async function () {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch (e) { fsBtn.textContent = 'F11로 전체 화면'; }
    });
    document.addEventListener('fullscreenchange', function () { fsBtn.textContent = document.fullscreenElement ? '전체 화면 종료' : '전체 화면'; });
  }

  /* ------------------------------------------------------------ 데이터 검사 상자 (선생님용) */
  (function showReport() {
    var errs = report.errors.concat(qErrors), warns = [];
    if (SYN && SYN.verified !== true) warns.push('synopsis.verified 가 true 가 아니라 학생에게 모범 답안을 숨깁니다(원문대조 통과 후 true). 지금은 ' + (DRAFT ? '?draft=1 로 보이는 중' : '주소에 ?draft=1 을 붙이면 보입니다') + '.');
    if (!errs.length && !(DRAFT && warns.length)) return;
    var box = document.createElement('section');
    box.className = 'card datacheck';
    box.innerHTML = '<h3>회로 데이터 검사 (회로해석)</h3>' +
      (errs.length ? '<p class="tag-bad">오류 ' + errs.length + '건</p><ul>' + errs.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' : '') +
      (warns.length ? '<p class="tag-warn">알림 ' + warns.length + '건</p><ul>' + warns.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' : '');
    document.body.insertBefore(box, document.body.firstChild.nextSibling);
  })();

  window.__interpret = { state: state, items: items, byId: byId, QUESTIONS: QUESTIONS, buildPng: buildPng, render: render, setMode: setMode, pickItem: pickItem, fileName: fileName, qErrors: qErrors, TITLE: TITLE };
  var h1 = document.querySelector('h1'); if (h1) h1.textContent = TITLE;
  document.title = document.querySelector('.site-bar')?.dataset.title || TITLE;
  render();
})();
