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
  static numCourseItems = 0;
  constructor (subject, course, semester) {
    this.tileID = `course-tile-${CourseComponent.numCourseItems++}`;
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
      stop: () => {
        const courseObject = {subject, course};
        const fromSemester = this.semester;
        const potentialTo = [...planner.potentialToSemesters];
        const toSemester = potentialTo.length > 0 ? potentialTo[0] : fromSemester;
        planner.moveCourse(courseObject, fromSemester, toSemester);
      },
    });

    // Add details toggle
    $(`#${tileID} .fsp-course-details`).hide();
    
    $(`#${tileID} .fsp-course-code`).click(() => {
      const isVisible = $(`#${tileID} .fsp-course-details`).is(":visible");
      $(`.fsp-course-details`).hide(0);
      $(`.fsp-course`).css({"z-index": 0});
      $(`.fsp-direction-indicator`).html("&#x25b6;");
      if (isVisible) {
        $(`#${tileID} .fsp-course-details`).hide(0);
        $(`#${tileID} .fsp-course-code .fsp-direction-indicator`).html("&#x25b6;");
      } else {
        $(`#${tileID}-container`).css({"max-height": $(`#${tileID}-container`).height()});
        $(`#${tileID} .fsp-course-details`).show(0);
        $(`#${tileID}`).css({"z-index": 2});
        $(`#${tileID} .fsp-course-code .fsp-direction-indicator`).html("&#x25bc;");
      }
    });

    return this;
  }

  addPrereqWarning(unfilledPrereqs) {
    if (unfilledPrereqs.length > 0) {
      $(`#${this.tileID}`).css({"box-shadow": "0px 0px 10px red", "border-color": "red", "borer-width": "3px"});
      $(`#${this.tileID}`).tooltip({content: `Missing prerequisites: ${unfilledPrereqs.join(", ")}`});
    }
  }

  static resetItems() {
    this.numCourseItems = 0;
  }
}

class SemesterRowComponent {
  static numRowItems = 0;
  courseComponents = [];

  constructor (semester, schedule, semesterList) {
    this.id = SemesterRowComponent.numRowItems++;
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
      <div class="fsp-semester-name">${semester}</div>
      <div class="fsp-semester-classes" id="${classesID}"></div>
    </div>`);

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
    this.numRowItems = 0;
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
  }

  /**
   * Reset all relevant items on re-render
   */
  resetPlanner() {
    CourseComponent.resetItems();
    SemesterRowComponent.resetItems();
    const fsp = $("#fsp-content");
    fsp.html("");
    $("#fsp-classes-navbar").html("");
    $("#fsp-classes-list").html("");
    this.potentialToSemesters = new Set();
    this.semesterRows = [];
  }

  /**
   * Render planner canvas and div
   */
  renderPlanner() {
    // Object.kets*this.schedule.semesters
    this.resetPlanner();

    const scheduleSemesters = Object.keys(this.schedule.semesters);
    scheduleSemesters.forEach(semester => this.schedule.semesters[semester].sort((a, b) => `${a.subject} ${a.course}` < `${b.subject} ${b.course}` ? -1 : 1));
    const normalSemesters = getSemesterRange(scheduleSemesters);
    const normalSemestersSet = new Set(normalSemesters);
    const otherSemesters = scheduleSemesters.filter(semester => !normalSemestersSet.has(semester));
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

    canvas.canvas.width = $(`#fsp-planner`).outerWidth();
    canvas.canvas.height = $(`#fsp-planner`).outerHeight();

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

  
}

// console.log("Script loaded");
$(document).ready(() => {
  // $(".fsp-content").html("Test");

  const SCHEDULE_SEMESTERS = Object.keys(SCHEDULE_EXAMPLE_JSON.semesters);
  console.log(getSemesterRange(SCHEDULE_SEMESTERS));
  const planner = new Planner();
  // planner.renderPlanner();
});