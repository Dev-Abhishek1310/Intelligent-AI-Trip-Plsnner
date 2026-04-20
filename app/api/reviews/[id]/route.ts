import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const body = await req.json();

        if (body.action === "helpful") {
            const review = await Review.findByIdAndUpdate(
                params.id,
                { $inc: { helpful: 1 } },
                { new: true }
            );
            if (!review) {
                return NextResponse.json({ error: "Review not found" }, { status: 404 });
            }
            return NextResponse.json({ review });
        }

        const review = await Review.findByIdAndUpdate(params.id, body, { new: true });
        return NextResponse.json({ review });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        await Review.findByIdAndDelete(params.id);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}