import type { RoBoClient } from "@lib/Client";
import {
    Events,
    ActivityType,
    TextChannel,
} from "discord.js";
import { Logger } from "@lib/Logger";
import { ChannelModel } from "@models/models";
import documentBuilder from "components/documentBuilder";
import { fetchAndPostLatestAnnouncement } from "./listeners/fetchAnnouncement";

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: RoBoClient) {
        Logger.success(`> Logged in as ${client.user?.tag}`);
        Logger.info(`> Bot ID: ${client.user?.id}`);

        client.user?.setPresence({
            status: "dnd",
            activities: [
                {
                    name: "Made By RoBo",
                    type: ActivityType.Playing,
                },
            ],
        });
        
        fetchAndPostLatestAnnouncement();

        setInterval(fetchAndPostLatestAnnouncement, 3 * 60 * 1000);

        const REFRESH_INTERVAL = 10000;

        setInterval(async () => {
            try {
                const allChannels = await ChannelModel.find({});
                if (!allChannels.length) return;

                for (const channelData of allChannels) {
                    const { guildId, channelId, messageId } = channelData;
                    const guild = await client.guilds.fetch(guildId).catch(() => null);
                    if (!guild) continue;

                    const channel = await guild.channels.fetch(channelId).catch(() => null);
                    if (!channel || !channel.isTextBased()) continue;

                    const message = await (channel as TextChannel).messages.fetch(messageId).catch(() => null);
                    if (!message) continue;

                    const document = await documentBuilder({ guild, client } as any);
                    if (!document.success) continue;

                    await message.edit({
                        embeds: [document.data.documentEmbed],
                        components: [document.data.documentMenu],
                    });
                }

            } catch (error) {
                Logger.error("❌ Document refresh loop failed:");
            }
        }, REFRESH_INTERVAL);
    },
};
