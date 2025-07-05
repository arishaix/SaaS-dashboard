"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import ChangePasswordForm from "./ChangePasswordForm";
import ToastMessage, { showToast } from "@/components/ToastMessage";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* Sidebar for desktop */}
      <aside className="hidden lg:block lg:static inset-y-0 left-0 z-30 transition-all duration-300 w-64 bg-[#16113a] text-white overflow-hidden">
        <Sidebar />
      </aside>
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#16113a] text-white overflow-hidden transition-all duration-300 lg:hidden">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#23205a]">
              <span className="text-xl font-bold" style={{ color: "#16113a" }}>
                SaaS Dashboard
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <XMarkIcon className="h-7 w-7 text-white" />
              </button>
            </div>
            <Sidebar />
          </aside>
        </>
      )}
      <main className="flex-1 min-w-0 overflow-hidden flex flex-col">
        {/* Mobile header with hamburger menu */}
        <div className="lg:hidden flex items-center px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Open sidebar"
          >
            <Bars3Icon className="h-7 w-7" />
          </button>
          <span className="ml-4 text-lg font-bold" style={{ color: "#16113a" }}>
            SaaS Dashboard
          </span>
        </div>
        <div className="flex items-center justify-center py-10 px-4 flex-1">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 grid gap-8">
            {/* Profile Info */}
            <section className="flex items-center gap-6 border-b pb-6">
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
              <ChangePasswordForm />
              <div className="md:col-span-2 flex justify-end gap-4 items-center mt-4">
                <span className="mx-2 text-gray-300">|</span>
                <button
                  type="button"
                  className="px-6 py-2 bg-[#16113a] text-white rounded-lg shadow hover:bg-[#23205a] transition"
                  onClick={async () => {
                    try {
                      await signOut({ callbackUrl: "/login" });
                      showToast(
                        <ToastMessage
                          type="success"
                          message="Logged out successfully."
                        />,
                        { toastId: "logout" }
                      );
                    } catch {
                      showToast(
                        <ToastMessage
                          type="error"
                          message="Logout failed. Please try again."
                        />,
                        { toastId: "logout" }
                      );
                    }
                  }}
                >
                  Logout
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
