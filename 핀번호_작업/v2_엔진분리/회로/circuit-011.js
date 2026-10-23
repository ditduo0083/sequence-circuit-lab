/* 핀번호 적기 011. 회로 앱 초안을 원본 7쪽과 대조한 데이터. 화면 선은 기존 앱 그래프 좌표로 새로 그린다. */
(function (root) {
  'use strict';
  var C = root.PIN_CIRCUITS = root.PIN_CIRCUITS || {};
  C['011'] = {
  "id": "011",
  "title": "전기기능사 011 · 핀번호 적기",
  "subject": "전기기능사",
  "source": {
    "doc": "전기기능사-011-A4, 2025-08-04.pdf",
    "legendPage": 6,
    "circuitPage": 7,
    "devicePage": 9
  },
  "app": {
    "folder": "011_한시_자기유지"
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
    "pb1": [
      "N",
      "O"
    ],
    "t1Hold": [
      "8",
      "6"
    ],
    "ls1": [
      "1",
      "2"
    ],
    "x2Gate": [
      "1",
      "4"
    ],
    "pb2": [
      "N",
      "O"
    ],
    "t2Hold": [
      "8",
      "6"
    ],
    "ls2": [
      "1",
      "2"
    ],
    "x1Gate": [
      "1",
      "4"
    ],
    "x1WL": [
      "8",
      "6"
    ],
    "mc1NC": [
      "5",
      "11"
    ],
    "x2WL": [
      "8",
      "6"
    ],
    "mc2NC": [
      "5",
      "11"
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
    "coil-X1": [
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
    "coil-X2": [
      "2",
      "7"
    ],
    "coil-MC2": [
      "6",
      "12"
    ],
    "coil-T2": [
      "2",
      "7"
    ],
    "coil-WL": [
      "1",
      "2"
    ],
    "coil-RL": [
      "1",
      "2"
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
    text: "MCCB를 투입하고 EOCR이 정상일 때 PB0을 지나 두 계통의 운전선이 준비된다. PB1을 누르면 X1과 T1이 여자되며 LS1이 이미 감지 중이면 MC1·M1·RL도 바로 동작한다. T1 한시 a접점은 설정시간 뒤 닫혀 PB1을 우회하므로, 그 전에 버튼을 놓으면 자기유지가 성립하지 않는다. 자기유지가 된 뒤 LS1을 해제하면 M1은 멈추지만 X1과 T1은 계속 여자되어 재감지 때 M1이 즉시 다시 운전한다. PB2 쪽도 X2·T2 한시 a접점으로 같은 방식의 유지가 성립하고 LS2가 MC2·M2·GL을 직접 제어한다. X2 b접점은 T1 경로에, X1 b접점은 T2 경로에 있어 다른 계통으로 전환할 때 기존 타이머를 끊는다. 두 PB를 함께 누른 동안에는 두 X가 여자되어 두 T가 차단되지만, LS도 모두 감지되면 두 전동기는 함께 운전할 수 있다. WL은 여자된 X의 계통에서 해당 MC가 정지한 상태를 나타낸다. PB0을 누르거나 EOCR이 과부하로 동작하면 운전이 멈추고, 과부하 경보 YL만 켜진다.",
    verified: true
  },
  interpretQuestions: [
    {"id":"q1","prompt":"PB1을 놓기 전에 설정시간이 지나야 자기유지되는 접점은?","answerItemIds":["t1Hold"],"multi":false,"explain":"T1 한시 a접점은 시간 완료 뒤 PB1을 우회해요."},
    {"id":"q2","prompt":"1번 계통에서 감지 즉시 M1을 기동시키는 접점은?","answerItemIds":["ls1"],"multi":false,"explain":"LS1 a접점은 MC1 공급 경로에 있어요."},
    {"id":"q3","prompt":"2번 계통의 X2가 여자될 때 T1을 끊는 접점은?","answerItemIds":["x2Gate"],"multi":false,"explain":"X2 b접점이 열리면 T1이 복귀해요."},
    {"id":"q4","prompt":"PB2를 놓기 전에 설정시간이 지나야 자기유지되는 접점은?","answerItemIds":["t2Hold"],"multi":false,"explain":"T2 한시 a접점이 PB2와 병렬이에요."},
    {"id":"q5","prompt":"2번 계통에서 감지 즉시 M2를 기동시키는 접점은?","answerItemIds":["ls2"],"multi":false,"explain":"LS2 a접점이 MC2를 공급해요."},
    {"id":"q6","prompt":"1번 계통의 X1이 여자될 때 T2를 끊는 접점은?","answerItemIds":["x1Gate"],"multi":false,"explain":"X1 b접점이 열려 T2의 계시를 막아요."},
    {"id":"q7","prompt":"X1은 여자되고 M1은 정지했을 때 WL을 켜는 접점들을 모두 고르세요.","answerItemIds":["x1WL","mc1NC"],"multi":true,"explain":"X1 a접점과 MC1 b접점이 직렬이에요."},
    {"id":"q8","prompt":"두 계통을 함께 정지시키는 버튼 접점은?","answerItemIds":["pb0"],"multi":false,"explain":"PB0 b접점이 공통 운전선을 끊어요."},
    {"id":"q9","prompt":"EOCR이 과부하를 검출하면 켜지는 경보 부하는?","answerItemIds":["coil-YL"],"multi":false,"explain":"경보 a접점은 YL만 공급해요."}
  ],

  "layout": {
    "viewBox": [
      1760,
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
        "id": "pb1",
        "cat": "pb",
        "tag": "PB1",
        "kind": "a",
        "feat": "pb",
        "x": 780,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_x2GateIn"
        ],
        "label": "PB1",
        "title": "PB1 접점 (a)"
      },
      {
        "id": "t1Hold",
        "cat": "contact",
        "tag": "T1",
        "kind": "a",
        "feat": "td",
        "x": 860,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_x2GateIn"
        ],
        "label": "T1",
        "title": "T1 접점 (한시 a)",
        "timing": "delay"
      },
      {
        "id": "ls1",
        "cat": "contact",
        "tag": "LS1",
        "kind": "a",
        "feat": "ls",
        "x": 860,
        "rows": [
          465,
          505
        ],
        "nets": [
          "n_x2GateIn",
          "n_MC1P"
        ],
        "label": "LS1",
        "title": "LS1 접점 (a)"
      },
      {
        "id": "x2Gate",
        "cat": "contact",
        "tag": "X2",
        "kind": "b",
        "feat": "",
        "x": 960,
        "rows": [
          465,
          505
        ],
        "nets": [
          "n_x2GateIn",
          "n_T1P"
        ],
        "label": "X2",
        "title": "X2 접점 (b)"
      },
      {
        "id": "pb2",
        "cat": "pb",
        "tag": "PB2",
        "kind": "a",
        "feat": "pb",
        "x": 1090,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_x1GateIn"
        ],
        "label": "PB2",
        "title": "PB2 접점 (a)"
      },
      {
        "id": "t2Hold",
        "cat": "contact",
        "tag": "T2",
        "kind": "a",
        "feat": "td",
        "x": 1170,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_x1GateIn"
        ],
        "label": "T2",
        "title": "T2 접점 (한시 a)",
        "timing": "delay"
      },
      {
        "id": "ls2",
        "cat": "contact",
        "tag": "LS2",
        "kind": "a",
        "feat": "ls",
        "x": 1170,
        "rows": [
          465,
          505
        ],
        "nets": [
          "n_x1GateIn",
          "n_MC2P"
        ],
        "label": "LS2",
        "title": "LS2 접점 (a)"
      },
      {
        "id": "x1Gate",
        "cat": "contact",
        "tag": "X1",
        "kind": "b",
        "feat": "",
        "x": 1270,
        "rows": [
          465,
          505
        ],
        "nets": [
          "n_x1GateIn",
          "n_T2P"
        ],
        "label": "X1",
        "title": "X1 접점 (b)"
      },
      {
        "id": "x1WL",
        "cat": "contact",
        "tag": "X1",
        "kind": "a",
        "feat": "",
        "x": 1370,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_mc1NCIn"
        ],
        "label": "X1",
        "title": "X1 접점 (a)"
      },
      {
        "id": "mc1NC",
        "cat": "contact",
        "tag": "MC1",
        "kind": "b",
        "feat": "",
        "x": 1370,
        "rows": [
          250,
          290
        ],
        "nets": [
          "n_mc1NCIn",
          "n_WLP"
        ],
        "label": "MC1",
        "title": "MC1 접점 (b)"
      },
      {
        "id": "x2WL",
        "cat": "contact",
        "tag": "X2",
        "kind": "a",
        "feat": "",
        "x": 1460,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_mc2NCIn"
        ],
        "label": "X2",
        "title": "X2 접점 (a)"
      },
      {
        "id": "mc2NC",
        "cat": "contact",
        "tag": "MC2",
        "kind": "b",
        "feat": "",
        "x": 1460,
        "rows": [
          250,
          290
        ],
        "nets": [
          "n_mc2NCIn",
          "n_WLP"
        ],
        "label": "MC2",
        "title": "MC2 접점 (b)"
      },
      {
        "id": "mc1Aux",
        "cat": "contact",
        "tag": "MC1",
        "kind": "a",
        "feat": "",
        "x": 1570,
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
        "x": 1670,
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
          "n_r1670"
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
          "n_r1670"
        ],
        "title": "YL 램프·부저"
      },
      {
        "id": "coil-X1",
        "cat": "coil",
        "tag": "X1",
        "x": 780,
        "nets": [
          "n_x2GateIn",
          "n_r1670"
        ],
        "title": "X1 코일"
      },
      {
        "id": "coil-MC1",
        "cat": "coil",
        "tag": "MC1",
        "x": 860,
        "nets": [
          "n_MC1P",
          "n_r1670"
        ],
        "title": "MC1 코일"
      },
      {
        "id": "coil-T1",
        "cat": "coil",
        "tag": "T1",
        "x": 960,
        "nets": [
          "n_T1P",
          "n_r1670"
        ],
        "title": "T1 코일"
      },
      {
        "id": "coil-X2",
        "cat": "coil",
        "tag": "X2",
        "x": 1090,
        "nets": [
          "n_x1GateIn",
          "n_r1670"
        ],
        "title": "X2 코일"
      },
      {
        "id": "coil-MC2",
        "cat": "coil",
        "tag": "MC2",
        "x": 1170,
        "nets": [
          "n_MC2P",
          "n_r1670"
        ],
        "title": "MC2 코일"
      },
      {
        "id": "coil-T2",
        "cat": "coil",
        "tag": "T2",
        "x": 1270,
        "nets": [
          "n_T2P",
          "n_r1670"
        ],
        "title": "T2 코일"
      },
      {
        "id": "coil-WL",
        "cat": "lamp",
        "tag": "WL",
        "x": 1370,
        "nets": [
          "n_WLP",
          "n_r1670"
        ],
        "title": "WL 램프·부저"
      },
      {
        "id": "coil-RL",
        "cat": "lamp",
        "tag": "RL",
        "x": 1570,
        "nets": [
          "n_RLP",
          "n_r1670"
        ],
        "title": "RL 램프·부저"
      },
      {
        "id": "coil-GL",
        "cat": "lamp",
        "tag": "GL",
        "x": 1670,
        "nets": [
          "n_GLP",
          "n_r1670"
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
      "pb1",
      "t1Hold",
      "ls1",
      "x2Gate",
      "pb2",
      "t2Hold",
      "ls2",
      "x1Gate",
      "x1WL",
      "mc1NC",
      "x2WL",
      "mc2NC",
      "mc1Aux",
      "mc2Aux",
      "coil-EOCR",
      "coil-YL",
      "coil-X1",
      "coil-MC1",
      "coil-T1",
      "coil-X2",
      "coil-MC2",
      "coil-T2",
      "coil-WL",
      "coil-RL",
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
            780,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            780,
            100
          ],
          [
            1090,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1090,
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
            1460,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1460,
            100
          ],
          [
            1570,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1570,
            100
          ],
          [
            1670,
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
            780,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            780,
            700
          ],
          [
            860,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            860,
            700
          ],
          [
            960,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            960,
            700
          ],
          [
            1090,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1090,
            700
          ],
          [
            1170,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1170,
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
            1570,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1570,
            700
          ],
          [
            1670,
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
            780,
            100
          ],
          [
            780,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            780,
            100
          ],
          [
            860,
            100
          ],
          [
            860,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            780,
            195
          ],
          [
            780,
            280
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            860,
            195
          ],
          [
            860,
            280
          ],
          [
            780,
            280
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            780,
            280
          ],
          [
            780,
            400
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            780,
            614
          ],
          [
            780,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            780,
            400
          ],
          [
            780,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            780,
            400
          ],
          [
            860,
            400
          ],
          [
            860,
            465
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            860,
            614
          ],
          [
            860,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            860,
            505
          ],
          [
            860,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            780,
            400
          ],
          [
            960,
            400
          ],
          [
            960,
            465
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            960,
            614
          ],
          [
            960,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            960,
            505
          ],
          [
            960,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1090,
            100
          ],
          [
            1090,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1090,
            100
          ],
          [
            1170,
            100
          ],
          [
            1170,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1090,
            195
          ],
          [
            1090,
            280
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1170,
            195
          ],
          [
            1170,
            280
          ],
          [
            1090,
            280
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1090,
            280
          ],
          [
            1090,
            400
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1090,
            614
          ],
          [
            1090,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1090,
            400
          ],
          [
            1090,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1090,
            400
          ],
          [
            1170,
            400
          ],
          [
            1170,
            465
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1170,
            614
          ],
          [
            1170,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1170,
            505
          ],
          [
            1170,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1090,
            400
          ],
          [
            1270,
            400
          ],
          [
            1270,
            465
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
            1270,
            505
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
            340
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
            195
          ],
          [
            1370,
            250
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1370,
            290
          ],
          [
            1370,
            340
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1460,
            100
          ],
          [
            1460,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1460,
            195
          ],
          [
            1460,
            250
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1460,
            290
          ],
          [
            1460,
            340
          ],
          [
            1370,
            340
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1570,
            100
          ],
          [
            1570,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1570,
            614
          ],
          [
            1570,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1570,
            195
          ],
          [
            1570,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1670,
            100
          ],
          [
            1670,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1670,
            614
          ],
          [
            1670,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1670,
            195
          ],
          [
            1670,
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
        "x": 780,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1090,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1370,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1460,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1570,
        "y": 100
      },
      {
        "t": "dot",
        "x": 510,
        "y": 700
      },
      {
        "t": "dot",
        "x": 780,
        "y": 700
      },
      {
        "t": "dot",
        "x": 860,
        "y": 700
      },
      {
        "t": "dot",
        "x": 960,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1090,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1170,
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
        "x": 1570,
        "y": 700
      },
      {
        "t": "dot",
        "x": 780,
        "y": 280
      },
      {
        "t": "dot",
        "x": 780,
        "y": 400
      },
      {
        "t": "dot",
        "x": 1090,
        "y": 280
      },
      {
        "t": "dot",
        "x": 1090,
        "y": 400
      },
      {
        "t": "dot",
        "x": 1370,
        "y": 340
      }
    ]
  }
};
})(typeof window === 'undefined' ? globalThis : window);
