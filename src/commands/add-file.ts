import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Attachment,
    MessageFlags,
} from "discord.js";
import { FieldModel } from "@models/models";
import { channel } from "diagnostics_channel";

export default {
    data: new SlashCommandBuilder()
        .setName("add-file")
        .setDescription("📄 Add a document to a specific field")
        .addStringOption(opt =>
            opt
                .setName("field")
                .setDescription("The field/category (e.g. math, algo, etc.)")
                .addChoices(
                    { name: "Algorithm", value: "algorithm" },
                    { name: "Information Systems", value: "information-systems" },
                    { name: "Graph Theory", value: "graph-theory" },
                    { name: "Mathematical Logic", value: "mathematical-logic" },
                    { name: "Calculus Numeric", value: "calculus-numeric" },
                    { name: "Architecture", value: "archi" },
                    { name: "English", value: "english" },
                )
                .setRequired(true)
        )
        .addAttachmentOption(opt =>
            opt
                .setName("file")
                .setDescription("Upload a file (PDF, DOCX, etc.)")
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt
                .setName("display-name")
                .setDescription("Custom display name for the document")
                .setRequired(false)
        ),
    admin: true,
    owner: true,
    async run(interaction: ChatInputCommandInteraction) {
        try {
            const fieldName = interaction.options.getString("field", true);
            const file = interaction.options.getAttachment("file", true) as Attachment;
            const displayName = interaction.options.getString("display-name") || file.name;

            const savedChannel = interaction.guild?.channels.cache.get(process.env.CHANNEL_ID || "");

            if (!savedChannel || !savedChannel.isTextBased()) return;

            if (!file.contentType?.includes("pdf") && !file.contentType?.includes("document")) {
                return interaction.reply({
                    content: "⚠️ Please upload a valid PDF or document file.",
                    flags: MessageFlags.Ephemeral,
                });
            }

            let field = await FieldModel.findOne({ name: fieldName });

            if (!field) {
                field = new FieldModel({
                    name: fieldName,
                    data: [],
                });
            }

            savedChannel.send({
                files: [file]
            }).then(async (msg) => {
                field.data.push({
                    displayName,
                    pdf: {
                        channel: process.env.CHANNEL_ID || "",
                        message: msg.id
                    },
                    by: interaction.user.tag,
                });

                await field.save();
            });

            await interaction.reply({
                content: `✅ **${displayName}** has been added under **${fieldName}**!`,
                flags: MessageFlags.Ephemeral,
            });
        } catch (err) {
            console.error("❌ Error in /add-file:", err);
            await interaction.reply({
                content: "❌ Something went wrong while adding the file. Please try again later.",
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};