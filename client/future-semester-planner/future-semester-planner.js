import {SCHEDULE_EXAMPLE_JSON, COURSES_EXAMPLE_JSON, MAJORS_EXAMPLE_JSON} from "./sample-json.js";

/**
 * Assert whether semester is a valid string in the format "Spring|Summer|Fall YYYY"
 * @param {string} semester
 * @returns {boolean}
 */
function isValidSemester(semester) {
  const [term, year] = semester.split(" ");
  if (isNaN(year)) return false;
  return ["Spring", "Summer", "Fall"].includes(term);
}

/**
 * Fetch the numeric form of the semester based on current semester
 * @param {string} semester String in form "Spring|Summer|Fall YYYY"
 * @returns {string} String if currentSemester is valid; undefined otherwise
 */
function numericSemester(semester) {
    // Assert valid semester
    if (!isValidSemester(semester)) return undefined;

    const [term, year] = semester.split(" ");
    switch (term) {
      case "Spring":
        return parseInt(year) * 3;
      case "Summer":
        return parseInt(year) * 3 + 1;
      case "Fall":
        return parseInt(year) * 3 + 2;
      default:
        return undefined; // Assert valid semester
    }
}

/**
 * Fetch the next semester based on current semester
 * @param {string} currentSemester String in form "Spring|Summer|Fall YYYY"
 * @returns {string} String if currentSemester is valid; undefined otherwise
 */
function nextSemester(currentSemester) {
  // Assert valid semester
  if(!isValidSemester(currentSemester)) return undefined;

  const [term, year] = currentSemester.split(" ");
  switch (term) {
    case "Spring":
      return `Summer ${parseInt(year)}`;
    case "Summer":
      return `Fall ${parseInt(year)}`;
    case "Fall":
      return `Spring ${parseInt(year) + 1}`;
    default:
      return undefined; // Assert valid semester
  }
}

/**
 * Take semesters a student is active and return a list of all semesters.
 * @param {string[]} semesters All semesters present in a schedule
 * @returns {string[]} An array of all semesters occuring in the range of present semesters
 */
function getSemesterRange(semesters) {
  console.log(semesters);
  const semestersToParse = semesters.filter(isValidSemester);
  const firstSemester = semestersToParse.reduce((earliest, semester) => {
    if (numericSemester(semester) < numericSemester(earliest)) return semester;
    return earliest;
  });
  const uncheckedSemesters = new Set(semestersToParse);
  uncheckedSemesters.delete(firstSemester);
  const semesterRange = [firstSemester];
  while (uncheckedSemesters.size) {
    const next = nextSemester(semesterRange[semesterRange.length - 1]);
    semesterRange.push(next);
    uncheckedSemesters.delete(next);
  }
  return semesterRange;
}

function getCourseObject(subject, course) {
  return COURSES_EXAMPLE_JSON[subject][course];
}

function getAllCourses() {
  return Object.entries(COURSES_EXAMPLE_JSON).map(([subject, courses]) => Object.keys(courses).map(course => `${subject} ${course}`)).flat();
}

function getCoursesInMajor(major) {
  if (!(major in MAJORS_EXAMPLE_JSON)) return new Set();
  const majorCourses = MAJORS_EXAMPLE_JSON[major];
  const getCoursesInArray = array => {
    return array.map(courseElement => {
      if ("subject" in courseElement && "course" in courseElement) {
        return `${courseElement.subject} ${courseElement.course}`
      } else if ("subject" in courseElement && "minLevel" in courseElement) {
        return Object.keys(COURSES_EXAMPLE_JSON[courseElement.subject])
            .filter(course => course >= courseElement.minLevel)
            .map(course => `${courseElement.subject} ${course}`);
      } else if ("n of" in courseElement || "one of" in courseElement) {
        return getCoursesInArray(courseElement["n of"] || courseElement["one of"]);
      }
    }).flat();
  }
  return new Set(getCoursesInArray(majorCourses.requirements).sort());
}

console.log(getCoursesInMajor("Computer Science"));

// function getMajorHTML

function getCourseHTML(subject, course, tileID) {
  const courseObject = getCourseObject(subject, course);
  return `<div class="fsp-course-container" id="${tileID}-container">
    <div class="fsp-course" id="${tileID}">
      <div class="fsp-course-code">${subject} ${course} <div class="fsp-direction-indicator">&#x25b6;</div></div>
      <div class="fsp-course-details">
        <div class="fsp-course-title">${courseObject.title}</div>
        ${"credits" in courseObject ? `<div class="fsp-course-details-credits">Credits: ${courseObject.credits}</div>` : ""}
        ${"offered" in courseObject ? `<div class="fsp-course-details-offered">Offered in: ${
          courseObject.offered.join(", ")
        }</div>` : ""}
        ${"prerequisites" in courseObject ? `<div class="fsp-course-details-prerequisites">Prerequisites: ${
          courseObject.prerequisites.map(prereq => `${prereq.subject} ${prereq.course}`).join(", ")
        }</div>` : ""}
        ${"corequisites" in courseObject ? `<div class="fsp-course-details-corequisites">Corequisites: ${
          courseObject.corequisites.map(coreq => `${coreq.subject} ${coreq.course}`).join(", ")
        }</div>` : ""}
      </div>
    </div>
  </div>
  `
}

const CSCourses = getCoursesInMajor("Computer Science");

class CourseComponent {
  static numComponents = 0;
  constructor (subject, course, semester) {
    this.id = CourseComponent.numComponents++;
    this.tileID = `course-tile-${this.id}`;
    this.subject = subject;
    this.course = course;
    this.semester = semester || "unscheduled";
    this.render.bind(this);
    this.addPrereqWarning.bind(this);
  }

