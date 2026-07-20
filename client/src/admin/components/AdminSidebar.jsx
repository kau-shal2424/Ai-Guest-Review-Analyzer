import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Users, BarChart3, FileText,
  Bell, Settings, User, ClipboardList, ChevronLeft, ChevronRight,
  Zap, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/reviews', icon: BookOpen, label: 'Reviews' },
  { to: '/admin/users', icon: Users, label: 'Manage Users' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/reports', icon: FileText, label: 'Reports' },
];

const BOTTOM_ITEMS = [
  { to: '/admin/notifications', icon: Bell, label: 'Notifications', showBadge: true },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
  { to: '/admin/profile', icon: User, label: 'Profile' },
];

function SidebarItem({ to, icon: Icon, label, collapsed, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          isActive
            ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
        }`
      }
      title={collapsed ? label : undefined}
    >
      <span className="relative flex-shrink-0">
        <Icon className="w-5 h-5" />
        {badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </span>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
}

export default function AdminSidebar({ mobileOpen, onMobileClose, onCollapsedChange }) {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) setCollapsed(true);
      else setCollapsed(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (onCollapsedChange) {
      onCollapsedChange(collapsed);
    }
  }, [collapsed, onCollapsedChange]);

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-30 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          unreadCount={unreadCount}
          user={user}
        />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden fixed top-0 left-0 h-screen w-64 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-800">
              <Logo />
              <button
                onClick={onMobileClose}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-1">
              {NAV_ITEMS.map(item => (
                <SidebarItem key={item.to} {...item} collapsed={false} />
              ))}
            </div>
            <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
              {BOTTOM_ITEMS.map(item => (
                <SidebarItem
                  key={item.to}
                  {...item}
                  collapsed={false}
                  badge={item.showBadge ? unreadCount : 0}
                />
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({ collapsed, setCollapsed, unreadCount, user }) {
  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 py-4 border-b border-slate-200 dark:border-slate-800`}>
        {!collapsed && <Logo />}
        {collapsed && (
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${collapsed ? 'ml-0' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-1">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            Administration
          </p>
        )}
        {NAV_ITEMS.map(item => (
          <SidebarItem key={item.to} {...item} collapsed={collapsed} />
        ))}

        {!collapsed && (
          <p className="px-3 mt-5 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            System
          </p>
        )}
        {collapsed && <div className="h-4" />}
        {BOTTOM_ITEMS.map(item => (
          <SidebarItem
            key={item.to}
            {...item}
            collapsed={collapsed}
            badge={item.showBadge ? unreadCount : 0}
          />
        ))}
      </nav>

      {!collapsed && user && (
        <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800">
          <NavLink
            to="/admin/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
              {user.fullName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user.fullName || 'Admin'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            </div>
          </NavLink>
        </div>
      )}
      {collapsed && user && (
        <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-center">
          <NavLink to="/admin/profile">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
              {user.fullName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </NavLink>
        </div>
      )}
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 flex-shrink-0">
        <Zap className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-none">ReviewAI</p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Control Panel</p>
      </div>
    </div>
  );
}
