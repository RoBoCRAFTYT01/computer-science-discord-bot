import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ChannelType,
    TextChannel,
    MessageFlags,
} from "discord.js";
import { ClassroomModel } from "@models/models";

const dataCommand = new SlashCommandBuilder()
    .setName("add-classroom")
    .setDescription("Link a Google Classroom to a specific Discord channel")
    .addStringOption(opt =>
        opt
            .setName("classroom_id")
            .setDescription("The Google Classroom course ID")
            .setRequired(true)
    )
    .addChannelOption(opt =>
        opt
            .setName("channel")
            .setDescription("Select the channel to receive announcements")
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true)
    );

async function addClassroom(interaction: ChatInputCommandInteraction) {
    const classroomId = interaction.options.getString("classroom_id", true);
    const selectedChannel = interaction.options.getChannel("channel", true);

    if (selectedChannel.type !== ChannelType.GuildText) {
        await interaction.reply({
            content: "❌ Please select a **text channel**.",
            flags: MessageFlags.Ephemeral
        });
        return;
    }

    const channel = selectedChannel as TextChannel;
    const guildId = interaction.guildId!;
    const channelId = channel.id;

    let classroom = await ClassroomModel.findOne({ classroomId });

    if (!classroom) {
        classroom = new ClassroomModel({
            classroomId,
            lasPostId: null,
            guilds: [{ _id: guildId, channelId }],
        });
    } else {
        const exists = classroom.guilds.some((g: any) => g._id === guildId);

        if (exists) {
            classroom.guilds = classroom.guilds.map((g: any) =>
                g._id === guildId ? { ...g, channelId } : g
            );
        } else {
            classroom.guilds.push({ _id: guildId, channelId });
        }
    }

    await classroom.save();

    await interaction.reply({
        content: `✅ Classroom **${classroomId}** linked to announcements in <#${channelId}>.`,
        flags: MessageFlags.Ephemeral
    });
}


export default {
    data: dataCommand,
    owner: true,
    async run(interaction: ChatInputCommandInteraction) {
        addClassroom(interaction);
    }
}