  render(planner, parentElement) {
    parentElement.append(getCourseHTML(this.subject, this.course, this.tileID));

    const {tileID, subject, course} = this;
    // Add course color
    const courseColor = CSCourses.has(`${subject} ${course}`) ? "#ff9" : "#fbb";
    $(`#${tileID}`).css({"background-color": courseColor});

    $(`#${tileID}`).draggable({
      start: () => {
        $(`#${tileID}`).css({"z-index": 5});
        $(`#fsp-course-drag`).offset($(`#${tileID}`).offset());
        $(`#fsp-course-drag`).append($(`#${tileID}`));
        this.isDragging = true;
      },
      // drag: () => {
      //   $(`#${tileID}`).css({"position": "absolute"});
      // },
      // zIndex: 5,
      // stack: "#fsp-requirements-list, .fsp-content, .fsp-canvas, .fsp-row",
      stop: () => {
        const courseObject = {subject, course};
        const fromSemester = this.semester;
        const potentialTo = [...planner.potentialToSemesters];
        const toSemester = potentialTo.length > 0 ? potentialTo[0] : fromSemester;
        planner.moveCourse(courseObject, fromSemester, toSemester);
      },
      drag: () => {
        planner.renderMinorChanges();
      },
      scroll: false,
    });

    // Add details toggle
    $(`#${tileID} .fsp-course-details`).hide();
    
    $(`#${tileID} .fsp-course-code`).click(() => {
      const isVisible = $(`#${tileID} .fsp-course-details`).is(":visible");
      $(`.fsp-course-details`).hide(0);
      $(`.fsp-course`).css({"z-index": 2});
      $(`.fsp-direction-indicator`).html("&#x25b6;");
      if (isVisible) {
        $(`#${tileID} .fsp-course-details`).hide(0);
        $(`#${tileID} .fsp-course-code .fsp-direction-indicator`).html("&#x25b6;");
      } else {
        $(`#${tileID}-container`).css({"max-height": $(`#${tileID}-container`).outerHeight()});
        $(`#${tileID} .fsp-course-details`).show(0);
        $(`#${tileID}`).css({"z-index": 3});
        $(`#${tileID} .fsp-course-code .fsp-direction-indicator`).html("&#x25bc;");
      }
    });

    $(`#${tileID}`).hover(() => {planner.renderMinorChanges()}, () => {planner.renderMinorChanges()});

    return this;
  }

  addPrereqWarning(unfilledPrereqs) {
    if (unfilledPrereqs.length > 0) {
      this.prereqWarning = true;
      $(`#${this.tileID}`).css({"box-shadow": "0px 0px 10px red", "border-color": "red", "borer-width": "3px"});
      $(`#${this.tileID}`).tooltip({content: `Missing prerequisites: ${unfilledPrereqs.join(", ")}`});
    }
  }

  static resetItems() {
    CourseComponent.numComponents = 0;
  }
}

class SemesterDeleteComponent {
  static numComponents = 0;
  constructor (semester) {
    this.id = SemesterDeleteComponent.numComponents++;
    this.semester = semester;
  }

  render (planner, parentElement) {
    parentElement.append(`<div class="fsp-semester-delete" id="fsp-semester-delete-${this.id}">-</div>`);
    $(`#fsp-semester-delete-${this.id}`).click(() => {
      console.log(`Deleting ${this.semester}`);
      // delete planner.schedule.semesters[this.semester];
      planner.dropSemester(this.semester);
    });
  }

  static resetItems() {
    SemesterDeleteComponent.numComponents = 0;
  }
}

class SemesterRowComponent {
  static numComponents = 0;
  courseComponents = [];

  constructor (semester, schedule, semesterList) {
    this.id = SemesterRowComponent.numComponents++;
    this.rowID = `fsp-row-${this.id}`;
    this.classesID = `semester-${this.id}-classes`
    this.semester = semester;
    this.schedule = schedule;
    this.semesterList = semesterList;
    this.getUnfilledPrereqs.bind(this);
    this.render.bind(this);
  }

  getUnfilledPrereqs(subject, course) {
    const {semester, semesterList} = this;
    const {semesters} = this.schedule;
    if (semester == "transfer" || semester == "unscheduled") return [];
    let beforeSemester = true;
    // console.log(`Prereqs for ${subject} ${course}`);
    const prereqs = new Set((getCourseObject(subject, course).prerequisites || []).map(prereq => `${prereq.subject} ${prereq.course}`));
    semesterList.forEach(searchSemester => {
      // console
      if (searchSemester == semester && searchSemester != "transfer") beforeSemester = false;
      if (beforeSemester) {
        const semesterClasses = semesters[searchSemester];
        (semesterClasses || []).forEach(semesterCourse => {
          // if (prereqs.has(`${semesterCourse.subject} ${semesterCourse.course}`)) console.log(`Removing ${semesterCourse.subject} ${semesterCourse.course}`)
          prereqs.delete(`${semesterCourse.subject} ${semesterCourse.course}`);
        });
      }
      if (searchSemester == semester) beforeSemester = false;
    });
    // console.log([...prereqs]);
    return [...prereqs];
  }

