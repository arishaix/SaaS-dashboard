import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Stats from "@/models/Stats";
import User from "@/models/User";

export async function GET() {
  await dbConnect();
  try {
    const stats = await Stats.find({}).sort({ date: -1 });
    const latest = stats[0] || null;
    const previous = stats[1] || null;
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newSignups = await User.countDocuments({
      createdAt: { $gte: since },
    });
    return NextResponse.json({ latest, previous, newSignups });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
