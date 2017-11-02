var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(3978, function(){
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId : process.env.MicrosoftAppID,
    appPassword : process.env.MicrosoftAppPassword
});

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector,[
    function(session){
        session.beginDialog('askName');
    },
    function(session,results){
        session.dialogData.fullName = results.response;
        session.beginDialog('askForSiblings');
    },
    function(session,results){
        session.send('Nice! so your full name is %s',session.dialogData.fullName);
        session.send('And you have %s siblings', results.response);
    }
]);

bot.dialog('askName',[
    function (session){
       builder.Prompts.text(session,"Hi what's your name?");
    },
    function(session,results){
        session.dialogData.UserName = results.response;
        builder.Prompts.text(session, "And what's your last name?");
    },
    function(session,results){
        session.dialogData.UserLastName = results.response;
        var fullName = session.dialogData.UserName +" "+ session.dialogData.UserLastName;
        session.endDialogWithResult({response: fullName});
    }
]);

bot.dialog('askForSiblings',[
    function(session){
        builder.Prompts.number(session, "How many siblings do you have?");
    },
    function(session,results){
        session.dialogData.numberOfSiblings = results.response;
        session.endDialogWithResult({response: session.dialogData.numberOfSiblings});
    }
]);
