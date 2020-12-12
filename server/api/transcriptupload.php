<?php
$user = substr(phpCas::getUser(), stripos(phpCas::getUser(), ':'));

// Retreiving the transcript
if (isset($_POST["getUser"]) && $_POST["getUser"] == 1) {
	$get_user = "SELECT * FROM `students` WHERE students.username = \"" . $user . "\";";
	$result = $mysqli->query($get_user);
	$student = $result->fetch_assoc();

	if (is_null($student)) echo "";
	else {
		// Create student data to send
		$offset = 0;
		$majors = array();
		while (stripos($student["major"], ',', $offset) !== false) {
			$next_offset = stripos($student["major"], ',', $offset);
			array_push($majors, substr($student["major"], $offset, $next_offset - $offset));
			$offset = $next_offset + 1;
		}
		array_push($majors, substr($student["major"], $offset));
		$offset = 0;
		$departments = array();
		while (stripos($student["department"], ',', $offset) !== false) {
			$next_offset = stripos($student["department"], ',', $offset);
			array_push($departments, substr($student["department"], $offset, $next_offset - $offset));
			$offset = $next_offset + 1;
		}
		array_push($departments, substr($student["department"], $offset));
		$offset = 0;
		$minors = array();
		if ($student["minor"] != "") {
			while (stripos($student["minor"], ',', $offset) !== false) {
				$next_offset = stripos($student["minor"], ',', $offset);
				array_push($minors, substr($student["minor"], $offset, $next_offset - $offset));
				$offset = $next_offset + 1;
			}
			array_push($minors, substr($student["minor"], $offset));
		}

		$studentData = array(
			"name" => $student["name"],
			"college" => $student["college"],
			"majors" => $majors,
			"departments" => $departments,
			"minors" => $minors,
		);

		$totalData = array(
			"attempted" => $student["credits_taken"],
			"passed" => $student["credits_received"],
			"gpa" => $student["gpa"],
		);

		$transferTerms = array();
		$gradeTerms = array();
		$progressTerm = array();

		$get_term = "SELECT * FROM `terms` WHERE terms.student_id = " . $student["id"] . ";";
		$result = $mysqli->query($get_term);
		while ($term = $result->fetch_assoc()) {
			$temp_term = array(
				"semester" => $term["semester"],
				"name" => $term["name"],
				"courses" => array(),
				"subtext" => array(
					"major" => $term["major"],
					"academic" => $term["standing1"],
				    "additional" => $term["standing2"],
				),
				"termData" => array(
					"attempted" => $term["credits_taken"],
					"passed" => $term["credits_received"],
				    "gpa" => $term["gpa"],
				),
				"cumulativeData" => array(
					"attempted" => $term["total_credits_taken"],
					"passed" => $term["total_credits_received"],
				    "gpa" => $term["total_gpa"],
				),
			);
			$get_course = "SELECT * FROM `courses` WHERE courses.term_id = " . $term["id"] . ";";
			$result2 = $mysqli->query($get_course);
			while ($course = $result2->fetch_assoc()) {
				$temp_course = array(
					"subject" => $course["subject"],
					"course_num" => $course["code"],
					"name" => $course["name"],
					"level" => $course["level"],
					"grade" => $course["grade"],
					"credits" => $course["credits"],
					"status" => $course["status"],
				);
				array_push($temp_term["courses"], $temp_course);
			}
			if ($term["type"] == "transfer") {
				array_push($transferTerms, $temp_term);
			}
			else if ($term["type"] == "current") {
				array_push($gradeTerms, $temp_term);
			}			
			else if ($term["type"] == "future") {
				$progressTerm = $temp_term;
			}
		}

		$ans = array(
			"studentData" => $studentData,
			"totalData" => $totalData,
			"transferTerms" => $transferTerms,
			"gradeTerms" => $gradeTerms,
			"progressTerm" => $progressTerm,
		);

		// Create array that follows format of json in Transcript
		echo json_encode($ans);
	}
}

