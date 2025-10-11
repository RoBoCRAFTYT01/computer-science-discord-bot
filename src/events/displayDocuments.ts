import {
    type Interaction,
    ActionRowBuilder,
    EmbedBuilder,
    Events,
    MessageFlags,
    StringSelectMenuBuilder,
} from "discord.js";
import { FieldModel } from "@models/models";

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (!interaction.isStringSelectMenu() || interaction.customId !== "field-select") return;
        const field = interaction.values[0];

        const fieldDoc = await FieldModel.findOne({ name: field });

        if (!fieldDoc) {
            await interaction.reply({
                content: `⚠️ No field found with name **${field}**.`,
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        const docs = fieldDoc.data || [];

        if (docs.length === 0) {
            await interaction.reply({
                content: `📭 No documents found in **${field}**.`,
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`📁 ${field.toUpperCase()} Documents`)
            .setDescription("Select a document to download or view.")
            .setColor("Blue");

        const select = new StringSelectMenuBuilder()
            .setCustomId(`document-select-${field}`)
            .setPlaceholder("Select a document");

        docs.forEach((doc: any) => {
            select.addOptions({
                label: doc.displayName.substring(0, 100),
                value: doc._id.toString(),
                description: `Added by ${doc.by || "Unknown"}`,
            });
        });

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

        await interaction.reply({
            embeds: [embed],
            components: [row],
            flags: MessageFlags.Ephemeral,
        });
    }
}
