import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Revenue from "@/models/Revenue";
import Sale from "@/models/Sale";
import User from "@/models/User";

export async function GET() {
  await dbConnect();
  try {
    // Total Revenue
    const revenueAgg = await Revenue.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Total Sales
    const totalSales = await Sale.countDocuments();

    // Total Users
    const totalUsers = await User.countDocuments();

    // New Signups (last 24 hours)
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newSignups = await User.countDocuments({
      createdAt: { $gte: since },
    });

    return NextResponse.json({
      revenue: totalRevenue,
      sales: totalSales,
      users: totalUsers,
      newSignups,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
