import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { FieldModel } from "@models/models";


export default async function documentBuilder(interaction: ChatInputCommandInteraction) {

    const fields = await FieldModel.find().lean<FieldProps[]>();

    const documentEmbed = new EmbedBuilder()
        .setColor("#2F3136")
        .setTitle("📚 CS Student Document Center")
        .setDescription(`
Welcome to the **CS Student Document Center**! ✨  

Here you can browse and download all files or documents shared by your teachers.  

> 🧭 **How to use:**
> 1. Select the subject or model you’re interested in.  
> 2. Choose the PDF you want.  
> 3. Click to download instantly.  

Stay organized, stay ahead! 🚀
    `)
        .setTimestamp()
        .setFooter({
            text: "CS Student Bot • Always here to help 💡",
            iconURL: interaction.client.user.displayAvatarURL(),
        });

    const select = new StringSelectMenuBuilder()
        .setCustomId("field-select")
        .setPlaceholder(fields.length === 0 ? "There are no files right now" : "📁 Select a field")
        .setDisabled(fields.length === 0)

    if (fields.length === 0) {
        select.addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel("There are no files right now")
                .setValue("no-file")
        )
    }

    const validFields = fields
        .filter(f => f.name && typeof f.name === "string" && f.name.trim().length > 0)
        .slice(0, 25);

    for (const field of validFields) {
        const safeName = field.name.trim().slice(0, 100);

        select.addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel(safeName)
                .setValue(safeName.toLowerCase())
        );
    }

    const documentMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

    return {
        success: true,
        data: { documentEmbed, documentMenu },
    };
}