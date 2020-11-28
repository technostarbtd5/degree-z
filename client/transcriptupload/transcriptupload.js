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

class Transcript {
	transcriptInfo;
	num_tables;

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
	}

	transferTerms = []
	gradeTerms = []
	progressTerms = []

	constructor(transcriptBody) {
		this.transcriptInfo = transcriptBody.getElementsByClassName("pagebodydiv")[0].getElementsByClassName("datadisplaytable")[0];
		
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

		this.num_tables = ((this.transcriptInfo.getElementsByClassName("ddseparator").length - 5) / 2) + 1;

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


		// Create total data
		offset = totalInfo.indexOf("Overall");
		var end = offset;
		for (var i = 0; i < 6; i++) {
			while((/^[0-9]+$/).test(totalInfo[offset]) == false) offset++;
			end = offset;
			while((/^[0-9]+$/).test(totalInfo[end]) == true) end++;
			switch (i) {
				case 0:
					this.totalData.attempted = parseFloat(totalInfo.substring(offset, end));
					break;
				case 1:
					this.totalData.passed = parseFloat(totalInfo.substring(offset, end));
					break;
				case 5:
					this.totalData.gpa = parseFloat(totalInfo.substring(offset, end));
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
			console.log(parser.parseFromString(transcriptText,"text/html").documentElement);
			
		}
	)
	
	styleSections();
	alert("transcript parsed");
	return false;
}