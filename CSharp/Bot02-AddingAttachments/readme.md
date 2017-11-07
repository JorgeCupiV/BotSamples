# Attaching media to a message #
While it is cool to chat with our user, let's see how we can attach multimedia to a reply.

>TIP: Remember that we use Activities to interact with our users and in the MessageController class we check first if our user sent us a Message activity. If it is a Message Activity we reply with some text in our Root Dialog

## Attaching an image line by line ##

We need to create a message within our current context:
```csharp
IMessageActivity message = context.MakeMessage();
```

A Message type activity has an Attachment property which comes handy to send our useful different types of media. 
```csharp
message.Attachments.Add(new Attachment()
    {
        ContentType = "image/png",
        ContentUrl = "https://ncmedia.azureedge.net/ncmedia/2017/03/cropped-microsoft_logo_element-192x192.png",
        Name = "Azure logo"
    });
```

That's it, once we have an attachment in our message, we just have to send it to the user:
```csharp
await context.PostAsync(message);
```

## Full code to attach an image ##
```csharp
private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
{
    var activity = await result as Activity;

    IMessageActivity message = context.MakeMessage();
        
    message.Attachments.Add(new Attachment()
    {
        ContentType = "image/png",
        ContentUrl = "https://ncmedia.azureedge.net/ncmedia/2017/03/cropped-microsoft_logo_element-192x192.png",
        Name = "Azure logo"
    });
            
    await context.PostAsync(message);

    context.Wait(MessageReceivedAsync);
}
```

## Understanding the Attachment object ##
An [Attachment](https://docs.microsoft.com/en-us/dotnet/api/microsoft.bot.connector.attachment?view=botconnector-3.11.1) object has some main attributes:
- ContentType, MIME type / ContentType of the file we're attaching. 
- ContentUrl, the url where the content resides
- Name, the name of the attachment, it is an optional parameter
- Content, we could sent an object to our user if necessary (and probably parse it to something useful depending on the channel where the user is)

>TIP: If you want to learn more about MIME types [check this documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types).
## Sending audio or video files ##
Given that the Attachment's ContentType property defines the type of media we will be attaching, sending an audio or video instead of an image is just a matter or changing this attribute:

### Audio ###
```csharp
message.Attachments.Add(new Attachment()
{
    ContentType = "audio/wav",
    ContentUrl = "http://ccrma.stanford.edu/~jos/wav/gtr-nylon22.wav",
    Name = "Audio sample"
});
```

### Video ###
```csharp
message.Attachments.Add(new Attachment()
{
    ContentType = "video/mp4",
    ContentUrl = "http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4",
    Name = "Video sample"
});
```