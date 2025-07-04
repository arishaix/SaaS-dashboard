"use client";
import { useState, useEffect, useCallback } from "react";
import {
  ChartBarIcon,
  XMarkIcon,
  Bars3Icon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "@/components/Sidebar";
import { CurrencyDollarIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Card from "@/components/Card";
import SalesLineChart from "@/components/charts/SalesLineChart";
import UserGrowthBarChart from "@/components/charts/UserGrowthBarChart";
import RevenueAreaChart from "@/components/charts/RevenueAreaChart";
import UserDistributionPieChart from "@/components/charts/UserDistributionPieChart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import AddSaleForm from "@/components/forms/AddSaleForm";
import AddRevenueForm from "@/components/forms/AddRevenueForm";

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

const ResponsiveGridLayout = WidthProvider(Responsive);

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
  const [userLayout, setUserLayout] = useState<any[]>([]);
  const [chartsLayout, setChartsLayout] = useState<any[]>([]);
  const [layoutLoaded, setLayoutLoaded] = useState(false);
  const [addSaleOpen, setAddSaleOpen] = useState(false);
  const [addRevenueOpen, setAddRevenueOpen] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Refetch functions for stats and charts
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchChartStats = async () => {
    setLoadingCharts(true);
    const res = await fetch("/api/dashboard-stats");
    const data = await res.json();
    console.log("/api/dashboard-stats response", data);
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
    setLoadingCharts(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchChartStats();
  }, []);

  useEffect(() => {
    async function fetchUserLayout() {
      try {
        const res = await fetch("/api/user-dashboard-layout");
        const data = await res.json();
        if (data.dashboardLayout && data.dashboardLayout.statCards) {
          setUserLayout(data.dashboardLayout.statCards);
        }
        if (data.dashboardLayout && data.dashboardLayout.charts) {
          setChartsLayout(data.dashboardLayout.charts);
        }
      } catch (e) {}
      setLayoutLoaded(true);
    }
    fetchUserLayout();
  }, []);

  const handleLayoutChange = useCallback(
    async (layout: any[]) => {
      setUserLayout(layout);
      try {
        await fetch("/api/user-dashboard-layout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dashboardLayout: { statCards: layout, charts: chartsLayout },
          }),
        });
      } catch (e) {}
    },
    [chartsLayout]
  );

  const handleChartsLayoutChange = useCallback(
    async (layout: any[]) => {
      setChartsLayout(layout);
      try {
        await fetch("/api/user-dashboard-layout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dashboardLayout: { statCards: userLayout, charts: layout },
          }),
        });
      } catch (e) {}
    },
    [userLayout]
  );

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
          change: undefined,
          trend: undefined,
          icon: CurrencyDollarIcon,
        },
        {
          title: "Sales",
          value: `${stats.sales}`,
          change: undefined,
          trend: undefined,
          icon: ChartBarIcon,
        },
        {
          title: "Users",
          value: `${stats.users}`,
          change: undefined,
          trend: undefined,
          icon: UserGroupIcon,
        },
        {
          title: "New Signups",
          value: `${stats.newSignups}`,
          change: undefined,
          trend: undefined,
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
              <AddSaleForm
                open={addSaleOpen}
                onClose={() => setAddSaleOpen(false)}
                onSuccess={() => {
                  setAddSaleOpen(false);
                  fetchStats();
                  fetchChartStats();
                }}
              />
              <AddRevenueForm
                open={addRevenueOpen}
                onClose={() => setAddRevenueOpen(false)}
                onSuccess={() => {
                  setAddRevenueOpen(false);
                  fetchStats();
                  fetchChartStats();
                }}
              />
              {/* Draggable Stat Cards for all roles, filtered by role */}
              {!isStaff(session) && (
                <div
                  className={`${
                    isAdmin(session)
                      ? "mb-39"
                      : isManager(session)
                      ? "mb-39"
                      : "mb-4"
                  }`}
                >
                  {layoutLoaded && (
                    <ResponsiveGridLayout
                      className="layout"
                      style={{ gap: 8 }}
                      margin={[8, 4]}
                      draggableCancel=".not-draggable"
                      layouts={{
                        lg:
                          userLayout.length > 0
                            ? isManager(session) && userLayout.length < 4
                              ? [
                                  ...userLayout,
                                  ...Array(4 - userLayout.length)
                                    .fill(null)
                                    .map((_, i) => ({
                                      i: (userLayout.length + i).toString(),
                                      x: userLayout.length + i,
                                      y: 0,
                                      w: 1,
                                      h: 1,
                                    })),
                                ]
                              : userLayout
                            : isAdmin(session)
                            ? statsCards
                            : isManager(session)
                            ? [0, 1, 2, 3].map((_, i) => ({
                                i: i.toString(),
                                x: i,
                                y: 0,
                                w: 1,
                                h: 1,
                              }))
                            : [],
                      }}
                      cols={{ lg: 4, md: 2, sm: 1, xs: 1 }}
                      rowHeight={60}
                      isResizable={true}
                      isDraggable={true}
                      onLayoutChange={handleLayoutChange}
                    >
                      {(isAdmin(session)
                        ? statsCards
                        : isManager(session)
                        ? [...statsCards.slice(0, 2), ...Array(2).fill(null)]
                        : []
                      ).map((card, i) =>
                        card ? (
                          <div
                            key={i.toString()}
                            data-grid={
                              userLayout.find((l) => l.i === i.toString()) || {
                                w: 1,
                                h: 1,
                                x: i,
                                y: 0,
                                minW: 1,
                                minH: 1,
                              }
                            }
                          >
                            <Card
                              title={card.title}
                              value={card.value}
                              change={card.change}
                              trend={card.trend as "up" | "down"}
                              icon={card.icon}
                              onAdd={
                                card.title === "Revenue"
                                  ? () => setAddRevenueOpen(true)
                                  : card.title === "Sales"
                                  ? () => setAddSaleOpen(true)
                                  : undefined
                              }
                            />
                          </div>
                        ) : (
                          <div
                            key={i.toString()}
                            data-grid={{
                              w: 1,
                              h: 1,
                              x: i,
                              y: 0,
                              minW: 1,
                              minH: 1,
                              i: i.toString(),
                            }}
                            style={{ visibility: "hidden" }}
                          />
                        )
                      )}
                    </ResponsiveGridLayout>
                  )}
                </div>
              )}

              {/* Draggable Charts Section */}
              <div className="mt-6">
                {layoutLoaded && (
                  <div className="relative">
                    {loadingCharts && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                        <Loader small />
                      </div>
                    )}
                    <ResponsiveGridLayout
                      className="layout"
                      style={{ gap: 24 }}
                      margin={[24, 24]}
                      layouts={{
                        lg:
                          chartsLayout.length > 0
                            ? chartsLayout.map((item: any) => ({
                                ...item,
                                w: 2,
                              }))
                            : [0, 1, 2, 3].map((i) => ({
                                i: i.toString(),
                                x: (i % 2) * 2,
                                y: Math.floor(i / 2),
                                w: 2,
                                h: 2,
                              })),
                      }}
                      breakpoints={{ lg: 1024, md: 768, sm: 480, xs: 0 }}
                      cols={{ lg: 4, md: 2, sm: 1, xs: 1 }}
                      rowHeight={180}
                      isResizable={true}
                      isDraggable={true}
                      onLayoutChange={handleChartsLayoutChange}
                    >
                      <div
                        key="0"
                        data-grid={
                          chartsLayout.find((l) => l.i === "0")
                            ? {
                                ...chartsLayout.find((l) => l.i === "0"),
                                w: 2,
                              }
                            : {
                                w: 2,
                                h: 2,
                                x: 0,
                                y: 0,
                                minW: 2,
                                minH: 2,
                              }
                        }
                      >
                        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full">
                          <h2
                            className="text-lg font-semibold mb-4"
                            style={{ color: "#16113a" }}
                          >
                            Sales Trend
                          </h2>
                          <SalesLineChart data={chartStats.sales} />
                        </div>
                      </div>
                      <div
                        key="1"
                        data-grid={
                          chartsLayout.find((l) => l.i === "1")
                            ? {
                                ...chartsLayout.find((l) => l.i === "1"),
                                w: 2,
                              }
                            : {
                                w: 2,
                                h: 2,
                                x: 2,
                                y: 0,
                                minW: 2,
                                minH: 2,
                              }
                        }
                      >
                        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full">
                          <h2
                            className="text-lg font-semibold mb-4"
                            style={{ color: "#16113a" }}
                          >
                            User Growth
                          </h2>
                          <UserGrowthBarChart data={chartStats.userGrowth} />
                        </div>
                      </div>
                      <div
                        key="2"
                        data-grid={
                          chartsLayout.find((l) => l.i === "2")
                            ? {
                                ...chartsLayout.find((l) => l.i === "2"),
                                w: 2,
                              }
                            : {
                                w: 2,
                                h: 2,
                                x: 0,
                                y: 1,
                                minW: 2,
                                minH: 2,
                              }
                        }
                      >
                        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full">
                          <h2
                            className="text-lg font-semibold mb-4"
                            style={{ color: "#16113a" }}
                          >
                            Revenue Trend
                          </h2>
                          <RevenueAreaChart data={chartStats.revenue} />
                        </div>
                      </div>
                      <div
                        key="3"
                        data-grid={
                          chartsLayout.find((l) => l.i === "3")
                            ? {
                                ...chartsLayout.find((l) => l.i === "3"),
                                w: 2,
                              }
                            : {
                                w: 2,
                                h: 2,
                                x: 2,
                                y: 1,
                                minW: 2,
                                minH: 2,
                              }
                        }
                      >
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
                    </ResponsiveGridLayout>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
