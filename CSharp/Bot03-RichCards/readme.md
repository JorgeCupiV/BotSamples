# Using Rich cards #
Now that we've covered the basics on how to interact with our users using plain text it's time to learn how to send them images, buttons, audio files, etc. We'll use rich cards.
This bot heavily relies on the documentation found at the  [Type of rich cards]((https://docs.microsoft.com/en-us/bot-framework/dotnet/bot-builder-dotnet-add-rich-card-attachments)) site on our Bot Builder official documentation.

There are eight types of rich cards:
- Adaptive card, that contains a combination of images, text, speech, buttons and input fields
- [Animation card](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.animationcard.html), that contains GIFs or short videos
- [Audio card](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.audiocard.html), that contains an audio file
- [Thumbnail card](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.thumbnailcard.html
), that contains a single image, buttons and text
- [Hero card](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.herocard.html
), that contains a large image, buttons and text
- [Receipt card](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.receiptcard.html
), that displays a receipt to the user
- [Signin card](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.signincard.html
), that enables a sign in process for the user
- [Video card](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.videocard.html), thay plays videos

We'll learn how to implement each of these rich cards in our third bot. The adaptive card will be a case of its own on a next bot sample, but first, we should define the logic behind our bot.

## Logic for our bot ##
Since we haven't start to use BotBuilder's regular expressions or implement cognitive sercices like LUIS or QnA maker we'll just ask the user to type keywords to decide which type of rich card wants to see.

So our bot root dialog will look like this:
```csharp
        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var activity = await result as Activity;
            var message = context.MakeMessage();

            message.Attachments.Add(DefineRichCard(activity.Text));

            await context.PostAsync(message);
            context.Wait(MessageReceivedAsync);
        }
```
We defined a 'DefineRichCard' method that receives the text the user wrote and apparently returns an attachment. Let's see the code behind this method:
```csharp
private Attachment DefineRichCard(string activityText)
{
    switch (activityText)
    {
        case "animation":
            // some code here
            return card.ToAttachment();
        case "audio":
            // some code here
            return card.ToAttachment();
        case "thumbnail":
            // some code here
            return card.ToAttachment();
        case "hero":
            // some code here
            return card.ToAttachment(); 
        case "receipt":
            // some code here
            return card.ToAttachment();
        case "signin":
            // some code here
            return card.ToAttachment();
        case "video":
            // some code here
            return card.ToAttachment();
        default:
            return null;
    }
}
```
So apparently we will be creating some Hero, Animation, Video and other cards depending on what the user wrote and will return said cards converted to attachments.
Let's examine case by case:

## Building the animation card ##
An [Animation card](https://docs.microsoft.com/en-us/dotnet/api/microsoft.bot.connector.animationcard?view=botconnector-3.11.1) has multiple useful parameters:
- Title: Defines the title of the card (optional)
- Subtitle: Defines a subtitle for the card (optional)
- Text: Defines a descriptive text for the card (optional)
- Image: An image to be displayed within the card (optional)
- Media: A list of MediaUrl objects that contain gifs, images, audio or small videos
- Buttons: A list of CardAction objects that define buttons and actions so the user can interact with the card (optional)
- Autoloop: A boolean that defines if the media will replay automatically (optional)
- Autostart: A boolean that defines if the media will start automatically (optional)
- Shareable: A boolean that defines if the media can be shared with others (optional)
```csharp
case "animation":
    AnimationCard card = new AnimationCard
    {
        Title = "Title",
        Subtitle = "Subtitle",
        Text = "Random text",
        Media =
        {
            new MediaUrl("http://alvarodias.org/images/articles/LoadingIndicators-AzureSplash.gif")
        },
        Buttons =
        {
            new CardAction("ImBack","First button")
        }
    };
    return card.ToAttachment();
```
> NOTE: If you insert and image of gif at the Media object, the Image object will not be displayed.

## Building an audio card ##
An [Audio card](https://docs.microsoft.com/en-us/dotnet/api/microsoft.bot.connector.audiocard?view=botconnector-3.11.1) has similar attributes to an Animation Card, in fact they're almost identical as there's only one extra attribute for the Audio Card:
- Aspect, which is the aspect ratio of the thumbnail/media placeholder and its allowed values are "16x9" and "9x16"

```csharp
case "audio":
    AudioCard audioCard = new AudioCard
    {
        Title = "Title",
        Subtitle = "Subtitle",
        Text = "Random text",
        Media =
        {
            new MediaUrl("http://ccrma.stanford.edu/~jos/wav/gtr-nylon22.wav")
        },
        Buttons =
        {
            new CardAction("ImBack","First button")
        }
    };
    return audioCard.ToAttachment();
```
## Building a Hero card ##
A [Hero card](https://docs.microsoft.com/en-us/dotnet/api/microsoft.bot.connector.herocard?view=botconnector-3.11.1) helps us displaying a large image and present the user with a few buttons to make choices. It comes handy when showing things to buy for our use.

As with the Audio card, a Hero card is similar to an animation card, but this time instead of a Media object it has an Image object which is a list of CardImage objects (the place where you put the image(s) you want to display:
```csharp
case "hero":
    HeroCard heroCard = new HeroCard
    {
        Title = "Microsoft",
        Subtitle = "Official website",
        Text = "Buy the new Xbox now",
        Images =
        {
            new CardImage("https://ncmedia.azureedge.net/ncmedia/2017/03/cropped-microsoft_logo_element-192x192.png")
        },
        Buttons =
        {
            new CardAction("openUrl","Go to site",null,"https://www.microsoft.com/es-co/")
        }
    };
    return heroCard.ToAttachment();
```

## Building a Thumbnail card ##
The [Thumbnail card](https://docs.microsoft.com/en-us/dotnet/api/microsoft.bot.connector.thumbnailcard?view=botconnector-3.11.1) gives us the same experience as a Hero Card with the exception that its image is displayed as a small thumbnail in the upper left side of the card instead of being displayed as a large one:

```csharp
case "thumbnail":
    ThumbnailCard thumbnailCard= new ThumbnailCard
    {
        Title = "Microsoft",
        Subtitle = "Official website",
        Text = "Buy the new Xbox now",
        Images =
        {
            new CardImage("https://ncmedia.azureedge.net/ncmedia/2017/03/cropped-microsoft_logo_element-192x192.png")
        },
        Buttons =
        {
            new CardAction("openUrl","Go to site",null,"https://www.microsoft.com/es-co/")
        }
    };
    return thumbnailCard.ToAttachment();
```