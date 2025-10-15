import {
    type Interaction,
    Events,
    MessageFlags,
    TextChannel,
} from "discord.js";
import { FieldModel } from "@models/models";

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (!interaction.isStringSelectMenu() || !interaction.customId.startsWith("document-select-")) return;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const field = interaction.customId.replace("document-select-", "");
        const selectedId = parseInt(interaction.values[0]);
        const fieldDoc = await FieldModel.findOne({ name: field });

        if (!fieldDoc) {
            await interaction.editReply({ content: `⚠️ Field **${field}** not found.` });
            return;
        }

        const doc = fieldDoc.data.find((d: any) => d._id === selectedId);

        if (!doc) {
            await interaction.editReply({
                content: `⚠️ Document not found in **${field}**.`,
            });
            return;
        }

        const channel = await interaction.guild?.channels.fetch(doc.pdf.channel) as TextChannel;
        if (!channel) throw new Error("Channel not found");

        const message = await channel.messages.fetch(doc.pdf.message).catch(() => null);
        if (!message) throw new Error("Message not found");

        const attachment = message.attachments.first();
        if(!attachment) throw new Error("Invalid attachment");

        await interaction.editReply({
            content: `📥 **${doc.displayName}**\n[Click here to download or view](${attachment.url})\n🧑‍💻 Added by **${doc.by}**`,
        });
    }
}