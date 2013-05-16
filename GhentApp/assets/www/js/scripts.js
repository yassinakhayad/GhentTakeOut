/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady(), false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
        startWatchCompass();
    }
};
function onError(){
    alert('err');
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

    // get device's geographical location and return it as a Position object (which is then passed to onSuccess)
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
function startWatch(){
    alert('err');
    var options = {frequency:100};
    startWatchAccelerometer()
    alert('err');

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
