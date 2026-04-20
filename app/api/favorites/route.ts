import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Favorite } from "@/models/Favorite";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get("userEmail");

        const query: Record<string, unknown> = {};
        if (userEmail) query.userEmail = userEmail;

        const favorites = await Favorite.find(query).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ favorites });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { userEmail, destinationSlug, destinationName } = await req.json();

        if (!userEmail || !destinationSlug || !destinationName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const favorite = await Favorite.findOneAndUpdate(
            { userEmail, destinationSlug },
            { userEmail, destinationSlug, destinationName },
            { upsert: true, new: true }
        );

        return NextResponse.json({ favorite }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get("userEmail");
        const destinationSlug = searchParams.get("destinationSlug");

        if (!userEmail || !destinationSlug) {
            return NextResponse.json({ error: "Missing params" }, { status: 400 });
        }

        await Favorite.deleteOne({ userEmail, destinationSlug });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}