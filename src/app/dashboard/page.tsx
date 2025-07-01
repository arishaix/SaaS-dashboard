"use client";
import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  XMarkIcon,
  Bars3Icon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "@/components/Sidebar";
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Card from "@/components/Card";
import SalesLineChart from "@/components/charts/SalesLineChart";
import UserGrowthBarChart from "@/components/charts/UserGrowthBarChart";
import RevenueAreaChart from "@/components/charts/RevenueAreaChart";
import UserDistributionPieChart from "@/components/charts/UserDistributionPieChart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

type DashboardStats = {
  sales: any[];
  userGrowth: any[];
  revenue: any[];
  userDistribution: any[];
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newSignups, setNewSignups] = useState<number>(0);
  const [chartStats, setChartStats] = useState<DashboardStats>({
    sales: [],
    userGrowth: [],
    revenue: [],
    userDistribution: [],
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchStats() {
      setLoadingStats(true);
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (data.stats && data.stats.length > 0) {
          setStats(data.stats[0]); // latest stats
        }
        if (typeof data.newSignups === "number") {
          setNewSignups(data.newSignups);
        }
      } catch (err) {
        setStats(null);
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchChartStats() {
      const res = await fetch("/api/dashboard-stats");
      const data = await res.json();
      const statsByType: DashboardStats = {
        sales: [],
        userGrowth: [],
        revenue: [],
        userDistribution: [],
      };
      data.stats.forEach((stat: any) => {
        if (stat.type && stat.type in statsByType) {
          statsByType[stat.type as keyof DashboardStats] = stat.data;
        }
      });
      setChartStats(statsByType);
    }
    fetchChartStats();
  }, []);

  if (status === "loading" || status === "unauthenticated") {
    return <Loader />;
  }

  const statsCards = stats
    ? [
        {
          title: "Revenue",
          value: `$${stats.revenue}`,
          change: "+0%",
          trend: "up",
          icon: CurrencyDollarIcon,
        },
        {
          title: "Sales",
          value: `${stats.sales}`,
          change: "+0%",
          trend: "up",
          icon: ChartBarIcon,
        },
        {
          title: "Users",
          value: `${stats.users}`,
          change: "+0%",
          trend: "up",
          icon: UserGroupIcon,
        },
        {
          title: "New Signups",
          value: `${newSignups}`,
          change: "+5%",
          trend: "up",
          icon: UserPlusIcon,
        },
      ]
    : [];

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
        <div className="p-6 sm:p-10 lg:p-14 w-full max-w-none text-base">
          {loadingStats ? (
            <div className="flex justify-center items-center h-[300px] mt-36">
              <Loader />
            </div>
          ) : (
            <>
              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
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

              {/* Analytics Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 w-full">
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Sales Over Time
                  </h3>
                  <SalesLineChart data={chartStats.sales} />
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    User Growth
                  </h3>
                  <UserGrowthBarChart data={chartStats.userGrowth} />
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Revenue Trend
                  </h3>
                  <RevenueAreaChart data={chartStats.revenue} />
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    User Distribution
                  </h3>
                  <UserDistributionPieChart
                    data={chartStats.userDistribution}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
