import mongoose, { Schema, models, model } from "mongoose";

const FavoriteSchema = new Schema(
    {
        userEmail: { type: String, required: true, index: true },
        destinationSlug: { type: String, required: true },
        destinationName: { type: String, required: true },
    },
    { timestamps: true }
);

FavoriteSchema.index({ userEmail: 1, destinationSlug: 1 }, { unique: true });

export const Favorite = models.Favorite || model("Favorite", FavoriteSchema);