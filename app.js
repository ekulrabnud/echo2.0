
"use strict";
var request = require('request')
var cta = require('./utils/ctaBus.js')
var myBus = cta('UGHW4xQDfyQ3RGjN9DyVufdiH',5);
var W = require('openweather-apis');

W.setAPPID('df18e11e78b23f570319abb75cdac946')
W.setLang('en')
W.setCity('oak park il')



module.exports.goggles = function (event, context, handlerCallback) {
  
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        
        // if (event.session.application.applicationId !== "") {
        //      context.fail("Invalid Application ID");
        // }
        

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                	console.log(speechletResponse)
                    handlerCallback(null,buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    handlerCallback(null,buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            handlerCallback(null);
        }
    } catch (err) {
        handlerCallback(err,"Exception: " + err);
    }
};


/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}
/**
 * Calledcd  when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    
    console.log("This is the onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}
/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(callback)

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;
    // console.log(callback)
    //this.cb = callback;

    switch(intentName) {

        case "busIntent":

           console.log("busintent")
            myBus.getBuses(function(err,response){

                var cardTitle = 'Bustimes';
                var shouldEndSession = true;
                var speechOutput = response 
            
            callback({},buildSpeechletResponse(cardTitle,speechOutput,speechOutput,shouldEndSession))
            });

            break;

        case "weatherIntent":

            console.log("weatherIntent")

           

            W.getAllWeather(function(err, weather){
                console.log('gettingweather')
                var cardTitle = 'Weather';
                var shouldEndSession = true;
                var speechOutput = `The wind is ${weather.wind.speed} miles per hour and bearing ${Math.round(weather.wind.deg,1)} degrees.`
                

            callback({},buildSpeechletResponse(cardTitle,speechOutput,speechOutput,shouldEndSession))
            }.bind(this));
        
            break;
   
        case "AMAZON.HelpIntent":
                getWelcomeResponse(callback);
            break;
        
        case "AMAZON.StopIntent":
        case "AMAZON.CancelIntent":
        default:
            handleSessionEndRequest(callback);
            break;
    }
    
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    console.log(this)
	// this.cb = callback;
    var response = "Hello welcome to Goggles. In only have one skill at the moment"
    

    callback({},buildSpeechletResponse("test",response,"hello",true))


}

function handleSessionEndRequest(callback) {
    var cardTitle = ""; //"Session Ended";
    var speechOutput = ""; //"Thank you for trying the Alexa Skills Kit sample. Have a nice day!";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
          
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: "repromt"
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}










