//import { MAJORS_EXAMPLE_JSON } from "/client/future-semester-planner/sample-json.js";

//hasTranscript = false;

var example_majors = {};

var student = {
	name: "",
	majors: [],
	minors: []
};

function getFilename(path) {
	var i = path.length-1;
	while (i >= 0 && path.charAt(i) != '\\') i--;

	return path.substring(i+1);
}

function showUpload() {
	$("#uploadsection").css("display", "flex");
}

function hideUpload() {
	$("#uploadsection").css("display", "none");
}

function styleFilename() {
	hideUpload();
	$("#userinfo").css("display", "block");
	transcriptInput = document.getElementById("transcript-input");
	document.getElementById("goto-links").innerHTML = ` \
		<b>Go To: \
			<a href="#student-title" class="goto">My Degree</a> \
			<a href="#transfer-title" class="goto">Accepted Transfer Courses</a> \
			<a href="#grades-title" class="goto">Courses Taken</a> \
			<a href="#total" class="goto">Total Info</a> \
			<a href="#progress-title" class="goto">Courses in Progress</a> \
		</b>`;
}

function styleSections() {
	mapSection = document.getElementById("courseMap");
	$("#courseMap").css({
		"border-top": "1px solid #ccc",
		"padding": "10px"
	});
}

function getSubstring(s, i, sc, ec) {
	var start = i;
	while (s[start] != sc) start++;
	start += 2;
	var end = start;
	while (s[end] != ec) end++;
	return s.substring(start, end);
}

class Course {
	subject;
	course_num;
	level = "";
	name;
	grade = "";
	credits;
	status = "";

	constructor(courseBody, fields, hasLevel=0, hasGrade=0, empty=false) {
		if (empty) return;
		var offset = 0;
		var end = offset;
		for (var i = 0; i < fields; i++) {
			while((/^[a-z0-9]+$/i).test(courseBody[offset]) == false) offset++;
			end = offset;
			while(end < courseBody.length && courseBody[end] != '\n') end++;
			var s = courseBody.substring(offset, end);
			switch (i) {
				case 0:
					this.subject = s;
					break;
				case 1:
					this.course_num = s;
					break;
				case 2*(hasLevel == 1 ? 1 : -1):
					this.level = s;
					break;
				case 2 + hasLevel:
					this.name = s;
					break;
				case (3 + hasLevel)*(hasGrade == 1 ? 1 : -1):
					this.grade = s;
					break;
				case 3 + hasLevel + hasGrade:
					this.credits = s;
					break;
				case 5 + hasLevel + hasGrade:
					this.status = s;
					break;
				default:
					break;
			}
			offset = end+1;
		}
	}

	setCourseInfo(subject, course_num, level, name, grade, credits, status) {
		this.subject = subject;
		this.course_num = course_num;
		this.level = level;
		this.name = name;
		this.grade = grade;
		this.credits = credits;
		this.status = status;
	}

	get toHTML() {
		var color = "";
		const getColor = (requirements) => {
			for (requirement in requirements) {
				if ("subject" in requirement && "course" in requirement) {
					if (requirement.subject == this.subject && requirement.course == this.course_num)
						return " yellow";
				}
				else if ("subject" in requirement && "minLevel" in requirement) {
					if (requirement.subject == this.subject && requirement.minLevel <= this.course_num)
						return " yellow";
				}
				else if ("one of" in requirement) return getColor(requirement["one of"]);
				else if ("n of" in requirement) return getColor(requirement["n of"]);
			}
			return "";
		}
		for (var i = 0; i < student.majors.length; i++) {
			if (!(student.majors[i] in example_majors)) continue;
			const requirements = example_majors[student.majors[i]].requirements;
			color = getColor(requirements);
			if (color != "") break;
		}
		var result = ` \
		<section class="course">
			<p class="full-line course-name center${color}">${this.subject} ${this.course_num}:<br>${this.name}</p> \
			${this.level == "" ? "" : `<p class="half-line center">Level: ${this.level}</p>`} \
			${this.grade == "" ? "" : `<p class="half-line center">Grade: ${this.grade}</p>`} \
			<p class="half-line center">${this.credits} Credits</p> \
			${this.status == "" ? "" : `<p class="half-line center">Status: ${this.status}</p>`} \
		</section>`;
		return result;
	}

