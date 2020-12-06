<?php

if (phpCAS::isAuthenticated()) {
  phpCAS::logout();
} else {
  header('location: ./index.php');
}