# Sixth bot: Learning to use trigger actions #
In the fourth example we acknowledged that our users might not follow our conversational flow as we intend and that they could reply our bot with a different answer that we were expecting. For example:
- We were expecting a dateTime and the user typed 'cancel'
- The user had to upload an image but typed 'help'
- A user is on its way to fill a form but types 'go back'

We could think of more of these examples, fortunately we have a tool in our Bot Builder SDK called 'triggerAction'.

## What is a trigger action? ##
It is a method we can attach to a specific dialog in a way that such dialog will be invoked when the user's input matches a term specified on the trigger action:

```javascript
bot.dialog('cancel', function(session,args,next){
    session.endDialog("It's ok, we'll start all over again");
}).triggerAction({ matches: /cancel/})
```
In this example, we have a 'cancel' dialog that will be called everytime a user replies our bot with the word 'cancel'.
>NOTE: It is IMPORTANT to note that once a triggerAction is triggered, the dialog stack is cleared and the triggered dialog becomes the new root dialog.

## Going back to the current dialog ##
If we don't want to clear the dialog stack then we must use the 'onSelectAction' method within the triggerAction:
```javascript
bot.dialog('about', function (session, args, next) {
    session.endDialog("I'm just a simple bot that asks names and number of siblings");
})
.triggerAction({
    matches: /about/,
    onSelectAction: (session, args, next) => {
        session.beginDialog(args.action, args);
    }
});
```
This tells our conversation that it should not reset the stack, remove the triggered dialog as soon as it ends and then go back to the latest dialog where the user was before triggering an action.

## Having context when triggering an action ##
But what happens if, say, our user types 'help'? Then it must be because it is having specific doubts with the current dialog owning the conversation. So, we shouldn't throw a generic help dialog but have a series of help dialogs to support complicated dialogs.

> Are you as dizzy as me by reading the word 'dialog' that much?

That's why Bot Builder has the trigger 'beginDialogAction that can be attached multiple times to a specific dialog:
```javascript
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

bot.dialog('help', function (session, args, next) {
    session.send("How difficult is to write the number of siblings you have? Press '1' for one sibling, '2' for two siblings, etc..");
    session.endDialog("Ready? Let's start again with the siblings question..");
});

bot.dialog('noSiblings', function (session, args, next) {
    session.endDialog("That's ok, just type '0' in that case.");
});
```
In this case, we have an 'askSiblings' method with two attached beginDialogAction triggers:
- 'helpAction', which will fire a dialog called 'noSiblings' when the user types the words 'none' or 'I don't have'
- 'helpNoSiblingsAction', which will fire a dialog called 'help' when the user types 'help'

This allow us to cover our bot with multiple scenarios where our user might need help.

>TIP: The 'matches' part of a triggerAction or a beginDialogAction receives a string, array of strings, regular expression, array of regular expressions or a combination of both. To learn more about JavaScript regular expressions [check their RegEx documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).

