var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId : process.env.MicrosoftAppID,
    appPassword : process.env.MicrosoftAppPassword
});

server.post('/api/messages', connector.listen());

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


function createAudioCard(session) {
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
}

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

function createReceiptCard(session){

    var card = new builder.ReceiptCard(session);
    
    card.title("Receipt title");
    card.facts(
        [
            builder.Fact.create(session, '1234', 'Order Number'),
            builder.Fact.create(session, 'VISA 5555-****', 'Payment Method')
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

function createSigninCard(session){

    var card = new builder.SigninCard(session);
    
    card.text("Sign in using your portal");
    card.button("Sign in here","https://dev.botframework.com/" );

    return card;  
}

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