import { Events, MessageFlags } from "discord.js";
import { hasAccess } from "@utils/checkAccess";

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            Logger.warn(`⚠️ Command "${interaction.commandName}" not found.`);
            return;
        }

        const member = interaction.member as GuildMember

        const checkAccess = [
            { level: "CEO", access: command.owner },
            { level: "admin", access: command.admin },
            { level: "mod", access: command.hightStaff },
            { level: "support", access: command.support }
        ] as CheckPermission[];

        const enabledLevels = checkAccess.filter(e => e.access);

        const hasValidAccess = enabledLevels.some(e => hasAccess(member, e.level));

        if (!hasValidAccess) {
            const top = enabledLevels[0]?.level;
            return interaction.reply({
                embeds: [FailedProcess(`You don't have a ${top} role to use this command`)],
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            await command.run(interaction, client);
        } catch (error) {
            handleError(new BotError(`❌ Error running command "${interaction.commandName}": ${error}`, "COMMAND"), "src/events/InteractionCreate.ts line 22 ( InteractionCreate )")

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    embeds: [FailedProcess("💥 Something went wrong!")],
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.reply({ embeds: [FailedProcess("💥 Something went wrong!")], flags: MessageFlags.Ephemeral });
            }
        }
    },
};

/* components */
import { FailedProcess } from "components/processFailed";

/* lib */
import { client } from "@lib/Client";
import { Logger } from "@lib/Logger";
import { handleError, BotError } from "@lib/handlers/ErrorHandler";

/* Types */
import type { GuildMember, Interaction } from "discord.js";
import type { CheckPermission } from "types/config";
