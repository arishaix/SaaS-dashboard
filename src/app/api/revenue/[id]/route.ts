import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/authOptions";
import { dbConnect } from "@/lib/mongoose";
import Revenue from "@/models/Revenue";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    const updatedRevenue = await Revenue.findByIdAndUpdate(
      params.id,
      {
        amount: body.amount,
        source: body.source,
        date: body.date,
      },
      { new: true }
    );

    if (!updatedRevenue) {
      return NextResponse.json({ error: "Revenue not found" }, { status: 404 });
    }

    return NextResponse.json(updatedRevenue);
  } catch (error) {
    console.error("Error updating revenue:", error);
    return NextResponse.json(
      { error: "Failed to update revenue" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const deletedRevenue = await Revenue.findByIdAndDelete(params.id);

    if (!deletedRevenue) {
      return NextResponse.json({ error: "Revenue not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Revenue deleted successfully" });
  } catch (error) {
    console.error("Error deleting revenue:", error);
    return NextResponse.json(
      { error: "Failed to delete revenue" },
      { status: 500 }
    );
  }
}