	get toJSON() {
		var result = {};
		result["subject"] = this.subject;
		result["course_code"] = this.course_num;
		result["level"] = this.level;
		result["name"] = this.name;
		result["grade"] = this.grade;
		result["credits"] = this.credits;
		result["status"] = this.status;
		return result;
	}
}

class Term {
	semester;
	name = "";
	courses = [];

	hasSubtext = false;
	subtext = {
		major: "",
		academic: "",
		additional: ""
	};

	hasTermData = false;
	termData = {
		attempted: 0,
		passed: 0,
		gpa: 0.00
	};

	hasCumulativeData = false;
	cumulativeData = {
		attempted: 0,
		passed: 0,
		gpa: 0.00
	};

	constructor(semester, name="") {
		this.semester = semester;
		this.name = name == null ? "" : name;
	}

	addSubtext(major, standings) {
		if (major != null && standings[0] != null) this.hasSubtext = true;
		this.subtext.major = major;
		this.subtext.academic = standings[0] == null ? "" : standings[0];
		this.subtext.additional = standings.length > 1 ? (standings[1] == null ? "" : standings[1]) : "";
	}

	addTermData(termData) {
		if (termData.attempted != null && termData.passed != null && termData.gpa != null)
			this.hasTermData = true;
		this.termData.attempted = termData.attempted == null ? 0 : termData.attempted;
		this.termData.passed = termData.passed == null ? 0 : termData.passed;
		this.termData.gpa = termData.gpa == null ? 0.00 : termData.gpa;
	}

	addCumulativeData(cumulativeData) {
		if (cumulativeData.attempted != null && cumulativeData.passed != null && cumulativeData.gpa != null)
			this.hasCumulativeData = true;
		this.cumulativeData.attempted = cumulativeData.attempted == null ? 0 : cumulativeData.attempted;
		this.cumulativeData.passed = cumulativeData.passed == null ? 0 : cumulativeData.passed;
		this.cumulativeData.gpa = cumulativeData.gpa == null ? 0.00 : cumulativeData.gpa;
	}

	addCourse(c) {
		this.courses.push(c);
	}

	get toHTML() {
		var result = ` \
		<section class="term">
			<h5 class="full-line center term-title">${this.semester}</h5>
			<section class="term-head">
			${this.name == "" ? "" : `<p class="full-line${this.hasSubtext ? " subtext" : ""}">${this.name}</p>`} \
			${this.hasSubtext ? ` \
				<p class="full-line${this.subtext.academic == "" ? "" : " subtext"}">Major: ${this.subtext.major}</p> \
				${this.subtext.academic == "" ? "" : ` \
				<p class="full-line${this.subtext.additional == "" ? "" : " subtext"}"> \
					Academic Standing: ${this.subtext.academic} \
				</p>`} \
				${this.subtext.additional == "" ? "" : ` \
				<p class="full-line"> \
					Additional Standing: ${this.subtext.additional} \
				</p>`}` : ""
			}
			</section> \
			<div class="courses">`;

		for (var i = 0; i < this.courses.length; i++) {
			result += this.courses[i].toHTML;
		}			
		result += `</div> \
			<section class="term-foot"> \
			${this.hasTermData ? ` \
				<p class="full-line subtext">This Term: \
				<p class="half-line${this.hasCumulativeData ? " subtext" : ""}"> \
					${this.termData.passed}/${this.termData.attempted} Credits Received \
				</p> \
				<p class="half-line right${this.hasCumulativeData ? " subtext" : ""}"> \
					GPA: ${this.termData.gpa} \
				</p>` : ""
			} \
			${this.hasCumulativeData ? ` \
				<p class="full-line subtext">Cumulative Terms: \
				<p class="half-line">${this.cumulativeData.passed}/${this.cumulativeData.attempted} Credits Received</p> \
				<p class="half-line right">GPA: ${this.cumulativeData.gpa}</p>` : ""
			}
			</section> \
		</section>`;
		return result;
	}

