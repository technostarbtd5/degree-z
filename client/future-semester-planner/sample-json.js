export const SCHEDULE_EXAMPLE_JSON = {
  "majors": [
    "Computer Science",
    "ITWS",
  ],
  "minors": [
    "Economics",
  ],
  "starting semester": "Fall 2019",
  "semesters": {
    "transfer": [
      {"subject": "CHEM", "course": "1100"},
      {"subject": "CHEM", "course": "1200"},
      {"subject": "CSCI", "course": "1100"},
      {"subject": "MATH", "course": "1010"},
      {"subject": "MATH", "course": "1020"},
      {"subject": "MGMT", "course": "2100"},
      {"subject": "PHYS", "course": "1100"},
      {"subject": "STSH", "course": "1000"},
      {"subject": "STSS", "course": "1000"},
      {"subject": "STSS", "course": "1000"},
      {"subject": "WRIT", "course": "1000"},
    ],
    "Fall 2019": [
      {"subject": "BIOL", "course": "1010"},
      {"subject": "BIOL", "course": "1015"},
      {"subject": "CSCI", "course": "1200"},
      {"subject": "IHSS", "course": "1200"},
      {"subject": "MATH", "course": "2010"},
    ],
    "Spring 2020": [
      {"subject": "CSCI", "course": "2200"},
      {"subject": "CSCI", "course": "2500"},
      {"subject": "ECON", "course": "2020"},
      {"subject": "ITWS", "course": "1100"},
      {"subject": "ITWS", "course": "1220"},
    ],
    "Fall 2020": [
      {"subject": "CSCI", "course": "2300"},
      {"subject": "MATH", "course": "4100"},
      {"subject": "COMM", "course": "4420"},
      {"subject": "ECON", "course": "4130"},
      {"subject": "ITWS", "course": "2110"},
    ],
    "Spring 2021": [
      {"subject": "CSCI", "course": "2600"},
      {"subject": "CSCI", "course": "4210"},
      {"subject": "ITWS", "course": "2210"},
      {"subject": "ITWS", "course": "4310"},
      {"subject": "ITWS", "course": "4500"},
    ],
    "Fall 2021": [
      {"subject": "CSCI", "course": "4100"},
      {"subject": "CSCI", "course": "4220"},
      {"subject": "CSCI", "course": "4430"},
      {"subject": "ITWS", "course": "4100"},
      {"subject": "ECON", "course": "2010"},
    ],
    "Spring 2022": [
      {"subject": "CSCI", "course": "4150"},
      {"subject": "CSCI", "course": "4380"},
    ],
  },
};

