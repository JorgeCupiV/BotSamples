var builder = require('botbuilder');
var restify = require('restify');

var server = restify.createServer();
server.listen(3978, function(){
    console.log("Server ready");
});

var connector = new builder.ChatConnector({
    appId : process.env.MsAppId,
    appPassword : process.env.MsAppPassword
});

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);

var firstTime = true;
bot.on('conversationUpdate', (message) => {
    if (message.membersAdded && firstTime) {
        firstTime = false;
        const hello = new builder.Message()
            .address(message.address)
            .text("Hi, I am Bot. I can answer your question");
        bot.send(hello);
        bot.beginDialog(message.address, '*:/');
    }
    else firstTime = true;
});

bot.dialog('/', [
    (session) => {
        builder.Prompts.text(session, 'Do you have any questions?');
    },
    (session, results) => {
        session.send('Here is your answer');
    }
]);