import { TextChannel } from "discord.js";
import { getAnnouncements } from "@lib/google/classroom";
import { sendAnnouncement } from "@components/sendAnnouncement";
import { client } from "@lib/Client";
import { ClassroomModel } from "@models/models";

let isRunning = false;

export async function fetchAndPostLatestAnnouncement() {
    if (isRunning) {
        console.log("⚠️ Skipping — already running");
        return;
    }

    isRunning = true;

    try {
        const classrooms = await ClassroomModel.find();

        if (classrooms.length === 0) {
            console.log("📭 No classrooms registered.");
            return;
        }

        for (const classroom of classrooms) {
            try {
                const announcements = await getAnnouncements(classroom.classroomId);
                if (!announcements || announcements.length === 0) {
                    console.log(`🪶 No announcements found for ${classroom.classroomId}`);
                    continue;
                }

                const latest = announcements.sort(
                    (a, b) =>
                        new Date(b.creationTime!).getTime() -
                        new Date(a.creationTime!).getTime()
                )[0];

                if (latest.id === classroom.lasPostId) {
                    console.log(`✅ No new announcement for ${classroom.classroomId}`);
                    continue;
                }

                for (const guild of classroom.guilds) {
                    const channel = client.channels.cache.get(guild.channelId) as TextChannel;
                    if (!channel) {
                        console.warn(`⚠️ Channel not found: ${guild.channelId}`);
                        continue;
                    }

                    await sendAnnouncement(channel, latest);
                    console.log(`📢 Posted new announcement in ${channel.name}`);
                }

                classroom.lasPostId = latest.id!;
                await classroom.save();
            } catch (err) {
                console.error(`❌ Error processing classroom ${classroom.classroomId}:`, err);
            }
        }
    } catch (err) {
        console.error("💥 Error fetching classrooms:", err);
    } finally {
        isRunning = false;
    }
}