export const MAJORS_EXAMPLE_JSON = {
  "Computer Science": {
    "requirements": [
      {"subject": "CSCI", "course": "1100", "optional": true},
      {"subject": "CSCI", "course": "1200"},
      {"subject": "CSCI", "course": "2200"},
      {"subject": "CSCI", "course": "2500"},
      {"subject": "CSCI", "course": "2300"},
      {"subject": "CSCI", "course": "2600"},
      {"subject": "CSCI", "course": "4210"},
      {"subject": "CSCI", "course": "4430"},
      {"subject": "MATH", "course": "1010"},
      {"subject": "MATH", "course": "1020"},
      {"subject": "BIOL", "course": "1010"},
      {"subject": "BIOL", "course": "1015"},
      {"subject": "PHYS", "course": "1100"},
      {"one of": [
        {"subject": "MATH", "course": "2010"},
        {"subject": "MATH", "course": "4030"},
        {"subject": "MATH", "course": "4040"},
        {"subject": "MATH", "course": "4100"},
        {"subject": "MATP", "course": "4600"},
      ], "category name": "Math Option I"},
      {"subject": "MATH", "minLevel": 2000},
      {"one of": [
        {"subject": "CSCI", "course": "4961"},
        {
          "n of": [
            {"subject": "CSCI", "course": "4020"},
            {"subject": "CSCI", "course": "6020"},
            {"subject": "CSCI", "course": "4030"},
            {"subject": "CSCI", "course": "6030"},
            {"subject": "CSCI", "course": "4040"},
            {"subject": "CSCI", "course": "6040"},
            {"subject": "CSCI", "course": "4100"},
            {"subject": "CSCI", "course": "6100"},
            {"subject": "CSCI", "course": "4110"},
            {"subject": "CSCI", "course": "6110"},
            {"subject": "CSCI", "course": "4120"},
            {"subject": "CSCI", "course": "6120"},
            {"subject": "CSCI", "course": "4150"},
            {"subject": "CSCI", "course": "4230"},
            {"subject": "CSCI", "course": "6230"},
            {"subject": "CSCI", "course": "4250"},
            {"subject": "CSCI", "course": "6250"},
            {"subject": "CSCI", "course": "4260"},
            {"subject": "CSCI", "course": "4420"},
            {"subject": "CSCI", "course": "4510"},
            {"subject": "CSCI", "course": "6510"},
            {"subject": "CSCI", "course": "4800"},
            {"subject": "CSCI", "course": "4820"},
          ],
          "amount": 3, "category name": "Theory and Algorithms"
        },
        {
          "n of": [
            {"subject": "CSCI", "course": "4220"},
            {"subject": "CSCI", "course": "4310"},
            {"subject": "CSCI", "course": "6310"},
            {"subject": "CSCI", "course": "4320"},
            {"subject": "CSCI", "course": "6360"},
            {"subject": "CSCI", "course": "4380"},
            {"subject": "CSCI", "course": "4440"},
            {"subject": "CSCI", "course": "4450"},
            {"subject": "CSCI", "course": "6450"},
            {"subject": "CSCI", "course": "4460"},
            {"subject": "CSCI", "course": "6460"},
            {"subject": "CSCI", "course": "4500"},
            {"subject": "CSCI", "course": "6500"},
            {"subject": "CSCI", "course": "4510"},
            {"subject": "CSCI", "course": "6510"},
            {"subject": "CSCI", "course": "4470"},
          ],
          "amount": 3, "category name": "Systems and Software"
        },
        {
          "n of": [
            {"subject": "CSCI", "course": "4100"},
            {"subject": "CSCI", "course": "6100"},
            {"subject": "CSCI", "course": "4110"},
            {"subject": "CSCI", "course": "6110"},
            {"subject": "CSCI", "course": "4130"},
            {"subject": "CSCI", "course": "6130"},
            {"subject": "CSCI", "course": "4150"},
            {"subject": "CSCI", "course": "4270"},
            {"subject": "CSCI", "course": "6270"},
            {"subject": "CSCI", "course": "4340"},
            {"subject": "CSCI", "course": "6340"},
            {"subject": "CSCI", "course": "4350"},
            {"subject": "CSCI", "course": "6350"},
            {"subject": "CSCI", "course": "4370"},
            {"subject": "CSCI", "course": "6370"},
            {"subject": "CSCI", "course": "4380"},
            {"subject": "CSCI", "course": "4390"},
            {"subject": "CSCI", "course": "6390"},
            {"subject": "CSCI", "course": "4400"},
            {"subject": "CSCI", "course": "6400"},
            {"subject": "CSCI", "course": "4420"},
            {"subject": "CSCI", "course": "4480"},
            {"subject": "CSCI", "course": "4600"},
            {"subject": "CSCI", "course": "6600"},
          ],
          "amount": 3, "category name": "AI & Data"
        },
      ], "category name": "CS Capstone"},
    ]
  },
  "ITWS": {
    "requirements": [
      // Core requirements
      {"subject": "ITWS", "course": "1100"},
      {"subject": "ITWS", "course": "2110"},
      {"subject": "ITWS", "course": "1220"},
      {"subject": "ITWS", "course": "2210"},
      {"subject": "ITWS", "course": "4500"},
      {"subject": "ITWS", "course": "4310"},
      {"subject": "MATH", "course": "1010"},
      {"subject": "CSCI", "course": "1100"},
      {"subject": "CSCI", "course": "1200"},
      {"subject": "BIOL", "minLevel": 1000},
      {"subject": "PHYS", "minLevel": 1000},
      {"subject": "MATH", "minLevel": 1000},
      {"one of": [
        {"subject": "ITWS", "course": "4100"},
        {"subject": "ITWS", "course": "4990"},
      ], "category name": "ITWS Capstone/Research"},
      // {"one of": [
      //   {"subject": "CSCI", "course": "4380"},
      //   {"subject": "MGMT", "course": "4170"},
      // ]},
      {"one of": [
        {"all of": [ // Web Technologies
          {"subject": "CSCI", "course": "2200"},
          {"subject": "CSCI", "course": "2300"},
          {"subject": "CSCI", "course": "2500"},
          {"subject": "CSCI", "course": "2600"},
          {"subject": "CSCI", "course": "4210"},
          {"subject": "CSCI", "course": "4220"},
          {"subject": "CSCI", "course": "4380"},
          {"one of": [ // Comm design elective
            {"subject": "COMM", "course": "2660"},
            {"subject": "COMM", "course": "4320"},
            {"subject": "COMM", "course": "4420"},
            {"subject": "COMM", "course": "4690"},
            {"subject": "COMM", "course": "4460"},
            {"subject": "COMM", "course": "4470"},
            {"subject": "COMM", "course": "4690"},
          ], "category name": "Communication Design Elective"},
          {"one of": [ // Intel. systems
            {"subject": "COGS", "course": "4210"},
            {"subject": "ISYE", "course": "4810"},
            {"subject": "CSCI", "course": "4100"},
            {"subject": "CSCI", "course": "4150"},
          ], "category name": "Intelligent Systems Elective"},
          {"one of": [ // Assessment
            {"subject": "COMM", "course": "4420"},
            {"subject": "COMM", "course": "4470"},
            {"subject": "ISYE", "course": "4760"},
            {"subject": "MGMT", "course": "2100"},
          ], "category name": "Assessment Elective"},
          {"one of": [ // Computing
            {"subject": "CSCI", "course": "4020"},
            {"subject": "CSCI", "course": "4320"},
            {"subject": "CSCI", "course": "4430"},
            {"subject": "ECSE", "course": "4750"},
          ], "category name": "Computing Elective"},
          {"one of": [ // Database
            {"subject": "CSCI", "course": "4390"},
            {"subject": "CSCI", "course": "4100"},
            {"subject": "CSCI", "course": "4150"},
            {"subject": "CSCI", "course": "4440"},
          ], "category name": "Database Elective"},
        ], "category name": "Web Technologies"},

      ], "category name": "ITWS Concentration"},
    ]
  },
}

