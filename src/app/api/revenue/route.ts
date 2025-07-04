import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Revenue from "@/models/Revenue";

export async function GET() {
  await dbConnect();
  try {
    const revenues = await Revenue.find({}, "amount source date");
    return NextResponse.json({ revenues });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch revenues" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { amount, source, date } = await req.json();
    if (!amount || !source || !date) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }
    const revenue = await Revenue.create({ amount, source, date });
    return NextResponse.json({ revenue }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to add revenue" },
      { status: 500 }
    );
  }
}
