"use client";
import Button from "./Button";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Topbar() {
  const { data: session, status } = useSession();
  return (
    <header className="w-full flex flex-row items-center justify-between px-4 sm:px-8 py-4 sm:py-6 shadow-md bg-[#16113a]">
      <div className="flex w-full items-center justify-between gap-x-1">
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide ml-2 sm:ml-7"
          style={{ color: "#0fd354", textDecoration: "none" }}
        >
          SaaS Dashboard
        </Link>
        {/* Login button always visible, next to heading on mobile */}
        <nav className="flex-col sm:flex-row flex gap-4 sm:gap-4 mr-2 sm:mr-18 mt-4 sm:mt-0">
          <Link href="/login">
            <Button
              variant="blue"
              className="bg-[#16113a] text-white border-2 border-white hover:text-[#16113a] hover:scale-105 hover:shadow-lg transition-all duration-200 focus:ring-white"
            >
              Login
            </Button>
          </Link>
          {/* Only show Sign Up on screens >= sm */}
          <span className="hidden sm:inline">
            <Link href="/signup">
              <Button variant="green" className="text-base px-6 py-2">
                Sign Up
              </Button>
            </Link>
          </span>
        </nav>
      </div>
    </header>
  );
}
