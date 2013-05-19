
function onDeviceReady(){
    setup();
    startWatchCompass();
    //makeCall();
}

function onError(){
    console.log('err');
}
function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    infowindow  = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}
function detailsCallback(result, status){
    alert(status);
}
function nearByCallback(results, status) {

    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var listed = "<ul>";
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
            listed += '<li>' +place['name']+ '</li>';
        }
        listed += '</ul>';
        $('#places').html(listed);
    }
}
function onSuccess(position) {
    var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map  = new google.maps.Map(document.getElementById('map'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: myLocation,
        zoom: 15
    });
    var request = { location: myLocation, radius: '300', types: ['food'] };
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, nearByCallback);
    //service.getDetails(request, detailsCallback)
}
function setup() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}


function makeCall() {
    // Config
    var apiBaseUrl = 'http://api.qype.com/v1';

    var apiUrlSuffix = '/places';
    var url = apiBaseUrl + apiUrlSuffix;
    $.getJSON("http://api.qype.com/v1/positions/51.053468,3.73038/places?consumer_key=u0smpYg86snHm2ia9kE6Q", function(data) {
        var i = 0;
        var size = data['results'].length;
        for(var i = 0 ; i < size ; i++){
            $('#places').append(data['results'][i]['place']['title']);
        }

    });

}
document.addEventListener('deviceready', onDeviceReady, false);
