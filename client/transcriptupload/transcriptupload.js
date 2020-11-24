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
    progressSection = document.getElementById("courseProgress");
    $("#courseMap").css({
        "border-top": "1px solid #ccc",
        "border-right": "1px solid #ccc",
        "padding": "10px"
    });
    $("#courseProgress").css({
        "border-top": "1px solid #ccc",
        "padding": "10px"
    });
}

function action(obj){
    console.log(obj.parentElement)
    
    if (obj.parentElement.children[1].style.display == "block"){
        obj.parentElement.children[1].style.display = "none";
    }
    else{
        obj.parentElement.children[1].style.display = "block";
    }
}


function parseTranscript(formObj) {
    $("#header").html("Your Transcript");
    styleFilename();

    var parser = new DOMParser();

    //var tFile = formobj.trascriptFile.value;

    //console.log(tFile)
    //console.log(formObj.transcript.files[0])

    var stream = formObj.transcript.files[0].text().then(
        function(result){
            var doc = parser.parseFromString(result, "text/html");
            console.log(doc)
            //console.log(doc.getElementById("headerinfo").innerHTML)
            //document.getElementById("userinfo").append(doc.getElementById("headerinfo"))
            document.getElementById("courseMap").innerHTML = "<h4 class=\"sectiontitle\">Courses Taken</h4>";
            document.getElementById("courseMap").append(parser.parseFromString("<section class=\"tablecontainer\"> \
                <div class=\"semtable\" id=\"1semest\"> \
                    <h2>Fall 2018</h2> \
                    <table> \
                        <tr> \
                            <th>Course</th> \
                            <th>Name</th> \
                        </tr> \
                        <tr> \
                            <td>ITWS1100</td> \
                            <td>Intro to ITWS</td> \
                        </tr> \
                        <tr> \
                            <td>CSCI1100</td> \
                            <td>Computer Science I</td> \
                        </tr>\
                        <tr> \
                            <td>MATH1010</td> \
                            <td>Calculus 2</td> \
                        </tr> \
                        <tr> \
                            <td>PHYS1100</td> \
                            <td>Physics 1</td> \
                        </tr> \
                    </table> \
                </div> \
                <div class=\"semtable\" id=\"2semest\"> \
                    <h2>Spring 2019</h2> \
                    <table> \
                        <tr> \
                            <th>Course</th> \
                            <th>Name</th> \
                        </tr> \
                        <tr> \
                            <td>CSCI2200</td> \
                            <td>FOCS</td> \
                        </tr> \
                        <tr> \
                            <td>CSCI2500</td> \
                            <td>Computer Organization</td> \
                        </tr>\
                        <tr> \
                            <td>MATH2010</td> \
                            <td>Multivariable Calculus</td> \
                        </tr> \
                        <tr> \
                            <td>PSYC1200</td> \
                            <td>General Psychology</td> \
                        </tr> \
                    </table> \
                </div>\
                <div class=\"semtable\" id=\"2semest\"> \
                    <h2>Fall 2019</h2> \
                    <table> \
                        <tr> \
                            <th>Course</th> \
                            <th>Name</th> \
                        </tr> \
                        <tr> \
                            <td>CSCI2300</td> \
                            <td>Intro to Algorithms</td> \
                        </tr> \
                        <tr> \
                            <td>CSCI2600</td> \
                            <td>Principles of Software</td> \
                        </tr>\
                        <tr> \
                            <td>MATH2400</td> \
                            <td>Differential Equations</td> \
                        </tr> \
                        <tr> \
                            <td>PSYC4730</td> \
                            <td>Positive Psychology</td> \
                        </tr> \
                    </table> \
                </div>\
            </section>","text/html").body.childNodes[0]);


            const dropbutton ="<svg onclick=\"action(this)\" class=\"dropbutton\" width=\"1em\" height=\"1em\" viewBox=\"0 0 16 16\" class=\"bi bi-caret-down-square\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"> \
            <path fill-rule=\"evenodd\" d=\"M3.544 6.295A.5.5 0 0 1 4 6h8a.5.5 0 0 1 .374.832l-4 4.5a.5.5 0 0 1-.748 0l-4-4.5a.5.5 0 0 1-.082-.537z\"/> \
            <path fill-rule=\"evenodd\" d=\"M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z\"/> \
            </svg>";

            const checkbutton ="<svg class=\"check\" width=\"1em\" height=\"1em\" viewBox=\"0 0 16 16\" class=\"bi bi-check-circle\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\">\
                <path fill-rule=\"evenodd\" d=\"M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"/>\
                <path fill-rule=\"evenodd\" d=\"M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z\"/>\
                </svg>";
            const xbutton = "<svg class=\"xbutton\" width=\"1em\" height=\"1em\" viewBox=\"0 0 16 16\" class=\"bi bi-x-circle\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\">\
            <path fill-rule=\"evenodd\" d=\"M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"/>\
            <path fill-rule=\"evenodd\" d=\"M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z\"/>\
          </svg>";
            document.getElementById("courseProgress").innerHTML = "<h4 class=\"sectiontitle\">Progress</h4>\
            <ul id=\"plist\" > \
                <li>Degree Progress 48/128 Credits"+ dropbutton + "\
                    <ul>\
                        <li>Core Major Requirements  "+ dropbutton + " \
                            <ul> \
                                <li>CSCI1100 Computer Science I"+ checkbutton + "  </li> \
                                <li>CSCI2200 Foundations of Computer Science"+ checkbutton + "  </li> \
                                <li>CSCI2500 Computer Organization"+ checkbutton + "  </li> \
                                <li>CSCI2600 Principles of Software"+ checkbutton + "  </li> \
                                <li>CSCI2300 Intro to Algorithms"+ checkbutton + "  </li> \
                                <li>CSCI4210 Operating Systems"+ xbutton + "  </li> \
                                <li>CSCI4430 Programming Languages"+ xbutton + "  </li> \
                            </ul>\
                        </li>\
                        <li>Dept Requirements"+ dropbutton + "\
                            <ul> \
                                <li>MATH1010 Calculus I"+ checkbutton + "  </li> \
                                <li>MATH1020 Calculus II"+ checkbutton + "  </li> \
                                <li>PHYS1100 Physics1"+ checkbutton + "  </li> \
                                <li>MATH2010 Multivariable Calculus"+ checkbutton + "  </li> \
                                <li>MATH2040 Differential Equations"+ checkbutton + "  </li> \
                                <li>BIO1010 Biology" + xbutton + "</li> \
                            </ul>\
                        </li> \
                        <li>HASS Requirements"+ dropbutton + "\
                            <ul> \
                                <li>PSYC1200 General Psychology"+ checkbutton + "  </li> \
                                <li>PSYC4730 Positive Psychology"+ checkbutton + "  </li> \
                                <li>HASS1*** HASS Eelective" + xbutton + "</li> \
                                <li>HASS1*** HASS Eelective" + xbutton + "</li> \
                                <li>HASS1*** HASS Eelective" + xbutton + "</li> \
                                <li>HASS1*** HASS Eelective" + xbutton + "</li> \
                            </ul>\
                        </li> \
                    </ul>\
                </li> \
            </ul>"
            
        }
    )
    
    styleSections();
    alert("transcript parsed");
    return false;
}