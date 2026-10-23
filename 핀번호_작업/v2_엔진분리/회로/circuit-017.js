/* 핀번호 적기 017. 회로 앱 초안을 원본 7쪽과 대조한 데이터. 화면 선은 기존 앱 그래프 좌표로 새로 그린다. */
(function (root) {
  'use strict';
  var C = root.PIN_CIRCUITS = root.PIN_CIRCUITS || {};
  C['017'] = {
  "id": "017",
  "title": "전기기능사 017 · 핀번호 적기",
  "subject": "전기기능사",
  "source": {
    "doc": "전기기능사-017-A4, 2025-08-04.pdf",
    "legendPage": 6,
    "circuitPage": 7,
    "devicePage": 9
  },
  "app": {
    "folder": "017_XOR_T1허가_T2표시전환"
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
    "t1Hold": [
      "1",
      "3"
    ],
    "x1A": [
      "1",
      "3"
    ],
    "x2B": [
      "1",
      "4"
    ],
    "x1B": [
      "8",
      "5"
    ],
    "x2A": [
      "8",
      "6"
    ],
    "mc1Aux": [
      "4",
      "10"
    ],
    "pb2": [
      "N",
      "O"
    ],
    "t2Hold": [
      "1",
      "3"
    ],
    "t1Enable": [
      "8",
      "6"
    ],
    "t2Motor": [
      "8",
      "5"
    ],
    "t2Lamp": [
      "8",
      "6"
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
    "coil-WL": [
      "1",
      "2"
    ],
    "coil-T2": [
      "2",
      "7"
    ],
    "coil-GL": [
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
    text: "MCCB 투입과 EOCR 정상 상태에서 PB0 뒤의 운전선이 준비된다. LS1과 LS2가 감지되면 각각 X1과 X2가 여자된다. PB1을 누르고 두 감지 상태가 서로 다르면 X1 a·X2 b 직렬 경로 또는 X1 b·X2 a 직렬 경로 중 하나가 닫혀 MC1과 T1이 함께 여자된다. T1 순시 a접점은 PB1만 우회하므로 감지 상태가 같아지면 M1·RL과 T1은 즉시 멈춘다. 서로 다른 감지 조건이 유지되는 동안 T1이 계시하고 설정시간 뒤 한시 a접점이 M2 계통을 허가한다. 허가된 상태에서 PB2를 누르면 T2가 여자되고 T2 순시 a접점이 PB2를 우회한다. T2 한시 b접점이 닫힌 동안 MC2·M2·GL이 동작한다. T2 설정시간 뒤 b접점이 열려 M2·GL은 꺼지고 한시 a접점이 닫혀 WL이 켜진다. PB0은 두 계통을 공통으로 정지시키고, EOCR 과부하 때 정상 운전이 끊기며 경보 YL이 켜진다.",
    verified: true
  },
  interpretQuestions: [
    {"id":"q1","prompt":"LS1 감지 상태를 X1 코일에 전달하는 접점은?","answerItemIds":["ls1"],"multi":false,"explain":"LS1 a접점이 X1을 여자시켜요."},
    {"id":"q2","prompt":"LS2 감지 상태를 X2 코일에 전달하는 접점은?","answerItemIds":["ls2"],"multi":false,"explain":"LS2 a접점이 X2를 여자시켜요."},
    {"id":"q3","prompt":"LS1만 감지한 때 M1 경로를 이루는 직렬 접점들을 모두 고르세요.","answerItemIds":["x1A","x2B"],"multi":true,"explain":"X1 a는 닫히고 X2 b는 닫힌 채여서 이 분기가 통해요."},
    {"id":"q4","prompt":"LS2만 감지한 때 M1 경로를 이루는 직렬 접점들을 모두 고르세요.","answerItemIds":["x1B","x2A"],"multi":true,"explain":"X1 b와 X2 a가 닫혀 반대 분기가 통해요."},
    {"id":"q5","prompt":"PB1을 놓은 뒤에도 조건이 맞으면 M1·T1을 유지하는 접점은?","answerItemIds":["t1Hold"],"multi":false,"explain":"T1 순시 a접점은 PB1만 우회해요."},
    {"id":"q6","prompt":"T1 설정시간 뒤 M2 계통을 허가하는 접점은?","answerItemIds":["t1Enable"],"multi":false,"explain":"T1 한시 a접점이 닫혀 T2 경로를 열어 줘요."},
    {"id":"q7","prompt":"PB2를 놓아도 T2를 유지하는 접점은?","answerItemIds":["t2Hold"],"multi":false,"explain":"T2 순시 a접점이 PB2와 병렬이에요."},
    {"id":"q8","prompt":"T2 완료 때 M2를 끄고 WL을 켜는 접점들을 모두 고르세요.","answerItemIds":["t2Motor","t2Lamp"],"multi":true,"explain":"T2 한시 b접점은 열리고 a접점은 닫혀요."},
    {"id":"q9","prompt":"공통 운전선을 정지시키는 버튼 접점은?","answerItemIds":["pb0"],"multi":false,"explain":"PB0 b접점이 열리면 두 계통이 복귀해요."}
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
          "n_mc2AuxIn",
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
        "x": 800,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
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
          "n_mc2AuxIn",
          "n_x1BIn"
        ],
        "label": "PB1",
        "title": "PB1 접점 (a)"
      },
      {
        "id": "t1Hold",
        "cat": "contact",
        "tag": "T1",
        "kind": "a",
        "feat": "",
        "x": 1010,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_x1BIn"
        ],
        "label": "T1",
        "title": "T1 접점 (순시 a)",
        "timing": "instant"
      },
      {
        "id": "x1A",
        "cat": "contact",
        "tag": "X1",
        "kind": "a",
        "feat": "",
        "x": 900,
        "rows": [
          330,
          370
        ],
        "nets": [
          "n_x1BIn",
          "n_x2BIn"
        ],
        "label": "X1",
        "title": "X1 접점 (a)"
      },
      {
        "id": "x2B",
        "cat": "contact",
        "tag": "X2",
        "kind": "b",
        "feat": "",
        "x": 900,
        "rows": [
          405,
          445
        ],
        "nets": [
          "n_x2BIn",
          "n_T1P"
        ],
        "label": "X2",
        "title": "X2 접점 (b)"
      },
      {
        "id": "x1B",
        "cat": "contact",
        "tag": "X1",
        "kind": "b",
        "feat": "",
        "x": 1010,
        "rows": [
          330,
          370
        ],
        "nets": [
          "n_x1BIn",
          "n_x2AIn"
        ],
        "label": "X1",
        "title": "X1 접점 (b)"
      },
      {
        "id": "x2A",
        "cat": "contact",
        "tag": "X2",
        "kind": "a",
        "feat": "",
        "x": 1010,
        "rows": [
          405,
          445
        ],
        "nets": [
          "n_x2AIn",
          "n_T1P"
        ],
        "label": "X2",
        "title": "X2 접점 (a)"
      },
      {
        "id": "mc1Aux",
        "cat": "contact",
        "tag": "MC1",
        "kind": "a",
        "feat": "",
        "x": 1120,
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
        "id": "pb2",
        "cat": "pb",
        "tag": "PB2",
        "kind": "a",
        "feat": "pb",
        "x": 1220,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_t1EnableIn"
        ],
        "label": "PB2",
        "title": "PB2 접점 (a)"
      },
      {
        "id": "t2Hold",
        "cat": "contact",
        "tag": "T2",
        "kind": "a",
        "feat": "",
        "x": 1330,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_t1EnableIn"
        ],
        "label": "T2",
        "title": "T2 접점 (순시 a)",
        "timing": "instant"
      },
      {
        "id": "t1Enable",
        "cat": "contact",
        "tag": "T1",
        "kind": "a",
        "feat": "td",
        "x": 1220,
        "rows": [
          335,
          375
        ],
        "nets": [
          "n_t1EnableIn",
          "n_T2P"
        ],
        "label": "T1",
        "title": "T1 접점 (한시 a)",
        "timing": "delay"
      },
      {
        "id": "t2Motor",
        "cat": "contact",
        "tag": "T2",
        "kind": "b",
        "feat": "td",
        "x": 1220,
        "rows": [
          445,
          485
        ],
        "nets": [
          "n_T2P",
          "n_MC2P"
        ],
        "label": "T2",
        "title": "T2 접점 (한시 b)",
        "timing": "delay"
      },
      {
        "id": "t2Lamp",
        "cat": "contact",
        "tag": "T2",
        "kind": "a",
        "feat": "td",
        "x": 1330,
        "rows": [
          445,
          485
        ],
        "nets": [
          "n_T2P",
          "n_WLP"
        ],
        "label": "T2",
        "title": "T2 접점 (한시 a)",
        "timing": "delay"
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
        "id": "coil-YL",
        "cat": "lamp",
        "tag": "YL",
        "x": 510,
        "nets": [
          "n_YLP",
          "n_r1640"
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
          "n_r1640"
        ],
        "title": "X1 코일"
      },
      {
        "id": "coil-X2",
        "cat": "coil",
        "tag": "X2",
        "x": 800,
        "nets": [
          "n_X2P",
          "n_r1640"
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
          "n_r1640"
        ],
        "title": "MC1 코일"
      },
      {
        "id": "coil-T1",
        "cat": "coil",
        "tag": "T1",
        "x": 1010,
        "nets": [
          "n_T1P",
          "n_r1640"
        ],
        "title": "T1 코일"
      },
      {
        "id": "coil-RL",
        "cat": "lamp",
        "tag": "RL",
        "x": 1120,
        "nets": [
          "n_RLP",
          "n_r1640"
        ],
        "title": "RL 램프·부저"
      },
      {
        "id": "coil-MC2",
        "cat": "coil",
        "tag": "MC2",
        "x": 1220,
        "nets": [
          "n_MC2P",
          "n_r1640"
        ],
        "title": "MC2 코일"
      },
      {
        "id": "coil-WL",
        "cat": "lamp",
        "tag": "WL",
        "x": 1330,
        "nets": [
          "n_WLP",
          "n_r1640"
        ],
        "title": "WL 램프·부저"
      },
      {
        "id": "coil-T2",
        "cat": "coil",
        "tag": "T2",
        "x": 1440,
        "nets": [
          "n_T2P",
          "n_r1640"
        ],
        "title": "T2 코일"
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
      "t1Hold",
      "x1A",
      "x2B",
      "x1B",
      "x2A",
      "mc1Aux",
      "pb2",
      "t2Hold",
      "t1Enable",
      "t2Motor",
      "t2Lamp",
      "mc2Aux",
      "coil-EOCR",
      "coil-YL",
      "coil-X1",
      "coil-X2",
      "coil-MC1",
      "coil-T1",
      "coil-RL",
      "coil-MC2",
      "coil-WL",
      "coil-T2",
      "coil-GL"
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
            800,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            800,
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
            1010,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1010,
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
            1220,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1220,
            100
          ],
          [
            1330,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1330,
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
            800,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            800,
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
            1220,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1220,
            700
          ],
          [
            1330,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1330,
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
            800,
            100
          ],
          [
            800,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            800,
            614
          ],
          [
            800,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            800,
            195
          ],
          [
            800,
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
            300
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1010,
            100
          ],
          [
            1010,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1010,
            195
          ],
          [
            1010,
            300
          ],
          [
            900,
            300
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            300
          ],
          [
            900,
            330
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            370
          ],
          [
            900,
            405
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            300
          ],
          [
            1010,
            300
          ],
          [
            1010,
            330
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1010,
            370
          ],
          [
            1010,
            405
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            900,
            445
          ],
          [
            900,
            500
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1010,
            445
          ],
          [
            1010,
            500
          ],
          [
            900,
            500
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
            900,
            500
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
            500
          ],
          [
            1010,
            500
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
            1120,
            100
          ],
          [
            1120,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1120,
            614
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
            195
          ],
          [
            1120,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1220,
            100
          ],
          [
            1220,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1220,
            195
          ],
          [
            1220,
            300
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1330,
            100
          ],
          [
            1330,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1330,
            195
          ],
          [
            1330,
            300
          ],
          [
            1220,
            300
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1220,
            300
          ],
          [
            1220,
            335
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1220,
            375
          ],
          [
            1220,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1220,
            425
          ],
          [
            1220,
            445
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1220,
            614
          ],
          [
            1220,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1220,
            485
          ],
          [
            1220,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1220,
            425
          ],
          [
            1330,
            425
          ],
          [
            1330,
            445
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1330,
            614
          ],
          [
            1330,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1330,
            485
          ],
          [
            1330,
            566
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
            1220,
            425
          ],
          [
            1440,
            425
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
        "x": 800,
        "y": 100
      },
      {
        "t": "dot",
        "x": 900,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1010,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1120,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1220,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1330,
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
        "x": 800,
        "y": 700
      },
      {
        "t": "dot",
        "x": 900,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1010,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1120,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1220,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1330,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1440,
        "y": 700
      },
      {
        "t": "dot",
        "x": 900,
        "y": 300
      },
      {
        "t": "dot",
        "x": 900,
        "y": 500
      },
      {
        "t": "dot",
        "x": 1220,
        "y": 300
      },
      {
        "t": "dot",
        "x": 1220,
        "y": 425
      }
    ]
  }
};
})(typeof window === 'undefined' ? globalThis : window);
