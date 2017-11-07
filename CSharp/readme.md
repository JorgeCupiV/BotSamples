# Bot fundamentals using C# #
We're building a solution called 'BotBuilder' that has multiple projects. Each of these projects will be a sample on its own and have a readme file explaining what was done.

## Bot Application template for Visual Studio ##
In this C# section of our Bot Samples repo we will use Visual Studio's Bot template for building our bots. You can [download it here](http://aka.ms/bf-bc-vstemplate).
To 'install' the template, simply go to your Visual Studio folder and look for the template folder. If you installed Visual Studio with the general settings, the folder should be here:
```console
C:\Users\{YourUserName}\Documents\{Your Visual Studio version}\Templates\ProjectTemplates\Visual C#
```
Paste the Zip you downloaded and you are ready to go. The Bot Application template will appear on your Visual Studio projects list:
![Image 1. Bot Application template in Visual Studio](https://docs.microsoft.com/en-us/bot-framework/media/connector-getstarted-create-project.png)

>NOTE: You don't really need the template to build bots in Visual Studio (or any other IDE / Code editor you use). The template just helps us providing some structure to start faster.

## Project structure ##
Simply put, the Bot Application template is based on an ASP.net WebAPI project that helps us publishing our Bot faster to the web so it has some familiar structure to those that have developed webs using C# before:
- App_Start folder. Contains the 'WebApiConfig.cs' file that helps our Bot route its messages among other settings.
- Controllers folder. Coming from the MVC world, this is the folder where we will put different Controller classes.
  - MessageController.cs file. Has a MessagesController class that is the main door for our user to interact with our bot with its Post method. 
- Dialogs folder. Same as the Controllers Folder, it is a folder where we will store the different dialogs our bot will have.
- default.htm file. Page where we can describe our Bot and define terms of use, etc.
- Global.asax file. Starts the application and its configuration.
- packages.config file. Contains the references to all of our bot dependencies.
- Web.config file. Web configuration file to define keys, behavior of the WebAPI, etc.

## Packages required ##
All of our bots will require the Nuget package Microsoft.Bot.Builder. To install it, simply open the Package Manager Console and type:

```console
install-package Microsoft.Bot.Builder
```

## List of samples ##
- [Bot01-HelloWorld](https://github.com/JorgeCupi/BotSamples/tree/master/CSharp/bot_1) is a bot that will help us understand the basic functions our C# project has hosting a Bot.