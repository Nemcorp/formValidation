const form 				= document.querySelector('form');

// dom elements for job role
const otherJobField 	= document.querySelector("#other-title");

// Dom elements for T-Shirt Info
const jobRoleSelect 	= document.querySelector("#title"),
	  themeSelect 		= document.querySelector("#design"),
	  colorSelect 		= document.querySelector("#color"),
	  colorSelectDiv    = document.querySelector("#shirt-colors");

// Dom elements for Activity Registration
const registrationField = document.querySelector(".activities");
const events = registrationField.querySelectorAll("label");

// Dom elements for Activity Registration
const paymentMethod 	= document.querySelector("#payment"),
	  ccNum 			= document.querySelector("#cc-num"),
	  zip 				= document.querySelector("#zip"),
	  cvv 				= document.querySelector("#cvv");	

// arrays containing data for which colors are available for which color category
const punColors 	= ['cornflowerblue', 'darkslategrey', 'gold'],
	  heartColors 	= ['tomato','steelblue','dimgrey'];


init();

/**
* Called on page load. Focuses on first text input, hides 'otherJobField', 
* adds a default color message, and sets default payment method
*/
function init(){
	// Focus on first text input on page
	document.querySelector("input[type=text]").focus();

	// hide 'other' job role field. It should only be revealed if
	// a user selects 'other' from the job role dropdown
	otherJobField.style.display = "none";


	addDefaultColorMessage();

	hideAllPaymentMethods();
	showPaymentMethod("credit-card");
	disableDefaultPaymentSelectMessage();

	hideColorSelectDiv();

	setDefaultPaymentOption();
}

function setDefaultPaymentOption() {
	paymentMethod.children.item(1).selected = "selected";
}


/**
* Validate the form on submittal. Prevents submittal if there is not a valid
* name, email, selected event, and payment information
*/
form.addEventListener("submit", (e)=>{
	if(!validateForm()) {
		e.preventDefault();
	}

	/**
	* Calls all validation functions. If any of them fail, false is returned
	* and the form should be prevented from submitting.
	*
	* @return {boolean} false if any validations fail, else true
	*/
	function validateForm() {
		let validName = validateName(),
			validEmail = validateEmail(),
			validRegistration = validateRegistration(),
			validPayment = validatePayment();

		return (validName && validEmail && validRegistration && validPayment);
	}

});


// listener for name validation
const nameInput = document.querySelector('#name');
nameInput.addEventListener("input", ()=> {
	validateName();
});

// listener for email validation
const emailInput = document.querySelector('#mail');
emailInput.addEventListener("keyup", (e)=> {
	if(e.key !== "Tab"){
		validateEmail();
	}
});

// listener for registration checkboxes
registrationField.addEventListener("click", (e)=> {
	if(e.target.checked){
		removeValidationError(registrationField.querySelector("legend"));
	}
});

// listener for cc validation
ccNum.addEventListener("keyup", (e)=> {
	if(e.key !== "Tab"){
		validatePayment();
	}
});

// listener for zip validation
zip.addEventListener("keyup", (e)=> {
	if(e.key !== "Tab"){
		validatePayment();
	}
});

// listener for cvv validation
cvv.addEventListener("keyup", (e)=> {
	if(e.key !== "Tab"){
		validatePayment();
	}
});

/**
* Validates whether email contained in the emailInput is in a valid format
*
* @return {boolean} true if email is valid, else false
*/
function validateEmail() {
	let regex = /^[^@]+@[^@]+\.\w{3}$/;
	if(validate(emailInput, regex)) {
		removeValidationError(emailInput);
		return true;
	} else {
		applyValidationError(emailInput, "Invalid Email");
		return false;
	}
}

/**
* Validates whether name is valid (ie. it cannot be blank)
*
* @return {boolean} true if name is not blank, else false
*/
function validateName() {
	let regex = /.+/;
	if(validate(nameInput, regex)) {
		removeValidationError(nameInput);
		return true;
	} else {
		applyValidationError(nameInput, "Name Cannot Be Blank");
		return false;
	}
}

// listener for activity registration validation
const registrationInput = document.querySelector('#name');
function validateRegistration() {
	let atLeastOneChecked = false;
	events.forEach((e)=> {
		if(e.firstElementChild.checked){
			atLeastOneChecked = true;
		}
	});

	if(!atLeastOneChecked){
		applyValidationError(registrationField.querySelector("legend"), "Please Select At Least One");
	}else {
		removeValidationError(registrationField.querySelector("legend"));
	}

	return atLeastOneChecked;
}


