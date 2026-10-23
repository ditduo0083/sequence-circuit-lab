/*
 * 단자대 번호매기기 — 공용 엔진 (2026-09-26 요청 0028 프로토타입, 2026-09-27 요청 0030 퀴즈, 전기기능사 전용)
 * ------------------------------------------------------------------
 * 단자대 칸 번호에는 하나로 정해진 답이 없다(작성자: "배선이 꼬일 뿐 실격·채점 제외는 아니다").
 * 그래서 화면은 세 부분이다.
 *   ① 권장 배치 보기 : 배관도 순서대로 TB5·TB6 칸을 채우는 방법을 한 그룹(ⓐ~ⓗ)씩. 칸 번호는 "권장 배치(예시)".
 *   ② 퀴즈 · 그룹 순서 : 배관도를 보고 위쪽(TB5)·아래쪽(TB6) 단자대에 들어갈 그룹을 왼쪽부터 줄 세운다.
 *                        정답 = WIRE_MODEL.pipeOrder(W).expected (관이 제어함을 나가는 자리 순서, 검사기와 같은 계산)
 *   ③ 퀴즈 · 한 칸에 묶어도 될까 : 같은 상자에서 오는 두 단자를 단자대 한 칸(공통)에 묶어도 되는지.
 *                        정답 = 두 점이 같은 구간(net)인지 (WIRE_MODEL.tbQuizPairs, 검사기의 공통 묶음 판정과 같은 기준)
 *   정확한 칸 번호(몇 번 칸)는 채점하지 않는다.
 * 회로별 내용은 회로/wire-NNN.js 의 terminalBlocks·piping·nets 에만 있다. 새 데이터 필드는 쓰지 않는다.
 * 불러오는 순서: steps.js, device-library.js, pin-validate.js, circuit-NNN.js, diagram-render.js,
 *               panel-library.js, wire-validate.js, panel-render.js, wire-NNN.js, tb-engine.js
 */
