"use client";
import { useState } from "react";

export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        if (!password || password.length < 6) {
          setError("Password must be at least 6 characters.");
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        setLoading(true);
        try {
          const res = await fetch("/api/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
          });
          const data = await res.json();
          if (res.ok) {
            setMessage("Password changed successfully.");
            setPassword("");
            setConfirmPassword("");
          } else {
            setError(data.error || "Failed to change password.");
          }
        } catch {
          setError("Failed to change password.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          style={{ color: "#16113a" }}
          placeholder="Enter new password"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          style={{ color: "#16113a" }}
          placeholder="Confirm new password"
        />
      </div>
      <div className="md:col-span-2">
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {message && <div className="text-green-600 mb-2">{message}</div>}
      </div>
      <div className="md:col-span-2 flex justify-end gap-4 items-center">
        <button
          type="submit"
          className="px-6 py-2 bg-[#16113a] text-white rounded-lg shadow hover:bg-[#23205a] transition"
          disabled={loading}
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </div>
    </form>
  );
}
