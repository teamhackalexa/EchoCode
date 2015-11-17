var github = require('octonode');
var secrets = require('./secrets');
var alexaDateUtil = require('./alexaDateUtil');

var client = github.client(secrets.API_KEY);
var ghme = client.me();
var ghrepo = client.repo('teamhackalexa/EchoCode');

var username = 'teamhackalexa';
var repository = 'EchoCode';

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

    GetIssue: function(intent, session, response) {
      var issueNumber = intent.slots.number.value;
      console.log("GetIssueFunction Username: " + username);
      console.log("GetIssueFunction Repo: " + repository);
      ghissue = client.issue(username + '/' + repository, issueNumber);
      function callback(err, body, header){
        var output = "Issue number " + body["number"] + " titled " + body["title"] +
                     "submitted by user " + body["user"]["login"] + " on " + alexaDateUtil.getFormattedDate(new Date(body["created_at"])) +
                     " with body message " + body["body"];
        response.tell(output);
        
      };
      ghissue.info(callback);
    },

    RepoLanguagesIntent: function (intent, session, response) {
        function callback(err, body, header) {
            var keys = Object.keys(body);
            if( keys.length <= 1){
                var output = 'There is '+ keys.length + ' language in this repository, it is, ';
            } else{
                var output = 'There are ' + keys.length + ' languages in this repository, they are, ';
            }
            for (var i in keys) {
                output += keys[i] + ', ';
                if (i == keys.length-2 && keys.length > 1) {
                    output += 'and '
                }
            }
            response.tell(output);
        };
        ghrepo.languages(callback);
    },

    RepoContributorsIntent: function (intent, session, response) {
        function callback(err, body, header) {
            if( body.length <= 1){
                var output = 'There is '+ body.length + ' developers who have contributed to this repository, they are ';
            } else{
                var output = 'There are ' + body.length + ' developers who have contributed to this repository, they are ';
            }
            for (var i in body) {
                output += body[i]['login'] + ', ';
                if (i == body.length-2 && body.length > 1) {
                    output += 'and '
                }
            }
            response.tell(output);
        };
        ghrepo.contributors(callback);
    },

    CreateIssueIntentOneshot: function(intent, session, response) {
        var speechOutput, repromptText;
        function callback(err, body, header) {
            var output = "Issue number" + body["number"] + " titled " + body["title"];
            output += " was successfully created.";
            response.tell(output);
        };
        if(!intent.slots.title.value){
            repromptText = "Please try again";
            speechOutput = "You have not stated a valid title.";
            response.ask(speechOutput, repromptText);
            return;
        }
        if(!intent.slots.body.value){
            ghrepo.issue({"title": intent.slots.title.value}, callback);
        } else{
            ghrepo.issue({
                "title": intent.slots.title.value,
                "body": intent.slots.body.value
            }, callback);
        }
    },

    LastNotificationsIntent: function(intent, session, response) {
      function callback(err, body, header){
        var output;
        if(body.size == 0 || !body[0]){
            output  = "You do not have any notifications.";
            response.tell(output);
        } else{
            output = "Here's your latest notification. ";
            output += body[0]['subject']['title'] + ' of type ' + body[0]['subject']['type'];
            response.tell(output);
        }
      };
      ghme.notifications({},callback);
    },

    ChangeRepository: function(intent, session, response) {
      ghrepo = client.repo(username + '/' + repository);
      console.log("Change Profile Username: " + username);
      console.log("Change Repository name: " + repository);
      function callback(err, body, header) {
        var output = 'You have switched repositories.';
        response.tell(output);
      }
      ghrepo.info(callback);
    },
    SetProfileUsername: function(intent, session, response) {
      var profileUsername = intent.slots.profileUsername.value;
      username = profileUsername.replace(/\s/g, '');
      username = username.toLowerCase();
      console.log("username: " + username);
      var output = "The git hub profile has been set to " + username;
      response.tell(output);
    },
    
    SetRepositoryName: function(intent, session, response) {
      var repositoryName = intent.slots.repoName.value;
      repository = repositoryName.replace(/\s/g, '');
      repository = repository.toLowerCase();
      console.log("repository: " + repository);
      var output = "The repository has been set to " + repository;
      response.tell(output);
    },

    ThanksIntent: function(intent, session, response) {
      response.tell("You're welcome");
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

