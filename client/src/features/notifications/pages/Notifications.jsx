import React, { useState, useMemo } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Card, Badge, Skeleton } from '../../../shared/ui';
import { 
  Bell, CheckSquare, Trash2, SlidersHorizontal, AlertCircle, Info, Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Notifications() {
  const {
    notifications,
    unreadCount,
    loading,
    markRead,
    markAllAsRead,
    remove
  } = useNotifications();

  const [filterMode, setFilterMode] = useState('all'); // 'all', 'unread', 'read'
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      if (filterMode === 'unread') return !n.read;
      if (filterMode === 'read') return n.read;
      return true;
    });
  }, [notifications, filterMode]);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    toast.success("All notifications marked as read!");
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'analysis': return Sparkles;
      case 'error': return AlertCircle;
      default: return Info;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-4xl mx-auto font-sans">
        <Skeleton className="h-10 w-1/3 rounded-2xl" />
        <Skeleton className="h-48 rounded-3xl" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-4xl mx-auto font-sans"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Notification Center</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Real-time review alerts, executive BI briefings, and system logs.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters Toolbar */}
      <Card className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
          {['all', 'unread', 'read'].map((m) => (
            <button
              key={m}
              onClick={() => setFilterMode(m)}
              className={`px-4.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${filterMode === m ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {m}
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-slate-400">Showing {filtered.length} alert logs</span>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="p-12 text-center text-slate-400 rounded-3xl">
            <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-md font-bold text-slate-700 dark:text-slate-300 mb-1">Clean Inbox</h3>
            <p className="text-sm">No notification alerts match your filter selection.</p>
          </Card>
        ) : (
          filtered.map((item) => {
            const Icon = getNotificationIcon(item.type);
            return (
              <Card 
                key={item._id} 
                className={`p-5 flex items-start gap-4 transition-all duration-300 hover:border-slate-200 dark:hover:border-slate-700 ${!item.read ? 'border-l-4 border-l-blue-600 bg-blue-50/10' : ''}`}
              >
                <div className={`p-2.5 rounded-2xl h-fit ${!item.read ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-3">
                    <h4 className={`text-sm ${!item.read ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-650 dark:text-slate-300'}`}>
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mt-1">
                    {item.message}
                  </p>

                  <div className="flex gap-4 mt-3">
                    {!item.read && (
                      <button 
                        onClick={() => markRead(item._id)}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Mark as read
                      </button>
                    )}
                    <button 
                      onClick={() => setDeleteTarget(item)}
                      className="text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4 z-10">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Delete Notification</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Are you sure you want to delete this notification? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setDeleteTarget(null)} 
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  await remove(deleteTarget._id);
                  setDeleteTarget(null);
                  toast.success("Notification deleted.");
                }} 
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-sm font-bold text-white transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
}
