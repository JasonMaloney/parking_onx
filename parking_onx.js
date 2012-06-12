/**
 * Remember Parking Spot
 *
 * Nick Barone
 * @nbar1
 * Edited by Chris King
 * @raikia
 */

 var longitude_source = null;
 var latitude_source = null;
 
device.modeOfTransport.on('changed', function(signal)
{
	// Check to see if user went from 'driving' to 'atrest'
	// Might have to write this to check for 'driving' > 'atrest' with (x to y seconds in between)
	// then 'atrest' > 'walking' - or maybe listeners for each event.
	if ((signal.current === 'atrest' || signal.current === 'walking') && signal.previous === 'driving')
	{
		
		// Favorable signals caught
		var longitude_dest = signal.location.longitude;
		var latitude_dest = signal.location.latitude;
		
		// Set up notification
		// Clicking it will open Google Maps with directions to your stored coordinates
		var notification = device.notifications.createNotification('Parking Spot Remembered');
		notification.content = 'Click here to return to your vehicle.';
		notification.on('click', function() { 
			// Notification has been clicked.
			// Get current location information
			var listener = device.location.createListener('GPS', 5000);
			listener.on('changed', function (signal)
			{
				longitude_source = signal.location.longitude;
				latitude_source = signal.location.latitude;
				listener.stop();
			});
			listener.start();
			while (longitude_source === null || latitude_source === null) { }
			device.browser.launch("http://maps.google.com/maps?saddr="+latitude_source+","+longitude_source+"&daddr="+latitude_dest+","+longitude_dest);
			longitude_source = null;
			latitude_source = null;
		});
	}
});
