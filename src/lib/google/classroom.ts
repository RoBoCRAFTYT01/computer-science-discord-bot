import { google } from "googleapis";
import { oauth2Client } from "./auth";
import dotenv from "dotenv";
import { ENV } from "@config/env";

dotenv.config();

/**
 * @param classroomId - The Google Classroom course ID.
 * @param accessToken - Optional OAuth access token.
 * @param refreshToken - Optional OAuth refresh token.
 */
export async function getAnnouncements(
    classroomId: string,
    accessToken = ENV.GOOGLE_ACCESS_TOKEN,
    refreshToken = ENV.GOOGLE_REFRESH_TOKEN
) {
    if (!accessToken && !refreshToken) {
        throw new Error("Token not found. Run 'bun run get-token' first!");
    }

    const classroom = google.classroom({ version: "v1", auth: oauth2Client });

    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
        scope: "https://www.googleapis.com/auth/classroom.announcements.readonly https://www.googleapis.com/auth/classroom.courses.readonly",
        token_type: "Bearer",
    });

    const res = await classroom.courses.announcements.list({
        courseId: classroomId,
    });

    return res.data.announcements || [];
}
