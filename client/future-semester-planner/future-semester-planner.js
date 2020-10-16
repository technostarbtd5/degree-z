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
  // console.log(`${subject} ${course} JSON:`);
  // console.log(JSON.stringify(courseObject));
  return `<div class="fsp-course" id="${tileID}">
    <!-- div class="fsp-course-code">${subject} ${course}</div -->
    <details class="fsp-course-details">
      <summary class="fsp-course-code">${subject} ${course}</summary>
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
    </details>
  </div>
  `
}

class Planner {
  schedule = SCHEDULE_EXAMPLE_JSON;

  constructor() {

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

    let id = 0;
    const coursesWithTileIDs = Object.entries(this.schedule.semesters).reduce((semesterWithTileIDs, [semester, courses]) => {
      semesterWithTileIDs[semester] = courses.map(course => ({subject: course.subject, course: course.course, tileID: `course-tile-${id++}`}));
      return semesterWithTileIDs;
    }, {});
    semesterList.forEach(semester => {
      const semesterClasses = coursesWithTileIDs[semester];
      const innerHTML = `<div class="fsp-row ${!semesterClasses ? "no-classes" : ""}" id="fsp-row-${semester}">
        <div class="fsp-semester-name">${semester}</div>
        <div class="fsp-semester-classes">${
          semesterClasses ?
          semesterClasses.map(course => getCourseHTML(course.subject, course.course, course.tileID)).join("") :
          `<div class="fsp-semester-no-courses">No courses</div>`
        }</div>
      </div>`;
      fsp.append(innerHTML);
    });

    // Set position of tiles
    let yOffset = 10;
    const dataByTileID = semesterList.reduce((accumulator, semester) => {
      const semesterCourses = coursesWithTileIDs[semester];
      if (semesterCourses) {
        semesterCourses.forEach((course, index) => {
          // TODO: Create better xOffset algorithm
          const xOffset = 130 + index * 140;
          accumulator[course.tileID] = {courseObject: course, x: xOffset, y: yOffset, jquery: $(`#${course.tileID}`)};
        })
        yOffset += 120;
      } else {
        yOffset += 40;
      }
      return accumulator;
    }, {});

    Object.values(dataByTileID).forEach(tile => {
      tile.jquery.css({left: tile.x, top: tile.y});
    })



    // $(".fsp-content").
  }
  
  /**
   * @returns {Object} JS Object representing current schedule state
   */
  getSchedule() {
    return this.schedule;
  }
}

// console.log("Script loaded");
$(document).ready(() => {
  // $(".fsp-content").html("Test");

  const SCHEDULE_SEMESTERS = Object.keys(SCHEDULE_EXAMPLE_JSON.semesters);
  console.log(getSemesterRange(SCHEDULE_SEMESTERS));
  const planner = new Planner();
  planner.renderPlanner();
});