/**
* Validates whether payment information is valid. If payment method is paypal or bitcoin,
* no validation is necessary. If 'credit-card' or 'select method' (the default), then we
* must validated the cc Number, the zip, and the cvv.
*
* @return {boolean} true payment method is 'paypal' or 'bitcoin'. False if payment method is
*				    'credit-card' or 'select method' and the cc number, zip, or cvv are invalid
*/
function validatePayment() {
	if(paymentMethod.value === "credit-card" || paymentMethod.value === "select method"){
		let validCC  = validateCC(),
			validZip = validateZip(),
			validCvv = validateCvv();	
		return (validCC && validZip && validCvv);
	} else {
		return true;
	}

	/**
	* Validates whether cc number is valid. It must be a string of between 13-16 (inclusive) digits
	*
	* @return {boolean} true if ccNum is >=13 digits and <=16 digits, else false
	*/
	function validateCC() {
		let ccRegex = /^\d{13,16}$/;
		
		let customErrorMessage = "enter a valid credit card num, no spaces";
		if(ccNum.value.length <13) {
			customErrorMessage = "CC number must contain at least 13 digits";
		}else if (ccNum.value.length >16){
			customErrorMessage = "CC number cannot contain more than 16 digits";
		}

		if(validate(ccNum, ccRegex)){
			removeValidationError(ccNum);
			return true;
		}else {
			applyValidationError(ccNum, customErrorMessage);
			return false;
		}
	}

	/**
	* Validates whether zip is valid. Must be a string of 5 digits
	*
	* @return {boolean} true if zip is a string of 5 digits, else false
	*/
	function validateZip() {
		let zipRegex = /^\d{5}$/;
		if(validate(zip, zipRegex)){
			removeValidationError(zip);
			return true;
		}else {
			applyValidationError(zip, "5 digits please");
			return false;
		}
	}

	/**
	* Validates whether cvv is valid. Must be a string of 3 digits
	*
	* @return {boolean} true if cvv is a string of 3 digits, else false
	*/
	function validateCvv() {
		let cvvRegex = /^\d{3}$/;
		if(validate(cvv, cvvRegex)){
			removeValidationError(cvv);
			return true;
		}else {
			applyValidationError(cvv, "3 digits please");
			return false;
		}
	}

}

/**
* Given any input, this function will compare it to the given regex pattern. It 
* will return true if the pattern matches.
*
* @param {<input>} input   A dom element containing a string to be matched against regex
* @param {regular expression} regex   The pattern to be matched with input
*
* @return {boolean} true input matches the given regex pattern, else false
*/
function validate(input, regex) {
	if(!regex.test(input.value)){
		return false;
	} else {
		return true;
	}
}

/**
* Applies an error message directly before a given dom element, denoted by input. If no custom
* error message is provided, the error message will be "INVALID INPUT"
*
* @param {<input>} input    The dom element before which we wish to place the error message
* @ @param {string} errorMessage   The text of the message that will display
*/
function applyValidationError(input, errorMessage="INVALID INPUT") {
	// add styling
	input.classList.add("invalid");
	// add dom element
	addErrorMessage(errorMessage);


	function addErrorMessage(errorMessage) {
		if(!document.querySelector(`#${input.id}Error`)){
			let error = `<span class="errorMessage" id="${input.id}Error">${errorMessage}</span>`
			input.insertAdjacentHTML('beforebegin', error);
		}
	}
}

/**
* Removes an error message. This will be called when a user types a correctly formatted input
* into the corresponding field.
*
* @param {<input>} input    The dom element whose error message we wish to delete.
*/
function removeValidationError(input) {
	input.classList.remove("invalid");
	if(document.querySelector(`#${input.id}Error`)){
		document.querySelector(`#${input.id}Error`).remove();
	}
}




// event listener to toggle the display of the 'otherjobfield' when 'other' is selected from the dropdown
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

