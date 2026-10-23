#!/usr/bin/env python3
"""요청 0025 — 승강기 동작 보기 앱(eNN/sim/)의 공통 파일을 만든다.
회로마다 손으로 쓰는 것: circuit-model.js, lessons.js, 검증/model.test.cjs, 검증/scenario.json
이 스크립트가 만드는 것: circuit-diagram.js(공통부 + 회로 설정 3줄), index.html(아래 표), app.js·styles.css·검증 도구 복사
사용: python3 gen.py <v2_엔진분리 폴더>
"""
import sys, json, html
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent.parent))
from site_brand import brand_page

V2 = Path(sys.argv[1])
TPL = Path(__file__).parent
COMMON = (TPL / 'diagram-common.js').read_text(encoding='utf-8')
BASE = V2 / 'e01' / 'sim'          # app.js·styles.css·검증 도구의 원본(e01)
CAT = '../../../../00_전기기능사_시퀀스_시각화_001-018/'

R, G, Y = ('RL', 'red'), ('GL', 'green'), ('YL', 'yellow')
C = {
 'e01': dict(main='reversing', short='정역 전환', eyebrow='전동기 정역 운전 · T1 한시 전환',
   caption='승강기 01 · T1 한시 접점으로 정회전 → 역회전 전환 · MC1·MC2 b접점 인터록 · T2 한시 b로 YL 소등',
   tabs=[('forward', '정회전 기동'), ('reverse', '역회전 전환'), ('alarm', '과부하 경보')],
   devices=['T1', 'T2', 'MC1', 'MC2', 'EOCR', 'PB1', 'PB0'],
   lamps=[(R, '정회전'), (G, '역회전'), (Y, '경보')], motors=['M'],
   timers=[('T1', 'T1 정→역 전환', 5), ('T2', 'T2 경보등 시간', 4)]),
 'e02': dict(main='reversing', short='정지 후 역회전', eyebrow='전동기 정역 운전 · T1 정회전 · T2 정지 뒤 역회전',
   caption='승강기 02 · T1 한시 b로 정회전 정지 → T2 한시 a로 역회전 · MC1·MC2 b접점 인터록',
   tabs=[('forward', '정회전 기동'), ('reverse', '정지 뒤 역회전'), ('alarm', '과부하 경보')],
   devices=['T1', 'T2', 'MC1', 'MC2', 'EOCR', 'PB1', 'PB0'],
   lamps=[(R, '정회전'), (G, '역회전'), (Y, '경보')], motors=['M'],
   timers=[('T1', 'T1 정회전 시간', 5), ('T2', 'T2 정지 뒤 대기', 3)]),
 'e03': dict(main='reversing', short='정·역 한 번씩', eyebrow='전동기 정역 운전 · T1 정회전 · T2 역회전 뒤 정지',
   caption='승강기 03 · T1 한시로 정회전 → 역회전 · T2 한시 b가 T1을 끊어 자기유지가 풀리며 정지',
   tabs=[('forward', '정회전 기동'), ('reverse', '역회전 뒤 정지'), ('alarm', '과부하 경보')],
   devices=['T1', 'T2', 'MC1', 'MC2', 'EOCR', 'PB1', 'PB0'],
   lamps=[(R, '정회전'), (G, '역회전'), (Y, '경보')], motors=['M'],
   timers=[('T1', 'T1 정회전 시간', 5), ('T2', 'T2 역회전 시간', 4)]),
 'e04': dict(main='reversing', short='T2 자기유지 전환', eyebrow='전동기 정역 운전 · T1 → T2 자기유지 · T2 한시 전환',
   caption='승강기 04 · T1 한시 a로 T2 기동(순시 a 자기유지) → T2 한시 b로 정회전 정지, 역회전 · MC1 a → GL, MC2 a → RL',
   tabs=[('forward', '정회전 · T1'), ('reverse', 'T2 · 역회전'), ('alarm', '과부하 경보')],
   devices=['T1', 'T2', 'MC1', 'MC2', 'EOCR', 'PB1', 'PB0'],
   lamps=[(G, '정회전'), (R, '역회전'), (Y, '경보')], motors=['M'],
   timers=[('T1', 'T1 → T2 시작', 3), ('T2', 'T2 정→역 전환', 4)]),
 'e05': dict(main='reversing', short='지연 기동 정역', eyebrow='전동기 정역 운전 · T1 기동 지연 · T2 정회전 시간',
   caption='승강기 05 · T1 한시 a로 T2 기동 → T2 순시 a로 정회전, T2 한시 b·a로 역회전 전환',
   tabs=[('delay', '지연 기동 · 정회전'), ('reverse', '역회전 전환'), ('alarm', '과부하 경보')],
   devices=['T1', 'T2', 'MC1', 'MC2', 'EOCR', 'PB1', 'PB0'],
   lamps=[(R, '정회전'), (G, '역회전'), (Y, '경보')], motors=['M'],
   timers=[('T1', 'T1 기동 지연', 3), ('T2', 'T2 정회전 시간', 4)]),
 'e06': dict(main='starDelta', short='Y-Δ 기동', eyebrow='6단자 전동기 Y-Δ 기동 · T 한시 전환',
   caption='승강기 06 · T 한시 접점으로 Y 기동 → Δ 운전 전환 · MC1·MC2 b접점 인터록 · FR 로 YL 점멸',
   tabs=[('star', 'Y 기동'), ('delta', 'Δ 운전 전환'), ('alarm', '과부하 · FR 점멸')],
   devices=['T', 'FR', 'MC1', 'MC2', 'EOCR', 'PB1', 'PB0'],
   lamps=[(R, 'Y 기동'), (G, 'Δ 운전'), (Y, '경보(점멸)')], motors=['M'],
   timers=[('T', 'T Y→Δ 전환', 5)], fr='FR 점멸 간격'),
 'e07': dict(main='starDelta', short='Y-Δ · 표시등 교대', eyebrow='6단자 전동기 Y-Δ 기동 · Δ 운전 중 FR 표시등 교대',
   caption='승강기 07 · T 한시로 Y → Δ 전환 · PB0는 T 코일 앞 · Δ 운전 중 FR a/b로 RL·GL 교대 점등',
   tabs=[('star', 'Y 기동'), ('delta', 'Δ 운전 · 표시등 교대'), ('alarm', '정지 · 과부하')],
   devices=['T', 'FR', 'MC1', 'MC2', 'EOCR', 'PB1', 'PB0'],
   lamps=[(R, 'Y 기동 / 교대'), (G, 'Δ 교대'), (Y, '경보')], motors=['M'],
   timers=[('T', 'T Y→Δ 전환', 5)], fr='FR 교대 간격'),
 'e08': dict(main='twoMotors', short='M1 → M2 간헐', eyebrow='전동기 2대 · T 뒤 FR로 M2 간헐 운전',
   caption='승강기 08 · T 한시 b로 M1 정지 → T 한시 a로 FR, FR a 가 닫힐 때마다 M2 운전 · MC1·MC2 b접점 인터록',
   tabs=[('m1', 'M1 운전'), ('m2', 'M2 간헐 운전'), ('alarm', '정지 · 과부하')],
   devices=['T', 'FR', 'MC1', 'MC2', 'EOCR', 'PB1', 'PB0'],
   lamps=[(R, 'M1'), (G, 'M2'), (Y, '경보')], motors=['M1', 'M2'],
   timers=[('T', 'T M1 운전 시간', 6)], fr='FR 간격'),
 'e09': dict(main='twoMotors', short='M1 간헐 → M2', eyebrow='전동기 2대 · T 동안 FR로 M1 간헐 · T 뒤 M2 운전',
   caption='승강기 09 · T 한시 b가 닫힌 동안 FR b로 M1 간헐 운전 → T 한시 a로 M2 운전 · MC1·MC2 b접점 인터록',
   tabs=[('m1', 'M1 간헐 운전'), ('m2', 'M2 운전 전환'), ('alarm', '정지 · 과부하')],
   devices=['T', 'FR', 'MC1', 'MC2', 'EOCR', 'PB1', 'PB0'],
   lamps=[(R, 'M1'), (G, 'M2'), (Y, '경보')], motors=['M1', 'M2'],
   timers=[('T', 'T 간헐 운전 시간', 6)], fr='FR 간격'),
 'e10': dict(main='twoMotors', short='M1·M2 교대 → 동시', eyebrow='전동기 2대 · FR로 M1·M2 교대 · T 뒤 두 대 운전',
   caption='승강기 10 · FR b → MC1, FR a ∥ T 한시 a → MC2 · 인터록 없음 · T 뒤에는 두 전동기 모두 운전',
   tabs=[('alt', 'M1·M2 교대'), ('both', 'T 뒤 두 대 운전'), ('alarm', '정지 · 과부하')],
   devices=['T', 'FR', 'MC1', 'MC2', 'EOCR', 'PB1', 'PB0'],
   lamps=[(R, 'M1'), (G, 'M2'), (Y, '경보')], motors=['M1', 'M2'],
   timers=[('T', 'T 교대 시간', 6)], fr='FR 교대 간격'),
}

