# Our third bot #
On this occasion we will learn how to use 'rich cards' on our bot's replies.
This bot heavily relies on the documentation found at the  ["Type of rich cards"] site on our Bot Builder official documentation.(https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-send-rich-cards)

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

So our bot conversation will look like this:
```javascript
var bot = new builder.UniversalBot(connector, function(session){
    var message = new builder.Message(session);
    var richCard = defineRichCard(session.message.text, session);
    
    if(richCard != null){
        message.addAttachment(richCard);
        session.send(message);
    }
    else{
        session.send("Please, for this demo type some of the next words: 'animation', 'audio', 'animationwithaudio', 'hero', 'thumbnail', 'receipt', 'signin' or 'video'");
    }
    
});
```
Our first two lines of code don't change that much comparing to our previous examples. However our third line:
```javascript
var richCard = defineRichCard(session.message.text, session);
```
is calling a method called 'defineRichCard' that receives the user's input and the bot session and apparently returns a richCard. We'll take a look at the defineRichCard method later.

 The next lines are more easy to comprehend:
 ```javascript
     if(richCard != null){
        message.addAttachment(richCard);
        session.send(message);
    }
    else{
        session.send("Please, for this demo type some of the next words: 'animation', 'audio', 'animationwithaudio', 'hero', 'thumbnail', 'receipt', 'signin' or 'video'");
    }
 ```
 we are looking if the richCard object is not null that would mean it actually received a rich card from the method 'defineRichCard':
 - If it is not null then it will add given rich card as an attachment to a message and said message will be sent to the user.
 - It it is null the bot will display a message to the user stating to please write a specific keyword to generate a rich card.

### defineRichCard method ###
This method just has a switch statement to choose a card to create depending on what the user wrote to our bot:
```javascript
function defineRichCard(typeOfCard,session){
    switch (typeOfCard) {
        case 'animation':
            return createAnimationCard(session);
            break;
        case 'audio':
            return createAudioCard(session);
            break;
        case 'animationwithaudio':
            return createAnimatioCardWithAudio(session);
            break;
        case 'hero':
            return createHeroCard(session);
            break;
        case 'thumbnail':
            return createThumbnailCard(session);
            break;
        case 'receipt':
            return createReceiptCard(session);
            break;
        case 'signin':
            return createSigninCard(session);
            break;    
        case 'video':
            return createVideoCard(session);
            break;
        default:
            break;
    }
}
```
If the user didn't wrote a valid keyword the method will just go to the default case and return nothing.

## Logic for our rich cards ##

### Media card ###
Our animation, audio and video cards all come from the [media card class](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.mediacard.html) which means that have identhical methods and attributes such as:
- Title. Optional, is the main text to be displayed for a card.
- Subtitle. Optional, the secondary text to be displayed for a media card or its derivates
- Text. Optional, text that appears mostly below the subtitle and can be used as a descriptive text for the card probably explaining the gif, image, video or audio presented to the user.
- Image. Optional, a CardImage object that helps display an image complementing the media presented to the user
- Buttons. Optional, a list of CardAction objects that serve as buttons to help the user take an action
- Media. Not optional, the most important object, represents a list of ICardMediaUrl objects that help present the user a GIF, audio, video or picture file

### Animation card ###
```javascript
function createAnimationCard(session) {
    var card = new builder.AnimationCard();

    card.title("Title");
    card.subtitle("Subtitle");
    card.text("Text below the subtitle");
    card.media(
        [
            { url: 'http://alvarodias.org/images/articles/LoadingIndicators-AzureSplash.gif' }
        ]
    );
    return card;
}
```
As mentioned before, the AnimationCard inherits its methods from the MediaCard class. It does have an image method but it would not make sense to have an image in an AnimationCard which is supposed to show the user a GIF or short video.
> NOTE: Funny thing, even if we declare an image for an animation card it will not be displayed if we are showing a gif in the media method