// Storing the transcript
if (isset($_POST["storeData"]) && is_array($_POST["storeData"])) {
	// Get student id
	$get_student = "SELECT * FROM `students` WHERE students.username = \"" . $user . "\";";
	$result = $mysqli->query($get_student);

	// Store student and total data
	$major = "";
	foreach ($_POST["storeData"]["majors"] as $temp_major) {
		$major = $major . $temp_major . ($temp_major == $_POST["storeData"]["majors"][count($_POST["storeData"]["majors"])-1] ? "" : ", ");
	}
	$dept = "";
	foreach ($_POST["storeData"]["departments"] as $temp_dept) {
		$dept = $dept . $temp_dept . ($temp_dept == $_POST["storeData"]["departments"][count($_POST["storeData"]["departments"])-1] ? "" : ", ");
	}
	$minor = "";
	if ($_POST["storeData"]["minors"] != "") {
		foreach ($_POST["storeData"]["minors"] as $temp_minor) {
			$minor = $minor . $temp_minor . ($temp_minor == $_POST["storeData"]["minors"][count($_POST["storeData"]["minors"])-1] ? "" : ", ");
		}
	}

	$insert_student = "";
	if (mysqli_num_rows($result) != 0) {
		$insert_student = "UPDATE `students` SET `name` = ?, `college` = ?, `major` = ?, `department` = ?, `minor` = ?, `credits_taken` = ?, `credits_received` = ?, `gpa` = ? WHERE `username` = ?";
		$statement = $mysqli->prepare($insert_student);
		$statement->bind_param("sssssiids", $_POST["storeData"]["name"], $_POST["storeData"]["college"], $major, $dept, $minor, $_POST["storeData"]["taken"], $_POST["storeData"]["received"], $_POST["storeData"]["gpa"], $user);
		$statement->execute();

		$get_student = "SELECT * FROM `students` WHERE students.username = \"" . $user . "\";";
		$result = $mysqli->query($get_student);
	}
	else {
		$insert_student = "INSERT INTO `students` (`name`, `username`, `college`, `major`, `department`, `minor`, `credits_taken`, `credits_received`, `gpa`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
		$statement = $mysqli->prepare($insert_student);
		$statement->bind_param("ssssssiid", $_POST["storeData"]["name"], $user, $_POST["storeData"]["college"], $major, $dept, $minor, $_POST["storeData"]["taken"], $_POST["storeData"]["received"], $_POST["storeData"]["gpa"]);
		$statement->execute();
	}
	$student_id = $result->fetch_assoc()["id"];

	// Clear existing data according to student id
	$clear = "DELETE FROM `terms` WHERE terms.student_id = \"" . $student_id . "\";";
	$mysqli->query($clear);

	// Store transfer data
	foreach ($_POST["storeData"]["terms"]["transfer"] as $transfer_term) {
		$insert_term = "INSERT INTO `terms` (`type`, `semester`, `name`, `major`, `standing1`, `standing2`, `credits_taken`, `credits_received`, `gpa`, `total_credits_taken`, `total_credits_received`, `total_gpa`, `student_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		$statement = $mysqli->prepare($insert_term);
		$type = "transfer";
		$statement->bind_param("ssssssiidiidi", $type, $transfer_term["semester"], $transfer_term["name"], $transfer_term["major"], $transfer_term["standing1"], $transfer_term["standing2"], $transfer_term["current_taken"], $transfer_term["current_received"], $transfer_term["current_gpa"], $transfer_term["total_taken"], $transfer_term["total_received"], $transfer_term["total_gpa"], $student_id);
		$statement->execute();
		
		// Get term id
		$get_term = "SELECT LAST_INSERT_ID() AS id FROM `terms`";
		$result = $mysqli->query($get_term);
		$term_id = $result->fetch_assoc()["id"];

		foreach ($transfer_term["courses"] as $transfer_course) {
			$insert_course = "INSERT INTO `courses` (`subject`, `code`, `name`, `credits`, `grade`, `level`, `status`, `term_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
			$statement = $mysqli->prepare($insert_course);
			$statement->bind_param("sisisssi", $transfer_course["subject"], $transfer_course["course_code"], $transfer_course["name"], $transfer_course["credits"], $transfer_course["grade"], $transfer_course["level"], $transfer_course["status"], $term_id);
			$statement->execute();
		}
	}

	// Store current data
	foreach ($_POST["storeData"]["terms"]["current"] as $current_term) {
		$insert_term = "INSERT INTO `terms` (`type`, `semester`, `name`, `major`, `standing1`, `standing2`, `credits_taken`, `credits_received`, `gpa`, `total_credits_taken`, `total_credits_received`, `total_gpa`, `student_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		$statement = $mysqli->prepare($insert_term);
		$type = "current";
		$statement->bind_param("ssssssiidiidi", $type, $current_term["semester"], $current_term["name"], $current_term["major"], $current_term["standing1"], $current_term["standing2"], $current_term["current_taken"], $current_term["current_received"], $current_term["current_gpa"], $current_term["total_taken"], $current_term["total_received"], $current_term["total_gpa"], $student_id);
		$statement->execute();
		
		// Get term id
		$get_term = "SELECT LAST_INSERT_ID() AS id FROM `terms`";
		$result = $mysqli->query($get_term);
		$term_id = $result->fetch_assoc()["id"];

		foreach ($current_term["courses"] as $current_course) {
			$insert_course = "INSERT INTO `courses` (`subject`, `code`, `name`, `credits`, `grade`, `level`, `status`, `term_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
			$statement = $mysqli->prepare($insert_course);
			$statement->bind_param("sisisssi", $current_course["subject"], $current_course["course_code"], $current_course["name"], $current_course["credits"], $current_course["grade"], $current_course["level"], $current_course["status"], $term_id);
			$statement->execute();
		}
	}

	// Store future data
	$future_term = $_POST["storeData"]["terms"]["future"];
	$insert_term = "INSERT INTO `terms` (`type`, `semester`, `name`, `major`, `standing1`, `standing2`, `credits_taken`, `credits_received`, `gpa`, `total_credits_taken`, `total_credits_received`, `total_gpa`, `student_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	$statement = $mysqli->prepare($insert_term);
	$type = "future";
	$statement->bind_param("ssssssiidiidi", $type, $future_term["semester"], $future_term["name"], $future_term["major"], $future_term["standing1"], $future_term["standing2"], $future_term["current_taken"], $future_term["current_received"], $future_term["current_gpa"], $future_term["total_taken"], $future_term["total_received"], $future_term["total_gpa"], $student_id);
	$statement->execute();
	
	// Get term id
	$get_term = "SELECT LAST_INSERT_ID() AS id FROM `terms`";
	$result = $mysqli->query($get_term);
	$term_id = $result->fetch_assoc()["id"];

	foreach ($future_term["courses"] as $future_course) {
		$insert_course = "INSERT INTO `courses` (`subject`, `code`, `name`, `credits`, `grade`, `level`, `status`, `term_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
		$statement = $mysqli->prepare($insert_course);
		$statement->bind_param("sisisssi", $future_course["subject"], $future_course["course_code"], $future_course["name"], $future_course["credits"], $future_course["grade"], $future_course["level"], $future_course["status"], $term_id);
		$statement->execute();
	}
}
