import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users, Shield, MessageSquare, CheckCircle, XCircle, AlertTriangle,
  ArrowRight, BarChart2, TrendingUp, TrendingDown, Minus,
  Clock, Calendar, CalendarDays, UserPlus
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from '../../components/dashboard/StatCard';
import Loader from '../../components/ui/Loader';
import ErrorState from '../../components/ErrorState';

const SentimentBar = ({ label, value, total, colorClass, bgClass }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold mb-1.5">
        <span className={colorClass}>{label} ({value})</span>
        <span className="text-slate-500 dark:text-slate-400">{pct}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${bgClass} transition-all duration-700 rounded-full`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d) ? "—" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/dashboard`);
      setStats(response.data);
    } catch (err) {
      console.error("Admin Dashboard error:", err);
      setError("Failed to load administration stats. Please verify permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <ErrorState message={error} onRetry={fetchAdminStats} />
        </div>
      </div>
    );
  }

  const { users, reviews, recentSignups } = stats;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Admin Control Panel
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Real-time system metrics from MongoDB.
            </p>
          </div>
          <div className="text-xs font-bold text-rose-500 bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/20">
            SYSTEM STATUS: SECURED &amp; ACTIVE
          </div>
        </div>

        {/* ── User Stats Grid ── */}
        <div>
          <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            User Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="Total Users" value={users.totalUsers} icon={Users}
              colorClass="text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400" />
            <StatCard title="Total Admins" value={users.totalAdmins} icon={Shield}
              colorClass="text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400" />
            <StatCard title="Active Users" value={users.activeUsers} icon={CheckCircle}
              colorClass="text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" />
            <StatCard title="Active Admins" value={users.activeAdmins} icon={CheckCircle}
              colorClass="text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400" />
            <StatCard title="Inactive Users" value={users.inactiveUsers} icon={XCircle}
              colorClass="text-amber-500 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400" />
            <StatCard title="Inactive Admins" value={users.inactiveAdmins} icon={XCircle}
              colorClass="text-orange-500 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400" />
          </div>
        </div>

        {/* ── Review Stats Grid ── */}
        <div>
          <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            Review Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="Total Reviews" value={reviews.total} icon={MessageSquare}
              colorClass="text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400" />
            <StatCard title="Positive %" value={reviews.positivePercent} icon={TrendingUp}
              colorClass="text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" />
            <StatCard title="Negative %" value={reviews.negativePercent} icon={TrendingDown}
              colorClass="text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400" />
            <StatCard title="Neutral %" value={reviews.neutralPercent} icon={Minus}
              colorClass="text-amber-500 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400" />
            <StatCard title="Today's Reviews" value={reviews.todayReviews} icon={Clock}
              colorClass="text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-400" />
            <StatCard title="Weekly Reviews" value={reviews.weeklyReviews} icon={CalendarDays}
              colorClass="text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400" />
          </div>
        </div>

        {/* ── Content Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Sentiment Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl space-y-5">
            <h3 className="text-lg font-bold">Review Sentiment Breakdown</h3>
            <SentimentBar label="Positive" value={reviews.positive} total={reviews.total}
              colorClass="text-emerald-600 dark:text-emerald-400"
              bgClass="bg-emerald-500" />
            <SentimentBar label="Neutral" value={reviews.neutral} total={reviews.total}
              colorClass="text-amber-500 dark:text-amber-400"
              bgClass="bg-amber-500" />
            <SentimentBar label="Negative" value={reviews.negative} total={reviews.total}
              colorClass="text-rose-600 dark:text-rose-400"
              bgClass="bg-rose-500" />

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-3">
              {[
                { label: "Today", value: reviews.todayReviews, icon: Clock },
                { label: "This Week", value: reviews.weeklyReviews, icon: CalendarDays },
                { label: "This Month", value: reviews.monthlyReviews, icon: Calendar },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span className="text-xl font-black text-slate-900 dark:text-white">{value}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">User Management</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage users and administrators</p>
                </div>
              </div>
              <Link to="/admin/users"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                Manage Accounts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Analytics &amp; Metrics</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Deep-dive into system analytics</p>
                </div>
              </div>
              <Link to="/admin/analytics"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors">
                View Analytics <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Recent Signups ── */}
        {recentSignups && recentSignups.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-500" />
                Recent Signups
              </h3>
              <Link to="/admin/users" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {recentSignups.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      {u.fullName?.substring(0, 2)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{u.fullName}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.role === "admin"
                        ? "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400"
                        : "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                    }`}>
                      {u.role}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(u.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

