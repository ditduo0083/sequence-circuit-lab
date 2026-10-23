/* 승강기기능사(e과정) 동작 보기 앱 — 화면 연결 (요청 0023)
 * e과정 회로 앱끼리 이 파일은 글자 하나까지 같다(001~018 의 011~018 app.js 와 같은 방식).
 * 회로마다 다른 것은 circuit-model.js(동작), circuit-diagram.js(그림), lessons.js(설명), index.html(조작부 구성)에 있다.
 * index.html 약속
 *   - 버튼 id: power-button, start-button(PB1), stop-button(PB0), trip-button, reset-trip-button
 *   - [data-lesson] 수업 탭, [data-device] 기기 찾기, [data-view] 확대 범위
 *   - [data-motor="0"] 전동기 카드(안에 .motor-state), [data-lamp="RL"] 표시등(안에 .lamp-state 가 있으면 글도 바꿈)
 *   - [data-timer="T1"] 타이머 줄(안에 input, .timer-value, .timer-fill, .timer-track, .timer-state)
 *   - #interval-input (FR 이 있는 회로만) — 모델 입력 'interval'
 */
(() => {
  'use strict';
  const $ = id => document.getElementById(id), all = sel => [...document.querySelectorAll(sel)];
  const model = new CircuitModel(), diagram = new CircuitDiagram($('circuit'));
  let lesson = all('[data-lesson]')[0].dataset.lesson, step = 0, free = false, playing = false, playbackElapsed = 0, selected = '', view = 'all';
  let lessons, lastTime = performance.now(), renderBudget = 0;
  const hints = window.circuitHints || {};
  const MOMENTARY = [['start-button', 'start'], ['stop-button', 'stop']];
  function createLessons() { return window.createCircuitLessons(model); }
  function selectDevice(device) { selected = selected === device ? '' : device; diagram.select(selected); renderSelection(); }
  function renderSelection() {
    all('button[data-device]').forEach(el => { el.classList.toggle('selected', el.dataset.device === selected); el.setAttribute('aria-pressed', el.dataset.device === selected); });
    $('device-hint').textContent = hints[selected] || '기기를 선택하면 코일과 관련 접점을 함께 표시합니다.';
  }
  function drawDots() {
    $('step-dots').replaceChildren();
    lessons[lesson].forEach((item, i) => { const b = document.createElement('button'); b.textContent = String(i + 1).padStart(2, '0'); b.setAttribute('aria-label', `${i + 1}단계: ${item.heading}`); b.addEventListener('click', () => go(i)); $('step-dots').appendChild(b); });
  }
  function go(index, keepPlaying = false) {
    step = Math.max(0, Math.min(lessons[lesson].length - 1, index));
    const entry = lessons[lesson][step]; model.restore(entry.snapshot); selected = entry.focus; diagram.select(selected);
    if (!keepPlaying) playing = false; playbackElapsed = 0; render();
  }
  function selectLesson(id) { lesson = id; free = false; playing = false; lessons = createLessons(); drawDots(); go(0); }
  function releaseButtons() { for (const [, key] of MOMENTARY) if (model[key]) model.set(key, false); }
  function toggleFree(force) {
    free = force === undefined ? !free : force; playing = free; playbackElapsed = 0; releaseButtons();
    if (!free) { lessons = createLessons(); drawDots(); go(step); } else render();
  }
  function setPressed(el, on) { el.setAttribute('aria-pressed', !!on); el.classList.toggle('on', !!on); }
  function render() {
    const s = model.state(); diagram.update(s); renderSelection();
    document.body.classList.toggle('paused', !playing);
    all('[data-lesson]').forEach(b => { const on = b.dataset.lesson === lesson && !free; b.classList.toggle('selected', on); b.setAttribute('aria-pressed', on); });
    $('free-button').classList.toggle('selected', free); $('free-button').setAttribute('aria-pressed', free); $('free-button').textContent = free ? '단계별 설명으로 돌아가기' : '자유 조작으로 전환';
    $('mode-badge').textContent = free ? '자유 조작' : '단계별 설명'; $('control-help').textContent = free ? '버튼을 직접 조작해 회로 변화를 확인하세요.' : '아래 ‘다음 단계’로 진행하세요.';
    for (const id of ['power-button', 'start-button', 'stop-button', 'trip-button', 'reset-trip-button']) $(id).disabled = !free;
    if (free) { $('trip-button').disabled = !s.power || s.trip; $('reset-trip-button').disabled = !s.trip; }
    $('power-button').textContent = s.power ? 'ON' : 'OFF'; setPressed($('power-button'), s.power);
    for (const [id, key] of MOMENTARY) { $(id).classList.toggle('held', s[key]); $(id).setAttribute('aria-pressed', s[key]); }
    $('power-status').textContent = !s.power ? '전원 OFF' : s.trip ? 'EOCR 트립' : '전원 ON';
    all('.motor-card[data-motor]').forEach(card => {
      const m = s.motors[Number(card.dataset.motor)] || { run: false, text: '정지' };
      card.classList.toggle('running', m.run); card.classList.toggle('reverse', !!m.reverse); card.dataset.mode = m.text;
      card.querySelector('.motor-state').textContent = m.text;
    });
    all('.control-panel [data-lamp]').forEach(el => { const on = !!s.loads[el.dataset.lamp]; const led = el.matches('.indicator') ? el : el.querySelector('.indicator'); led.classList.toggle('on', on); led.setAttribute('aria-label', el.dataset.lamp + (on ? ' 점등' : ' 소등')); });
    all('.control-panel [data-timer]').forEach(row => {
      const t = s.timers.find(x => x.id === row.dataset.timer); if (!t) return;
      row.querySelector('.timer-value').textContent = `${t.elapsed.toFixed(1)} / ${t.delay.toFixed(1)}초`;
      row.querySelector('.timer-fill').style.width = Math.min(100, t.elapsed / t.delay * 100) + '%';
      const track = row.querySelector('.timer-track'); track.setAttribute('aria-valuenow', t.elapsed.toFixed(1)); track.setAttribute('aria-valuemax', t.delay);
      row.querySelector('.timer-state').textContent = window.circuitTimerText ? window.circuitTimerText(s, t) : (t.on ? (t.done ? '완료' : '계시 중') : '대기');
      const input = row.querySelector('input'); if (document.activeElement !== input) input.value = t.delay;
    });
    if ($('interval-input')) $('interval-input').value = s.interval;
    if ($('fr-state') && s.flicker) $('fr-state').textContent = s.flicker.on ? `FR 동작 · ${s.flicker.out ? 'a접점 닫힘' : 'b접점 닫힘'}` : 'FR 정지';
    let heading, title, description;
    if (free) { [heading, title, description] = window.explainCircuitState(s); $('step-count').textContent = '직접 조작'; }
    else { const entry = lessons[lesson][step]; ({ heading, title, description } = entry); $('step-count').textContent = `${String(step + 1).padStart(2, '0')} / ${String(lessons[lesson].length).padStart(2, '0')}`; }
    $('scene-heading').textContent = heading; $('step-title').textContent = title;
    if ($('step-description').textContent !== description) $('step-description').textContent = description;
    $('previous-button').disabled = free || step === 0; $('next-button').disabled = free || step === lessons[lesson].length - 1;
    $('play-button').textContent = free ? (playing ? '시간 일시정지' : '시간 재개') : (playing ? '일시정지' : '자동 재생');
    $('step-dots').hidden = free;
    [...$('step-dots').children].forEach((b, i) => { b.classList.toggle('selected', i === step); b.setAttribute('aria-current', i === step ? 'step' : 'false'); });
    $('lesson-note').textContent = free ? '실제 초 단위로 계시합니다. 시간을 멈추면 타이머도 멈춥니다.' : '단계별 설명은 예시 시점으로 이동합니다. 실제 초 단위 계시는 자유 조작에서 확인하세요.';
  }
  function input(key, value) { if (!free) return; model.set(key, value); render(); }
  function momentary(id, key) {
    const button = $(id); let keyboard = false;
    const release = () => { keyboard = false; if (free && model[key]) { model.set(key, false); render(); } };
    button.addEventListener('pointerdown', event => { if (!free || event.button !== 0) return; button.setPointerCapture(event.pointerId); input(key, true); });
    button.addEventListener('pointerup', release); button.addEventListener('pointercancel', release); button.addEventListener('lostpointercapture', release);
    button.addEventListener('keydown', event => { if (event.code === 'Space' || event.code === 'Enter') { event.preventDefault(); if (!event.repeat && free) { keyboard = true; input(key, true); } } });
    button.addEventListener('keyup', event => { if ((event.code === 'Space' || event.code === 'Enter') && keyboard) { event.preventDefault(); release(); } });
    button.addEventListener('blur', () => { if (keyboard) release(); }); window.addEventListener('blur', release);
    button.addEventListener('contextmenu', event => event.preventDefault());
    button.addEventListener('click', event => { if (event.detail === 0 && !keyboard && free && !model[key]) { input(key, true); input(key, false); } });
  }
  function settingChanged(key, value, el) {
    model.set(key, value); if (el) el.value = model[key];
    if (!free) { lessons = createLessons(); go(step); } else render();
  }
  all('[data-lesson]').forEach(b => b.addEventListener('click', () => selectLesson(b.dataset.lesson)));
  all('button[data-device]').forEach(b => b.addEventListener('click', () => selectDevice(b.dataset.device)));
  all('button[data-view]').forEach(b => b.addEventListener('click', () => { view = b.dataset.view; diagram.view(view); all('button[data-view]').forEach(v => { v.classList.toggle('selected', v === b); v.setAttribute('aria-pressed', v === b); }); }));
  $('free-button').addEventListener('click', () => toggleFree());
  $('power-button').addEventListener('click', () => input('power', !model.power));
  $('trip-button').addEventListener('click', () => input('trip', true)); $('reset-trip-button').addEventListener('click', () => input('trip', false));
  for (const [id, key] of MOMENTARY) momentary(id, key);
  all('.control-panel [data-timer]').forEach(row => { const t = model.state().timers.find(x => x.id === row.dataset.timer), el = row.querySelector('input'); el.addEventListener('change', () => settingChanged(t.key, el.value, el)); });
  if ($('interval-input')) $('interval-input').addEventListener('change', event => settingChanged('interval', event.target.value));
  $('previous-button').addEventListener('click', () => go(step - 1)); $('next-button').addEventListener('click', () => go(step + 1));
  $('play-button').addEventListener('click', () => { if (!free && !playing && step === lessons[lesson].length - 1) go(0); playing = !playing; playbackElapsed = 0; lastTime = performance.now(); render(); });
  $('restart-button').addEventListener('click', () => {
    if (free) { const keep = {}; for (const k of CircuitModel.SETTINGS) keep[k] = model[k]; model.reset(); for (const k of CircuitModel.SETTINGS) model.set(k, keep[k]); playing = true; selected = ''; diagram.select(''); render(); }
    else go(0);
  });
  $('reference-button').addEventListener('click', () => { playing = false; render(); $('reference-dialog').showModal(); }); $('close-reference').addEventListener('click', () => $('reference-dialog').close());
  $('fullscreen-button').addEventListener('click', async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { $('fullscreen-button').textContent = 'F11로 전체 화면'; } });
  document.addEventListener('fullscreenchange', () => { $('fullscreen-button').textContent = document.fullscreenElement ? '전체 화면 종료' : '전체 화면'; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { playing = false; if (free) releaseButtons(); render(); } lastTime = performance.now(); });
  function frame(now) {
    const dt = Math.min(.2, Math.max(0, (now - lastTime) / 1000)); lastTime = now; renderBudget += dt;
    if (playing) {
      if (free) { const prior = JSON.stringify(model.state().loads); model.tick(dt); if (renderBudget > .08 || prior !== JSON.stringify(model.state().loads)) { render(); renderBudget = 0; } }
      else { playbackElapsed += dt; if (playbackElapsed >= 4) { if (step < lessons[lesson].length - 1) go(step + 1, true); else { playing = false; render(); } } }
    }
    requestAnimationFrame(frame);
  }
  lessons = createLessons(); drawDots(); go(0); requestAnimationFrame(frame);
  window.simulator = { model, diagram, selectLesson, goStep: go, toggleFree, getState: () => model.state(), getUI: () => ({ lesson, step, free, playing, view, steps: lessons[lesson].length, lessons: Object.keys(lessons) }), render };
})();
