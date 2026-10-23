/* 핀번호 적기 018. 회로 앱 초안을 원본 7쪽과 대조한 데이터. 화면 선은 기존 앱 그래프 좌표로 새로 그린다. */
(function (root) {
  'use strict';
  var C = root.PIN_CIRCUITS = root.PIN_CIRCUITS || {};
  C['018'] = {
  "id": "018",
  "title": "전기기능사 018 · 핀번호 적기",
  "subject": "전기기능사",
  "source": {
    "doc": "전기기능사-018-A4, 2025-08-04.pdf",
    "legendPage": 6,
    "circuitPage": 7,
    "devicePage": 9
  },
  "app": {
    "folder": "018_상반조건_타이머자기유지"
  },
  "devices": {
    "EOCR": {
      "type": "eocr-12p"
    },
    "GL": {
      "type": null,
      "cat": "lamp"
    },
    "LS1": {
      "type": "ls-2p"
    },
    "LS2": {
      "type": "ls-2p"
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
    "PB2": {
      "type": null,
      "cat": "pb"
    },
    "RL": {
      "type": null,
      "cat": "lamp"
    },
    "T1": {
      "type": "timer-8p"
    },
    "T2": {
      "type": "timer-8p"
    },
    "WL": {
      "type": null,
      "cat": "lamp"
    },
    "X1": {
      "type": "relay-8p"
    },
    "X2": {
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
    "pb0": [
      "N",
      "C"
    ],
    "eocrNO": [
      "10",
      "5"
    ],
    "ls1": [
      "1",
      "2"
    ],
    "ls2": [
      "1",
      "2"
    ],
    "pb1": [
      "N",
      "O"
    ],
    "x1Gate1": [
      "1",
      "3"
    ],
    "x2Gate1": [
      "1",
      "4"
    ],
    "t1Hold": [
      "1",
      "3"
    ],
    "mc1Aux": [
      "4",
      "10"
    ],
    "pb2": [
      "N",
      "O"
    ],
    "x1Gate2": [
      "8",
      "5"
    ],
    "x2Gate2": [
      "8",
      "6"
    ],
    "t2Hold": [
      "1",
      "3"
    ],
    "mc2Aux": [
      "4",
      "10"
    ],
    "t1Lamp": [
      "8",
      "6"
    ],
    "t2Lamp": [
      "8",
      "6"
    ],
    "coil-EOCR": [
      "6",
      "12"
    ],
    "coil-YL": [
      "1",
      "2"
    ],
    "coil-X1": [
      "2",
      "7"
    ],
    "coil-X2": [
      "2",
      "7"
    ],
    "coil-MC1": [
      "6",
      "12"
    ],
    "coil-T1": [
      "2",
      "7"
    ],
    "coil-RL": [
      "1",
      "2"
    ],
    "coil-MC2": [
      "6",
      "12"
    ],
    "coil-T2": [
      "2",
      "7"
    ],
    "coil-GL": [
      "1",
      "2"
    ],
    "coil-WL": [
      "1",
      "2"
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
    text: "MCCB를 투입하고 EOCR이 정상일 때 PB0 뒤에 운전 전원이 공급된다. LS1과 LS2가 감지되면 각각 X1과 X2가 여자된다. LS1만 감지된 상태에서 PB1을 누르면 X1 a접점과 X2 b접점이 직렬로 닫혀 MC1과 T1이 함께 여자되고 M1·RL이 동작한다. T1 순시 a접점은 PB1과 최초 감지 조건 전체를 우회하므로 기동 뒤 LS 상태가 달라져도 1번 계통이 유지된다. 반대로 LS2만 감지된 상태에서 PB2를 누르면 X1 b접점과 X2 a접점을 지나 MC2·T2가 여자되어 M2·GL이 동작한다. T2 순시 a접점도 최초 기동 조건 전체를 우회하여 2번 계통을 유지한다. 두 계통의 최초 기동 조건은 서로 반대지만, 한 번 유지가 성립한 뒤에는 두 모터를 차례로 함께 운전할 수 있다. T1 또는 T2의 설정시간이 지나면 해당 한시 a접점이 닫혀 WL이 켜지고, 모터 운전은 계속된다. PB0을 누르면 두 자기유지가 해제된다. EOCR 과부하 때 운전 b접점이 열려 모터가 멈추고 경보 a접점으로 YL이 켜진다.",
    verified: true
  },
  interpretQuestions: [
    {"id":"q1","prompt":"LS1 감지에 따라 X1을 여자시키는 접점은?","answerItemIds":["ls1"],"multi":false,"explain":"LS1 a접점이 X1 코일에 전원을 보내요."},
    {"id":"q2","prompt":"LS2 감지에 따라 X2를 여자시키는 접점은?","answerItemIds":["ls2"],"multi":false,"explain":"LS2 a접점이 X2 코일에 전원을 보내요."},
    {"id":"q3","prompt":"LS1만 감지한 때 PB1과 함께 M1 최초 기동을 허가하는 접점들은?","answerItemIds":["x1Gate1","x2Gate1"],"multi":true,"explain":"X1 a와 X2 b가 직렬로 닫혀 있어야 해요."},
    {"id":"q4","prompt":"M1 기동 뒤 PB1과 감지 조건 전체를 우회하는 접점은?","answerItemIds":["t1Hold"],"multi":false,"explain":"T1 순시 a접점이 독립적인 유지 경로를 만들어요."},
    {"id":"q5","prompt":"LS2만 감지한 때 PB2와 함께 M2 최초 기동을 허가하는 접점들은?","answerItemIds":["x1Gate2","x2Gate2"],"multi":true,"explain":"X1 b와 X2 a가 직렬로 닫혀 있어야 해요."},
    {"id":"q6","prompt":"M2 기동 뒤 PB2와 감지 조건 전체를 우회하는 접점은?","answerItemIds":["t2Hold"],"multi":false,"explain":"T2 순시 a접점이 2번 계통을 유지해요."},
    {"id":"q7","prompt":"어느 타이머든 설정시간이 지나면 WL을 켜는 접점들을 모두 고르세요.","answerItemIds":["t1Lamp","t2Lamp"],"multi":true,"explain":"T1·T2 한시 a접점이 병렬로 WL을 공급해요."},
    {"id":"q8","prompt":"두 계통의 자기유지를 함께 해제하는 접점은?","answerItemIds":["pb0"],"multi":false,"explain":"PB0 b접점이 공통 운전선을 끊어요."},
    {"id":"q9","prompt":"과부하 때 경보 YL에 전원을 보내는 접점은?","answerItemIds":["eocrNO"],"multi":false,"explain":"EOCR a접점이 닫혀 YL이 켜져요."}
  ],

  "layout": {
    "viewBox": [
      1920,
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
            "net": "n_stopIn"
          }
        ]
      },
      {
        "id": "pb0",
        "cat": "pb",
        "tag": "PB0",
        "kind": "b",
        "feat": "pb",
        "label": "PB0",
        "title": "PB0 접점 (b)",
        "horiz": true,
        "x1": 630,
        "x2": 680,
        "y": 100,
        "slots": [
          {
            "x": 630,
            "y": 76,
            "net": "n_stopIn"
          },
          {
            "x": 680,
            "y": 76,
            "net": "n_t2LampIn"
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
          465,
          505
        ],
        "nets": [
          "n_eocrNOIn",
          "n_YLP"
        ],
        "label": "EOCR",
        "title": "EOCR 접점 (a)"
      },
      {
        "id": "ls1",
        "cat": "contact",
        "tag": "LS1",
        "kind": "a",
        "feat": "ls",
        "x": 700,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_t2LampIn",
          "n_X1P"
        ],
        "label": "LS1",
        "title": "LS1 접점 (a)"
      },
      {
        "id": "ls2",
        "cat": "contact",
        "tag": "LS2",
        "kind": "a",
        "feat": "ls",
        "x": 790,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_t2LampIn",
          "n_X2P"
        ],
        "label": "LS2",
        "title": "LS2 접점 (a)"
      },
      {
        "id": "pb1",
        "cat": "pb",
        "tag": "PB1",
        "kind": "a",
        "feat": "pb",
        "x": 900,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_t2LampIn",
          "n_x1Gate1In"
        ],
        "label": "PB1",
        "title": "PB1 접점 (a)"
      },
      {
        "id": "x1Gate1",
        "cat": "contact",
        "tag": "X1",
        "kind": "a",
        "feat": "",
        "x": 900,
        "rows": [
          225,
          265
        ],
        "nets": [
          "n_x1Gate1In",
          "n_x2Gate1In"
        ],
        "label": "X1",
        "title": "X1 접점 (a)"
      },
      {
        "id": "x2Gate1",
        "cat": "contact",
        "tag": "X2",
        "kind": "b",
        "feat": "",
        "x": 900,
        "rows": [
          295,
          335
        ],
        "nets": [
          "n_x2Gate1In",
          "n_T1P"
        ],
        "label": "X2",
        "title": "X2 접점 (b)"
      },
      {
        "id": "t1Hold",
        "cat": "contact",
        "tag": "T1",
        "kind": "a",
        "feat": "",
        "x": 1110,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_t2LampIn",
          "n_T1P"
        ],
        "label": "T1",
        "title": "T1 접점 (순시 a)",
        "timing": "instant"
      },
      {
        "id": "mc1Aux",
        "cat": "contact",
        "tag": "MC1",
        "kind": "a",
        "feat": "",
        "x": 1210,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_t2LampIn",
          "n_RLP"
        ],
        "label": "MC1",
        "title": "MC1 접점 (a)"
      },
      {
        "id": "pb2",
        "cat": "pb",
        "tag": "PB2",
        "kind": "a",
        "feat": "pb",
        "x": 1320,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_t2LampIn",
          "n_x1Gate2In"
        ],
        "label": "PB2",
        "title": "PB2 접점 (a)"
      },
      {
        "id": "x1Gate2",
        "cat": "contact",
        "tag": "X1",
        "kind": "b",
        "feat": "",
        "x": 1320,
        "rows": [
          225,
          265
        ],
        "nets": [
          "n_x1Gate2In",
          "n_x2Gate2In"
        ],
        "label": "X1",
        "title": "X1 접점 (b)"
      },
      {
        "id": "x2Gate2",
        "cat": "contact",
        "tag": "X2",
        "kind": "a",
        "feat": "",
        "x": 1320,
        "rows": [
          295,
          335
        ],
        "nets": [
          "n_x2Gate2In",
          "n_T2P"
        ],
        "label": "X2",
        "title": "X2 접점 (a)"
      },
      {
        "id": "t2Hold",
        "cat": "contact",
        "tag": "T2",
        "kind": "a",
        "feat": "",
        "x": 1530,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_t2LampIn",
          "n_T2P"
        ],
        "label": "T2",
        "title": "T2 접점 (순시 a)",
        "timing": "instant"
      },
      {
        "id": "mc2Aux",
        "cat": "contact",
        "tag": "MC2",
        "kind": "a",
        "feat": "",
        "x": 1630,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_t2LampIn",
          "n_GLP"
        ],
        "label": "MC2",
        "title": "MC2 접점 (a)"
      },
      {
        "id": "t1Lamp",
        "cat": "contact",
        "tag": "T1",
        "kind": "a",
        "feat": "td",
        "x": 1730,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_t2LampIn",
          "n_WLP"
        ],
        "label": "T1",
        "title": "T1 접점 (한시 a)",
        "timing": "delay"
      },
      {
        "id": "t2Lamp",
        "cat": "contact",
        "tag": "T2",
        "kind": "a",
        "feat": "td",
        "x": 1830,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_t2LampIn",
          "n_WLP"
        ],
        "label": "T2",
        "title": "T2 접점 (한시 a)",
        "timing": "delay"
      },
      {
        "id": "coil-EOCR",
        "cat": "coil",
        "tag": "EOCR",
        "x": 435,
        "nets": [
          "n_eocrNOIn",
          "n_r1830"
        ],
        "title": "EOCR 코일"
      },
      {
        "id": "coil-YL",
        "cat": "lamp",
        "tag": "YL",
        "x": 510,
        "nets": [
          "n_YLP",
          "n_r1830"
        ],
        "title": "YL 램프·부저"
      },
      {
        "id": "coil-X1",
        "cat": "coil",
        "tag": "X1",
        "x": 700,
        "nets": [
          "n_X1P",
          "n_r1830"
        ],
        "title": "X1 코일"
      },
      {
        "id": "coil-X2",
        "cat": "coil",
        "tag": "X2",
        "x": 790,
        "nets": [
          "n_X2P",
          "n_r1830"
        ],
        "title": "X2 코일"
      },
      {
        "id": "coil-MC1",
        "cat": "coil",
        "tag": "MC1",
        "x": 900,
        "nets": [
          "n_T1P",
          "n_r1830"
        ],
        "title": "MC1 코일"
      },
      {
        "id": "coil-T1",
        "cat": "coil",
        "tag": "T1",
        "x": 1000,
        "nets": [
          "n_T1P",
          "n_r1830"
        ],
        "title": "T1 코일"
      },
      {
        "id": "coil-RL",
        "cat": "lamp",
        "tag": "RL",
        "x": 1210,
        "nets": [
          "n_RLP",
          "n_r1830"
        ],
        "title": "RL 램프·부저"
      },
      {
        "id": "coil-MC2",
        "cat": "coil",
        "tag": "MC2",
        "x": 1320,
        "nets": [
          "n_T2P",
          "n_r1830"
        ],
        "title": "MC2 코일"
      },
      {
        "id": "coil-T2",
        "cat": "coil",
        "tag": "T2",
        "x": 1420,
        "nets": [
          "n_T2P",
          "n_r1830"
        ],
        "title": "T2 코일"
      },
      {
        "id": "coil-GL",
        "cat": "lamp",
        "tag": "GL",
        "x": 1630,
        "nets": [
          "n_GLP",
          "n_r1830"
        ],
        "title": "GL 램프·부저"
      },
      {
        "id": "coil-WL",
        "cat": "lamp",
        "tag": "WL",
        "x": 1730,
        "nets": [
          "n_WLP",
          "n_r1830"
        ],
        "title": "WL 램프·부저"
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
      "pb0",
      "eocrNO",
      "ls1",
      "ls2",
      "pb1",
      "x1Gate1",
      "x2Gate1",
      "t1Hold",
      "mc1Aux",
      "pb2",
      "x1Gate2",
      "x2Gate2",
      "t2Hold",
      "mc2Aux",
      "t1Lamp",
      "t2Lamp",
      "coil-EOCR",
      "coil-YL",
      "coil-X1",
      "coil-X2",
      "coil-MC1",
      "coil-T1",
      "coil-RL",
      "coil-MC2",
      "coil-T2",
      "coil-GL",
      "coil-WL"
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
            630,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            680,
            100
          ],
          [
            700,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            700,
            100
          ],
          [
            790,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            790,
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
            1110,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1110,
            100
          ],
          [
            1210,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1210,
            100
          ],
          [
            1320,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1320,
            100
          ],
          [
            1530,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1530,
            100
          ],
          [
            1630,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1630,
            100
          ],
          [
            1730,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1730,
            100
          ],
          [
            1830,
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
            790,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            790,
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
            1000,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1000,
            700
          ],
          [
            1110,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1110,
            700
          ],
          [
            1210,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1210,
            700
          ],
          [
            1320,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1320,
            700
          ],
          [
            1420,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1420,
            700
          ],
          [
            1530,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1530,
            700
          ],
          [
            1630,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1630,
            700
          ],
          [
            1730,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1730,
            700
          ],
          [
            1830,
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
            465
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
            505
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
            700,
            100
          ],
          [
            700,
            155
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
            195
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
            790,
            100
          ],
          [
            790,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            790,
            614
          ],
          [
            790,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            790,
            195
          ],
          [
            790,
            566
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
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            195
          ],
          [
            900,
            225
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            265
          ],
          [
            900,
            295
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            335
          ],
          [
            900,
            390
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1110,
            100
          ],
          [
            1110,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1110,
            195
          ],
          [
            1110,
            390
          ],
          [
            900,
            390
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            390
          ],
          [
            900,
            490
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
            1000,
            614
          ],
          [
            1000,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            490
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
            900,
            490
          ],
          [
            1000,
            490
          ],
          [
            1000,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1210,
            100
          ],
          [
            1210,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1210,
            614
          ],
          [
            1210,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1210,
            195
          ],
          [
            1210,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1320,
            100
          ],
          [
            1320,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1320,
            195
          ],
          [
            1320,
            225
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1320,
            265
          ],
          [
            1320,
            295
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1320,
            335
          ],
          [
            1320,
            390
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1530,
            100
          ],
          [
            1530,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1530,
            195
          ],
          [
            1530,
            390
          ],
          [
            1320,
            390
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1320,
            390
          ],
          [
            1320,
            490
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1320,
            614
          ],
          [
            1320,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1420,
            614
          ],
          [
            1420,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1320,
            490
          ],
          [
            1320,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1320,
            490
          ],
          [
            1420,
            490
          ],
          [
            1420,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1630,
            100
          ],
          [
            1630,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1630,
            614
          ],
          [
            1630,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1630,
            195
          ],
          [
            1630,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1730,
            100
          ],
          [
            1730,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1730,
            195
          ],
          [
            1730,
            300
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1830,
            100
          ],
          [
            1830,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1830,
            195
          ],
          [
            1830,
            300
          ],
          [
            1730,
            300
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1730,
            614
          ],
          [
            1730,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1730,
            300
          ],
          [
            1730,
            566
          ]
        ]
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
        "x": 700,
        "y": 100
      },
      {
        "t": "dot",
        "x": 790,
        "y": 100
      },
      {
        "t": "dot",
        "x": 900,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1110,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1210,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1320,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1530,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1630,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1730,
        "y": 100
      },
      {
        "t": "dot",
        "x": 510,
        "y": 700
      },
      {
        "t": "dot",
        "x": 700,
        "y": 700
      },
      {
        "t": "dot",
        "x": 790,
        "y": 700
      },
      {
        "t": "dot",
        "x": 900,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1000,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1210,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1320,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1420,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1630,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1730,
        "y": 700
      },
      {
        "t": "dot",
        "x": 900,
        "y": 390
      },
      {
        "t": "dot",
        "x": 900,
        "y": 490
      },
      {
        "t": "dot",
        "x": 1320,
        "y": 390
      },
      {
        "t": "dot",
        "x": 1320,
        "y": 490
      },
      {
        "t": "dot",
        "x": 1730,
        "y": 300
      }
    ]
  }
};
})(typeof window === 'undefined' ? globalThis : window);
