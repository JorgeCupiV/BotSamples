var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(3978, function(){
    console.log("Server ready");
})

var connector = new builder.ChatConnector({
    appId : process.env.MsAppID,
    appPassword : process.env.MsAppPassword
});

server.post('/api/messages',connector.listen());

var bot = new builder.UniversalBot(connector,[
    function(session){
        session.beginDialog('askName');
    },
    function(session,results){
        var name = results.response;
        session.send('your name is %s', name);
        session.beginDialog('askSiblings');
    },
    function(session,results){
        var numberOfSiblings = results.response;
        if(numberOfSiblings ==0)
            session.send("So you have no siblings, me too");
        else   
            session.send("Cool! you have %s siblings", numberOfSiblings);
    }
]);

bot.dialog('askName', [
    function(session){
        builder.Prompts.text(session, "what's your name?");
    },
    function(session,results){
        var name = results.response;
        session.endDialogWithResult({ response : name});
    }
]);

bot.dialog('askSiblings', [
    function(session){
        builder.Prompts.number(session, "how many siblings do you have?");
    },
    function(session,results){
        var number = results.response;
        session.endDialogWithResult({ response : number});
    }
])
.beginDialogAction('helpAction', 'help', { matches: /help/ })
.beginDialogAction('helpNoSiblingsAction', 'noSiblings', { matches:/none|I don't have/ })
;

bot.dialog('cancel', function(session,args,next){
    session.endDialog("It's ok, we'll start all over again");
}).triggerAction({ matches: /cancel/})

bot.dialog('about', function (session, args, next) {
    session.endDialog("I'm just a simple bot that asks names and number of siblings");
})
.triggerAction({
    matches: /about/,
    onSelectAction: (session, args, next) => {
        session.beginDialog(args.action, args);
    }
});

bot.dialog('help', function (session, args, next) {
    session.send("How difficult is to write the number of siblings you have? Press '1' for one sibling, '2' for two siblings, etc..");
    session.endDialog("Ready? Let's start again with the siblings question..");
});

bot.dialog('noSiblings', function (session, args, next) {
    session.endDialog("That's ok, just type '0' in that case.");
});