def viewbox(cid):
    src = (V2 / '회로' / f'circuit-{cid}.js').read_text(encoding='utf-8')
    w = json.loads(src[src.index('"viewBox":') + 10: src.index(']', src.index('"viewBox":')) + 1])[0]
    bus = {'reversing': 700, 'starDelta': 810, 'twoMotors': 760}[C[cid]['main']]
    return w + 20, bus + 70

def index_html(cid, c):
    n = cid[1:]
    W, H = viewbox(cid)
    e = html.escape
    SEL = ' class="selected"'
    tabs = '\n        '.join(f'<button data-lesson="{k}"{SEL if i == 0 else ""} aria-pressed="{"true" if i == 0 else "false"}"><span>{i + 1:02d}</span> {e(t)}</button>' for i, (k, t) in enumerate(c['tabs']))
    devs = ''.join(f'<button data-device="{d}" aria-pressed="false">{d}</button>' for d in c['devices'])
    motors = ''.join(f'<div class="motor-card" data-motor="{i}"><div class="motor-icon" aria-hidden="true"><div class="rotor">✣</div></div><div><strong>{m}</strong><span class="motor-state">정지</span></div></div>' for i, m in enumerate(c['motors']))
    lamps = ''.join(f'<div class="status-lamp" data-lamp="{t}"><div class="indicator {col}" aria-label="{t} 소등">{t}</div><span>{e(lab)}</span></div>' for (t, col), lab in c['lamps'])
    timers = '\n          '.join(f'<div data-timer="{t}"><div class="timer-head"><label>{e(lab)} <input type="number" min="1" max="30" value="{v}" step="1" aria-label="{t} 설정 초"> 초</label><span class="timer-value">0.0 / {v:.1f}초</span></div><div class="timer-track" role="progressbar" aria-label="{t} 경과" aria-valuemin="0" aria-valuemax="{v}" aria-valuenow="0"><div class="timer-fill"></div></div><p class="timer-state">대기</p></div>' for t, lab, v in c['timers'])
    fr = (f'\n          <label class="interval-label">{e(c["fr"])} <select id="interval-input"><option value="0.5">0.5초</option><option value="1" selected>1초</option><option value="2">2초</option></select><span>수업 예시</span></label><p id="fr-state" class="fr-note">FR 정지</p>') if c.get('fr') else ''
    motors_cls = 'motors two' if len(c['motors']) > 1 else 'motors'
    return f'''<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>시퀀스 LAB · 승강기 {n} {e(c['short'])}</title>
  <!--
    승강기기능사 {cid} 동작 보기(시뮬레이션). 001~018 회로 앱과 같은 구성 (요청 0023·0025):
    circuit-model.js(동작) · circuit-diagram.js(그림: e과정 공통부 + 회로 설정) · lessons.js(설명) · app.js·styles.css(e과정 공통)
    제어회로 그림은 회로 데이터(v2_엔진분리/회로/circuit-{cid}.js)의 layout 에서 그린다(핀번호·회로해석 페이지와 같은 그림).
    서버 주소 /e/{n}/sim/ . 배포 때 deploy/build_staging_all.py --with-sim 이 steps.js·회로 데이터·로고 경로를 서버 경로로 바꾼다.
    인라인 스크립트를 넣지 않는다(서버 CSP: script-src 'self'). 이 파일은 검사/e과정_시뮬레이션/gen.py 로 만든다.
  -->
  <link rel="stylesheet" href="styles.css">
  <script src="../../공용/steps.js" defer></script>
  <script src="../../회로/circuit-{cid}.js" defer></script>
  <script src="circuit-model.js" defer></script>
  <script src="circuit-diagram.js" defer></script>
  <script src="lessons.js" defer></script>
  <script src="app.js" defer></script>
</head>
<body class="elev-circuit" data-circuit="{cid}" data-stage="sim">
  <header class="page-header">
    <a href="{CAT}index.html" class="brand-home-link" title="전체 회로 목차로 돌아가기"><div class="brand"><img class="brand-logo" src="{CAT}logo_hologram.png" alt="경성전자고"><div><p class="eyebrow">승강기기능사 · {e(c['eyebrow'])}</p><h1>시퀀스 LAB <span>승강기 {n}</span></h1></div></div></a>
    <div class="header-actions"><a href="{CAT}index.html" class="home-btn">← 전체 목차</a><span class="version">승강기 {n} · 시뮬레이션</span><button id="reference-button" class="quiet">원본 자료</button><button id="fullscreen-button" class="quiet">전체 화면</button></div>
  </header>
  <nav id="steps"></nav>
  <main>
    <nav class="lesson-nav" aria-label="수업 장면">
      <div class="lesson-tabs">
        {tabs}
      </div>
      <button id="free-button" class="free-button" aria-pressed="false">자유 조작으로 전환</button>
    </nav>
    <div class="workspace">
      <section class="diagram-panel" aria-label="동작 회로도">
        <div class="diagram-toolbar"><div><p class="eyebrow">접점을 따라 동작을 확인하세요</p><h2 id="scene-heading">전원 투입 전</h2></div><div class="view-tabs" role="group" aria-label="회로 확대"><button data-view="all" class="selected" aria-pressed="true">전체</button><button data-view="control" aria-pressed="false">제어회로</button><button data-view="operation" aria-pressed="false">운전부</button><button data-view="alarm" aria-pressed="false">경보부</button></div><div class="cad-title-block"><img src="{CAT}logo_emblem.png" alt="경성전자고"><span>경성전자고등학교 IoT전기과</span></div></div>
        <div id="diagram-viewport" class="diagram-viewport" data-view="all"><svg id="circuit" viewBox="0 0 {W} {H}" role="img" aria-label="승강기기능사 {n} {e(c['short'])} 회로도. 접점의 열림과 닫힘, 코일의 여자 상태와 통전 경로를 표시합니다."></svg></div><p class="pan-hint">회로도를 좌우로 밀어서 살펴보세요.</p>
        <div class="diagram-legend"><span><i class="legend-line flow"></i>통전 경로</span><span><i class="legend-line voltage"></i>전원 측 연결</span><span><i class="legend-line inactive"></i>비통전</span><span class="legend-note">교류 회로 · 색은 전류 방향을 뜻하지 않습니다</span></div>
        <div class="device-strip" role="group" aria-label="관련 코일과 접점 찾기"><span>같은 기기 찾기</span>{devs}<span id="device-hint">기기를 선택하면 코일과 관련 접점을 함께 표시합니다.</span></div>
      </section>
      <aside class="control-panel" aria-label="조작과 동작 결과">
        <div class="panel-heading"><h2>조작부</h2><span id="mode-badge">단계별 설명</span></div>
        <p id="control-help" class="control-help">아래 ‘다음 단계’로 진행하세요.</p>
        <div class="control-row"><div><strong>MCCB</strong><span>전원</span></div><button id="power-button" class="toggle" aria-pressed="false">OFF</button></div>
        <div class="pushbuttons"><button id="start-button" class="start"><strong>PB1</strong><span>기동 · 누르고 있기</span></button><button id="stop-button" class="stop"><strong>PB0</strong><span>정지 · 누르고 있기</span></button></div>
        <div class="fault-buttons"><button id="trip-button">EOCR 과부하</button><button id="reset-trip-button">RESET</button></div>
        <div class="results"><div class="panel-heading"><h2>동작 결과</h2><span id="power-status">전원 OFF</span></div>
          <div class="{motors_cls}">{motors}</div>
          <div class="lamp-row">{lamps}</div>
          {timers}{fr}
        </div>
      </aside>
    </div>
    <section class="explanation" aria-label="현재 동작 설명"><div class="explanation-text"><span id="step-count" class="step-count">01 / 05</span><div><h2 id="step-title">MCCB를 넣기 전입니다.</h2><p id="step-description" aria-live="polite">모든 코일과 전동기가 정지해 있습니다.</p></div></div><div class="play-controls"><button id="previous-button" aria-label="이전 단계">← 이전</button><button id="play-button" class="primary">자동 재생</button><button id="next-button">다음 단계 →</button><button id="restart-button" class="quiet">처음으로</button></div></section>
    <div class="lesson-bottom"><div id="step-dots" class="step-dots" aria-label="단계 선택"></div><p id="lesson-note">실제 동작을 학습용 단계로 나누어 보여줍니다.</p></div>
  </main>
  <dialog id="reference-dialog"><div class="dialog-header"><h2>원본 도면 안내</h2><button id="close-reference">닫기</button></div><div class="reference-content"><p>원본 도면은 큐넷 공개문제 자료실에서 <strong>'승강기기능사'</strong>를 검색해 확인하세요.<br><small>(원본 저작권: 한국산업인력공단) 이 회로도는 원본을 보고 우리 방식으로 다시 그린 것입니다.</small></p><p><a class="reference-link" href="https://www.q-net.or.kr/cst006.do?id=cst00601&amp;gSite=Q&amp;gId=&amp;brdId=Q006&amp;code=1204" target="_blank" rel="noopener noreferrer">큐넷 공개문제 자료실 바로가기 ↗</a></p></div></dialog>
  <a href="{CAT}index.html" class="kse-watermark" title="전체 목차로 이동"><img src="{CAT}logo_emblem_white.png" alt="" width="16" height="16"><span>경성전자고등학교 IoT전기과</span></a>
</body>
</html>
'''

