import NextAuth, {
  Session,
  User as NextAuthUser,
  Account,
  Profile,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { dbConnect } from "@/lib/mongoose";
import { compare } from "bcrypt";
import { JWT } from "next-auth/jwt";

export const authOptions = {
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
    async signIn({ user }: { user: NextAuthUser }) {
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
    }: {
      session: Session;
      token: JWT;
      user?: NextAuthUser;
    }) {
      if (session?.user) {
        await dbConnect();
        const dbUser = await User.findOne({ email: session.user.email });
        session.user.role = dbUser?.role || "staff";
      }
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
