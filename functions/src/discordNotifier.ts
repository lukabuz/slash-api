import * as discordHook from "webhook-discord";
// discord notifier class definition
// _______________________________
export default class DiscordNotifier {
    private hook: any //  

    // constructor, requires webhook url from config
    constructor(
        webHookURL: string
    ) {
        this.hook = new discordHook.Webhook(webHookURL);
    }

    // sending function. sends message to discord bot
    send(email: string, siteType: string, companyName: string, body: string) {
        const msg = new discordHook.MessageBuilder()
            .setName("Slash Bot")
            .setColor("#aabbcc")
            .setText("A new request has been recieved")
            .addField("Email", email)
            .addField("Site Type", siteType)
            .addField("Company Name", companyName)
            .addField("Text Body", body)
            .setTime();

        this.hook.send(msg);
    }
}