  render(planner, parentElement) {
    const {rowID, classesID, schedule, semester} = this;
    const semesterClasses = schedule.semesters[semester]
    parentElement.append(`<div class="fsp-row ${!semesterClasses || semesterClasses.length == 0 ? "no-classes" : ""}" id="${rowID}">
      <div class="fsp-semester-name"><div class="fsp-name-container" id="${rowID}-semester-name">${semester}</div></div>
      <div class="fsp-semester-classes" id="${classesID}"></div>
    </div>`);
    
    (new SemesterDeleteComponent(semester)).render(planner, $(`#${rowID}-semester-name`));

    $(`#${rowID}`).droppable({
      tolerance: "pointer",
      over: () => {
        $(`#${rowID}`).addClass("fsp-row-active");
        planner.potentialToSemesters.add(semester);
      },
      out: () => {
        $(`#${rowID}`).removeClass("fsp-row-active");
        planner.potentialToSemesters.delete(semester);
      },
    });

    if(semesterClasses && semesterClasses.length > 0) {
      semesterClasses.forEach(course => {
        const courseComponent = new CourseComponent(course.subject, course.course, semester).render(planner, $(`#${classesID}`));;
        // courseComponent
        const unfilledPrereqs = this.getUnfilledPrereqs(course.subject, course.course);
        courseComponent.addPrereqWarning(unfilledPrereqs);
        this.courseComponents.push(courseComponent);
      });
    } else {
      $(`#${classesID}`).append(`<div class="fsp-semester-no-courses">No courses</div>`);
    }


    return this;
  }

  static resetItems() {
    SemesterRowComponent.numComponents = 0;
  }
}

class MajorNavbarComponent {
  constructor (majors) {
    this.majors = majors;
    this.render.bind(this);
  }

  render(planner, parentElement) {
    console.log("Rendering navbar");
    const augmentedMajors = this.majors.concat(["Electives", "Repeat Courses"]);
    console.log(augmentedMajors);
    const {selectedMajor} = planner;
    augmentedMajors.forEach((major, index) => {
      const id = `fsp-major-button-${index}`;
      parentElement.append(`<div class="fsp-major-button ${major == selectedMajor ? "fsp-major-button-selected" : ""}" id="${id}">${major}</div>`);
      $(`#${id}`).click(() => {
        planner.selectedMajor = major;
        planner.renderPlanner();
      });
    });
    return this;
  }
}

class MajorRequirementComponent {
  static numComponents = 0;
  constructor (requirementName, requirements, validCourses) {
    this.id = MajorRequirementComponent.numComponents++;
    this.requirementName = requirementName;
    this.requirements = requirements;
    this.validCourses = validCourses;
    this.render.bind(this);
  }

  render(planner, parentElement) {
    const {id, requirementName, requirements, validCourses} = this;
    const titleID = `fsp-list-title-${id}`
    const segmentID = `fsp-list-segment-${id}`
    parentElement.append(`<div class="fsp-list-title" id="${titleID}">${requirementName}<div class="fsp-direction-indicator">&#x25bc;</div></div>
    <div class="fsp-list-segment" id="${segmentID}"></div>`);
    console.log(requirements);
    requirements.forEach(requirement => {
      if ("subject" in requirement && "course" in requirement) {
        // return `${requirement.subject} ${requirement.course}`
        const {subject, course} = requirement;
        // console.log(`Rendering ${subject} ${course}`);
        if (validCourses.has(`${subject} ${course}`)) {
          // console.log("Confirmed");
          // const containerID = MajorRequirementComponent.courseContainerID++;
          // $(`#${segmentID}`).append(`<div class="requirement-course-container" id="course-container-${containerID}"></div>`);
          (new CourseComponent(requirement.subject, requirement.course)).render(planner, $(`#${segmentID}`));
        }
      } else if ("subject" in requirement && "minLevel" in requirement) {
        console.log(Object.keys(COURSES_EXAMPLE_JSON[requirement.subject]).filter(course => course >= requirement.minLevel));
        const newRequirements = Object.keys(COURSES_EXAMPLE_JSON[requirement.subject])
            .filter(course => course >= requirement.minLevel)
            .map(course => ({subject: requirement.subject, course}));
        console.log(newRequirements);
        (new MajorRequirementComponent(`${requirement.subject} course above level ${requirement.minLevel}:`, newRequirements, validCourses))
            .render(planner, $(`#${segmentID}`));
        // return Object.keys(COURSES_EXAMPLE_JSON[requirement.subject])
        //     .filter(course => course >= requirement.minLevel)
        //     .map(course => `${requirement.subject} ${course}`);
      } else if ("n of" in requirement || "one of" in requirement) {
        // return getCoursesInArray(requirement["n of"] || requirement["one of"]);
        const newRequirements = requirement["n of"] || requirement["one of"];
        const newRequirementName = "n of" in requirement ? `${requirement.amount} of:` : "One of:";
        (new MajorRequirementComponent(newRequirementName, newRequirements, validCourses))
            .render(planner, $(`#${segmentID}`));
      }
    });
    
    // Add visibility toggle
    $(`#${titleID}`).click(() => {
      const isVisible = $(`#${segmentID}`).is(":visible");
      if (isVisible) {
        $(`#${segmentID}`).hide(0);
        $(`#${titleID} .fsp-direction-indicator`).html("&#x25b6;");
      } else {
        $(`#${segmentID}`).show(0);
        $(`#${titleID} .fsp-direction-indicator`).html("&#x25bc;");
      }
    })
  }

  static resetItems() {
    MajorRequirementComponent.numComponents = 0;
  }
}

class MajorListComponent {
  constructor (selectedMajor, allCourses, existingCourses, unscheduledCourses) {
    this.selectedMajor = selectedMajor;
    this.allCourses = allCourses;
    this.existingCourses = existingCourses;
    this.unscheduledCourses = unscheduledCourses;
    this.render.bind(this);
  }

