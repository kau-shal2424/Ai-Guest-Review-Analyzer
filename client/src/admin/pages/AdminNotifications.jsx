import React, { useState, useMemo } from 'react';
import { Bell, CheckSquare, Trash2, Info, AlertCircle, Sparkles } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { Card, Badge, Skeleton } from '../../components/ui';
import toast from 'react-hot-toast';

export default function AdminNotifications() {
  const { notifications, unreadCount, loading, markRead, markAllAsRead, remove } = useNotifications();
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'unread') return notifications.filter(n => !n.read);
    return notifications;
  }, [notifications, filter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Notifications</h1>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Notifications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {['all', 'unread'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  filter === f
                    ? 'bg-violet-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {f === 'all' ? 'All' : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center">
          <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No notifications to show.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => (
            <div
              key={n._id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 flex items-start gap-4 transition-colors ${
                !n.read
                  ? 'border-violet-200 dark:border-violet-900/50 bg-violet-50/30 dark:bg-violet-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                n.type === 'alert' ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-600' :
                n.type === 'ai' ? 'bg-violet-100 dark:bg-violet-950/40 text-violet-600' :
                'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {n.type === 'alert' ? <AlertCircle className="w-4 h-4" /> :
                 n.type === 'ai' ? <Sparkles className="w-4 h-4" /> :
                 <Info className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${!n.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {n.title}
                  </p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />}
                </div>
                {n.message && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>}
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Recently'}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!n.read && (
                  <button
                    onClick={() => markRead(n._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
                    title="Mark as read"
                  >
                    <CheckSquare className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => remove(n._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
