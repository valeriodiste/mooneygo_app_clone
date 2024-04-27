// Whether to start from the active ticket page or not
let startFromActivrTicketPage = true;

// Function used to show the dimensions of the screen, the window, and the document on the page at document load
function showDimensions() {

	// Add a div with, inside, the dimensions of the screen, the window, and the document
	$('#main').append('<div id="dimensions" style="z-index: 10; font-size: 24px; color: #000000;"></div>');
	$('#dimensions').append('<div id="screen"></div>');
	$('#dimensions').append('<div id="window"></div>');
	$('#dimensions').append('<div id="document"></div>');

	// Update the dimensions of the screen, the window, and the document
	function updateDimensions() {
		$('#screen').html('Screen: ' + screen.width + ' x ' + screen.height);
		$('#window').html('Window: ' + $(window).width() + ' x ' + $(window).height());
		$('#document').html('Document: ' + $(document).width() + ' x ' + $(document).height());
	}

	// Update the dimensions when the window is resized
	$(window).resize(updateDimensions);

	// Update the dimensions when the page is loaded
	updateDimensions();

}

// Functoin to move to the "ticket" page
function toggleActiveTicketPage(activate) {

	// Get the all tickets and active tickets sections
	let myTicketsSection = $("#tickets-section");
	let activeTicketSection = $("#active-ticket-section");

	if (activate) {
		// Hide the tickets section and show the active ticket section
		myTicketsSection.css("opacity", 0);
		activeTicketSection.css("opacity", 1);
		resetTicketLoadBar();
		console.log("Ticket activated");
	} else {
		// Hide the active ticket section and show the tickets section
		myTicketsSection.css("opacity", 1);
		activeTicketSection.css("opacity", 0);
		console.log("Back to tickets page");
	}

}

// Get a ticket code for a given emission date
function get_ticket_code(emissionDate) {
	// Offset in the future to consider for the given emission date to generate the ticket code (to be sure the ticket won't be expired)
	let emissionDateFutureOffsetDays = 2;
	// Given a ticket emission date in epoch time (i.e. seconds from 1/1/1970), approximate the ticket code
	function approximateTicketCode(ticketEmissionDateInEpochTime) {
		// NOTE: the w and b parameters of the line funcion were interpolated using 2 previous ticket emission dates and codes to estimate the function that relates the ticket emission date and the ticket code
		let w_parameter = 389.0 / 468300.0;
		let b_parameter = -1 * 10901564319.0 / 7805.0;
		let ticketCode = Math.round(w_parameter * ticketEmissionDateInEpochTime + b_parameter);
		return ticketCode;
	}
	let emissionDateFutureOffsetSeconds = emissionDateFutureOffsetDays * 24 * 60 * 60;
	let emission_date_epoch_time = emissionDate.getTime() / 1000;
	let ticket_code = approximateTicketCode(emission_date_epoch_time + emissionDateFutureOffsetSeconds);
	return ticket_code;
}

// Function to create the QR code for the ticket
function createQRCode(emissionDate = null) {
	// Get the "#qr-code" element
	let qrCodeElement = $("#qr-code").get(0);
	// Get the pixel width and height of the "#qr-code" element (in pixels)
	let qrCodeWidth = qrCodeElement.clientWidth;
	let qrCodeHeight = qrCodeElement.clientHeight;
	// Create the QR code
	let t_parameter = "20052167";
	if (emissionDate != null) {
		// Ticket code and emission date of the ticket with the corresponding t parameter
		let sample_ticket_code = 26982;
		// Get the ticket code of the current ticket
		let ticket_code = get_ticket_code(emissionDate);
		let tickets_code_difference = ticket_code - sample_ticket_code;
		let new_t_parameter = (parseInt(t_parameter) + tickets_code_difference).toString();
		console.log("New 't' parameter: " + new_t_parameter);
		t_parameter = new_t_parameter;
	}
	let v_parameter = "0735";
	let qr_code_text = "http://mccr.it/vt?t=" + t_parameter + "&v=" + v_parameter;
	console.log("QR code text: " + qr_code_text);
	// Url encoded
	let qrcode = new QRCode(qrCodeElement, {
		text: qr_code_text,
		width: qrCodeWidth,
		height: qrCodeHeight,
		colorDark: "#151515",
		colorLight: "#eff5f7",
		correctLevel: QRCode.CorrectLevel.L
	});

	// Return the QR code
	return qrcode;
}

// Function to update the current time on the ticket page
function updateCurrentTime() {
	let currentTimeElement = $("#current-time");
	let currentTime = new Date();
	let currentTimeText = currentTime.getHours().toString().padStart(2, "0") + ":"
		+ currentTime.getMinutes().toString().padStart(2, "0") + ":"
		+ currentTime.getSeconds().toString().padStart(2, "0");
	currentTimeElement.text(currentTimeText);
}

