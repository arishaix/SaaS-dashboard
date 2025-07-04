import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/authOptions";
import bcrypt from "bcrypt";

export async function GET() {
  await dbConnect();
  try {
    const users = await User.find({}, "name email role createdAt");
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();

  // Handle role change
  if (body.userId && body.newRole) {
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!["admin", "manager", "staff"].includes(body.newRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    const user = await User.findById(body.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Prevent self-demotion
    if (user.email === session.user.email && body.newRole !== "admin") {
      return NextResponse.json(
        { error: "You cannot remove your own admin role." },
        { status: 400 }
      );
    }
    user.role = body.newRole;
    await user.save();
    return NextResponse.json({ success: true, user });
  }

  // Handle password change
  if (body.password) {
    if (!body.password || body.password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }
    const hashed = await bcrypt.hash(body.password, 10);
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { password: hashed },
      { new: true }
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
