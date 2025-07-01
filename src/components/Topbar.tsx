"use client";
import Button from "./Button";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  return (
    <header className="w-full flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 sm:py-6 shadow-md bg-[#16113a]">
      <div className="flex w-full sm:w-auto items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide ml-2 sm:ml-7"
          style={{ color: "#0fd354", textDecoration: "none" }}
        >
          SaaS Dashboard
        </Link>
        <button
          className="sm:hidden p-2 text-white focus:outline-none"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <nav
        className={`flex-col sm:flex-row flex gap-4 sm:gap-4 mr-2 sm:mr-18 mt-4 sm:mt-0 ${
          menuOpen ? "flex" : "hidden sm:flex"
        }`}
      >
        <Link href="/login">
          <Button
            variant="blue"
            className="bg-[#16113a] text-white border-2 border-white hover:text-[#16113a] hover:scale-105 hover:shadow-lg transition-all duration-200 focus:ring-white"
          >
            Login
          </Button>
        </Link>
        <Link href="/signup">
          <Button variant="green">Sign Up</Button>
        </Link>
      </nav>
    </header>
  );
}
