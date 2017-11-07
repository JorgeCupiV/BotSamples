using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;

namespace Bot02_AddingAttachments.Dialogs
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

            IMessageActivity message = context.MakeMessage();

            switch (activity.Text)
            {
                case "image":
                    message.Attachments.Add(new Attachment()
                    {
                        ContentType = "image/png",
                        ContentUrl = "https://ncmedia.azureedge.net/ncmedia/2017/03/cropped-microsoft_logo_element-192x192.png",
                        Name = "Azure logo"
                    });
                    break;
                case "audio":
                    message.Attachments.Add(new Attachment()
                    {
                        ContentType = "audio/wav",
                        ContentUrl = "http://ccrma.stanford.edu/~jos/wav/gtr-nylon22.wav",
                        Name = "Audio sample"
                    });
                    break;
                case "video":
                    message.Attachments.Add(new Attachment()
                    {
                        ContentType = "video/mp4",
                        ContentUrl = "http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4",
                        Name = "Video sample"
                    });
                    break;
                default:
                    break;
            }

            await context.PostAsync(message);

            context.Wait(MessageReceivedAsync);
        }
    }
}