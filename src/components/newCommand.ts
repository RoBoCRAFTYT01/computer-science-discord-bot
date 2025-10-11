import {
    CommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
} from "discord.js";

import { BotError, handleError } from "@lib/handlers/ErrorHandler";
import { FailedProcess } from "./processFailed";

export class Command {
    public data: CommandProps["data"];
    private admin: CommandProps["admin"];
    public run: CommandProps["run"];

    constructor(options: CommandProps) {
        this.data = options.data as SlashCommandBuilder;
        this.admin= options.admin;
        this.run = async (interaction: CommandInteraction, client: RoBoClient) => {
            try {
                await options.run(interaction, client);
            } catch (error) {
                handleError(new BotError(`⚠️ There was an error executing this command.`, "COMMAND"), `src/commands/${options.data.name}`)
                await interaction.reply({
                    embeds: [FailedProcess("⚠️ There was an error executing this command.")],
                    flags: MessageFlags.Ephemeral
                });
            }
        };
    }
}

import type { CommandProps } from "types/command";
import type { RoBoClient } from "@lib/Client";