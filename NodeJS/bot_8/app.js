var builder = require('botbuilder');
var restify = require('restify');

var server = restify.createServer();
server.listen(3979, function(){
    console.log("Server ready");
});

var firstTime = true;
var connector = new builder.ChatConnector({
    appId : process.env.MsAppId,
    appPassword : process.env.MsAppPassword
});

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);

bot.on('conversationUpdate', (message) => {
    if(firstTime){
        if (message.membersAdded) {
            firstTime = false;
            bot.beginDialog(message.address, '/');
        }
    }
});


bot.dialog('/', function(session){
    var card = new builder.HeroCard(session)
    .title("Hi there!")
    .text("I'm your assistant today. What info do you want to fill?")
    .buttons(
        [
            builder.CardAction.postBack(session,"siblings","Siblings info"),
            builder.CardAction.postBack(session,"user","User info")
        ]
    );

    var msg = new builder.Message(session);
    msg.addAttachment(card);

    session.endDialog(msg);
}).triggerAction({matches: /home|menu|main menu|principal/});


bot.dialog('siblingsDialog', [
    function(session, args){
        if(args && args.tooMuchSiblings){
            session.send("I don't buy it. Really More than 20 siblings? Give me a break.");
        }
        builder.Prompts.number(session, "How many brothers do you have?");
    },
    function(session,results){
        number = results.response;
        if(number<15){
            builder.Prompts.number(session, "And what about sisters? Do you have any?");
        }
        else session.replaceDialog('siblingsDialog', {tooMuchSiblings:true});
    },
    function(session,results){
        number = results.response;
        if(number<15){
            session.dialog("Thanks! I saved your information");
        }
        else session.replaceDialog('siblingsDialog', {tooMuchSiblings:true});
    }
]).triggerAction({matches: /siblings/});

bot.dialog('userDialog', [
    function(session, args){
        if(args && args.noName){
            builder.Prompts.text(session, "Oh come on! You can't leave a blank space as your name");
        }
        
        if(args && args.noLastName){
            builder.Prompts.text(session, "Look what you've done :(. Now we have to start all over again. Please don't leave blank spaces when filling your name or last name.");
        }

        else builder.Prompts.text(session, "What's your first name?");
    },
    function(session,results){
        var name = results.response;
        if(isNaN(name)){
            message = `Nice ${name}, what's your last name?`;
            builder.Prompts.text(session, message);
        }
        else session.replaceDialog('userDialog', {noName:true});
    },
    function(session,results){
        var lastName = results.response;
        if(isNaN(lastName)){
            var message = "You are all set";
            builder.Prompts.text(session, message);
        }
        else session.replaceDialog('userDialog', {noLastName:true});
    }
]).triggerAction({matches: /user/});