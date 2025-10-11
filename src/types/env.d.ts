type Settings = {
    DISCORD_TOKEN?: string | undefined,
    DATABASE?: string | undefined,
    DISCORD_CLIENT_ID?: string,
    DISCORD_CLIENT_SECRET?: string,
    GOOGLE_REFRESH_TOKEN?: string,
    GOOGLE_ACCESS_TOKEN?: string,
    GOOGLE_CLIENT_ID?: string,
    GOOGLE_CLIENT_SECRET?: string,
    GOOGLE_REDIRECT_URI?: string,
}

interface envProps {
    ENV: Setting
}