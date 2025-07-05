import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "./Loader";
import ToastMessage, { showToast } from "./ToastMessage";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

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
      {showTooltip && content && (
        <div className="absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap -top-8 left-1/2 transform -translate-x-1/2">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

const ROLES = ["admin", "manager", "staff"];

export default function UserManagementTable({
  pageSize = 5,
}: {
  pageSize?: number;
}) {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) {
      showToast(<ToastMessage type="error" message="Failed to load users" />, {
        toastId: "users-load-error",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");
      showToast(<ToastMessage type="success" message="Role updated!" />, {
        toastId: `role-updated-${userId}`,
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (e: any) {
      showToast(<ToastMessage type="error" message={e.message} />, {
        toastId: `role-update-error-${userId}`,
      });
    } finally {
      setUpdatingId(null);
    }
  }
  // function handleCancelModal() { // Removed as per edit hint
  //   setConfirmModal(null);
  //   setPendingRole(null);
  // }

  // Filtering
  const filtered = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-100 mt-10 w-full max-w-8xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex flex-1 items-center w-full">
          <h2
            className="text-lg font-semibold mr-4 whitespace-nowrap"
            style={{ color: "#16113a" }}
          >
            Role Assignment
          </h2>
          <div className="flex flex-1 justify-end items-center gap-2">
            <div className="relative w-full max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg pl-10 pr-4 py-2 w-full text-gray-600 placeholder-gray-400 focus:border-gray-500 focus:ring-0"
                style={{
                  color: "#6b7280",
                  borderColor: "#d1d5db",
                  background: "white",
                }}
              />
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`p-1 rounded-full border border-gray-300 transition-colors duration-150 ${
                    page === 1
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
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`p-1 rounded-full border border-gray-300 transition-colors duration-150 ${
                    page === totalPages
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-16 text-center align-middle">
                  <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0fd354]"></div>
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              paginated.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-green-100 text-green-700"
                          : user.role === "manager"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session?.user?.email === user.email ? (
                      <Tooltip content="You cannot change your own role">
                        <select
                          value={user.role}
                          disabled={true}
                          className="border rounded px-2 py-1 text-sm bg-gray-100 cursor-not-allowed"
                          style={{ color: "#23205a" }}
                        >
                          {ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </option>
                          ))}
                        </select>
                      </Tooltip>
                    ) : (
                      <select
                        value={user.role}
                        disabled={updatingId === user._id}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm"
                        style={{ color: "#23205a" }}
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* <ConfirmModal // Removed as per edit hint
        open={!!confirmModal}
        onClose={handleCancelModal}
        onConfirm={confirmRoleChange}
        title="Confirm Role Change"
        message={
          confirmModal ? (
            <>
              Are you sure you want to change{' '}
              <span className="font-bold">{confirmModal.user?.name}</span>'s role to{' '}
              <span className="font-bold capitalize">{confirmModal.newRole}</span>?
            </>
          ) : null
        }
        loading={confirmLoading}
        confirmText="Confirm"
        cancelText="Cancel"
      /> */}
    </div>
  );
}
