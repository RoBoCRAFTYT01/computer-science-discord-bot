import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    EmbedBuilder,
    ComponentType,
    MessageFlags,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
import { FieldModel } from "@models/models";

export default {
    data: new SlashCommandBuilder()
        .setName("files")
        .setDescription("View and manage all uploaded documents"),
    admin: true,
    owner: true,
    async run(interaction: ChatInputCommandInteraction) {
        const fields = await FieldModel.find();

        if (!fields.length) {
            return interaction.reply({
                content: "📂 No fields found in the database.",
                flags: MessageFlags.Ephemeral,
            });
        }

        const menu = new StringSelectMenuBuilder()
            .setCustomId("select-field")
            .setPlaceholder("Select a field to view documents")
            .addOptions(fields.map(f => ({
                label: f.name,
                value: f.name,
            })));

        await interaction.reply({
            content: "📚 Select a field to view its documents:",
            components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu)],
            flags: MessageFlags.Ephemeral,
        });

        const msg = await interaction.fetchReply();

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 60_000,
        });

        collector.on("collect", async i => {
            if (i.user.id !== interaction.user.id)
                return i.reply({ content: "Not your menu!", flags: MessageFlags.Ephemeral });

            const field = await FieldModel.findOne({ name: i.values[0] });
            if (!field)
                return i.reply({ content: "Field not found.", flags: MessageFlags.Ephemeral });

            const embed = new EmbedBuilder()
                .setColor("White")
                .setTitle(`📁 Files in ${field.name}`)
                .setDescription(
                    field.data.length
                        ? field.data
                            .map(
                                (f : any) =>
                                    `**ID:** \`${f._id}\`\t📄 **${f.displayName}**\t👤 *${f.by}*\t🔗 [Open PDF](${f.pdf})`
                            )
                            .join("\n\n")
                        : "No files found in this field."
                )
                .setFooter({
                    text: "CS Student File Manager",
                    iconURL: interaction.client.user?.displayAvatarURL() ?? undefined,
                });

            const deleteBtn = new ButtonBuilder()
                .setCustomId("delete-file")
                .setLabel("Delete File")
                .setStyle(ButtonStyle.Danger);

            await i.update({
                embeds: [embed],
                components: [new ActionRowBuilder<ButtonBuilder>().addComponents(deleteBtn)],
            });
        });
    },
};
