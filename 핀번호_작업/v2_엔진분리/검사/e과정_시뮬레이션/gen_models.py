#!/usr/bin/env python3
"""요청 0025 — e02~e05, e07~e10 동작 모델(circuit-model.js)을 틀(model-*.js)에 회로 식을 넣어 만든다.
만든 뒤에는 회로 폴더의 파일이 원본이다(이 스크립트를 다시 돌릴 필요 없음). 사용: python3 gen_models.py <v2_엔진분리>"""
import sys
from pathlib import Path
V2 = Path(sys.argv[1]); TPL = Path(__file__).parent
T2 = (TPL / 'model-two-timers.js').read_text(encoding='utf-8')
TF = (TPL / 'model-t-fr.js').read_text(encoding='utf-8')
I8 = ' ' * 8

def contacts(d): return ',\n'.join(I8 + f'{k}: {v}' for k, v in d.items())
def loads(d): return ', '.join(f'{k}: {v}' for k, v in d.items())
def settle(lines): return '\n'.join(I8 + l for l in lines)

TWO_MOT = "[{ id: 'M1', run: this.mc1, text: this.mc1 ? '운전' : '정지' }, { id: 'M2', run: this.mc2, text: this.mc2 ? '운전' : '정지' }]"
YD_MOT = "[{ id: 'M', run: this.mc1 || this.mc2, reverse: false, text: this.mc1 ? 'Y 기동' : this.mc2 ? 'Δ 운전' : '정지' }]"
BASE = {'eocrNC': '!this.trip', 'eocrNO': 'this.trip'}

