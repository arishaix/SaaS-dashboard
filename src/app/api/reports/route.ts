import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Report from "@/models/Report";

export async function GET() {
  await dbConnect();
  try {
    const reports = await Report.find({});
    return NextResponse.json({ reports });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
