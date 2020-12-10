<?php

// Authenticate!
include_once(__DIR__ ."/phpCAS-1.3.6/CAS.php");
phpCAS::client(CAS_VERSION_2_0, 'cas-auth.rpi.edu', 443, '/cas/');
phpCAS::setCasServerCACert(__DIR__ .'/cacert.pem');
if (phpCAS::isAuthenticated()) {
  // echo "User:" . phpCAS::getUser();
  // echo "<a href='./logout.php'>Logout</a>";
} else {
  phpCAS::forceAuthentication();
  // echo "<a href='./login.php'>Login</a>";
}


include(__DIR__ . "/server/db/dbinit.php");
// Router script
$request = $_SERVER['REQUEST_URI'];

switch ($request) {
  case '/':
    require __DIR__ . '/client/home.php';
    break;
  case '':
    require __DIR__ . '/client/home.php';
    break;
  case '/planner':
    require __DIR__ . '/client/future-semester-planner/future-semester-planner.html';
    break;
  case '/transcript':
    require __DIR__ . '/client/transcriptupload/transcriptupload.html';
    break;
  case '/catalog':
    require __DIR__ . '/client/course-major-info.html';
    break;
  case '/logout':
    require __DIR__ . '/server/authentication/logout.php';
    break;
  case '/api/planner':
    require __DIR__ . '/server/api/future-semester-planner.php';
    break;
  default:
    http_response_code(404);
    require __DIR__ . '/client/404.html';
    break;
}