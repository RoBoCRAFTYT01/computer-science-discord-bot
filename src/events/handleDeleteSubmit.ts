import {
    type Interaction,
    Events,
} from "discord.js";
import { handleDeleteSubmit } from "./listeners/delete-file";

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        handleDeleteSubmit(interaction)
    }
}
