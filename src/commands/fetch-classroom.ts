import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { google } from "googleapis";
import { oauth2Client } from "@lib/google/auth";
import dotenv from "dotenv";
import { ENV } from "@config/env";

dotenv.config();

export const command = new SlashCommandBuilder()
    .setName("fetch-classrooms")
    .setDescription("Fetch all Google Classroom courses linked to your OAuth tokens");

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    try {
        const accessToken = ENV.GOOGLE_ACCESS_TOKEN;
        const refreshToken = ENV.GOOGLE_REFRESH_TOKEN;

        if (!accessToken && !refreshToken) {
            await interaction.editReply("⚠️ Missing Google OAuth tokens. Please generate them first using your auth setup.");
            return;
        }

        oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
            scope:
                "https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.announcements.readonly",
            token_type: "Bearer",
        });

        const classroom = google.classroom({ version: "v1", auth: oauth2Client });

        const res = await classroom.courses.list();

        const courses = res.data.courses ?? [];
        if (courses.length === 0) {
            await interaction.editReply("❌ No classrooms found for this Google account.");
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle("📚 Google Classroom Courses")
            .setColor("Blue")
            .setDescription(
                courses
                    .slice(0, 10)
                    .map(
                        (c) =>
                            `**${c.name ?? "Untitled"}**\n🆔 \`${c.id}\`\n📅 Section: ${c.section ?? "N/A"
                            }`
                    )
                    .join("\n\n")
            )
            .setFooter({ text: `Total: ${courses.length} course(s)` });

        await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
        console.error("❌ Error fetching classrooms:", error);

        if (error.message?.includes("invalid_grant")) {
            await interaction.editReply(
                "⚠️ Your Google token is expired or invalid. Please re-run your token generation command."
            );
        } else {
            await interaction.editReply(`⚠️ Error fetching classrooms: ${error.message}`);
        }
    }
}

export default {
    data: command,
    owner: true,
    async run(interaction: ChatInputCommandInteraction) {
        execute(interaction);
    },
};