export const COURSES_EXAMPLE_JSON = {
  "BIOL": {
    "1010": {
      "title": "Introduction to Biology",
      "shorthand": "Intro to Bio",
      "credits": 3,
      "offered": ["Fall", "Spring", "Summer"],
      "corequisites": [
        {"subject": "BIOL", "course": "1015"}
      ],
    },
    "1015": {
      "title": "Introduction to Biology Laboratory",
      "shorthand": "Intro to Bio Lab",
      "credits": 1,
      "offered": ["Fall", "Spring", "Summer"],
      "corequisites": [
        {"subject": "BIOL", "course": "1010"},
      ],
    },
  },
  "CHEM": {
    "1100": {
      "title": "Chemistry I",
      "shorthand": "Chem I",
      "credits": 4,
      "offered": ["Fall", "Spring", "Summer"],
    },
    "1200": {
      "title": "Chemistry II",
      "shorthand": "Chem II",
      "credits": 4,
      "offered": ["Spring", "Summer"],
    },
  },
  "COMM": {
    "4420": {
      "title": "Foundations of HCI Usability",
      "shorthand": "HCI Usability",
      "credits": 4,
      "offered": ["Fall"],
    },
  },
  "CSCI": {
    "1100": {
      "title": "Computer Science I",
      "shorthand": "CS1",
      "credits": 4,
      "offered": ["Fall", "Spring", "Summer"],
    },
    "1200": {
      "title": "Data Structures",
      "shorthand": "Data Structures",
      "credits": 4,
      "offered": ["Fall", "Spring"],
    },
    "2200": {
      "title": "Foundations of Computer Science",
      "shorthand": "FOCS",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "1200"},
        {"subject": "MATH", "course": "1010"},
      ],
    },
    "2300": {
      "title": "Introduction to Algorithms",
      "shorthand": "Algo",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2200"},
        {"subject": "MATH", "course": "1010"},
      ],
    },
    "2500": {
      "title": "Computer Organization",
      "shorthand": "CompOrg",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "1200"},
      ],
    },
    "2600": {
      "title": "Principles of Software",
      "shorthand": "PSoft",
      "credits": 4,
      "offered": ["Spring", "Summer"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2200"},
      ],
    },
    "2961": {
      "title": "Rensselaer Center for Open Source",
      "shorthand": "RCOS",
      "credits": 4,
      "offered": ["Fall", "Spring", "Summer"],
    },
    "4020": {
      "title": "Design and Analysis of Algorithms",
      "shorthand": "Algo Design",
      "credits": 4,
      "offered": ["Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
      ],
    },
    "4030": {
      "title": "Randomized Algorithms",
      "shorthand": "Random Algos",
      "credits": 4,
      "offered": ["Fall"],
      "prerequisites": [
        {"subject": "CSCI", "course": "4020"},
      ],
    },
    "4100": {
      "title": "Machine Learning from Data",
      "shorthand": "ML from Data",
      "credits": 4,
      "offered": ["Fall"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
      ],
    },
    "4150": {
      "title": "Introduction to Artificial Intelligence",
      "shorthand": "Intro to AI",
      "credits": 4,
      "offered": ["Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
      ],
    },
    "4210": {
      "title": "Operating Systems",
      "shorthand": "OpSys",
      "credits": 4,
      "offered": ["Spring", "Summer"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
        {"subject": "CSCI", "course": "2500"},
      ],
    },
    "4220": {
      "title": "Network Programming",
      "shorthand": "NetProg",
      "credits": 4,
      "offered": ["Fall"],
      "prerequisites": [
        {"subject": "CSCI", "course": "4210"},
      ],
    },
    "4230": {
      "title": "Cryptograph and Network Security I",
      "shorthand": "Crypto I",
      "credits": 4,
      "offered": ["Fall"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
      ],
    },
    "4260": {
      "title": "Graph Theory",
      "shorthand": "Graph Theory",
      "credits": 4,
      "offered": ["Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "1100"},
        {"subject": "CSCI", "course": "2200"},
      ],
    },
    "4270": {
      "title": "Computational Vision",
      "shorthand": "Comp. Vision",
      "credits": 4,
      "offered": ["Fall"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
        {"subject": "MATH", "course": "2010"},
      ],
    },
    "4320": {
      "title": "Parallel Programming",
      "shorthand": "Parallel Prog",
      "credits": 4,
      "offered": ["Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
        {"subject": "CSCI", "course": "2500"},
      ],
    },
    "4340": {
      "title": "Ontologies",
      "shorthand": "Ontologies",
      "credits": 4,
      "offered": ["Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
      ],
    },
    "4350": {
      "title": "Data Science",
      "shorthand": "Data Science",
      "credits": 4,
      "offered": ["Fall"],
      "prerequisites": [
        {"subject": "CSCI", "course": "1200"},
      ],
    },
    "4380": {
      "title": "Database Systems",
      "shorthand": "Database",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
      ],
    },
    "4390": {
      "title": "Data Mining",
      "shorthand": "Data Mining",
      "credits": 4,
      "offered": ["Fall"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
      ],
    },
    "4430": {
      "title": "Programming Languages",
      "shorthand": "ProgLang",
      "credits": 4,
      "offered": ["Fall"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
        {"subject": "CSCI", "course": "2600"},
      ],
    },
    "4440": {
      "title": "Software Design and Documentation",
      "shorthand": "Software Doc",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
      ],
    },
    "4460": {
      "title": "Large-Scale Programming and Testing",
      "shorthand": "Large-Scale Prog.",
      "credits": 4,
      "offered": ["Fall"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2600"},
      ],
    },
    "4470": {
      "title": "Open Source Software",
      "shorthand": "Open Source",
      "credits": 4,
      "offered": ["Spring", "Summer"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
        {"subject": "CSCI", "course": "2600"},
      ],
    },
    "4480": {
      "title": "Robotics I",
      "shorthand": "Robotics I",
      "credits": 3,
      "offered": ["Fall"],
      "prerequisites": [
        {"subject": "MATH", "course": "2400"},
      ],
    },
    "4500": {
      "title": "Distributed Computing Over The Internet",
      "shorthand": "DistComp",
      "credits": 4,
      "offered": ["Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "4430"},
        {"subject": "CSCI", "course": "4210"},
      ],
    },
    "4510": {
      "title": "Distributed Systems and Algorithms",
      "shorthand": "Dist Sys & Algo",
      "credits": 4,
      "offered": ["Fall"],
      "prerequisites": [
        {"subject": "CSCI", "course": "4210"},
      ],
    },
  },
  "ECON": {
    "2010": {
      "title": "Intermediate Microeconomic Theory",
      "shorthand": "Microecon",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "IHSS", "course": "1200"},
        {"subject": "MATH", "course": "1010"},
      ],
    },
    "2020": {
      "title": "Intermediate Macroeconomic Theory",
      "shorthand": "Macroecon",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "IHSS", "course": "1200"},
        {"subject": "MATH", "course": "1010"},
      ],
    },
    "4130": {
      "title": "Money and Banking",
      "shorthand": "Money & Banking",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "IHSS", "course": "1200"},
      ],
    },
  },
  "IHSS": {
    "1200": {
      "title": "Principles of Economics",
      "shorthand": "Principles of Econ",
      "credits": 4,
      "offered": ["Fall", "Spring"],
    },
  },
  "ITWS": {
    "1100": {
      "title": "Introduction to Information Technology and Web Science",
      "shorthand": "Intro to ITWS",
      "credits": 4,
      "offered": ["Fall", "Spring"],
    },
    "1220": {
      "title": "IT and Society",
      "shorthand": "IT & Society",
      "credits": 4,
      "offered": ["Spring"],
    },
    "2110": {
      "title": "Web Systems Development",
      "shorthand": "WebSys",
      "credits": 4,
      "offered": ["Fall"],
      "prerequisites": [
        {"subject": "ITWS", "course": "1100"},
      ],
      "corequisites": [
        {"subject": "CSCI", "course": "1200"},
      ]
    },
    "2210": {
      "title": "Introduction to Human Computer Interaction",
      "shorthand": "Intro to HCI",
      "credits": 4,
      "offered": ["Spring"],
    },
    "4100": {
      "title": "Information Technology and Web Science Capstone",
      "shorthand": "ITWS Capstone",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "ITWS", "course": "2210"},
        {"subject": "ITWS", "course": "4310"},
      ],
    },
    "4310": {
      "title": "Managing IT Resources",
      "shorthand": "MITR",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "ITWS", "course": "2110"},
      ],
    },
    "4500": {
      "title": "Web Science Systems Development",
      "shorthand": "WebSci",
      "credits": 4,
      "offered": ["Spring"],
      "prerequisites": [
        {"subject": "ITWS", "course": "2110"},
      ],
    },
  },
  "MATH": {
    "1010": {
      "title": "Calculus I",
      "shorthand": "Calc I",
      "credits": 4,
      "offered": ["Fall", "Spring"],
    },
    "1020": {
      "title": "Calculus II",
      "shorthand": "Calc II",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "MATH", "course": "1010"},
      ],
    },
    "2010": {
      "title": "Multivariable Calculus and Matrix Algebra",
      "shorthand": "Multivar", 
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "MATH", "course": "1020"},
      ],
    },
    "2400": {
      "title": "Introduction to Differential Equations",
      "shorthand": "DiffEq",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "MATH", "course": "1020"},
      ],
    },
    "4100": {
      "title": "Linear Algebra",
      "shorthand": "Linalg",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "MATH", "course": "2010"},
      ],
    },
  },
  "MGMT": {
    "2100": {
      "title": "Statistical Methods",
      "shorthand": "Stats",
      "credits": 4,
      "offered": ["Fall", "Spring"],
    },
  },
  "PHYS": {
    "1100": {
      "title": "Physics I",
      "shorthand": "Physics I",
      "credits": 4,
      "offered": ["Fall", "Spring"],
    },
  },
  "STSH": {
    "1000": {
      "title": "Science & Technology Elective",
      "shorthand": "STSH Elective",
      "credits": 4,
    },
  },
  "STSS": {
    "1000": {
      "title": "Science & Technology Elective",
      "shorthand": "STSS Elective",
      "credits": 4,
    },
  },
  "WRIT": {
    "1000": {
      "title": "Writing Elective",
      "shorthand": "WRIT Elective",
      "credits": 4,
    },
  },
};

