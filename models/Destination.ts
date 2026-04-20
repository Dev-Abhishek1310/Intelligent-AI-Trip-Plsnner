import mongoose, { Schema, models, model } from "mongoose";

const DestinationSchema = new Schema(
    {
        slug: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true },
        country: { type: String, required: true },
        image: { type: String, required: true },
        tag: { type: String, required: true, index: true },
        description: { type: String, required: true },
        rating: { type: Number, default: 0 },
        reviews: { type: Number, default: 0 },
        trending: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Destination =
    models.Destination || model("Destination", DestinationSchema);