	get toJSON() {
		var result = {};
		result["semester"] = this.semester;
		if (this.name != "") result["name"] = this.name;
		result["courses"] = this.courses.map(c => c.toJSON);
		if (this.hasSubtext) {
			result["major"] = this.subtext.major;
			result["standing1"] = this.subtext.academic;
			result["standing2"] = this.subtext.additional;
		}
		if (this.hasTermData) {
			result["current_taken"] = this.termData.attempted;
			result["current_received"] = this.termData.passed;
			result["current_gpa"] = this.termData.gpa;
		}
		if (this.hasCumulativeData) {
			result["total_taken"] = this.cumulativeData.attempted;
			result["total_received"] = this.cumulativeData.passed;
			result["total_gpa"] = this.cumulativeData.gpa;
		}
		return result;
	}
}

class Transcript {
	transcriptInfo;

	studentData = {
		name: "",
		college: "",
		majors: [],
		departments: [],
		minors: []
	};

	totalData = {
		attempted: 0,
		passed: 0,
		gpa: 0.00
	};

	transferTerms = [];
	gradeTerms = [];
	progressTerm;

	constructor(transcriptBody, empty=false) {
		if (empty) return;
		this.transcriptInfo = transcriptBody.getElementsByClassName("pagebodydiv")[0].getElementsByClassName("datadisplaytable")[0];
		
		// Load data
		var transcriptText = this.transcriptInfo.innerText;
		var studentInfo = transcriptText.substring(transcriptText.indexOf("STUDENT INFORMATION") + 19,
				transcriptText.indexOf("TRANSFER CREDIT ACCEPTED BY INSTITUTION"));
		var transferInfo = transcriptText.substring(transcriptText.indexOf("TRANSFER CREDIT ACCEPTED BY INSTITUTION") + 39,
				transcriptText.indexOf("INSTITUTION CREDIT"));
		var gradeInfo = transcriptText.substring(transcriptText.indexOf("INSTITUTION CREDIT") + 18,
				transcriptText.indexOf("TRANSCRIPT TOTALS"));
		var totalInfo = transcriptText.substring(transcriptText.indexOf("TRANSCRIPT TOTALS") + 17,
				transcriptText.indexOf("COURSES IN PROGRESS"));
		var futureInfo = transcriptText.substring(transcriptText.indexOf("COURSES IN PROGRESS") + 19);


		// Create student data
		this.studentData.name = getSubstring(studentInfo, studentInfo.indexOf("Name"), ':', '\n');
		student.name = this.studentData.name;
		this.studentData.college = getSubstring(studentInfo, studentInfo.indexOf("College"), ':', '\n');

		var offset = studentInfo.indexOf("Major and Department");
		while (offset != -1) {
			var tempMajor = getSubstring(studentInfo, offset, ':', ',');
			this.studentData.majors.push(tempMajor);
			student.majors.push(tempMajor);
			this.studentData.departments.push(getSubstring(studentInfo, studentInfo.indexOf(',', offset), ',', '\n'));
			offset = studentInfo.indexOf("Major and Department", offset+1);
		}
		offset = studentInfo.indexOf("Minor");
		while (offset != -1) {
			var tempMinor = getSubstring(studentInfo, offset, ':', '\n');
			this.studentData.minors.push(tempMinor);
			student.minors.push(tempMajor);
			offset = studentInfo.indexOf("Minor", offset+1);
		}


		// Create transfer data
		var num_terms = 0;
		offset = transferInfo.indexOf("Current Term");
		while (offset != -1) {
			num_terms++;
			offset = transferInfo.indexOf("Current Term", offset+1);
		}
		var hasLevel = 0;
		if (transferInfo.indexOf("Level") != -1) hasLevel++;
		var hasGrade = 0;
		if (transferInfo.indexOf("Grade") != -1) hasGrade++;
		offset = transferInfo.indexOf("-Top-") + 6;
		for (var terms_i = 0; terms_i < num_terms; terms_i++) {
			var semester = getSubstring(transferInfo, offset, '\n', ':');
			var name = getSubstring(transferInfo, offset, ':', '\n');
			var t = new Term(semester, name);

			offset = transferInfo.indexOf("R", offset) + 2;
			while((/^[a-z]+$/i).test(transferInfo[offset]) == false) offset++;
			var linecount = 0;
			while (offset < transferInfo.indexOf("Attempt Hours", offset)) {
				var temp = offset;
				while(transferInfo.indexOf("\n", temp) != temp) {
					linecount++;
					temp = transferInfo.indexOf("\n", temp) + 1;
				}
				var c = new Course(transferInfo.substring(offset, temp), linecount, hasLevel, hasGrade);
				offset = temp;
				t.addCourse(c);
				while((/^[a-z.0-9]+$/i).test(transferInfo[offset]) == false) offset++;
				//offset = transferInfo.indexOf("Attempt Hours");
				linecount = 0;
			}

			var termData = {
				attempted: 0,
				passed: 0,
				gpa: 0.00
			}
			offset = transferInfo.indexOf("Current Term", offset);
			var end = offset;
			for (var i = 0; i < 6; i++) {
				while((/^[0-9]+$/).test(transferInfo[offset]) == false) offset++;
				end = offset;
				while((/^[0-9.]+$/).test(transferInfo[end]) == true) end++;
				var num = parseFloat(transferInfo.substring(offset, end));
				switch (i) {
					case 0:
						termData.attempted = num;
						break;
					case 1:
						termData.passed = num;
						break;
					case 5:
						termData.gpa = num;
						break;
					default:
						break;
				}
				offset = end+1;
			}
			t.addTermData(termData);

			this.transferTerms.push(t);
		}


		// Create institution data
		var num_terms = 0;
		offset = gradeInfo.indexOf("Current Term");
		while (offset != -1) {
			num_terms++;
			offset = gradeInfo.indexOf("Current Term", offset+1);
		}
		var hasLevel = 1;
		var hasGrade = 1;
		offset = gradeInfo.indexOf("-Top-") + 4;
		for (var terms_i = 0; terms_i < num_terms; terms_i++) {
			var semester = getSubstring(gradeInfo, gradeInfo.indexOf("Term", offset), ':', '\n')
			var major = getSubstring(gradeInfo, gradeInfo.indexOf("Major", offset), ':', '\n');
			var standings = [];
			standings.push(getSubstring(gradeInfo, gradeInfo.indexOf("Academic Standing", offset), ':', '\n'));
			var additional_i = gradeInfo.indexOf("Additional Standing", offset);
			if (additional_i != -1 && additional_i < gradeInfo.indexOf("Subject", offset))
				standings.push(getSubstring(gradeInfo, additional_i, ':', '\n'));
			var t = new Term(semester);
			t.addSubtext(major, standings);

			// Get classes inside each term
			offset = gradeInfo.indexOf("R", offset) + 2;
			while((/^[a-z]+$/i).test(gradeInfo[offset]) == false) offset++;
			var linecount = 0;
			while (offset < gradeInfo.indexOf("Term Totals", offset)-2) {
				var temp = offset;
				while(gradeInfo.indexOf("\n", temp) != temp) {
					linecount++;
					temp = gradeInfo.indexOf("\n", temp) + 1;
				}
				var c = new Course(gradeInfo.substring(offset, temp), linecount, hasLevel, hasGrade);
				offset = temp;
				t.addCourse(c);
				while((/^[a-z.0-9]+$/i).test(gradeInfo[offset]) == false) offset++;
				//offset = transferInfo.indexOf("Attempt Hours");
				linecount = 0;
			}

			// Get term totals
			var termData = {
				attempted: 0,
				passed: 0,
				gpa: 0.00
			}
			var cumulativeData = {
				attempted: 0,
				passed: 0,
				gpa: 0.00
			}
			offset = gradeInfo.indexOf("Current Term", offset);
			var end = offset;
			for (var i = 0; i < 6; i++) {
				while((/^[0-9]+$/).test(gradeInfo[offset]) == false) offset++;
				end = offset;
				while((/^[0-9.]+$/).test(gradeInfo[end]) == true) end++;
				var num = parseFloat(gradeInfo.substring(offset, end));
				switch (i) {
					case 0:
						termData.attempted = num;
						break;
					case 1:
						termData.passed = num;
						break;
					case 5:
						termData.gpa = num;
						break;
					default:
						break;
				}
				offset = end+1;
			}
			offset = gradeInfo.indexOf("Cumulative", offset);
			end = offset;
			for (var i = 0; i < 6; i++) {
				while((/^[0-9]+$/).test(gradeInfo[offset]) == false) offset++;
				end = offset;
				while((/^[0-9.]+$/).test(gradeInfo[end]) == true) end++;
				var num = parseFloat(gradeInfo.substring(offset, end));
				switch (i) {
					case 0:
						cumulativeData.attempted = num;
						break;
					case 1:
						cumulativeData.passed = num;
						break;
					case 5:
						cumulativeData.gpa = num;
						break;
					default:
						break;
				}
				offset = end+1;
			}
			t.addTermData(termData);
			t.addCumulativeData(cumulativeData);

			this.gradeTerms.push(t);
		}


		// Create progress data
		var progress_sem = getSubstring(futureInfo, futureInfo.indexOf("Term"), ':', '\n');
		var progress_major = getSubstring(futureInfo, futureInfo.indexOf("Major"), ':', '\n');
		this.progressTerm = new Term(progress_sem);
		this.progressTerm.addSubtext(progress_major, [""]);
		hasLevel = 0;
		if (futureInfo.indexOf("Level") != -1) hasLevel++;
		hasGrade = 0;
		if (futureInfo.indexOf("Grade") != -1) hasGrade++;
		offset = futureInfo.indexOf("Credit Hours") + 13;
		while((/^[a-z]+$/i).test(futureInfo[offset]) == false) offset++;
		var linecount = 0;
		while (offset < futureInfo.indexOf("Unofficial Transcript")) {
			var temp = offset;
			while(futureInfo.indexOf("\n", temp) != temp) {
				linecount++;
				temp = futureInfo.indexOf("\n", temp) + 1;
			}
			var c = new Course(futureInfo.substring(offset, temp), linecount, hasLevel, hasGrade);
			offset = temp;
			this.progressTerm.addCourse(c);
			while((/^[a-z.0-9]+$/i).test(futureInfo[offset]) == false) offset++;
			linecount = 0;
		}


		// Create total data
		offset = totalInfo.indexOf("Overall");
		var end = offset;
		for (var i = 0; i < 6; i++) {
			while((/^[.0-9]+$/).test(totalInfo[offset]) == false) offset++;
			end = offset;
			while((/^[.0-9]+$/).test(totalInfo[end]) == true) end++;
			var num = parseFloat(totalInfo.substring(offset, end));
			switch (i) {
				case 0:
					this.totalData.attempted = num;
					break;
				case 1:
					this.totalData.passed = num;
					break;
				case 5:
					this.totalData.gpa = num;
					break;
				default:
					break;
			}
			offset = end+1;
		}
	}

