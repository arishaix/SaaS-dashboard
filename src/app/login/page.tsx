"use client";
import Topbar from "../../components/Topbar";
import { EnvelopeIcon, KeyIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { showToast } from "@/components/ToastMessage";
import ToastMessage from "@/components/ToastMessage";
import { useSession } from "next-auth/react";
import React from "react";
import Loader from "@/components/Loader";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");
    let hasError = false;
    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }
    if (hasError) return;
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (res?.ok) {
      showToast(<ToastMessage type="success" message="Login successful!" />, {
        toastId: "login",
      });
      router.push("/dashboard");
    } else {
      let errMsg = res?.error || "Invalid email or password";
      if (errMsg === "CredentialsSignin") errMsg = "Invalid email or password";
      setError(errMsg);
      setEmailError("Invalid email or password");
      setPasswordError("Invalid email or password");
      showToast(<ToastMessage type="error" message={errMsg} />, {
        toastId: "login",
      });
    }
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    setEmailError("");
    setError("");
  }
  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    setPasswordError("");
    setError("");
  }

  return (
    <>
      <Topbar />
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0 flex flex-col">
          <div className="flex-1 bg-[#16113a]" />
          <div className="flex-1 bg-white" />
        </div>
        <div className="relative z-10 w-full flex justify-center items-start min-h-screen pt-12 sm:pt-20 px-2 sm:px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-2xl px-4 sm:px-8 md:px-12 py-8 sm:py-12 md:py-14 w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col gap-8 border-2 border-black"
          >
            <h2
              className="text-2xl sm:text-3xl font-bold text-center mb-2"
              style={{ color: "#16113a" }}
            >
              Sign in to SaaS Dashboard
            </h2>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <EnvelopeIcon className="w-6 h-6 text-[#16113a] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  className={`w-full pl-12 pr-4 py-4 rounded-lg border focus:border-[#16113a] outline-none text-lg bg-white text-black placeholder-gray-400 ${
                    emailError ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              {emailError && (
                <div className="text-red-600 text-sm mt-1 ml-1">
                  {emailError}
                </div>
              )}
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
                  className={`w-full pl-12 pr-4 py-4 rounded-lg border focus:border-[#16113a] outline-none text-lg bg-white text-black placeholder-gray-400 ${
                    passwordError
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              {passwordError && (
                <div className="text-red-600 text-sm mt-1 ml-1">
                  {passwordError}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-4 rounded-full bg-[#0fd354] text-[#16113a] font-bold text-xl transition-colors hover:bg-[#0fd354]/90 focus:ring-2 focus:ring-[#0fd354]"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <div className="text-center text-gray-600 text-base mt-2">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#16113a] font-semibold hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