M = {
 'e02': (T2, 5, 3, """ * 전동기 1대 3상 정역 · T1 이 정회전 시간을 재고, T1 한시 a 로 T2 가 여자되어 정지 뒤 역회전.
 * 제어회로(데이터 net 이름):
 *   H ─EOCR b─ P ─PB0 b─ R,  R ─(PB1 a ∥ T1 순시 a)─ S ─ T1 코일
 *   S ─T1 한시 b─ MC2 b ─ MC1 코일(정회전)
 *   S ─T1 한시 a─ T2c ─ T2 코일,  T2c ─T2 한시 a─ MC1 b ─ MC2 코일(역회전)
 *   R ─MC1 a─ RL,  R ─MC2 a─ GL,  H ─EOCR a─ YL""", [
  "this.timerOn1 = this.run && (this.start || this.timerOn1);   // S 모선(PB1 a ∥ T1 순시 a) = T1 코일",
  "this.timer(1);",
  "const S = this.timerOn1;",
  "this.mc1 = S && !this.done1 && !this.mc2;                    // T1 한시 b + MC2 b → MC1(정회전)",
  "this.timerOn2 = S && this.done1;                              // T1 한시 a → T2 코일",
  "this.timer(2);",
  "this.mc2 = S && this.done1 && this.done2 && !this.mc1;       // T1 한시 a + T2 한시 a + MC1 b → MC2(역회전)",
  "this.yl = this.alarm;                                         // EOCR a → YL"],
  {**{'eocrNC': '!this.trip', 'pb0': '!this.stop', 'eocrNO': 'this.trip'}, 'pb1': 'this.start', 't1Hold': 'this.timerOn1', 'mc1Lamp': 'this.mc1', 'mc2Lamp': 'this.mc2', 't1DelayNC': '!this.done1', 'mc2Interlock': '!this.mc2', 't1DelayNO': 'this.done1', 't2DelayNO': 'this.done2', 'mc1Interlock': '!this.mc1'},
  {'EOCR': 'this.power', 'YL': 'this.yl', 'RL': 'this.mc1', 'GL': 'this.mc2', 'MC1': 'this.mc1', 'T1': 'this.timerOn1', 'T2': 'this.timerOn2', 'MC2': 'this.mc2'}),
 'e03': (T2, 5, 4, """ * 전동기 1대 3상 정역 · T1 정회전 시간 → 역회전 → T2 한시 b 가 T1 코일을 끊어 정지(반복하지 않는다).
 *   T2 가 끝나면 T1 이 소자 → T1 순시 a(자기유지)가 열려 S 모선이 끊기므로, PB1 을 떼고 있으면 전체가 멈춘다.
 *   (PB1 을 누르고 있으면 다시 정회전부터 시작한다 — 실제 릴레이 회로와 같다.)
 * 제어회로(데이터 net 이름):
 *   H ─EOCR b─ P ─PB0 b─ R,  R ─(PB1 a ∥ T1 순시 a)─ S
 *   S ─T2 한시 b─ T1 코일,  S ─T1 한시 b─ MC2 b ─ MC1 코일(정회전)
 *   S ─T1 한시 a─ M2a ─ T2 코일,  M2a ─MC1 b─ MC2 코일(역회전)
 *   R ─MC1 a─ RL,  R ─MC2 a─ GL,  H ─EOCR a─ YL""", [
  "const S = this.run && (this.start || this.timerOn1);          // S 모선: PB1 a ∥ T1 순시 a",
  "this.timerOn1 = S && !this.done2;                             // T2 한시 b → T1 코일",
  "this.timer(1);",
  "this.mc1 = S && !this.done1 && !this.mc2;                     // T1 한시 b + MC2 b → MC1(정회전)",
  "this.timerOn2 = S && this.done1;                              // T1 한시 a → T2 코일(MC1 b 앞 점)",
  "this.timer(2);",
  "this.mc2 = S && this.done1 && !this.mc1;                      // T1 한시 a + MC1 b → MC2(역회전)",
  "this.yl = this.alarm;                                         // EOCR a → YL"],
  {'eocrNC': '!this.trip', 'pb0': '!this.stop', 'eocrNO': 'this.trip', 'pb1': 'this.start', 't1Hold': 'this.timerOn1', 't1DelayNC': '!this.done1', 'mc2Interlock': '!this.mc2', 't2DelayNC': '!this.done2', 't1DelayNO': 'this.done1', 'mc1Interlock': '!this.mc1', 'mc1Lamp': 'this.mc1', 'mc2Lamp': 'this.mc2'},
  {'EOCR': 'this.power', 'YL': 'this.yl', 'MC1': 'this.mc1', 'T1': 'this.timerOn1', 'MC2': 'this.mc2', 'T2': 'this.timerOn2', 'RL': 'this.mc1', 'GL': 'this.mc2'}),
 'e04': (T2, 3, 4, """ * 전동기 1대 3상 정역 · T1 한시 a 로 T2 기동(T2 순시 a 자기유지) → T2 한시 b 로 정회전 정지, MC1 b 거쳐 역회전.
 *   T1 코일은 T2 한시 b 뒤(MC2 b 앞 점)에서 전원을 받는다 → T2 가 끝나면 T1 도 소자된다(원본 7-5쪽, 요청 0025 에서 데이터 수정).
 *   표시등이 앞 회로와 반대: MC1 a → GL, MC2 a → RL.
 * 제어회로(데이터 net 이름):
 *   H ─EOCR b─ P ─PB0 b─ R,  R ─(PB1 a ∥ T1 순시 a)─ S ─T2 한시 b─ M1a
 *   M1a ─ T1 코일,  M1a ─MC2 b─ MC1 코일(정회전)
 *   R ─(T1 한시 a ∥ T2 순시 a)─ T2c ─ T2 코일,  T2c ─MC1 b─ MC2 코일(역회전)
 *   R ─MC1 a─ GL,  R ─MC2 a─ RL,  H ─EOCR a─ YL""", [
  "const S = this.run && (this.start || this.timerOn1);          // PB1 a ∥ T1 순시 a",
  "const M1a = S && !this.done2;                                 // T2 한시 b 뒤 점",
  "this.timerOn1 = M1a;                                          // T1 코일",
  "this.timer(1);",
  "this.mc1 = M1a && !this.mc2;                                  // MC2 b → MC1(정회전)",
  "this.timerOn2 = this.run && (this.done1 || this.timerOn2);    // T1 한시 a ∥ T2 순시 a(자기유지) → T2 코일",
  "this.timer(2);",
  "this.mc2 = this.timerOn2 && !this.mc1;                        // MC1 b → MC2(역회전)",
  "this.yl = this.alarm;                                         // EOCR a → YL"],
  {'eocrNC': '!this.trip', 'pb0': '!this.stop', 'eocrNO': 'this.trip', 'mc2Lamp': 'this.mc2', 'mc1Lamp': 'this.mc1', 'pb1': 'this.start', 't1Hold': 'this.timerOn1', 't2DelayNC': '!this.done2', 'mc2Interlock': '!this.mc2', 't1DelayNO': 'this.done1', 't2Hold': 'this.timerOn2', 'mc1Interlock': '!this.mc1'},
  {'EOCR': 'this.power', 'YL': 'this.yl', 'RL': 'this.mc2', 'GL': 'this.mc1', 'MC1': 'this.mc1', 'T1': 'this.timerOn1', 'MC2': 'this.mc2', 'T2': 'this.timerOn2'}),
 'e05': (T2, 3, 4, """ * 전동기 1대 3상 정역 · PB1 뒤 T1 시간만큼 기다렸다가(T1 한시 a → T2) T2 순시 a 로 정회전, T2 한시 b·a 로 역회전.
 * 제어회로(데이터 net 이름):
 *   H ─EOCR b─ P ─PB0 b─ R,  R ─(PB1 a ∥ T1 순시 a)─ S ─ T1 코일,  S ─T1 한시 a─ T2c ─ T2 코일
 *   R ─T2 한시 b─ M1a ─T2 순시 a─ M1b ─MC2 b─ MC1 코일(정회전)
 *   R ─T2 한시 a─ M2a ─MC1 b─ MC2 코일(역회전)
 *   R ─MC1 a─ RL,  R ─MC2 a─ GL (원본은 각 접촉기 가지에서 받지만 전기적으로 같다),  H ─EOCR a─ YL""", [
  "this.timerOn1 = this.run && (this.start || this.timerOn1);   // S 모선(PB1 a ∥ T1 순시 a) = T1 코일",
  "this.timer(1);",
  "this.timerOn2 = this.timerOn1 && this.done1;                  // T1 한시 a → T2 코일",
  "this.timer(2);",
  "this.mc1 = this.run && !this.done2 && this.timerOn2 && !this.mc2;   // T2 한시 b + T2 순시 a + MC2 b → MC1(정회전)",
  "this.mc2 = this.run && this.done2 && !this.mc1;               // T2 한시 a + MC1 b → MC2(역회전)",
  "this.yl = this.alarm;                                         // EOCR a → YL"],
  {'eocrNC': '!this.trip', 'pb0': '!this.stop', 'eocrNO': 'this.trip', 'pb1': 'this.start', 't1Hold': 'this.timerOn1', 't1DelayNO': 'this.done1', 't2DelayNC': '!this.done2', 't2InstantNO': 'this.timerOn2', 'mc2Interlock': '!this.mc2', 't2DelayNO': 'this.done2', 'mc1Interlock': '!this.mc1', 'mc1Lamp': 'this.mc1', 'mc2Lamp': 'this.mc2'},
  {'EOCR': 'this.power', 'YL': 'this.yl', 'T1': 'this.timerOn1', 'T2': 'this.timerOn2', 'MC1': 'this.mc1', 'MC2': 'this.mc2', 'RL': 'this.mc1', 'GL': 'this.mc2'}),
 'e07': (TF, 5, None, """ * 6단자 전동기 Y-Δ 기동(MC1 = Y, MC2 = Δ) · PB0 는 T 코일 앞 · Δ 운전 중 FR 이 RL·GL 을 번갈아 켠다.
 * 제어회로(데이터 net 이름):
 *   H ─EOCR b─ R,  R ─(PB1 a ∥ T 순시 a)─ S,  S ─PB0 b─ T 코일
 *   S ─T 한시 b─ MC2 b ─ MC1 코일(Y),  S ─T 한시 a─ MC1 b ─ MC2 코일(Δ)
 *   R ─MC1 a─ RLc ─ RL,  R ─MC2 a─ FRC ─ FR 코일,  FRC ─FR a─ RLc,  FRC ─FR b─ GLc ─ GL
 *   H ─EOCR a─ YL""", [
  "this.mc1 = this.S && !this.done && !this.mc2;                 // T 한시 b + MC2 b → MC1(Y)",
  "this.mc2 = this.S && this.done && !this.mc1;                  // T 한시 a + MC1 b → MC2(Δ)",
  "const rlc0 = this.run && this.mc1, frc0 = this.run && this.mc2;   // MC1 a → RLc, MC2 a → FRC",
  "const frc = frc0 || (rlc0 && this.frOut), rlc = rlc0 || (frc0 && this.frOut);   // FR a 가 닫히면 RLc·FRC 가 이어진다",
  "this.fr = frc; this.rl = rlc; this.gl = frc && !this.frOut;  // FR b → GL"],
  {'eocrNC': '!this.trip', 'eocrNO': 'this.trip', 'pb1': 'this.start', 'tHold': 'this.timerOn', 'pb0': '!this.stop', 'tDelayNC': '!this.done', 'mc2Interlock': '!this.mc2', 'tDelayNO': 'this.done', 'mc1Interlock': '!this.mc1', 'mc1Lamp': 'this.mc1', 'frUpper': 'this.frOut', 'frLower': '!this.frOut', 'mc2Lamp': 'this.mc2'},
  {'EOCR': 'this.power', 'YL': 'this.yl', 'T': 'this.timerOn', 'MC1': 'this.mc1', 'MC2': 'this.mc2', 'RL': 'this.rl', 'GL': 'this.gl', 'FR': 'this.fr'}, YD_MOT, 'true'),
 'e08': (TF, 6, None, """ * 독립 전동기 2대(MC1 → M1, MC2 → M2) · T 동안 M1 운전 → T 한시 a 로 FR, FR a 가 닫힐 때마다 M2 운전(간헐).
 * 제어회로(데이터 net 이름):
 *   H ─EOCR b─ R,  R ─(PB1 a ∥ T 순시 a)─ S,  S ─PB0 b─ T 코일
 *   S ─T 한시 b─ MC2 b ─ MC1 코일(M1),  S ─T 한시 a─ FR 코일,  S ─FR a─ MC1 b ─ MC2 코일(M2)
 *   R ─MC1 a─ RL,  R ─MC2 a─ GL,  H ─EOCR a─ YL""", [
  "this.mc1 = this.S && !this.done && !this.mc2;                 // T 한시 b + MC2 b → MC1(M1)",
  "this.fr = this.S && this.done;                                // T 한시 a → FR 코일",
  "this.mc2 = this.S && this.frOut && !this.mc1;                 // FR a + MC1 b → MC2(M2)",
  "this.rl = this.run && this.mc1; this.gl = this.run && this.mc2;"],
  {'eocrNC': '!this.trip', 'eocrNO': 'this.trip', 'pb1': 'this.start', 'tHold': 'this.timerOn', 'pb0': '!this.stop', 'tDelayNC': '!this.done', 'mc2Interlock': '!this.mc2', 'tDelayNO': 'this.done', 'frM2': 'this.frOut', 'mc1Interlock': '!this.mc1', 'mc1Lamp': 'this.mc1', 'mc2Lamp': 'this.mc2'},
  {'EOCR': 'this.power', 'YL': 'this.yl', 'T': 'this.timerOn', 'MC1': 'this.mc1', 'FR': 'this.fr', 'MC2': 'this.mc2', 'RL': 'this.rl', 'GL': 'this.gl'}, TWO_MOT, 'true'),
 'e09': (TF, 6, None, """ * 독립 전동기 2대 · T 한시 b 가 닫힌 동안 FR 여자, FR b 가 닫힐 때마다 M1 운전(간헐) → T 한시 a 로 M2 운전.
 * 제어회로(데이터 net 이름):
 *   H ─EOCR b─ R,  R ─(PB1 a ∥ T 순시 a)─ S,  S ─PB0 b─ T 코일
 *   S ─T 한시 b─ FRC ─ FR 코일,  FRC ─FR b─ MC2 b ─ MC1 코일(M1),  S ─T 한시 a─ MC1 b ─ MC2 코일(M2)
 *   R ─MC1 a─ RL,  R ─MC2 a─ GL (원본은 S 모선에서 받지만 전기적으로 같다),  H ─EOCR a─ YL""", [
  "this.fr = this.S && !this.done;                               // T 한시 b → FR 코일",
  "this.mc1 = this.S && !this.done && !this.frOut && !this.mc2;  // T 한시 b + FR b + MC2 b → MC1(M1)",
  "this.mc2 = this.S && this.done && !this.mc1;                  // T 한시 a + MC1 b → MC2(M2)",
  "this.rl = this.run && this.mc1; this.gl = this.run && this.mc2;"],
  {'eocrNC': '!this.trip', 'eocrNO': 'this.trip', 'pb1': 'this.start', 'tHold': 'this.timerOn', 'pb0': '!this.stop', 'tDelayNC': '!this.done', 'frM1': '!this.frOut', 'mc2Interlock': '!this.mc2', 'tDelayNO': 'this.done', 'mc1Interlock': '!this.mc1', 'mc1Lamp': 'this.mc1', 'mc2Lamp': 'this.mc2'},
  {'EOCR': 'this.power', 'YL': 'this.yl', 'T': 'this.timerOn', 'MC1': 'this.mc1', 'FR': 'this.fr', 'MC2': 'this.mc2', 'RL': 'this.rl', 'GL': 'this.gl'}, TWO_MOT, 'true'),
 'e10': (TF, 6, None, """ * 독립 전동기 2대 · T 동안 FR 이 M1·M2 를 번갈아 운전 → T 뒤에는 FR 이 멈춰 FR b(M1)와 T 한시 a(M2)로 두 대 모두 운전.
 *   이 회로에는 MC1·MC2 인터록이 없다(두 전동기가 따로 돌므로 동시 운전이 정상).
 * 제어회로(데이터 net 이름):
 *   H ─EOCR b─ R,  R ─(PB1 a ∥ T 순시 a)─ S,  S ─PB0 b─ T 코일
 *   S ─T 한시 b─ FR 코일,  S ─FR b─ MC1 코일(M1),  S ─(FR a ∥ T 한시 a)─ M2c ─ MC2 코일(M2)
 *   S ─MC1 a─ RL,  M2c ─MC2 a─ GL,  H ─EOCR a─ YL""", [
  "this.fr = this.S && !this.done;                               // T 한시 b → FR 코일",
  "this.mc1 = this.S && !this.frOut;                             // FR b → MC1(M1)",
  "this.mc2 = this.S && (this.frOut || this.done);               // FR a ∥ T 한시 a → MC2(M2)",
  "this.rl = this.S && this.mc1; this.gl = this.mc2;             // MC1 a(S 모선) → RL, MC2 a(MC2 코일 쪽 점) → GL"],
  {'eocrNC': '!this.trip', 'eocrNO': 'this.trip', 'pb1': 'this.start', 'tHold': 'this.timerOn', 'pb0': '!this.stop', 'tDelayNC': '!this.done', 'frM1': '!this.frOut', 'mc1Lamp': 'this.mc1', 'frM2': 'this.frOut', 'tDelayNO': 'this.done', 'mc2Lamp': 'this.mc2'},
  {'EOCR': 'this.power', 'YL': 'this.yl', 'T': 'this.timerOn', 'FR': 'this.fr', 'MC1': 'this.mc1', 'RL': 'this.rl', 'MC2': 'this.mc2', 'GL': 'this.gl'}, TWO_MOT, 'false'),
}

for cid, spec in M.items():
    tpl, d1, d2, doc, st, ct, ld = spec[:7]
    s = tpl.replace('__ID__', cid).replace('__DOC__', doc).replace('__D1__', str(d1)).replace('__SETTLE__', settle(st)).replace('__CONTACTS__', contacts(ct)).replace('__LOADS__', loads(ld))
    if d2 is not None: s = s.replace('__D2__', str(d2))
    if len(spec) > 7: s = s.replace('__MOTORS__', spec[7]).replace('__INTERLOCK__', spec[8] + ('   // MC1·MC2 b접점 인터록이 있는 회로(검사에서 동시 투입을 오류로 본다)' if spec[8] == 'true' else '  // 인터록 없음 — 두 전동기 동시 운전이 정상'))
    assert '__' not in s, cid
    d = V2 / cid / 'sim'; d.mkdir(parents=True, exist_ok=True)
    (d / 'circuit-model.js').write_text(s, encoding='utf-8', newline='\n')
    print('model', cid)
