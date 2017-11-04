# Recalling dialogs #
What can we do if our user is filling a form and suddenly they type a wrong parameter? Simply, we can recall our dialog.

It is really simple, after checking a condition in our code (in the example above: if a person has too much brothers or sisters) we just call the method 'replaceDialog' and put the number of the current dialog:

```javascript
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
        else session.replaceDialog('siblingsDialog',{tooMuchSiblings:true});
    }
]).triggerAction({matches: /siblings/});
```
Notice we're also sending a boolean parameter called 'tooMuchSiblings' that is useful so our user knows why it is filling the form again.

>TIP: Although sending parameters is optional, is it recommended as it helps our user knows why they are filling the form again. We could send them tips over a wrong parameter they filled.

We also have to add a new 'args' parameter to the first function in our waterfall. This parameter contains all the parameters we are sending using the 'replaceDialog' method:
```javascript
bot.dialog('siblingsDialog', [
    function(session, args){
        if(args && args.tooMuchSiblings){
            session.send("I don't buy it. Really More than 20 siblings? Give me a break.");
        }
        builder.Prompts.number(session, "How many brothers do you have?");
    },

    // rest of functions

]).triggerAction({matches: /siblings/});
```

## Handling multiple errors ##
It is nice to know we are not limited to only a single parameter for each potential error our user could trigger:

```javascript
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
        // some code here
    },

    // more functions here

]).triggerAction({matches: /user/});
```
As we see in the example above, we have handlers for two possible errors:
- noName
- noLastName

And this is good so we could send different messages to the user depending on the error, instead of sending a generic message.