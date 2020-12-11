<?php
$user = substr(phpCas::getUser(), stripos(phpCas::getUser(), ':'));

// Retreiving the transcript
if (isset($_POST["getUser"]) && $_POST["getUser"] == 1) {
	$get_user = "SELECT * FROM `students` WHERE students.username = \"" . $user . "\";";
	$result = $mysqli->query($get_user);
	$user_data = $result->fetch_assoc();
	// Create array that follows format of json in Transcript
	echo json_encode($result->fetch_assoc());
}

// Storing the transcript
if (isset($_POST["storeData"]) && is_array($_POST["storeData"])) {
	// Store student and total data
	$insert_student = "REPLACE INTO `students` (`name`, `username`, `major`, `minor`, `credits_taken`, `credits_received`, `gpa`) VALUES (?, ?, ?, ?, ?, ?, ?)";
	$major = "";
	foreach ($_POST["storeData"]["majors"] as $temp_major) {
		$major = $major . $temp_major . ($temp_major == $_POST["storeData"]["majors"][count($_POST["storeData"]["majors"])-1] ? "" : ", ");
	}
	$minor = "";
	foreach ($_POST["storeData"]["minors"] as $temp_minor) {
		$minor = $minor . $temp_minor . ($temp_minor == $_POST["storeData"]["minors"][count($_POST["storeData"]["minors"])-1] ? "" : ", ");
	}
	$statement = $mysqli->prepare($insert_student);
	$statement->bind_param("ssssiid", $_POST["storeData"]["name"], $user, $major, $minor, $_POST["storeData"]["taken"], $_POST["storeData"]["received"], $_POST["storeData"]["gpa"]);
	$statement->execute();

	// Get student id
	$get_student = "SELECT * FROM `students` WHERE students.username = \"" . $user . "\";";
	$result = $mysqli->query($get_student);
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



