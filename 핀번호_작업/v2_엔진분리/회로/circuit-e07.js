/* 승강기기능사 07. 원본 7-5쪽 판독 데이터. */
(function(root){'use strict';var C=root.PIN_CIRCUITS=root.PIN_CIRCUITS||{};C.e07={
  "id": "e07",
  "sim": true,
  "title": "승강기기능사 07 · 핀번호 적기",
  "subject": "승강기기능사",
  "source": {
    "doc": "승강기기능사-07-A4, 2022-02-28.pdf",
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
    "frUpper": [
      "8",
      "6"
    ],
    "frLower": [
      "8",
      "5"
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
    "text": "전원을 넣으면 EOCR의 정상 b접점 뒤에 운전 전원이 공급된다. PB1을 누르면 T가 여자되고 순시 a접점이 PB1을 우회한다. T의 한시 b접점과 MC2의 b접점이 닫힌 동안 MC1이 여자되어 권선 끝 X·Y·Z를 한 점으로 묶는 성형 기동이 시작되고 RL이 켜진다. T의 설정시간이 지나면 한시 b접점이 열려 MC1이 복귀한다. 이어 한시 a접점과 MC1의 b접점을 통해 MC2가 여자되어 델타 결선으로 전환된다. MC2의 a접점이 닫히면 FR이 여자되어 표시등을 교대로 제어한다. FR이 여자된 첫 간격에는 b접점 쪽 GL이 켜지고, 다음 간격에는 a접점 쪽 RL이 켜지며 이후 두 표시등이 번갈아 동작한다. MC1·MC2의 b접점은 두 접촉기가 동시에 투입되지 않도록 한다. PB0을 누르면 T가 소자되어 자기유지와 운전이 풀린다. EOCR이 과부하로 동작하면 운전 경로가 끊기고 경보등 YL이 켜진다.",
    "verified": true
  },
  "interpretQuestions": [
    {"id":"q1","prompt":"PB1을 놓아도 성형 기동과 T 계시를 이어 주는 접점은?","answerItemIds":["tHold"],"multi":false,"explain":"T 순시 a접점이 PB1을 우회해요."},
    {"id":"q2","prompt":"T 설정시간 전 MC1 성형 접촉기를 공급하는 접점은?","answerItemIds":["tDelayNC"],"multi":false,"explain":"T 한시 b접점은 시간 완료 전까지 닫혀 있어요."},
    {"id":"q3","prompt":"T 시간이 끝나 MC2 델타 운전 경로를 여는 접점은?","answerItemIds":["tDelayNO"],"multi":false,"explain":"T 한시 a접점이 닫히면 MC1 b접점을 거쳐 MC2가 여자돼요."},
    {"id":"q4","prompt":"성형과 델타 접촉기의 동시 투입을 막는 b접점들을 모두 고르세요.","answerItemIds":["mc1Interlock","mc2Interlock"],"multi":true,"explain":"각 접촉기의 b접점이 상대 코일 앞에 놓여 있어요."},
    {"id":"q5","prompt":"MC2 델타 운전 중 FR 코일에 전원을 보내는 보조 접점은?","answerItemIds":["mc2Lamp"],"multi":false,"explain":"MC2 a접점이 닫히면 FR이 여자돼요."},
    {"id":"q6","prompt":"FR이 여자된 첫 간격에 GL을 켜는 접점은?","answerItemIds":["frLower"],"multi":false,"explain":"FR b접점은 첫 간격에 닫혀 GL을 공급해요."},
    {"id":"q7","prompt":"FR이 다음 간격으로 전환되면 RL을 켜는 접점은?","answerItemIds":["frUpper"],"multi":false,"explain":"FR a접점이 닫혀 RL을 공급해요."},
    {"id":"q8","prompt":"누르면 T 자기유지를 끊고 운전을 멈추는 접점은?","answerItemIds":["pb0"],"multi":false,"explain":"PB0 b접점이 T 코일 앞에서 열려요."},
    {"id":"q9","prompt":"과부하 때 YL 경보를 켜는 접점은?","answerItemIds":["eocrNO"],"multi":false,"explain":"EOCR a접점이 닫혀 YL에 전원을 보내요."}
  ],
  "topology": {
    "motor": "single-six-terminal-star-delta",
    "starContactor": "MC1",
    "deltaContactor": "MC2",
    "starDelta": true,
    "twoSpeed": false,
    "note": "layout.main은 각 기구의 3극 핀 칸만 나타낸다. X·Y·Z 공통점과 Δ 교차 결선은 drawing에 별도로 그렸다. 엔진 스키마 검토 필요."
  },
  "layout": {
    "viewBox": [
      1450,
      860
    ],
    "coilY": 680,
    "main": [
      {
        "tag": "MCCB",
        "xs": [
          70,
          115,
          160
        ],
        "slotY": [
          100,
          165
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
          230,
          295
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
          585,
          650
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
          720,
          785
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
          360,
          400
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
          360,
          400
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
          360,
          400
        ],
        "nets": [
          "S",
          "M1a"
        ],
        "label": "T",
        "title": "T 한시 b접점"
      },
      {
        "id": "mc2Interlock",
        "cat": "contact",
        "tag": "MC2",
        "kind": "b",
        "feat": "",
        "x": 750,
        "rows": [
          500,
          540
        ],
        "nets": [
          "M1a",
          "M1c"
        ],
        "label": "MC2",
        "title": "MC2 b접점 · MC1 인터록"
      },
      {
        "id": "tDelayNO",
        "cat": "contact",
        "tag": "T",
        "kind": "a",
        "timing": "delay",
        "feat": "td",
        "x": 900,
        "rows": [
          360,
          400
        ],
        "nets": [
          "S",
          "M2a"
        ],
        "label": "T",
        "title": "T 한시 a접점"
      },
      {
        "id": "mc1Interlock",
        "cat": "contact",
        "tag": "MC1",
        "kind": "b",
        "feat": "",
        "x": 900,
        "rows": [
          500,
          540
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
        "x": 1070,
        "rows": [
          185,
          225
        ],
        "nets": [
          "R",
          "RLc"
        ],
        "label": "MC1",
        "title": "MC1 표시 a접점"
      },
      {
        "id": "frUpper",
        "cat": "contact",
        "tag": "FR",
        "kind": "a",
        "feat": "fl",
        "x": 1180,
        "rows": [
          360,
          400
        ],
        "slots": [
          {
            "x": 1152,
            "y": 400,
            "net": "FRC"
          },
          {
            "x": 1152,
            "y": 360,
            "net": "RLc"
          }
        ],
        "label": "FR",
        "title": "FR 상단 a접점 · 공통은 아래"
      },
      {
        "id": "frLower",
        "cat": "contact",
        "tag": "FR",
        "kind": "b",
        "feat": "fl",
        "x": 1180,
        "rows": [
          500,
          540
        ],
        "nets": [
          "FRC",
          "GLc"
        ],
        "label": "FR",
        "title": "FR 하단 b접점"
      },
      {
        "id": "mc2Lamp",
        "cat": "contact",
        "tag": "MC2",
        "kind": "a",
        "feat": "",
        "x": 1320,
        "rows": [
          185,
          225
        ],
        "nets": [
          "R",
          "FRC"
        ],
        "label": "MC2",
        "title": "MC2 보조 a접점 · FR 전원"
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
        "slots": [{ "x": 370, "y": 636, "net": "H" }, { "x": 370, "y": 724, "net": "N" }]
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
        "id": "coil-MC1",
        "cat": "coil",
        "tag": "MC1",
        "x": 750,
        "nets": [
          "M1c",
          "N"
        ],
        "title": "MC1 코일"
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
        "x": 1070,
        "nets": [
          "RLc",
          "N"
        ],
        "title": "RL 표시등"
      },
      {
        "id": "coil-GL",
        "cat": "lamp",
        "tag": "GL",
        "x": 1180,
        "nets": [
          "GLc",
          "N"
        ],
        "title": "GL 표시등"
      },
      {
        "id": "coil-FR",
        "cat": "coil",
        "tag": "FR",
        "x": 1320,
        "nets": [
          "FRC",
          "N"
        ],
        "title": "FR 코일"
      }
    ],
    "order": [
      "main-MCCB-0",
      "main-MCCB-1",
      "main-MCCB-2",
      "main-EOCR-0",
      "main-EOCR-1",
      "main-EOCR-2",
      "main-MC2-0",
      "main-MC2-1",
      "main-MC2-2",
      "main-MC1-0",
      "main-MC1-1",
      "main-MC1-2",
      "coil-EOCR",
      "eocrNC",
      "eocrNO",
      "coil-YL",
      "pb1",
      "tHold",
      "pb0",
      "coil-T",
      "tDelayNC",
      "mc2Interlock",
      "coil-MC1",
      "tDelayNO",
      "mc1Interlock",
      "coil-MC2",
      "mc1Lamp",
      "coil-RL",
      "frUpper",
      "frLower",
      "coil-GL",
      "mc2Lamp",
      "coil-FR"
    ],
    "drawing": [
      {
        "t": "text",
        "x": 65,
        "y": 35,
        "s": "L1"
      },
      {
        "t": "text",
        "x": 110,
        "y": 35,
        "s": "L2"
      },
      {
        "t": "text",
        "x": 155,
        "y": 35,
        "s": "L3"
      },
      {
        "t": "rect",
        "x": 55,
        "y": 45,
        "w": 120,
        "h": 20
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
        "y2": 120
      },
      {
        "t": "breaker",
        "x": 70,
        "y1": 120,
        "y2": 150
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 150,
        "x2": 70,
        "y2": 245
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 275,
        "x2": 70,
        "y2": 360
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
        "y2": 120
      },
      {
        "t": "breaker",
        "x": 115,
        "y1": 120,
        "y2": 150
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 150,
        "x2": 115,
        "y2": 245
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 275,
        "x2": 115,
        "y2": 360
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
        "y2": 120
      },
      {
        "t": "breaker",
        "x": 160,
        "y1": 120,
        "y2": 150
      },
      {
        "t": "line",
        "x1": 160,
        "y1": 150,
        "x2": 160,
        "y2": 245
      },
      {
        "t": "line",
        "x1": 160,
        "y1": 275,
        "x2": 160,
        "y2": 360
      },
      {
        "t": "text",
        "x": 10,
        "y": 138,
        "s": "MCCB"
      },
      {
        "t": "rect",
        "x": 55,
        "y": 245,
        "w": 120,
        "h": 30
      },
      {
        "t": "text",
        "x": 85,
        "y": 265,
        "s": "EOCR"
      },
      {
        "t": "term",
        "x": 70,
        "y": 360
      },
      {
        "t": "text",
        "x": 64,
        "y": 385,
        "s": "U"
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 360,
        "x2": 70,
        "y2": 415
      },
      {
        "t": "term",
        "x": 115,
        "y": 360
      },
      {
        "t": "text",
        "x": 109,
        "y": 385,
        "s": "V"
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 360,
        "x2": 115,
        "y2": 415
      },
      {
        "t": "term",
        "x": 160,
        "y": 360
      },
      {
        "t": "text",
        "x": 154,
        "y": 385,
        "s": "W"
      },
      {
        "t": "line",
        "x1": 160,
        "y1": 360,
        "x2": 160,
        "y2": 415
      },
      {
        "t": "motor",
        "x": 115,
        "y": 448,
        "s": "M"
      },
      {
        "t": "text",
        "x": 64,
        "y": 510,
        "s": "X"
      },
      {
        "t": "term",
        "x": 70,
        "y": 520
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 520,
        "x2": 70,
        "y2": 740
      },
      {
        "t": "text",
        "x": 109,
        "y": 510,
        "s": "Y"
      },
      {
        "t": "term",
        "x": 115,
        "y": 520
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 520,
        "x2": 115,
        "y2": 740
      },
      {
        "t": "text",
        "x": 154,
        "y": 510,
        "s": "Z"
      },
      {
        "t": "term",
        "x": 160,
        "y": 520
      },
      {
        "t": "line",
        "x1": 160,
        "y1": 520,
        "x2": 160,
        "y2": 740
      },
      {
        "t": "wire",
        "pts": [
          [
            70,
            320
          ],
          [
            230,
            320
          ],
          [
            230,
            605
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            115,
            335
          ],
          [
            275,
            335
          ],
          [
            275,
            605
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            160,
            350
          ],
          [
            320,
            350
          ],
          [
            320,
            605
          ]
        ]
      },
      {
        "t": "mc",
        "x": 230,
        "y1": 605,
        "y2": 635
      },
      {
        "t": "mc",
        "x": 275,
        "y1": 605,
        "y2": 635
      },
      {
        "t": "mc",
        "x": 320,
        "y1": 605,
        "y2": 635
      },
      {
        "t": "wire",
        "pts": [
          [
            230,
            635
          ],
          [
            230,
            665
          ],
          [
            160,
            665
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
            635
          ],
          [
            275,
            680
          ],
          [
            70,
            680
          ],
          [
            70,
            520
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            320,
            635
          ],
          [
            320,
            695
          ],
          [
            115,
            695
          ],
          [
            115,
            520
          ]
        ]
      },
      {
        "t": "mc",
        "x": 70,
        "y1": 740,
        "y2": 770
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 770,
        "x2": 70,
        "y2": 805
      },
      {
        "t": "mc",
        "x": 115,
        "y1": 740,
        "y2": 770
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 770,
        "x2": 115,
        "y2": 805
      },
      {
        "t": "mc",
        "x": 160,
        "y1": 740,
        "y2": 770
      },
      {
        "t": "line",
        "x1": 160,
        "y1": 770,
        "x2": 160,
        "y2": 805
      },
      {
        "t": "line",
        "x1": 70,
        "y1": 805,
        "x2": 160,
        "y2": 805
      },
      {
        "t": "text",
        "x": 15,
        "y": 625,
        "s": "MC2"
      },
      {
        "t": "text",
        "x": 15,
        "y": 758,
        "s": "MC1"
      },
      {
        "t": "wire",
        "pts": [
          [
            70,
            180
          ],
          [
            370,
            180
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
        "y1": 810,
        "x2": 1380,
        "y2": 810
      },
      {
        "t": "wire",
        "pts": [
          [
            160,
            200
          ],
          [
            350,
            200
          ],
          [
            350,
            810
          ],
          [
            370,
            810
          ]
        ]
      },
      {
        "t": "line",
        "x1": 390,
        "y1": 180,
        "x2": 390,
        "y2": 656
      },
      {
        "t": "line",
        "x1": 390,
        "y1": 704,
        "x2": 390,
        "y2": 810
      },
      {
        "t": "wire",
        "pts": [
          [
            390,
            310
          ],
          [
            470,
            310
          ],
          [
            470,
            360
          ]
        ]
      },
      {
        "t": "line",
        "x1": 470,
        "y1": 400,
        "x2": 470,
        "y2": 656
      },
      {
        "t": "line",
        "x1": 470,
        "y1": 704,
        "x2": 470,
        "y2": 810
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
        "y2": 360
      },
      {
        "t": "line",
        "x1": 650,
        "y1": 400,
        "x2": 650,
        "y2": 656
      },
      {
        "t": "line",
        "x1": 650,
        "y1": 704,
        "x2": 650,
        "y2": 810
      },
      {
        "t": "line",
        "x1": 750,
        "y1": 280,
        "x2": 750,
        "y2": 360
      },
      {
        "t": "line",
        "x1": 750,
        "y1": 400,
        "x2": 750,
        "y2": 500
      },
      {
        "t": "line",
        "x1": 750,
        "y1": 540,
        "x2": 750,
        "y2": 656
      },
      {
        "t": "line",
        "x1": 750,
        "y1": 704,
        "x2": 750,
        "y2": 810
      },
      {
        "t": "wire",
        "pts": [
          [
            650,
            320
          ],
          [
            900,
            320
          ],
          [
            900,
            360
          ]
        ]
      },
      {
        "t": "line",
        "x1": 900,
        "y1": 400,
        "x2": 900,
        "y2": 500
      },
      {
        "t": "line",
        "x1": 900,
        "y1": 540,
        "x2": 900,
        "y2": 656
      },
      {
        "t": "line",
        "x1": 900,
        "y1": 704,
        "x2": 900,
        "y2": 810
      },
      {
        "t": "line",
        "x1": 1070,
        "y1": 90,
        "x2": 1070,
        "y2": 185
      },
      {
        "t": "line",
        "x1": 1070,
        "y1": 225,
        "x2": 1070,
        "y2": 656
      },
      {
        "t": "line",
        "x1": 1070,
        "y1": 704,
        "x2": 1070,
        "y2": 810
      },
      {
        "t": "wire",
        "pts": [
          [
            1070,
            300
          ],
          [
            1180,
            300
          ],
          [
            1180,
            354.8
          ]
        ]
      },
      {
        "t": "line",
        "x1": 1180,
        "y1": 405.2,
        "x2": 1180,
        "y2": 500
      },
      {
        "t": "line",
        "x1": 1180,
        "y1": 540,
        "x2": 1180,
        "y2": 656
      },
      {
        "t": "line",
        "x1": 1180,
        "y1": 704,
        "x2": 1180,
        "y2": 810
      },
      {
        "t": "line",
        "x1": 1320,
        "y1": 90,
        "x2": 1320,
        "y2": 185
      },
      {
        "t": "line",
        "x1": 1320,
        "y1": 225,
        "x2": 1320,
        "y2": 656
      },
      {
        "t": "line",
        "x1": 1320,
        "y1": 704,
        "x2": 1320,
        "y2": 810
      },
      {
        "t": "wire",
        "pts": [
          [
            1180,
            460
          ],
          [
            1320,
            460
          ]
        ]
      },
      {
        "t": "line",
        "x1": 370,
        "y1": 180,
        "x2": 390,
        "y2": 180
      },
      {
        "t": "wire",
        "pts": [
          [
            70,
            415
          ],
          [
            70,
            425
          ],
          [
            93,
            437
          ]
        ]
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 415,
        "x2": 115,
        "y2": 424
      },
      {
        "t": "wire",
        "pts": [
          [
            160,
            415
          ],
          [
            160,
            425
          ],
          [
            137,
            437
          ]
        ]
      },
      {
        "t": "wire",
        "pts": [
          [
            93,
            459
          ],
          [
            70,
            485
          ],
          [
            70,
            520
          ]
        ]
      },
      {
        "t": "line",
        "x1": 115,
        "y1": 472,
        "x2": 115,
        "y2": 520
      },
      {
        "t": "wire",
        "pts": [
          [
            137,
            459
          ],
          [
            160,
            485
          ],
          [
            160,
            520
          ]
        ]
      },
      {
        "t": "items"
      }
    ]
  },
  "needsReview": true
};})(typeof window==='undefined'?globalThis:window);
