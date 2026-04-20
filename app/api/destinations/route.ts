import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Destination } from "@/models/Destination";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const tag = searchParams.get("tag");

        const query: Record<string, unknown> = {};
        if (tag && tag !== "All") query.tag = tag;

        const destinations = await Destination.find(query).sort({ rating: -1 }).lean();
        return NextResponse.json({ destinations });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const destination = await Destination.create(body);
        return NextResponse.json({ destination }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}