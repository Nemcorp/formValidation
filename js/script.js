const form 				= document.querySelector('form');

// dom elements for job role
const otherJobField 	= document.querySelector("#other-title");

// Dom elements for T-Shirt Info
const jobRoleSelect 	= document.querySelector("#title"),
	  themeSelect 		= document.querySelector("#design"),
	  colorSelect 		= document.querySelector("#color");

// Dom elements for Activity Registration
const registrationField = document.querySelector(".activities");
const events = registrationField.querySelectorAll("label");

// Dom elements for Activity Registration
const paymentMethod 	= document.querySelector("#payment"),
	  ccNum 			= document.querySelector("#cc-num"),
	  zip 				= document.querySelector("#zip"),
	  cvv 				= document.querySelector("#cvv");	

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

	hideAllPaymentMethods();
	showPaymentMethod("credit-card");
	disableDefaultPaymentSelectMessage();
}


/*********************EVENT LISTENERS********************/

form.addEventListener("submit", (e)=>{
	if(!validateForm()) {
		e.preventDefault();
	}


	function validateForm() {
		let validName = validateName(),
			validEmail = validateEmail(),
			validRegistration = validateRegistration(),
			validPayment = validatePayment();

		console.log('valid name: ' + validName);
		console.log('valid email: ' + validEmail);
		console.log('valid registration: ' + validRegistration);
		console.log('valid payment: ' + validPayment);
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

function validatePayment() {
	if(paymentMethod.value === "credit-card" || paymentMethod.value === "select method"){
		let validCC  = validateCC(),
			validZip = validateZip(),
			validCvv = validateCvv();	
		return (validCC && validZip && validCvv);
	} else {
		return true;
	}

	function validateCC() {
		let ccRegex = /^\d{13,16}$/;
		if(validate(ccNum, ccRegex)){
			removeValidationError(ccNum);
			return true;
		}else {
			applyValidationError(ccNum, "valid credit card, no spaces");
			return false;
		}
	}

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


function validate(input, regex) {
	if(!regex.test(input.value)){
		return false;
	} else {
		return true;
	}
}

function applyValidationError(input, errorMessage="INVALID INPUT") {
	input.classList.add("invalid");
	addErrorMessage(errorMessage);


	function addErrorMessage(errorMessage) {
		if(!document.querySelector(`#${input.id}Error`)){
			let error = `<span class="errorMessage" id="${input.id}Error">${errorMessage}</span>`
			input.insertAdjacentHTML('beforebegin', error);
		}
	}
}

function removeValidationError(input) {
	input.classList.remove("invalid");
	if(document.querySelector(`#${input.id}Error`)){
		document.querySelector(`#${input.id}Error`).remove();
	}
}





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
	// Start at one because the first element, main conference, does not have a date and time
	if(e.target.name !== "all"){
		for(let i = 1; i < events.length; i++){
			if(eventConflict(e.target, events[i].firstElementChild) ){
				handleCheckboxDisabling(events[i]);
			}
		}
	}

	updateTotalCost();

	/**
	* 
	*/
	function updateTotalCost() {
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

		function addTotalCostWrapper() {
			let totalCostWrapper = 
				`<span id="totalCostWrapper"> Total Cost: $
					<span id="totalCost">0</span> 
				</span> `;
			registrationField.insertAdjacentHTML('beforeend', totalCostWrapper);
		}

		function removeTotalCostWrapper() {
			document.querySelector('#totalCostWrapper').remove();
		}

		function calculateNewTotalCost() {
			let previousCost = parseInt(totalCostElement.innerHTML, 10);
			let costToAdd = parseInt(e.target.getAttribute('data-cost'), 10);
			
			// If the box is being unchecked, subtract cost instead of adding it
			if(!e.target.checked) { costToAdd *= -1;}
			
			return previousCost + costToAdd;
		}

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
			event.classList.add("conflictingEvent");
			eventCheckbox.disabled = true;
		}else {
			event.classList.remove("conflictingEvent");
			eventCheckbox.disabled = false;
		}
	}

});

paymentMethod.addEventListener('change', ()=> {
	let method 	= paymentMethod.value;

	hideAllPaymentMethods();
	showPaymentMethod(method);
});


function showPaymentMethod(method) {
	document.querySelector("#"+method).style.display = 'block';
}

function hideAllPaymentMethods() {
	let paymentMethods = [];
	paymentMethods.push(document.querySelector('#credit-card'));
	paymentMethods.push(document.querySelector('#paypal'));
	paymentMethods.push(document.querySelector('#bitcoin'));
	
	paymentMethods.forEach((m)=> {
		m.style.display = "none";
	});
}

function disableDefaultPaymentSelectMessage() {
	paymentMethod.querySelector("option").disabled = true;
}














