var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978,function(){
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId : process.env.MicrosoftAppID,
    appPassword : process.env.MicrosoftAppPassword
}); 

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector,[
    function(session){
        session.send("Hello, welcome to our bot");
        builder.Prompts.text(session, "What's your name");
    },
    function(session,results){
        session.dialogData.userName = results.response;
        builder.Prompts.time(session, 'When where you born?');
    },
    function(session,results){
        session.dialogData.userBirthDate = builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.number(session,"How many brothers and sisters do you have?");
    },
    function(session,results){
        session.dialogData.userNumberOfSiblings = results.response;
        builder.Prompts.choice(session,"What is your favorite color?",["Black", "White", "Blue", "Red"]);
    },
    function(session, results){
        session.dialogData.userFavoriteColor = results.response.entity;
        builder.Prompts.confirm(session,"Perfect, do you want me to save your data?",);
    },
    function(session, results){
        var userResponse = session.send;
        if(userResponse){
            session.send('Perfect %s!, your birthdate is %s, your favorite color is %s and you have %s siblings',
            session.dialogData.userName,
            session.dialogData.userBirthDate,
            session.dialogData.userFavoriteColor,
            session.dialogData.userNumberOfSiblings,
            session.dialogData.userName);
        }
        else{
            session.send("Don't worry %s, we can start again if you want", 
            session.dialogData.userName);
        }
    }

]);