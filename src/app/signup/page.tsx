import Topbar from "../../components/Topbar";
import { UserIcon, AtSymbolIcon, KeyIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function SignupPage() {
  return (
    <>
      <Topbar />
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Split background: top half #16113a, bottom half white */}
        <div className="absolute inset-0 w-full h-full z-0 flex flex-col">
          <div className="flex-1 bg-[#16113a]" />
          <div className="flex-1 bg-white" />
        </div>
        <div className="relative z-10 w-full flex justify-center items-start min-h-screen pt-12 sm:pt-20 px-2 sm:px-4">
          <form className="bg-white rounded-2xl shadow-2xl px-4 sm:px-8 md:px-12 py-8 sm:py-12 md:py-14 w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col gap-8 border-2 border-black">
            <h2
              className="text-2xl sm:text-3xl font-bold text-center mb-2"
              style={{ color: "#16113a" }}
            >
              Sign Up
            </h2>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <div className="relative">
                <UserIcon className="w-6 h-6 text-[#16113a] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="name"
                  type="text"
                  placeholder="Full name"
                  className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:border-[#16113a] outline-none text-lg bg-white placeholder-gray-400"
                  autoComplete="name"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative">
                <AtSymbolIcon className="w-6 h-6 text-[#16113a] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:border-[#16113a] outline-none text-lg bg-white placeholder-gray-400"
                  autoComplete="username"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <KeyIcon className="w-6 h-6 text-[#16113a] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:border-[#16113a] outline-none text-lg bg-white placeholder-gray-400"
                  autoComplete="new-password"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-2 py-4 rounded-full bg-[#0fd354] text-[#16113a] font-bold text-xl transition-colors hover:bg-[#0fd354]/90 focus:ring-2 focus:ring-[#0fd354]"
            >
              Continue
            </button>
            <div className="text-center text-gray-600 text-base mt-2">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#16113a] font-semibold hover:underline"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
