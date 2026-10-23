/* 핀번호 적기 004. 회로 앱 초안을 원본 7쪽과 대조한 데이터. 화면 선은 기존 앱 그래프 좌표로 새로 그린다. */
(function (root) {
  'use strict';
  var C = root.PIN_CIRCUITS = root.PIN_CIRCUITS || {};
  C['004'] = {
  "id": "004",
  "title": "전기기능사 004 · 핀번호 적기",
  "subject": "전기기능사",
  "source": {
    "doc": "전기기능사-004-A4, 2025-08-04.pdf",
    "legendPage": 6,
    "circuitPage": 7,
    "devicePage": 9
  },
  "app": {
    "folder": "004_M1_M2_정지_순환운전"
  },
  "devices": {
    "BZ": {
      "type": null,
      "cat": "lamp"
    },
    "EOCR": {
      "type": "eocr-12p"
    },
    "FLS": {
      "type": "fls-8p"
    },
    "FR": {
      "type": "flicker-8p"
    },
    "GL": {
      "type": null,
      "cat": "lamp"
    },
    "MC1": {
      "type": "mc-12p"
    },
    "MC2": {
      "type": "mc-12p"
    },
    "PB0": {
      "type": null,
      "cat": "pb"
    },
    "PB1": {
      "type": null,
      "cat": "pb"
    },
    "RL": {
      "type": null,
      "cat": "lamp"
    },
    "SS": {
      "type": null,
      "cat": "ss"
    },
    "T": {
      "type": "timer-8p"
    },
    "X": {
      "type": "relay-8p"
    },
    "YL": {
      "type": null,
      "cat": "lamp"
    },
    "MCCB": {
      "type": null,
      "cat": "main"
    }
  },
  "answerKey": {
    "eocrNC": [
      "10",
      "4"
    ],
    "eocrNO": [
      "10",
      "5"
    ],
    "ssA": [
      "SS",
      "A"
    ],
    "flsContact": [
      "4",
      "3"
    ],
    "ssM": [
      "SS",
      "M"
    ],
    "pb0": [
      "N",
      "C"
    ],
    "pb1": [
      "N",
      "O"
    ],
    "xHold": [
      "1",
      "3"
    ],
    "xEnable": [
      "8",
      "6"
    ],
    "frMC1": [
      "8",
      "5"
    ],
    "frM2T": [
      "8",
      "6"
    ],
    "tDelayNC": [
      "8",
      "5"
    ],
    "mc1Aux": [
      "4",
      "10"
    ],
    "mc2Aux": [
      "4",
      "10"
    ],
    "coil-EOCR": [
      "6",
      "12"
    ],
    "coil-YL": [
      "1",
      "2"
    ],
    "coil-BZ": [
      "1",
      "2"
    ],
    "coil-FLS": [
      "5",
      "6"
    ],
    "coil-FR": [
      "2",
      "7"
    ],
    "coil-X": [
      "2",
      "7"
    ],
    "coil-MC1": [
      "6",
      "12"
    ],
    "coil-MC2": [
      "6",
      "12"
    ],
    "coil-T": [
      "2",
      "7"
    ],
    "coil-RL": [
      "1",
      "2"
    ],
    "coil-GL": [
      "1",
      "2"
    ],
    "fls-E": [
      "7",
      "8",
      "1"
    ],
    "main-MCCB": [
      [
        "1",
        "7"
      ],
      [
        "2",
        "8"
      ],
      [
        "3",
        "9"
      ]
    ],
    "main-EOCR": [
      [
        "1",
        "7"
      ],
      [
        "2",
        "8"
      ],
      [
        "3",
        "9"
      ]
    ],
    "main-MC1": [
      [
        "1",
        "7"
      ],
      [
        "2",
        "8"
      ],
      [
        "3",
        "9"
      ]
    ],
    "main-MC2": [
      [
        "1",
        "7"
      ],
      [
        "2",
        "8"
      ],
      [
        "3",
        "9"
      ]
    ]
  },
  "rules": {
    "contactReversed": "warn",
    "coilReversed": "warn",
    "sharedCommon": "ok",
    "eocr11": "warn",
    "pushbuttonDigits": "warn",
    "mccbOptional": true,
    "scoreModes": {
      "half": {
        "ok": 1,
        "warn": 0.5,
        "bad": 0
      },
      "markOnly": {
        "ok": 1,
        "warn": 1,
        "bad": 0
      }
    }
  },
  "deepText": "같은 기구의 여러 접점은 내부 결선도에서 각각 사용할 핀 조를 확인하세요. 연결된 선은 같은 전기적 점입니다.",
  synopsis: {
    text: "MCCB를 투입하고 EOCR이 정상일 때 제어 전원이 공급된다. 자동에서는 FLS 감지 접점, 수동에서는 PB1이 X와 FR을 여자시킨다. 수동에서 PB1을 놓아도 X의 자기유지 a접점이 운전을 이어 준다. X의 다른 a접점이 FR 접점 앞까지 전원을 보내며, FR 첫 구간에는 b접점이 닫혀 MC1·M1·RL이 동작한다. FR이 전환되면 MC1은 멈추고 a접점으로 T와 MC2가 여자되어 M2·GL이 동작한다. T 설정시간이 끝나 한시 b접점이 열리면 MC2만 소자되어 두 전동기가 모두 정지한다. 정지 구간에도 T는 FR의 두 번째 구간이 끝날 때까지 여자 상태다. FR이 첫 구간으로 돌아오면 T가 복귀하고 M1부터 같은 순서를 반복한다. 자동 감지 해제나 수동 PB0 정지는 X·FR을 복귀시켜 순환을 끝낸다. 과부하에서는 EOCR의 운전 b접점이 열리고 경보 a접점이 닫혀 YL·BZ가 함께 동작한다.",
    verified: true
  },
  interpretQuestions: [
    {"id":"q1","prompt":"자동 감지 시 X와 FR을 여자시키는 접점은?","answerItemIds":["flsContact"],"multi":false,"explain":"FLS a접점이 닫혀 X·FR에 전원을 보내요."},
    {"id":"q2","prompt":"수동에서 PB1을 놓아도 X와 FR을 유지하는 접점은?","answerItemIds":["xHold"],"multi":false,"explain":"X 자기유지 접점이 PB1과 병렬이에요."},
    {"id":"q3","prompt":"X가 여자되면 FR 접점 앞까지 전원을 보내는 접점은?","answerItemIds":["xEnable"],"multi":false,"explain":"X의 다른 a접점이 운전 분기를 허가해요."},
    {"id":"q4","prompt":"FR 첫 구간에서 M1을 운전시키는 접점은?","answerItemIds":["frMC1"],"multi":false,"explain":"FR b접점이 MC1 공급 경로를 닫아요."},
    {"id":"q5","prompt":"FR 다음 구간에서 T와 M2 쪽에 전원을 보내는 접점은?","answerItemIds":["frM2T"],"multi":false,"explain":"FR a접점이 닫히면 T와 MC2 분기가 시작돼요."},
    {"id":"q6","prompt":"T 설정시간 뒤 M2를 먼저 정지시키는 접점은?","answerItemIds":["tDelayNC"],"multi":false,"explain":"T 한시 b접점이 열려 MC2만 끊어요."},
    {"id":"q7","prompt":"수동 운전의 반복을 멈추게 하는 버튼 접점은?","answerItemIds":["pb0"],"multi":false,"explain":"PB0 b접점이 열리면 X의 유지가 해제돼요."},
    {"id":"q8","prompt":"과부하 때 정상 운전을 끊는 접점은?","answerItemIds":["eocrNC"],"multi":false,"explain":"EOCR b접점이 제어 운전선을 차단해요."},
    {"id":"q9","prompt":"경보 경로에서 함께 동작하는 부하를 모두 고르세요.","answerItemIds":["coil-YL","coil-BZ"],"multi":true,"explain":"YL과 BZ가 같은 경보 공급점에 연결돼 있어요."}
  ],

  "layout": {
    "viewBox": [
      1610,
      810
    ],
    "coilY": 590,
    "main": [
      {
        "tag": "MCCB",
        "xs": [
          70,
          115,
          160
        ],
        "slotY": [
          80,
          160
        ],
        "optional": true
      },
      {
        "tag": "EOCR",
        "xs": [
          70,
          115,
          160
        ],
        "slotY": [
          236,
          301
        ]
      },
      {
        "tag": "MC1",
        "xs": [
          70,
          115,
          160
        ],
        "slotY": [
          400,
          480
        ]
      },
      {
        "tag": "MC2",
        "xs": [
          240,
          285,
          330
        ],
        "slotY": [
          400,
          480
        ]
      }
    ],
    "items": [
      {
        "id": "eocrNC",
        "cat": "contact",
        "tag": "EOCR",
        "kind": "b",
        "feat": "ovl",
        "label": "EOCR",
        "title": "EOCR 접점 (b)",
        "horiz": true,
        "x1": 545,
        "x2": 590,
        "y": 100,
        "slots": [
          {
            "x": 545,
            "y": 76,
            "net": "n_alarmIn"
          },
          {
            "x": 590,
            "y": 76,
            "net": "n_GLIn"
          }
        ]
      },
      {
        "id": "eocrNO",
        "cat": "contact",
        "tag": "EOCR",
        "kind": "a",
        "feat": "ovl",
        "x": 510,
        "rows": [
          335,
          375
        ],
        "nets": [
          "n_alarmIn",
          "n_BZP"
        ],
        "label": "EOCR",
        "title": "EOCR 접점 (a)"
      },
      {
        "id": "ssA",
        "cat": "ss",
        "tag": "SS",
        "kind": "a",
        "feat": "ss",
        "x": 760,
        "rows": [
          133,
          173
        ],
        "nets": [
          "n_GLIn",
          "n_flsIn"
        ],
        "label": "SS",
        "title": "SS 접점 (a)",
        "sub": "A"
      },
      {
        "id": "flsContact",
        "cat": "contact",
        "tag": "FLS",
        "kind": "a",
        "feat": "",
        "x": 760,
        "rows": [
          335,
          375
        ],
        "nets": [
          "n_flsIn",
          "n_XP"
        ],
        "label": "FLS",
        "title": "FLS 접점 (a)"
      },
      {
        "id": "ssM",
        "cat": "ss",
        "tag": "SS",
        "kind": "b",
        "feat": "ss",
        "x": 900,
        "rows": [
          133,
          173
        ],
        "nets": [
          "n_GLIn",
          "n_pb0In"
        ],
        "label": "SS",
        "title": "SS 접점 (a)",
        "sub": "M",
        "appKind": "a",
        "appKindNote": "원본 도면은 b접점, 회로 앱은 a접점. 핀번호 채점은 SS/M 규칙을 따른다."
      },
      {
        "id": "pb0",
        "cat": "pb",
        "tag": "PB0",
        "kind": "b",
        "feat": "pb",
        "x": 900,
        "rows": [
          215,
          255
        ],
        "nets": [
          "n_pb0In",
          "n_holdIn"
        ],
        "label": "PB0",
        "title": "PB0 접점 (b)"
      },
      {
        "id": "pb1",
        "cat": "pb",
        "tag": "PB1",
        "kind": "a",
        "feat": "pb",
        "x": 900,
        "rows": [
          335,
          375
        ],
        "nets": [
          "n_holdIn",
          "n_XP"
        ],
        "label": "PB1",
        "title": "PB1 접점 (a)"
      },
      {
        "id": "xHold",
        "cat": "contact",
        "tag": "X",
        "kind": "a",
        "feat": "",
        "x": 980,
        "rows": [
          335,
          375
        ],
        "nets": [
          "n_holdIn",
          "n_XP"
        ],
        "label": "X",
        "title": "X 접점 (a)"
      },
      {
        "id": "xEnable",
        "cat": "contact",
        "tag": "X",
        "kind": "a",
        "feat": "",
        "x": 1120,
        "rows": [
          215,
          255
        ],
        "nets": [
          "n_GLIn",
          "n_fr2In"
        ],
        "label": "X",
        "title": "X 접점 (a)"
      },
      {
        "id": "frMC1",
        "cat": "contact",
        "tag": "FR",
        "kind": "b",
        "feat": "fl",
        "x": 1200,
        "rows": [
          335,
          375
        ],
        "nets": [
          "n_fr2In",
          "n_MC1P"
        ],
        "label": "FR",
        "title": "FR 접점 (b)"
      },
      {
        "id": "frM2T",
        "cat": "contact",
        "tag": "FR",
        "kind": "a",
        "feat": "fl",
        "x": 1280,
        "rows": [
          335,
          375
        ],
        "nets": [
          "n_fr2In",
          "n_TP"
        ],
        "label": "FR",
        "title": "FR 접점 (a)"
      },
      {
        "id": "tDelayNC",
        "cat": "contact",
        "tag": "T",
        "kind": "b",
        "feat": "td",
        "x": 1280,
        "rows": [
          465,
          505
        ],
        "nets": [
          "n_TP",
          "n_MC2P"
        ],
        "label": "T",
        "title": "T 접점 (한시 b)",
        "timing": "delay"
      },
      {
        "id": "mc1Aux",
        "cat": "contact",
        "tag": "MC1",
        "kind": "a",
        "feat": "",
        "x": 1450,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_GLIn",
          "n_RLP"
        ],
        "label": "MC1",
        "title": "MC1 접점 (a)"
      },
      {
        "id": "mc2Aux",
        "cat": "contact",
        "tag": "MC2",
        "kind": "a",
        "feat": "",
        "x": 1520,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_GLIn",
          "n_GLP"
        ],
        "label": "MC2",
        "title": "MC2 접점 (a)"
      },
      {
        "id": "coil-EOCR",
        "cat": "coil",
        "tag": "EOCR",
        "x": 435,
        "nets": [
          "n_alarmIn",
          "n_r1520"
        ],
        "title": "EOCR 코일"
      },
      {
        "id": "coil-YL",
        "cat": "lamp",
        "tag": "YL",
        "x": 510,
        "nets": [
          "n_BZP",
          "n_r1520"
        ],
        "title": "YL 램프·부저"
      },
      {
        "id": "coil-BZ",
        "cat": "lamp",
        "tag": "BZ",
        "x": 590,
        "nets": [
          "n_BZP",
          "n_r1520"
        ],
        "title": "BZ 램프·부저"
      },
      {
        "id": "coil-FLS",
        "cat": "coil",
        "tag": "FLS",
        "x": 690,
        "nets": [
          "n_flsIn",
          "n_r1520"
        ],
        "title": "FLS 코일"
      },
      {
        "id": "coil-FR",
        "cat": "coil",
        "tag": "FR",
        "x": 760,
        "nets": [
          "n_XP",
          "n_r1520"
        ],
        "title": "FR 코일"
      },
      {
        "id": "coil-X",
        "cat": "coil",
        "tag": "X",
        "x": 900,
        "nets": [
          "n_XP",
          "n_r1520"
        ],
        "title": "X 코일"
      },
      {
        "id": "coil-MC1",
        "cat": "coil",
        "tag": "MC1",
        "x": 1200,
        "nets": [
          "n_MC1P",
          "n_r1520"
        ],
        "title": "MC1 코일"
      },
      {
        "id": "coil-MC2",
        "cat": "coil",
        "tag": "MC2",
        "x": 1280,
        "nets": [
          "n_MC2P",
          "n_r1520"
        ],
        "title": "MC2 코일"
      },
      {
        "id": "coil-T",
        "cat": "coil",
        "tag": "T",
        "x": 1360,
        "nets": [
          "n_TP",
          "n_r1520"
        ],
        "title": "T 코일"
      },
      {
        "id": "coil-RL",
        "cat": "lamp",
        "tag": "RL",
        "x": 1450,
        "nets": [
          "n_RLP",
          "n_r1520"
        ],
        "title": "RL 램프·부저"
      },
      {
        "id": "coil-GL",
        "cat": "lamp",
        "tag": "GL",
        "x": 1520,
        "nets": [
          "n_GLP",
          "n_r1520"
        ],
        "title": "GL 램프·부저"
      },
      {
        "id": "fls-E",
        "cat": "flsE",
        "tag": "FLS",
        "title": "FLS 전극 → TB4 (E1·E2·E3)",
        "slots": [
          {
            "x": 715,
            "y": 760
          },
          {
            "x": 745,
            "y": 760
          },
          {
            "x": 775,
            "y": 760
          }
        ]
      }
    ],
    "order": [
      "main-MCCB-0",
      "main-MCCB-1",
      "main-MCCB-2",
      "main-EOCR-0",
      "main-EOCR-1",
      "main-EOCR-2",
      "main-MC1-0",
      "main-MC1-1",
      "main-MC1-2",
      "main-MC2-0",
      "main-MC2-1",
      "main-MC2-2",
      "eocrNC",
      "eocrNO",
      "ssA",
      "flsContact",
      "ssM",
      "pb0",
      "pb1",
      "xHold",
      "xEnable",
      "frMC1",
      "frM2T",
      "tDelayNC",
      "mc1Aux",
      "mc2Aux",
      "coil-EOCR",
      "coil-YL",
      "coil-BZ",
      "coil-FLS",
      "coil-FR",
      "coil-X",
      "coil-MC1",
      "coil-MC2",
      "coil-T",
      "coil-RL",
      "coil-GL",
      "fls-E"
    ],
    "drawing": [
      {
        "t": "rect",
        "x": 55,
        "y": 40,
        "w": 165,
        "h": 20
      },
      {
        "t": "text",
        "x": 70,
        "y": 33,
        "s": "L1",
        "size": 13,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 70,
        "y": 50
      },
      {
        "t": "text",
        "x": 115,
        "y": 33,
        "s": "L2",
        "size": 13,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 115,
        "y": 50
      },
      {
        "t": "text",
        "x": 160,
        "y": 33,
        "s": "L3",
        "size": 13,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 160,
        "y": 50
      },
      {
        "t": "text",
        "x": 205,
        "y": 33,
        "s": "PE",
        "size": 13,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 205,
        "y": 50
      },
      {
        "t": "text",
        "x": 14,
        "y": 56,
        "s": "TB1",
        "size": 13
      },
      {
        "t": "text",
        "x": 228,
        "y": 56,
        "s": "3P3W AC 220V",
        "size": 12
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 54,
        "x2": 70,
        "y2": 100
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 140,
        "x2": 70,
        "y2": 420
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 460,
        "x2": 70,
        "y2": 550
      },
      {
        "t": "breaker",
        "x": 70,
        "y1": 100,
        "y2": 140
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 54,
        "x2": 115,
        "y2": 100
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 140,
        "x2": 115,
        "y2": 420
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 460,
        "x2": 115,
        "y2": 550
      },
      {
        "t": "breaker",
        "x": 115,
        "y1": 100,
        "y2": 140
      },
      {
        "t": "line",
        "x1": 160,
        "y1": 54,
        "x2": 160,
        "y2": 100
      },
      {
        "t": "line",
        "x1": 160,
        "y1": 140,
        "x2": 160,
        "y2": 420
      },
      {
        "t": "line",
        "x1": 160,
        "y1": 460,
        "x2": 160,
        "y2": 550
      },
      {
        "t": "breaker",
        "x": 160,
        "y1": 100,
        "y2": 140
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 122,
        "x2": 164,
        "y2": 122,
        "dash": true
      },
      {
        "t": "text",
        "x": 8,
        "y": 126,
        "s": "MCCB",
        "size": 12
      },
      {
        "t": "dot",
        "x": 70,
        "y": 188
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 188,
        "x2": 240,
        "y2": 188
      },
      {
        "t": "fuse",
        "x": 240,
        "y": 188
      },
      {
        "t": "wire",
        "pts": [
          [
            280,
            188
          ],
          [
            395,
            188
          ],
          [
            395,
            100
          ]
        ]
      },
      {
        "t": "text",
        "x": 240,
        "y": 176,
        "s": "FUSE",
        "size": 12
      },
      {
        "t": "dot",
        "x": 160,
        "y": 212
      },
      {
        "t": "line",
        "x1": 160,
        "y1": 212,
        "x2": 240,
        "y2": 212
      },
      {
        "t": "fuse",
        "x": 240,
        "y": 212
      },
      {
        "t": "wire",
        "pts": [
          [
            280,
            212
          ],
          [
            385,
            212
          ],
          [
            385,
            700
          ]
        ]
      },
      {
        "t": "rect",
        "x": 45,
        "y": 250,
        "w": 140,
        "h": 35,
        "sw": 1.6
      },
      {
        "t": "text",
        "x": 115,
        "y": 273,
        "s": "EOCR",
        "size": 15,
        "anchor": "middle"
      },
      {
        "t": "dot",
        "x": 70,
        "y": 340
      },
      {
        "t": "wire",
        "pts": [
          [
            70,
            340
          ],
          [
            240,
            340
          ],
          [
            240,
            420
          ]
        ]
      },
      {
        "t": "line",
        "x1": 240,
        "y1": 460,
        "x2": 240,
        "y2": 550
      },
      {
        "t": "dot",
        "x": 115,
        "y": 355
      },
      {
        "t": "wire",
        "pts": [
          [
            115,
            355
          ],
          [
            285,
            355
          ],
          [
            285,
            420
          ]
        ]
      },
      {
        "t": "line",
        "x1": 285,
        "y1": 460,
        "x2": 285,
        "y2": 550
      },
      {
        "t": "dot",
        "x": 160,
        "y": 370
      },
      {
        "t": "wire",
        "pts": [
          [
            160,
            370
          ],
          [
            330,
            370
          ],
          [
            330,
            420
          ]
        ]
      },
      {
        "t": "line",
        "x1": 330,
        "y1": 460,
        "x2": 330,
        "y2": 550
      },
      {
        "t": "mc",
        "x": 70,
        "y1": 420,
        "y2": 460
      },
      {
        "t": "mc",
        "x": 115,
        "y1": 420,
        "y2": 460
      },
      {
        "t": "mc",
        "x": 160,
        "y1": 420,
        "y2": 460
      },
      {
        "t": "line",
        "x1": 76,
        "y1": 442,
        "x2": 166,
        "y2": 442,
        "dash": true
      },
      {
        "t": "mc",
        "x": 240,
        "y1": 420,
        "y2": 460
      },
      {
        "t": "mc",
        "x": 285,
        "y1": 420,
        "y2": 460
      },
      {
        "t": "mc",
        "x": 330,
        "y1": 420,
        "y2": 460
      },
      {
        "t": "line",
        "x1": 246,
        "y1": 442,
        "x2": 336,
        "y2": 442,
        "dash": true
      },
      {
        "t": "text",
        "x": 10,
        "y": 446,
        "s": "MC1",
        "size": 12
      },
      {
        "t": "text",
        "x": 186,
        "y": 446,
        "s": "MC2",
        "size": 12
      },
      {
        "t": "line",
        "x1": 205,
        "y1": 54,
        "x2": 205,
        "y2": 550
      },
      {
        "t": "dot",
        "x": 205,
        "y": 325
      },
      {
        "t": "wire",
        "pts": [
          [
            205,
            325
          ],
          [
            370,
            325
          ],
          [
            370,
            550
          ]
        ]
      },
      {
        "t": "rect",
        "x": 55,
        "y": 540,
        "w": 165,
        "h": 20
      },
      {
        "t": "rect",
        "x": 228,
        "y": 540,
        "w": 157,
        "h": 20
      },
      {
        "t": "term",
        "x": 70,
        "y": 550
      },
      {
        "t": "text",
        "x": 70,
        "y": 533,
        "s": "U1",
        "size": 11,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 115,
        "y": 550
      },
      {
        "t": "text",
        "x": 115,
        "y": 533,
        "s": "V1",
        "size": 11,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 160,
        "y": 550
      },
      {
        "t": "text",
        "x": 160,
        "y": 533,
        "s": "W1",
        "size": 11,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 205,
        "y": 550
      },
      {
        "t": "text",
        "x": 205,
        "y": 533,
        "s": "PE",
        "size": 11,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 240,
        "y": 550
      },
      {
        "t": "text",
        "x": 240,
        "y": 533,
        "s": "U2",
        "size": 11,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 285,
        "y": 550
      },
      {
        "t": "text",
        "x": 285,
        "y": 533,
        "s": "V2",
        "size": 11,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 330,
        "y": 550
      },
      {
        "t": "text",
        "x": 330,
        "y": 533,
        "s": "W2",
        "size": 11,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 370,
        "y": 550
      },
      {
        "t": "text",
        "x": 370,
        "y": 533,
        "s": "PE",
        "size": 11,
        "anchor": "middle"
      },
      {
        "t": "text",
        "x": 14,
        "y": 555,
        "s": "TB2",
        "size": 13
      },
      {
        "t": "text",
        "x": 292,
        "y": 580,
        "s": "TB3",
        "size": 13
      },
      {
        "t": "wire",
        "pts": [
          [
            70,
            554
          ],
          [
            70,
            575
          ],
          [
            99,
            604
          ]
        ]
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 554,
        "x2": 115,
        "y2": 596
      },
      {
        "t": "wire",
        "pts": [
          [
            160,
            554
          ],
          [
            160,
            575
          ],
          [
            131,
            604
          ]
        ]
      },
      {
        "t": "motor",
        "x": 115,
        "y": 620,
        "s": "M1"
      },
      {
        "t": "wire",
        "pts": [
          [
            139,
            620
          ],
          [
            205,
            620
          ]
        ]
      },
      {
        "t": "dot",
        "x": 205,
        "y": 620
      },
      {
        "t": "line",
        "x1": 205,
        "y1": 554,
        "x2": 205,
        "y2": 650
      },
      {
        "t": "earth",
        "x": 205,
        "y": 650
      },
      {
        "t": "wire",
        "pts": [
          [
            240,
            554
          ],
          [
            240,
            575
          ],
          [
            269,
            604
          ]
        ]
      },
      {
        "t": "line",
        "x1": 285,
        "y1": 554,
        "x2": 285,
        "y2": 596
      },
      {
        "t": "wire",
        "pts": [
          [
            330,
            554
          ],
          [
            330,
            575
          ],
          [
            301,
            604
          ]
        ]
      },
      {
        "t": "motor",
        "x": 285,
        "y": 620,
        "s": "M2"
      },
      {
        "t": "wire",
        "pts": [
          [
            309,
            620
          ],
          [
            370,
            620
          ]
        ]
      },
      {
        "t": "dot",
        "x": 370,
        "y": 620
      },
      {
        "t": "line",
        "x1": 370,
        "y1": 554,
        "x2": 370,
        "y2": 650
      },
      {
        "t": "earth",
        "x": 370,
        "y": 650
      },
      { "t": "wire", "pts": [[395, 100], [435, 100]] },
        { "t": "dot", "x": 435, "y": 100 },
      {
        "t": "wire",
        "pts": [
          [
            385,
            700
          ],
          [
            435,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            435,
            100
          ],
          [
            510,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            510,
            100
          ],
          [
            545,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            590,
            100
          ],
          [
            760,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            760,
            100
          ],
          [
            900,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            100
          ],
          [
            1120,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1120,
            100
          ],
          [
            1450,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1450,
            100
          ],
          [
            1520,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            435,
            700
          ],
          [
            510,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            510,
            700
          ],
          [
            590,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            590,
            700
          ],
          [
            690,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            690,
            700
          ],
          [
            760,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            760,
            700
          ],
          [
            900,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            700
          ],
          [
            980,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            980,
            700
          ],
          [
            1120,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1120,
            700
          ],
          [
            1200,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1200,
            700
          ],
          [
            1280,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1280,
            700
          ],
          [
            1360,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1360,
            700
          ],
          [
            1450,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1450,
            700
          ],
          [
            1520,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            435,
            614
          ],
          [
            435,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            435,
            100
          ],
          [
            435,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            510,
            100
          ],
          [
            510,
            335
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            510,
            375
          ],
          [
            510,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            510,
            614
          ],
          [
            510,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            590,
            614
          ],
          [
            590,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            510,
            425
          ],
          [
            510,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            510,
            425
          ],
          [
            590,
            425
          ],
          [
            590,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            760,
            100
          ],
          [
            760,
            133
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            760,
            173
          ],
          [
            760,
            285
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            690,
            614
          ],
          [
            690,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            760,
            285
          ],
          [
            690,
            285
          ],
          [
            690,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            760,
            285
          ],
          [
            760,
            335
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            760,
            375
          ],
          [
            760,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            100
          ],
          [
            900,
            133
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            173
          ],
          [
            900,
            215
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            255
          ],
          [
            900,
            285
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            285
          ],
          [
            900,
            335
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            285
          ],
          [
            980,
            285
          ],
          [
            980,
            335
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            375
          ],
          [
            900,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            980,
            375
          ],
          [
            980,
            425
          ],
          [
            900,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            760,
            425
          ],
          [
            900,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            760,
            614
          ],
          [
            760,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            614
          ],
          [
            900,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            760,
            425
          ],
          [
            760,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            425
          ],
          [
            900,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1120,
            100
          ],
          [
            1120,
            215
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1120,
            255
          ],
          [
            1120,
            285
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1120,
            285
          ],
          [
            1200,
            285
          ],
          [
            1200,
            335
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1120,
            285
          ],
          [
            1280,
            285
          ],
          [
            1280,
            335
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1200,
            614
          ],
          [
            1200,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1200,
            375
          ],
          [
            1200,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1280,
            375
          ],
          [
            1280,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1280,
            425
          ],
          [
            1280,
            465
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1280,
            614
          ],
          [
            1280,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1280,
            505
          ],
          [
            1280,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1360,
            614
          ],
          [
            1360,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1280,
            425
          ],
          [
            1360,
            425
          ],
          [
            1360,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1450,
            100
          ],
          [
            1450,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1450,
            614
          ],
          [
            1450,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1450,
            195
          ],
          [
            1450,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1520,
            100
          ],
          [
            1520,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1520,
            614
          ],
          [
            1520,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1520,
            195
          ],
          [
            1520,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            696,
            596
          ],
          [
            696,
            676
          ],
          [
            715,
            676
          ],
          [
            715,
            745
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            702,
            596
          ],
          [
            702,
            664
          ],
          [
            745,
            664
          ],
          [
            745,
            745
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            708,
            596
          ],
          [
            708,
            652
          ],
          [
            775,
            652
          ],
          [
            775,
            745
          ]
        ]
      },
      {
        "t": "rect",
        "x": 701,
        "y": 735,
        "w": 90,
        "h": 20
      },
      {
        "t": "text",
        "x": 669,
        "y": 749,
        "s": "TB4",
        "size": 13
      },
      {
        "t": "term",
        "x": 715,
        "y": 745
      },
      {
        "t": "text",
        "x": 715,
        "y": 781,
        "s": "E1",
        "size": 11,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 745,
        "y": 745
      },
      {
        "t": "text",
        "x": 745,
        "y": 781,
        "s": "E2",
        "size": 11,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 775,
        "y": 745
      },
      {
        "t": "text",
        "x": 775,
        "y": 781,
        "s": "E3",
        "size": 11,
        "anchor": "middle"
      },
      {
        "t": "items"
      },
      {
        "t": "dot",
        "x": 510,
        "y": 100
      },
      {
        "t": "dot",
        "x": 760,
        "y": 100
      },
      {
        "t": "dot",
        "x": 900,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1120,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1450,
        "y": 100
      },
      {
        "t": "dot",
        "x": 510,
        "y": 700
      },
      {
        "t": "dot",
        "x": 590,
        "y": 700
      },
      {
        "t": "dot",
        "x": 690,
        "y": 700
      },
      {
        "t": "dot",
        "x": 760,
        "y": 700
      },
      {
        "t": "dot",
        "x": 900,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1200,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1280,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1360,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1450,
        "y": 700
      },
      {
        "t": "dot",
        "x": 510,
        "y": 425
      },
      {
        "t": "dot",
        "x": 760,
        "y": 285
      },
      {
        "t": "dot",
        "x": 760,
        "y": 425
      },
      {
        "t": "dot",
        "x": 900,
        "y": 285
      },
      {
        "t": "dot",
        "x": 900,
        "y": 425
      },
      {
        "t": "dot",
        "x": 1120,
        "y": 285
      },
      {
        "t": "dot",
        "x": 1280,
        "y": 425
      }
    ]
  }
};
})(typeof window === 'undefined' ? globalThis : window);
