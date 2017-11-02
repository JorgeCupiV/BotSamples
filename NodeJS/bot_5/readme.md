# Our fifth bot: Dialogs part 2: Multiple waterfalls #
Learning how to use a waterfall was easy. Let's see if we can have multiple dialogs, each with its own waterfall.

## beginDialog method ##
To start a new dialog we must use the beginDialog method simply by giving the method the name of the dialog we want to trigger:

```javascript
var bot = new builder.UniversalBot(connector,[
    function(session){
        session.beginDialog('askName');
    },
    function(session,results){
        session.send(results.response);
    }
]);

bot.dialog('askName',[
    // code goes here
]);
```
What's the logic behind this dialog calling other dialogs? Basically, once we call 'beginDialog' the new 'askName' method will take control of the conversation with the user (meaning is at the top of the dialog stack). Once the askName dialog finishes it will return its result to the root dialog and the latest will process it in a second function receiving the result.

## Finishing a waterfall ##
And how does the dialog 'askName' can indicate the root dialog that it has finished? By calling the 'endDialogWithResult' or 'endDialog' method that is:
```javascript
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
```
In our example, the 'askName' dialog has a waterfall of its own and on its last function it finishes with a 'endDialogWithResult' method otherwise the bot will be stuck within the dialog.
In general, all dialogs what have waterfalls must be explicitly finished with a 'endDialog' or 'endDialogWithResult' methods depending on if the dialog has something to return or not.
If we will use the 'endDialogWithResult' method then we must return a response object:
```javascript
session.endDialogWithResult({
  response: { name: session.dialogData.name, company: session.dialogData.company }
});
```
> TIP: Said response object could be as simple as a string or a whole object

## Calling multiple dialogs? ##
Yes, once we have called a dialog we can start calling more, lets see how we can calll a second dialog:

```javascript
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
```

