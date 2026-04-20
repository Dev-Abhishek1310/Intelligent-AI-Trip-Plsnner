import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Trip } from "@/models/Trip";

export async function GET(
    req: NextRequest,
    { params }: { params: { tripId: string } }
) {
    try {
        await connectDB();
        const trip = await Trip.findOne({ tripId: params.tripId }).lean();
        if (!trip) {
            return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        }
        return NextResponse.json({ trip });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { tripId: string } }
) {
    try {
        await connectDB();
        await Trip.findOneAndDelete({ tripId: params.tripId });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}