	setData(studentData, totalData, transferData, gradeData, progressData) {
		this.studentData = studentData;
		this.totalData = totalData;
		this.transferTerms = transferData;
		this.gradeTerms = gradeData;
		this.progressTerm = progressData;
	}

	store() {
		var sendData = {};
		sendData["name"] = this.studentData.name;
		sendData["college"] = this.studentData.college;
		sendData["majors"] = this.studentData.majors;
		sendData["departments"] = this.studentData.departments;
		sendData["minors"] = this.studentData.minors;
		sendData["taken"] = this.totalData.attempted;
		sendData["received"] = this.totalData.passed;
		sendData["gpa"] = this.totalData.gpa;

		sendData["terms"] = {};
		sendData["terms"]["transfer"] = this.transferTerms.map(t => t.toJSON);
		sendData["terms"]["current"] = this.gradeTerms.map(t => t.toJSON);
		sendData["terms"]["future"] = this.progressTerm.toJSON;


		// ajax request to send data to php and have it store data, may need to set up somehow
		$.ajax({
			type: "POST",
			url: "/api/transcript",
			data: {storeData: sendData},
			success: function(result) {
				console.log(result);
			}
		});
	}

	toHTML(s) {
		var result = "";
		switch (s) {
			case "Student":
				result = `\
				<section id="student"> \
					<h5 class="full-line" id="student-name">${this.studentData.name}</h5> \
					<p class="full-line">College: ${this.studentData.college}</p> \
					<p class="half-line">Major${this.studentData.majors.length > 1 ? " #1" : ""}: \
					${this.studentData.majors[0]}, ${this.studentData.departments[0]} Dept.`;
				for (var i = 1; i < this.studentData.majors.length; i++) {
					result += ` \
					<p class="half-line"> \
						Major #${i+1}: ${this.studentData.majors[i]}, ${this.studentData.departments[i]} Dept. \
					</p>`;
				}
				if (this.studentData.minors.length > 0) {
					result += ` \
						<p class="full-line">Minor${this.studentData.minors.length > 1 ? "s" : ""}: `;
					for (var i = 0; i < this.studentData.minors.length-1; i++) {
						result += `${this.studentData.minors[i]}, `;
					}
					result += this.studentData.minors[this.studentData.minors.length-1] + "</p>";
				}
				result += ` \
				</section>`;
				break;
			case "Transfer":
				result = `<h4 class="sectiontitle" id="transfer-title">Accepted Transfer Course</h4> \
				<section id="transfer">`;
				for (var i = 0; i < this.transferTerms.length; i++) {
					result += this.transferTerms[i].toHTML + "\n";
				}
				result += "</section>";
				break;
			case "Grades":
				result = `<h4 class="sectiontitle" id="grades-title">Courses Taken</h4> \
				<section id="grades">`;
				for (var i = 0; i < this.gradeTerms.length; i++) {
					result += this.gradeTerms[i].toHTML + "\n";
				}
				result += "</section>";
				break;
			case "Total":
				result = ` \
				<section id="total"> \
					<h5 class="half-line center">Total Credits Received: ${this.totalData.passed}/${this.totalData.attempted}</h5> \
					<h5 class="half-line center">Total GPA: ${this.totalData.gpa}</h5> \
				</section>`;
				break;
			case "Progress":
				result = `<h4 class="sectiontitle" id="progress-title">Courses in Progress</h4> \
				<section id="progress"> \
					${this.progressTerm.toHTML + "\n"} \
				</section>`;
				break;
			default:
				result = `Invalid argument`;
		}
		return result;
	}

