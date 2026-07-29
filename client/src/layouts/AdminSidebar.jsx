import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Users, BarChart3, FileText,
  Bell, Settings, User, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { useAuth } from '../shared/context/AuthContext';
import { useNotifications } from '../features/notifications/hooks/useNotifications';

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
        `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#FF385C] ${
          isActive
            ? 'bg-[#FF385C] text-white shadow-xs'
            : 'text-[#717171] dark:text-gray-300 hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] hover:text-[#222222] dark:hover:text-white'
        }`
      }
      title={collapsed ? label : undefined}
    >
      <span className="relative flex-shrink-0">
        <Icon className="w-4 h-4" />
        {badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#D93025] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
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
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-30 bg-white dark:bg-[#1a1a1a] border-r border-[#EBEBEB] dark:border-[#333333] overflow-hidden"
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
            className="lg:hidden fixed top-0 left-0 h-screen w-64 z-50 bg-white dark:bg-[#1a1a1a] border-r border-[#EBEBEB] dark:border-[#333333] flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#EBEBEB] dark:border-[#333333]">
              <Logo />
              <button
                onClick={onMobileClose}
                className="p-1.5 rounded-full text-[#717171] hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-1">
              {NAV_ITEMS.map(item => (
                <SidebarItem key={item.to} {...item} collapsed={false} />
              ))}
            </div>
            <div className="px-3 py-4 border-t border-[#EBEBEB] dark:border-[#333333] space-y-1">
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
    <div className="flex flex-col h-full text-left">
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 py-4 border-b border-[#EBEBEB] dark:border-[#333333]`}>
        {!collapsed && <Logo />}
        {collapsed && (
          <div className="w-8 h-8 bg-[#FF385C] rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            A
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className={`p-1.5 rounded-full text-[#717171] hover:text-[#222222] dark:hover:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] transition-colors ${collapsed ? 'ml-0' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-1">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-bold text-[#717171] uppercase tracking-wider">
            Administration
          </p>
        )}
        {NAV_ITEMS.map(item => (
          <SidebarItem key={item.to} {...item} collapsed={collapsed} />
        ))}

        {!collapsed && (
          <p className="px-3 mt-5 mb-2 text-[10px] font-bold text-[#717171] uppercase tracking-wider">
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
        <div className="px-3 py-3 border-t border-[#EBEBEB] dark:border-[#333333]">
          <NavLink
            to="/admin/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[#222222] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {user.fullName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#222222] dark:text-white truncate">
                {user.fullName || 'Admin'}
              </p>
              <p className="text-[11px] text-[#717171] truncate">{user.email}</p>
            </div>
          </NavLink>
        </div>
      )}
      {collapsed && user && (
        <div className="px-3 py-3 border-t border-[#EBEBEB] dark:border-[#333333] flex justify-center">
          <NavLink to="/admin/profile">
            <div className="w-8 h-8 rounded-full bg-[#222222] text-white flex items-center justify-center text-xs font-bold">
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
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-[#FF385C] rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
        A
      </div>
      <div>
        <p className="text-sm font-extrabold text-[#222222] dark:text-white leading-none">ReviewAI</p>
        <p className="text-[10px] text-[#717171] font-medium">Control Panel</p>
      </div>
    </div>
  );
}
