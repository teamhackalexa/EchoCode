var github = require('octonode');
var secrets = require('./secrets');

var client = github.client(secrets.API_KEY);
var ghme = client.me();
var ghrepo = client.repo('teamhackalexa/EchoCode');

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
    var speechOutput = "Welcome to Echo Code, voice controlled access to the git hub API";
    var repromptText = "Ask about a question";
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

    BranchesIntent: function (intent, session, response) {
        function callback(err, body, header) {
            var num = Object.keys(body).length
            var output = 'There are ' + num + ' branches in this repository, they are, ';
            for (var i in body) {
                output += body[i]['name'] + ', ';
                if (i == num-2 && num > 1) {
                    output += 'and '
                }
            }
            response.tell(output);
        };
        ghrepo.branches(callback);
    },

    LatestCommitIntent: function (intent, session, response) {
       function callback(err, body, header) {
           // console.log(JSON.stringify(body[body.length - 1]));
           var output = 'The latest commit was made by '
           output += JSON.stringify(body[body.length - 1]['commit']['committer']['name']);
           output += ' with the message ';
           output += JSON.stringify(body[body.length - 1]['commit']['message']);
           // output += body[]
           response.tell(output);
       };
       ghrepo.commits(callback);
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

