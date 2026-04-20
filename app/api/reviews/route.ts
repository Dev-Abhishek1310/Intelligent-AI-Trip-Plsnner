import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const minRating = Number(searchParams.get("minRating") || 0);
        const search = searchParams.get("search") || "";

        const query: Record<string, unknown> = {};
        if (minRating > 0) query.rating = { $gte: minRating };
        if (search) {
            query.$or = [
                { destination: { $regex: search, $options: "i" } },
                { title: { $regex: search, $options: "i" } },
                { body: { $regex: search, $options: "i" } },
            ];
        }

        const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ reviews });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { author, destination, rating, title, body: text, tripType, userEmail } = body;

        if (!author || !destination || !rating || !title || !text) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const review = await Review.create({
            author,
            destination,
            rating,
            title,
            body: text,
            tripType: tripType || "",
            avatarInitial: author.charAt(0).toUpperCase(),
            userEmail: userEmail || "",
        });

        return NextResponse.json({ review }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}