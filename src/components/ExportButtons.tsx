import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";

interface ExportButtonsProps {
  data: any[];
  columns: { key: string; label: string }[];
  datasetType?: string;
  onExport?: () => void;
}

async function saveExportEvent({
  type,
  format,
  link,
}: {
  type: string;
  format: string;
  link: string;
}) {
  try {
    await fetch("/api/export-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, format, link }),
    });
  } catch (e) {}
}

async function exportToCSV(
  data: any[],
  columns: { key: string; label: string }[],
  filename = "report.csv",
  type = "Export",
  onExport?: () => void
) {
  const header = columns.map((col) => col.label).join(",");
  const rows = data.map((row) =>
    columns
      .map((col) => `"${(row[col.key] ?? "").toString().replace(/"/g, '""')}"`)
      .join(",")
  );
  const csvContent = [header, ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  await saveExportEvent({ type, format: "CSV", link: url });
  if (onExport) onExport();
}

async function exportToExcel(
  data: any[],
  columns: { key: string; label: string }[],
  filename = "report.xlsx",
  type = "Export",
  onExport?: () => void
) {
  const worksheetData = [
    columns.map((col) => col.label),
    ...data.map((row) => columns.map((col) => row[col.key])),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, filename);
  await saveExportEvent({ type, format: "Excel", link: filename });
  if (onExport) onExport();
}

export default function ExportButtons({
  data,
  columns,
  datasetType,
  onExport,
}: ExportButtonsProps) {
  const type =
    datasetType ||
    (columns && columns.length > 0 ? columns[0].label : "Export");
  return (
    <>
      <button
        onClick={() => exportToCSV(data, columns, "report.csv", type, onExport)}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#16113a] hover:bg-[#23205a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16113a] mr-2"
      >
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        Export CSV
      </button>
      <button
        onClick={() =>
          exportToExcel(data, columns, "report.xlsx", type, onExport)
        }
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#16113a] hover:bg-[#23205a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16113a]"
      >
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        Export Excel
      </button>
    </>
  );
}
