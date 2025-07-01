"use client";
import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import Sidebar from "@/components/Sidebar";
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Card from "@/components/Card";
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false); 
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

  const statsCards = [
    {
      title: "Revenue",
      value: "$23,400",
      change: "+12.5%",
      trend: "up",
      icon: CurrencyDollarIcon,
    },
    {
      title: "New Users",
      value: "142",
      change: "+28.4%",
      trend: "up",
      icon: UserGroupIcon,
    },
    {
      title: "Active Users",
      value: "68",
      change: "+8.2%",
      trend: "up",
      icon: UserIcon,
    },
    {
      title: "Bounce Rate",
      value: "12.4%",
      change: "-2.1%",
      trend: "down",
      icon: ChartBarIcon,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-16"}
          bg-[#16113a] text-white overflow-hidden`}
      >
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-hidden">
        {/* Mobile Header with Menu Button */}
        <div className="sticky top-0 z-10 lg:hidden bg-white border-b border-gray-200 px-4 py-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsCards.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                value={card.value}
                change={card.change}
                trend={card.trend as "up" | "down"}
                icon={card.icon}
              />
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Line Chart */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                User Activity Over Time
              </h3>
              <ChartPlaceholder
                title="Line Chart Placeholder"
                description="User activity data will appear here."
              />
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                User Distribution
              </h3>
              <ChartPlaceholder
                title="Pie Chart Placeholder"
                description="User distribution data will appear here."
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
