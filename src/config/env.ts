import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    DATABASE: z.string().min(1, "Missing DATABASE"),
    DISCORD_TOKEN: z.string().min(1, "Missing Discord TOKEN"),
    DISCORD_CLIENT_ID: z.string().min(1, "Missing Discord CLIENT_ID"),
    DISCORD_CLIENT_SECRET: z.string().min(1, "Missing Discord CLIENT_SECRET"),
    GOOGLE_REFRESH_TOKEN: z.string().min(1, "Missing Google REFRESH_TOKEN"),
    GOOGLE_ACCESS_TOKEN: z.string().min(1, "Missing Google ACCESS_TOKEN"),
    GOOGLE_CLIENT_ID: z.string().min(1, "Missing Google CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: z.string().min(1, "Missing Google CLIENT_SECRET"),
    GOOGLE_REDIRECT_URI: z.string().min(1, "Missing Google AREDIRECT_URI"),
    NODE_ENV: z.string().min(1, "Need One of Pro and Dev")
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    process.exit(1);
}

export const ENV = _env.data;