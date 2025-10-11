import { Schema, model, models } from "mongoose";

const ClassroomSchema = new Schema({
    classroomId: String,
    lasPostId: String,
    guilds: [
        {
            _id: String,
            channelId: String,
        }
    ]
})

export const ClassroomModel = models.classroom || model("classroom", ClassroomSchema)