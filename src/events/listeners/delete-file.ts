import {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    MessageFlags,
    type Interaction,
} from "discord.js";
import { FieldModel } from "@models/models";

export async function handleDelete(interaction: Interaction) {
    if (!interaction.isButton() || interaction.customId !== "delete-file") return;

    const modal = new ModalBuilder()
        .setCustomId("delete-file-modal")
        .setTitle("Delete File by ID")
        .addComponents([
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId("file-id")
                    .setLabel("Enter the file ID")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ),
        ]);

    await interaction.showModal(modal);
}

export async function handleDeleteSubmit(interaction: Interaction) {
    if (!interaction.isModalSubmit() || interaction.customId !== "delete-file-modal") return;

    const fileId = Number(interaction.fields.getTextInputValue("file-id"));

    const field = await FieldModel.findOne({ "data._id": fileId });
    if (!field)
        return interaction.reply({
            content: "❌ File not found.",
            flags: MessageFlags.Ephemeral,
        });

    field.data = field.data.filter((f : any) => f._id !== fileId);
    await field.save();

    await interaction.reply({
        content: `✅ File with ID **${fileId}** has been deleted successfully.`,
        flags: MessageFlags.Ephemeral,
    });
}