  render (planner, parentElement) {
    parentElement.append(`<div id="fsp-requirements-list"></div>`);
    if (this.selectedMajor == "Electives") {
      // unscheduledCoursesTileIDs.forEach(course => {
      //   // $(`#fsp-list-segment-0`).append(getCourseHTML(course.subject, course.course, course.tileID));
      // })
      const electiveOptions = [...this.unscheduledCourses].map(courseString => {
        const [subject, course] = courseString.split(" ");
        return {subject, course};
      });
      (new MajorRequirementComponent("Electives:", electiveOptions, this.unscheduledCourses))
          .render(planner, $("#fsp-requirements-list"));
    } else if (this.selectedMajor == "Repeat Courses") {
      // Object.values(coursesWithTileIDs).flat().forEach(course => {
      //   // $(`#fsp-list-segment-0`).append(getCourseHTML(course.subject, course.course, course.tileID));
      // });
      const repeatOptions = [...this.existingCourses].map(courseString => {
        const [subject, course] = courseString.split(" ");
        return {subject, course};
      });
      (new MajorRequirementComponent("Repeat Courses:", repeatOptions, this.existingCourses))
          .render(planner, $("#fsp-requirements-list"));
    } else {
      
      (new MajorRequirementComponent("Requirements:", MAJORS_EXAMPLE_JSON[this.selectedMajor] ? MAJORS_EXAMPLE_JSON[this.selectedMajor].requirements : [], this.unscheduledCourses))
          .render(planner, $("#fsp-requirements-list"));
      // const appendCourses = (requirements, parentID) => {
      //   requirements.forEach(courseElement => {
      //     if ("subject" in courseElement && "course" in courseElement) {
      //       // return `${courseElement.subject} ${courseElement.course}`
      //       // $(`#fsp-list-segment-0`).append(getCourseHTML(course.subject, course.course, course.tileID));
      //     } else if ("subject" in courseElement && "minLevel" in courseElement) {
      //       // return Object.keys(COURSES_EXAMPLE_JSON[courseElement.subject])
      //       //     .filter(course => course >= courseElement.minLevel)
      //       //     .map(course => `${courseElement.subject} ${course}`);
      //     } else if ("n of" in courseElement || "one of" in courseElement) {
      //       // return getCoursesInArray(courseElement["n of"] || courseElement["one of"]);
      //     }
      //   })
      // }
    }

    $(`#fsp-classes-list`).droppable({
      tolerance: "pointer",
      over: () => {
        $(`#fsp-requirements-list`).addClass("fsp-row-active");
        // $(`.fsp-list-title, .fsp-list-segment`).css({"border-color": "#999"});
        $(`.fsp-list-title, .fsp-list-segment`).addClass("fsp-list-active");
        planner.potentialToSemesters.add("unscheduled");
      },
      out: () => {
        $(`#fsp-requirements-list`).removeClass("fsp-row-active");
        // $(`.fsp-list-title, .fsp-list-segment`).css({"border-color": "#ddd"})
        $(`.fsp-list-title, .fsp-list-segment`).removeClass("fsp-list-active");
        planner.potentialToSemesters.delete("unscheduled");
      },
    });
  }
}

class AddSemeseterComponent {
  constructor(newSemester) {
    this.newSemester = newSemester;
    this.render.bind(this);
  }

  render (planner, parentElement) {
    parentElement.append(`<div class="fsp-add-sem-container"><div id="fsp-planner-add-semester">+</div></div>`);
    $("#fsp-planner-add-semester").droppable({
      over: () => {
        $(`#fsp-planner-add-semester`).addClass("fsp-row-active");
        planner.potentialToSemesters.add(this.newSemester);
      },
      out: () => {
        $(`#fsp-planner-add-semester`).removeClass("fsp-row-active");
        planner.potentialToSemesters.delete(this.newSemester);
      },
    });
    $("#fsp-planner-add-semester").click(() => {
      planner.schedule.semesters[this.newSemester] = [];
      planner.renderPlanner();
    });
  }
}

class CanvasComponent {
  connectionVerticalOffsets = {};

  constructor (semesterRows, canvas) {
    this.semesterRows = semesterRows;
    this.canvas = canvas;
    this.draw.bind(this);
    this.getPaths.bind(this);
    this.getCourseCanvasLocation.bind(this);
    this.drawCanvasLine.bind(this);
    this.drawConnectorArc.bind(this);
    this.drawCoursePath.bind(this);
    this.getMinRowHeight.bind(this);
    this.getConnectionVerticalOffset.bind(this);
  } 

  draw (planner) {
    this.canvas.canvas.width = $(`#fsp-content`).outerWidth();
    this.canvas.canvas.height = $(`#fsp-content`).outerHeight();
    const paths = this.getPaths();
    this.semesterRows.forEach(semesterRow => {
      semesterRow.courseComponents.forEach(courseComponent => {
        const {tileID} = courseComponent;
        const pathsFromCourse = paths[tileID];
        pathsFromCourse.forEach(path => this.drawCoursePath(path));
      });
    });
  }

  getPaths () {
    const mostRecentCourseInstance = {};
    const pathsFromTileID = {};
    this.semesterRows.forEach(semesterRow => {
      const currentSemesterCourses = {};
      const {semester} = semesterRow;
      semesterRow.courseComponents.forEach(courseComponent => {
        const {subject, course, tileID} = courseComponent;
        const position = this.getCourseCanvasLocation(tileID);
        const {prerequisites, corequisites} = getCourseObject(subject, course);
        const courseString = `${subject} ${course}`;
        currentSemesterCourses[courseString] = {id: tileID, position, semester, courseComponent};
        pathsFromTileID[tileID] = [];
        // pathsFromTileID[tileID] = [];
        // Add prereq paths
        (prerequisites || []).forEach(prereq => {
          const prereqString = `${prereq.subject} ${prereq.course}`;
          if (prereqString in mostRecentCourseInstance) {
            const id = mostRecentCourseInstance[prereqString].id;
            const prereqPosition = mostRecentCourseInstance[prereqString].position;
            const fromSemester = mostRecentCourseInstance[prereqString].semester;
            const fromComponent = mostRecentCourseInstance[prereqString].courseComponent;
            pathsFromTileID[id].push({from: prereqPosition, to: position, fromSemester, toSemester: semester, fromComponent, toComponent: courseComponent});
          }
        });

        // Add coreq paths
        (corequisites || []).forEach(coreq => {
          const coreqString = `${coreq.subject} ${coreq.course}`;
          if (coreqString in currentSemesterCourses) {
            const id = currentSemesterCourses[coreqString].id;
            const coreqPosition = currentSemesterCourses[coreqString].position;
            const fromComponent = currentSemesterCourses[coreqString].courseComponent;
            pathsFromTileID[id].push({from: coreqPosition, to: position, fromSemester: semester, toSemester: semester, fromComponent, toComponent: courseComponent});
          }
        });

      });
      Object.entries(currentSemesterCourses).forEach(([courseString, details]) => {
        mostRecentCourseInstance[courseString] = details;
      });
    });

    return pathsFromTileID;
  }

