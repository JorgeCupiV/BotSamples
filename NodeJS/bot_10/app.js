var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(3980, function(){
    console.log("Server ready");
});

var connector = new builder.ChatConnector({
    appId : process.env.appId,
    appPassword : process.env.appPassword
});

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);

var ticketCount = 1;
var firstTime = true;

bot.on('conversationUpdate', (message) => {
    if(message.membersAdded && firstTime){
        firstTime = false;
        bot.beginDialog(message.address,'/');
    }
    else firstTime = true;
});

var numberOfTickets;
bot.dialog('/', [
    function(session){
        session.send("Welcome to our Bot service for buying plane tickets");
        builder.Prompts.text(session, "What's your name?");
    },
    function(session,results){
        session.conversationData.userName = results.response;
        builder.Prompts.number(session, `Hi there ${session.conversationData.userName}, how many tickets do you want to buy today?`);
    },
    function(session,results){
        session.conversationData.numberOfTickets = results.response;
        session.conversationData.passengers = new Array();
        session.conversationData.passengers.push({ 
            name: "Passenger name",
            number: "Phone number"
        })
        session.beginDialog('buyTickets');
    }
]);
bot.dialog('buyTickets',[
    function(session, args){
        if(args && args.isReloaded){
            ticketCount = 1;
            session.send(`Don't worry ${session.conversationData.userName}, we can start all over again.`);
        }
        session.send(`Passenger # ${ticketCount}:`);
        builder.Prompts.text(session, "Please write the passenger's full name");
    },
    function(session,results){
        session.dialogData.name = results.response;
        builder.Prompts.text(session, "Please write the passenger's phone number");
    },
    function(session,results){
        session.dialogData.number = results.response;
        ticketCount++;
        session.conversationData.passengers.push({ 
            name: session.dialogData.name,
            number: session.dialogData.number
        })

        if(ticketCount <= session.conversationData.numberOfTickets ){
            session.replaceDialog('buyTickets');
        }
        else {
            session.send(`That's it ${session.conversationData.userName}! We have all the info we need for your trip.`)
            session.replaceDialog('/');
            ticketCount = 1;
        }
    }
]).reloadAction(
    "restartBuyTicketDialog","",
    {
        matches:/start over|start again|restart/, 
        dialogArgs: {
            isReloaded: true
        }
    }
);