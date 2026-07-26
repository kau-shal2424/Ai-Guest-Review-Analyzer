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
import { Card, KPICard, Badge } from '../../components/ui';
import { motion } from 'framer-motion';

const SentimentBar = ({ label, value, total, colorClass, bgClass }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-1.5">
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <ErrorState message={error} onRetry={fetchAdminStats} />
        </div>
      </div>
    );
  }

  const { users, reviews, recentSignups } = stats;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-7xl mx-auto font-sans"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            System Administration Console
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Real-time platform telemetry, user metrics, and global AI system health.
          </p>
        </div>
        <div className="text-xs font-extrabold text-rose-500 bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/20">
          SYSTEM STATUS: ONLINE (SOC-2)
        </div>
      </div>

      {/* User Telemetry */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
          User Telemetry
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard title="Total Users" value={users.totalUsers} icon={Users} color="blue" />
          <KPICard title="Total Admins" value={users.totalAdmins} icon={Shield} color="rose" />
          <KPICard title="Active Users" value={users.activeUsers} icon={CheckCircle} color="emerald" />
          <KPICard title="Active Admins" value={users.activeAdmins} icon={CheckCircle} color="emerald" />
          <KPICard title="Inactive Users" value={users.inactiveUsers} icon={XCircle} color="amber" />
          <KPICard title="Inactive Admins" value={users.inactiveAdmins} icon={XCircle} color="rose" />
        </div>
      </div>

      {/* Review Telemetry */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
          Review Telemetry
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard title="Total Reviews" value={reviews.total} icon={MessageSquare} color="blue" />
          <KPICard title="Positive %" value={`${reviews.positivePercent}%`} icon={TrendingUp} color="emerald" />
          <KPICard title="Negative %" value={`${reviews.negativePercent}%`} icon={TrendingDown} color="rose" />
          <KPICard title="Neutral %" value={`${reviews.neutralPercent}%`} icon={Minus} color="amber" />
          <KPICard title="Today's Reviews" value={reviews.todayReviews} icon={Clock} color="purple" />
          <KPICard title="Weekly Reviews" value={reviews.weeklyReviews} icon={CalendarDays} color="cyan" />
        </div>
      </div>

      {/* Content Breakdown Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Sentiment Breakdown */}
        <Card className="p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Review Sentiment Ratio</h3>
          <SentimentBar label="Positive" value={reviews.positive} total={reviews.total} colorClass="text-emerald-600 dark:text-emerald-400" bgClass="bg-emerald-500" />
          <SentimentBar label="Neutral" value={reviews.neutral} total={reviews.total} colorClass="text-amber-500 dark:text-amber-400" bgClass="bg-amber-500" />
          <SentimentBar label="Negative" value={reviews.negative} total={reviews.total} colorClass="text-rose-600 dark:text-rose-400" bgClass="bg-rose-500" />
        </Card>

        {/* Recent Signups */}
        <Card className="p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Recent Registrations</h3>
            <Link to="/admin/users" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Manage All
            </Link>
          </div>
          <div className="space-y-4">
            {recentSignups && recentSignups.length > 0 ? (
              recentSignups.map((u) => (
                <div key={u._id || u.id} className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0 text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{u.fullName}</p>
                    <p className="text-slate-400 font-medium">{u.email}</p>
                  </div>
                  <Badge variant={u.role === 'admin' ? 'purple' : 'primary'}>{u.role}</Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-medium">No recent user signups.</p>
            )}
          </div>
        </Card>

      </div>
    </motion.div>
  );
}
