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
	// for each event, check if there is a day conflict
	let events = registrationField.querySelectorAll("label");
	// Start at one because the first element, main conference, does not have a date and time
	if(e.target.name !== "all"){
		for(let i = 1; i < events.length; i++){
			if(eventConflict(e.target, events[i].firstElementChild) ){
				handleCheckboxDisabling(events[i]);
			}
		}
	}

	updateTotalCost();

	function updateTotalCost() {
		let totalCost = 0;
		// if a total cost element already exists
		if(document.querySelector('#totalCost')){
			let totalCostElement = document.querySelector('#totalCost');
			totalCost = totalCostElement.innerHTML.match(/\d+/)[0];
			totalCost = parseInt(totalCost, 10);
			totalCostElement.remove();
		}

		let costToAdd = parseInt(e.target.getAttribute('data-cost'), 10);
		if(!e.target.checked) { costToAdd *= -1;}
		totalCost += costToAdd;

		let totalCostElement = `<span id="totalCost"> Total Cost: $${totalCost} </span> `;
		registrationField.insertAdjacentHTML('beforeend', totalCostElement);
	}




	/**
	* 
	*/
	function eventConflict(event1, event2) {
		let dayAndTime1 = event1.getAttribute('data-day-and-time'); 
		let dayAndTime2 = event2.getAttribute('data-day-and-time'); 

		return (dayConflict() && timeConflict() && event1 !== event2);

		/**
		* 
		*/
		function dayConflict() {
			let day2 = parseDay(dayAndTime2);
			let day1 = parseDay(dayAndTime1);
			return (day1 === day2);
		}

		/**
		* 
		*/
		function timeConflict(){
			let startTime1 = parseStartTime(dayAndTime1),
				endTime1 = parseEndTime(dayAndTime1);	
			let startTime2 = parseStartTime(dayAndTime2),
				endTime2 = parseEndTime(dayAndTime2);	

			return (startTime1 >= startTime2 && startTime1 <= endTime2) ||
				(endTime1 >= startTime2 && endTime1 <= endTime2);
		}


		/**
		* 
		*/
		function parseDay(dayAndTime) {
			return dayAndTime.match(/^\w+/i)[0];
		}

		/**
		* 
		*/
		function parseStartTime(dayAndTime) {
			let timeString = dayAndTime.match(/ \d+[ap]m+/i)[0];
			let time = parseInt(timeString.match(/\d+/));
			if(timeString.includes('p') && time != 12){
				time = time+12;
			}
			return time;
		}

		/**
		* 
		*/
		function parseEndTime(dayAndTime) {
			let timeString = dayAndTime.match(/\-\d+[ap]m+/i)[0];
			let time = parseInt(timeString.match(/\d+/));
			if(timeString.includes('p') && time != 12){
				time = time+12;
			}
			return time;
		}
	}

	/**
	* 
	*/
	function handleCheckboxDisabling(event) {
		let eventCheckbox = event.firstElementChild;
		if(e.target.checked){
			event.style.color = "grey";
			eventCheckbox.disabled = true;
		}else {
			event.style.color = "black";
			eventCheckbox.disabled = false;
		}
	}

});

















