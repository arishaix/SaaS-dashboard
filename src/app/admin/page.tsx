"use client";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import UserManagementTable from "@/components/UserManagementTable";
import AdminCRUDTable from "@/components/AdminCRUDTable";

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    if (
      status !== "loading" &&
      status !== "unauthenticated" &&
      session?.user?.role !== "admin"
    ) {
      setRedirecting(true);
      router.replace("/dashboard");
    }
  }, [session, status, router]);

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    redirecting ||
    session?.user?.role !== "admin"
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  const tabs = [
    {
      id: "users",
      label: "User Management",
      component: <UserManagementTable />,
    },
    {
      id: "revenue",
      label: "Revenue Management",
      component: <AdminCRUDTable dataType="revenue" title="Revenue Data" />,
    },
    {
      id: "sales",
      label: "Sales Management",
      component: <AdminCRUDTable dataType="sales" title="Sales Data" />,
    },
    {
      id: "reports",
      label: "Reports Management",
      component: <AdminCRUDTable dataType="reports" title="Reports Data" />,
    },
  ];

  // Only render admin content if user is admin
  return (
    <div className="flex min-h-screen bg-gray-50 flex-row">
      <aside className="hidden lg:block lg:static inset-y-0 left-0 z-30 transition-all duration-300 w-64 bg-[#16113a] text-white overflow-hidden">
        <Sidebar />
      </aside>
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#16113a] text-white overflow-hidden transition-all duration-300 lg:hidden">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#23205a]">
              <span className="text-xl font-bold" style={{ color: "#0fd354" }}>
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
        <div className="p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-8">
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: "#16113a" }}
              >
                Admin Panel
              </h1>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav
                  className="-mb-px flex space-x-8 overflow-x-auto"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#d1d5db #f3f4f6",
                  }}
                >
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? "border-[#0fd354] text-[#0fd354]"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {tabs.find((tab) => tab.id === activeTab)?.component}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
