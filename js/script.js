// dom elements for job role
const otherJobField = document.querySelector("#other-title");

// Dom elements for T-Shirt Info
const jobRoleSelect = document.querySelector("#title"),
	  themeSelect 	= document.querySelector("#design"),
	  colorSelect 	= document.querySelector("#color");

// Dom elements for Activity Registration
const registrationField = document.querySelector(".activities");

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

	addDefaultColorMessage();
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
			addDefaultColorMessage();
		}else if(e.target.value === "js puns") {
			removeDefaultColorMessage();
			updateOptionsToFitTheme(punColors);
		}else if(e.target.value === "heart js") {
			removeDefaultColorMessage();
			updateOptionsToFitTheme(heartColors);
		}
	}
});

/**
* 
*/
function addDefaultColorMessage() {
	// this hides all other options
	updateOptionsToFitTheme([]);
	
	let defaultMessage = `<option id="defaultMessage">Please Select a T-Shirt Theme</option>`
	colorSelect.insertAdjacentHTML('afterbegin', defaultMessage);
	colorSelect.firstElementChild.selected="selected";
}

/**
* Removes default message if it exists
*/
function removeDefaultColorMessage(){
	let defaultMessage = document.querySelector("#defaultMessage");
	defaultMessage ? defaultMessage.remove() :'';
}

/**
* 
*/
function updateOptionsToFitTheme(colors) {
	hideAllColors();
	unhideChosenColors();


	function hideAllColors() {
		let allColors = punColors.concat(heartColors);
		allColors.forEach(color => {
			let colorOptionElement = document.querySelector(`option[value=${color}]`);
			colorOptionElement.style.display = 'none';
			colorOptionElement.disabled = true;
		});
	}

	function unhideChosenColors(){
		colors.forEach((color,i) => {
			let colorOptionElement = document.querySelector(`option[value=${color}]`);
			colorOptionElement.style.display = 'block';
			colorOptionElement.disabled = false;

			// make the top visible element selected
			if(i === 0){
				colorOptionElement.selected="selected";
			}
		});
	}
}



registrationField.addEventListener("click", (e)=> {
	let dayAndTime = e.target.getAttribute('data-day-and-time') 
	let day = parseDay(dayAndTime);
	let startTime = parseStartTime(dayAndTime);
	let endTime = parseEndTime(dayAndTime);
	console.log(day);

	// for each event, check if there is a day conflict
	let events = registrationField.querySelectorAll("label");
	// Start at one because the first element, main conference, does not have a date and time
	for(let i = 1; i < events.length; i++){
		let event = events[i].firstElementChild;
		let eventDay = parseDay(event.getAttribute('data-day-and-time'));
		if(day === eventDay && event !== e.target){
			// if there is, check for a time conflict
			let eventDayAndTime = event.getAttribute('data-day-and-time');
			let eventStartTime = parseStartTime(eventDayAndTime);
			let eventEndTime = parseEndTime(eventDayAndTime);
			if((startTime >= eventStartTime && startTime <= eventEndTime) ||
				(endTime >= eventStartTime && endTime <= eventEndTime)){
				console.log("BREAC H " + event.name);
				// if there is, disable checkbox and grey out the option
				if(e.target.checked){
					events[i].style.color = "grey";
					event.disabled = true;
				}else {
					events[i].style.color = "black";
					event.disabled = false;
				}
			}
		} 
	}
	

});


function parseDay(dayAndTime) {
	return dayAndTime.match(/^\w+/i)[0];
}

function parseStartTime(dayAndTime) {
	let timeString = dayAndTime.match(/ \d+[ap]m+/i)[0];
	let time = parseInt(timeString.match(/\d+/));
	if(timeString.includes('p') && time != 12){
		time = time+12;
	}
	return time;
}

function parseEndTime(dayAndTime) {
	let timeString = dayAndTime.match(/\-\d+[ap]m+/i)[0];
	let time = parseInt(timeString.match(/\d+/));
	if(timeString.includes('p') && time != 12){
		time = time+12;
	}
	return time;
}















