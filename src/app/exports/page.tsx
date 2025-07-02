"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Sidebar from "@/components/Sidebar";
import ExportButtons from "@/components/ExportButtons";
import DatasetSelector from "@/components/reports/DatasetSelector";
import ExportPreviewTable from "@/components/reports/ExportPreviewTable";
import ExportHistoryTable from "@/components/reports/ExportHistoryTable";

const columnsMap = {
  users: [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
  ],
  reports: [
    { key: "name", label: "Name" },
    { key: "activity", label: "Activity" },
    { key: "status", label: "Status" },
  ],
  signups: [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
  ],
  sales: [
    { key: "orderId", label: "Order ID" },
    { key: "amount", label: "Amount" },
    { key: "date", label: "Date" },
  ],
};

// Utility function for role checks
function isAdmin(session: any) {
  return session?.user?.role?.trim() === "admin";
}
function isManager(session: any) {
  return session?.user?.role?.trim() === "manager";
}
function isStaff(session: any) {
  return session?.user?.role?.trim() === "staff";
}

export default function ExportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<
    "users" | "reports" | "signups" | "sales"
  >("users");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportHistory, setExportHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let endpoint = "";
    if (selectedDataset === "users") endpoint = "/api/users";
    else if (selectedDataset === "reports") endpoint = "/api/reports";
    else if (selectedDataset === "signups") endpoint = "/api/signups";
    else if (selectedDataset === "sales") endpoint = "/api/sales";
    if (!endpoint) return;
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (selectedDataset === "users") setPreviewData(data.users || []);
        else if (selectedDataset === "reports")
          setPreviewData(data.reports || []);
        else if (selectedDataset === "signups")
          setPreviewData(data.signups || []);
        else if (selectedDataset === "sales") setPreviewData(data.sales || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, [selectedDataset]);

  function fetchExportHistory() {
    setHistoryLoading(true);
    setHistoryError(null);
    fetch("/api/export-history")
      .then((res) => res.json())
      .then((data) => {
        setExportHistory(data.history || []);
        setHistoryLoading(false);
      })
      .catch(() => {
        setHistoryError("Failed to fetch export history");
        setHistoryLoading(false);
      });
  }

  useEffect(() => {
    fetchExportHistory();
  }, []);

  if (status === "loading" || status === "unauthenticated") {
    return <Loader />;
  }

  const columns = columnsMap[selectedDataset];

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
                <span className="text-white">×</span>
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
            <span className="text-2xl">☰</span>
          </button>
          <span className="ml-4 text-lg font-bold" style={{ color: "#16113a" }}>
            SaaS Dashboard
          </span>
        </div>
        <div className="p-6 sm:p-10 lg:p-14 w-full text-base">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#16113a" }}>
            Export Data
          </h1>
          <p className="mb-6" style={{ color: "#23205a" }}>
            Download your business data in CSV or Excel format for further
            analysis.
          </p>

          <DatasetSelector
            selectedDataset={selectedDataset}
            setSelectedDataset={(ds) => setSelectedDataset(ds as any)}
          >
            {(isAdmin(session) || isManager(session)) && (
              <div>
                <ExportButtons
                  data={previewData}
                  columns={columns}
                  datasetType={
                    selectedDataset === "users"
                      ? "Users"
                      : selectedDataset === "sales"
                      ? "Sales"
                      : selectedDataset === "reports"
                      ? "Reports"
                      : selectedDataset === "signups"
                      ? "New Signups"
                      : "Export"
                  }
                  onExport={fetchExportHistory}
                />
              </div>
            )}
          </DatasetSelector>

          <div className="relative">
            <ExportPreviewTable columns={columns} data={previewData} />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                <Loader small />
              </div>
            )}
            {error && !loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="text-red-500 bg-white p-4 rounded shadow">
                  {error}
                </span>
              </div>
            )}
          </div>

          {(isAdmin(session) || isManager(session)) && (
            <div className="relative">
              <ExportHistoryTable exportHistory={exportHistory} />
              {historyLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                  <Loader small />
                </div>
              )}
              {historyError && !historyLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-red-500 bg-white p-4 rounded shadow">
                    {historyError}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
