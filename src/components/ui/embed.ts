import { EmbedBuilder } from "discord.js";
import { color } from "@config/colors";
import type { EmbedOptions, FieldInput } from "types/embed";
import { SlashCommandConfig } from "@config/slashCommands";

export class BaseEmbed {
    private embed: EmbedBuilder;

    constructor(options: EmbedOptions) {
        const {
            title,
            description,
            fields = [],
            thumbnail,
            image,
            type = "default",
        } = options;

        this.embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color[type])
            .setTimestamp()
            .setAuthor(SlashCommandConfig.embedDefault.author)
            .setFooter(SlashCommandConfig.embedDefault.footer);

        if (fields?.length)
            this.embed.addFields(
                fields.map((f: FieldInput) => ({
                    name: f.name,
                    value: f.value,
                    inline: f.inline ?? false,
                }))
            );

        if (thumbnail) this.embed.setThumbnail(thumbnail);
        if (image) this.embed.setImage(image);
    }

    get() {
        return this.embed;
    }
}
