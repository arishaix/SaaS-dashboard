import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import ExportHistory from "@/models/ExportHistory";

export async function GET() {
  await dbConnect();
  try {
    const history = await ExportHistory.find({}).sort({ date: -1 }).limit(50);
    return NextResponse.json({ history });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch export history" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { type, format, link, user } = await req.json();
    const newEvent = await ExportHistory.create({
      type,
      format,
      link,
      user,
      date: new Date(),
    });
    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save export event" },
      { status: 500 }
    );
  }
}
