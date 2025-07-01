"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 flex-row">
      {/* Sidebar and overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-16"}
          bg-[#16113a] text-white overflow-hidden`}
      >
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-hidden flex flex-col">
        {/* Mobile Header with Menu Button */}
        <div className="sticky top-0 z-10 lg:hidden bg-white border-b border-gray-200 px-4 py-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Open menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-center py-10 px-4 flex-1">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 grid gap-8">
            {/* Profile Info */}
            <section className="flex items-center gap-6 border-b pb-6">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  session?.user?.name || "User"
                )}&background=0D8ABC&color=fff`}
                alt="Avatar"
                className="w-20 h-20 rounded-full border-4 border-gray-200 shadow"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {session?.user?.name || "-"}
                </h2>
                <p className="text-gray-500">{session?.user?.email || "-"}</p>
              </div>
            </section>

            {/* Account Settings */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Account Settings
              </h3>
              <form className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
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
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-4 items-center">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#16113a] text-white rounded-lg shadow hover:bg-[#23205a] transition"
                  >
                    Change Password
                  </button>
                  <span className="mx-2 text-gray-300">|</span>
                  <button
                    type="button"
                    className="px-6 py-2 bg-[#16113a] text-white rounded-lg shadow hover:bg-[#23205a] transition"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                  >
                    Logout
                  </button>
                </div>
              </form>
            </section>

            {/* Preferences */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Preferences
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Notification Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                  <span className="text-gray-700 font-medium">
                    Notifications
                  </span>
                  <button
                    type="button"
                    aria-pressed={notifications}
                    onClick={() => setNotifications((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#16113a] ${
                      notifications ? "bg-[#16113a]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        notifications ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
