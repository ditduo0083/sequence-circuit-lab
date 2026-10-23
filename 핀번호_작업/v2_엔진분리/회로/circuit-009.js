/* 핀번호 적기 009. 회로 앱 초안을 원본 7쪽과 대조한 데이터. 화면 선은 기존 앱 그래프 좌표로 새로 그린다. */
(function (root) {
  'use strict';
  var C = root.PIN_CIRCUITS = root.PIN_CIRCUITS || {};
  C['009'] = {
  "id": "009",
  "title": "전기기능사 009 · 핀번호 적기",
  "subject": "전기기능사",
  "source": {
    "doc": "전기기능사-009-A4, 2025-08-04.pdf",
    "legendPage": 6,
    "circuitPage": 7,
    "devicePage": 9
  },
  "app": {
    "folder": "009_순차기동_교대경보"
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
    "frYL": [
      "8",
      "6"
    ],
    "frBZ": [
      "8",
      "5"
    ],
    "xNO": [
      "1",
      "3"
    ],
    "ssA": [
      "SS",
      "A"
    ],
    "ssM": [
      "SS",
      "M"
    ],
    "flsContact": [
      "4",
      "3"
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
      "8",
      "6"
    ],
    "tMC2": [
      "8",
      "6"
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
    "coil-FR": [
      "2",
      "7"
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
    "coil-MC1": [
      "6",
      "12"
    ],
    "coil-X": [
      "2",
      "7"
    ],
    "coil-T": [
      "2",
      "7"
    ],
    "coil-MC2": [
      "6",
      "12"
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
    text: "MCCB를 투입하고 EOCR이 정상일 때 운전 b접점으로 제어 전원이 공급된다. SS를 A에 두면 FLS가 수위를 감시하고 감지 a접점이 닫힐 때 MC1이 바로 여자되어 M1·RL만 동작한다. 자동 경로에서는 X와 T가 소자되어 M2는 기동하지 않는다. SS를 M에 두고 PB1을 누르면 X와 T가 여자된다. PB1과 병렬인 X a접점이 수동 입력을 유지하고, X의 다른 a접점이 MC1을 공급하여 M1·RL이 먼저 동작한다. T 설정시간이 지나 한시 a접점이 닫히면 MC2가 추가되어 M2·GL도 동작한다. 자동 감지 해제나 수동 PB0 누름으로 각 운전을 멈춘다. 과부하로 EOCR 운전 b접점이 열리면 두 전동기가 멈추고 경보 a접점으로 FR이 여자된다. FR의 첫 구간에는 b접점으로 BZ가, 다음 구간에는 a접점으로 YL이 동작하며 경보를 번갈아 낸다.",
    verified: true
  },
  interpretQuestions: [
    {"id":"q1","prompt":"자동에서 M1을 바로 기동시키는 수위 감지 접점은?","answerItemIds":["flsContact"],"multi":false,"explain":"FLS a접점이 MC1 공급점에 직접 이어져 있어요."},
    {"id":"q2","prompt":"수동에서 PB1을 놓아도 X와 T를 유지하는 접점은?","answerItemIds":["xHold"],"multi":false,"explain":"X a접점이 PB1을 우회해요."},
    {"id":"q3","prompt":"수동에서 M1을 먼저 공급하는 X 접점은?","answerItemIds":["xNO"],"multi":false,"explain":"X의 다른 a접점이 MC1 코일로 전원을 보내요."},
    {"id":"q4","prompt":"설정시간 뒤 M2를 추가 기동하는 접점은?","answerItemIds":["tMC2"],"multi":false,"explain":"T 한시 a접점이 MC2를 여자시켜요."},
    {"id":"q5","prompt":"수동 운전을 멈추는 버튼 접점은?","answerItemIds":["pb0"],"multi":false,"explain":"PB0 b접점이 열리면 X 자기유지가 풀려요."},
    {"id":"q6","prompt":"과부하 때 운전용 전원을 끊는 접점은?","answerItemIds":["eocrNC"],"multi":false,"explain":"EOCR b접점이 열려 두 모터가 멈춰요."},
    {"id":"q7","prompt":"과부하 경보에서 FR을 여자시키는 접점은?","answerItemIds":["eocrNO"],"multi":false,"explain":"EOCR a접점이 닫혀 FR과 경보 분기에 전원을 보내요."},
    {"id":"q8","prompt":"FR 첫 구간에 BZ를 동작시키는 접점은?","answerItemIds":["frBZ"],"multi":false,"explain":"처음에는 FR b접점이 닫혀 BZ가 동작해요."},
    {"id":"q9","prompt":"FR 다음 구간에 YL을 동작시키는 접점은?","answerItemIds":["frYL"],"multi":false,"explain":"FR a접점이 닫히면 YL이 켜져요."}
  ],

  "layout": {
    "viewBox": [
      1670,
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
            "net": "n_eocrNOIn"
          },
          {
            "x": 590,
            "y": 76,
            "net": "n_mc2AuxIn"
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
          "n_eocrNOIn",
          "n_frBZIn"
        ],
        "label": "EOCR",
        "title": "EOCR 접점 (a)"
      },
      {
        "id": "frYL",
        "cat": "contact",
        "tag": "FR",
        "kind": "a",
        "feat": "fl",
        "x": 610,
        "rows": [
          465,
          505
        ],
        "nets": [
          "n_frBZIn",
          "n_YLP"
        ],
        "label": "FR",
        "title": "FR 접점 (a)"
      },
      {
        "id": "frBZ",
        "cat": "contact",
        "tag": "FR",
        "kind": "b",
        "feat": "fl",
        "x": 700,
        "rows": [
          465,
          505
        ],
        "nets": [
          "n_frBZIn",
          "n_BZP"
        ],
        "label": "FR",
        "title": "FR 접점 (b)"
      },
      {
        "id": "xNO",
        "cat": "contact",
        "tag": "X",
        "kind": "a",
        "feat": "",
        "x": 810,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_MC1P"
        ],
        "label": "X",
        "title": "X 접점 (a)"
      },
      {
        "id": "ssA",
        "cat": "ss",
        "tag": "SS",
        "kind": "a",
        "feat": "ss",
        "x": 910,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_flsContactIn"
        ],
        "label": "SS",
        "title": "SS 접점 (a)",
        "sub": "A"
      },
      {
        "id": "ssM",
        "cat": "ss",
        "tag": "SS",
        "kind": "b",
        "feat": "ss",
        "x": 1190,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_pb0In"
        ],
        "label": "SS",
        "title": "SS 접점 (a)",
        "sub": "M",
        "appKind": "a",
        "appKindNote": "원본 도면은 b접점, 회로 앱은 a접점. 핀번호 채점은 SS/M 규칙을 따른다."
      },
      {
        "id": "flsContact",
        "cat": "contact",
        "tag": "FLS",
        "kind": "a",
        "feat": "",
        "x": 910,
        "rows": [
          335,
          375
        ],
        "nets": [
          "n_flsContactIn",
          "n_MC1P"
        ],
        "label": "FLS",
        "title": "FLS 접점 (a)"
      },
      {
        "id": "pb0",
        "cat": "pb",
        "tag": "PB0",
        "kind": "b",
        "feat": "pb",
        "x": 1190,
        "rows": [
          220,
          260
        ],
        "nets": [
          "n_pb0In",
          "n_xHoldIn"
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
        "x": 1190,
        "rows": [
          335,
          375
        ],
        "nets": [
          "n_xHoldIn",
          "n_TP"
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
        "x": 1270,
        "rows": [
          335,
          375
        ],
        "nets": [
          "n_xHoldIn",
          "n_TP"
        ],
        "label": "X",
        "title": "X 접점 (a)"
      },
      {
        "id": "tMC2",
        "cat": "contact",
        "tag": "T",
        "kind": "a",
        "feat": "td",
        "x": 1370,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_MC2P"
        ],
        "label": "T",
        "title": "T 접점 (한시 a)",
        "timing": "delay"
      },
      {
        "id": "mc1Aux",
        "cat": "contact",
        "tag": "MC1",
        "kind": "a",
        "feat": "",
        "x": 1480,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
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
        "x": 1580,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
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
          "n_eocrNOIn",
          "n_r1580"
        ],
        "title": "EOCR 코일"
      },
      {
        "id": "coil-FR",
        "cat": "coil",
        "tag": "FR",
        "x": 510,
        "nets": [
          "n_frBZIn",
          "n_r1580"
        ],
        "title": "FR 코일"
      },
      {
        "id": "coil-YL",
        "cat": "lamp",
        "tag": "YL",
        "x": 610,
        "nets": [
          "n_YLP",
          "n_r1580"
        ],
        "title": "YL 램프·부저"
      },
      {
        "id": "coil-BZ",
        "cat": "lamp",
        "tag": "BZ",
        "x": 700,
        "nets": [
          "n_BZP",
          "n_r1580"
        ],
        "title": "BZ 램프·부저"
      },
      {
        "id": "coil-FLS",
        "cat": "coil",
        "tag": "FLS",
        "x": 1010,
        "nets": [
          "n_flsContactIn",
          "n_r1580"
        ],
        "title": "FLS 코일"
      },
      {
        "id": "coil-MC1",
        "cat": "coil",
        "tag": "MC1",
        "x": 910,
        "nets": [
          "n_MC1P",
          "n_r1580"
        ],
        "title": "MC1 코일"
      },
      {
        "id": "coil-X",
        "cat": "coil",
        "tag": "X",
        "x": 1190,
        "nets": [
          "n_TP",
          "n_r1580"
        ],
        "title": "X 코일"
      },
      {
        "id": "coil-T",
        "cat": "coil",
        "tag": "T",
        "x": 1270,
        "nets": [
          "n_TP",
          "n_r1580"
        ],
        "title": "T 코일"
      },
      {
        "id": "coil-MC2",
        "cat": "coil",
        "tag": "MC2",
        "x": 1370,
        "nets": [
          "n_MC2P",
          "n_r1580"
        ],
        "title": "MC2 코일"
      },
      {
        "id": "coil-RL",
        "cat": "lamp",
        "tag": "RL",
        "x": 1480,
        "nets": [
          "n_RLP",
          "n_r1580"
        ],
        "title": "RL 램프·부저"
      },
      {
        "id": "coil-GL",
        "cat": "lamp",
        "tag": "GL",
        "x": 1580,
        "nets": [
          "n_GLP",
          "n_r1580"
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
            "x": 1035,
            "y": 760
          },
          {
            "x": 1065,
            "y": 760
          },
          {
            "x": 1095,
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
      "frYL",
      "frBZ",
      "xNO",
      "ssA",
      "ssM",
      "flsContact",
      "pb0",
      "pb1",
      "xHold",
      "tMC2",
      "mc1Aux",
      "mc2Aux",
      "coil-EOCR",
      "coil-FR",
      "coil-YL",
      "coil-BZ",
      "coil-FLS",
      "coil-MC1",
      "coil-X",
      "coil-T",
      "coil-MC2",
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
            810,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            810,
            100
          ],
          [
            910,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            910,
            100
          ],
          [
            1190,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1190,
            100
          ],
          [
            1370,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1370,
            100
          ],
          [
            1480,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1480,
            100
          ],
          [
            1580,
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
            610,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            610,
            700
          ],
          [
            700,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            700,
            700
          ],
          [
            910,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            910,
            700
          ],
          [
            1010,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1010,
            700
          ],
          [
            1190,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1190,
            700
          ],
          [
            1270,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1270,
            700
          ],
          [
            1370,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1370,
            700
          ],
          [
            1480,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1480,
            700
          ],
          [
            1580,
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
            610,
            425
          ],
          [
            610,
            465
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            610,
            614
          ],
          [
            610,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            610,
            505
          ],
          [
            610,
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
            700,
            425
          ],
          [
            700,
            465
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            700,
            614
          ],
          [
            700,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            700,
            505
          ],
          [
            700,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            810,
            100
          ],
          [
            810,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            910,
            100
          ],
          [
            910,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1190,
            100
          ],
          [
            1190,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            910,
            195
          ],
          [
            910,
            285
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1010,
            614
          ],
          [
            1010,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            910,
            285
          ],
          [
            1010,
            285
          ],
          [
            1010,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            910,
            285
          ],
          [
            910,
            335
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            910,
            375
          ],
          [
            910,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            810,
            195
          ],
          [
            810,
            425
          ],
          [
            910,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            910,
            614
          ],
          [
            910,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            910,
            425
          ],
          [
            910,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1190,
            195
          ],
          [
            1190,
            220
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1190,
            260
          ],
          [
            1190,
            285
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1190,
            285
          ],
          [
            1190,
            335
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1190,
            285
          ],
          [
            1270,
            285
          ],
          [
            1270,
            335
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1190,
            375
          ],
          [
            1190,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1270,
            375
          ],
          [
            1270,
            425
          ],
          [
            1190,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1190,
            614
          ],
          [
            1190,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1270,
            614
          ],
          [
            1270,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1190,
            425
          ],
          [
            1190,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1190,
            425
          ],
          [
            1190,
            470
          ],
          [
            1270,
            470
          ],
          [
            1270,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1370,
            100
          ],
          [
            1370,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1370,
            614
          ],
          [
            1370,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1370,
            195
          ],
          [
            1370,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1480,
            100
          ],
          [
            1480,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1480,
            614
          ],
          [
            1480,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1480,
            195
          ],
          [
            1480,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1580,
            100
          ],
          [
            1580,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1580,
            614
          ],
          [
            1580,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1580,
            195
          ],
          [
            1580,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1012,
            602
          ],
          [
            1035,
            602
          ],
          [
            1035,
            745
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1014,
            591
          ],
          [
            1065,
            591
          ],
          [
            1065,
            745
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1012,
            580
          ],
          [
            1095,
            580
          ],
          [
            1095,
            745
          ]
        ]
      },
      {
        "t": "rect",
        "x": 1021,
        "y": 735,
        "w": 90,
        "h": 20
      },
      {
        "t": "text",
        "x": 989,
        "y": 749,
        "s": "TB4",
        "size": 13
      },
      {
        "t": "term",
        "x": 1035,
        "y": 745
      },
      {
        "t": "text",
        "x": 1035,
        "y": 781,
        "s": "E1",
        "size": 11,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 1065,
        "y": 745
      },
      {
        "t": "text",
        "x": 1065,
        "y": 781,
        "s": "E2",
        "size": 11,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 1095,
        "y": 745
      },
      {
        "t": "text",
        "x": 1095,
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
        "x": 810,
        "y": 100
      },
      {
        "t": "dot",
        "x": 910,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1190,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1370,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1480,
        "y": 100
      },
      {
        "t": "dot",
        "x": 510,
        "y": 700
      },
      {
        "t": "dot",
        "x": 610,
        "y": 700
      },
      {
        "t": "dot",
        "x": 700,
        "y": 700
      },
      {
        "t": "dot",
        "x": 910,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1010,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1190,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1270,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1370,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1480,
        "y": 700
      },
      {
        "t": "dot",
        "x": 510,
        "y": 425
      },
      {
        "t": "dot",
        "x": 910,
        "y": 285
      },
      {
        "t": "dot",
        "x": 910,
        "y": 425
      },
      {
        "t": "dot",
        "x": 1190,
        "y": 285
      },
      {
        "t": "dot",
        "x": 1190,
        "y": 425
      }
    ]
  }
};
})(typeof window === 'undefined' ? globalThis : window);
