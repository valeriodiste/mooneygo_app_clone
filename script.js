
// Wait for the document to be ready
$(document).ready(function () {

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

	console.log('script.js loaded');

});