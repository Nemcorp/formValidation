const otherJobField = document.querySelector("#other-title"),
	  jobRoleSelect = document.querySelector("#title"),
	  themeSelect 	= document.querySelector("#design"),
	  colorSelect 	= document.querySelector("#color");

const punColors 	= ['cornflowerblue', 'darkslategrey', 'gold'],
	  heartColors 	= ['tomato','steelblue','dimgrey'];



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
	toggleOtherJobField();

	function toggleOtherJobField() {
		if(e.target.value === "other") {
			otherJobField.style.display = "block";
		}else {
			otherJobField.style.display = "none";
		}
	}
});

themeSelect.addEventListener("change", (e)=> {
	toggleColorFieldText();

	function toggleColorFieldText() {
		if(e.target.value === "Select Theme") {

			hideOptionsFromSelect(heartColors.concat(punColors));
			let defaultMessage = `<option id="defaultMessage">Please Select a T-Shirt Theme</option>`
			colorSelect.insertAdjacentHTML('afterbegin', defaultMessage);
			colorSelect.firstElementChild.selected="selected";
		}else if(e.target.value === "js puns") {
			// Remove default message if it exists
			let defaultMessage = document.querySelector("#defaultMessage");
			defaultMessage ? defaultMessage.remove() :'';
			// Hide 'heart' theme options
			hideOptionsFromSelect(heartColors);
			// Unhide 'puns' theme options
			unHideOptionsFromSelect(punColors);
			colorSelect.firstElementChild.selected="selected";

		}else if(e.target.value === "heart js") {
			// Remove default message if it exists
			let defaultMessage = document.querySelector("#defaultMessage");
			defaultMessage ? defaultMessage.remove() :'';
			// hide 'puns' theme options
			hideOptionsFromSelect(punColors);
			// unhide 'heart' theme options
			unHideOptionsFromSelect(heartColors);

			//colorSelect.firstElementChild.selected="selected";
		}
	}
});


/**
* 
*/
function hideOptionsFromSelect(colors) {
	colors.forEach(color => {
		let colorOptionElement = document.querySelector(`option[value=${color}]`);
		colorOptionElement.style.display = 'none';
		colorOptionElement.disabled = true;
	});
}

/**
* 
*/
function unHideOptionsFromSelect(colors) {
	colors.forEach((color,i) => {
		let colorOptionElement = document.querySelector(`option[value=${color}]`);
		colorOptionElement.style.display = 'block';
		colorOptionElement.disabled = false;
		if(i === 0){
			colorOptionElement.selected="selected";
		}
	});
}














