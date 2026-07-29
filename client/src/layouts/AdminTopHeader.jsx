import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, Bell, Search, Menu, LogOut, Settings, User } from 'lucide-react';
import { useTheme } from '../shared/context/ThemeContext';
import { useAuth } from '../shared/context/AuthContext';
import { useNotifications } from '../features/notifications/hooks/useNotifications';

export default function AdminTopHeader({ onMobileMenuOpen, sidebarCollapsed }) {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  // Derive breadcrumb from route
  const crumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .map(seg => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
      path: '/' + seg,
    }));

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-[#1a1a1a] border-b border-[#EBEBEB] dark:border-[#333333] h-16 flex items-center px-4 sm:px-6 gap-4 text-left">
      
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-full text-[#717171] hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <nav className="hidden sm:flex items-center gap-1.5 text-xs font-semibold flex-1 min-w-0">
        <span className="text-[#717171]">Control Panel</span>
        {crumbs.map((crumb, i) => (
          <React.Fragment key={crumb.path}>
            <span className="text-[#717171]">/</span>
            <span
              className={`truncate ${
                i === crumbs.length - 1
                  ? 'text-[#222222] dark:text-white font-extrabold'
                  : 'text-[#717171] cursor-pointer hover:text-[#FF385C]'
              }`}
              onClick={() => i < crumbs.length - 1 && navigate(crumb.path)}
            >
              {crumb.label}
            </span>
          </React.Fragment>
        ))}
      </nav>
      <div className="flex-1 sm:hidden" />

      {/* Right controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-[#717171] hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] hover:text-[#222222] dark:hover:text-white transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate('/admin/notifications')}
          className="relative p-2 rounded-full text-[#717171] hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] hover:text-[#222222] dark:hover:text-white transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#D93025] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(o => !o)}
            className="flex items-center gap-2 border border-[#EBEBEB] dark:border-[#333333] hover:shadow-xs transition-shadow rounded-full p-1 bg-white dark:bg-[#222222] cursor-pointer"
            aria-label="Admin menu"
          >
            <div className="w-7 h-7 rounded-full bg-[#FF385C] flex items-center justify-center text-white text-xs font-bold shadow-xs">
              {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                className="absolute right-0 top-11 w-52 bg-white dark:bg-[#222222] border border-[#EBEBEB] dark:border-[#333333] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.14)] z-20 overflow-hidden text-left"
              >
                <div className="px-4 py-3 border-b border-[#EBEBEB] dark:border-[#333333]">
                  <p className="text-xs font-bold text-[#222222] dark:text-white truncate">{user?.fullName || 'Admin'}</p>
                  <p className="text-[11px] text-[#717171] truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => { navigate('/admin/profile'); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#222222] dark:text-white rounded-xl hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#717171]" /> Profile
                  </button>
                  <button
                    onClick={() => { navigate('/admin/settings'); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#222222] dark:text-white rounded-xl hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#717171]" /> Settings
                  </button>
                  <div className="h-px bg-[#EBEBEB] dark:bg-[#333333] my-1" />
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#D93025] rounded-xl hover:bg-[#FFF0F3] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
