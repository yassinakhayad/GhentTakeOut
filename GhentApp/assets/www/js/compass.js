
		//
	    // Start watching the acceleration
	    //
	    function startWatchCompass() {
	        // Update acceleration every 25ms
	        var options = { frequency: 100 };
	        watchID = navigator.compass.watchHeading(compassSuccess, onError, options);

	    }
	
	    // Stop watching the acceleration
	    //
	    function stopWatchAccelerometer() {
	        if (watchID) {
	            navigator.compass.clearWatch(watchID);
	            watchID = null;
	        }
	    }
	
	    // onSuccess: Get a snapshot of the current acceleration
	    //
	    function compassSuccess(heading) {
            map.setHeading(heading.magneticHeading);
	    }
	