  getCourseCanvasLocation(tileID) {
    const targetOffset = $(`#${tileID}`).offset();
    const canvasOffset = $(`#fsp-canvas`).offset();
    return {
      top: targetOffset.top + $(`#${tileID}`).outerHeight() / 2 - canvasOffset.top,
      left: targetOffset.left + $(`#${tileID}`).outerWidth() / 2 - canvasOffset.left,
    };
  }

  getMinRowHeight(semester) {
    const semesterRowIndex = this.semesterRows.findIndex(row => row.semester == semester);
    if (semesterRowIndex < 0) return 0;
    const semesterRow = this.semesterRows[semesterRowIndex];
    const componentHeights = semesterRow.courseComponents.filter(courseComponent => !courseComponent.isDragging).map(courseComponent => this.getCourseCanvasLocation(courseComponent.tileID).top);
    return componentHeights.length > 0 ? Math.min(...componentHeights) : 0;
  }

  drawCoursePath(pathObject) {
    const {from, to, fromSemester, toSemester, fromComponent, toComponent} = pathObject;
    // console.log(`Drawing path ${JSON.stringify({from, to})}`);
    if($(`#${toComponent.tileID}`).is(":hover") || ($(`#${fromComponent.tileID}`).is(":hover") && fromSemester == toSemester)) {
      if (toComponent.prereqWarning) {
        this.canvas.strokeStyle = '#990000';
      } else {
        this.canvas.strokeStyle = '#009900';
      }
      this.canvas.lineWidth = 2;
    } else if ($(`#${fromComponent.tileID}`).is(":hover")) {
      this.canvas.strokeStyle = '#007799';
      this.canvas.lineWidth = 2;
    } else {
      this.canvas.strokeStyle = '#999999';
      this.canvas.lineWidth = 1;
    }
    // this.drawCanvasLine(from, to);

    if (fromSemester == toSemester) {
      this.drawCanvasLine(from, to);
    } else {
      const {canvas} = this;
      canvas.beginPath();
      canvas.moveTo(from.left, from.top);
      // just draw straight line for vertical alignment
      if (Math.abs(from.left - to.left) < 10) {
        canvas.lineTo(from.left, to.top);
        canvas.stroke();
      } else {
        const horizontalLineLocation = Math.min(this.getConnectionVerticalOffset(fromComponent.tileID, toSemester), to.top);
        if (from.top < horizontalLineLocation) {
          canvas.lineTo(from.left, horizontalLineLocation - 5);
          canvas.stroke();
          if (from.left < to.left) {
            canvas.beginPath();
            canvas.arc(from.left + 5, horizontalLineLocation - 5, 5, 0.5 * Math.PI, Math.PI);
            canvas.stroke();
            canvas.moveTo(from.left + 5, horizontalLineLocation);
            canvas.lineTo(to.left - 5, horizontalLineLocation);
            canvas.stroke();
            canvas.beginPath();
            canvas.arc(to.left - 5, horizontalLineLocation + 5, 5, 1.5 * Math.PI, 2 * Math.PI);
            canvas.stroke();
            canvas.moveTo(to.left, horizontalLineLocation + 5);
            canvas.lineTo(to.left, to.top);
            canvas.stroke();
          } else {
            canvas.beginPath();
            canvas.arc(from.left - 5, horizontalLineLocation - 5, 5, 0, 0.5 * Math.PI);
            canvas.stroke();
            canvas.moveTo(from.left - 5, horizontalLineLocation);
            canvas.lineTo(to.left + 5, horizontalLineLocation);
            canvas.stroke();
            canvas.beginPath();
            canvas.arc(to.left + 5, horizontalLineLocation + 5, 5, 1 * Math.PI, 1.5 * Math.PI);
            canvas.stroke();
            canvas.moveTo(to.left, horizontalLineLocation + 5);
            canvas.lineTo(to.left, to.top);
            canvas.stroke();
          }
        } else {
          canvas.lineTo(from.left, horizontalLineLocation + 5);
          canvas.stroke();
          if (from.left < to.left) {
            canvas.beginPath();
            canvas.arc(from.left + 5, horizontalLineLocation + 5, 5, 1 * Math.PI, 1.5 * Math.PI);
            canvas.stroke();
            canvas.moveTo(from.left + 5, horizontalLineLocation);
            canvas.lineTo(to.left - 5, horizontalLineLocation);
            canvas.stroke();
            canvas.beginPath();
            canvas.arc(to.left - 5, horizontalLineLocation - 5, 5, 1.5 * Math.PI, 2 * Math.PI);
            canvas.stroke();
            canvas.moveTo(to.left, horizontalLineLocation - 5);
            canvas.lineTo(to.left, to.top);
            canvas.stroke();
          } else {
            canvas.beginPath();
            canvas.arc(from.left - 5, horizontalLineLocation + 5, 5, 1.5 * Math.PI, 2 * Math.PI);
            canvas.stroke();
            canvas.moveTo(from.left - 5, horizontalLineLocation);
            canvas.lineTo(to.left + 5, horizontalLineLocation);
            canvas.stroke();
            canvas.beginPath();
            canvas.arc(to.left + 5, horizontalLineLocation - 5, 5, 1 * Math.PI, 1.5 * Math.PI);
            canvas.stroke();
            canvas.moveTo(to.left, horizontalLineLocation - 5);
            canvas.lineTo(to.left, to.top);
            canvas.stroke();
          }
        }

      }
    }
  }

