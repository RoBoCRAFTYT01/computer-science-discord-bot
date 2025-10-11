import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { client } from '@lib/Client';
import { Logger } from '@lib/Logger';
import { ENV } from '@config/env';
import { SlashCommandConfig } from '@config/slashCommands';

export async function registerCommands() {
    const commands = client.commands.map(command => command.data.toJSON());

    const rest = new REST({ version: '9' }).setToken(ENV.DISCORD_TOKEN);

    try {
        Logger.info('Started refreshing application (/) commands.');

        await rest.put(
            ENV.NODE_ENV === "dev" && SlashCommandConfig?.devGuild ?
            Routes.applicationGuildCommands(ENV.DISCORD_CLIENT_ID, SlashCommandConfig.devGuild):
            Routes.applicationCommands(ENV.DISCORD_CLIENT_ID),
            { body: commands },
        );

        Logger.success('Successfully reloaded application (/) commands.');
    } catch (error) {
        Logger.error(`Failed to register slash commands: ${error}`);
    }
}