### Audio card ###
```javascript
var card = new builder.AudioCard(session);
    card.title("Title");
    card.subtitle("Subtitle");
    card.text("Text below the subtitle");
    card.media(
        [
            { url: 'https://ia902508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3' }
        ]
    );
    return card;
```
Almost identical as the AnimationCard since the AudioCard also inherits all of its methods from the MediaCard.
### Animation with audio ###
Given that an AudioCard is almost identical as an AnimationCard. Is it possible to display audio using the AnimationCard? Lets see:
```javascript
function createAnimatioCardWithAudio(session){
    var card = new builder.AnimationCard();
    
    card.title("Title");
    card.subtitle("Subtitle");
    card.text("Text below the subtitle");
    card.image(new builder.CardImage.create(session, 'http://alvarodias.org/images/articles/LoadingIndicators-AzureSplash.gif'));
    card.media(
        [
            { url: 'https://ia902508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3' }
        ]
    );
    return card;
}
```
Indeed, it is possible to do it. In fact it is even possible to include an image to complement the audio file using an AnimationCard.
### Video card ###
```javascript
function createVideoCard(session){
    
    var card = new builder.VideoCard(session);
    
    card.title("Video title");
    card.subtitle("Video subtitle");
    card.text("Description for video");
    
    card.media(
        [
            { url: 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4' }
        ]
    )

    card.buttons(
        [
            builder.CardAction.openUrl(session,"https://dev.botframework.com/","More info")
        ]
    )

    return card;  
}
```
The last rich card that also inherits its methods from the MediaCard. The only difference against the AnimationCard is that the VideoCard is helpful to present longer videos to the user rathen than GIFs or short videos.
## Thumbnail card ##
The ThumbnailCard is a rich carf of its own.
It has the next main methods:
- Images. Not optional, list of ICardImage objects to represent a list of images that will be displayed to the user. 
- Buttons. Optional, a list of CardAction objects that help the user take a decision for this card
- Title. Optional, the main text to be displayed for the card
- Subtitle. Optional, the secondary text to be displayed for a media card or its derivates
- Text. Optional, text that appears as a descriptive text for the card
- Tap. Optional, an ICardAction object that contains the logic that should be launched if the user taps the ThumbnailCard

```javascript
function createThumbnailCard(session){
    var card = new builder.ThumbnailCard(session);
    card.images(
        [
            { url : 'http://www.knowledgewave.com/hs-fs/hubfs/blog_images/MSAzure.png?t=1506454430034&width=320&name=MSAzure.png'}
        ]
    )

    card.buttons(
        [
            builder.CardAction.imBack(session, "Option 1", "Click here"),
            builder.CardAction.imBack(session, "Option 2", "Or here"),
            builder.CardAction.imBack(session, "Option 3", "Maybe here?")
        ]
    )

    card.title("Title");
    card.subtitle("Subtitle");
    card.text("Text that serves as a description");
    
    return card;
}
```
>NOTE. While the Images method receives a list of ICardImage objects, it actually only displays the first image so it is recommended to only include one image when using the ThumbnailCard given that said image will be displayed as a small thumbnail at the right upper side of the card.
### Hero card ###
The HeroCard inherits its methods from the ThumbnailCard. The main difference is that the HeroCard displays a large image or images rather that just a small thumbnail.
```javascript
function createHeroCard(session){
    var card = new builder.HeroCard(session);
    card.images(
        [
            { url : 'http://www.knowledgewave.com/hs-fs/hubfs/blog_images/MSAzure.png?t=1506454430034&width=320&name=MSAzure.png'},
            { url : 'https://cdn.ndtv.com/tech/gadgets/xbox_logo_green_small_ms.jpg'},
            { url : 'http://cdn.ndtv.com/tech/linkedin_android_app_small.jpg'}
        ]
    )

    card.buttons(
        [
            builder.CardAction.imBack(session, "Option 1", "Click here"),
            builder.CardAction.imBack(session, "Option 2", "Or here")
        ]
    )
    card.title("Title");
    card.subtitle("Subtitle");
    card.text("Text that serves as a description");
    
    return card;
}
```
### Receipt card ###
One of the most rich cards, it has multiple useful main methods:
- Title, the title for receipt
- Facts, a list of Fact objects useful to write extra lines in the receipt such as a Order number, date, payment method, among others
- Items, a list of ReceiptItems objects that have a price, title, quantity and image attributes. The quantity and image are optional for some channels
- Tax, a text to define the tax value of the receipt
- Total, a text to define the total value of the receipt
- VAT, a text to define the vat value of the receipt, it displays only in few channels
- Buttons, a list of CardActions objects to help the user take a decission regarding payments such as going to their bank website, a payment portal or others
```javascript
function createReceiptCard(session){

    var card = new builder.ReceiptCard(session);
    
    card.title("Receipt title");
    card.facts(
        [
            builder.Fact.create(session, '1234', 'Order Number'),
            builder.Fact.create(session, 'Credit Card VISA #1234****', 'Payment Method')
        ]
    )

    card.items(
        [
            builder.ReceiptItem.create(session, "23", "1st item"),
            builder.ReceiptItem.create(session, "32", "2nd item"),
            builder.ReceiptItem.create(session, "57", "3rd item"),
            builder.ReceiptItem.create(session, "75", "4th item")
        ]
    )
    
    card.tax("$ 32.50");
    card.total("$ 90.95");
    card.buttons(
        [
            builder.CardAction.openUrl(session,"https://dev.botframework.com/","Pay here")
        ]
    )
    
    return card;    
}
```

### Signin card ###
Not the most complex rich card, it just has two methods:
- Text. Optional, a descriptive text to describe the sign in process to the user
- Button. Not optional, a button that will send the user to a website where it is expected to sign in

```javascript
function createSigninCard(session){

    var card = new builder.SigninCard(session);
    
    card.text("Sign in using your portal");
    card.button("Sign in here","https://dev.botframework.com/" );

    return card;  
}
```