/* 승강기기능사 01. 원본 7-5쪽 판독 데이터. */
(function(root){'use strict';var C=root.PIN_CIRCUITS=root.PIN_CIRCUITS||{};C.e01={
  "id": "e01",
  "sim": true,
  "title": "승강기기능사 01 · 핀번호 적기",
  "subject": "승강기기능사",
  "source": {
    "doc": "승강기기능사-01-A4, 2022-02-28.pdf",
    "circuitPage": 5,
    "devicePage": 5
  },
  "devices": {
    "MCCB": {
      "type": null,
      "cat": "main"
    },
    "EOCR": {
      "type": "eocr-12p"
    },
    "MC1": {
      "type": "mc-12p"
    },
    "MC2": {
      "type": "mc-12p"
    },
    "T1": {
      "type": "timer-8p"
    },
    "T2": {
      "type": "timer-8p"
    },
    "PB0": {
      "type": null,
      "cat": "pb"
    },
    "PB1": {
      "type": null,
      "cat": "pb"
    },
    "YL": {
      "type": null,
      "cat": "lamp"
    },
    "RL": {
      "type": null,
      "cat": "lamp"
    },
    "GL": {
      "type": null,
      "cat": "lamp"
    }
  },
  "answerKey": {
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
    ],
    "eocrNC": [
      "10",
      "4"
    ],
    "eocrNO": [
      "10",
      "5"
    ],
    "pb0": [
      "N",
      "C"
    ],
    "pb1": [
      "N",
      "O"
    ],
    "t1Hold": [
      "1",
      "3"
    ],
    "t1DelayNC": [
      "8",
      "5"
    ],
    "t1DelayNO": [
      "8",
      "6"
    ],
    "t2DelayNC": [
      "8",
      "5"
    ],
    "mc1Interlock": [
      "5",
      "11"
    ],
    "mc2Interlock": [
      "5",
      "11"
    ],
    "mc1Lamp": [
      "4",
      "10"
    ],
    "mc2Lamp": [
      "4",
      "10"
    ],
    "coil-EOCR": [
      "6",
      "12"
    ],
    "coil-T1": [
      "2",
      "7"
    ],
    "coil-T2": [
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
    "coil-YL": [
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
  "synopsis": {
    "text": "전원을 넣으면 EOCR에 전원이 공급되고, 이상이 없는 동안 EOCR의 b접점과 PB0의 b접점을 거쳐 운전 회로가 대기한다. PB1을 누르면 T1과 MC1이 여자되어 MC1의 주접점으로 전동기가 첫 방향으로 회전한다. T1의 순시 a접점은 PB1을 우회하여 운전 상태를 유지하고, MC1의 a접점은 RL을 켠다. T1의 설정 시간이 지나면 한시 b접점이 열려 MC1이 떨어지고, 한시 a접점이 닫혀 MC1의 b접점을 거쳐 MC2가 여자된다. MC2의 주접점은 두 상을 바꿔 전동기를 반대 방향으로 돌리며, MC2의 a접점은 GL을 켠다. MC1과 MC2의 b접점은 상대 접촉기 회로에 직렬로 들어가 동시 투입을 막는다. PB0을 누르거나 EOCR이 동작하면 운전 회로가 끊겨 접촉기가 복귀한다. EOCR 동작 때는 별도 a접점으로 T2와 YL에 전원이 가고, T2의 한시 b접점이 열릴 때 YL이 꺼진다.",
    "verified": true
  },
  "interpretQuestions": [
    {"id":"q1","prompt":"PB1을 놓아도 T1과 첫 방향 운전이 계속되도록 하는 접점은?","answerItemIds":["t1Hold"],"multi":false,"explain":"PB1과 병렬인 T1 순시 a접점이 자기유지를 해요."},
    {"id":"q2","prompt":"T1 설정시간 뒤 열려 MC1의 정회전을 멈추게 하는 접점은?","answerItemIds":["t1DelayNC"],"multi":false,"explain":"T1 한시 b접점이 열리면서 MC1 코일 전원이 끊겨요."},
    {"id":"q3","prompt":"T1 설정시간 뒤 닫혀 MC2의 역회전 경로를 여는 접점은?","answerItemIds":["t1DelayNO"],"multi":false,"explain":"T1 한시 a접점이 닫히면 MC1 b접점을 거쳐 MC2가 여자돼요."},
    {"id":"q4","prompt":"MC1이 복귀해야 MC2가 투입되도록 하는 접점은?","answerItemIds":["mc1Interlock"],"multi":false,"explain":"MC1 b접점은 정회전 중에는 열려 역회전 투입을 막아요."},
    {"id":"q5","prompt":"두 접촉기의 동시 투입을 막는 b접점을 모두 고르세요.","answerItemIds":["mc1Interlock","mc2Interlock"],"multi":true,"explain":"각 MC의 b접점이 상대 코일 앞에 직렬로 있어요."},
    {"id":"q6","prompt":"MC2가 여자될 때 GL을 켜는 보조 접점은?","answerItemIds":["mc2Lamp"],"multi":false,"explain":"MC2 a접점이 닫혀 역회전 표시등 GL을 공급해요."},
    {"id":"q7","prompt":"누르면 정상 운전 회로를 끊는 정지 접점은?","answerItemIds":["pb0"],"multi":false,"explain":"PB0 b접점이 열려 T1과 접촉기가 복귀해요."},
    {"id":"q8","prompt":"과부하 때 T2와 YL 경보 분기에 전원을 보내는 접점은?","answerItemIds":["eocrNO"],"multi":false,"explain":"EOCR a접점이 닫혀 T2와 YL 경로가 공급돼요."},
    {"id":"q9","prompt":"과부하 경보가 시작된 뒤 설정시간이 지나 YL을 끄는 접점은?","answerItemIds":["t2DelayNC"],"multi":false,"explain":"T2 한시 b접점이 열려 YL 전원을 끊어요."}
  ],
  "topology": {
    "motor": "single-three-phase-reversing",
    "swappedPhases": [
      "L1",
      "L3"
    ],
    "starDelta": false,
    "twoSpeed": false
  },
  "layout": {
    "viewBox": [
      1220,
      760
    ],
    "coilY": 580,
    "main": [
      {
        "tag": "MCCB",
        "xs": [
          70,
          115,
          160
        ],
        "slotY": [
          95,
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
          215,
          280
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
          405,
          470
        ]
      },
      {
        "tag": "MC2",
        "xs": [
          230,
          275,
          320
        ],
        "slotY": [
          405,
          470
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
        "horiz": true,
        "x1": 430,
        "x2": 470,
        "y": 90,
        "label": "EOCR",
        "title": "EOCR 운전용 b접점",
        "slots": [
          {
            "x": 430,
            "y": 60,
            "net": "H"
          },
          {
            "x": 470,
            "y": 60,
            "net": "P"
          }
        ]
      },
      {
        "id": "pb0",
        "cat": "pb",
        "tag": "PB0",
        "kind": "b",
        "feat": "pb",
        "horiz": true,
        "x1": 510,
        "x2": 550,
        "y": 90,
        "label": "PB0",
        "title": "PB0 정지 b접점",
        "slots": [
          {
            "x": 510,
            "y": 60,
            "net": "P"
          },
          {
            "x": 550,
            "y": 60,
            "net": "R"
          }
        ]
      },
      {
        "id": "eocrNO",
        "cat": "contact",
        "tag": "EOCR",
        "kind": "a",
        "feat": "ovl",
        "x": 470,
        "rows": [
          330,
          370
        ],
        "nets": [
          "H",
          "ALM"
        ],
        "label": "EOCR",
        "title": "EOCR 경보용 a접점"
      },
      {
        "id": "t2DelayNC",
        "cat": "contact",
        "tag": "T2",
        "kind": "b",
        "timing": "delay",
        "feat": "td",
        "x": 560,
        "rows": [
          430,
          470
        ],
        "nets": [
          "ALM",
          "YLc"
        ],
        "label": "T2",
        "title": "T2 한시 b접점"
      },
      {
        "id": "pb1",
        "cat": "pb",
        "tag": "PB1",
        "kind": "a",
        "feat": "pb",
        "x": 680,
        "rows": [
          185,
          225
        ],
        "nets": [
          "R",
          "S"
        ],
        "label": "PB1",
        "title": "PB1 기동 a접점"
      },
      {
        "id": "t1Hold",
        "cat": "contact",
        "tag": "T1",
        "kind": "a",
        "timing": "instant",
        "feat": "",
        "x": 780,
        "rows": [
          185,
          225
        ],
        "nets": [
          "R",
          "S"
        ],
        "label": "T1",
        "title": "T1 순시 자기유지 a접점"
      },
      {
        "id": "t1DelayNC",
        "cat": "contact",
        "tag": "T1",
        "kind": "b",
        "timing": "delay",
        "feat": "td",
        "x": 680,
        "rows": [
          330,
          370
        ],
        "nets": [
          "S",
          "M1a"
        ],
        "label": "T1",
        "title": "T1 한시 b접점"
      },
      {
        "id": "mc2Interlock",
        "cat": "contact",
        "tag": "MC2",
        "kind": "b",
        "feat": "",
        "x": 680,
        "rows": [
          430,
          470
        ],
        "nets": [
          "M1a",
          "M1c"
        ],
        "label": "MC2",
        "title": "MC2 b접점 · MC1 인터록"
      },
      {
        "id": "t1DelayNO",
        "cat": "contact",
        "tag": "T1",
        "kind": "a",
        "timing": "delay",
        "feat": "td",
        "x": 900,
        "rows": [
          330,
          370
        ],
        "nets": [
          "S",
          "M2a"
        ],
        "label": "T1",
        "title": "T1 한시 a접점"
      },
      {
        "id": "mc1Interlock",
        "cat": "contact",
        "tag": "MC1",
        "kind": "b",
        "feat": "",
        "x": 900,
        "rows": [
          430,
          470
        ],
        "nets": [
          "M2a",
          "M2c"
        ],
        "label": "MC1",
        "title": "MC1 b접점 · MC2 인터록"
      },
      {
        "id": "mc1Lamp",
        "cat": "contact",
        "tag": "MC1",
        "kind": "a",
        "feat": "",
        "x": 1030,
        "rows": [
          185,
          225
        ],
        "nets": [
          "R",
          "RLc"
        ],
        "label": "MC1",
        "title": "MC1 운전 표시 a접점"
      },
      {
        "id": "mc2Lamp",
        "cat": "contact",
        "tag": "MC2",
        "kind": "a",
        "feat": "",
        "x": 1140,
        "rows": [
          185,
          225
        ],
        "nets": [
          "R",
          "GLc"
        ],
        "label": "MC2",
        "title": "MC2 운전 표시 a접점"
      },
      {
        "id": "coil-EOCR",
        "cat": "coil",
        "tag": "EOCR",
        "x": 390,
        "nets": [
          "H",
          "N"
        ],
        "title": "EOCR 전원",
        "slots": [{ "x": 370, "y": 536, "net": "H" }, { "x": 370, "y": 624, "net": "N" }]
      },
      {
        "id": "coil-T2",
        "cat": "coil",
        "tag": "T2",
        "x": 470,
        "nets": [
          "ALM",
          "N"
        ],
        "title": "T2 코일"
      },
      {
        "id": "coil-YL",
        "cat": "lamp",
        "tag": "YL",
        "x": 560,
        "nets": [
          "YLc",
          "N"
        ],
        "title": "YL 경보등"
      },
      {
        "id": "coil-MC1",
        "cat": "coil",
        "tag": "MC1",
        "x": 680,
        "nets": [
          "M1c",
          "N"
        ],
        "title": "MC1 코일"
      },
      {
        "id": "coil-T1",
        "cat": "coil",
        "tag": "T1",
        "x": 780,
        "nets": [
          "S",
          "N"
        ],
        "title": "T1 코일"
      },
      {
        "id": "coil-MC2",
        "cat": "coil",
        "tag": "MC2",
        "x": 900,
        "nets": [
          "M2c",
          "N"
        ],
        "title": "MC2 코일"
      },
      {
        "id": "coil-RL",
        "cat": "lamp",
        "tag": "RL",
        "x": 1030,
        "nets": [
          "RLc",
          "N"
        ],
        "title": "RL 운전등"
      },
      {
        "id": "coil-GL",
        "cat": "lamp",
        "tag": "GL",
        "x": 1140,
        "nets": [
          "GLc",
          "N"
        ],
        "title": "GL 운전등"
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
      "coil-EOCR",
      "eocrNC",
      "pb0",
      "eocrNO",
      "coil-T2",
      "t2DelayNC",
      "coil-YL",
      "pb1",
      "t1Hold",
      "t1DelayNC",
      "mc2Interlock",
      "coil-MC1",
      "coil-T1",
      "t1DelayNO",
      "mc1Interlock",
      "coil-MC2",
      "mc1Lamp",
      "coil-RL",
      "mc2Lamp",
      "coil-GL"
    ],
    "drawing": [
      {
        "t": "text",
        "x": 66,
        "y": 40,
        "s": "L1"
      },
      {
        "t": "text",
        "x": 110,
        "y": 40,
        "s": "L2"
      },
      {
        "t": "text",
        "x": 155,
        "y": 40,
        "s": "L3"
      },
      {
        "t": "rect",
        "x": 55,
        "y": 49,
        "w": 120,
        "h": 20
      },
      {
        "t": "term",
        "x": 70,
        "y": 59
      },
      {
        "t": "term",
        "x": 115,
        "y": 59
      },
      {
        "t": "term",
        "x": 160,
        "y": 59
      },
      {
        "t": "text",
        "x": 10,
        "y": 124,
        "s": "MCCB"
      },
      {
        "t": "text",
        "x": 10,
        "y": 246,
        "s": "EOCR"
      },
      {
        "t": "text",
        "x": 10,
        "y": 440,
        "s": "MC1"
      },
      {
        "t": "text",
        "x": 185,
        "y": 440,
        "s": "MC2"
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 59,
        "x2": 70,
        "y2": 115
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 59,
        "x2": 115,
        "y2": 115
      },
      {
        "t": "line",
        "x1": 160,
        "y1": 59,
        "x2": 160,
        "y2": 115
      },
      {
        "t": "breaker",
        "x": 70,
        "y1": 115,
        "y2": 145
      },
      {
        "t": "breaker",
        "x": 115,
        "y1": 115,
        "y2": 145
      },
      {
        "t": "breaker",
        "x": 160,
        "y1": 115,
        "y2": 145
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 145,
        "x2": 70,
        "y2": 235
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 145,
        "x2": 115,
        "y2": 235
      },
      {
        "t": "line",
        "x1": 160,
        "y1": 145,
        "x2": 160,
        "y2": 235
      },
      {
        "t": "rect",
        "x": 54,
        "y": 235,
        "w": 122,
        "h": 30
      },
      {
        "t": "text",
        "x": 82,
        "y": 255,
        "s": "EOCR"
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 265,
        "x2": 70,
        "y2": 425
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 265,
        "x2": 115,
        "y2": 425
      },
      {
        "t": "line",
        "x1": 160,
        "y1": 265,
        "x2": 160,
        "y2": 425
      },
      {
        "t": "wire",
        "pts": [
          [
            70,
            300
          ],
          [
            230,
            300
          ],
          [
            230,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            115,
            315
          ],
          [
            275,
            315
          ],
          [
            275,
            425
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            160,
            330
          ],
          [
            320,
            330
          ],
          [
            320,
            425
          ]
        ]
      },
      {
        "t": "mc",
        "x": 70,
        "y1": 425,
        "y2": 455
      },
      {
        "t": "mc",
        "x": 115,
        "y1": 425,
        "y2": 455
      },
      {
        "t": "mc",
        "x": 160,
        "y1": 425,
        "y2": 455
      },
      {
        "t": "mc",
        "x": 230,
        "y1": 425,
        "y2": 455
      },
      {
        "t": "mc",
        "x": 275,
        "y1": 425,
        "y2": 455
      },
      {
        "t": "mc",
        "x": 320,
        "y1": 425,
        "y2": 455
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 455,
        "x2": 70,
        "y2": 615
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 455,
        "x2": 115,
        "y2": 615
      },
      {
        "t": "line",
        "x1": 160,
        "y1": 455,
        "x2": 160,
        "y2": 615
      },
      {
        "t": "wire",
        "pts": [
          [
            230,
            455
          ],
          [
            230,
            520
          ],
          [
            160,
            520
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            275,
            455
          ],
          [
            275,
            535
          ],
          [
            115,
            535
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            320,
            455
          ],
          [
            320,
            550
          ],
          [
            70,
            550
          ]
        ]
      },
      {
        "t": "rect",
        "x": 55,
        "y": 605,
        "w": 120,
        "h": 20
      },
      {
        "t": "term",
        "x": 70,
        "y": 615
      },
      {
        "t": "term",
        "x": 115,
        "y": 615
      },
      {
        "t": "term",
        "x": 160,
        "y": 615
      },
      {
        "t": "text",
        "x": 65,
        "y": 650,
        "s": "U"
      },
      {
        "t": "text",
        "x": 110,
        "y": 650,
        "s": "V"
      },
      {
        "t": "text",
        "x": 155,
        "y": 650,
        "s": "W"
      },
      {
        "t": "motor",
        "x": 115,
        "y": 686,
        "s": "M"
      },
      {
        "t": "wire",
        "pts": [
          [
            70,
            175
          ],
          [
            370,
            175
          ],
          [
            370,
            90
          ],
          [
            430,
            90
          ]
        ]
      },
      {
        "t": "line",
        "x1": 470,
        "y1": 90,
        "x2": 510,
        "y2": 90
      },
      {
        "t": "line",
        "x1": 550,
        "y1": 90,
        "x2": 1160,
        "y2": 90
      },
      {
        "t": "line",
        "x1": 370,
        "y1": 700,
        "x2": 1160,
        "y2": 700
      },
      {
        "t": "wire",
        "pts": [
          [
            160,
            195
          ],
          [
            350,
            195
          ],
          [
            350,
            700
          ],
          [
            370,
            700
          ]
        ]
      },
      {
        "t": "line",
        "x1": 390,
        "y1": 175,
        "x2": 390,
        "y2": 556
      },
      {
        "t": "line",
        "x1": 390,
        "y1": 604,
        "x2": 390,
        "y2": 700
      },
      {
        "t": "wire",
        "pts": [
          [
            390,
            280
          ],
          [
            470,
            280
          ],
          [
            470,
            330
          ]
        ]
      },
      {
        "t": "line",
        "x1": 470,
        "y1": 370,
        "x2": 470,
        "y2": 556
      },
      {
        "t": "line",
        "x1": 470,
        "y1": 604,
        "x2": 470,
        "y2": 700
      },
      {
        "t": "wire",
        "pts": [
          [
            470,
            400
          ],
          [
            560,
            400
          ],
          [
            560,
            430
          ]
        ]
      },
      {
        "t": "line",
        "x1": 560,
        "y1": 470,
        "x2": 560,
        "y2": 556
      },
      {
        "t": "line",
        "x1": 560,
        "y1": 604,
        "x2": 560,
        "y2": 700
      },
      {
        "t": "line",
        "x1": 680,
        "y1": 90,
        "x2": 680,
        "y2": 185
      },
      {
        "t": "line",
        "x1": 780,
        "y1": 90,
        "x2": 780,
        "y2": 185
      },
      {
        "t": "wire",
        "pts": [
          [
            680,
            225
          ],
          [
            680,
            280
          ],
          [
            780,
            280
          ],
          [
            780,
            225
          ]
        ]
      },
      {
        "t": "line",
        "x1": 680,
        "y1": 280,
        "x2": 680,
        "y2": 330
      },
      {
        "t": "line",
        "x1": 680,
        "y1": 370,
        "x2": 680,
        "y2": 430
      },
      {
        "t": "line",
        "x1": 680,
        "y1": 470,
        "x2": 680,
        "y2": 556
      },
      {
        "t": "line",
        "x1": 680,
        "y1": 604,
        "x2": 680,
        "y2": 700
      },
      {
        "t": "line",
        "x1": 780,
        "y1": 280,
        "x2": 780,
        "y2": 556
      },
      {
        "t": "line",
        "x1": 780,
        "y1": 604,
        "x2": 780,
        "y2": 700
      },
      {
        "t": "wire",
        "pts": [
          [
            680,
            300
          ],
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
        "t": "line",
        "x1": 900,
        "y1": 370,
        "x2": 900,
        "y2": 430
      },
      {
        "t": "line",
        "x1": 900,
        "y1": 470,
        "x2": 900,
        "y2": 556
      },
      {
        "t": "line",
        "x1": 900,
        "y1": 604,
        "x2": 900,
        "y2": 700
      },
      {
        "t": "line",
        "x1": 1030,
        "y1": 90,
        "x2": 1030,
        "y2": 185
      },
      {
        "t": "line",
        "x1": 1030,
        "y1": 225,
        "x2": 1030,
        "y2": 556
      },
      {
        "t": "line",
        "x1": 1030,
        "y1": 604,
        "x2": 1030,
        "y2": 700
      },
      {
        "t": "line",
        "x1": 1140,
        "y1": 90,
        "x2": 1140,
        "y2": 185
      },
      {
        "t": "line",
        "x1": 1140,
        "y1": 225,
        "x2": 1140,
        "y2": 556
      },
      {
        "t": "line",
        "x1": 1140,
        "y1": 604,
        "x2": 1140,
        "y2": 700
      },
      {
        "t": "line",
        "x1": 370,
        "y1": 175,
        "x2": 390,
        "y2": 175
      },
      {
        "t": "wire",
        "pts": [
          [
            70,
            615
          ],
          [
            70,
            640
          ],
          [
            93,
            675
          ]
        ]
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 615,
        "x2": 115,
        "y2": 662
      },
      {
        "t": "wire",
        "pts": [
          [
            160,
            615
          ],
          [
            160,
            640
          ],
          [
            137,
            675
          ]
        ]
      },
      {
        "t": "items"
      }
    ]
  }
};})(typeof window==='undefined'?globalThis:window);
