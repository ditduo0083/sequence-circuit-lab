/* 핀번호 적기 008. 회로 앱 초안을 원본 7쪽과 대조한 데이터. 화면 선은 기존 앱 그래프 좌표로 새로 그린다. */
(function (root) {
  'use strict';
  var C = root.PIN_CIRCUITS = root.PIN_CIRCUITS || {};
  C['008'] = {
  "id": "008",
  "title": "전기기능사 008 · 핀번호 적기",
  "subject": "전기기능사",
  "source": {
    "doc": "전기기능사-008-A4, 2025-08-04.pdf",
    "legendPage": 6,
    "circuitPage": 7,
    "devicePage": 9
  },
  "app": {
    "folder": "008_자동표시_수동시간정지"
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
    "tHold": [
      "1",
      "3"
    ],
    "frYL": [
      "8",
      "5"
    ],
    "xNO": [
      "1",
      "3"
    ],
    "xNC": [
      "8",
      "5"
    ],
    "tStop": [
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
    "coil-BZ": [
      "1",
      "2"
    ],
    "coil-FLS": [
      "5",
      "6"
    ],
    "coil-X": [
      "2",
      "7"
    ],
    "coil-FR": [
      "2",
      "7"
    ],
    "coil-YL": [
      "1",
      "2"
    ],
    "coil-T": [
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
    text: "MCCB와 EOCR 정상 b접점으로 제어회로 전원이 공급된다. SS를 A에 두고 FLS가 감지하면 X와 FR이 여자된다. X a접점은 두 접촉기 MC1·MC2를 함께 공급하여 M1·M2와 RL·GL이 계속 동작한다. X b접점이 열린 상태라 자동 운전에서는 T가 계시하지 않는다. FR b접점은 YL의 전원을 주기적으로 바꾸어 자동 운전 표시등을 점멸시킨다. SS를 M에 두고 PB1을 누르면 T가 여자되고 T 순시 a접점이 PB1을 우회해 자기유지한다. T 한시 b접점이 닫힌 동안 두 전동기가 함께 운전하지만 설정시간이 지나 접점이 열리면 둘 다 정지한다. 그 뒤에도 T는 여자 상태라 PB1만 다시 눌러서는 재기동하지 않으며 PB0으로 T를 복귀시켜야 한다. 자동 감지 해제는 자동 운전을 멈춘다. EOCR 과부하 때에는 운전 b접점이 열려 모터와 YL이 꺼지고 경보 a접점으로 BZ만 동작한다.",
    verified: true
  },
  interpretQuestions: [
    {"id":"q1","prompt":"자동에서 X와 FR을 여자시키는 수위 감지 접점은?","answerItemIds":["flsContact"],"multi":false,"explain":"FLS a접점이 닫히면 자동 운전선이 공급돼요."},
    {"id":"q2","prompt":"자동에서 두 전동기 운전선을 공급하는 접점은?","answerItemIds":["xNO"],"multi":false,"explain":"X a접점이 MC1·MC2 공통점에 전원을 보내요."},
    {"id":"q3","prompt":"자동에서 T 코일을 끊어 시간 정지를 막는 접점은?","answerItemIds":["xNC"],"multi":false,"explain":"X b접점이 열려 T가 계시하지 않아요."},
    {"id":"q4","prompt":"자동 운전 중 YL을 점멸시키는 접점은?","answerItemIds":["frYL"],"multi":false,"explain":"FR b접점이 바뀔 때 YL 공급도 바뀌어요."},
    {"id":"q5","prompt":"수동에서 PB1을 놓아도 T를 유지하는 접점은?","answerItemIds":["tHold"],"multi":false,"explain":"T 순시 a접점이 PB1을 우회해요."},
    {"id":"q6","prompt":"수동에서 설정시간 뒤 두 모터를 정지시키는 접점은?","answerItemIds":["tStop"],"multi":false,"explain":"T 한시 b접점이 열려 MC1·MC2를 함께 끊어요."},
    {"id":"q7","prompt":"수동 시간 정지 뒤 T를 복귀시키는 버튼 접점은?","answerItemIds":["pb0"],"multi":false,"explain":"PB0 b접점을 열어 T 자기유지를 해제해요."},
    {"id":"q8","prompt":"과부하 때 정상 운전을 차단하는 접점은?","answerItemIds":["eocrNC"],"multi":false,"explain":"EOCR b접점이 열려 모터와 YL이 꺼져요."},
    {"id":"q9","prompt":"과부하 때 동작하는 경보 부하는?","answerItemIds":["coil-BZ"],"multi":false,"explain":"이 회로의 과부하 경보는 BZ만 공급해요."}
  ],

  "layout": {
    "viewBox": [
      1730,
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
        "x": 840,
        "rows": [
          133,
          173
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
        "x": 1160,
        "rows": [
          133,
          173
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
        "x": 840,
        "rows": [
          335,
          375
        ],
        "nets": [
          "n_flsContactIn",
          "n_frYLIn"
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
        "x": 1160,
        "rows": [
          215,
          255
        ],
        "nets": [
          "n_pb0In",
          "n_tHoldIn"
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
        "x": 1160,
        "rows": [
          335,
          375
        ],
        "nets": [
          "n_tHoldIn",
          "n_tStopIn"
        ],
        "label": "PB1",
        "title": "PB1 접점 (a)"
      },
      {
        "id": "tHold",
        "cat": "contact",
        "tag": "T",
        "kind": "a",
        "feat": "",
        "x": 1240,
        "rows": [
          335,
          375
        ],
        "nets": [
          "n_tHoldIn",
          "n_tStopIn"
        ],
        "label": "T",
        "title": "T 접점 (순시 a)",
        "timing": "instant"
      },
      {
        "id": "frYL",
        "cat": "contact",
        "tag": "FR",
        "kind": "b",
        "feat": "fl",
        "x": 1040,
        "rows": [
          465,
          505
        ],
        "nets": [
          "n_frYLIn",
          "n_YLP"
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
        "x": 1360,
        "rows": [
          133,
          173
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_tStopIn"
        ],
        "label": "X",
        "title": "X 접점 (a)"
      },
      {
        "id": "xNC",
        "cat": "contact",
        "tag": "X",
        "kind": "b",
        "feat": "",
        "x": 1160,
        "rows": [
          465,
          505
        ],
        "nets": [
          "n_tStopIn",
          "n_TP"
        ],
        "label": "X",
        "title": "X 접점 (b)"
      },
      {
        "id": "tStop",
        "cat": "contact",
        "tag": "T",
        "kind": "b",
        "feat": "td",
        "x": 1440,
        "rows": [
          335,
          375
        ],
        "nets": [
          "n_tStopIn",
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
        "x": 1540,
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
        "x": 1640,
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
          "n_r1640"
        ],
        "title": "EOCR 코일"
      },
      {
        "id": "coil-BZ",
        "cat": "lamp",
        "tag": "BZ",
        "x": 510,
        "nets": [
          "n_BZP",
          "n_r1640"
        ],
        "title": "BZ 램프·부저"
      },
      {
        "id": "coil-FLS",
        "cat": "coil",
        "tag": "FLS",
        "x": 720,
        "nets": [
          "n_flsContactIn",
          "n_r1640"
        ],
        "title": "FLS 코일"
      },
      {
        "id": "coil-X",
        "cat": "coil",
        "tag": "X",
        "x": 840,
        "nets": [
          "n_frYLIn",
          "n_r1640"
        ],
        "title": "X 코일"
      },
      {
        "id": "coil-FR",
        "cat": "coil",
        "tag": "FR",
        "x": 940,
        "nets": [
          "n_frYLIn",
          "n_r1640"
        ],
        "title": "FR 코일"
      },
      {
        "id": "coil-YL",
        "cat": "lamp",
        "tag": "YL",
        "x": 1040,
        "nets": [
          "n_YLP",
          "n_r1640"
        ],
        "title": "YL 램프·부저"
      },
      {
        "id": "coil-T",
        "cat": "coil",
        "tag": "T",
        "x": 1160,
        "nets": [
          "n_TP",
          "n_r1640"
        ],
        "title": "T 코일"
      },
      {
        "id": "coil-MC1",
        "cat": "coil",
        "tag": "MC1",
        "x": 1360,
        "nets": [
          "n_MC2P",
          "n_r1640"
        ],
        "title": "MC1 코일"
      },
      {
        "id": "coil-MC2",
        "cat": "coil",
        "tag": "MC2",
        "x": 1440,
        "nets": [
          "n_MC2P",
          "n_r1640"
        ],
        "title": "MC2 코일"
      },
      {
        "id": "coil-RL",
        "cat": "lamp",
        "tag": "RL",
        "x": 1540,
        "nets": [
          "n_RLP",
          "n_r1640"
        ],
        "title": "RL 램프·부저"
      },
      {
        "id": "coil-GL",
        "cat": "lamp",
        "tag": "GL",
        "x": 1640,
        "nets": [
          "n_GLP",
          "n_r1640"
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
            "x": 745,
            "y": 760
          },
          {
            "x": 775,
            "y": 760
          },
          {
            "x": 805,
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
      "ssM",
      "flsContact",
      "pb0",
      "pb1",
      "tHold",
      "frYL",
      "xNO",
      "xNC",
      "tStop",
      "mc1Aux",
      "mc2Aux",
      "coil-EOCR",
      "coil-BZ",
      "coil-FLS",
      "coil-X",
      "coil-FR",
      "coil-YL",
      "coil-T",
      "coil-MC1",
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
            840,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            840,
            100
          ],
          [
            1160,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1160,
            100
          ],
          [
            1360,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1360,
            100
          ],
          [
            1540,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1540,
            100
          ],
          [
            1640,
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
            720,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            720,
            700
          ],
          [
            840,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            840,
            700
          ],
          [
            940,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            940,
            700
          ],
          [
            1040,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1040,
            700
          ],
          [
            1160,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1160,
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
            1440,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1440,
            700
          ],
          [
            1540,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1540,
            700
          ],
          [
            1640,
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
            840,
            100
          ],
          [
            840,
            133
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1160,
            100
          ],
          [
            1160,
            133
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            840,
            173
          ],
          [
            840,
            285
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            720,
            614
          ],
          [
            720,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            840,
            285
          ],
          [
            720,
            285
          ],
          [
            720,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            840,
            285
          ],
          [
            840,
            285
          ],
          [
            840,
            335
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1160,
            173
          ],
          [
            1160,
            215
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1160,
            255
          ],
          [
            1160,
            285
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1160,
            285
          ],
          [
            1160,
            335
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1160,
            285
          ],
          [
            1240,
            285
          ],
          [
            1240,
            335
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1160,
            375
          ],
          [
            1160,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1240,
            375
          ],
          [
            1240,
            425
          ],
          [
            1160,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            840,
            375
          ],
          [
            840,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            840,
            425
          ],
          [
            940,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            840,
            614
          ],
          [
            840,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            940,
            614
          ],
          [
            940,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            840,
            425
          ],
          [
            840,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            940,
            425
          ],
          [
            940,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            940,
            425
          ],
          [
            1040,
            425
          ],
          [
            1040,
            465
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1040,
            614
          ],
          [
            1040,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1040,
            505
          ],
          [
            1040,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1360,
            100
          ],
          [
            1360,
            133
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1360,
            173
          ],
          [
            1360,
            285
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1360,
            285
          ],
          [
            1360,
            425
          ],
          [
            1160,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1160,
            425
          ],
          [
            1160,
            465
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1160,
            614
          ],
          [
            1160,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1160,
            505
          ],
          [
            1160,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1360,
            285
          ],
          [
            1440,
            285
          ],
          [
            1440,
            335
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1440,
            375
          ],
          [
            1440,
            480
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
            1440,
            614
          ],
          [
            1440,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1440,
            480
          ],
          [
            1360,
            480
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
            1440,
            480
          ],
          [
            1440,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1540,
            100
          ],
          [
            1540,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1540,
            614
          ],
          [
            1540,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1540,
            195
          ],
          [
            1540,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1640,
            100
          ],
          [
            1640,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1640,
            614
          ],
          [
            1640,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1640,
            195
          ],
          [
            1640,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            722,
            602
          ],
          [
            745,
            602
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
            724,
            591
          ],
          [
            775,
            591
          ],
          [
            775,
            745
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            722,
            580
          ],
          [
            785,
            580
          ],
          [
            785,
            652
          ],
          [
            805,
            652
          ],
          [
            805,
            745
          ]
        ]
      },
      {
        "t": "rect",
        "x": 731,
        "y": 735,
        "w": 90,
        "h": 20
      },
      {
        "t": "text",
        "x": 699,
        "y": 749,
        "s": "TB4",
        "size": 13
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
        "s": "E1",
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
        "s": "E2",
        "size": 11,
        "anchor": "middle"
      },
      {
        "t": "term",
        "x": 805,
        "y": 745
      },
      {
        "t": "text",
        "x": 805,
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
        "x": 840,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1160,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1360,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1540,
        "y": 100
      },
      {
        "t": "dot",
        "x": 510,
        "y": 700
      },
      {
        "t": "dot",
        "x": 720,
        "y": 700
      },
      {
        "t": "dot",
        "x": 840,
        "y": 700
      },
      {
        "t": "dot",
        "x": 940,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1040,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1160,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1360,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1440,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1540,
        "y": 700
      },
      {
        "t": "dot",
        "x": 840,
        "y": 285
      },
      {
        "t": "dot",
        "x": 1160,
        "y": 285
      },
      {
        "t": "dot",
        "x": 1160,
        "y": 425
      },
      {
        "t": "dot",
        "x": 840,
        "y": 425
      },
      {
        "t": "dot",
        "x": 940,
        "y": 425
      },
      {
        "t": "dot",
        "x": 1360,
        "y": 285
      },
      {
        "t": "dot",
        "x": 1440,
        "y": 480
      }
    ]
  }
};
})(typeof window === 'undefined' ? globalThis : window);
