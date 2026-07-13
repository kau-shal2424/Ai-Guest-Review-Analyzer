import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Trash2, Shield, Users, Check, X, ArrowLeft, Search,
  ChevronLeft, ChevronRight, MessageSquare, Edit2, Save
} from "lucide-react";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "../components/ui";
import Loader from "../components/ui/Loader";

const API = import.meta.env.VITE_API_BASE_URL;

// ─── Confirmation Modal ───
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, danger = true }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800/80 p-6 space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
        <div className="flex gap-3 pt-2">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors cursor-pointer ${danger ? "bg-rose-600 hover:bg-rose-700" : "bg-indigo-600 hover:bg-indigo-700"}`}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───
function EditModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user.fullName || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await axios.put(`${API}/admin/users/${user.id}`, { fullName: name.trim() });
      onSave({ ...user, fullName: name.trim() });
      showSuccess("User updated successfully");
      onClose();
    } catch (err) {
      showError(err.response?.data?.detail || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800/80 p-6 space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Edit User</h3>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-bold text-white transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pagination ───
function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button disabled={page <= 1} onClick={() => onPage(page - 1)}
        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm font-bold text-slate-600 dark:text-slate-300 px-2">
        {page} / {totalPages}
      </span>
      <button disabled={page >= totalPages} onClick={() => onPage(page + 1)}
        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── User Row ───
function UserRow({ u, onToggle, onDelete, onEdit, actionLoading }) {
  const busy = actionLoading === u.id;
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
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{u.fullName}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500">{u.email}</div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {u.authProvider || "local"}
        </span>
      </td>
      {u.reviewCount !== undefined && (
        <td className="px-5 py-4">
          <span className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
            <MessageSquare className="w-3.5 h-3.5" /> {u.reviewCount}
          </span>
        </td>
      )}
      <td className="px-5 py-4">
        <button
          onClick={() => onToggle(u.id, u.isActive)}
          disabled={busy}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
            u.isActive
              ? "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-green-500/20"
              : "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20"
          } disabled:opacity-50`}>
          {u.isActive ? <><Check className="w-3.5 h-3.5" /> Active</> : <><X className="w-3.5 h-3.5" /> Inactive</>}
        </button>
      </td>
      <td className="px-5 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => onEdit(u)} disabled={busy}
            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors cursor-pointer disabled:opacity-50">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(u)} disabled={busy}
            className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer disabled:opacity-50">
            {busy ? <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ───
export default function ManageUsers() {
  const [activeTab, setActiveTab] = useState("users");

  // Users state
  const [users, setUsers] = useState([]);
  const [userTotal, setUserTotal] = useState(0);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [userLoading, setUserLoading] = useState(false);

  // Admins state
  const [admins, setAdmins] = useState([]);
  const [adminTotal, setAdminTotal] = useState(0);
  const [adminPage, setAdminPage] = useState(1);
  const [adminTotalPages, setAdminTotalPages] = useState(1);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  // Action state
  const [actionLoading, setActionLoading] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
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

  const fetchAdmins = useCallback(async (page = 1, search = "") => {
    setAdminLoading(true);
    try {
      const res = await axios.get(`${API}/admin/admins`, { params: { page, limit: 10, search: search || undefined } });
      setAdmins(res.data.users);
      setAdminTotal(res.data.total);
      setAdminPage(res.data.page);
      setAdminTotalPages(res.data.totalPages);
    } catch (err) {
      showError(err.response?.data?.detail || "Failed to load admins");
    } finally {
      setAdminLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(userPage, userSearch); }, [fetchUsers, userPage]);
  useEffect(() => { fetchAdmins(adminPage, adminSearch); }, [fetchAdmins, adminPage]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => { fetchUsers(1, userSearch); }, 350);
    return () => clearTimeout(t);
  }, [userSearch]);

  useEffect(() => {
    const t = setTimeout(() => { fetchAdmins(1, adminSearch); }, 350);
    return () => clearTimeout(t);
  }, [adminSearch]);

  const handleToggle = async () => {
    if (!toggleConfirm) return;
    const { id, isActive, isAdmin } = toggleConfirm;
    setActionLoading(id);
    try {
      await axios.put(`${API}/admin/users/${id}`, { isActive: !isActive });
      showSuccess(`Account ${!isActive ? "activated" : "deactivated"}`);
      if (isAdmin) {
        setAdmins((prev) => prev.map((u) => u.id === id ? { ...u, isActive: !isActive } : u));
      } else {
        setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: !isActive } : u));
      }
    } catch (err) {
      showError(err.response?.data?.detail || "Failed to update status");
    } finally {
      setActionLoading(null);
      setToggleConfirm(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const { id, isAdmin } = deleteConfirm;
    setActionLoading(id);
    try {
      await axios.delete(`${API}/admin/users/${id}`);
      showSuccess("Account deleted");
      if (isAdmin) {
        setAdmins((prev) => prev.filter((u) => u.id !== id));
        setAdminTotal((t) => t - 1);
      } else {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setUserTotal((t) => t - 1);
      }
    } catch (err) {
      showError(err.response?.data?.detail || "Failed to delete");
    } finally {
      setActionLoading(null);
      setDeleteConfirm(null);
    }
  };

  const handleSaveEdit = (updated) => {
    setUsers((prev) => prev.map((u) => u.id === updated.id ? updated : u));
    setAdmins((prev) => prev.map((u) => u.id === updated.id ? updated : u));
  };

  const tabBtn = (key, label, Icon, count) => (
    <button
      onClick={() => setActiveTab(key)}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
        activeTab === key
          ? "bg-white dark:bg-slate-900 shadow-md text-indigo-600 dark:text-indigo-400 border border-slate-200/50 dark:border-slate-800/80"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
      }`}>
      <Icon className="w-4 h-4" />
      {label}
      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
        activeTab === key
          ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
          : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
      }`}>{count}</span>
    </button>
  );

  const renderTable = (data, isAdmin, loading, search, setSearch, page, totalPages, onPage, total) => (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${isAdmin ? "admins" : "users"} by name or email...`}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{total} total</span>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader size="md" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-800/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-5 py-4">{isAdmin ? "Admin" : "User"}</th>
                  <th className="px-5 py-4">Provider</th>
                  {!isAdmin && <th className="px-5 py-4">Reviews</th>}
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 4 : 5} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500 text-sm font-medium">
                      {search ? `No results for "${search}"` : `No ${isAdmin ? "admins" : "users"} found.`}
                    </td>
                  </tr>
                ) : (
                  data.map((u) => (
                    <UserRow
                      key={u.id}
                      u={u}
                      onToggle={(id, active) => setToggleConfirm({ id, isActive: active, isAdmin })}
                      onDelete={(user) => setDeleteConfirm({ id: user.id, name: user.fullName, isAdmin })}
                      onEdit={(user) => setEditTarget(user)}
                      actionLoading={actionLoading}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPage={onPage} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 space-y-8">

        <Link to="/admin-dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Admin Panel
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Account Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage users and administrators separately. All data is live from MongoDB.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 w-fit">
          {tabBtn("users", "User Management", Users, userTotal)}
          {tabBtn("admins", "Admin Management", Shield, adminTotal)}
        </div>

        {/* Content */}
        {activeTab === "users"
          ? renderTable(users, false, userLoading, userSearch, setUserSearch, userPage, userTotalPages, setUserPage, userTotal)
          : renderTable(admins, true, adminLoading, adminSearch, setAdminSearch, adminPage, adminTotalPages, setAdminPage, adminTotal)
        }

      </main>

      {/* Modals */}
      {editTarget && (
        <EditModal user={editTarget} onClose={() => setEditTarget(null)} onSave={handleSaveEdit} />
      )}
      <ConfirmModal
        isOpen={!!toggleConfirm}
        title={toggleConfirm?.isActive ? "Deactivate Account" : "Activate Account"}
        message={`Are you sure you want to ${toggleConfirm?.isActive ? "deactivate" : "activate"} this account?`}
        onConfirm={handleToggle}
        onCancel={() => setToggleConfirm(null)}
        danger={toggleConfirm?.isActive}
      />
      <ConfirmModal
        isOpen={!!deleteConfirm}
        title="Delete Account"
        message={`This will permanently delete "${deleteConfirm?.name}" and all their reviews. This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
        danger={true}
      />
    </div>
  );
}
