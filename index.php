<?php

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
  default:
    http_response_code(404);
    require __DIR__ . '/client/404.html';
    break;
}