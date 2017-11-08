using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;

namespace Bot03_RichCards.Dialogs
{
    [Serializable]
    public class RootDialog : IDialog<object>
    {
        public Task StartAsync(IDialogContext context)
        {
            context.Wait(MessageReceivedAsync);
            
            return Task.CompletedTask;
        }

        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var activity = await result as Activity;
            var message = context.MakeMessage();

            message.Attachments.Add(DefineRichCard(activity.Text));

            await context.PostAsync(message);
            context.Wait(MessageReceivedAsync);
        }

        private Attachment DefineRichCard(string activityText)
        {
            switch (activityText)
            {
                case "animation":
                    AnimationCard animationCard = new AnimationCard
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
                    return animationCard.ToAttachment();
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
                default:
                    return null;
            }
        }
    }
}