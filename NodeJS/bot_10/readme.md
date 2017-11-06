# Looping due the user's writing a keyword or keyphrase #
We'll rely heavily on our [bot_9 example](https://github.com/JorgeCupi/BotSamples/tree/master/NodeJS/bot_9). Over there we learned on how to loop over a dialog which is really useful. But what happens if our user typed a wrong data and now types something like 'start over' or 'start again'?

We'll, a workaround could be catching these phrases on the dialog's trigger action as [we learned before](https://github.com/JorgeCupi/BotSamples/tree/master/NodeJS/bot_6):
```javascript
function('functionName',[
    function(session){
        // some code here
    },
    // some waterfall going on here
])).triggerAction({ matches: /start again|start over/})
```

But in this scenario assumes we only have this dialog. We couldn't use this if we had 2 or more dialogs and each of them needed to expect the user to fail and ask for help.

## Enter reloadAction event ##
Thankfully each dialog can have a 'reloadAction' event attached. They are similar to our trigger actions but work only at the dialog level:

```javascript
function('functionName',[
    function(session){
        if(args && args.isReloaded){
            session.send(`Don't worry, we can start all over again.`);
        }
        // some other code here
    },
    // some waterfall going on here as well
]).reloadAction(
    "restartBuyTicketDialog","",
    {
        matches:/start over|start again|restart/, 
        dialogArgs: {
            isReloaded: true
        }
    }
);
```
A reloadAction event receives the next parameters:
- name of the event, in our example above: 'restartBuyTicketDialog'
- Optional: A message for our user, in our example: ''
- Optional: A 'matches' parameter where we put the keywords that we want to identify for the event to be triggered, in our example: 'start over', 'start again' or 'restart'
- Optional: arguments to send to the dialog 