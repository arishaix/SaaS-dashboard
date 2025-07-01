import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token || (token.user as any)?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/manager")) {
    if (
      !token ||
      ((token.user as any)?.role !== "manager" &&
        (token.user as any)?.role !== "admin")
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/staff")) {
    if (
      !token ||
      !["staff", "manager", "admin"].includes((token.user as any)?.role)
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (
    ["/dashboard", "/report", "/settings"].some((p) => pathname.startsWith(p))
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/manager",
    "/manager/:path*",
    "/staff",
    "/staff/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/report",
    "/report/:path*",
    "/settings",
    "/settings/:path*",
  ],
};