  getConnectionVerticalOffset(tileID, toSemester) {
    if (this.connectionVerticalOffsets[tileID] !== undefined && this.connectionVerticalOffsets[tileID][toSemester] !== undefined) {
      return this.connectionVerticalOffsets[tileID][toSemester];
    } else {
      const minRowHeight = this.getMinRowHeight(toSemester);
      const fromHeight = this.getCourseCanvasLocation(tileID).top;
      if (minRowHeight  - 35 < fromHeight) {
        return minRowHeight;
      } else {
        return minRowHeight - 35;
      }
    }
  }

  drawCanvasLine(from, to) {
    const {canvas} = this;
    canvas.beginPath();
    canvas.moveTo(from.left, from.top);
    canvas.lineTo(to.left, to.top);
    canvas.stroke();
  }

  drawConnectorArc(line1Endpoint, line2Endpoint) {

  }
}

class PlannerHeader {

}

class Planner {
  schedule = JSON.parse(JSON.stringify(SCHEDULE_EXAMPLE_JSON));
  potentialToSemesters = new Set();
  selectedMajor = this.schedule.majors.length > 0 ? this.schedule.majors[0] : "Electives";
  semesterRows = [];
  // mouse = {x: 0, y: 0};
  // isDragging = false;
  constructor() {
    console.log(this.schedule);
    this.renderPlanner();
    // $(document).mousemove(e => {
    //   this.mouse.x = e.pageX;
    //   this.mouse.y = e.pageY;
    //   console.log(`Mouse move: ${JSON.stringify(this.mouse)}; Dragging? ${this.isDragging}`);
    // })

    this.resetPlanner.bind(this);
    this.renderPlanner.bind(this);
    this.moveCourse.bind(this);
    this.getSchedule.bind(this);
    this.getCourseCanvasLocation.bind(this);
    this.drawCanvasLine.bind(this);
    this.dropSemester.bind(this);
  }

  /**
   * Reset all relevant items on re-render
   */
  resetPlanner() {
    CourseComponent.resetItems();
    SemesterRowComponent.resetItems();
    MajorRequirementComponent.resetItems();
    SemesterDeleteComponent.resetItems();
    const fsp = $("#fsp-content");
    fsp.html("");
    $("#fsp-classes-navbar").html("");
    $("#fsp-classes-list").html("");
    $(`#fsp-course-drag`).html("");
    this.potentialToSemesters = new Set();
    this.semesterRows = [];
  }


  renderMinorChanges() {
    const canvas = document.getElementById("fsp-canvas").getContext("2d");
    this.canvasComponent = (new CanvasComponent(this.semesterRows, canvas));
    this.canvasComponent.draw(this);
  }

