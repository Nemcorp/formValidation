const otherJobField = document.querySelector("#other-title"),
	  jobRoleSelect = document.querySelector("#title");



init();

/**
* Called on page load.
*
*/
function init(){
	// Focus on first text input on page
	document.querySelector("input[type=text]").focus();

	// hide 'other' job role field. It should only be revealed if
	// a user selects 'other' from the job role dropdown
	otherJobField.style.display = "none";
}


/*********************EVENT LISTENERS********************/
jobRoleSelect.addEventListener("change", (e)=> {
	if(e.target.value === "other") {
		otherJobField.style.display = "block";
	}else {
		otherJobField.style.display = "none";
	}
});













