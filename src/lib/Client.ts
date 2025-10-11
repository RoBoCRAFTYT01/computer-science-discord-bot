import { Client, Collection, GatewayIntentBits } from "discord.js"
import type { CommandProps } from "../types/command"

export class RoBoClient extends Client {
    commands = new Collection<string, CommandProps>()
    cooldowns = new Collection<string, number>()

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.MessageContent
            ],
        })
    }
}

export const client = new RoBoClient()