function resetTicketLoadBar() {
	$("#ticket-load-bar").width("100%");
}

function updateTicketLoadBar(deltaTime) {
	// Set expiration time and start width
	let expirationTime = 60;	// In seconds
	let startWidth = 97;
	let loadBar = $("#ticket-load-bar");
	// Make the loadBar width go from its current width to 0 in expirationTime seconds
	let currentWidth = 100 * parseFloat(loadBar.width()) / parseFloat(loadBar.parent().width());
	if (currentWidth > startWidth) {
		currentWidth = startWidth;
	}
	let newWidth = currentWidth - (startWidth * deltaTime / (expirationTime * 1000));
	if (newWidth < 0) {
		newWidth = 0;
	} else if (newWidth > startWidth) {
		newWidth = startWidth;
	}
	loadBar.width(newWidth + "%");
}

// Wait for the document to be ready
$(document).ready(function () {

	// Call the function to show the screen, window, and document dimensions on the page
	// showDimensions();

	// Get the ticket's emission and activation date to display (current day, some minutes before the current time)
	let activationMinutesBefore = 4;
	let emissionMinutesBefore = 42;
	let activationDateToUse = new Date();
	activationDateToUse.setMinutes(activationDateToUse.getMinutes() - activationMinutesBefore);
	let emissionDateToUse = new Date();
	emissionDateToUse.setMinutes(emissionDateToUse.getMinutes() - emissionMinutesBefore);
	// Format the dates as "dd/mm/yyyy - hh:mm"
	function getFormattedDate(date) {
		let day = date.getDate().toString().padStart(2, "0");
		let month = (date.getMonth() + 1).toString().padStart(2, "0");
		let year = date.getFullYear();
		let hours = date.getHours().toString().padStart(2, "0");
		let minutes = date.getMinutes().toString().padStart(2, "0");
		return day + "/" + month + "/" + year + " - " + hours + ":" + minutes;
	}
	let activationDateText = getFormattedDate(activationDateToUse);
	let emissionDateText = getFormattedDate(emissionDateToUse);

	// Update the ticket's activation date overlay text (in the tickets page)
	let ticketsActivationDateElement = $("#activation-date");
	ticketsActivationDateElement.text(activationDateText);

	// Update the ticket's activation date and emission dates (in the active ticket page)
	let activeTicketActivationDateElement = $("#ticket-activation-date");
	activeTicketActivationDateElement.text(activationDateText);
	let activeTicketEmissionDateElement = $("#ticket-emission-date");
	activeTicketEmissionDateElement.text(emissionDateText);

	// Add click functions to the ticket button
	let selectedOpacity = 0.4;
	let ticketClickOverlay = $("#ticket-button");
	// On tap down, set the ticket overlay to have an opacity of 0.3
	ticketClickOverlay.on("touchstart", function () {
		ticketClickOverlay.css("opacity", selectedOpacity);
	});
	// On tap up, set the ticket overlay to have an opacity of 0 and "activate" the ticket
	ticketClickOverlay.on("touchend", function () {
		// Wait 250ms before setting the opacity to 0 and activatig the ticket
		setTimeout(function () {
			// Activate the ticket
			toggleActiveTicketPage(true);
			// Set the opacity to 0
			ticketClickOverlay.css("opacity", "0");
		}, 200);
	});

	// On click of the "back" button on Android, go back to the tickets page
	let backButton = $("#back-button");
	backButton.on("click", function () {
		toggleActiveTicketPage(false);
	});

	// If the page should start from the active ticket page, activate the ticket page
	if (startFromActivrTicketPage) {
		toggleActiveTicketPage(true);
		ticketClickOverlay.css("opacity", "0");
	}

	// Set the ticket code on the ticket page
	let ticket_code_element = $("#ticket-code");
	let ticket_code = get_ticket_code(emissionDateToUse);
	ticket_code_element.text(ticket_code);

	// Create the QR code for the ticket (wait some seconds before creating it)
	let qrCode = null;
	setTimeout(function () {
		qrCode = createQRCode(emissionDateToUse);
	}, 200);

	// Update the current time each second
	updateCurrentTime();
	setInterval(updateCurrentTime, 1000);

	// update the ticket load bar in the ticket page
	let lastTime = new Date();
	setInterval(function () {
		let currentTime = new Date();
		let deltaTime = currentTime - lastTime;
		lastTime = currentTime;
		updateTicketLoadBar(deltaTime);
	}, 50);
	updateTicketLoadBar(0);

});