  /**
   * Render planner canvas and div
   */
  renderPlanner() {
    // Object.kets*this.schedule.semesters
    this.resetPlanner();
    const startingSemester = this.schedule["starting semester"];

    const scheduleSemesters = Object.keys(this.schedule.semesters);
    scheduleSemesters.forEach(semester => this.schedule.semesters[semester].sort((a, b) => `${a.subject} ${a.course}` < `${b.subject} ${b.course}` ? -1 : 1));
    const normalSemesters = getSemesterRange([...new Set(scheduleSemesters.concat([startingSemester]))]);
    const normalSemestersSet = new Set(normalSemesters);
    const otherSemesters = [...new Set(scheduleSemesters.concat(["transfer"]))].filter(semester => !normalSemestersSet.has(semester));
    const semesterList = otherSemesters.concat(normalSemesters);

    const canvas = document.getElementById("fsp-canvas").getContext("2d");
    const fsp = $("#fsp-content");
    

    const allCourses = new Set(getAllCourses());
    const existingCourses = new Set(Object.values(this.schedule.semesters).map(courses => courses.map(course => `${course.subject} ${course.course}`)).flat());
    const unscheduledCourses = new Set([...allCourses].filter(course => !existingCourses.has(course)));

    console.log(allCourses);
    console.log(existingCourses);
    console.log(unscheduledCourses);

    // Render sidebar
    const majorNavbar = (new MajorNavbarComponent(this.schedule.majors)).render(this, $('#fsp-classes-navbar'));

    const majorList = (new MajorListComponent(this.selectedMajor, allCourses, existingCourses, unscheduledCourses)).render(this, $("#fsp-classes-list"));



    // this.potentialToSemesters = new Set();

    // const {semesters} = this.schedule;
    // const unscheduledCourseObjects = [...unscheduledCourses].map(courseString => {
    //   const [subject, course] = courseString.split(" ");
    //   return {subject, course};
    // });

    /*
    let id = 0;
    const coursesWithTileIDs = Object.entries(this.schedule.semesters).reduce((semesterWithTileIDs, [semester, courses]) => {
      semesterWithTileIDs[semester] = courses.map(course => ({subject: course.subject, course: course.course, tileID: `course-tile-${id++}`}));
      return semesterWithTileIDs;
    }, {});

    // Add unscheduled courses
    // coursesWithTileIDs["unscheduled"] 
    const unscheduledCoursesTileIDs = [...unscheduledCourses].map(courseString => {
      const [subject, course] = courseString.split(" ");
      return {subject, course, tileID: `course-tile-${id++}`};
    })
    console.log(unscheduledCoursesTileIDs);

    */
    console.log(semesterList);

    /*
    const getUnfilledPrereqs = (subject, course, semester) => {
      if (semester == "transfer" || semester == "unscheduled") return [];
      let beforeSemester = true;
      // console.log(`Prereqs for ${subject} ${course}`);
      const prereqs = new Set((getCourseObject(subject, course).prerequisites || []).map(prereq => `${prereq.subject} ${prereq.course}`));
      semesterList.forEach(searchSemester => {
        // console
        if (searchSemester == semester && searchSemester != "transfer") beforeSemester = false;
        if (beforeSemester) {
          const semesterClasses = semesters[searchSemester];
          (semesterClasses || []).forEach(semesterCourse => {
            // if (prereqs.has(`${semesterCourse.subject} ${semesterCourse.course}`)) console.log(`Removing ${semesterCourse.subject} ${semesterCourse.course}`)
            prereqs.delete(`${semesterCourse.subject} ${semesterCourse.course}`);
          });
        }
        if (searchSemester == semester) beforeSemester = false;
      });
      // console.log([...prereqs]);
      return [...prereqs];
    }*/

    // Generate unscheduled courses list
    /*
    let listSegmentID = 0;
    $(`#fsp-classes-list`).append(`<div class="fsp-list-title" id="fsp-list-${listSegmentID}">${this.selectedMajor}</div>
    <div class="fsp-list-segment" id="fsp-list-segment-${listSegmentID}"></div>`);
    listSegmentID++;
    if (this.selectedMajor == "Electives") {
      // unscheduledCoursesTileIDs.forEach(course => {
      //   // $(`#fsp-list-segment-0`).append(getCourseHTML(course.subject, course.course, course.tileID));
      // })
    } else if (this.selectedMajor == "Repeat Courses") {
      // Object.values(coursesWithTileIDs).flat().forEach(course => {
      //   // $(`#fsp-list-segment-0`).append(getCourseHTML(course.subject, course.course, course.tileID));
      // });
    } else {
      const appendCourses = (requirements, parentID) => {
        requirements.forEach(courseElement => {
          if ("subject" in courseElement && "course" in courseElement) {
            // return `${courseElement.subject} ${courseElement.course}`
            // $(`#fsp-list-segment-0`).append(getCourseHTML(course.subject, course.course, course.tileID));
          } else if ("subject" in courseElement && "minLevel" in courseElement) {
            // return Object.keys(COURSES_EXAMPLE_JSON[courseElement.subject])
            //     .filter(course => course >= courseElement.minLevel)
            //     .map(course => `${courseElement.subject} ${course}`);
          } else if ("n of" in courseElement || "one of" in courseElement) {
            // return getCoursesInArray(courseElement["n of"] || courseElement["one of"]);
          }
        })
      }
    }*/

    // console.log(Object.values(coursesWithTileIDs).flat());

    semesterList.forEach(semester => {
      this.semesterRows.push((new SemesterRowComponent(semester, this.schedule, semesterList)).render(this, fsp));
    });
    (new AddSemeseterComponent(nextSemester(semesterList[semesterList.length - 1]))).render(this, fsp);
    
/*
    semesterList.forEach((semester, index) => {
      const semesterClasses = semesters[semester];
      const innerHTML = `<div class="fsp-row ${!semesterClasses || semesterClasses.length == 0 ? "no-classes" : ""}" id="fsp-row-${index}">
        <div class="fsp-semester-name">${semester}</div>
        <div class="fsp-semester-classes" id="semester-${index}-classes"></div>
      </div>`;
      fsp.append(innerHTML);
      $(`#fsp-row-${index}`).droppable({
        tolerance: "pointer",
        over: () => {
          $(`#fsp-row-${index}`).addClass("fsp-row-active");
          this.potentialToSemesters.add(semester);
        },
        out: () => {
          $(`#fsp-row-${index}`).removeClass("fsp-row-active");
          this.potentialToSemesters.delete(semester);
        },
      });
      if(semesterClasses && semesterClasses.length > 0) {
        semesterClasses.forEach(course => {
          // $(`#semester-${index}-classes`).append(getCourseHTML(course.subject, course.course, course.tileID));
          const unfilledPrereqs = getUnfilledPrereqs(course.subject, course.course, semester);
          // if (unfilledPrereqs.length > 0) {
          //   $(`#${course.tileID}`).css({"box-shadow": "0px 0px 10px red", "border-color": "red", "borer-width": "3px"});
          //   $(`#${course.tileID}`).tooltip({content: `Missing prerequisites: ${unfilledPrereqs.join(", ")}`});
          // }
        });
      } else {
        $(`#semester-${index}-classes`).append(`<div class="fsp-semester-no-courses">No courses</div>`);
      }
    });*/

    console.log(semesterList);


    // console.log(coursesWithTileIDs);

    // Set position of tiles
    // let yOffset = 10;
    // const dataByTileID = semesterList.reduce((accumulator, semester) => {
    //   const semesterCourses = coursesWithTileIDs[semester];
    //   if (semesterCourses && semesterCourses.length > 0) {
    //     semesterCourses.forEach((course, index) => {
    //       // TODO: Create better xOffset algorithm
    //       const xOffset = 130 + index * 140;
    //       accumulator[course.tileID] = {courseObject: course, /*x: xOffset, y: yOffset,*/ jquery: $(`#${course.tileID}`), semester};
    //     })
    //     yOffset += 120;
    //   } else {
    //     yOffset += 40;
    //   }
    //   return accumulator;
    // }, {});

    // unscheduledCoursesTileIDs.forEach(course => {
    //   dataByTileID[course.tileID] = {courseObject: course, jquery: $(`#${course.tileID}`), semester: "unscheduled"};
    // })

    // console.log(dataByTileID);

    // const courseStringToTileID = Object.entries(dataByTileID).reduce((accumulator, [tileID, course]) => {
    //   accumulator[`${course.courseObject.subject} ${course.courseObject.course}`] = tileID;
    //   return accumulator;
    // }, {});

    // console.log(courseStringToTileID);

    // canvas.canvas.width = $(`#fsp-planner`).outerWidth();
    // canvas.canvas.height = $(`#fsp-planner`).outerHeight();

    // const CSCourses = getCoursesInMajor("Computer Science");
    // Object.entries(dataByTileID).forEach(([tileID, tile]) => {
    //   // TODO: Set course color by major
    //   // const courseColors = {"CSCI": "#fb9", "ITWS": "#9f9", "other": "#9ff"};
    //   // const courseColor = tile.courseObject.subject in courseColors ? courseColors[tile.courseObject.subject] : courseColors["other"];
      
    //   const courseColor = CSCourses.has(`${tile.courseObject.subject} ${tile.courseObject.course}`) ? "#ff9" : "#fbb";
      
    //   $(`#${tileID}`).draggable({
    //     stop: () => {
    //       const course = {
    //         subject: tile.courseObject.subject,
    //         course: tile.courseObject.course
    //       };
    //       const fromSemester = tile.semester;
    //       const potentialTo = [...this.potentialToSemesters];
    //       const toSemester = potentialTo.length > 0 ? potentialTo[0] : fromSemester;
    //       this.moveCourse(course, fromSemester, toSemester);
    //     },
    //   });
    //   tile.jquery.css({/*left: tile.x, top: tile.y, */"background-color": courseColor});

    //   // Add details toggle
    //   $(`#${tileID} .fsp-course-details`).hide();
      
    //   $(`#${tileID} .fsp-course-code`).click(() => {
    //     const isVisible = $(`#${tileID} .fsp-course-details`).is(":visible");
    //     $(`.fsp-course-details`).hide(0);
    //     $(`.fsp-course`).css({"z-index": 0});
    //     $(`.fsp-direction-indicator`).html("&#x25b6;");
    //     if (isVisible) {
    //       $(`#${tileID} .fsp-course-details`).hide(0);
    //       $(`#${tileID} .fsp-course-code .fsp-direction-indicator`).html("&#x25b6;");
    //     } else {
    //       $(`#${tileID}-container`).css({"max-height": $(`#${tileID}-container`).height()});
    //       $(`#${tileID} .fsp-course-details`).show(0);
    //       $(`#${tileID}`).css({"z-index": 2});
    //       $(`#${tileID} .fsp-course-code .fsp-direction-indicator`).html("&#x25bc;");
    //     }
    //   });
    //   // this.drawCanvasLine({top: 0, left: 0}, this.getCourseCanvasLocation(tileID));
    //   // console.log(this.getCourseCanvasLocation(tileID));
    //   // this.drawCanvasLine({top: 0, left: 0}, {top: 100, left: 100});
    // });



    // $(".fsp-content").
    // this.canvasComponent = (new CanvasComponent(this.semesterRows, canvas));
    // this.canvasComponent
    this.renderMinorChanges();
    $(window).on('resize', () => {this.renderMinorChanges()});
  }
  
