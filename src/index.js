/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Greeter to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * HelloWorld is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var HelloWorld = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HelloWorld.prototype = Object.create(AlexaSkill.prototype);
HelloWorld.prototype.constructor = HelloWorld;

HelloWorld.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HelloWorld onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

HelloWorld.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HelloWorld onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Alexa Skills Kit, you can say hello";
    var repromptText = "You can say hello";
    response.ask(speechOutput, repromptText);
};

HelloWorld.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("HelloWorld onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

HelloWorld.prototype.intentHandlers = {
    // register custom intent handlers

    "SetCurrentRepo": function (intent, session, response) {
        handleSetCurrentRepo(session, response);
    },
    "ClearCurrentRepo": function (intent, session, response) {
        handleClearCurrentRepo(session, response);
    },
    "ListRepos": function (intent, session, response) {
        handleListRepos(session, response);
    },
    "ListBranches": function (intent, session, response) {
        handleListBranches(session, response);
    },
    "GetRepoCreator": function (intent, session, response) {
        handleGetRepoCreator(session, response);
    },
    "GetRepoCreation": function (intent, session, response) {
        handleGetRepoCreation(session, response);
    },
    "GetRepoDefault": function (intent, session, response) {
        handleGetRepoDefault(session, response);
    },
     "GetRepoLastMod": function (intent, session, response) {
        handleGetRepoLastModt(session, response);
    },
     "GetRepoInfo": function (intent, session, response) {
        handleGetRepoInfo(session, response);
    },
     "GetCurrentRepoName": function (intent, session, response) {
        handleGetCurrentRepoName(session, response);
    },
     "GetCurrentRepoCreator": function (intent, session, response) {
        handleGetCurrentRepoCreator(session, response);
    },
     "GetCurrentRepoCreation": function (intent, session, response) {
        handleGetCurrentRepoCreation(session, response);
    },
     "GetCurrentRepoDefault": function (intent, session, response) {
        handleGetCurrentRepoDefault(session, response);
    },
     "GetCurrentRepoLastMod": function (intent, session, response) {
        handleGetCurrentRepoLastMod(session, response);
    },
    "GetCurrentRepoInfo": function (intent, session, response) {
        handleGetCurrentRepoInfo(session, response);
    },
    "GetBranch": function (intent, session, response) {
        handleGetBranch(session, response);
    },
    "MakeRepo": function (intent, session, response) {
        handleMakeRepo(session, response);
    },
    "MakeBranch": function (intent, session, response) {
        handleMakeBranch(session, response);
    },
    "DeleteRepo": function (intent, session, response) {
        handleDeleteRepo(session, response);
    },
    "UpdateDefaultBranch": function (intent, session, response) {
        handleUpdateDefaultBranch(session, response);
    },
    "UpdateCurrentDefaultBranch": function (intent, session, response) {
        handleGetBranch(session, response);
    },
    "UpdateRepoName": function (intent, session, response) {
        handleUpdateRepoName(session, response);
    },
     "UpdateCurrentRepoName": function (intent, session, response) {
        handleUpdateCurrentRepoName(session, response);
    },
     "UpdateDescription": function (intent, session, response) {
        handleUpdateDescription(session, response);
    },
     "UpdateCurrentDescription": function (intent, session, response) {
        handleUpdateCurrentDescription(session, response);
    },
     
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say hello to me!", "You can say hello to me!");
    }
    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var helloWorld = new HelloWorld();
    helloWorld.execute(event, context);
};