(function () {
  'use strict';
  var Lib = window.PIN_DEVICE_LIBRARY, PV = window.PIN_VALIDATE, PL = window.PANEL_LIBRARY, WM = window.WIRE_MODEL, PR = window.PANEL_RENDER;
  var which = document.body.dataset.circuit;
  var C = (window.PIN_CIRCUITS || {})[which], W = (window.PIN_WIRING || {})[which];
  var libs = { Lib: Lib, PV: PV, PL: PL };
  var $ = function (s) { return document.querySelector(s); };
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* 요청 0030 이전에 복사한 페이지(탭·interpret-page.css 없음)도 그대로 돌도록, 없는 요소는 여기서 만든다 */
  (function ensureUi() {
    var bar = $('.wire-bar');
    if (bar && !bar.id) bar.id = 'tExplainBar';
    if (!$('#tTabs') && bar) {
      var t = document.createElement('div'); t.className = 'ip-tabs'; t.id = 'tTabs'; t.setAttribute('role', 'tablist'); t.setAttribute('aria-label', '단자대 번호매기기');
      t.innerHTML = '<button type="button" role="tab" data-tab="explain" aria-selected="true">① 권장 배치 보기</button><button type="button" role="tab" data-tab="order" aria-selected="false">② 퀴즈 · 관 순서대로 줄 세우기</button><button type="button" role="tab" data-tab="common" aria-selected="false">③ 퀴즈 · 한 칸에 묶어도 될까?</button>';
      bar.parentNode.insertBefore(t, bar);
    }
    var links = [].slice.call(document.querySelectorAll('link[rel="stylesheet"]'));
    var wl = links.filter(function (l) { return /wire-page\.css/.test(l.getAttribute('href')); })[0];
    if (wl && !links.some(function (l) { return /interpret-page\.css/.test(l.getAttribute('href')); })) {
      var il = document.createElement('link'); il.rel = 'stylesheet'; il.href = wl.getAttribute('href').replace('wire-page.css', 'interpret-page.css');
      wl.parentNode.insertBefore(il, wl);
    }
    // 요청 0058: 배관도 카드 위 '크게 보기' 단추(화면에 맞춘 배관도 ↔ 폭에 맞춰 크게, 가로·세로 스크롤)
    var board = $('#tBoard');
    if (board && !$('#tZoom')) {
      var zb = document.createElement('div'); zb.className = 'tb-zoombar';
      zb.innerHTML = '<button type="button" id="tZoom" aria-pressed="false">🔍 크게 보기</button><span class="note" id="tZoomNote"></span>';
      board.parentNode.insertBefore(zb, board);
    }
  })();

  var report = WM.validate(W, C, libs), box = $('#wireCheck');
  if (report.errors.length || !W.terminalBlocks) {
    box.hidden = false;
    box.innerHTML = '<h3>결선 데이터 오류 — 고친 뒤 다시 여세요</h3><ul>' + (report.errors.length ? report.errors : ['terminalBlocks(단자대 데이터)가 없습니다.']).map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>';
    return;
  }
  var TB = W.terminalBlocks, groups = TB.groups, idx = WM.deviceIndex(W), cid = W.circuit || W.id;
  var pipeById = {}; (W.piping.pipes || []).forEach(function (p) { pipeById[p.id] = p; });
  var boxById = {}; (W.piping.boxes || []).forEach(function (b) { boxById[b.id] = b; });
  var gById = {}; groups.forEach(function (g) { gById[g.id] = g; });
  var netById = {}; W.nets.forEach(function (n) { netById[n.id] = n; });
  // 단자대 칸 → 제어판 안쪽에서 이어지는 점(결선 데이터에서 찾음)
  var inner = {};
  W.nets.forEach(function (n) {
    WM.expandNet(W, n, idx).forEach(function (e) {
      if (e.aSide === 'int') (inner[e.a] = inner[e.a] || []).push(e.b);
      if (e.bSide === 'int') (inner[e.b] = inner[e.b] || []).push(e.a);
    });
  });
  function name(p) { return WM.describe(W, C, p, libs, idx); }

  var STEPS = [{ kind: 'intro' }].concat(groups.map(function (g) { return { kind: 'group', g: g }; }), [{ kind: 'end' }]);
  var state = { tab: 'explain', step: 0, common: !!TB.useCommon };

  function pipeText(g) {
    var kinds = W.piping.pipeKinds || {};
    return (g.pipes || []).map(function (id) { var k = kinds[(pipeById[id] || {}).kind] || {}; return k.no + ' ' + k.label; }).join(' → 8각 박스(J) → ');
  }
  function sideText(g) {
    var s = TB.strips[g.strip], order = groups.filter(function (x) { return x.strip === g.strip; }).indexOf(g) + 1;
    return '제어함 ' + (s.place === 'top' ? '위쪽' : '아래쪽') + '으로 나가는 관, 왼쪽에서 ' + order + '번째';
  }
  function cellsOf(g) { return PR.groupCells(W, g, state.common); }
  function rowHtml(g) {
    return cellsOf(g).map(function (c) {
      var pts = Array.isArray(c.entry) ? c.entry : [c.entry];
      var key = cid + '/' + g.strip + ':' + c.pos;
      var ins = state.common ? '' : (inner[key] || []).map(name).join(', ');
      return '<tr><td><b>' + g.strip + ' ' + c.pos + '</b></td><td>' + esc(PR.cellLabel(c.entry).join(' ')) + (Array.isArray(c.entry) && PR.cellLabel(c.entry)[1] !== '공통' ? ' <b class="tb-common">공통</b>' : '') + '</td><td>' + pts.map(function (p) { return esc(name(p)); }).join(' + ') + '</td>' + (state.common ? '' : '<td>' + esc(ins) + '</td>') + '</tr>';
    }).join('');
  }
  function table(gs) {
    return '<table class="tb-table"><thead><tr><th>칸(예시)</th><th>칸 이름</th><th>바깥(관으로 나가는) 단자</th>' + (state.common ? '' : '<th>제어판 안쪽에서 잇는 곳</th>') + '</tr></thead><tbody>' + gs.map(rowHtml).join('') + '</tbody></table>';
  }
  var FREE_NOTE = '<p class="tb-free">칸 번호는 <b>권장 배치(예시)</b>예요. 단자대 칸 번호에는 하나로 정해진 답이 없어서, 다르게 배치해도 결선이 맞으면 <b>틀린 것이 아니고 실격·감점 대상도 아니에요</b>. 다만 배관도 순서를 따르면 관에서 들어온 선과 제어판 안쪽 선이 서로 엇갈리지(꼬이지) 않아 결선이 깔끔하고, 나중에 선을 찾기 쉬워요.</p>';

  /* ------------------------------------------------------------ ① 권장 배치 보기 */
  function renderExplain() {
    var step = STEPS[state.step], html = [], o = { strips: true, common: state.common, hlGroups: null, hlPipes: {}, hlBoxes: {}, hlPoints: {}, cellHl: {} };
    if (step.kind === 'intro') {
      html.push('<h2>단자대 번호매기기 — 배관도 순서대로 (권장 배치 예시)</h2>');
      html.push('<p>제어판 밖에 있는 기구(버튼·램프·전원·전동기·플로트레스 단자대)로 가는 선은 모두 제어함의 <b>위쪽 단자대 TB5</b> 또는 <b>아래쪽 단자대 TB6</b>를 거쳐 나가요. 칸 이름은 <b>배관도에서 관이 나가는 순서</b>대로 붙이는 것을 권해요.</p>');
      html.push(FREE_NOTE);
      html.push('<ul class="wi-rules"><li>위쪽으로 나가는 관을 왼쪽부터 ⓐⓑⓒⓓ → TB5, 아래쪽으로 나가는 관을 왼쪽부터 ⓔⓕⓖⓗ → TB6.</li>' +
        '<li>TB5·TB6은 각각 <b>10P 두 개</b>(1~10번 ‖ 11~20번)예요. 한 관으로 나가는 그룹(8각 박스 J에서 나눠 쓰는 관이면 그 그룹들 전부)은 <b>빈칸 없이 붙여서 한 덩어리</b>로 다뤄요.</li>' +
        '<li>관 순서대로 덩어리를 10P에 나눠 담아요. 덩어리는 <b>10번과 11번 사이 경계를 넘지 않게</b> 하고, 안 들어가면 통째로 11번부터예요.</li>' +
        '<li>10P 안에서는 관이 나가는 자리처럼 <b>양끝으로 벌려요</b>. 덩어리가 둘이면 하나는 왼쪽 끝, 하나는 오른쪽 끝. 덩어리가 하나면 앞 10P는 1번부터, 뒤 10P는 20번 끝에 붙여요. 칸이 모자라면 되는 데까지만 이 방법을 따라요.</li>' +
        '<li><b>그룹 안 기구 순서는 바꿔도 돼요</b>(PB0·PB1 / PB1·PB0, RL·GL / GL·RL 모두 정답). 다만 한 기구의 단자는 붙여서 순서대로(RL 1, RL 2) 적어요.</li>' +
        '<li>칸 이름은 바깥 기구의 단자 이름(램프 1·2, 버튼 N·C·O, 전원 L1·L2·L3·PE …)을 그대로 써요.</li>' +
        '<li>기본은 <b>공통단자를 쓰지 않아요</b>(셀렉터 스위치만 N 두 개를 묶은 SS 한 칸). 같은 점끼리 한 칸으로 줄이는 방법은 <b>심화</b> 단추로 볼 수 있어요.</li>' +
        '<li>다 봤으면 위의 <b>퀴즈</b> 탭에서 확인해 보세요. 퀴즈는 칸 번호를 묻지 않고, 답이 분명한 것(관 순서대로 줄 세우기, 한 칸에 묶어도 되는지)만 물어요.</li></ul>');
    } else if (step.kind === 'end') {
      html.push('<h2>완성 — 권장 배치(예시) · ' + (state.common ? '공통단자를 쓴 배치(심화)' : '공통단자를 쓰지 않는 배치') + '</h2>');
      html.push(table(groups));
      html.push(FREE_NOTE);
      html.push('<p class="muted">결선하기 단계는 이 예시(공통단자를 쓰지 않는 배치)로 설명합니다.</p>');
    } else {
      var g = step.g, cells = cellsOf(g), first = cells[0].pos, last = cells[cells.length - 1].pos;
      o.hlGroups = {}; o.hlGroups[g.id] = 1;
      (g.pipes || []).forEach(function (p) { o.hlPipes[p] = 1; });
      o.hlBoxes[g.box] = 1;
      [].concat.apply([], g.basic).forEach(function (p) { o.hlPoints[p] = 1; });
      cells.forEach(function (c) { o.cellHl[g.strip + ':' + c.pos] = 1; });
      o.hlStrip = g.strip;
      html.push('<div class="wi-head"><span class="wi-tag wi-aux">' + g.mark + '</span><span class="muted">' + esc(sideText(g)) + '</span></div>');
      html.push('<h2>' + g.mark + ' ' + esc(g.name) + ' → ' + g.strip + ' (예시: ' + first + (last > first ? '~' + last : '') + '번 칸)</h2>');
      html.push('<p>관: ' + esc(pipeText(g)) + ' · 상자: ' + esc((boxById[g.box] || {}).label || g.box) + '</p>');
      html.push(table([g]));
      if (g.note) html.push('<p class="wi-note">' + esc(g.note) + '</p>');
      if (state.common && g.commonNote) html.push('<p class="wi-note">심화: ' + esc(g.commonNote) + '</p>');
      else if (state.common && !g.common) html.push('<p class="wi-note">심화: 이 그룹은 더 줄일 단자가 없어요.</p>');
    }
    if (state.common) html.push('<p class="note">심화도 기본 배치의 관별 10P 블록을 유지하고, 줄어든 칸을 블록 양끝으로 벌려 가운데를 비웁니다.</p>');
    $('#tInfo').innerHTML = html.join('');
    $('#tBoard').innerHTML = PR.drawPiping(W, o);
    $('#tSelect').value = String(state.step);
    $('#tPrev').disabled = state.step === 0;
    $('#tNext').disabled = state.step === STEPS.length - 1;
    $('#tDeep').setAttribute('aria-pressed', String(state.common));
    $('#tDeep').textContent = state.common ? '기본: 공통단자 안 쓰기로 보기' : '심화: 공통단자 함께 쓰기';
  }

  /* ------------------------------------------------------------ ② 퀴즈 · 그룹 순서 */
  var PO = WM.pipeOrder(W), STRIPS = Object.keys(TB.strips).filter(function (s) { return (PO.expected[s] || []).length; });
  var PLACE = { top: '위쪽', bottom: '아래쪽' };
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var qo = null;
  function startOrder() { qo = { round: 0, picks: [], checked: false, results: {}, pool: shuffle(groups.map(function (g) { return g.id; })), attempt: qo ? qo.attempt + 1 : 1 }; }
  function exitText(g) {
    var p = pipeById[(g.pipes || [])[0]], k = (W.piping.pipeKinds || {})[(p || {}).kind] || {}, b = boxById[g.box] || {};
    var shared = groups.filter(function (x) { return x !== g && (x.pipes || [])[0] === (g.pipes || [])[0]; }).length;
    return k.no + ' ' + k.label + (shared ? ', 8각 박스 J에서 나뉨' : '') + ' → ' + (b.label || g.box);
  }
  function gButton(g, extra) {
    var b = boxById[g.box] || {};
    return '<button type="button" class="tq-group' + (extra || '') + '" data-g="' + g.id + '"><b>' + esc(g.name) + '</b>' + (b.label && g.name.indexOf(b.label) < 0 ? '<small>' + esc(b.label) + '</small>' : '') + '</button>';
  }
  function renderOrder() {
    var sid = STRIPS[qo.round], s = TB.strips[sid], want = PO.expected[sid], html = [], o = { strips: false, hlPipes: {}, hlBoxes: {}, hlPoints: {}, cellHl: {} };
    html.push('<h2>퀴즈 · 관 순서대로 줄 세우기 <span class="ip-qno">' + (qo.round + 1) + ' / ' + STRIPS.length + '</span></h2>');
    html.push('<p class="ip-prompt">배관도를 보고, 제어함 <b>' + PLACE[s.place] + ' 단자대 ' + sid + '</b>로 들어갈 그룹을 <b>왼쪽 칸부터</b> 차례로 누르세요.</p>');
    html.push('<p class="note">관이 제어함을 나가는 자리를 왼쪽부터 보면 돼요. 몇 번 칸인지는 묻지 않아요(칸 번호는 하나로 정해진 답이 없어요). ' + PLACE[s.place] + '으로 나가지 않는 그룹을 고르면 틀려요.</p>');
    html.push('<div class="tq-slots" aria-label="고른 순서">' + want.map(function (_, i) {
      var gid = qo.picks[i], g = gById[gid], cls = '';
      if (qo.checked) cls = gid === want[i] ? ' is-ok' : ' is-bad';
      return '<div class="tq-slot' + cls + '"><span class="tq-pos">' + (i === 0 ? '왼쪽 ' : '') + (i + 1) + '</span>' + (g ? gButton(g, ' picked') : '<span class="note">빈자리</span>') + '</div>';
    }).join('<span class="tq-arrow">→</span>') + '</div>');
    if (!qo.checked) {
      html.push('<div class="tq-pool" aria-label="그룹">' + qo.pool.map(function (id) { return qo.picks.indexOf(id) >= 0 ? '' : gButton(gById[id]); }).join('') + '</div>');
      html.push('<p class="note">고른 것을 다시 누르면 빠져요.</p>');
      html.push('<div class="ip-row"><button type="button" class="primary" id="qoJudge"' + (qo.picks.length === want.length ? '' : ' disabled') + '>확인</button><button type="button" id="qoClear"' + (qo.picks.length ? '' : ' disabled') + '>선택 지우기</button></div>');
    } else {
      var ok = qo.results[sid];
      var wrongSide = qo.picks.filter(function (id) { return want.indexOf(id) < 0; });
      html.push('<div class="hint ip-verdict ' + (ok ? 'is-ok' : 'is-bad') + '"><b>' + (ok ? '맞아요.' : '다시 생각해 봐요.') + '</b> ' +
        PLACE[s.place] + '으로 나가는 관을 왼쪽부터: ' + want.map(function (id) { return '<b>' + esc(gById[id].name) + '</b> <span class="muted">(' + esc(exitText(gById[id])) + ')</span>'; }).join(' → ') +
        (wrongSide.length ? '<br>' + wrongSide.map(function (id) { var g = gById[id]; return esc(g.name) + '로 가는 관은 제어함 ' + PLACE[TB.strips[g.strip].place] + '으로 나가요(' + g.strip + ').'; }).join(' ') : '') +
        (groups.some(function (g) { return g.strip === sid && groups.some(function (x) { return x !== g && x.strip === sid && (x.pipes || [])[0] === (g.pipes || [])[0]; }); }) ? '<br><span class="ip-explain">한 관을 8각 박스(J)에서 나눠 쓰면, 도착 상자가 왼쪽인 그룹을 먼저 둬요.</span>' : '') + '</div>');
      html.push('<p class="note">배관도 위·아래에 그린 단자대 띠는 이 순서로 채운 <b>권장 배치(예시)</b>예요. 칸 번호는 달라도 돼요.</p>');
      html.push('<div class="ip-row">' + (qo.round < STRIPS.length - 1 ? '<button type="button" class="primary" id="qoNext">다음: ' + STRIPS[qo.round + 1] + ' ▶</button>' : '') + '<button type="button" id="qoAgain">이 단자대 다시 풀기</button></div>');
      o.strips = true; o.hlGroups = {}; want.forEach(function (id) { o.hlGroups[id] = 1; }); o.hlStrip = sid;
    }
    var done = STRIPS.filter(function (x) { return x in qo.results; }), okN = done.filter(function (x) { return qo.results[x]; }).length;
    html.push('<p><b>맞힌 단자대 ' + okN + ' / ' + STRIPS.length + '</b> <span class="note">(푼 것 ' + done.length + (qo.attempt > 1 ? ' · ' + qo.attempt + '번째 풀이' : '') + ')</span></p>');
    html.push('<button type="button" id="qoRetry" class="quiet">처음부터 다시 풀기</button>');
    qo.picks.forEach(function (id) { var g = gById[id]; (g.pipes || []).forEach(function (p) { o.hlPipes[p] = 1; }); o.hlBoxes[g.box] = 1; });
    $('#tInfo').innerHTML = html.join('');
    $('#tBoard').innerHTML = PR.drawPiping(W, o);
  }
  function orderClick(e) {
    var t = e.target.closest && e.target.closest('button'); if (!t) return;
    var sid = STRIPS[qo.round], want = PO.expected[sid];
    if (t.dataset.g && !qo.checked) {
      var k = qo.picks.indexOf(t.dataset.g);
      if (k >= 0) qo.picks.splice(k, 1); else if (qo.picks.length < want.length) qo.picks.push(t.dataset.g);
    } else if (t.id === 'qoJudge') { qo.checked = true; qo.results[sid] = qo.picks.join() === want.join(); }
    else if (t.id === 'qoClear') qo.picks = [];
    else if (t.id === 'qoNext') { qo.round++; qo.picks = []; qo.checked = false; qo.pool = shuffle(qo.pool); }
    else if (t.id === 'qoAgain') { qo.picks = []; qo.checked = false; delete qo.results[sid]; qo.pool = shuffle(qo.pool); }
    else if (t.id === 'qoRetry') startOrder();
    else return;
    renderOrder();
  }

  /* ------------------------------------------------------------ ③ 퀴즈 · 한 칸에 묶어도 될까 */
  var PAIRS = WM.tbQuizPairs(W), qc = null, QC_MAX = 10;
  function startCommon() {
    var yes = PAIRS.yes.slice(0, Math.ceil(QC_MAX / 2)), no = PAIRS.no.slice(0, QC_MAX - yes.length);
    qc = { q: 0, list: shuffle(yes.concat(no)), ans: {}, attempt: qc ? qc.attempt + 1 : 1 };
  }
  function netText(id) { var n = netById[id]; return '‘' + esc(n.label) + '’' + (n.circuit ? ' <span class="muted">(회로도 ' + esc(n.circuit) + ')</span>' : ''); }
  function renderCommon() {
    var html = [], o = { strips: false, hlPipes: {}, hlBoxes: {}, hlPoints: {}, cellHl: {} };
    if (!qc.list.length) { $('#tInfo').innerHTML = '<h2>퀴즈 · 한 칸에 묶어도 될까?</h2><p class="empty-panel">이 회로는 문제를 만들 단자 쌍이 없어요.</p>'; $('#tBoard').innerHTML = PR.drawPiping(W, o); return; }
    var q = qc.list[qc.q], g = gById[q.group], a = qc.ans[qc.q];
    html.push('<h2>퀴즈 · 한 칸에 묶어도 될까? <span class="ip-qno">' + (qc.q + 1) + ' / ' + qc.list.length + '</span></h2>');
    html.push('<p class="ip-prompt">같은 상자(' + esc((boxById[g.box] || {}).label || g.box) + ')에서 오는 두 단자를 제어함 단자대 <b>한 칸</b>에 함께 물려도(공통) 될까요?</p>');
    html.push('<div class="wi-chips"><span class="wi-chip out">' + esc(name(q.a)) + '</span><span class="wi-eq">+</span><span class="wi-chip out">' + esc(name(q.b)) + '</span></div>');
    html.push('<p class="note">힌트: 회로도에서 두 점이 같은 선(같은 구간)인지 생각해 보세요. 배관도에서 두 단자를 파랗게 표시했어요.</p>');
    if (a == null) {
      html.push('<div class="ip-row"><button type="button" class="primary" data-yes="1">묶어도 된다</button><button type="button" data-yes="0">묶으면 안 된다</button></div>');
    } else {
      var ok = a === q.same;
      html.push('<div class="hint ip-verdict ' + (ok ? 'is-ok' : 'is-bad') + '"><b>' + (ok ? '맞아요.' : '다시 생각해 봐요.') + '</b> ' +
        (q.same ? '두 단자는 모두 구간 ' + netText(q.netA) + '에 있어요. 회로도에서 같은 선이라 한 칸에 묶어도 전기적으로 같아요. 칸이 모자랄 때 쓰는 방법이고, 묶지 않고 두 칸을 써도 틀린 게 아니에요.'
          : esc(name(q.a)) + '은(는) 구간 ' + netText(q.netA) + ', ' + esc(name(q.b)) + '은(는) 구간 ' + netText(q.netB) + '이에요. 서로 다른 구간이라 한 칸에 묶으면 두 선이 합쳐져 <b>오결선(합선)</b>이 돼요.' +
            (q.samePin ? ' 단자 이름이 같아도 회로에서는 다른 점이에요.' : '')) + '</div>');
    }
    html.push('<div class="ip-row"><button type="button" id="qcPrev"' + (qc.q ? '' : ' disabled') + '>◀ 이전</button><button type="button" id="qcNext"' + (qc.q < qc.list.length - 1 ? '' : ' disabled') + '>다음 ▶</button></div>');
    html.push('<div class="ip-qdots" aria-label="문제 목록">' + qc.list.map(function (qq, i) {
      var v = qc.ans[i], cls = v == null ? '' : v === qq.same ? 'is-ok' : 'is-bad';
      return '<button type="button" data-q="' + i + '" class="' + cls + '"' + (i === qc.q ? ' aria-current="true"' : '') + '>' + (i + 1) + '</button>';
    }).join('') + '</div>');
    var done = Object.keys(qc.ans).length, okN = Object.keys(qc.ans).filter(function (i) { return qc.ans[i] === qc.list[i].same; }).length;
    html.push('<p><b>맞힌 문제 ' + okN + ' / ' + qc.list.length + '</b> <span class="note">(푼 문제 ' + done + (qc.attempt > 1 ? ' · ' + qc.attempt + '번째 풀이' : '') + ')</span></p>');
    html.push('<button type="button" id="qcRetry" class="quiet">처음부터 다시 풀기</button>');
    o.hlPoints[q.a] = 1; o.hlPoints[q.b] = 1; o.hlBoxes[g.box] = 1; (g.pipes || []).forEach(function (p) { o.hlPipes[p] = 1; });
    $('#tInfo').innerHTML = html.join('');
    $('#tBoard').innerHTML = PR.drawPiping(W, o);
  }
  function commonClick(e) {
    var t = e.target.closest && e.target.closest('button'); if (!t) return;
    if (t.dataset.yes != null) { if (qc.ans[qc.q] == null) qc.ans[qc.q] = t.dataset.yes === '1'; }
    else if (t.dataset.q != null) qc.q = +t.dataset.q;
    else if (t.id === 'qcPrev') qc.q = Math.max(0, qc.q - 1);
    else if (t.id === 'qcNext') qc.q = Math.min(qc.list.length - 1, qc.q + 1);
    else if (t.id === 'qcRetry') startCommon();
    else return;
    renderCommon();
  }

  /* ------------------------------------------------------------ 탭 · 이동 */
  var tabs = [].slice.call(document.querySelectorAll('#tTabs [data-tab]'));
  var lastView = '';
  function render() {
    tabs.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === state.tab)); });
    var view = state.tab + ':' + state.step;   // 탭·단계가 바뀌면 설명 칸(자체 스크롤)을 맨 위로
    if (view !== lastView) { $('#tInfo').scrollTop = 0; lastView = view; }
    $('#tExplainBar').hidden = state.tab !== 'explain';
    if (state.tab === 'explain') renderExplain();
    else if (state.tab === 'order') renderOrder();
    else renderCommon();
  }
  tabs.forEach(function (b) { b.addEventListener('click', function () { state.tab = b.dataset.tab; render(); }); });
  $('#tInfo').addEventListener('click', function (e) { if (state.tab === 'order') orderClick(e); else if (state.tab === 'common') commonClick(e); });
  $('#tSelect').innerHTML = STEPS.map(function (s, k) {
    return '<option value="' + k + '">' + (s.kind === 'intro' ? '처음 — 이렇게 붙여요' : s.kind === 'end' ? '완성 — 권장 배치(예시) 전체' : s.g.mark + ' ' + esc(s.g.name) + ' (' + s.g.strip + ')') + '</option>';
  }).join('');
  function go(k) { state.step = Math.max(0, Math.min(STEPS.length - 1, k)); render(); }
  $('#tPrev').addEventListener('click', function () { go(state.step - 1); });
  $('#tNext').addEventListener('click', function () { go(state.step + 1); });
  $('#tSelect').addEventListener('change', function (e) { go(+e.target.value); });
  $('#tDeep').addEventListener('click', function () { state.common = !state.common; render(); });
  document.addEventListener('keydown', function (e) {
    if (state.tab !== 'explain' || (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName))) return;
    if (e.key === 'ArrowRight') go(state.step + 1);
    if (e.key === 'ArrowLeft') go(state.step - 1);
  });
  var zoom = $('#tZoom');
  function setZoom(on) {
    document.body.classList.toggle('tb-zoomed', on);
    zoom.setAttribute('aria-pressed', String(on));
    zoom.textContent = on ? '↙ 한 화면에 맞추기' : '🔍 크게 보기';
    $('#tZoomNote').textContent = on ? (window.matchMedia('(max-width: 899px)').matches ? '배관도를 손가락으로 좌우로 밀어 보세요.' : '배관도 안에서 위아래로 굴려 보세요.') : '';
    if (!on) { $('#tBoard').scrollTop = 0; $('#tBoard').scrollLeft = 0; $('.tb-main .card').scrollLeft = 0; }
  }
  zoom.addEventListener('click', function () { setZoom(!document.body.classList.contains('tb-zoomed')); });
  var fs = $('#fullscreen-button');
  if (fs) fs.addEventListener('click', function () { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); });
  startOrder(); startCommon();
  var tm = /(?:^|[?&])tab=(order|common)(?:&|$)/.exec(location.search); if (tm) state.tab = tm[1];   // ?tab=order 로 퀴즈부터 열기
  render();
  // 검사용(브라우저 시험에서 상태 확인)
  window.tbPage = { state: state, zoom: setZoom, order: function () { return qo; }, common: function () { return qc; }, expected: PO.expected, pairs: PAIRS };
})();
