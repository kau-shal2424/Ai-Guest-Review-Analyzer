import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell, X, Check, CheckCheck, Trash2, Info, AlertTriangle, MessageSquare, Shield, Sparkles } from "lucide-react";
import {
  fetchNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllRead,
  deleteNotification,
} from "../api/notifications";
import { useAuth } from "../context/AuthContext";

const typeIcon = (type) => {
  const cls = "w-4 h-4 flex-shrink-0";
  switch (type) {
    case "review": return <MessageSquare className={`${cls} text-indigo-500`} />;
    case "admin": return <Shield className={`${cls} text-rose-500`} />;
    case "success": return <Check className={`${cls} text-emerald-500`} />;
    case "warning": return <AlertTriangle className={`${cls} text-amber-500`} />;
    case "ai": return <Sparkles className={`${cls} text-violet-500`} />;
    default: return <Info className={`${cls} text-slate-400`} />;
  }
};

const timeAgo = (isoString) => {
  if (!isoString) return "";
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const pollRef = useRef(null);

  // Poll unread count every 30s
  const refreshCount = useCallback(async () => {
    if (!user) return;
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch {
      // silently fail — user might not be authenticated yet
    }
  }, [user]);

  useEffect(() => {
    refreshCount();
    pollRef.current = setInterval(refreshCount, 30000);
    return () => clearInterval(pollRef.current);
  }, [refreshCount]);

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openDropdown = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {/* ignore */}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {/* ignore */}
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      const wasUnread = notifications.find((n) => n._id === id && !n.read);
      if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
    } catch {/* ignore */}
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={openDropdown}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-0.5 text-[9px] font-black text-white bg-red-500 border-2 border-white dark:border-slate-950 rounded-full leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-black bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  All read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto max-h-[380px]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.read && handleMarkRead(n._id)}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 last:border-b-0 transition-colors group ${
                    !n.read
                      ? "bg-indigo-50/60 dark:bg-indigo-500/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  }`}
                >
                  {/* Icon */}
                  <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${
                    !n.read ? "bg-indigo-100 dark:bg-indigo-500/20" : "bg-slate-100 dark:bg-slate-800"
                  }`}>
                    {typeIcon(n.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold leading-tight ${
                      !n.read ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                    }`}>
                      {n.title}
                    </p>
                    {n.message && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  {/* Unread dot + Delete */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1" />
                    )}
                    <button
                      onClick={(e) => handleDelete(n._id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md transition-all"
                      title="Delete notification"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20">
              <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 font-medium">
                Showing {notifications.length} most recent notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
