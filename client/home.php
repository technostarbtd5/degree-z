<?php

// Authenticate!
include_once("../phpCAS-1.3.6/CAS.php");
phpCAS::client(CAS_VERSION_2_0, 'cas-auth.rpi.edu', 443, '/cas/');
phpCAS::setCasServerCACert('../cacert.pem');
if (phpCAS::isAuthenticated()) {
  // echo "User:" . phpCAS::getUser();
  // echo "<a href='./logout.php'>Logout</a>";
} else {
  phpCAS::forceAuthentication();
  // echo "<a href='./login.php'>Login</a>";
}




	$dbConnect = false;
	$dbUser = 'root';
	$dbPass = '';
<<<<<<< HEAD
<<<<<<< Updated upstream
	$dbSelect = 'test2';
=======
	$dbSelect = 'degreez';
>>>>>>> Stashed changes
=======
	$dbSelect = 'degreeZ';
>>>>>>> master
	@ $db = new mysqli('localhost', $dbUser, $dbPass, $dbSelect);

	if ($db->connect_error) {
		echo '<div class="messages">Could not connect to the database. Error: ';
		echo $db->connect_errno . ' - ' . $db->connect_error . '</div>';
	} else {
		$dbConnect = true;
    }

<<<<<<< HEAD
<<<<<<< Updated upstream
    $sql = "SELECT Major, Minor, Concentration, GPA, Person FROM testing";
=======
    $sql = "SELECT id, `name`, major, minor, concentration, gpa FROM students";
>>>>>>> Stashed changes
=======
    $sql = "SELECT Major, Minor, Concentration, GPA, Person FROM persondata";
>>>>>>> master
    $result = $db->query($sql);
    $info = $result->fetch_assoc()
    ?>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
<script type="text/javascript" src="/client/home.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
<style type="text/css">


</style>
<style type="text/css"></style>
<!-- <script src="home.js"></script> -->

<<<<<<< Updated upstream
<script src="/client/common/header.js"></script>
<<<<<<< HEAD
=======
<script src="common/header.js"></script>
>>>>>>> Stashed changes
<link rel="stylesheet" href="../degree-z.css">
=======
<link rel="stylesheet" href="/degree-z.css">
>>>>>>> master
<title>Home</title>
</head>

<body>
    <h1 class="header">Rensselaer</h1>

    
    
    <ul class="list-group">



    <li class="list-group-item"> <?php 
      $query1="SELECT * FROM students WHERE students.username =\"" . phpCas::getUser() . "\"";
      $result10 = $db->query($query1);
          echo "Username: " . $result10->fetch_assoc()["username"].  "<br>";
      
     
?></li>

    



    <li class="list-group-item"> <?php 
        
        $query1="SELECT * FROM students WHERE students.username =\"" . phpCas::getUser() . "\"";
        $result10 = $db->query($query1);
            echo "Major(s): " . $result10->fetch_assoc()["major"].  "<br>";

?></li>



      <li class="list-group-item"> <?php 

      $query1="SELECT * FROM students WHERE students.username =\"" . phpCas::getUser() . "\"";
      $result10 = $db->query($query1);
          echo "Minor(s): " . $result10->fetch_assoc()["minor"].  "<br>";

?></li>
        <li class="list-group-item"><?php 
        
        $query1="SELECT * FROM students WHERE students.username =\"" . phpCas::getUser() . "\"";
        $result10 = $db->query($query1);
            echo "Concentration: " . $result10->fetch_assoc()["concentration"].  "<br>";
?>

</li>
        <li class="list-group-item"><?php 
        
        $query1="SELECT * FROM students WHERE students.username =\"" . phpCas::getUser() . "\"";
        $result10 = $db->query($query1);
            echo "GPA: " . $result10->fetch_assoc()["gpa"].  "<br>";
  

?>
            
        </li>
        

<?php echo  $result10->fetch_assoc()["credits_taken"]/127 ?>
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


