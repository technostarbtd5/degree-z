<?php

// Establish connection
$servernameDB = 'localhost';
$usernameDB = 'root';
$passwordDB = '';
$nameDB = 'degreeZ';

$db = new mysqli($servernameDB, $usernameDB, $passwordDB, $nameDB);

$dbConnected = false;

if ($db->connect_error) {
  echo '<div class="messages">Could not connect to the database. Error: ';
  echo $db->connect_errno . ' - ' . $db->connect_error . '</div>';
  die("Connection error");
} else {
  $dbConnected = true;
}

http_response_code(200);

$RCSID = phpCAS::getUser();

// Get a list of all schedules associated with an active user
function getSchedules() {
  global $db, $RCSID;
  $query = 'SELECT * FROM `plans` WHERE `RCSID`=?';
  $statement = $db->prepare($query);
  $statement->bind_param("s", $RCSID);
  $statement->execute();
  $res = $statement->get_result();
  $schedules = [];
  while ($row = $res->fetch_assoc()) {
    $schedules[] = $row;
  }
  echo json_encode($schedules);
  // var_dump($res->fetch_all());
}

// Get an individual schedule
function getSchedule() {
  global $db, $RCSID;
  $scheduleID = isset($_POST["scheduleID"]) ? $_POST["scheduleID"] : -1;
  $query = 'SELECT * FROM `plans` WHERE `id`=? AND `RCSID`=?;';
  $statement = $db->prepare($query);
  $statement->bind_param("is", $scheduleID, $RCSID);
  $statement->execute();
  $res = $statement->get_result();
  $schedule = $res->fetch_assoc();
  if ($schedule) {
    // Output majors/minors
    $scheduleObject = [];
    $scheduleObject["majors"] = [];
    $scheduleObject["minors"] = [];
    
    $query = 'SELECT * FROM `plan_majors` WHERE `plan_id`=?;';
    $statement = $db->prepare($query);
    $statement->bind_param("i", $scheduleID);
    $statement->execute();
    $res = $statement->get_result();
    while ($row = $res->fetch_assoc()) {
      if (isset($row["type"]) && isset($row["name"])) {
        if ($row["type"] == "major") {
          $scheduleObject["majors"][] = $row["name"];
        } elseif ($row["type"] == "minor") {
          $scheduleObject["minors"][] = $row["name"];
        }
      }
    }


    // Output schedule semesters
    $scheduleObject["semesters"] = [];
    
    $query = 'SELECT * FROM `plan_courses` WHERE `plan_id`=?;';
    $statement = $db->prepare($query);
    $statement->bind_param("i", $scheduleID);
    $statement->execute();
    $res = $statement->get_result();
    while ($row = $res->fetch_assoc()) {
      if (isset($row["course_department"]) && isset($row["course_number"]) && isset($row["semester"])) {
        if (!isset($scheduleObject["semesters"][$row["semester"]])) {
          $scheduleObject["semesters"][$row["semester"]] = [];
        }
        $scheduleObject["semesters"][$row["semester"]][] = ['subject' => $row["course_department"], 'course' => $row["course_number"]];
      }
    }

    echo json_encode($scheduleObject);
  }
}

