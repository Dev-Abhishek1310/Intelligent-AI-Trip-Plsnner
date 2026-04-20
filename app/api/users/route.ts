import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (email) {
            const user = await User.findOne({ email }).lean();
            return NextResponse.json({ user });
        }

        const users = await User.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ users });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { name, email, imageUrl, subscription } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { name, email, imageUrl: imageUrl || "", subscription: subscription || "free" },
            { upsert: true, new: true }
        );

        return NextResponse.json({ user }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}