import { Schema, model, models } from "mongoose";

function generateId() {
    return Math.floor(1000000000 + Math.random() * 9000000000);
}

const FieldSchema = new Schema<FieldProps>({
    _id: {
        type: Number,
        default: generateId,
    },
    name: { type: String, required: true, unique: true, index: true },
    data: [
        {
            _id: { type: Number, default: generateId },
            displayName: { type: String, required: true },
            pdf: {
                channel: {
                    type: String,
                    required: true
                },
                message: {
                    type: String,
                    required: true
                },
            },
            by: { type: String, required: true },
        },
    ],
}, { timestamps: true });

export const FieldModel = models.Field || model<FieldProps>("Field", FieldSchema);