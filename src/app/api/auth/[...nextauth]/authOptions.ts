import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { dbConnect } from "@/lib/mongoose";
import { compare } from "bcrypt";
import { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email });
        if (!user) return null;
        if (user.password && credentials?.password) {
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) return null;
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any }) {
      await dbConnect();
      const existing = await User.findOne({ email: user.email });
      if (!existing) {
        await User.create({
          name: user.name || user.email,
          email: user.email,
          role: "staff",
        });
      }
      return true;
    },
    async session({
      session,
      token,
      user,
      newSession,
      trigger,
    }: {
      session: Session;
      token: JWT;
      user?: any;
      newSession?: any;
      trigger?: "update";
    }) {
      await dbConnect();
      if (!session.user || typeof session.user !== "object") {
        session.user = { name: null, email: null, image: null, role: "staff" };
      } else if (!("role" in session.user)) {
        session.user = { ...session.user, role: "staff" };
      }
      const dbUser = await User.findOne({ email: session.user.email });
      session.user.role = dbUser?.role || "staff";
      return session;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
