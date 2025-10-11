import { 
    CommandInteraction, 
    SlashCommandBuilder,
    type SlashCommandSubcommandsOnlyBuilder
} from "discord.js"
import { RoBoClient } from "@lib/client"

interface CommandProps {
    data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    admin?: boolean;
    owner?: boolean;
    hightStaff?: boolean;
    support?: boolean;
    run: (interaction: ChatInputCommandInteraction, client: RoBoClient) => Promise<void>;
}
