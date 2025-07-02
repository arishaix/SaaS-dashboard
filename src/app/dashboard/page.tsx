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

// Utility function for role checks
function isAdmin(session: any) {
  return session?.user?.role === "admin";
}
function isManager(session: any) {
  return session?.user?.role === "manager";
}
function isStaff(session: any) {
  return session?.user?.role === "staff";
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [prevStats, setPrevStats] = useState<any>(null);
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
        if (data.latest) {
          setStats(data.latest);
        }
        if (data.previous) {
          setPrevStats(data.previous);
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

  function getPercentChange(current: number, previous: number) {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / Math.abs(previous)) * 100;
  }

  const statsCards = stats
    ? [
        {
          title: "Revenue",
          value: `$${stats.revenue}`,
          change:
            prevStats && typeof prevStats.revenue === "number"
              ? `${getPercentChange(stats.revenue, prevStats.revenue).toFixed(
                  1
                )}%`
              : "0%",
          trend:
            prevStats && stats.revenue >= prevStats.revenue ? "up" : "down",
          icon: CurrencyDollarIcon,
        },
        {
          title: "Sales",
          value: `${stats.sales}`,
          change:
            prevStats && typeof prevStats.sales === "number"
              ? `${getPercentChange(stats.sales, prevStats.sales).toFixed(1)}%`
              : "0%",
          trend: prevStats && stats.sales >= prevStats.sales ? "up" : "down",
          icon: ChartBarIcon,
        },
        {
          title: "Users",
          value: `${stats.users}`,
          change:
            prevStats && typeof prevStats.users === "number"
              ? `${getPercentChange(stats.users, prevStats.users).toFixed(1)}%`
              : "0%",
          trend: prevStats && stats.users >= prevStats.users ? "up" : "down",
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
    <div className="flex h-screen bg-gray-50 flex-row">
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
      <main className="flex-1 min-w-0 overflow-hidden flex flex-col h-screen overflow-y-auto">
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
              {/* Admin: Show all widgets/cards */}
              {isAdmin(session) && (
                <>
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
                </>
              )}

              {/* Manager: Key charts and export */}
              {isManager(session) && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
                    {/* Only show key cards for manager, e.g., Revenue and Users */}
                    {statsCards.slice(0, 2).map((card, index) => (
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
                  <div className="mb-8 flex gap-4">
                    <button className="px-4 py-2 bg-[#16113a] text-white rounded-lg font-medium">
                      Export Data
                    </button>
                  </div>
                </>
              )}

              {/* Staff: Charts only, no actions/buttons */}
              {isStaff(session) && (
                <></> /* No cards or buttons for staff, just charts below */
              )}

              {/* Charts: visible to all roles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 w-full">
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full">
                  <h2
                    className="text-lg font-semibold mb-4"
                    style={{ color: "#16113a" }}
                  >
                    Sales Trend
                  </h2>
                  <SalesLineChart data={chartStats.sales} />
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full">
                  <h2
                    className="text-lg font-semibold mb-4"
                    style={{ color: "#16113a" }}
                  >
                    User Growth
                  </h2>
                  <UserGrowthBarChart data={chartStats.userGrowth} />
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full">
                  <h2
                    className="text-lg font-semibold mb-4"
                    style={{ color: "#16113a" }}
                  >
                    Revenue Trend
                  </h2>
                  <RevenueAreaChart data={chartStats.revenue} />
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full">
                  <h2
                    className="text-lg font-semibold mb-4"
                    style={{ color: "#16113a" }}
                  >
                    User Distribution
                  </h2>
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
