import React, { useState, useEffect } from 'react';
import { Shield, Sun, Moon, CheckCircle2, User, Mail, Key, Calendar } from 'lucide-react';
import { getSettings } from '../../features/settings/services/settings';
import { useAuth } from '../../shared/context/AuthContext';
import { useTheme } from '../../shared/context/ThemeContext';
import Loader from '../../shared/ui/Loader';

function Toggle({ checked, onChange, id }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${checked ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function AdminSettings() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState(null);

  useEffect(() => {
    getSettings()
      .then(data => {
        setAccountData(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  const displayName = accountData?.fullName || user?.fullName || 'Platform Administrator';
  const displayEmail = accountData?.email || user?.email || 'admin@reviewpulse.com';
  const authProvider = accountData?.authProvider || user?.authProvider || 'local';
  const createdAtFormatted = user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
  const lastLoginFormatted = user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
          Platform administrator account information and display preferences.
        </p>
      </div>

      {/* ── ACCOUNT INFORMATION (READ-ONLY) ── */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
        {/* User Header Profile Badge */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-md overflow-hidden flex-shrink-0">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{displayName}</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Shield className="w-3 h-3 mr-1" /> Platform Administrator
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{displayEmail}</p>
          </div>
        </div>

        {/* 5 Read-Only Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
            <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1">{displayName}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
            <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1 truncate">{displayEmail}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Authentication Provider</p>
            <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1 capitalize">{authProvider}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Created</p>
            <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1">{createdAtFormatted}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Login</p>
            <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1">{lastLoginFormatted}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security Status</p>
            <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
            </p>
          </div>
        </div>
      </section>

      {/* ── APPEARANCE & THEME ── */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {isDark ? <Moon className="w-4 h-4 text-violet-500" /> : <Sun className="w-4 h-4 text-amber-500" />} Appearance &amp; Theme
        </h2>
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dark Mode Interface</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Toggle dark / light theme for ReviewPulse Admin Console</p>
          </div>
          <Toggle checked={isDark} onChange={toggleTheme} id="admin-dark-mode-settings" />
        </div>
      </section>
    </div>
  );
}
