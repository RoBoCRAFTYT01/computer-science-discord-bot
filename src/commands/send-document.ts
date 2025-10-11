import {
    ChannelType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionsBitField,
    MessageFlags,
} from "discord.js";
import documentBuilder from "components/documentBuilder";
import { ChannelModel } from "@models/channel.model";

export default {
    data: new SlashCommandBuilder()
        .setName("send-documents")
        .setDescription("📚 Send a document selector to view available files")
        .addChannelOption(opt =>
            opt
                .setName("in")
                .setDescription("Select a text channel where to send the document menu")
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
                .setRequired(true)
        ) as SlashCommandBuilder,

    admin: true,
    owner: true,
    run: async (interaction: ChatInputCommandInteraction) => {
        try {
            const selectedChannel = interaction.options.getChannel("in");
            const guild = interaction.guild;

            if (!guild) {
                return interaction.reply({
                    content: "⚠️ This command can only be used inside a server.",
                    flags: MessageFlags.Ephemeral,
                });
            }

            if (
                !selectedChannel ||
                (selectedChannel.type !== ChannelType.GuildText &&
                    selectedChannel.type !== ChannelType.GuildAnnouncement)
            ) {
                return interaction.reply({
                    content: "❌ Please select a valid **text or announcement channel**.",
                    flags: MessageFlags.Ephemeral,
                });
            }

            const channel = await guild.channels.fetch(selectedChannel.id);
            if (!channel?.isTextBased()) {
                return interaction.reply({
                    content: "⚠️ That channel is not a valid text-based channel.",
                    flags: MessageFlags.Ephemeral,
                });
            }

            const botMember = await guild.members.fetchMe();
            if (!botMember?.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages)) {
                return interaction.reply({
                    content: "🚫 I don’t have permission to send messages in that channel.",
                    flags: MessageFlags.Ephemeral,
                });
            }

            const document = await documentBuilder(interaction);
            if (!document.success) {
                return interaction.reply({
                    content: "❌ Failed to generate the document menu.",
                    flags: MessageFlags.Ephemeral,
                });
            }

            const sentMessage = await channel.send({
                embeds: [document.data.documentEmbed],
                components: [document.data.documentMenu],
            });

            await ChannelModel.findOneAndUpdate(
                { guildId: guild.id },
                {
                    guildId: guild.id,
                    channelId: channel.id,
                    messageId: sentMessage.id,
                },
                { upsert: true, new: true }
            );

            return interaction.reply({
                content: `✅ Successfully sent the **Document Menu** in ${channel}.`,
                flags: MessageFlags.Ephemeral,
            });
        } catch (err) {
            console.error("❌ [COMMAND ERROR] /send-documents:", err);

            if (!interaction.replied) {
                await interaction.reply({
                    content: "⚠️ An unexpected error occurred while sending the document menu.",
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    },
};
