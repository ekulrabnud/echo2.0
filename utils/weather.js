"use strict";
let W = require('openweather-apis');

W.setAPPID('df18e11e78b23f570319abb75cdac946')
W.setLang('en')
W.setCity('oak park il')


W.getAllWeather(function(err, weather){
        console.log(weather.wind.speed);
    });

