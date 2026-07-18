import React, { useState, useMemo } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Card, Badge, Skeleton } from '../components/ui';
import { 
  Bell, CheckSquare, Trash2, SlidersHorizontal, AlertCircle, Info, Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';

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
      <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 text-[15px] font-medium">
            Review alerts, report completions, and system actions.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition-all"
          >
            <CheckSquare className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters Toolbar */}
      <Card className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-805">
          {['all', 'unread', 'read'].map((m) => (
            <button
              key={m}
              onClick={() => setFilterMode(m)}
              className={`px-4.5 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${filterMode === m ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {m}
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-slate-400">Showing {filtered.length} alerts</span>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="p-12 text-center text-slate-400">
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
                className={`p-5 flex items-start gap-4 transition-all duration-300 hover:border-slate-200 dark:hover:border-slate-700 ${!item.read ? 'border-l-4 border-l-indigo-600 bg-indigo-50/10' : ''}`}
              >
                <div className={`p-2 rounded-xl h-fit ${!item.read ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-4.5 h-4.5" />
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
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                    <button 
                      onClick={() => remove(item._id)}
                      className="text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-1"
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

    </div>
  );
}
