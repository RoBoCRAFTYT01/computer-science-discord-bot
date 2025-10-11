import type { SlashCommandOption } from "types/config"

export const SlashCommandConfig : SlashCommandOption = {
    defaultCooldown: 5,
    ownerOnly: false,
    devGuild: "",
    embedDefault: {
        footer: {
            text: "@2025 RobTic copyright",
        },
        author: {
            name: "RobTic",
        }
    }
}