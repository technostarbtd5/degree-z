import {SCHEDULE_EXAMPLE_JSON, COURSES_EXAMPLE_JSON} from "./sample-json.js";

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

function getCourseHTML(subject, course, tileID) {
  const courseObject = getCourseObject(subject, course);
  return `<div class="fsp-course" id="${tileID}">
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
  `
}

class Planner {
  schedule = JSON.parse(JSON.stringify(SCHEDULE_EXAMPLE_JSON));
  potentialToSemesters = new Set();
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
  }

  /**
   * Render planner canvas and div
   */
  renderPlanner() {
    const scheduleSemesters = Object.keys(this.schedule.semesters);
    const normalSemesters = getSemesterRange(scheduleSemesters);
    const normalSemestersSet = new Set(normalSemesters);
    const otherSemesters = scheduleSemesters.filter(semester => !normalSemestersSet.has(semester));
    const semesterList = otherSemesters.concat(normalSemesters);

    const canvas = document.getElementById("fsp-canvas").getContext("2d");
    const fsp = $("#fsp-content");
    fsp.html("");
    this.potentialToSemesters = new Set();
    let id = 0;
    const coursesWithTileIDs = Object.entries(this.schedule.semesters).reduce((semesterWithTileIDs, [semester, courses]) => {
      semesterWithTileIDs[semester] = courses.map(course => ({subject: course.subject, course: course.course, tileID: `course-tile-${id++}`}));
      return semesterWithTileIDs;
    }, {});
    semesterList.forEach((semester, index) => {
      const semesterClasses = coursesWithTileIDs[semester];
      // console.log(semesterClasses);
      // const innerHTML = `<div class="fsp-row ${!semesterClasses ? "no-classes" : ""}" id="fsp-row-${semester}">
      //   <div class="fsp-semester-name">${semester}</div>
      //   <div class="fsp-semester-classes">${
      //     semesterClasses ?
      //     semesterClasses.map(course => getCourseHTML(course.subject, course.course, course.tileID)).join("") :
      //     `<div class="fsp-semester-no-courses">No courses</div>`
      //   }</div>
      // </div>`;
      const innerHTML = `<div class="fsp-row ${!semesterClasses || semesterClasses.length == 0 ? "no-classes" : ""}" id="fsp-row-${index}">
        <div class="fsp-semester-name">${semester}</div>
        <div class="fsp-semester-classes" id="semester-${index}-classes"></div>
      </div>`;
      fsp.append(innerHTML);
      // const isDragging = this.isDragging;
      // $(`#fsp-row-${index}`).mousemove(function(e){
      //   const positionInElement = {
      //     x: e.pageX - this.offsetLeft,
      //     y: e.pageY - this.offsetTop,
      //   };
      //   const isMouseInElement = positionInElement.x < $(`#fsp-row-${index}`).width() &&
      //     positionInElement.y < $(`#fsp-row-${index}`).height();
      //   console.log(`For row ${index}: Position in element:${JSON.stringify(positionInElement)}; Element size: ${$(`#fsp-row-${index}`).width()}, ${$(`#fsp-row-${index}`).height()}; is in element: ${isMouseInElement}; is dragging: ${isDragging}`);
      //   if (isDragging && isMouseInElement) {
      //     $(`#fsp-row-${index}`).addClass("fsp-row-active");
      //   } else {
      //     $(`#fsp-row-${index}`).removeClass("fsp-row-active");
      //   }
      // })
      // $(document).mousemove
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
          $(`#semester-${index}-classes`).append(getCourseHTML(course.subject, course.course, course.tileID));
        });
      } else {
        $(`#semester-${index}-classes`).append(`<div class="fsp-semester-no-courses">No courses</div>`);
      }
    });

    console.log(semesterList);
    console.log(coursesWithTileIDs);

    // Set position of tiles
    let yOffset = 10;
    const dataByTileID = semesterList.reduce((accumulator, semester) => {
      const semesterCourses = coursesWithTileIDs[semester];
      if (semesterCourses && semesterCourses.length > 0) {
        semesterCourses.forEach((course, index) => {
          // TODO: Create better xOffset algorithm
          const xOffset = 130 + index * 140;
          accumulator[course.tileID] = {courseObject: course, x: xOffset, y: yOffset, jquery: $(`#${course.tileID}`), semester};
        })
        yOffset += 120;
      } else {
        yOffset += 40;
      }
      return accumulator;
    }, {});

    console.log(dataByTileID);

    Object.entries(dataByTileID).forEach(([tileID, tile]) => {
      // TODO: Set course color by major
      const courseColors = {"CSCI": "#fb9", "ITWS": "#9f9", "other": "#9ff"};
      const courseColor = tile.courseObject.subject in courseColors ? courseColors[tile.courseObject.subject] : courseColors["other"];
      $(`#${tileID}`).draggable({
        // addClasses: false,
        // drag: () => {
        //   semesterList.forEach((semester, index) => {
        //     const mouseInElement = {
        //       x: 
        //     }
        //     if ($(`#fsp-row-${index}:hover`).length != 0) {
        //       $(`#fsp-row-${index}`).addClass("fsp-row-active");
        //     } else {
        //       $(`#fsp-row-${index}`).removeClass("fsp-row-active");
        //     }
        //   })
        // },
        // start: () => {
        //   this.isDragging = true;
        //   console.log("Start drag");
        // },
        // stop: () => {
        //   this.isDragging = false;
        //   console.log("Stop drag");
        // },
        stop: () => {
          const course = {
            subject: tile.courseObject.subject,
            course: tile.courseObject.course
          };
          const fromSemester = tile.semester;
          const potentialTo = [...this.potentialToSemesters];
          const toSemester = potentialTo.length > 0 ? potentialTo[0] : fromSemester;
          this.moveCourse(course, fromSemester, toSemester);
        },
      });
      tile.jquery.css({left: tile.x, top: tile.y, "background-color": courseColor});

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
          $(`#${tileID} .fsp-course-details`).show(0);
          $(`#${tileID}`).css({"z-index": 2});
          $(`#${tileID} .fsp-course-code .fsp-direction-indicator`).html("&#x25bc;");
        }
      });

    });



    // $(".fsp-content").
  }
  
  /**
   * @returns {Object} JS Object representing current schedule state
   */
  getSchedule() {
    return this.schedule;
  }

  moveCourse(course, fromSemester, toSemester) {
    const sourceIndex = this.schedule.semesters[fromSemester].findIndex(element => element.subject == course.subject && element.course == course.course);
    this.schedule.semesters[fromSemester].splice(sourceIndex, 1);
    if (!(toSemester in this.schedule.semesters)) this.schedule.semesters[toSemester] = [];
    this.schedule.semesters[toSemester].push(course);
    this.renderPlanner();
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