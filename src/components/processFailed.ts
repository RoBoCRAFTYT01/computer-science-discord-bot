import { BaseEmbed } from "./ui/embed";

export const FailedProcess = (description : string ) => {
    const embed = new BaseEmbed({
        title: "Error",
        description: `\`\`\`${description}\`\`\``,
        type: "error",
    })

    return embed.get();
}