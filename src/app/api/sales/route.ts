import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Sale from "@/models/Sale";

export async function GET() {
  await dbConnect();
  try {
    const sales = await Sale.find({}, "orderId amount date");
    return NextResponse.json({ sales });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sales" },
      { status: 500 }
    );
  }
}
