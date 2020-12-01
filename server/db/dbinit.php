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
    `GPA` decimal(60),
  );";
  
  $mysqli->query($data_sql);

$courses_sql = "CREATE TABLE `courses` (
  `taken` varchar(255),
);";

$mysqli->query($courses_sql);

$sql1 = "INSERT INTO `persondata` (`taken`) VALUES
('Alexandra Mednikova', 'Information Technology and Web Science', 'N/A','Data Science', '3.5')";


$sq2 = "INSERT INTO `classes` (`taken`) VALUES
('Calculus I'),
('Introduction to Management'),
('Business Law and Ethics'),
('Computer Science I'),
('Introduction to Information Technology and Web Science'),
('Calculus II'),
('Physics I'),
('IT and Society')";


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

  // Transcript tables
  //$student_sql = "CREATE TABLE `student`"
}



 