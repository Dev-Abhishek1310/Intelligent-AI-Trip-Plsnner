import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Trip } from "@/models/Trip";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get("userEmail");

        const query: Record<string, unknown> = {};
        if (userEmail) query.userEmail = userEmail;

        const trips = await Trip.find(query).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ trips });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { tripId, userEmail, tripDetail } = await req.json();

        if (!tripId || !userEmail || !tripDetail) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const trip = await Trip.findOneAndUpdate(
            { tripId },
            { tripId, userEmail, tripDetail },
            { upsert: true, new: true }
        );

        return NextResponse.json({ trip }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}