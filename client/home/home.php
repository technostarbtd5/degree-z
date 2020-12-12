<?php
	$dbConnect = false;
	$dbUser = 'root';
	$dbPass = '';
	$dbSelect = 'degreeZ';

	$db = new mysqli('localhost', $dbUser, $dbPass, $dbSelect);

	if ($db->connect_error) {
		echo '<div class="messages">Could not connect to the database. Error: ';
		echo $db->connect_errno . ' - ' . $db->connect_error . '</div>';
	} else {
		$dbConnect = true;
  }

  $query1 = "SELECT * FROM students WHERE students.username =\"" . phpCas::getUser() . "\"";
  $result10 = $db->query($query1);
  $info = $result10->fetch_assoc();
?>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">

<!-- <script src="home.js"></script> -->

<script src="/client/common/header.js"></script>
<link rel="stylesheet" type="text/css" href="/client/home/home.css" />
<title>Home</title>
</head>

<body>
    <h1 class="header center">
      <?php 
        echo $info["name"].  "'s Portal";
      ?>
    </h1>    
    <ul class="list-group">
      <li class="list-group-item">
        <?php
          echo "Username: " . $info["username"].  "<br>";
        ?>
      </li>
      <li class="list-group-item">
        <?php
          echo "Major(s): " . $info["major"].  "<br>";
        ?>
      </li>
      <li class="list-group-item">
        <?php
          echo "Minor(s): " . ($info["minor"] === "" ? "N/A" : $info["minor"]) .  "<br>";
        ?>
      </li>
      <li class="list-group-item">
        <?php
          echo "GPA: " . $info["gpa"].  "<br>";
        ?>
      </li>
    </ul><br>
    <section id="progress_section">
      <h4>Student Progress</h4>
      <div class="progress">
          <div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: <?php echo $info["credits_taken"]/1.27 ?>%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
      </div><br>
    </section>

<?php
  $student_id = $info["id"];
  $sql2 = "SELECT * FROM `terms` WHERE `student_id` = " . $student_id;
  $result5 = $db->query($sql2);

  // Courses Completed:
  // Check transcript for more info
  echo "<section id=\"progress_head\"><h5 class=\"half_line\">Courses Completed:</h5> <h5 class=\"half_line\"><a href=\"transcript\" id=\"transcript_link\">Check transcript for more info</a></h5></section>";
  if ($result5->num_rows > 0) {
    // output data of each row
    echo "<section class=\"course_section\">";
    while($row1 = $result5->fetch_assoc()) {
      $sql3 = "SELECT * FROM `courses` WHERE `term_id` = " . $row1["id"];
      $result6 = $db->query($sql3);
      echo "<table class=\"course_table\">";
      echo "<th>" . $row1["semester"] . "</th>";
      if ($result6->num_rows > 0) {
        while ($row2 = $result6->fetch_assoc()) {
          echo "<tr><td> " . $row2["name"] . "\t(" . $row2["credits"] . " credits)" . " </td></tr>";
        }
      }
      echo "</table>";
    }
    echo "</section>";
  }
?>


