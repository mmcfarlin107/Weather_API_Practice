$(document).ready(function(){

// Below is all used to get the GPS latitude and longitude of the user location.  It is stored in the pos.lat and pos.lng values.  It then runs the googleCall function after getting these values to give the coordinates.  The googleCall function also calls the infoAppend function (with a callback function) to put the user's zip-code on the DOM

var pos;
var location = {};  // this object stores the api call inforation for location
var weather = {}; //this object holds weather info
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
      pos={
      lat:position.coords.latitude,
      lng : position.coords.longitude
    };
    googleCall(weatherCall);
  });
} else {
  console.log('Can\'t get Coordinates')
}

//End of function

// Google API Call that returns the zip code and then calls the infoAppend function to put the location data on the DOM
function googleCall(weatherCall){
    $.ajax({
      type: 'POST',
      url:  'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + pos.lat + ','+ pos.lng + '&key=AIzaSyAus5r1JJ5jR0_s9-4IQ5v0dWA7cPWHTCI',
      success: function(data){
        console.log(data);
        location = {
        zipcode: data.results[4].address_components[0].long_name,
        city: data.results[4].address_components[1].long_name,
        state: data.results[4].address_components[3].short_name
      };
        weatherCall(location.state, location.city,infoAppend);
      }
    });
  };

// Puts the zip-code of the user on the DOM. Gets called in weatherCall function
  function infoAppend(){
  $('#zipcode').append('<p>The current zipcode is <span>'+location.zipcode + '</span></p>');
  $('#state').text(location.state + ".");
  $('#city').text(location.city  + ", ");
  $('#temp').append('<p> It is currently ' + weather.temp + '&#8457; </p>');
  $('#condition').append('<p> The current weather condition is <span id="lowercase">' + weather.condition + '</p>');
  };

var conditions;
//infoAppend is the callback function so that it cannot run until all data is obtained from API calls
function weatherCall(state, city, infoAppend){
  $.ajax({
    type: 'GET',
    url: 'http://api.wunderground.com/api/f32fa4d20086fa0e/features/conditions/q/' + city + '/' + state + '.json',
    success: function(data){
      weather = {
        temp: data.current_observation.temp_f,
        condition: data.current_observation.weather,
      }
      infoAppend();
    }
  })
}
//closes doc.ready
});