// Update a schedule by ID. Add new schedule if ID is not provided.
function setSchedule() {
  global $db, $RCSID;
  if (isset($_POST["schedule"]) && is_array($_POST["schedule"])) {
    $schedule = $_POST["schedule"];

    // First, assert that if this is an existing schedule, the user actually owns it!
    $canEditSchedule = true;
    $scheduleIDActive = false;
    $scheduleID = -1;
    if (isset($_POST["scheduleID"]) && is_integer($_POST["scheduleID"])) {
      $scheduleID = $_POST["scheduleID"];
      $query = 'SELECT * FROM `plans` WHERE `id`=?';
      $statement = $db->prepare($query);
      $statement->bind_param("i", $scheduleID);
      $statement->execute();
      $res = $statement->get_result();
      $row = $res->fetch_assoc();
      if ($row != null && isset($row["RCSID"]) && $row["RCSID"] != $RCSID) {
        $canEditSchedule = false;
      }

      // Now you have to delete the old schedule entry!
      if ($row != null && $canEditSchedule) {
        $scheduleIDActive = true;
      }
    }

    echo "Can edit schedule " . htmlspecialchars($scheduleID) . "? " . ($canEditSchedule ? "true" : "false") . "; does schedule exist? " . ($scheduleIDActive ? "true" : "false"); 


    if ($canEditSchedule) {

      // Clear existing entries
      if ($scheduleIDActive) {
        $query = 'DELETE FROM `plan_courses` WHERE `plan_id`=?;';
        $statement = $db->prepare($query);
        $statement->bind_param("i", $scheduleID);
        $statement->execute();

        $query = 'DELETE FROM `plan_majors` WHERE `plan_id`=?;';
        $statement = $db->prepare($query);
        $statement->bind_param("i", $scheduleID);
        $statement->execute();
      } else {
        // OR create a new schedule!
        $scheduleName = isset($_POST["scheduleName"]) ? $_POST["scheduleName"] : "New Schedule";
        $query = 'INSERT INTO `plans` (`name`, `RCSID`) VALUES (?, ?)';
        $statement = $db->prepare($query);
        $statement->bind_param("ss", $scheduleName, $RCSID);
        $statement->execute();
        $scheduleID = $db->insert_id;
      }

      // Push schedule majors and minors
      if (isset($schedule["majors"]) && is_array($schedule["majors"])) {
        foreach ($schedule["majors"] as $major) {
          if (is_string($major)) {
            $query = 'INSERT INTO `plan_majors` (`name`, `type`, `plan_id`) VALUES (?, "major", ?);';
            $statement = $db->prepare($query);
            $statement->bind_param("si", $major, $scheduleID);
            $statement->execute();
          }
        }
      }

      if (isset($schedule["minors"]) && is_array($schedule["minors"])) {
        foreach ($schedule["minors"] as $minor) {
          if (is_string($minor)) {
            $query = 'INSERT INTO `plan_majors` (`name`, `type`, `plan_id`) VALUES (?, "minor", ?);';
            $statement = $db->prepare($query);
            $statement->bind_param("si", $minor, $scheduleID);
            $statement->execute();
          }
        }
      }

      // Push schedule courses
      if (isset($schedule["semesters"]) && is_array($schedule["semesters"])) {
        foreach ($schedule["semesters"] as $semester => $courses) {
          if (is_string($semester) && is_array($courses)) {
            foreach ($courses as $courseObject) {
              if (
                is_array($courseObject) && 
                isset($courseObject["subject"]) &&
                isset($courseObject["course"]) &&
                is_string($courseObject["subject"]) &&
                is_string($courseObject["course"])
              ) {
                $subject = $courseObject["subject"];
                $course = $courseObject["course"];
                $query = 'INSERT INTO `plan_courses` (`course_department`, `course_number`, `semester`, `plan_id`) VALUES (?, ?, ?, ?);';
                $statement = $db->prepare($query);
                $statement->bind_param("sssi", $subject, $course, $semester, $scheduleID);
                $statement->execute();
              }
            }
          }
        }
      }

    }

  }
}

// Delete a schedule by ID.
function deleteSchedule() {

  // First, assert user owns schedule
  global $db, $RCSID;
  $scheduleID = isset($_POST["scheduleID"]) ? $_POST["scheduleID"] : -1;
  $query = 'SELECT * FROM `plans` WHERE `id`=? AND `RCSID`=?;';
  $statement = $db->prepare($query);
  $statement->bind_param("is", $scheduleID, $RCSID);
  $statement->execute();
  $res = $statement->get_result();
  $schedule = $res->fetch_assoc();
  var_dump($schedule);
  echo $scheduleID;
  if ($schedule) {
    // $query = 'DELETE FROM `plans` WHERE `id`=?; DELETE FROM `plan_courses` WHERE `plan_id`=?; DELETE FROM `plan_majors` WHERE `plan_id`=?;';
    // $statement2 = $db->prepare($query);
    // if ($statement2) {
    //   $statement2->bind_param("iii", $scheduleID, $scheduleID, $scheduleID);
    //   $statement2->execute();
    //   echo "delete successful";
    // } else {
    //   echo $db->error;
    // }
    $query = 'DELETE FROM `plan_courses` WHERE `plan_id`=?;';
    $statement = $db->prepare($query);
    $statement->bind_param("i", $scheduleID);
    $statement->execute();
    $query = 'DELETE FROM `plan_majors` WHERE `plan_id`=?;';
    $statement = $db->prepare($query);
    $statement->bind_param("i", $scheduleID);
    $statement->execute();
    $query = 'DELETE FROM `plans` WHERE `id`=?;';
    $statement = $db->prepare($query);
    $statement->bind_param("i", $scheduleID);
    $statement->execute();
    echo "delete successful";
  } else {
    echo "delete unsuccessful";
  }
}

if (isset($_POST["request"])) {
  switch ($_POST["request"]) {
    case 'getSchedules':
      getSchedules();
    break;
    case 'getSchedule':
      getSchedule();
    break;
    case 'setSchedule':
      setSchedule();
      
    break;
    case 'deleteSchedule':
      deleteSchedule();
    break;
  }
}