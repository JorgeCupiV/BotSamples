# Our first bot #
Our first bot, which we'll write in a file named app.js barely has 3 lines of code:

```javascript
var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();

var bot = new builder.UniversalBot(connector, function(session){
    session.send("You said %s", session.message.text);
});
```

## What do they do line by line? ##

Our first line simply imports botbuilder library which we previously installed using
    ``` 
    npm install botbuilder 
    ```
:
```javascript
var builder = require('botbuilder');
```

This second line initializes a Connector object and starts to listen to messages using its 'listen' function:
```javascript
var connector = new builder.ConsoleConnector().listen();
```
In this first demo we're using the ConsoleConnector, a type of Connector from the multiple that can be used withing Bot Bulder. We chose the ConsoleConnector because it's designed in a way that automatically listens for messages arriving from the console. (Perfect for our first bot approach!)
> TIP:For more information regarding ConsoleConnector <a href="https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.consoleconnector.html">take a look at its documentation</a>

Finally our third line initializes a UniversalBot object which optionally receives two paremeters:

- A connector object (which we created on the second line)
- A function that in this case is embedded in the constructor and it's purpose is simply to reply with a message using the text it received from the user first:

```javascript
var bot = new builder.UniversalBot(connector, function(session){
    session.send("You said %s", session.message.text);
});
```

> TIP: The UniversalBot class handles our conversations with users that are comming from multiple channel. For more information regarding UniversalBot <a
href="https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.universalbot.html">look at its documentation</a>

## Testing time ##
To test our bot we just have to type the next command in our console:
```console
node app.js
```
That's it! If we type some text in our console we'll receive a reply:
```console
hi
You said hi
hello
You said hello
```