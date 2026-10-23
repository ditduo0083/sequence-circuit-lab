# e과정(승강기) 동작 보기 앱 만들기 도구 — 요청 0023·0025

회로 앱 폴더: `v2_엔진분리/eNN/sim/` (서버 `/e/NN/sim/`). 001~018 앱과 같은 파일 구성이다.

| 파일 | 회로마다 / 공통 | 만드는 법 |
| --- | --- | --- |
| `circuit-model.js` | 회로마다 (동작 식) | 손으로 고친다. 처음 틀은 `gen_models.py`(+`model-*.js`)로 만들었다 |
| `lessons.js` | 회로마다 (단계별 설명) | 손으로 쓴다 |
| `circuit-diagram.js` | 공통부 + 맨 아래 CONFIG 3줄 | `gen.py` 가 `diagram-common.js` 를 붙여 만든다 |
| `index.html` | 회로마다 (조작부 구성) | `gen.py` 의 표 `C` 에서 만든다 |
| `app.js`, `styles.css` | e과정 공통(글자까지 같음) | `gen.py` 가 e01 것을 복사 |
| `검증/netlist-check.cjs`, `검증/browser-check.cjs` | 공통 | `gen.py` 가 e01 것을 복사 |
| `검증/model.test.cjs`, `검증/scenario.json` | 회로마다 | 손으로 쓴다 |

- 제어회로 그림은 회로 데이터 `회로/circuit-eNN.js` 의 `layout`(선·접점·코일 좌표)에서 그린다. 그래서 핀번호·회로해석 페이지와 그림이 같고, 데이터 그림을 고치면 시뮬레이션도 따라 바뀐다.
- 주회로는 묶음별 그리기 3가지: `reversing`(e01~e05), `starDelta`(e06·e07), `twoMotors`(e08~e10).
- 공통부(`diagram-common.js`, e01 의 `app.js`·`styles.css`·검사 도구)를 고치면: `python3 gen.py <v2_엔진분리 경로>` 로 10개 회로에 다시 나눠 준다.

## 검사 (회로 폴더 eNN/sim 에서)

```
node --test 검증/model.test.cjs      # 동작 식 시험 (0013 보고·원본 대조 내용)
node 검증/netlist-check.cjs          # 모델 접점 상태 ↔ 회로 데이터 net 결선 대조 (6,000 상태)
node 검증/browser-check.cjs          # 그림 통전 경로 ↔ 모델, 자유 조작 시나리오, 화면 크기, 캡처(검증/화면)
```
