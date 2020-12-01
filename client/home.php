<?php
	$dbConnect = false;
	$dbUser = 'root';
	$dbPass = '';
	$dbSelect = 'degreeZ';
	@ $db = new mysqli('localhost', $dbUser, $dbPass, $dbSelect);

	if ($db->connect_error) {
		echo '<div class="messages">Could not connect to the database. Error: ';
		echo $db->connect_errno . ' - ' . $db->connect_error . '</div>';
	} else {
		$dbConnect = true;
    }

    $sql = "SELECT Major, Minor, Concentration, GPA, Person FROM persondata";
    $result = $db->query($sql);
    ?>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
<script type="text/javascript" src="home.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
<style type="text/css">


</style>
<style type="text/css"></style>
<script src="home.js"></script>

<script src="/client/common/header.js"></script>
<link rel="stylesheet" href="../degree-z.css">
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

    
    
    <ul class="list-group">

    <li class="list-group-item"> <?php 
        
        $result0 = $db->query($sql);
        if ($result0->num_rows > 0) {
  // output data of each row
  while($row1 = $result0->fetch_assoc()) {
    echo "Name: " . $row1["Person"].  "<br>";
  }
} 

?></li>



        <li class="list-group-item"> <?php if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo "Major(s): " . $row["Major"].  "<br>";
  }
} 

?></li>




        <li class="list-group-item"><?php 
        
        $result1 = $db->query($sql);
        if ($result1->num_rows > 0) {
  // output data of each row
  while($row1 = $result1->fetch_assoc()) {
    echo "Minor(s): " . $row1["Minor"].  "<br>";
  }
} 

?>

</li>
        <li class="list-group-item"><?php 
        
        $result2 = $db->query($sql);
        if ($result2->num_rows > 0) {
  // output data of each row
  while($row1 = $result2->fetch_assoc()) {
    echo "Concentration: " . $row1["Concentration"].  "<br>";
  }
} 

?>
            
        </li>
        <li class="list-group-item"><?php 
        
        $result3 = $db->query($sql);
        if ($result3->num_rows > 0) {
  // output data of each row
  while($row1 = $result3->fetch_assoc()) {
    echo "GPA: " . $row1["GPA"].  "<br>";
  }
} 

?></li>
    </ul><br>
    <h4>Student Progress</h4>
    <div class="progress">
        <div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: 50%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
    </div><br>

<?php
    $sql2 = "SELECT taken FROM classes";
    $result5 = $db->query($sql2);

    if ($result5->num_rows > 0) {
        // output data of each row
        echo "<b>Courses Completed:</b> </br>";
        while($row1 = $result5->fetch_assoc()) {
          echo "<table> <td> " . $row1["taken"].  " </td> </table>";
        }
      } 
    ?>


