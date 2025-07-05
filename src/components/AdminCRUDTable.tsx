"use client";
import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import ToastMessage, { showToast } from "@/components/ToastMessage";
import EditForm from "@/components/forms/EditForm";
import DeleteModal from "@/components/forms/DeleteModal";

// Custom Tooltip Component
const Tooltip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-block w-full"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && content && content.length > 30 && (
        <div className="absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap -top-8 left-1/2 transform -translate-x-1/2">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

type DataType = "revenue" | "sales" | "reports";

interface DataItem {
  _id: string;
  amount?: number;
  source?: string;
  date?: string;
  orderId?: string;
  name?: string;
  activity?: string;
  status?: string;
  [key: string]: any;
}

const columnsMap = {
  revenue: [
    { key: "amount", label: "Amount" },
    { key: "source", label: "Source" },
    { key: "date", label: "Date" },
  ],
  sales: [
    { key: "orderId", label: "Order ID" },
    { key: "amount", label: "Amount" },
    { key: "date", label: "Date" },
  ],
  reports: [
    { key: "name", label: "Name" },
    { key: "date", label: "Date" },
    { key: "activity", label: "Activity" },
    { key: "status", label: "Status" },
  ],
};

interface AdminCRUDTableProps {
  dataType: DataType;
  title: string;
}

export default function AdminCRUDTable({
  dataType,
  title,
}: AdminCRUDTableProps) {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
    itemName: string;
  }>({
    isOpen: false,
    itemId: null,
    itemName: "",
  });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    item: DataItem | null;
  }>({
    isOpen: false,
    item: null,
  });
  const [actionLoading, setActionLoading] = useState(false);

  const itemsPerPage = 5;

  // Fetch data
  useEffect(() => {
    fetchData();
  }, [dataType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = `/api/${dataType}`;
      const response = await fetch(endpoint);
      const result = await response.json();

      let dataArray: DataItem[] = [];
      if (dataType === "revenue") dataArray = result.revenues || [];
      else if (dataType === "sales") dataArray = result.sales || [];
      else if (dataType === "reports") dataArray = result.reports || [];

      setData(dataArray);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast(<ToastMessage type="error" message="Failed to fetch data" />, {
        toastId: "fetch-data-error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (itemId: string) => {
    if (actionLoading) return; // Prevent multiple submissions

    setActionLoading(true);
    try {
      const response = await fetch(`/api/${dataType}/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setData((prev) => prev.filter((item) => item._id !== itemId));
        showToast(
          <ToastMessage type="success" message="Item deleted successfully" />,
          { toastId: "delete-item-success" }
        );
        setDeleteModal({ isOpen: false, itemId: null, itemName: "" });
      } else {
        showToast(
          <ToastMessage type="error" message="Failed to delete item" />,
          { toastId: "delete-item-error" }
        );
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      showToast(<ToastMessage type="error" message="Failed to delete item" />, {
        toastId: "delete-item-error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle edit
  const handleEdit = async (updatedItem: DataItem) => {
    if (actionLoading) return; // Prevent multiple submissions

    setActionLoading(true);
    try {
      const response = await fetch(`/api/${dataType}/${updatedItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        setData((prev) =>
          prev.map((item) =>
            item._id === updatedItem._id ? updatedItem : item
          )
        );
        showToast(
          <ToastMessage type="success" message="Item updated successfully" />,
          { toastId: "edit-item-success" }
        );
        setEditModal({ isOpen: false, item: null });
      } else {
        showToast(
          <ToastMessage type="error" message="Failed to update item" />,
          { toastId: "edit-item-error" }
        );
      }
    } catch (error) {
      console.error("Error updating item:", error);
      showToast(<ToastMessage type="error" message="Failed to update item" />, {
        toastId: "edit-item-error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Sorting
  const handleSort = (key: string) => {
    setSortConfig((prevSort) => ({
      key,
      direction:
        prevSort.key === key && prevSort.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter and sort data
  const filteredAndSortedData = data
    .filter((item) => {
      return Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      const direction = sortConfig.direction === "asc" ? 1 : -1;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Add action buttons to data
  const dataWithActions = paginatedData.map((item) => ({
    ...item,
    actions: (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setEditModal({ isOpen: true, item })}
          className="p-2 hover:bg-gray-50 rounded-md transition-colors"
          title="Edit"
          style={{ color: "#16113a" }}
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() =>
            setDeleteModal({
              isOpen: true,
              itemId: item._id,
              itemName: item.name || item.orderId || item.source || "this item",
            })
          }
          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Delete"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    ),
  })) as (DataItem & { actions: React.ReactElement })[];

  const columns = [
    ...columnsMap[dataType],
    { key: "actions", label: "Actions" },
  ];

  const SortIndicator = ({ column }: { column: string }) => {
    return (
      <ChevronUpDownIcon
        className={`h-4 w-4 inline-block ml-1 ${
          sortConfig.key === column ? "text-[#0fd354]" : "text-gray-400"
        }`}
      />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex flex-1 items-center w-full">
            <h2
              className="text-lg font-semibold mr-4 whitespace-nowrap"
              style={{ color: "#16113a" }}
            >
              {title}
            </h2>
            <div className="flex flex-1 justify-end items-center gap-2">
              <div className="relative w-full max-w-xs">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder={`Search ${dataType}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded-lg pl-10 pr-4 py-2 w-full text-gray-600 placeholder-gray-400 focus:border-gray-500 focus:ring-0"
                  style={{
                    color: "#6b7280",
                    borderColor: "#d1d5db",
                    background: "white",
                  }}
                />
              </div>
              {filteredAndSortedData.length > 5 && (
                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
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
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Table */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0fd354]"></div>
            </div>
          )}

          <div
            className="overflow-x-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#d1d5db #f3f4f6",
            }}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() =>
                        column.key !== "actions" && handleSort(column.key)
                      }
                    >
                      <div className="flex items-center">
                        {column.label}
                        {column.key !== "actions" && (
                          <SortIndicator column={column.key} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataWithActions.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-6 py-4 text-sm text-gray-900 ${
                          column.key === "actions"
                            ? "whitespace-nowrap"
                            : "max-w-[200px]"
                        }`}
                      >
                        {column.key === "actions" ? (
                          item.actions
                        ) : (
                          <Tooltip
                            content={
                              column.key === "amount"
                                ? `$${item[column.key]?.toLocaleString()}`
                                : String(item[column.key] || "")
                            }
                          >
                            <div className="max-w-[200px] truncate">
                              <span>
                                {column.key === "amount"
                                  ? `$${item[column.key]?.toLocaleString()}`
                                  : item[column.key]}
                              </span>
                            </div>
                          </Tooltip>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {dataWithActions.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No {dataType} found
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, itemId: null, itemName: "" })
        }
        onConfirm={() => deleteModal.itemId && handleDelete(deleteModal.itemId)}
        itemName={deleteModal.itemName}
        dataType={dataType}
        loading={actionLoading}
      />

      {/* Edit Modal */}
      {editModal.isOpen && editModal.item && (
        <EditForm
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, item: null })}
          onSave={handleEdit}
          item={editModal.item}
          dataType={dataType}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
