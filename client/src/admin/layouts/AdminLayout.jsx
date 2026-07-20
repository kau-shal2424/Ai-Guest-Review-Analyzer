import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopHeader from '../components/AdminTopHeader';

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-shell bg-slate-50 dark:bg-slate-950">
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        onCollapsedChange={setSidebarCollapsed}
      />

      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-250 ease-in-out"
        style={{
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024
            ? (sidebarCollapsed ? 72 : 260)
            : 0
        }}
      >
        <AdminTopHeader
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 page-enter">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
