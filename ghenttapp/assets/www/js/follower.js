/**
 * Created with JetBrains PhpStorm.
 * User: yassin
 * Date: 06/06/13
 * Time: 09:57
 * To change this template use File | Settings | File Templates.
 */


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

function startFollow(){
    minPositionAccuracy = 500; // Minimum accuracy in metres to accept as a reliable position
    minUpdateDistance = 1; // Minimum number of metres to move before updating distance to destination
    $distance = $('#distance');
    $heading = $('#heading');
    $difference = $('#difference');
    $arrow = $('#arrow');
    $results = $('#results');
    watchPosition();
    watchCompass();
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
    var options = { frequency: 100 };
    if(compassTimerId) navigator.compass.clearWatch(compassTimerId);
    compassTimerId = navigator.compass.watchHeading(onCompassUpdate, onCompassError,options);
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
    console.log("Error while retrieving current position. <br/>Error code: " + error.code + "<br/>Message: " + error.message);

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

    console.log("Error while retrieving compass heading: "+errorType);


    prevCompassErrorCode = error.code;
}

function updateDestination(){
    destinationPosition = new LatLon(targetLat, targetLon);
    updatePositions();
}

function updatePositions(){
    if(!currentPosition) return;
    destinationBearing = Math.round(currentPosition.bearingTo(destinationPosition));
    $distance.html(Math.round(currentPosition.distanceTo(destinationPosition)*1000)+'m');
    updateDifference();
}

function updateHeading(){
    $heading.html(currentHeading);
    updateDifference();
}

function updateDifference(){

    var diff = destinationBearing - currentHeading;
    $difference.html(diff + '°');
    $arrow.css("-webkit-transform", "rotate("+diff+"deg)");
}
