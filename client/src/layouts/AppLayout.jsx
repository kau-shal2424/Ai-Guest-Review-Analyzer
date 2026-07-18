import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import TopHeader from '../components/layout/TopHeader';
import CommandPalette from '../components/layout/CommandPalette';
import { ThemeProvider } from '../context/ThemeContext';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Ctrl+K / Cmd+K to open command palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="app-shell bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main content area — offset by sidebar width */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-250 ease-in-out"
        style={{
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024
            ? (sidebarCollapsed ? 72 : 260)
            : 0
        }}
      >
        {/* Sticky header */}
        <TopHeader
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onOpenCommandPalette={() => setCmdOpen(true)}
        />

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 page-enter">
          <Outlet />
        </main>
      </div>

      {/* Command Palette overlay */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
