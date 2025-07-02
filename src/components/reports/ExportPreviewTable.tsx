import React from "react";

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
  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
      <h2 className="text-lg font-semibold mb-4" style={{ color: "#16113a" }}>
        Preview
      </h2>
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
            {data.slice(0, 11).map((row, idx) => (
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
