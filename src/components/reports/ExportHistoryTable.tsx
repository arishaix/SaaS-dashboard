import React, { useState } from "react";

interface ExportHistoryItem {
  _id?: string;
  id?: number;
  type: string;
  date: string;
  format: string;
  link: string;
}

interface ExportHistoryTableProps {
  exportHistory: ExportHistoryItem[];
}

const ExportHistoryTable: React.FC<ExportHistoryTableProps> = ({
  exportHistory,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(exportHistory.length / itemsPerPage);
  const paginatedData = exportHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-100 mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "#16113a" }}>
          Export History
        </h2>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`p-1 rounded-full border border-gray-300 transition-colors duration-150 ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              aria-label="Previous page"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-sm text-gray-600">
              <span className="hidden sm:inline">
                {currentPage} / {totalPages}
              </span>
              <span className="sm:hidden">{currentPage}</span>
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-1 rounded-full border border-gray-300 transition-colors duration-150 ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              aria-label="Next page"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left font-bold text-gray-700 border-b">
                Type
              </th>
              <th className="px-4 py-2 text-left font-bold text-gray-700 border-b">
                Date
              </th>
              <th className="px-4 py-2 text-left font-bold text-gray-700 border-b">
                Format
              </th>
              <th className="px-4 py-2 text-left font-bold text-gray-700 border-b">
                Download
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={item._id || item.id || index}>
                <td
                  className="px-4 py-2 border-b"
                  style={{
                    color: "#23205a",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {item.type}
                </td>
                <td
                  className="px-4 py-2 border-b"
                  style={{
                    color: "#23205a",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {item.date}
                </td>
                <td
                  className="px-4 py-2 border-b"
                  style={{
                    color: "#23205a",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {item.format}
                </td>
                <td
                  className="px-4 py-2 border-b"
                  style={{ borderBottom: "1px solid #e5e7eb" }}
                >
                  <a
                    href={item.link}
                    className="hover:underline"
                    style={{ color: "#23205a" }}
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExportHistoryTable;
