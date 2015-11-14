var timeStamp = new Date()
  , appId = null
  , AlexaSkill = require('./AlexaSkill');

var EchoCode = function(){
  AlexaSkill.call(this, appId);
};

EchoCode.prototype = Object.create(AlexaSkill.prototype);
EchoCode.prototype.constructor = EchoCode;

EchoCode.prototype.eventHandlers.onLaunch = function(launchRequired, session, response){
  var output = 'Welcome to Echoed. ' + 'Please say a Commit Code command or say help.';
  var reprompt = 'Please say a Commit Code command or say help.';

  response.ask(output, reprompt);
};
