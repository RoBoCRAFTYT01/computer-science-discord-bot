import { TextChannel, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { classroom_v1 } from "googleapis";

export async function sendAnnouncement(
    channel: TextChannel,
    announcement: classroom_v1.Schema$Announcement
) {
    const embed = new EmbedBuilder()
        .setTitle("📢 New Classroom Announcement")
        .setURL(announcement.alternateLink!)
        .setDescription(announcement.text || "No content")
        .setColor("#00AEEF")
        .setFooter({
            text: "English Classroom Bot",
        })
        .setTimestamp(announcement.creationTime ? new Date(announcement.creationTime) : new Date());

    const button = new ButtonBuilder()
        .setLabel("Open in Classroom")
        .setStyle(ButtonStyle.Link)
        .setURL(announcement.alternateLink!);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await channel.send({ content: "@everyone", embeds: [embed], components: [row] });
}
