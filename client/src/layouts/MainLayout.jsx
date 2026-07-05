import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
