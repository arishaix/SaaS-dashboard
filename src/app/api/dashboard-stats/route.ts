import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import DashboardStat from "@/models/DashboardStat";

export async function GET() {
  await dbConnect();
  try {
    const stats = await DashboardStat.find({});
    return NextResponse.json({ stats });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
