import { Schema, models, model } from "mongoose";

const ReviewSchema = new Schema(
    {
        author: { type: String, required: true },
        avatarInitial: { type: String, default: "" },
        destination: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        title: { type: String, required: true },
        body: { type: String, required: true },
        tripType: { type: String, default: "" },
        userEmail: { type: String, default: "" },
    },
    { timestamps: true }
);

export const Review = models.Review || model("Review", ReviewSchema);