  /**
   * @returns {Object} JS Object representing current schedule state
   */
  getSchedule() {
    return this.schedule;
  }

  moveCourse(course, fromSemester, toSemester) {
    console.log(`Moving course ${course.subject} ${course.course} from ${fromSemester} to ${toSemester}`);
    if (fromSemester == toSemester) {
      this.renderPlanner();
      return;
    }
    if (fromSemester != "unscheduled") {
      const sourceIndex = this.schedule.semesters[fromSemester].findIndex(element => element.subject == course.subject && element.course == course.course);
      this.schedule.semesters[fromSemester].splice(sourceIndex, 1);
    }
    if (toSemester != "unscheduled") {
      if (!(toSemester in this.schedule.semesters)) this.schedule.semesters[toSemester] = [];
      this.schedule.semesters[toSemester].push(course);
    }
    this.renderPlanner();
  }

  getCourseCanvasLocation(tileID) {
    const targetOffset = $(`#${tileID}`).offset();
    const canvasOffset = $(`#fsp-canvas`).offset();
    return {
      top: targetOffset.top + $(`#${tileID}`).outerHeight() / 2 - canvasOffset.top,
      left: targetOffset.left + $(`#${tileID}`).outerWidth() / 2 - canvasOffset.left,
    };
  }

  drawCanvasLine(from, to) {
    const canvas = document.getElementById("fsp-canvas").getContext("2d");
    canvas.beginPath();
    canvas.moveTo(from.left, from.top);
    canvas.lineTo(to.left, to.top);
    canvas.stroke();
  }

  dropSemester(semester) {
    delete this.schedule.semesters[semester];
    this.renderPlanner();
  }

  
}

// console.log("Script loaded");
$(document).ready(() => {
  // $(".fsp-content").html("Test");

  const SCHEDULE_SEMESTERS = [...new Set(Object.keys(SCHEDULE_EXAMPLE_JSON.semesters).concat(SCHEDULE_EXAMPLE_JSON["starting semester"]))];
  console.log(SCHEDULE_SEMESTERS);
  console.log(getSemesterRange(SCHEDULE_SEMESTERS));
  const planner = new Planner();
  // planner.renderPlanner();
});