def diagram_js(cid, c):
    head = f'''/* 승강기기능사 {cid} · 동작 회로도 (요청 0023·0025)
 * 위쪽 CircuitDiagram 클래스는 e과정 회로 앱끼리 글자 하나까지 같다(001~018 앱의 접점 기호·통전 경로 계산을 옮김).
 *   - 제어회로: 회로 데이터 circuit-{cid}.js 의 layout(선·접점·코일 좌표)에서 그린다 → 핀번호·회로해석 페이지와 같은 그림
 *   - 주회로: 묶음별 그리기(정역 reversing / Y-Δ starDelta / 전동기 2대 twoMotors)
 * 회로마다 다른 곳은 맨 아래 CONFIG 세 줄뿐이다. 이 파일은 검사/e과정_시뮬레이션/gen.py 로 만든다.
 */
'''
    cfg = f'''window.CircuitDiagram.CONFIG = {{
  id: '{cid}', main: '{c['main']}',
  caption: {json.dumps(c['caption'], ensure_ascii=False)}
}};
'''
    return head + COMMON + cfg

for cid, c in C.items():
    d = V2 / cid / 'sim'
    (d / '검증').mkdir(parents=True, exist_ok=True)
    (d / 'index.html').write_text(brand_page(index_html(cid, c), cid+'.sim', d/'index.html'), encoding='utf-8', newline='\n')
    (d / 'circuit-diagram.js').write_text(diagram_js(cid, c), encoding='utf-8', newline='\n')
    if d != BASE:
        for f in ['app.js', 'styles.css']:
            (d / f).write_bytes((BASE / f).read_bytes())
        for f in ['netlist-check.cjs', 'browser-check.cjs']:
            (d / '검증' / f).write_bytes((BASE / '검증' / f).read_bytes())
    print('wrote', cid)
