import { Schema, model, models } from "mongoose";

const ChannelSchema = new Schema({
    guildId: {
        type: String,
        require: true
    },
    channelId: {
        type: String,
        require: true
    },
    messageId: {
        type: String,
        require: true
    }
})

export const ChannelModel = models.channel || model("channel", ChannelSchema)