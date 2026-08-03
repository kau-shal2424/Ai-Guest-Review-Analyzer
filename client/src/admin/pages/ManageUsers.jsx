import React, { useEffect, useState, useCallback, memo } from "react";
import axios from "axios";
import {
  Trash2, Users, Check, X, Search,
  ChevronLeft, ChevronRight, MessageSquare, AlertTriangle
} from "lucide-react";
import { showError, showSuccess } from '../../shared/ui';
import Loader from '../../shared/ui/Loader';
import { useAuth } from '../../shared/context/AuthContext';

const API = import.meta.env.VITE_API_BASE_URL;

// ─── Enhanced Delete Confirmation Modal ───
const DeleteModal = memo(function DeleteModal({ isOpen, target, onConfirm, onCancel, deleting }) {
  if (!isOpen || !target) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Delete User Account</h3>
            <p className="text-xs text-slate-400">Confirm permanent account deletion</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 space-y-2 text-xs border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Full Name:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{target.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Email:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{target.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Reviews Submitted:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{target.reviewCount ?? 0}</span>
          </div>
        </div>

        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
          This action cannot be undone. All associated guest reviews and account data will be permanently purged.
        </p>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
});

// ─── Status Toggle Confirmation Modal ───
const ConfirmModal = memo(function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, danger = true }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4 z-10">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{message}</p>
        <div className="flex gap-3 pt-2">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer ${danger ? "bg-rose-600 hover:bg-rose-700" : "bg-indigo-600 hover:bg-indigo-700"}`}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
});

// ─── Pagination ───
const Pagination = memo(function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button disabled={page <= 1} onClick={() => onPage(page - 1)}
        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 px-2">
        Page {page} of {totalPages}
      </span>
      <button disabled={page >= totalPages} onClick={() => onPage(page + 1)}
        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
});

// ─── User Row ───
const UserRow = memo(function UserRow({ u, currentAdminId, onToggle, onDelete, actionLoading }) {
  const busy = actionLoading === u.id;
  const isSelf = u.id === currentAdminId || u.role === 'admin';

  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center flex-shrink-0 font-bold text-sm overflow-hidden">
            {u.profileImage
              ? <img src={u.profileImage} alt="" className="w-full h-full object-cover" />
              : u.fullName?.substring(0, 2)?.toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              {u.fullName}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                u.role === 'admin'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
              }`}>
                {u.role || 'user'}
              </span>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500">{u.email}</div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
          {u.authProvider || "local"}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> {u.reviewCount ?? 0}
        </span>
      </td>
      <td className="px-5 py-4">
        <button
          onClick={() => !isSelf && onToggle(u.id, u.isActive)}
          disabled={busy || isSelf}
          title={isSelf ? "Administrator status cannot be toggled" : "Toggle active status"}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors ${
            u.isActive
              ? "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-green-500/20"
              : "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20"
          } ${isSelf ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'} disabled:opacity-50`}>
          {u.isActive ? <><Check className="w-3.5 h-3.5" /> Active</> : <><X className="w-3.5 h-3.5" /> Suspended</>}
        </button>
      </td>
      <td className="px-5 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          {!isSelf && (
            <button onClick={() => onDelete(u)} disabled={busy}
              title="Delete User Account"
              className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer disabled:opacity-50">
              {busy ? <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
});

// ─── Main Page ───
export default function ManageUsers() {
  const { user: currentUser } = useAuth();

  // Users state
  const [users, setUsers] = useState([]);
  const [userTotal, setUserTotal] = useState(0);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [userLoading, setUserLoading] = useState(false);

  // Action state
  const [actionLoading, setActionLoading] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toggleConfirm, setToggleConfirm] = useState(null);

  const fetchUsers = useCallback(async (page = 1, search = "") => {
    setUserLoading(true);
    try {
      const res = await axios.get(`${API}/admin/users`, { params: { page, limit: 10, search: search || undefined } });
      setUsers(res.data.users);
      setUserTotal(res.data.total);
      setUserPage(res.data.page);
      setUserTotalPages(res.data.totalPages);
    } catch (err) {
      showError(err.response?.data?.detail || "Failed to load users");
    } finally {
      setUserLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(userPage, userSearch); }, [fetchUsers, userPage]);

  // Debounced search across Name, Email, and Provider
  useEffect(() => {
    const t = setTimeout(() => { fetchUsers(1, userSearch); }, 350);
    return () => clearTimeout(t);
  }, [userSearch]);

  const handleToggle = async () => {
    if (!toggleConfirm) return;
    const { id, isActive } = toggleConfirm;
    setActionLoading(id);
    try {
      await axios.put(`${API}/admin/users/${id}`, { isActive: !isActive });
      showSuccess(`Account ${!isActive ? "activated" : "suspended"}`);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: !isActive } : u));
    } catch (err) {
      showError(err.response?.data?.detail || "Failed to update status");
    } finally {
      setActionLoading(null);
      setToggleConfirm(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const { id } = deleteConfirm;
    setDeleting(true);
    setActionLoading(id);
    try {
      await axios.delete(`${API}/admin/users/${id}`);
      showSuccess("User account deleted successfully");
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setUserTotal((t) => Math.max(0, t - 1));
    } catch (err) {
      showError(err.response?.data?.detail || "Failed to delete user");
    } finally {
      setDeleting(false);
      setActionLoading(null);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            View customer accounts, toggle access status (Suspend/Activate), or remove accounts.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search users by name, email, or provider..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
          {userTotal} Total Registered Customer Accounts
        </span>
      </div>

      {/* Users Table & Custom Empty State */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {userLoading ? (
          <div className="flex items-center justify-center py-16"><Loader size="md" /></div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Customer Accounts Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {userSearch ? `No registered users matched your search "${userSearch}"` : "No customer accounts have registered on the platform yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Provider</th>
                  <th className="px-5 py-4">Reviews</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {users.map((u) => (
                  <UserRow
                    key={u.id}
                    u={u}
                    currentAdminId={currentUser?.id || currentUser?._id}
                    onToggle={(id, active) => setToggleConfirm({ id, isActive: active })}
                    onDelete={(user) => setDeleteConfirm({ id: user.id, name: user.fullName, email: user.email, reviewCount: user.reviewCount })}
                    actionLoading={actionLoading}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={userPage} totalPages={userTotalPages} onPage={setUserPage} />

      {/* Enhanced Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteConfirm}
        target={deleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
        deleting={deleting}
      />

      {/* Status Toggle Modal */}
      <ConfirmModal
        isOpen={!!toggleConfirm}
        title={toggleConfirm?.isActive ? "Suspend User Account" : "Activate User Account"}
        message={`Are you sure you want to ${toggleConfirm?.isActive ? "suspend" : "activate"} this user account?`}
        onConfirm={handleToggle}
        onCancel={() => setToggleConfirm(null)}
        danger={toggleConfirm?.isActive}
      />
    </div>
  );
}
