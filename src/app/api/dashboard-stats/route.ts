import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Revenue from "@/models/Revenue";
import Sale from "@/models/Sale";
import User from "@/models/User";

function getMonth(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET() {
  await dbConnect();
  try {
    // Revenue Trend
    const revenues = await Revenue.find({}, "amount date");
    const revenueByMonth: Record<string, number> = {};
    revenues.forEach((r: any) => {
      const month = getMonth(r.date);
      revenueByMonth[month] = (revenueByMonth[month] || 0) + r.amount;
    });
    const revenueData = Object.entries(revenueByMonth).map(
      ([month, revenue]) => ({ month, revenue })
    );

    // Sales Trend
    const sales = await Sale.find({}, "date");
    const salesByMonth: Record<string, number> = {};
    sales.forEach((s: any) => {
      const month = getMonth(s.date);
      salesByMonth[month] = (salesByMonth[month] || 0) + 1;
    });
    const salesData = Object.entries(salesByMonth).map(([month, sales]) => ({
      month,
      sales,
    }));

    // User Growth (new signups)
    const users = await User.find({}, "createdAt role");
    const userGrowthByMonth: Record<string, number> = {};
    users.forEach((u: any) => {
      const month = getMonth(u.createdAt);
      userGrowthByMonth[month] = (userGrowthByMonth[month] || 0) + 1;
    });
    const userGrowthData = Object.entries(userGrowthByMonth).map(
      ([month, users]) => ({ month, users })
    );

    // User Distribution (by role)
    const roleCounts: Record<string, number> = {};
    users.forEach((u: any) => {
      roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
    });
    const userDistributionData = Object.entries(roleCounts).map(
      ([name, value]) => ({ name, value })
    );

    return NextResponse.json({
      stats: [
        { type: "sales", data: salesData },
        { type: "userGrowth", data: userGrowthData },
        { type: "revenue", data: revenueData },
        { type: "userDistribution", data: userDistributionData },
      ],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
