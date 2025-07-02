import React from "react";

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
}) => (
  <div className="bg-white rounded-xl shadow p-4 border border-gray-100 mt-10">
    <h2 className="text-lg font-semibold mb-4" style={{ color: "#16113a" }}>
      Export History
    </h2>
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
          {exportHistory.map((item, index) => (
            <tr key={item._id || item.id || index}>
              <td
                className="px-4 py-2 border-b"
                style={{ color: "#23205a", borderBottom: "1px solid #e5e7eb" }}
              >
                {item.type}
              </td>
              <td
                className="px-4 py-2 border-b"
                style={{ color: "#23205a", borderBottom: "1px solid #e5e7eb" }}
              >
                {item.date}
              </td>
              <td
                className="px-4 py-2 border-b"
                style={{ color: "#23205a", borderBottom: "1px solid #e5e7eb" }}
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

export default ExportHistoryTable;
