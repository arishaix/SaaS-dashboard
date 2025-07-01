import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";

interface ExportButtonsProps {
  data: any[];
  columns: { key: string; label: string }[];
}

function exportToCSV(
  data: any[],
  columns: { key: string; label: string }[],
  filename = "report.csv"
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
}

function exportToExcel(
  data: any[],
  columns: { key: string; label: string }[],
  filename = "report.xlsx"
) {
  const worksheetData = [
    columns.map((col) => col.label),
    ...data.map((row) => columns.map((col) => row[col.key])),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, filename);
}

export default function ExportButtons({ data, columns }: ExportButtonsProps) {
  return (
    <>
      <button
        onClick={() => exportToCSV(data, columns)}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#16113a] hover:bg-[#23205a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16113a] mr-2"
      >
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        Export CSV
      </button>
      <button
        onClick={() => exportToExcel(data, columns)}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#16113a] hover:bg-[#23205a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16113a]"
      >
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        Export Excel
      </button>
    </>
  );
}
