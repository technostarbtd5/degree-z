<?php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "whateverDBineed";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
$conn->close();
?>



<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
<style type="text/css">

</style>
<style type="text/css"></style>
<script src="/client/common/header.js"></script>

<title>Home</title>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #FF737D;">
        <a class="navbar-brand" href="#">DegreeZ</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item active">
                    <a class="nav-link" href="home.html">Home </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="course-major-info.html">Degree</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="transcriptupload/transcriptupload.html">Transcript</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="future-semester-planner/future-semester-planner.html">Planner</a>
                </li>
            </ul>
        </div>
    </nav>

    <h1 class="header">Rensselaer</h1>
    <p>test</p>
    <ul class="list-group">
        <li class="list-group-item">Major(s):</li>
        <li class="list-group-item">Minor(s):</li>
        <li class="list-group-item">Concentration:</li>
        <li class="list-group-item">GPA:</li>
    </ul><br>
    <h4>Student Progress</h4>
    <div class="progress">
        <div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: 50%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
    </div>