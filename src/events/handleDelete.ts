import {
    type Interaction,
    Events,
} from "discord.js";
import { handleDelete } from "./listeners/delete-file"

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        handleDelete(interaction)
    }
}
