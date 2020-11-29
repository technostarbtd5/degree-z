export const SCHEDULE_EXAMPLE_JSON = {
  "majors": [
    "Computer Science",
    "ITWS",
  ],
  "minors": [
    "Economics",
  ],
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
    // "Fall 2021": [
    //   {"subject": "CSCI", "course": "4100"},
    //   {"subject": "CSCI", "course": "4220"},
    //   {"subject": "CSCI", "course": "4430"},
    //   {"subject": "ITWS", "course": "4100"},
    //   {"subject": "ECON", "course": "2010"},
    // ],
    // "Spring 2022": [
    //   {"subject": "CSCI", "course": "4150"},
    //   {"subject": "CSCI", "course": "4380"},
    // ],
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
      ]},
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
          "amount": 3
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
          "amount": 3
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
          "amount": 3
        },
      ]},
    ]
  }
}

export const COURSES_EXAMPLE_JSON = {
  "BIOL": {
    "1010": {
      "title": "Introduction to Biology",
      "credits": 3,
      "offered": ["Fall", "Spring", "Summer"],
      "corequisites": [
        {"subject": "BIOL", "course": "1015"}
      ],
    },
    "1015": {
      "title": "Introduction to Biology Laboratory",
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
      "credits": 4,
      "offered": ["Fall", "Spring", "Summer"],
    },
    "1200": {
      "title": "Chemistry II",
      "credits": 4,
      "offered": ["Spring", "Summer"],
    },
  },
  "COMM": {
    "4420": {
      "title": "Foundations of HCI Usability",
      "credits": 4,
      "offered": ["Fall"],
    },
  },
  "CSCI": {
    "1100": {
      "title": "Computer Science I",
      "credits": 4,
      "offered": ["Fall", "Spring", "Summer"],
    },
    "1200": {
      "title": "Data Structures",
      "credits": 4,
      "offered": ["Fall", "Spring"],
    },
    "2200": {
      "title": "Foundations of Computer Science",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "1200"},
        {"subject": "MATH", "course": "1010"},
      ],
    },
    "2300": {
      "title": "Introduction to Algorithms",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2200"},
        {"subject": "MATH", "course": "1010"},
      ],
    },
    "2500": {
      "title": "Computer Organization",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "1200"},
      ],
    },
    "2600": {
      "title": "Principles of Software",
      "credits": 4,
      "offered": ["Spring", "Summer"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2200"},
      ],
    },
    "4100": {
      "title": "Machine Learning from Data",
      "credits": 4,
      "offered": ["Fall"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
      ],
    },
    "4150": {
      "title": "Introduction to Artificial Intelligence",
      "credits": 4,
      "offered": ["Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
      ],
    },
    "4210": {
      "title": "Operating Systems",
      "credits": 4,
      "offered": ["Spring", "Summer"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
        {"subject": "CSCI", "course": "2500"},
      ],
    },
    "4220": {
      "title": "Network Programming",
      "credits": 4,
      "offered": ["Fall"],
      "prerequisites": [
        {"subject": "CSCI", "course": "4210"},
      ],
    },
    "4380": {
      "title": "Database Systems",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
      ],
    },
    "4430": {
      "title": "Programming Languages",
      "credits": 4,
      "offered": ["Fall"],
      "prerequisites": [
        {"subject": "CSCI", "course": "2300"},
        {"subject": "CSCI", "course": "2600"},
      ],
    },
  },
  "ECON": {
    "2010": {
      "title": "Intermediate Microeconomic Theory",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "IHSS", "course": "1200"},
        {"subject": "MATH", "course": "1010"},
      ],
    },
    "2020": {
      "title": "Intermediate Macroeconomic Theory",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "IHSS", "course": "1200"},
        {"subject": "MATH", "course": "1010"},
      ],
    },
    "4130": {
      "title": "Money and Banking",
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
      "credits": 4,
      "offered": ["Fall", "Spring"],
    },
  },
  "ITWS": {
    "1100": {
      "title": "Introduction to Information Technology and Web Science",
      "credits": 4,
      "offered": ["Fall", "Spring"],
    },
    "1220": {
      "title": "IT and Society",
      "credits": 4,
      "offered": ["Spring"],
    },
    "2110": {
      "title": "Web Systems Development",
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
      "credits": 4,
      "offered": ["Spring"],
    },
    "4100": {
      "title": "Information Technology and Web Science Capstone",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "ITWS", "course": "2210"},
        {"subject": "ITWS", "course": "4310"},
      ],
    },
    "4310": {
      "title": "Managing IT Resources",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "ITWS", "course": "2110"},
      ],
    },
    "4500": {
      "title": "Web Science Systems Development",
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
      "credits": 4,
      "offered": ["Fall", "Spring"],
    },
    "1020": {
      "title": "Calculus II",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "MATH", "course": "1010"},
      ],
    },
    "2010": {
      "title": "Multivariable Calculus and Matrix Algebra",
      "credits": 4,
      "offered": ["Fall", "Spring"],
      "prerequisites": [
        {"subject": "MATH", "course": "1020"},
      ],
    },
    "4100": {
      "title": "Linear Algebra",
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
      "credits": 4,
      "offered": ["Fall", "Spring"],
    },
  },
  "PHYS": {
    "1100": {
      "title": "Physics I",
      "credits": 4,
      "offered": ["Fall", "Spring"],
    },
  },
  "STSH": {
    "1000": {
      "title": "Science & Technology Elective",
      "credits": 4,
    },
  },
  "STSS": {
    "1000": {
      "title": "Science & Technology Elective",
      "credits": 4,
    },
  },
  "WRIT": {
    "1000": {
      "title": "Writing Elective",
      "credits": 4,
    },
  },
};

