/* 핀번호 적기 013. 회로 앱 초안을 원본 7쪽과 대조한 데이터. 화면 선은 기존 앱 그래프 좌표로 새로 그린다. */
(function (root) {
  'use strict';
  var C = root.PIN_CIRCUITS = root.PIN_CIRCUITS || {};
  C['013'] = {
  "id": "013",
  "title": "전기기능사 013 · 핀번호 적기",
  "subject": "전기기능사",
  "source": {
    "doc": "전기기능사-013-A4, 2025-08-04.pdf",
    "legendPage": 6,
    "circuitPage": 7,
    "devicePage": 9
  },
  "app": {
    "folder": "013_감지우선_순차정지"
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
    "x1Hold": [
      "1",
      "3"
    ],
    "ls1": [
      "1",
      "2"
    ],
    "t2StopX1": [
      "8",
      "5"
    ],
    "ls2": [
      "1",
      "2"
    ],
    "mc1Gate": [
      "5",
      "11"
    ],
    "pb2": [
      "N",
      "O"
    ],
    "x2Hold": [
      "1",
      "3"
    ],
    "t1StartX2": [
      "8",
      "6"
    ],
    "x1GateT2": [
      "8",
      "6"
    ],
    "t1WL": [
      "1",
      "3"
    ],
    "t2WL": [
      "1",
      "3"
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
    text: "MCCB를 투입하고 EOCR이 정상인 동안 PB0 뒤에 운전 전원이 공급된다. PB1을 누르면 X1이 여자되고 X1 a접점이 PB1을 우회해 유지되며, LS1 a접점도 X1 기동을 허용한다. LS2가 감지되면 X1 경로에서 MC1·M1·RL이 즉시 동작하고 MC1 b접점이 열려 T1을 끊는다. LS2가 해제되면 M1은 멈추지만 X1은 유지되어 T1이 처음부터 다시 계시한다. T1 설정시간이 끝나면 한시 a접점이 X2와 MC2를 여자시켜 M2·GL을 기동한다. X2 a접점은 2번 계통을 유지하며, X1 a접점을 거친 T2도 계시를 시작한다. T2 설정시간 뒤 한시 b접점이 열리면 X1이 복귀하여 T1과 T2가 멈추지만 X2·M2는 유지된다. WL은 T1이나 T2가 여자된 동안 각각의 순시 a접점으로 켜진다. PB2는 X2·MC2를 직접 기동할 수 있으나 X1이 없으면 T2는 계시하지 않는다. PB0이나 EOCR 과부하로 정상 운전이 끊기면 두 계통이 복귀하고 과부하 때 YL만 켜진다.",
    verified: true
  },
  interpretQuestions: [
    {"id":"q1","prompt":"PB1을 놓아도 X1을 유지하는 접점은?","answerItemIds":["x1Hold"],"multi":false,"explain":"X1 a접점이 PB1과 병렬이에요."},
    {"id":"q2","prompt":"감지만으로 X1 기동을 허용하는 접점은?","answerItemIds":["ls1"],"multi":false,"explain":"LS1 a접점이 PB1·X1 유지 경로와 병렬이에요."},
    {"id":"q3","prompt":"X1이 공급될 때 M1을 직접 기동시키는 감지 접점은?","answerItemIds":["ls2"],"multi":false,"explain":"LS2 a접점이 MC1 경로를 닫아요."},
    {"id":"q4","prompt":"M1이 기동되면 T1을 끊는 접점은?","answerItemIds":["mc1Gate"],"multi":false,"explain":"MC1 b접점이 열려 T1 시간을 초기화해요."},
    {"id":"q5","prompt":"T1 완료 뒤 X2·M2를 기동시키는 접점은?","answerItemIds":["t1StartX2"],"multi":false,"explain":"T1 한시 a접점이 2번 계통 입력점에 전원을 보내요."},
    {"id":"q6","prompt":"PB2를 놓은 뒤에도 X2·M2를 유지하는 접점은?","answerItemIds":["x2Hold"],"multi":false,"explain":"X2 a접점이 PB2와 병렬이에요."},
    {"id":"q7","prompt":"X1이 있을 때만 T2에 전원을 허용하는 접점은?","answerItemIds":["x1GateT2"],"multi":false,"explain":"X1 a접점이 T2 코일 앞에 있어요."},
    {"id":"q8","prompt":"T2 완료 뒤 X1을 복귀시키는 접점은?","answerItemIds":["t2StopX1"],"multi":false,"explain":"T2 한시 b접점이 열려 1번 계통을 끊어요."},
    {"id":"q9","prompt":"T1 또는 T2가 여자되면 WL을 켜는 접점들을 모두 고르세요.","answerItemIds":["t1WL","t2WL"],"multi":true,"explain":"두 순시 a접점이 WL 앞에서 병렬이에요."}
  ],

  "layout": {
    "viewBox": [
      1930,
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
        "x": 760,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_t2StopX1In"
        ],
        "label": "PB1",
        "title": "PB1 접점 (a)"
      },
      {
        "id": "x1Hold",
        "cat": "contact",
        "tag": "X1",
        "kind": "a",
        "feat": "",
        "x": 870,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_t2StopX1In"
        ],
        "label": "X1",
        "title": "X1 접점 (a)"
      },
      {
        "id": "ls1",
        "cat": "contact",
        "tag": "LS1",
        "kind": "a",
        "feat": "ls",
        "x": 980,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_t2StopX1In"
        ],
        "label": "LS1",
        "title": "LS1 접점 (a)"
      },
      {
        "id": "t2StopX1",
        "cat": "contact",
        "tag": "T2",
        "kind": "b",
        "feat": "td",
        "x": 760,
        "rows": [
          315,
          355
        ],
        "nets": [
          "n_t2StopX1In",
          "n_mc1GateIn"
        ],
        "label": "T2",
        "title": "T2 접점 (한시 b)",
        "timing": "delay"
      },
      {
        "id": "ls2",
        "cat": "contact",
        "tag": "LS2",
        "kind": "a",
        "feat": "ls",
        "x": 880,
        "rows": [
          465,
          505
        ],
        "nets": [
          "n_mc1GateIn",
          "n_MC1P"
        ],
        "label": "LS2",
        "title": "LS2 접점 (a)"
      },
      {
        "id": "mc1Gate",
        "cat": "contact",
        "tag": "MC1",
        "kind": "b",
        "feat": "",
        "x": 980,
        "rows": [
          465,
          505
        ],
        "nets": [
          "n_mc1GateIn",
          "n_T1P"
        ],
        "label": "MC1",
        "title": "MC1 접점 (b)"
      },
      {
        "id": "pb2",
        "cat": "pb",
        "tag": "PB2",
        "kind": "a",
        "feat": "pb",
        "x": 1120,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_x1GateT2In"
        ],
        "label": "PB2",
        "title": "PB2 접점 (a)"
      },
      {
        "id": "x2Hold",
        "cat": "contact",
        "tag": "X2",
        "kind": "a",
        "feat": "",
        "x": 1230,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_x1GateT2In"
        ],
        "label": "X2",
        "title": "X2 접점 (a)"
      },
      {
        "id": "t1StartX2",
        "cat": "contact",
        "tag": "T1",
        "kind": "a",
        "feat": "td",
        "x": 1340,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_x1GateT2In"
        ],
        "label": "T1",
        "title": "T1 접점 (한시 a)",
        "timing": "delay"
      },
      {
        "id": "x1GateT2",
        "cat": "contact",
        "tag": "X1",
        "kind": "a",
        "feat": "",
        "x": 1330,
        "rows": [
          465,
          505
        ],
        "nets": [
          "n_x1GateT2In",
          "n_T2P"
        ],
        "label": "X1",
        "title": "X1 접점 (a)"
      },
      {
        "id": "t1WL",
        "cat": "contact",
        "tag": "T1",
        "kind": "a",
        "feat": "",
        "x": 1480,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_WLP"
        ],
        "label": "T1",
        "title": "T1 접점 (순시 a)",
        "timing": "instant"
      },
      {
        "id": "t2WL",
        "cat": "contact",
        "tag": "T2",
        "kind": "a",
        "feat": "",
        "x": 1600,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_WLP"
        ],
        "label": "T2",
        "title": "T2 접점 (순시 a)",
        "timing": "instant"
      },
      {
        "id": "mc1Aux",
        "cat": "contact",
        "tag": "MC1",
        "kind": "a",
        "feat": "",
        "x": 1720,
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
        "x": 1840,
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
          "n_r1840"
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
          "n_r1840"
        ],
        "title": "YL 램프·부저"
      },
      {
        "id": "coil-X1",
        "cat": "coil",
        "tag": "X1",
        "x": 760,
        "nets": [
          "n_mc1GateIn",
          "n_r1840"
        ],
        "title": "X1 코일"
      },
      {
        "id": "coil-MC1",
        "cat": "coil",
        "tag": "MC1",
        "x": 880,
        "nets": [
          "n_MC1P",
          "n_r1840"
        ],
        "title": "MC1 코일"
      },
      {
        "id": "coil-T1",
        "cat": "coil",
        "tag": "T1",
        "x": 980,
        "nets": [
          "n_T1P",
          "n_r1840"
        ],
        "title": "T1 코일"
      },
      {
        "id": "coil-X2",
        "cat": "coil",
        "tag": "X2",
        "x": 1120,
        "nets": [
          "n_x1GateT2In",
          "n_r1840"
        ],
        "title": "X2 코일"
      },
      {
        "id": "coil-MC2",
        "cat": "coil",
        "tag": "MC2",
        "x": 1230,
        "nets": [
          "n_x1GateT2In",
          "n_r1840"
        ],
        "title": "MC2 코일"
      },
      {
        "id": "coil-T2",
        "cat": "coil",
        "tag": "T2",
        "x": 1330,
        "nets": [
          "n_T2P",
          "n_r1840"
        ],
        "title": "T2 코일"
      },
      {
        "id": "coil-WL",
        "cat": "lamp",
        "tag": "WL",
        "x": 1480,
        "nets": [
          "n_WLP",
          "n_r1840"
        ],
        "title": "WL 램프·부저"
      },
      {
        "id": "coil-RL",
        "cat": "lamp",
        "tag": "RL",
        "x": 1720,
        "nets": [
          "n_RLP",
          "n_r1840"
        ],
        "title": "RL 램프·부저"
      },
      {
        "id": "coil-GL",
        "cat": "lamp",
        "tag": "GL",
        "x": 1840,
        "nets": [
          "n_GLP",
          "n_r1840"
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
      "x1Hold",
      "ls1",
      "t2StopX1",
      "ls2",
      "mc1Gate",
      "pb2",
      "x2Hold",
      "t1StartX2",
      "x1GateT2",
      "t1WL",
      "t2WL",
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
            1600,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1600,
            100
          ],
          [
            1720,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1720,
            100
          ],
          [
            1840,
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
            880,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            880,
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
            1230,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1230,
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
            1720,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1720,
            700
          ],
          [
            1840,
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
            760,
            100
          ],
          [
            760,
            155
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
            870,
            100
          ],
          [
            870,
            155
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
            980,
            100
          ],
          [
            980,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            760,
            195
          ],
          [
            760,
            270
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            870,
            195
          ],
          [
            870,
            270
          ],
          [
            760,
            270
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            980,
            195
          ],
          [
            980,
            270
          ],
          [
            870,
            270
          ],
          [
            870,
            195
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            760,
            270
          ],
          [
            760,
            315
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            760,
            355
          ],
          [
            760,
            420
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
            760,
            420
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
            760,
            420
          ],
          [
            880,
            420
          ],
          [
            880,
            465
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            880,
            614
          ],
          [
            880,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            880,
            505
          ],
          [
            880,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            760,
            420
          ],
          [
            980,
            420
          ],
          [
            980,
            465
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            980,
            614
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
            505
          ],
          [
            980,
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
            100
          ],
          [
            1230,
            100
          ],
          [
            1230,
            155
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
            1340,
            100
          ],
          [
            1340,
            155
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
            280
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1230,
            195
          ],
          [
            1230,
            280
          ],
          [
            1120,
            280
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1340,
            195
          ],
          [
            1340,
            280
          ],
          [
            1230,
            280
          ],
          [
            1230,
            195
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1120,
            280
          ],
          [
            1120,
            420
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
            420
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
            1230,
            614
          ],
          [
            1230,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1120,
            420
          ],
          [
            1120,
            470
          ],
          [
            1230,
            470
          ],
          [
            1230,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1120,
            420
          ],
          [
            1330,
            420
          ],
          [
            1330,
            465
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
            505
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
            280
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
            195
          ],
          [
            1480,
            280
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1600,
            100
          ],
          [
            1600,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1600,
            195
          ],
          [
            1600,
            280
          ],
          [
            1480,
            280
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1720,
            100
          ],
          [
            1720,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1720,
            614
          ],
          [
            1720,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1720,
            195
          ],
          [
            1720,
            566
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1840,
            100
          ],
          [
            1840,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1840,
            614
          ],
          [
            1840,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1840,
            195
          ],
          [
            1840,
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
        "x": 760,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1120,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1480,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1600,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1720,
        "y": 100
      },
      {
        "t": "dot",
        "x": 510,
        "y": 700
      },
      {
        "t": "dot",
        "x": 760,
        "y": 700
      },
      {
        "t": "dot",
        "x": 880,
        "y": 700
      },
      {
        "t": "dot",
        "x": 980,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1120,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1230,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1330,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1480,
        "y": 700
      },
      {
        "t": "dot",
        "x": 1720,
        "y": 700
      },
      {
        "t": "dot",
        "x": 870,
        "y": 195
      },
      {
        "t": "dot",
        "x": 760,
        "y": 270
      },
      {
        "t": "dot",
        "x": 760,
        "y": 420
      },
      {
        "t": "dot",
        "x": 1230,
        "y": 195
      },
      {
        "t": "dot",
        "x": 1120,
        "y": 280
      },
      {
        "t": "dot",
        "x": 1120,
        "y": 420
      },
      {
        "t": "dot",
        "x": 1480,
        "y": 280
      }
    ]
  }
};
})(typeof window === 'undefined' ? globalThis : window);
