/**
 * Created with JetBrains PhpStorm.
 * User: yassin
 * Date: 07/06/13
 * Time: 10:39
 * To change this template use File | Settings | File Templates.
 */

function convertWeather(){
    //cold
    if(weather < 10 && weather > 0){
        return 0;
    }
    //normal
    if(weather > 10 && weather < 15){
        return 1;
    }
    //warm
    if(weather > 15){
        return 2;
    }
}
function convertTime(){
    // Morning
    if(time > 7 && time < 11){
        return 1;
    }
    //Midday + Noon
    if(time > 11 && time < 18){
        return 2;
    }
    //Evening
    if(time > 18 || time < 6){
        return 3;
    }
}
function getRecommandations(){
    var valWeather = convertWeather();
    var valTime = convertTime();
    properties = {
        timenow:time,
        weathernow:valWeather
    };
    $.ajax({
        url : 'http://yassinakhayad.ikdoeict.be/ghentdata/Recommandation',
        type: 'POST',
        dataTypes:'json',
        data : {'userid': localStorage['userid'],
                'timenow': properties['timenow'],
                'weathernow': properties['weathernow']
        }
    }).success(function(data, textStatus, jqXHR) {
            data['type'];
            //['food','museum','hotel','restaurant','movie_theater','zoo']
            var typesArray = new Array();
            var length = data['content'].length;
            for(var i = 0; i < length; i++ ){
                typesArray.push(data['content'][i]);
            }
            var request = {
                location: myLocation,
                radius: '7000',
                types: typesArray
            };
            searchPlaces(request);
        }).error(function(jqXHR, textStatus, errorThrown) {
            navigator.notification.alert(jqXHR.responseText);
        });
}
function ratePlace(){
    var userid = localStorage['userid'];
    var valWeather = convertWeather();
    var valTime = convertTime();
    properties = {
        timenow:time,
        weathernow:valWeather
    };
    $.ajax({
        url : 'http://yassinakhayad.ikdoeict.be/ghentdata/setRate',
        type: 'POST',
        dataTypes:'json',
        data : {'userid': localStorage['userid'],
            'timenow': properties['timenow'],
            'weathernow': properties['weathernow'],
            'type': properties['type']
        }
    }).success(function(data, textStatus, jqXHR) {
            if(data){
               console.log('ok');
            }
        }).error(function(jqXHR, textStatus, errorThrown) {
            navigator.notification.alert(jqXHR.responseText);
        });
}
