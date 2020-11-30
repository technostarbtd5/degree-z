hasTranscript = false;

$(document).ready(() => {
	$("#transcript_nav").addClass("active");

	document.getElementById("transcript-input").addEventListener("change", function() {
		if (this.placeholder == "") this.placeholder = getFilename(this.value);
		$("#filename").html(`Transcript: ${this.placeholder}<br> <input type="submit" value="Parse!" />`);
		$("#filename").css("display", "block");

		$(".file-upload p").html("<b>Upload new transcript</b>");
	});

	document.getElementById("new-input").addEventListener("change", function() {
		showUpload();
		transcriptInput.placeholder = getFilename(this.value);
		transcriptInput.dispatchEvent(new Event("change"));
		$("#close-button").css("display", "block");
	});

	document.getElementById("close-button").addEventListener("click", hideUpload);
})

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
	document.getElementById("current-filename").innerHTML = `Current transcript: ${transcriptInput.placeholder}`;
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

	constructor(courseBody, fields, hasLevel=0, hasGrade=0) {
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

	get toHTML() {
		var result = ` \
		<section class="course">
			Subject: ${this.subject} \
			Course: ${this.course_num}
			${this.level == "" ? "" : "Level: " + this.level} \
			Name: ${this.name} \
			${this.grade == "" ? "" : "Grade: " + this.grade} \
			# of Credits: ${this.credits} \
			${this.status == "" ? "" : "Status: " + this.status} \
		</section>`;
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
		this.name = name;
	}

	addSubtext(major, standings) {
		this.hasSubtext = true;
		this.subtext.major = major;
		this.subtext.academic = standings[0];
		this.subtext.additional = standings.length > 1 ? standings[1] : "";
	}

	addTermData(termData) {
		this.hasTermData = true;
		this.termData.attempted = termData.attempted;
		this.termData.passed = termData.passed;
		this.termData.gpa = termData.gpa;
	}

	addCumulativeData(cumulativeData) {
		this.hasCumulativeData = true;
		this.cumulativeData.attempted = cumulativeData.attempted;
		this.cumulativeData.passed = cumulativeData.passed;
		this.cumulativeData.gpa = cumulativeData.gpa;
	}

	addCourse(c) {
		this.courses.push(c);
	}

	get toHTML() {
		var result = ` \
		<section class="term"> \
			Semester: ${this.semester} \
			${this.name == "" ? "" : "Name: " + this.name}`;
		for (var i = 0; i < this.courses.length; i++) {
			result += `\nCourse${i+1}: ${this.courses[i].toHTML}`;
		}
		result += ` \
			${this.hasSubtext ? ` \
				Major: ${this.subtext.major} \
				${this.subtext.academic == "" ? "" : "Academic Standing: " + this.subtext.academic} \
				${this.subtext.additional == "" ? "" : "Additional Standing: " + this.subtext.additional}` : ""
			}`;
		result += ` \
			${this.hasCumulativeData ? ` \
				Cumulative Data: \
				Attempted: ${this.cumulativeData.attempted} \
				Passed: ${this.cumulativeData.passed} \
				GPA: ${this.cumulativeData.gpa}` : ""
			}`;
		result += ` \
			${this.hasTermData ? ` \
				Term Data: \
				Attempted: ${this.termData.attempted} \
				Passed: ${this.termData.passed} \
				GPA: ${this.termData.gpa}` : ""
			} \
		</section>`;
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
		minors: [],
	};

	totalData = {
		attempted: 0,
		passed: 0,
		gpa: 0.00
	};

	transferTerms = [];
	gradeTerms = [];
	progressTerm;

	constructor(transcriptBody) {
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
		this.studentData.college = getSubstring(studentInfo, studentInfo.indexOf("College"), ':', '\n');

		var offset = studentInfo.indexOf("Major and Department");
		while (offset != -1) {
			this.studentData.majors.push(getSubstring(studentInfo, offset, ':', ','));
			this.studentData.departments.push(getSubstring(studentInfo, studentInfo.indexOf(',', offset), ',', '\n'));
			offset = studentInfo.indexOf("Major and Department", offset+1);
		}
		offset = studentInfo.indexOf("Minor");
		while (offset != -1) {
			this.studentData.minors.push(getSubstring(studentInfo, offset, ':', '\n'));
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
		console.log(num_terms);
		console.log(gradeInfo);
		for (var terms_i = 0; terms_i < num_terms; terms_i++) {
			var semester = getSubstring(gradeInfo, gradeInfo.indexOf("Term", offset), ':', '\n')
			var major = getSubstring(gradeInfo, gradeInfo.indexOf("Major", offset), ':', '\n');
			var standings = [];
			standings.push(getSubstring(gradeInfo, gradeInfo.indexOf("Academic Standing", offset), ':', '\n'));
			var additional_i = gradeInfo.indexOf("Additional Standing", offset);
			console.log(additional_i);
			console.log(gradeInfo.indexOf("Subject", offset));
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
			while((/^[0-9]+$/).test(totalInfo[offset]) == false) offset++;
			end = offset;
			while((/^[0-9]+$/).test(totalInfo[end]) == true) end++;
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

	toHTML(s) {
		var result = "";
		switch (s) {
			case "Student":
				result = `\
				<section id="student"> \
					Name: ${this.studentData.name} \
					College: ${this.studentData.college} \
					Major${this.studentData.majors.length > 1 ? "1" : ""}: ${this.studentData.majors[0]} \
					Department${this.studentData.departments.length > 1 ? "1" : ""}: ${this.studentData.departments[0]}`;
				for (var i = 1; i < this.studentData.majors.length; i++) {
					result += ` \
					Major${i+1}: ${this.studentData.majors[i]} \
					Department${i+1}: ${this.studentData.departments[i]}`;
				}
				if (this.studentData.minors.length > 0) {
					result += ` \
						Minor${this.studentData.minors.length > 1 ? "s" : ""}: `;
					for (var i = 0; i < this.studentData.minors.length-1; i++) {
						result += `${this.studentData.minors[i]}, `;
					}
					result += this.studentData.minors[this.studentData.minors.length-1];
				}
				result += ` \
				</section>`;
				break;
			case "Total":
				result = `\
				<section id="total"> \
					Attempted: ${this.totalData.attempted} \
					Passed: ${this.totalData.passed} \
					GPA: ${this.totalData.gpa} \
				</section>`;
				break;
			case "Transfer":
				result = `<section id="transfer">`;
				for (var i = 0; i < this.transferTerms.length; i++) {
					result += this.transferTerms[i].toHTML + "\n";
				}
				result += "</section>";
				break;
			case "Grades":
				result = `<section id="grades">`;
				for (var i = 0; i < this.gradeTerms.length; i++) {
					result += this.gradeTerms[i].toHTML + "\n";
				}
				result += "</section>";
				break;
			case "Progress":
				result = ` \
				<section id="transfer"> \
					${this.progressTerm.toHTML + "\n"} \
				</section>`;
				break;
			default:
				result = `Invalid argument`;
		}
		return result;
	}
}

function parseTranscript(formObj) {
	$("#header").html("Your Transcript");
	styleFilename();

	var parser = new DOMParser();

	var stream = formObj.transcript.files[0].text().then(
		function(result){
			// No info in head, so only extract body from html
			var transcriptBody = parser.parseFromString(result, "text/html").body;
			var transcriptInfo = transcriptBody.getElementsByClassName("pagebodydiv")[0].getElementsByClassName("datadisplaytable")[0];
			var separators = transcriptInfo.getElementsByClassName("ddseparator");
			var num_tables = ((separators.length - 5) / 2) + 1;
			var transcriptText = transcriptInfo.innerText;
			
			var transcript = new Transcript(transcriptBody);
			
			// .pagebodydiv .datadisplaytable contains all transcript data
			// .ddseparator indicates next table
			// # of tables = ((count(.ddseparator)-5)/2)+1


			document.getElementById("userinfo").append(parser.parseFromString(transcript.toHTML("Student"),"text/html").documentElement);
			document.getElementById("courseMap").innerHTML = "<h4 class=\"sectiontitle\">Courses Taken</h4>";
			document.getElementById("courseMap").append(parser.parseFromString(transcript.toHTML("Total"), "text/html").documentElement);
			document.getElementById("courseMap").append(parser.parseFromString(transcript.toHTML("Transfer"), "text/html").documentElement);
			document.getElementById("courseMap").append(parser.parseFromString(transcript.toHTML("Grades"), "text/html").documentElement);
			document.getElementById("courseMap").append(parser.parseFromString(transcript.toHTML("Progress"), "text/html").documentElement);
			console.log(parser.parseFromString(transcriptText,"text/html").documentElement);
			
		}
	)
	
	styleSections();
	alert("transcript parsed");
	return false;
}