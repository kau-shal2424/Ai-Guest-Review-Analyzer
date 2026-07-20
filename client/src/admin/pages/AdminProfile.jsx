import React from 'react';
import { User } from 'lucide-react';

export default function AdminProfile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <User className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your admin profile</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">Admin Profile page - Coming Soon</p>
      </div>
    </div>
  );
}

