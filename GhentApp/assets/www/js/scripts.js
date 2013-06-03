

var destinationPosition;
var destinationBearing;

var positionTimerId;
var currentPosition;
var prevPosition;
var prevPositionError;

var compassTimerId;
var currentHeading;
var prevHeading;
var prevCompassErrorCode;

function onDeviceReady(){
    minPositionAccuracy = 50; // Minimum accuracy in metres to accept as a reliable position
    minUpdateDistance = 1; // Minimum number of metres to move before updating distance to destination

    $targetLat = $('#target-lat');
    $targetLon = $('#target-lon');
    $error = $('#error');
    $results = $('#results');
    $distance = $('#distance');
    $bearing = $('#bearing');
    $heading = $('#heading');
    $difference = $('#difference');
    $arrow = $('#arrow');


    watchPosition();
    watchCompass();

    // Set destination
    $targetLat.change(updateDestination);
    $targetLon.change(updateDestination);
    updateDestination();

}

function watchPosition(){
    if(positionTimerId) navigator.geolocation.clearWatch(positionTimerId);
    positionTimerId = navigator.geolocation.watchPosition(onPositionUpdate, onPositionError, {
        enableHighAccuracy: true,
        timeout: 1000,
        maxiumumAge: 0
    });
}

function watchCompass(){
    if(compassTimerId) navigator.compass.clearWatch(compassTimerId);
    compassTimerId = navigator.compass.watchHeading(onCompassUpdate, onCompassError, {
        frequency: 100 // Update interval in ms
    });
}

function onPositionUpdate(position){
    if(position.coords.accuracy > minPositionAccuracy) return;

    prevPosition = currentPosition;
    currentPosition = new LatLon(position.coords.latitude, position.coords.longitude);

    if(prevPosition && prevPosition.distanceTo(currentPosition)*1000 < minUpdateDistance) return;

    updatePositions();
}

function onPositionError(error){
    watchPosition();

    if(prevPositionError && prevPositionError.code == error.code && prevPositionError.message == error.message) return;

    $error.html("Error while retrieving current position. <br/>Error code: " + error.code + "<br/>Message: " + error.message);

    if(!$error.is(":visible")){
        $error.show();
        $results.hide();
    }

    prevPositionError = {
        code: error.code,
        message: error.message
    };
}

function onCompassUpdate(heading){
    prevHeading = currentHeading;
    currentHeading = heading.trueHeading >= 0 ? Math.round(heading.trueHeading) : Math.round(heading.magneticHeading);

    if(currentHeading == prevHeading) return;

    updateHeading();
}

function onCompassError(error){
    watchCompass();

    if(prevCompassErrorCode && prevCompassErrorCode == error.code) return;

    var errorType;
    switch(error.code){
        case 1:
            errorType = "Compass not supported";
            break;
        case 2:
            errorType = "Compass internal error";
            break;
        default:
            errorType = "Unknown compass error";
    }

    $error.html("Error while retrieving compass heading: "+errorType);

    if(!$error.is(":visible")){
        $error.show();
        $results.hide();
    }

    prevCompassErrorCode = error.code;
}

function updateDestination(){
    destinationPosition = new LatLon($targetLat.val(), $targetLon.val());
    updatePositions();
}


function updatePositions(){
    if(!currentPosition) return;

    if(!$results.is(":visible")){
        $results.show();
        $error.hide();
    }

    destinationBearing = Math.round(currentPosition.bearingTo(destinationPosition));

    $distance.html(Math.round(currentPosition.distanceTo(destinationPosition)*1000));
    $bearing.html(destinationBearing);

    updateDifference();
}

function updateHeading(){
    $heading.html(currentHeading);
    updateDifference();
}

function updateDifference(){
    var diff = destinationBearing - currentHeading;
    $difference.html(diff);
    $arrow.css("-webkit-transform", "rotate("+diff+"deg)");
}

document.addEventListener('deviceready', onDeviceReady, false);