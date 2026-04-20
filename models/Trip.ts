import mongoose, { Schema, models, model } from "mongoose";

const TripSchema = new Schema(
    {
        tripId: { type: String, required: true, unique: true, index: true },
        userEmail: { type: String, required: true, index: true },
        tripDetail: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
);

export const Trip = models.Trip || model("Trip", TripSchema);