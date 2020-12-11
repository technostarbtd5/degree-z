<?php
$user = "";
if($_POST['getUser'] == 1) $user = phpCas::getUser();

$get_user = "SELECT * FROM persondata WHERE persondata.Person = " . $user . ";";
echo $mysqli->query($get_user);