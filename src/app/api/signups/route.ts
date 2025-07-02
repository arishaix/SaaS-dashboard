import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  await dbConnect();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  try {
    const signups = await User.find(
      { createdAt: { $gte: since } },
      "name email createdAt"
    );
    return NextResponse.json({ signups });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch signups" },
      { status: 500 }
    );
  }
}
