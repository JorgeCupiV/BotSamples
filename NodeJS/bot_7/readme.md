# Let the bot start the conversation #
So far, our past 6 bots have always waited for the user to start the conversation. However, what could we do if we wanted our bot to say the first 'hi' or at least give some perspective to the user?

While there's no easy solution there are workarounds, we'll study the workaround provided by [Eric Anderson (eanders-MS)](https://github.com/eanders-MS) in an issue raised at the [Github repo for the BotBuilder SDK](https://github.com/Microsoft/BotBuilder/issues/1796):

## Leveraging the 'conversationUpdate' event from our bot:
```javascript
bot.on('conversationUpdate', (message) => {
    if (message.membersAdded) {
        var msg = new builder.Message()
            .address(message.address)
            .text("Hi, I am Bot. What can I do today for you?");
        bot.send(msg);
        bot.beginDialog(message.address, '/');
        }
    }
});
```

As we can see, there's an event called [conversationUpdate](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.iconversationupdate.html) which is triggered when a new user joins the conversation (including the bot itself). After our bot has send a greeting message it will redirect the user to a dialog, in this case, to our root dialog '/'.

So, that would mean our message "Hi, I am Bo...." will be sent twice to the user. What can we do to stop this? Simply defining a boolean outside and asking for it:

```javascript
var firstUser = true;
bot.on('conversationUpdate', (message) => {
    if (message.membersAdded && firstUser) {
        firstUser = false;
        var msg = new builder.Message()
            .address(message.address)
            .text("Hi, I am Bot. What can I do today for you?");
        bot.send(msg);
        bot.beginDialog(message.address, '/');
    }
    else firstTime = true;
});
```

We also have set firstTime to false because if the user refreshes te page where the bot is hosted (in case we are using the Bot's webchat channel). The bot won't start the conversation anymore.

## FAQ ##
- Do we have to change our root dialog?
Not really, just by adding this conversationUpdate method our bot is ready to start a conversation.

- Can we call a different method than our root dialog? Sure! We just have to write the name of the dialog we want to call in the beginDialog() method.

- Will the bot start the conversation no matter the channel? For example, the bot will start the conversation at the Bot Emulator or the WebChat but not Skype (as it would be considered spam).