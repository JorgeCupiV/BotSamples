## Looping over a bot dialog ##
We can leverage what we learned in the 'recalling dialogs' sample (bot_8) to simulate a loop and allow our users to write multiple entries within a single scope. Some scenarios we could think of are:
- Our user is pickin items to buy from a list we offer (shopping)
- Our user is filling a form that has multiple entries with the same format (filling passenger information when buying tickets)
- Others

Let's take on the passenger information scenario. Our user should indicate how many tickets it is buying, we could ask that in the root dialog. We will also create an array in our conversationData object, this array will be useful to store the passengers documentation if we want to display it to our user:

```javascript
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
```
>NOTE: Remember that objects such as dialogData or conversationData allows us to store data during our interaction with our user.

In our 'buyTickets' dialog we'll make our user write a form until our variable 'numberOfTickets' is equal to the number of tickets our user wants to buy:

```javascript
bot.dialog('buyTickets',[
    function(session){
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
]);
```