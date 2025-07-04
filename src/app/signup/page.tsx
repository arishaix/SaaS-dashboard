"use client";
import Topbar from "../../components/Topbar";
import { UserIcon, AtSymbolIcon, KeyIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { showToast } from "@/components/ToastMessage";
import ToastMessage from "@/components/ToastMessage";
import { useSession } from "next-auth/react";
import React from "react";
import Loader from "@/components/Loader";

export default function SignupPage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
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
    setNameError("");
    setEmailError("");
    setPasswordError("");
    let hasError = false;
    if (!name) {
      setNameError("Name is required");
      hasError = true;
    }
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
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (res.ok) {
      showToast(<ToastMessage type="success" message="Signup successful!" />, {
        toastId: "signup",
      });
      await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      router.push("/dashboard");
    } else {
      const data = await res.json();
      let errorMsg = data.error || "Signup failed. Please try again.";
      if (data.error?.toLowerCase().includes("user already exists"))
        setEmailError("User already exists");
      if (data.error?.toLowerCase().includes("missing")) {
        if (!name) setNameError("Name is required");
        if (!email) setEmailError("Email is required");
        if (!password) setPasswordError("Password is required");
      }
      showToast(<ToastMessage type="error" message={errorMsg} />, {
        toastId: "signup",
      });
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
    setNameError("");
    setError("");
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
        {/* Split background: top half #16113a, bottom half white */}
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
              Sign Up
            </h2>
            {error && <div className="text-red-600 text-center">{error}</div>}
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
                  className={`w-full pl-12 pr-4 py-4 rounded-lg border focus:border-[#16113a] outline-none text-lg bg-white text-black placeholder-gray-400 ${
                    nameError ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  autoComplete="name"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
              </div>
              {nameError && (
                <div className="text-red-600 text-sm mt-1 ml-1">
                  {nameError}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <AtSymbolIcon className="w-6 h-6 text-[#16113a] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
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
                  autoComplete="new-password"
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
              {loading ? "Signing up..." : "Continue"}
            </button>
            <div className="text-center text-gray-600 text-base mt-2">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#16113a] font-semibold hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
