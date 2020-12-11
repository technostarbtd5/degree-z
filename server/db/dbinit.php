<?php

// Establish connection
$servernameDB = 'localhost';
$usernameDB = 'root';
$passwordDB = '';
$nameDB = 'degreeZ';

$mysqli = new mysqli($servernameDB, $usernameDB, $passwordDB);

$dbInitConnected = false;

if ($mysqli->connect_error) {
  echo '<div class="messages">Could not connect to the database. Error: ';
  echo $mysqli->connect_errno . ' - ' . $mysqli->connect_error . '</div>';
  die("Connection error");
} else {
  $dbInitConnected = true;
}

if ($mysqli->select_db($nameDB) === false) {
  // CREATE DB
  $dbInitSQL = "CREATE DATABASE IF NOT EXISTS $nameDB;";

  if ($mysqli->query($dbInitSQL) === TRUE) {
    // echo "Database created successfully";
    $mysqli->select_db($nameDB);
  } else {
    echo "Error creating database: " . $mysqli->error;
  }

  // CREATE TABLES
  // $db = new mysqli($servernameDB, $usernameDB, $passwordDB, $nameDB);

  // Planner tables


  $planner_sql = "CREATE TABLE `plans` (
    `id` int AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `RIN` bigint(11),
    PRIMARY KEY (`id`)
  );";

  $mysqli->query($planner_sql);

  $planner_courses_sql = "CREATE TABLE `plan_courses` (
    `id` int AUTO_INCREMENT,
    `course_department` varchar(4) NOT NULL,
    `course_number` int(4) NOT NULL,
    `semester` varchar(20) NOT NULL,
    `RIN` bigint(11),
    `plan_id` int,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`)
  );";

  $mysqli->query($planner_courses_sql);

  $data_sql = "CREATE TABLE `persondata` (
    `Person` varchar(255),
    `Major` varchar(255),
    `Minor` varchar(255),
    `Concentration` varchar(255),
    `GPA` decimal(60)
  );";

  $mysqli->query($data_sql);

  $courses_sql = "CREATE TABLE `classes` (
    `taken` varchar(255)
  );";

  $mysqli->query($courses_sql);

  $sql1 = "INSERT INTO `persondata` VALUES
  ('Alexandra Mednikova', 'Information Technology and Web Science', 'N/A','Data Science', '3.5')";


  $sq2 = "INSERT INTO `classes` VALUES
  ('Calculus I'),
  ('Introduction to Management'),
  ('Business Law and Ethics'),
  ('Computer Science I'),
  ('Introduction to Information Technology and Web Science'),
  ('Calculus II'),
  ('Physics I'),
  ('IT and Society')";

  $mysqli->query($sql1);
  $mysqli->query($sq2);

  // Transcript tables, may overlap with previously created tables
  $t_student_sql = "CREATE TABLE `students` (
    `id` int AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `username` varchar(255) NOT NULL,
    `major` varchar(255) NOT NULL,
    `minor` varchar(255),
    `concentration` varchar(255),
    `credits_taken` int(4) NOT NULL,
    `credits_received` int(4) NOT NULL,
    `gpa` decimal(60),
    PRIMARY KEY (`id`)
  );";

  $mysqli->query($t_student_sql);

  $t_term_sql = "CREATE TABLE `terms` (
    `id` int AUTO_INCREMENT,
    `type` varchar(255) NOT NULL,
    `semester` varchar(255) NOT NULL,
    `name` varchar(255),
    `major` varchar(255),
    `standing1` varchar(255),
    `standing2` varchar(255),
    `credits_taken` int(4),
    `credits_received` int(4),
    `gpa` decimal(60),
    `total_credits_taken` int(4),
    `total_credits_received` int(4),
    `total_gpa` decimal(60),
    `student_id` int,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
  );";

  $mysqli->query($t_term_sql);

  $t_course_sql = "CREATE TABLE `courses` (
    `id` int AUTO_INCREMENT,
    `subject` varchar(11) NOT NULL,
    `code` int(5) NOT NULL,
    `name` varchar(255) NOT NULL,
    `credits` int(4) NOT NULL,
    `grade` varchar(11),
    `level` varchar(11),
    `status` varchar(11),
    `term_id` int,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`)
  );";

  $mysqli->query($t_course_sql);


  // TODO: ADD FOREIGN KEY
  /*
  $planner_sql = "CREATE TABLE `plans` (
  `id` int AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `RIN` bigint(11),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`RIN`) REFERENCES `students` (`RIN`)
  );

  $planner_courses_sql = "CREATE TABLE `plan_courses` (
  `id` int AUTO_INCREMENT,
  `course_department` varchar(4) NOT NULL,
  `course_number` int(4) NOT NULL,
  `semester` varchar(20) NOT NULL,
  `RIN` bigint(11),
  `plan_id` int,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`)
  );";

  */
}



 