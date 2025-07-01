import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import User from "@/models/User";
import { hash } from "bcrypt";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }
  const hashedPassword = await hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "staff",
  });
  return NextResponse.json(
    {
      message: "User created",
      user: { email: user.email, name: user.name, role: user.role },
    },
    { status: 201 }
  );
}
