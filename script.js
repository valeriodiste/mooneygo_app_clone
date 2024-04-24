
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
		myTicketsSection.hide();
		activeTicketSection.show();
		console.log("Ticket activated");
	} else {
		// Hide the active ticket section and show the tickets section
		myTicketsSection.show();
		activeTicketSection.hide();
		console.log("Back to tickets page");
	}


}

// Wait for the document to be ready
$(document).ready(function () {

	// Call the function to show the screen, window, and document dimensions on the page
	// showDimensions();

	// Update the ticket's activation date overlay text
	let activationDateElement = $("#activation-date");
	// Get the date to display (current day, some minutes before the current time)
	let minutesBefore = 14;
	let dateToUse = new Date();
	dateToUse.setMinutes(dateToUse.getMinutes() - minutesBefore);
	// Format the date as "dd/mm/yyyy - hh:mm"
	let dateText = dateToUse.getDate() + "/" + (dateToUse.getMonth() + 1) + "/" + dateToUse.getFullYear() + " - " + dateToUse.getHours() + ":" + dateToUse.getMinutes();
	activationDateElement.text(dateText);

	// Add click functions to the ticket button
	let selectedOpacity = 0.4;
	let ticketClickOverlay = $("#ticket-button");
	// On tap down, set the ticket overlay to have an opacity of 0.3
	ticketClickOverlay.on("touchstart", function () {
		ticketClickOverlay.css("opacity", selectedOpacity);
	});
	// On tap up, set the ticket overlay to have an opacity of 0 and "activate" the ticket
	ticketClickOverlay.on("touchend", function () {
		// Activate the ticket
		toggleActiveTicketPage(true);
		// Wait 250ms before setting the opacity to 0
		setTimeout(function () {
			ticketClickOverlay.css("opacity", "0");
		}, 250);
	});

	// On click of the "back" button on Android, go back to the tickets page
	let backButton = $("#back-button");
	backButton.on("click", function () {
		toggleActiveTicketPage(false);
	});

});