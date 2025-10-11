import { client } from "@lib/Client";
import { Logger } from "@lib/Logger";
import { DiscordErrorHandler } from "@lib/handlers/DiscordHandler";

const BotLogin = ({ ENV } : envProps) => {
    const login = client.login(ENV.DISCORD_TOKEN);
    const errorhandler = new DiscordErrorHandler(client);

    login.then(() => {
        Logger.success("Bot Was Started");
    })
    
    login.catch((err) => {
        Logger.error(`Invilad Bot Token : \n ${err}`);
        process.exit(1);
    })

    errorhandler.init();
}

export default BotLogin;
