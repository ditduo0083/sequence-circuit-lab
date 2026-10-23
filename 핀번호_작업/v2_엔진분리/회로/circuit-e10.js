/* 승강기기능사 10. 원본 7-5쪽 판독 데이터. */
(function(root){'use strict';var C=root.PIN_CIRCUITS=root.PIN_CIRCUITS||{};C.e10={
  "id": "e10",
  "sim": true,
  "title": "승강기기능사 10 · 핀번호 적기",
  "subject": "승강기기능사",
  "source": {
    "doc": "승강기기능사-10-A4, 2022-02-28.pdf",
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
    "T": {
      "type": "timer-8p"
    },
    "FR": {
      "type": "flicker-8p"
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
    "tHold": [
      "1",
      "3"
    ],
    "tDelayNC": [
      "8",
      "5"
    ],
    "tDelayNO": [
      "8",
      "6"
    ],
    "coil-T": [
      "2",
      "7"
    ],
    "coil-FR": [
      "2",
      "7"
    ],
    "frM1": [
      "8",
      "5"
    ],
    "frM2": [
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
    "text": "전원을 넣으면 EOCR이 두 전동기의 공통 주회로를 감시하고 운전 전원이 준비된다. PB1을 누르면 T가 여자되고 순시 a접점이 PB1을 우회해 운전 경로를 유지한다. PB0의 b접점은 T 코일 앞에 있어 누르면 타이머와 자기유지가 풀린다. T가 계시하는 동안 한시 b접점으로 FR이 여자된다. FR의 첫 간격에는 b접점이 닫혀 MC1·M1과 RL이 동작하고, 다음 간격에는 a접점이 닫혀 MC2·M2와 GL이 동작한다. FR은 설정 간격마다 두 전동기의 운전을 바꾼다. T의 설정시간이 끝나면 한시 b접점이 열려 FR이 복귀하고, FR b접점이 다시 닫혀 MC1이 여자된다. 동시에 T 한시 a접점은 FR a접점을 우회해 MC2를 계속 공급한다. 따라서 시간 완료 뒤에는 M1과 M2가 함께 운전하고 RL·GL도 함께 켜진다. 이 회로에는 두 접촉기를 서로 차단하는 b접점 인터록이 없다. EOCR이 과부하로 동작하면 운전 경로가 끊기고 경보등 YL이 켜진다.",
    "verified": true
  },
  "interpretQuestions": [
    {"id":"q1","prompt":"PB1을 놓아도 T와 운전 경로를 유지하는 접점은?","answerItemIds":["tHold"],"multi":false,"explain":"T 순시 a접점이 PB1을 우회해요."},
    {"id":"q2","prompt":"T가 계시하는 동안 FR을 여자시키는 접점은?","answerItemIds":["tDelayNC"],"multi":false,"explain":"T 한시 b접점이 시간 완료 전까지 닫혀 있어요."},
    {"id":"q3","prompt":"FR 첫 간격에 MC1·M1을 운전시키는 접점은?","answerItemIds":["frM1"],"multi":false,"explain":"FR b접점이 처음에 닫혀 MC1을 공급해요."},
    {"id":"q4","prompt":"FR이 전환되면 MC2·M2를 운전시키는 접점은?","answerItemIds":["frM2"],"multi":false,"explain":"FR a접점이 닫힌 구간에 MC2가 여자돼요."},
    {"id":"q5","prompt":"T 설정시간 뒤 FR이 복귀해도 M2 운전을 유지하는 접점은?","answerItemIds":["tDelayNO"],"multi":false,"explain":"T 한시 a접점이 FR a접점을 우회해 MC2를 공급해요."},
    {"id":"q6","prompt":"T 완료 뒤 M1과 M2를 함께 운전시키는 두 접점을 모두 고르세요.","answerItemIds":["frM1","tDelayNO"],"multi":true,"explain":"FR이 소자되어 b접점은 닫히고 T 한시 a접점도 닫혀요. 이 회로에는 상호 인터록이 없어요."},
    {"id":"q7","prompt":"MC1이 여자되면 RL을 켜는 접점은?","answerItemIds":["mc1Lamp"],"multi":false,"explain":"MC1 보조 a접점이 M1 운전등 RL을 공급해요."},
    {"id":"q8","prompt":"누르면 T 자기유지를 끊고 운전을 멈추는 접점은?","answerItemIds":["pb0"],"multi":false,"explain":"PB0 b접점이 T 코일 앞에서 열려요."},
    {"id":"q9","prompt":"과부하 때 YL 경보를 켜는 접점은?","answerItemIds":["eocrNO"],"multi":false,"explain":"EOCR a접점이 닫혀 YL에 전원을 보내요."}
  ],
  "topology": {
    "motor": "two-independent-three-phase-motors",
    "motor1": "MC1",
    "motor2": "MC2",
    "starDelta": false,
    "twoSpeed": false,
    "electricalInterlock": false
  },
  "layout": {
    "viewBox": [
      1450,
      800
    ],
    "coilY": 650,
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
        "x": 650,
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
        "id": "tHold",
        "cat": "contact",
        "tag": "T",
        "kind": "a",
        "timing": "instant",
        "feat": "",
        "x": 750,
        "rows": [
          185,
          225
        ],
        "nets": [
          "R",
          "S"
        ],
        "label": "T",
        "title": "T 순시 자기유지 a접점"
      },
      {
        "id": "pb0",
        "cat": "pb",
        "tag": "PB0",
        "kind": "b",
        "feat": "pb",
        "x": 650,
        "rows": [
          330,
          370
        ],
        "nets": [
          "S",
          "Tc"
        ],
        "label": "PB0",
        "title": "PB0 정지 b접점"
      },
      {
        "id": "tDelayNC",
        "cat": "contact",
        "tag": "T",
        "kind": "b",
        "timing": "delay",
        "feat": "td",
        "x": 750,
        "rows": [
          330,
          370
        ],
        "nets": [
          "S",
          "FRc"
        ],
        "label": "T",
        "title": "T 한시 b접점"
      },
      {
        "id": "frM1",
        "cat": "contact",
        "tag": "FR",
        "kind": "b",
        "feat": "fl",
        "x": 900,
        "rows": [
          330,
          370
        ],
        "nets": [
          "S",
          "M1c"
        ],
        "label": "FR",
        "title": "FR b접점 · M1"
      },
      {
        "id": "mc1Lamp",
        "cat": "contact",
        "tag": "MC1",
        "kind": "a",
        "feat": "",
        "x": 1040,
        "rows": [
          470,
          510
        ],
        "nets": [
          "S",
          "RLc"
        ],
        "label": "MC1",
        "title": "MC1 표시 a접점"
      },
      {
        "id": "frM2",
        "cat": "contact",
        "tag": "FR",
        "kind": "a",
        "feat": "fl",
        "x": 1170,
        "rows": [
          330,
          370
        ],
        "nets": [
          "S",
          "M2c"
        ],
        "label": "FR",
        "title": "FR a접점 · M2"
      },
      {
        "id": "tDelayNO",
        "cat": "contact",
        "tag": "T",
        "kind": "a",
        "timing": "delay",
        "feat": "td",
        "x": 1330,
        "rows": [
          330,
          370
        ],
        "nets": [
          "S",
          "M2c"
        ],
        "label": "T",
        "title": "T 한시 a접점 · M2"
      },
      {
        "id": "mc2Lamp",
        "cat": "contact",
        "tag": "MC2",
        "kind": "a",
        "feat": "",
        "x": 1330,
        "rows": [
          470,
          510
        ],
        "nets": [
          "M2c",
          "GLc"
        ],
        "label": "MC2",
        "title": "MC2 표시 a접점"
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
        "title": "EOCR 코일",
        "slots": [{ "x": 370, "y": 606, "net": "H" }, { "x": 370, "y": 694, "net": "N" }]
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
        "title": "YL 표시등"
      },
      {
        "id": "coil-T",
        "cat": "coil",
        "tag": "T",
        "x": 650,
        "nets": [
          "Tc",
          "N"
        ],
        "title": "T 코일"
      },
      {
        "id": "coil-FR",
        "cat": "coil",
        "tag": "FR",
        "x": 750,
        "nets": [
          "FRc",
          "N"
        ],
        "title": "FR 코일"
      },
      {
        "id": "coil-MC1",
        "cat": "coil",
        "tag": "MC1",
        "x": 900,
        "nets": [
          "M1c",
          "N"
        ],
        "title": "MC1 코일"
      },
      {
        "id": "coil-RL",
        "cat": "lamp",
        "tag": "RL",
        "x": 1040,
        "nets": [
          "RLc",
          "N"
        ],
        "title": "RL 표시등"
      },
      {
        "id": "coil-MC2",
        "cat": "coil",
        "tag": "MC2",
        "x": 1170,
        "nets": [
          "M2c",
          "N"
        ],
        "title": "MC2 코일"
      },
      {
        "id": "coil-GL",
        "cat": "lamp",
        "tag": "GL",
        "x": 1330,
        "nets": [
          "GLc",
          "N"
        ],
        "title": "GL 표시등"
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
      "eocrNO",
      "coil-YL",
      "pb1",
      "tHold",
      "pb0",
      "coil-T",
      "tDelayNC",
      "coil-FR",
      "frM1",
      "coil-MC1",
      "mc1Lamp",
      "coil-RL",
      "frM2",
      "tDelayNO",
      "coil-MC2",
      "mc2Lamp",
      "coil-GL"
    ],
    "drawing": [
      {
        "t": "text",
        "x": 63,
        "y": 35,
        "s": "L1"
      },
      {
        "t": "term",
        "x": 70,
        "y": 55
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 55,
        "x2": 70,
        "y2": 115
      },
      {
        "t": "breaker",
        "x": 70,
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
        "t": "text",
        "x": 108,
        "y": 35,
        "s": "L2"
      },
      {
        "t": "term",
        "x": 115,
        "y": 55
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 55,
        "x2": 115,
        "y2": 115
      },
      {
        "t": "breaker",
        "x": 115,
        "y1": 115,
        "y2": 145
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 145,
        "x2": 115,
        "y2": 235
      },
      {
        "t": "text",
        "x": 153,
        "y": 35,
        "s": "L3"
      },
      {
        "t": "term",
        "x": 160,
        "y": 55
      },
      {
        "t": "line",
        "x1": 160,
        "y1": 55,
        "x2": 160,
        "y2": 115
      },
      {
        "t": "breaker",
        "x": 160,
        "y1": 115,
        "y2": 145
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
        "x": 55,
        "y": 45,
        "w": 120,
        "h": 20
      },
      {
        "t": "text",
        "x": 10,
        "y": 136,
        "s": "MCCB"
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
        "x": 85,
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
            310
          ],
          [
            230,
            310
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
            325
          ],
          [
            275,
            325
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
            340
          ],
          [
            320,
            340
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
        "t": "text",
        "x": 12,
        "y": 444,
        "s": "MC1"
      },
      {
        "t": "text",
        "x": 184,
        "y": 444,
        "s": "MC2"
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 455,
        "x2": 70,
        "y2": 550
      },
      {
        "t": "term",
        "x": 70,
        "y": 550
      },
      {
        "t": "text",
        "x": 60,
        "y": 535,
        "s": "U1"
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 455,
        "x2": 115,
        "y2": 550
      },
      {
        "t": "term",
        "x": 115,
        "y": 550
      },
      {
        "t": "text",
        "x": 105,
        "y": 535,
        "s": "V1"
      },
      {
        "t": "line",
        "x1": 160,
        "y1": 455,
        "x2": 160,
        "y2": 550
      },
      {
        "t": "term",
        "x": 160,
        "y": 550
      },
      {
        "t": "text",
        "x": 150,
        "y": 535,
        "s": "W1"
      },
      {
        "t": "line",
        "x1": 230,
        "y1": 455,
        "x2": 230,
        "y2": 550
      },
      {
        "t": "term",
        "x": 230,
        "y": 550
      },
      {
        "t": "text",
        "x": 220,
        "y": 535,
        "s": "U2"
      },
      {
        "t": "line",
        "x1": 275,
        "y1": 455,
        "x2": 275,
        "y2": 550
      },
      {
        "t": "term",
        "x": 275,
        "y": 550
      },
      {
        "t": "text",
        "x": 265,
        "y": 535,
        "s": "V2"
      },
      {
        "t": "line",
        "x1": 320,
        "y1": 455,
        "x2": 320,
        "y2": 550
      },
      {
        "t": "term",
        "x": 320,
        "y": 550
      },
      {
        "t": "text",
        "x": 310,
        "y": 535,
        "s": "W2"
      },
      {
        "t": "rect",
        "x": 55,
        "y": 540,
        "w": 120,
        "h": 20
      },
      {
        "t": "rect",
        "x": 215,
        "y": 540,
        "w": 120,
        "h": 20
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
            95,
            600
          ]
        ]
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 554,
        "x2": 115,
        "y2": 595
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
            135,
            600
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            230,
            554
          ],
          [
            230,
            575
          ],
          [
            255,
            600
          ]
        ]
      },
      {
        "t": "line",
        "x1": 275,
        "y1": 554,
        "x2": 275,
        "y2": 595
      },
      {
        "t": "wire",
        "pts": [
          [
            320,
            554
          ],
          [
            320,
            575
          ],
          [
            295,
            600
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
        "t": "motor",
        "x": 275,
        "y": 620,
        "s": "M2"
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
        "x2": 1380,
        "y2": 90
      },
      {
        "t": "line",
        "x1": 370,
        "y1": 760,
        "x2": 1380,
        "y2": 760
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
            760
          ],
          [
            370,
            760
          ]
        ]
      },
      {
        "t": "line",
        "x1": 390,
        "y1": 175,
        "x2": 390,
        "y2": 626
      },
      {
        "t": "line",
        "x1": 390,
        "y1": 674,
        "x2": 390,
        "y2": 760
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
        "y2": 626
      },
      {
        "t": "line",
        "x1": 470,
        "y1": 674,
        "x2": 470,
        "y2": 760
      },
      {
        "t": "line",
        "x1": 650,
        "y1": 90,
        "x2": 650,
        "y2": 185
      },
      {
        "t": "line",
        "x1": 750,
        "y1": 90,
        "x2": 750,
        "y2": 185
      },
      {
        "t": "wire",
        "pts": [
          [
            650,
            225
          ],
          [
            650,
            280
          ],
          [
            750,
            280
          ],
          [
            750,
            225
          ]
        ]
      },
      {
        "t": "line",
        "x1": 650,
        "y1": 280,
        "x2": 650,
        "y2": 330
      },
      {
        "t": "line",
        "x1": 650,
        "y1": 370,
        "x2": 650,
        "y2": 626
      },
      {
        "t": "line",
        "x1": 650,
        "y1": 674,
        "x2": 650,
        "y2": 760
      },
      {
        "t": "wire",
        "pts": [
          [
            650,
            300
          ],
          [
            750,
            300
          ],
          [
            750,
            330
          ]
        ]
      },
      {
        "t": "line",
        "x1": 750,
        "y1": 370,
        "x2": 750,
        "y2": 626
      },
      {
        "t": "line",
        "x1": 750,
        "y1": 674,
        "x2": 750,
        "y2": 760
      },
      {
        "t": "wire",
        "pts": [
          [
            650,
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
        "y2": 626
      },
      {
        "t": "line",
        "x1": 900,
        "y1": 674,
        "x2": 900,
        "y2": 760
      },
      {
        "t": "wire",
        "pts": [
          [
            650,
            300
          ],
          [
            1040,
            300
          ],
          [
            1040,
            470
          ]
        ]
      },
      {
        "t": "line",
        "x1": 1040,
        "y1": 510,
        "x2": 1040,
        "y2": 626
      },
      {
        "t": "line",
        "x1": 1040,
        "y1": 674,
        "x2": 1040,
        "y2": 760
      },
      {
        "t": "wire",
        "pts": [
          [
            650,
            300
          ],
          [
            1170,
            300
          ],
          [
            1170,
            330
          ]
        ]
      },
      {
        "t": "line",
        "x1": 1170,
        "y1": 370,
        "x2": 1170,
        "y2": 626
      },
      {
        "t": "line",
        "x1": 1170,
        "y1": 674,
        "x2": 1170,
        "y2": 760
      },
      {
        "t": "wire",
        "pts": [
          [
            650,
            300
          ],
          [
            1330,
            300
          ],
          [
            1330,
            330
          ]
        ]
      },
      {
        "t": "line",
        "x1": 1330,
        "y1": 370,
        "x2": 1330,
        "y2": 470
      },
      {
        "t": "line",
        "x1": 1330,
        "y1": 510,
        "x2": 1330,
        "y2": 626
      },
      {
        "t": "line",
        "x1": 1330,
        "y1": 674,
        "x2": 1330,
        "y2": 760
      },
      {
        "t": "wire",
        "pts": [
          [
            1170,
            430
          ],
          [
            1330,
            430
          ]
        ]
      },
      {
        "t": "line",
        "x1": 370,
        "y1": 175,
        "x2": 390,
        "y2": 175
      },
      {
        "t": "items"
      }
    ]
  }
};})(typeof window==='undefined'?globalThis:window);