// event listener to toggle which color options are available based on which color theme is selected from the dropdown.
// EXTRA CREDIT. If the Color input and label are hidden, unhide them.
themeSelect.addEventListener("change", (e)=> {
	toggleColorFieldText();

	function toggleColorFieldText() {
		if(e.target.value === "Select Theme") {
			addDefaultColorMessage();
			hideColorSelectDiv();
		}else if(e.target.value === "js puns") {
			removeDefaultColorMessage();
			updateOptionsToFitTheme(punColors);
			unhideColorSelectDiv();
		}else if(e.target.value === "heart js") {
			removeDefaultColorMessage();
			updateOptionsToFitTheme(heartColors);
			unhideColorSelectDiv();
		}
	}
});


/**
* Does what is says
*/
function hideColorSelectDiv() {
	colorSelectDiv.style.display = "none";
}
/**
* Does what is says
*/
function unhideColorSelectDiv() {
	colorSelectDiv.style.display = "block";
}

/**
* Creates a default message for the t-shirt color select dropdown. Hides
* all other options.
*/
function addDefaultColorMessage() {
	// this hides all other options
	updateOptionsToFitTheme();
	
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
* Hides all colors, and then unhides those that should be displayed based on the 
* current chosen theme. The colors to unhide are passed in as an array.
*
* @param {array} colors   An array of colors which will be displayed in the dropdown. All
* others will be hidden and unselectable. If no argument is passed to the function, then
* all options will be hidden.
*/
function updateOptionsToFitTheme(colors = []) {
	hideAllColors();
	unhideChosenColors();

	/**
	* Hides and disables all colors in the color option dropdown. 
	*/
	function hideAllColors() {
		// combine pun colors and heart colors to get a complete list
		let allColors = punColors.concat(heartColors);
		// loop through all colors, hiding and disabling each one
		allColors.forEach(color => {
			let colorOptionElement = document.querySelector(`option[value=${color}]`);
			colorOptionElement.style.display = 'none';
			colorOptionElement.disabled = true;
		});
	}

	/**
	* Unhides and enables all colors in the color option dropdown. 
	*/
	function unhideChosenColors(){
		// loop through chosen colors; enable and display each one
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


/**
* Click listener for event registration checkboxes. When one is selected, the listener checks to see
* if there is an even conflict. If there is, it disables and styles the conflicting event(s). Then the
* total cost of the selected events is calculated and displayed 
*/
registrationField.addEventListener("click", (e)=> {
	// for each event that is NOT the main event ('all'), check if there is a day conflict
	if(e.target.name !== "all"){
		// Note( i=1 and not 1=0 because the first element does not have a date and time
		for(let i = 1; i < events.length; i++){
			if(eventConflict(e.target, events[i].firstElementChild) ){
				handleCheckboxDisabling(events[i]);
			}
		}
	}

	updateTotalCost();

	/**
	* Calculates total cost of all selected events and displays result to the dom
	*/
	function updateTotalCost() {
		// If there is not already an element to hold the total cost, create one.
		if(!totalCostWrapperExists()){
			addTotalCostWrapper();
		}


		let totalCostElement = document.querySelector("#totalCost");
		let totalCost = calculateNewTotalCost();
		totalCostElement.innerHTML = totalCost;

		if(totalCost <1 ) { removeTotalCostWrapper()};



		function totalCostWrapperExists() {
			return document.querySelector('#totalCostWrapper');
		}

		/**
		* Creates a dom element to display the total cost. Add it at the end of the 
		* event registration field. A wrapper is used to make it easy to update the 
		* totalCost variable without having to replace the entire dom element
		*/
		function addTotalCostWrapper() {
			let totalCostWrapper = 
				`<span id="totalCostWrapper"> Total Cost: $
					<span id="totalCost">0</span> 
				</span> `;
			registrationField.insertAdjacentHTML('beforeend', totalCostWrapper);
		}

		/**
		* Remove the total cost dom element. This is used when the total cost drops
		* to 0.
		*/
		function removeTotalCostWrapper() {
			document.querySelector('#totalCostWrapper').remove();
		}


		/**
		* Adds or subtracts the cost of a newly selected event to the total already contained in the 
		* totalCostElement. The result will be the total of all costs for selected events. 
		*
		* @return {int} The total integer cost of all events selected by the user.
		*               
		* Developer note: If the total returned is <=0, the total cost element should be deleted
		*/
		function calculateNewTotalCost() {
			// Find out what the cost total is already
			let previousCost = parseInt(totalCostElement.innerHTML, 10);
			// Find out how much the newly selected even costs.
			let costToAdd = parseInt(e.target.getAttribute('data-cost'), 10);
			
			// If the box is being unchecked, subtract cost instead of adding it
			if(!e.target.checked) { costToAdd *= -1;}
			
			return previousCost + costToAdd;
		}

	}




	/**
	* Given two events with a data-day-and-time attribute, determine whether there is a
	* conflict between them.
	*
	* @param {input:type=checkbox} event1   The first event containing a data-day-and-time attribute.
	* @param {input:type=checkbox} event2   The second event containing a data-day-and-time attribute.
	*	
	* @return {boolean}  True if there is a conflict between event1 and event2; false otherwise.
	*/
	function eventConflict(event1, event2) {
		let dayAndTime1 = event1.getAttribute('data-day-and-time'); 
		let dayAndTime2 = event2.getAttribute('data-day-and-time'); 
		if(dayAndTime1 && dayAndTime2) {
			return (dayConflict() && timeConflict() && event1 !== event2);
		}



		/**
		* Determines if two events, defined above, occur on the same day. 
		*
		* @return {boolean} True if conflict between days, else false
		*/
		function dayConflict() {
			let day2 = parseDay(dayAndTime2);
			let day1 = parseDay(dayAndTime1);
			return (day1 === day2);
		}

		/**
		* Determines if two events, defined above, occur simultaneously. Any 
		* overlap in start or end time counts as simultaneous.
		*
		* @return {boolean} True if there is a time conflict, else false
		*/
		function timeConflict(){
			let startTime1 = parseStartTime(dayAndTime1),
				endTime1 = parseEndTime(dayAndTime1);	
			let startTime2 = parseStartTime(dayAndTime2),
				endTime2 = parseEndTime(dayAndTime2);	

			// return false if event 1 starts during event 2 OR
			//        if event 1 ends during event 2
			return (startTime1 >= startTime2 && startTime1 <= endTime2) ||
				(endTime1 >= startTime2 && endTime1 <= endTime2);
		}


		/**
		* Finds and returns the day of an event given a dayAndTime string with the
		* format :"Tuesday 1pm-4pm"
		*
		* @param {string} dayAndTime    The string containing the day we wish to extract
		*
		* @return {string}  A string representation of the day contained in dayAndTime
		*/
		function parseDay(dayAndTime) {
			return dayAndTime.match(/^\w+/i)[0];
		}

		/**
		* Finds and returns the starting time of an event given a dayAndTime string with the
		* format :"Tuesday 1pm-4pm"
		*
		* @param {string} dayAndTime    The string containing the time we wish to extract
		*
		* @return {string}  A string representation of the start time contained in dayAndTime
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
		* Finds and returns the ending time of an event given a dayAndTime string with the
		* format :"Tuesday 1pm-4pm"
		*
		* @param {string} dayAndTime    The string containing the time we wish to extract
		*
		* @return {string}  A string representation of the end time contained in dayAndTime
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
	* Disables or re-enables any checkboxes that represent events that conflict with 'event'.
	* Also handles styling.
	*
	* @param {<label>} event  The outer dom element containing the event we wish to disable or
	* re-enable
	*/
	function handleCheckboxDisabling(event) {
		let eventCheckbox = event.firstElementChild;
		if(e.target.checked){
			event.classList.add("conflictingEvent");
			eventCheckbox.disabled = true;
		}else {
			event.classList.remove("conflictingEvent");
			eventCheckbox.disabled = false;
		}
	}

});

// Event listener to toggle visibility so that only the fields for the selected
// payment method are shown.
paymentMethod.addEventListener('change', ()=> {
	let method 	= paymentMethod.value;

	hideAllPaymentMethods();
	showPaymentMethod(method);
});

/**
* Unhides the dom element with a given payment method.
*
* @param {string} method   A string representation of the method we wish to display
*/
function showPaymentMethod(method) {
	document.querySelector("#"+method).style.display = 'block';
}

/**
* Hides all payment method fields. This is called as a sort of 'clear' before we
* unhide for the payment method we have selected.
*/
function hideAllPaymentMethods() {
	let paymentMethods = [];
	paymentMethods.push(document.querySelector('#credit-card'));
	paymentMethods.push(document.querySelector('#paypal'));
	paymentMethods.push(document.querySelector('#bitcoin'));
	
	paymentMethods.forEach((m)=> {
		m.style.display = "none";
	});
}

/**
* Does just what the function name says.
*/
function disableDefaultPaymentSelectMessage() {
	paymentMethod.querySelector("option").disabled = true;
}














