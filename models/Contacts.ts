import mongoose, { Schema, models, model } from "mongoose";

const ContactSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        message: { type: String, required: true },
        status: { type: String, default: "new", enum: ["new", "read", "resolved"] },
    },
    { timestamps: true }
);

export const Contact = models.Contact || model("Contact", ContactSchema);