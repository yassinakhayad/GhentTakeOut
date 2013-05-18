
function onDeviceReady(){
    setup();
    startWatchCompass();
}

function onError(){
    console.log('err');
}
function onSuccess(position) {
    var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map  = new google.maps.Map(document.getElementById('map'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: myLocation,
        zoom: 15
    });

}
function setup() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}



function getInfo(){
    $.getJSON("http://api.qype.com/v1/places/67370?consumer_key=u0smpYg86snHm2ia9kE6Q", function(data) {
        if (data.ok) {
            $.each(data.results, function(i, place) {
                var link_to_qype = $.grep(place.place.links, function(value, i) {
                    return (value.rel == 'alternate')
                })[0];

                $('<li><a href="' + link_to_qype.href + '">' + place.place.title + '</a></li>').appendTo('#places');
            });
        } else {
            $('<h2>Oops: ' + data.status.error + '</h2>').appendTo('body');
        }
    });

}

var makeCall = function() {
    // Config
    var apiBaseUrl = 'http://api.qype.com/v1';

    var apiUrlSuffix = '/places';
    var url = apiBaseUrl + apiUrlSuffix;
    $.getJSON("http://api.qype.com/v1/places/show=a&in=gent?consumer_key=u0smpYg86snHm2ia9kE6Q", function(data) {
        alert('ik krijgi nfo?');
    });
    alert('hoid');
}
document.addEventListener('deviceready', onDeviceReady, false);
