
var map;
var service;
var infowindow;
var placelist;
var myLocation;
var locations;
var pictureLocations;
var photos;
var ratedPlaces;
var targetLat;
var targetLon;
var weather;
var time;
var placeID;
var properties;
var placeType;


function onSuccess(position) {
    myLocation = new google.maps.LatLng(position.coords.latitude ,position.coords.longitude);
    initialize();
}
function showDetails(result,status){
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        navigator.splashscreen.hide();
        placeType = result['types'][0];
        $('#address').html(result['formatted_address']);
        $('#tel').html(result['international_phone_number']);
        targetLat = result['geometry']['location'].lat();
        targetLon = result['geometry']['location'].lng();
        $('#icon').html('<img style="width:35%;" title="'+result.types[0]+'" src="'+result['icon']+'"/>');
        $('#placeName').html(result['name']);
        if(result['opening_hours']){
            if(result['opening_hours']['open_now']){
                $('#available').html('<div placeId="open"></div>');
            }else{
                $('#available').html('<div placeId="closed"></div>');
            }
        }
        startFollow();
        updateDestination();

    }
}
function showPlace(id){

    $('#star').raty({
        size:24,
        score:pictureLocations[id]['rating'],
        readOnly : function(){
            if(localStorage['ratedPlaces']){
                ratedPlaces = JSON.parse(localStorage['ratedPlaces']);
                if($.inArray(id, ratedPlaces) > -1){
                    return true;
                }
                return false;
            }
        },
        half     : true,
        starHalf : 'img/star-half-big.png',
        starOff  : 'img/star-off-big.png',
        starOn   : 'img/star-on-big.png',
        click    : function(){
            if($.inArray(id, ratedPlaces) > -1){
                $('#rating').append('Already rated!');
            }else{
                ratedPlaces.push(id);
                ratePlace()
                localStorage['ratedPlaces'] = JSON.stringify(ratedPlaces);
                $(this).raty('readOnly', true);
            }
        }
    });
    placeID = id;
    var request;
    request = {reference:pictureLocations[id]['reference']};

    service.getDetails(request, showDetails);
}
function createGallery(){

    photos = '<div id="slides">';
    var numbLocPic = pictureLocations.length;
    for(var j = 0; j < numbLocPic; j++){
        photos += '<img id="'+j+'" src="'+ pictureLocations[j].photos[0].getUrl({'maxWidth': 1000, 'maxHeight': 1000})+'" class="start" layout="portrait"/>';
    }
    photos += '</div>';
    $('#photoslides').html(photos);
    $("#slides").slidesjs({
        preload: true,
        preloadImage: '/img/loading.gif',
        callback:{
            loaded: function(){
                showPlace(0);
            },
            complete:function(){
                var greatest = 0;
                var view;
                $('#slides img').each(function(){
                    if($(this).css('z-index') > greatest){
                        greatest = $(this).css('z-index');
                        view = $(this).attr('id');
                        showPlace(view);
                    }
                })
            }
        },
        navigation: {
            active: true,
            effect: "slide"
        }
    });

}
function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        icon: place['icon'],
        position: new google.maps.LatLng(placeLoc.lat(), placeLoc.lng())
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}
function onError(){
    console.log('error: failed to load map');
}
function sliderHandler(){
    var request = {
        location: myLocation,
        radius: $(this).val(),
        types: ['food','museum','hotel','restaurant','movie_theater','zoo']
    }
    searchPlaces(request);
}
function onDeviceReady(){
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    $( "#sliderbar" ).on( 'change', sliderHandler);
}
function createListWithAllPlaces(){
    var counter = 0;
    placelist = '<ul data-role="listview" data-inset="true" data-theme="a" >';
    lengthLoc = pictureLocations.length;
    for (var i = 0; i < lengthLoc ; i++) {
        placelist += '<li id="'+ i +'" ><a id="'+ i +'" href="#">'+ pictureLocations[i]['name'] +'</a></li>';
    }
    placelist += "</ul>";
    $('#placed').html(placelist);
    $('#placed ul').listview();
    $('#placed  li').each(function(){
        $(this).on('click', function(e){
            var id = $(this).attr('id');
            var view;
            $('#slides a').each(function(){
                view = parseInt(id) + 1;
                if($(this).text() ==  view){
                    $(this).trigger('click');
                }
            })
            //showPlace($(this).attr('id'));
            $( "#left-panel" ).panel( "close" );
        })
    })
    createGallery();
}
function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var resultlengths = results.length;
        var counter = 0;
            for (var i = 0; i < resultlengths; i++) {
                if(results[i].photos){
                    pictureLocations[counter] = results[i];
                    counter++;
                    createMarker(results[i]);
                }
            }
            createListWithAllPlaces();
    }else{
        switch(status){
            case google.maps.places.PlacesServiceStatus.ERROR:
                navigator.notification.alert('There was a problem contacting the Google servers.');
                break;
            case google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR:
                navigator.notification.alert('The PlacesService request could not be processed due to a server error. The request may succeed if you try again.');
                break;
        }
    }
}
function searchPlaces(request){
    ratedPlaces = new Array();
    pictureLocations = new Array();
    service = new google.maps.places.PlacesService(map);
    service.search(request, callback);
}
function initialize() {
    var date = new Date();
    time = date.getHours();
    locations = new Array();
    weather = null;
    map = new google.maps.Map(document.getElementById('map'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: myLocation,
        zoom: 14
    });
    var marker = new google.maps.Marker({
        map: map,
        icon: 'img/boy.png',
        position: myLocation
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent('myname');
        infowindow.open(map, this);
    });

    if(weather == null){
        $.getJSON('http://api.wunderground.com/api/3fed3e770617fa74/conditions/q/' + myLocation.lat()+ ',' + myLocation.lng() +'.json',function(data){
            weather = data['current_observation']['temp_c'];
        })
    }
    if(!localStorage['userid']){
        localStorage['userid'] =  Math.floor(date.getTime() / 30000);
    }
    getRecommandations()
}
document.addEventListener('deviceready', onDeviceReady, false);