var github = require('octonode');

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.echo-sdk-ams.app.9cd90029-b9a5-4525-b60f-4a3a92846688";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var EchoCode = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
EchoCode.prototype = Object.create(AlexaSkill.prototype);
EchoCode.prototype.constructor = EchoCode;

EchoCode.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("EchoCode onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

EchoCode.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("EchoCode onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to Echo Code, ask about a repository";
    var repromptText = "Ask about a repository";
    response.ask(speechOutput, repromptText);
};

EchoCode.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("EchoCode onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

EchoCode.prototype.intentHandlers = {
    // register custom intent handlers
    TestIntent: function (intent, session, response) {
        var output = intent.slots.testslot.value
        response.tell(output);
    },
    ExitIntent: function (intent, session, response) {
        response.exit("Goodbye");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the EchoCode skill.
    var echoCode = new EchoCode();
    echoCode.execute(event, context);
};

