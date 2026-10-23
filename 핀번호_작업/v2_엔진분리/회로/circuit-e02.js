/* 승강기기능사 02. 원본 7-5쪽 판독 데이터. */
(function(root){'use strict';var C=root.PIN_CIRCUITS=root.PIN_CIRCUITS||{};C.e02={
  "id": "e02",
  "sim": true,
  "title": "승강기기능사 02 · 핀번호 적기",
  "subject": "승강기기능사",
  "source": {
    "doc": "승강기기능사-02-A4, 2022-02-28.pdf",
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
    ],
    "t2DelayNO": [
      "8",
      "6"
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
    "text": "전원을 넣으면 EOCR이 감시를 시작하고, 운전 전원은 EOCR의 b접점과 PB0의 b접점을 지나 대기한다. PB1을 누르면 T1과 MC1이 여자된다. T1의 순시 a접점이 PB1과 병렬로 닫혀 버튼을 놓아도 회로가 유지되고, MC1 주접점은 전동기를 첫 방향으로 돌린다. MC1의 a접점이 닫혀 RL이 켜진다. T1의 설정 시간이 지나면 한시 b접점이 열려 MC1을 정지시키고, 한시 a접점이 닫혀 T2가 여자된다. T2가 설정 시간을 채우면 한시 a접점이 닫히고 MC1의 b접점을 거쳐 MC2가 여자된다. MC2는 두 상의 부하 연결을 바꿔 전동기를 반대 방향으로 돌리며 GL을 켠다. 각 접촉기의 b접점은 상대 접촉기의 코일 앞에 있어 동시 투입을 차단한다. PB0을 누르거나 EOCR이 동작하면 운전 회로가 끊긴다. 과부하 때에는 EOCR의 a접점으로 YL이 켜진다.",
    "verified": true
  },
  "interpretQuestions": [
    {"id":"q1","prompt":"PB1을 눌렀다가 놓아도 T1의 계시를 유지하는 접점은?","answerItemIds":["t1Hold"],"multi":false,"explain":"T1 순시 a접점이 PB1을 우회해요."},
    {"id":"q2","prompt":"T1 시간이 끝나 MC1의 정회전을 멈추게 하는 접점은?","answerItemIds":["t1DelayNC"],"multi":false,"explain":"T1 한시 b접점이 열려 MC1이 복귀해요."},
    {"id":"q3","prompt":"정회전이 끝난 뒤 T2의 대기 시간을 시작하는 접점은?","answerItemIds":["t1DelayNO"],"multi":false,"explain":"T1 한시 a접점이 닫혀 T2를 여자시켜요."},
    {"id":"q4","prompt":"T2의 설정시간이 지난 뒤 MC2 역회전 경로를 닫는 접점은?","answerItemIds":["t2DelayNO"],"multi":false,"explain":"T2 한시 a접점이 닫혀야 MC2가 기동해요."},
    {"id":"q5","prompt":"MC1이 꺼진 뒤에만 MC2를 투입할 수 있게 하는 접점은?","answerItemIds":["mc1Interlock"],"multi":false,"explain":"MC1 b접점은 정회전 중 열려 있어요."},
    {"id":"q6","prompt":"정회전·역회전 접촉기의 동시 투입을 막는 접점을 모두 고르세요.","answerItemIds":["mc1Interlock","mc2Interlock"],"multi":true,"explain":"두 b접점이 각각 상대 MC 코일 앞에 있어요."},
    {"id":"q7","prompt":"MC2가 여자되면 GL을 켜는 접점은?","answerItemIds":["mc2Lamp"],"multi":false,"explain":"MC2의 보조 a접점이 역회전 표시등을 공급해요."},
    {"id":"q8","prompt":"정상 운전을 공통으로 멈추는 버튼 접점은?","answerItemIds":["pb0"],"multi":false,"explain":"PB0 b접점이 열리면 T1·T2와 접촉기가 복귀해요."},
    {"id":"q9","prompt":"과부하 때 YL 경보를 켜는 접점은?","answerItemIds":["eocrNO"],"multi":false,"explain":"EOCR 경보 a접점이 닫혀 YL에 전원을 보내요."}
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
      1340,
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
          "YLc"
        ],
        "label": "EOCR",
        "title": "EOCR 경보용 a접점"
      },
      {
        "id": "pb1",
        "cat": "pb",
        "tag": "PB1",
        "kind": "a",
        "feat": "pb",
        "x": 800,
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
        "x": 900,
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
        "id": "mc1Lamp",
        "cat": "contact",
        "tag": "MC1",
        "kind": "a",
        "feat": "",
        "x": 600,
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
        "x": 700,
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
        "id": "t1DelayNC",
        "cat": "contact",
        "tag": "T1",
        "kind": "b",
        "timing": "delay",
        "feat": "td",
        "x": 800,
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
        "x": 800,
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
        "x": 1030,
        "rows": [
          330,
          370
        ],
        "nets": [
          "S",
          "T2c"
        ],
        "label": "T1",
        "title": "T1 한시 a접점"
      },
      {
        "id": "t2DelayNO",
        "cat": "contact",
        "tag": "T2",
        "kind": "a",
        "timing": "delay",
        "feat": "td",
        "x": 1200,
        "rows": [
          330,
          370
        ],
        "nets": [
          "T2c",
          "M2a"
        ],
        "label": "T2",
        "title": "T2 한시 a접점"
      },
      {
        "id": "mc1Interlock",
        "cat": "contact",
        "tag": "MC1",
        "kind": "b",
        "feat": "",
        "x": 1200,
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
        "id": "coil-YL",
        "cat": "lamp",
        "tag": "YL",
        "x": 470,
        "nets": [
          "YLc",
          "N"
        ],
        "title": "YL 경보등"
      },
      {
        "id": "coil-RL",
        "cat": "lamp",
        "tag": "RL",
        "x": 600,
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
        "x": 700,
        "nets": [
          "GLc",
          "N"
        ],
        "title": "GL 운전등"
      },
      {
        "id": "coil-MC1",
        "cat": "coil",
        "tag": "MC1",
        "x": 800,
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
        "x": 900,
        "nets": [
          "S",
          "N"
        ],
        "title": "T1 코일"
      },
      {
        "id": "coil-T2",
        "cat": "coil",
        "tag": "T2",
        "x": 1030,
        "nets": [
          "T2c",
          "N"
        ],
        "title": "T2 코일"
      },
      {
        "id": "coil-MC2",
        "cat": "coil",
        "tag": "MC2",
        "x": 1200,
        "nets": [
          "M2c",
          "N"
        ],
        "title": "MC2 코일"
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
      "coil-YL",
      "mc1Lamp",
      "coil-RL",
      "mc2Lamp",
      "coil-GL",
      "pb1",
      "t1Hold",
      "t1DelayNC",
      "mc2Interlock",
      "coil-MC1",
      "coil-T1",
      "t1DelayNO",
      "coil-T2",
      "t2DelayNO",
      "mc1Interlock",
      "coil-MC2"
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
        "x2": 1240,
        "y2": 90
      },
      {
        "t": "line",
        "x1": 370,
        "y1": 700,
        "x2": 1240,
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
        "t": "line",
        "x1": 600,
        "y1": 90,
        "x2": 600,
        "y2": 185
      },
      {
        "t": "line",
        "x1": 600,
        "y1": 225,
        "x2": 600,
        "y2": 556
      },
      {
        "t": "line",
        "x1": 600,
        "y1": 604,
        "x2": 600,
        "y2": 700
      },
      {
        "t": "line",
        "x1": 700,
        "y1": 90,
        "x2": 700,
        "y2": 185
      },
      {
        "t": "line",
        "x1": 700,
        "y1": 225,
        "x2": 700,
        "y2": 556
      },
      {
        "t": "line",
        "x1": 700,
        "y1": 604,
        "x2": 700,
        "y2": 700
      },
      {
        "t": "line",
        "x1": 800,
        "y1": 90,
        "x2": 800,
        "y2": 185
      },
      {
        "t": "line",
        "x1": 900,
        "y1": 90,
        "x2": 900,
        "y2": 185
      },
      {
        "t": "wire",
        "pts": [
          [
            800,
            225
          ],
          [
            800,
            280
          ],
          [
            900,
            280
          ],
          [
            900,
            225
          ]
        ]
      },
      {
        "t": "line",
        "x1": 800,
        "y1": 280,
        "x2": 800,
        "y2": 330
      },
      {
        "t": "line",
        "x1": 800,
        "y1": 370,
        "x2": 800,
        "y2": 430
      },
      {
        "t": "line",
        "x1": 800,
        "y1": 470,
        "x2": 800,
        "y2": 556
      },
      {
        "t": "line",
        "x1": 800,
        "y1": 604,
        "x2": 800,
        "y2": 700
      },
      {
        "t": "line",
        "x1": 900,
        "y1": 280,
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
        "t": "wire",
        "pts": [
          [
            800,
            300
          ],
          [
            1030,
            300
          ],
          [
            1030,
            330
          ]
        ]
      },
      {
        "t": "line",
        "x1": 1030,
        "y1": 370,
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
        "t": "wire",
        "pts": [
          [
            1030,
            400
          ],
          [
            1110,
            400
          ],
          [
            1110,
            280
          ],
          [
            1200,
            280
          ],
          [
            1200,
            330
          ]
        ]
      },
      {
        "t": "line",
        "x1": 1200,
        "y1": 370,
        "x2": 1200,
        "y2": 430
      },
      {
        "t": "line",
        "x1": 1200,
        "y1": 470,
        "x2": 1200,
        "y2": 556
      },
      {
        "t": "line",
        "x1": 1200,
        "y1": 604,
        "x2": 1200,
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
