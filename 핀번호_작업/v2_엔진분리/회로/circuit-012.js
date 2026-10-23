/* 핀번호 적기 012. 회로 앱 초안을 원본 7쪽과 대조한 데이터. 화면 선은 기존 앱 그래프 좌표로 새로 그린다. */
(function (root) {
  'use strict';
  var C = root.PIN_CIRCUITS = root.PIN_CIRCUITS || {};
  C['012'] = {
  "id": "012",
  "title": "전기기능사 012 · 핀번호 적기",
  "subject": "전기기능사",
  "source": {
    "doc": "전기기능사-012-A4, 2025-08-04.pdf",
    "legendPage": 6,
    "circuitPage": 7,
    "devicePage": 9
  },
  "app": {
    "folder": "012_타이머_교차기동"
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
    "t2Start1": [
      "8",
      "6"
    ],
    "pb2": [
      "N",
      "O"
    ],
    "x2Hold": [
      "1",
      "3"
    ],
    "t1Start2": [
      "8",
      "6"
    ],
    "ls1": [
      "1",
      "2"
    ],
    "mc1Gate": [
      "5",
      "11"
    ],
    "ls2": [
      "1",
      "2"
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
    text: "MCCB 투입과 EOCR 정상 상태에서 PB0을 지나 운전선에 전원이 공급된다. PB1을 누르면 X1이 여자되고 X1 a접점이 PB1을 우회해 유지된다. LS1이 미감지이면 MC1 b접점을 거쳐 T1이 계시하고 T1 순시 a접점으로 WL이 곧바로 켜진다. T1 설정시간 뒤 한시 a접점이 닫히면 반대쪽 X2와 MC2가 기동되어 M2·GL이 동작한다. T1 완료 전에 LS1이 감지되면 MC1·M1·RL이 즉시 켜지고 MC1 b접점이 열려 T1과 교차 기동 계시가 취소된다. PB2를 누르면 X2·MC2·M2가 바로 동작하고 X2 a접점이 입력을 유지한다. LS2는 M2가 아닌 T2 경로에 있으므로 감지되면 T2와 WL이 동작한다. T2의 시간이 끝나면 한시 a접점이 X1을 기동시키며, X1도 자기유지되어 두 모터가 함께 운전할 수 있다. PB0 또는 EOCR 과부하로 운전선이 끊기면 X·T·MC가 복귀하고, 과부하 때 YL만 켜진다.",
    verified: true
  },
  interpretQuestions: [
    {"id":"q1","prompt":"PB1을 놓아도 X1을 유지하는 접점은?","answerItemIds":["x1Hold"],"multi":false,"explain":"X1 a접점이 PB1과 병렬이에요."},
    {"id":"q2","prompt":"LS1 감지 때 M1을 바로 기동시키는 접점은?","answerItemIds":["ls1"],"multi":false,"explain":"LS1 a접점이 MC1 경로를 닫아요."},
    {"id":"q3","prompt":"M1이 기동되면 열려 T1을 끊는 접점은?","answerItemIds":["mc1Gate"],"multi":false,"explain":"MC1 b접점이 열려 T1 계시가 복귀해요."},
    {"id":"q4","prompt":"T1 완료 뒤 반대쪽 X2를 기동시키는 접점은?","answerItemIds":["t1Start2"],"multi":false,"explain":"T1 한시 a접점이 PB2 경로를 우회해요."},
    {"id":"q5","prompt":"PB2를 놓아도 X2와 M2를 유지하는 접점은?","answerItemIds":["x2Hold"],"multi":false,"explain":"X2 a접점이 PB2와 병렬이에요."},
    {"id":"q6","prompt":"M2의 운전과 별도로 T2 계시를 허가하는 감지 접점은?","answerItemIds":["ls2"],"multi":false,"explain":"LS2 a접점은 T2 앞에만 있어요."},
    {"id":"q7","prompt":"T2 완료 뒤 반대쪽 X1을 기동시키는 접점은?","answerItemIds":["t2Start1"],"multi":false,"explain":"T2 한시 a접점이 PB1 경로를 우회해요."},
    {"id":"q8","prompt":"타이머가 여자된 즉시 WL을 켜는 접점들을 모두 고르세요.","answerItemIds":["t1WL","t2WL"],"multi":true,"explain":"T1·T2의 순시 a접점이 병렬로 WL을 공급해요."},
    {"id":"q9","prompt":"전체 정상 운전을 정지시키는 버튼 접점은?","answerItemIds":["pb0"],"multi":false,"explain":"PB0 b접점이 공통 운전선을 끊어요."}
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
        "x": 780,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_mc1GateIn"
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
        "x": 880,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_mc1GateIn"
        ],
        "label": "X1",
        "title": "X1 접점 (a)"
      },
      {
        "id": "t2Start1",
        "cat": "contact",
        "tag": "T2",
        "kind": "a",
        "feat": "td",
        "x": 980,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_mc1GateIn"
        ],
        "label": "T2",
        "title": "T2 접점 (한시 a)",
        "timing": "delay"
      },
      {
        "id": "pb2",
        "cat": "pb",
        "tag": "PB2",
        "kind": "a",
        "feat": "pb",
        "x": 1130,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_ls2In"
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
          "n_ls2In"
        ],
        "label": "X2",
        "title": "X2 접점 (a)"
      },
      {
        "id": "t1Start2",
        "cat": "contact",
        "tag": "T1",
        "kind": "a",
        "feat": "td",
        "x": 1330,
        "rows": [
          155,
          195
        ],
        "nets": [
          "n_mc2AuxIn",
          "n_ls2In"
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
        "x": 880,
        "rows": [
          465,
          505
        ],
        "nets": [
          "n_mc1GateIn",
          "n_MC1P"
        ],
        "label": "LS1",
        "title": "LS1 접점 (a)"
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
        "id": "ls2",
        "cat": "contact",
        "tag": "LS2",
        "kind": "a",
        "feat": "ls",
        "x": 1330,
        "rows": [
          465,
          505
        ],
        "nets": [
          "n_ls2In",
          "n_T2P"
        ],
        "label": "LS2",
        "title": "LS2 접점 (a)"
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
        "x": 780,
        "nets": [
          "n_mc1GateIn",
          "n_r1840"
        ],
        "title": "X1 코일"
      },
      {
        "id": "coil-X2",
        "cat": "coil",
        "tag": "X2",
        "x": 1130,
        "nets": [
          "n_ls2In",
          "n_r1840"
        ],
        "title": "X2 코일"
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
        "id": "coil-MC2",
        "cat": "coil",
        "tag": "MC2",
        "x": 1230,
        "nets": [
          "n_ls2In",
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
      "t2Start1",
      "pb2",
      "x2Hold",
      "t1Start2",
      "ls1",
      "mc1Gate",
      "ls2",
      "t1WL",
      "t2WL",
      "mc1Aux",
      "mc2Aux",
      "coil-EOCR",
      "coil-YL",
      "coil-X1",
      "coil-X2",
      "coil-MC1",
      "coil-T1",
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
            1130,
            100
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1130,
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
            1130,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1130,
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
            880,
            100
          ],
          [
            880,
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
            880,
            195
          ],
          [
            880,
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
            980,
            195
          ],
          [
            980,
            280
          ],
          [
            880,
            280
          ],
          [
            880,
            195
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
            1130,
            100
          ],
          [
            1130,
            155
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1130,
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
            1130,
            100
          ],
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
            1130,
            195
          ],
          [
            1130,
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
            1130,
            280
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
            1130,
            280
          ],
          [
            1130,
            400
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1130,
            614
          ],
          [
            1130,
            700
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            1130,
            400
          ],
          [
            1130,
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
            880,
            400
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
            780,
            400
          ],
          [
            980,
            400
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
            1130,
            400
          ],
          [
            1130,
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
            1130,
            400
          ],
          [
            1330,
            400
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
        "x": 780,
        "y": 100
      },
      {
        "t": "dot",
        "x": 1130,
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
        "x": 780,
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
        "x": 1130,
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
        "x": 880,
        "y": 195
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
        "x": 1230,
        "y": 195
      },
      {
        "t": "dot",
        "x": 1130,
        "y": 280
      },
      {
        "t": "dot",
        "x": 1130,
        "y": 400
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
