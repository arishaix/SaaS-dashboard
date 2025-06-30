import { ReactNode } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onSort?: (key: string) => void;
  sortConfig?: { key: string | null; direction: "asc" | "desc" };
}

export default function Table({
  columns,
  data,
  onSort,
  sortConfig,
}: TableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={
                    col.sortable && onSort ? () => onSort(col.key) : undefined
                  }
                >
                  {col.label}
                  {col.sortable && sortConfig && (
                    <ChevronUpDownIcon
                      className={`h-4 w-4 inline-block ml-1 ${
                        sortConfig.key === col.key
                          ? "text-[#0fd354]"
                          : "text-gray-400"
                      }`}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, idx) => (
              <tr
                key={item.id || idx}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      col.key === "name"
                        ? "font-medium text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {col.key === "status" ? (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "Failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    ) : (
                      item[col.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
