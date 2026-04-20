import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

type MongooseCache = {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
};

declare global {
    // eslint-disable-next-line no-var
    var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache =
    global._mongoose ?? (global._mongoose = { conn: null, promise: null });

export async function connectDB(): Promise<Mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                bufferCommands: false,
                serverSelectionTimeoutMS: 8000,
            })
            .catch((err) => {
                // Clear cache so next request retries instead of reusing a rejected promise.
                cached.promise = null;
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}