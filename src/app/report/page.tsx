"use client";
import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  Bars3Icon,
  ChevronUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "@/components/Sidebar";
import Table from "@/components/Table";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import ExportButtons from "@/components/ExportButtons";

type SortKey = "name" | "date" | "activity" | "status";

interface ReportItem {
  id: number;
  name: string;
  date: string;
  activity: string;
  status: string;
}

export default function ReportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });
  const itemsPerPage = 5;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reportData, setReportData] = useState<ReportItem[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  // Session check effect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchReports() {
      setLoadingReports(true);
      try {
        const res = await fetch("/api/reports");
        const data = await res.json();
        if (Array.isArray(data.reports)) {
          setReportData(
            data.reports.map((item: any, idx: number) => ({
              id: item._id || idx,
              name: item.name,
              date: item.date,
              activity: item.activity,
              status: item.status,
            }))
          );
        }
      } catch (err) {
        setReportData([]);
      } finally {
        setLoadingReports(false);
      }
    }
    fetchReports();
  }, []);

  if (status === "loading" || status === "unauthenticated" || loadingReports) {
    return <Loader />;
  }

  const handleSort = (key: SortKey) => {
    setSortConfig((prevSort) => ({
      key,
      direction:
        prevSort.key === key && prevSort.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredAndSortedData = reportData
    .filter((item) => {
      const matchesSearch = Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDate =
        dateFilter === "all" || item.date.includes(dateFilter);
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesDate && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      const direction = sortConfig.direction === "asc" ? 1 : -1;
      if (a[sortConfig.key] < b[sortConfig.key]) return -1 * direction;
      if (a[sortConfig.key] > b[sortConfig.key]) return 1 * direction;
      return 0;
    });

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIndicator = ({ column }: { column: SortKey }) => {
    return (
      <ChevronUpDownIcon
        className={`h-4 w-4 inline-block ml-1 ${
          sortConfig.key === column ? "text-[#0fd354]" : "text-gray-400"
        }`}
      />
    );
  };

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "activity", label: "Activity", sortable: true },
    { key: "status", label: "Status", sortable: true },
  ];

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
        <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
          <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="mt-2 text-sm text-gray-600">
                View and analyze your business activities
              </p>
            </div>

            {/* Filters and Search Section */}
            <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
              {/* Search Bar */}
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reports..."
                icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                className="flex-1 max-w-md"
              />

              {/* Filter Group */}
              <div className="flex flex-wrap gap-3">
                {/* Date Filter */}
                <div className="flex items-center">
                  <Select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    options={[
                      { value: "all", label: "All Dates" },
                      { value: "2024-03", label: "March 2024" },
                      { value: "2024-02", label: "February 2024" },
                      { value: "2024-01", label: "January 2024" },
                    ]}
                    icon={<FunnelIcon className="h-5 w-5 text-gray-400" />}
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center">
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={[
                      { value: "all", label: "All Status" },
                      { value: "Completed", label: "Completed" },
                      { value: "Pending", label: "Pending" },
                      { value: "Failed", label: "Failed" },
                      { value: "Processing", label: "Processing" },
                    ]}
                  />
                </div>

                {/* Export Buttons */}
                <ExportButtons data={filteredAndSortedData} columns={columns} />
              </div>
            </div>

            {/* Table Section */}
            <Table
              columns={columns}
              data={paginatedData}
              onSort={(key) => handleSort(key as SortKey)}
              sortConfig={sortConfig}
            />
          </div>
        </div>

        <div className="w-full flex justify-center mt-8 mb-8">
          <nav className="relative z-0 inline-flex rounded-md -space-x-px">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`mx-1 flex items-center justify-center w-9 h-9 rounded-full border text-base font-medium transition-colors duration-150
                ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-transparent text-gray-500 border-gray-300 hover:bg-gray-50"
                }
              `}
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-base font-medium mx-1 transition-colors duration-150
                  ${
                    currentPage === idx + 1
                      ? "text-gray-900 font-semibold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                style={{ background: "none", border: "none", borderRadius: 0 }}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`mx-1 flex items-center justify-center w-9 h-9 rounded-full border text-base font-medium transition-colors duration-150
                ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-transparent text-gray-500 border-gray-300 hover:bg-gray-50"
                }
              `}
              aria-label="Next page"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </main>
    </div>
  );
}
