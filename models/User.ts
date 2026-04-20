import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        imageUrl: { type: String, default: "" },
        subscription: { type: String, default: "free" },
    },
    { timestamps: true }
);

export type UserDoc = {
    _id: string;
    name: string;
    email: string;
    imageUrl: string;
    subscription: string;
    createdAt: Date;
    updatedAt: Date;
};

export const User = models.User || model("User", UserSchema);