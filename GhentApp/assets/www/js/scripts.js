
function onDeviceReady(){
    //setup();
    //startWatchCompass();
    makeCall();
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
function makeCall() {
    // Config
    var apiBaseUrl = 'http://api.qype.com/v1';

    var apiUrlSuffix = '/places';
    var url = apiBaseUrl + apiUrlSuffix;
    $.getJSON("http://api.qype.com/v1/positions/51.053468,3.73038/places?consumer_key=u0smpYg86snHm2ia9kE6Q", function(data) {
        var mijnobj = $.xml2json(data);
        //$('#places').html(mijnobj.toString());
        //$.JSONView(data, $('#places'));
        var i = 0;
        //$('#places').html(JSON.stringify(data));

        var size = data['results'].length;
        for(var i = 0 ; i < size ; i++){
            $('#places').append(data['results'][i]['place']['title']);
        }

    });

}
document.addEventListener('deviceready', onDeviceReady, false);
