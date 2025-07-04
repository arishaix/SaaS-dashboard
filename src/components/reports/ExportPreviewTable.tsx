import React, { useState } from "react";

interface Column {
  key: string;
  label: string;
}

interface ExportPreviewTableProps {
  columns: Column[];
  data: any[];
}

const ExportPreviewTable: React.FC<ExportPreviewTableProps> = ({
  columns,
  data,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "#16113a" }}>
          Preview
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
              {currentPage} / {totalPages}
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
      <div className="overflow-x-auto w-full">
        <table
          className="text-sm"
          style={
            Array.isArray(columns) && columns.length > 5
              ? { minWidth: `${columns.length * 180}px` }
              : { minWidth: "100%" }
          }
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #23205a" }}>
              {(Array.isArray(columns) ? columns : []).map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2 text-left font-bold"
                  style={{ color: "#16113a" }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={idx}>
                {(Array.isArray(columns) ? columns : []).map((col) => (
                  <td key={col.key} className="px-4 py-2 border-b">
                    <span style={{ color: "#23205a" }}>{row[col.key]}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExportPreviewTable;
