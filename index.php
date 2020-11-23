<?php

include(__DIR__ . "/server/db/dbinit.php");
// Router script
$request = $_SERVER['REQUEST_URI'];

switch ($request) {
  case '/':
    require __DIR__ . '/client/home.html';
    break;
  case '':
    require __DIR__ . '/client/home.html';
    break;
  case '/about':
    require __DIR__ . '/client/about.html';
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
  default:
    http_response_code(404);
    require __DIR__ . '/client/404.html';
    break;
}