	display(parser) {
		document.getElementById("infocard").innerHTML = "";
		document.getElementById("infocard").append(parser.parseFromString(this.toHTML("Student"),"text/html").body);
		document.getElementById("courseMap").innerHTML = "";
		document.getElementById("courseMap").append(parser.parseFromString(this.toHTML("Transfer"), "text/html").body);
		document.getElementById("courseMap").append(parser.parseFromString(this.toHTML("Grades"), "text/html").body);
		document.getElementById("courseMap").append(parser.parseFromString(this.toHTML("Total"), "text/html").body);
		document.getElementById("courseMap").append(parser.parseFromString(this.toHTML("Progress"), "text/html").body);
	}
}

function retrieveTranscript() {
	// write ajax request that sends user and gets user transcript info as result
	// if user doesn't exist or doesn't have transcript info, do nothing
	// if user exists, then set member variables and call showTranscript on self
	console.log("made request");
	$.ajax({
		type: "POST",
		url: "/api/transcript",
		data: {getUser: 1},
		success: function(result) {
			// echo is what creates result
			if (result == "") {
				console.log("found no one");
				return;
			}
			var resultJSON = JSON.parse(result);
			var temp = new Transcript(null, true);
			getTerms = (termString) => {
				var terms = [];
				for (var i=0; i < resultJSON[termString].length; i++) {
					var current = resultJSON[termString][i];
					var tempTerm = new Term(current["semester"], current["name"]);
					tempTerm.addSubtext(current["subtext"]["major"], [current["subtext"]["academic"], current["subtext"]["additional"]]);
					tempTerm.addTermData({
						attempted: current["termData"]["attempted"],
						passed: current["termData"]["passed"],
						gpa: current["termData"]["gpa"]
					});
					tempTerm.addCumulativeData({
						attempted: current["cumulativeData"]["attempted"],
						passed: current["cumulativeData"]["passed"],
						gpa: current["cumulativeData"]["gpa"]
					});
					for (var j=0; j < current["courses"].length; j++) {
						var current2 = current["courses"][j];
						var tempCourse = new Course(null, null, null, null, true);
						tempCourse.setCourseInfo(current2.subject, current2.course_num,
							current2.name, current2.level, current2.grade, current2.credits, current2.status);
						tempTerm.addCourse(tempCourse);
					}
					terms.push(tempTerm);
				}
				return terms;
			}
			var current_p = resultJSON["progressTerm"];
			var progressTerm = new Term(current_p["semester"], current_p["name"]);
			progressTerm.addSubtext(current_p["subtext"]["major"], [current_p["subtext"]["academic"], current_p["subtext"]["additional"]]);
			progressTerm.addTermData({
				attempted: current_p["termData"]["attempted"],
				passed: current_p["termData"]["passed"],
				gpa: current_p["termData"]["gpa"]
			});
			progressTerm.addCumulativeData({
				attempted: current_p["cumulativeData"]["attempted"],
				passed: current_p["cumulativeData"]["passed"],
				gpa: current_p["cumulativeData"]["gpa"]
			});
			for (var j=0; j < current_p["courses"].length; j++) {
				var current_p2 = current_p["courses"][j];
				var tempCourse = new Course(null, null, null, null, true);
				tempCourse.setCourseInfo(current_p2.subject, current_p2.course_num,
					current_p2.name, current_p2.level, current_p2.grade, current_p2.credits, current_p2.status);
				progressTerm.addCourse(tempCourse);
			}
			temp.setData(resultJSON["studentData"], resultJSON["totalData"], getTerms("transferTerms"), getTerms("gradeTerms"), progressTerm);
			styleFilename();
			temp.display(new DOMParser());
			styleSections();
		}
	});
}

$(document).ready(() => {
	$("#transcript_nav").addClass("active");

	document.getElementById("transcript-input").addEventListener("change", function() {
		this.placeholder = getFilename(this.value);
		$("#filename").html(`Transcript: ${this.placeholder}<br> <input type="submit" value="Parse!" />`);
		$("#filename").css("display", "block");

		$(".file-upload p").html("<b>Upload new transcript</b>");
	});

	document.getElementById("new-upload").addEventListener("click", function() {
		showUpload();
		// transcriptInput.placeholder = getFilename(this.value);
		// transcriptInput.dispatchEvent(new Event("change"));
		$("#close-button").css("display", "block");
	});

	document.getElementById("close-button").addEventListener("click", hideUpload);

	retrieveTranscript();
})

function parseTranscript(formObj) {
	$("#header").html("Your Transcript");
	styleFilename();

	var parser = new DOMParser();

	var stream = formObj.transcript.files[0].text().then(
		function(result){
			// No info in head, so only extract body from html
			var transcriptBody = parser.parseFromString(result, "text/html").body;			
			var transcript = new Transcript(transcriptBody);
			transcript.display(parser);
			transcript.store();
		}
	)
	
	styleSections();

	alert("transcript parsed");
	return false;
}