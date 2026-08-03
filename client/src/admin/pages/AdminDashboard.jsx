import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users, MessageSquare, TrendingUp, TrendingDown, Sparkles,
  CalendarDays, MinusCircle, Clock, ArrowRight, Calendar, BarChart2
} from "lucide-react";
import { Link } from "react-router-dom";
import Loader from '../../shared/ui/Loader';
import ErrorState from '../../shared/components/ErrorState';
import { Card, KPICard, Badge } from '../../shared/ui';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

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

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendPeriod, setTrendPeriod] = useState("daily");

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
      <div className="min-h-[400px] flex items-center justify-center font-sans">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 font-sans max-w-7xl mx-auto">
        <ErrorState message={error} onRetry={fetchAdminStats} />
      </div>
    );
  }

  const { users, reviews, recentSignups, reviewsOverTime } = stats;

  const activeTrendData = reviewsOverTime?.[trendPeriod] || [];

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
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Real-time hospitality business performance, review sentiment intelligence, and customer activity metrics.
          </p>
        </div>
      </div>

      {/* 8 Business Intelligence KPI Cards with Count + Percentage */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
          Business Performance Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard title="Total Users" value={users.totalUsers} icon={Users} color="blue" />
          <KPICard title="Total Reviews" value={reviews.total} icon={MessageSquare} color="purple" />
          <KPICard title="AI Analyses" value={reviews.aiAnalyses ?? reviews.total} icon={Sparkles} color="cyan" />
          <KPICard title="Positive Reviews" value={`${reviews.positive} (${reviews.positivePercent}%)`} icon={TrendingUp} color="emerald" />
          <KPICard title="Neutral Reviews" value={`${reviews.neutral} (${reviews.neutralPercent}%)`} icon={MinusCircle} color="amber" />
          <KPICard title="Negative Reviews" value={`${reviews.negative} (${reviews.negativePercent}%)`} icon={TrendingDown} color="rose" />
          <KPICard title="Today's Reviews" value={reviews.todayReviews} icon={Clock} color="indigo" />
          <KPICard title="This Week's Reviews" value={reviews.weeklyReviews} icon={CalendarDays} color="blue" />
        </div>
      </div>

      {/* Reviews Over Time Chart Section */}
      <Card className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Reviews Over Time
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Guest review submission trends aggregated from MongoDB.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
            {[
              { key: 'daily', label: 'Daily' },
              { key: 'weekly', label: 'Weekly' },
              { key: 'monthly', label: 'Monthly' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setTrendPeriod(tab.key)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  trendPeriod === tab.key
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          {activeTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
              <BarChart2 className="w-8 h-8 mb-2 opacity-50" />
              No review trend data recorded for this period.
            </div>
          )}
        </div>
      </Card>

      {/* Content Breakdown Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Review Sentiment Ratio */}
        <Card className="p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Review Sentiment Ratio</h3>
          <SentimentBar label="Positive" value={reviews.positive} total={reviews.total} colorClass="text-emerald-600 dark:text-emerald-400" bgClass="bg-emerald-500" />
          <SentimentBar label="Neutral" value={reviews.neutral} total={reviews.total} colorClass="text-amber-500 dark:text-amber-400" bgClass="bg-amber-500" />
          <SentimentBar label="Negative" value={reviews.negative} total={reviews.total} colorClass="text-rose-600 dark:text-rose-400" bgClass="bg-rose-500" />
        </Card>

        {/* Recent Registrations */}
        <Card className="p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Recent User Registrations</h3>
            <Link to="/admin/users" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              Manage Users <ArrowRight className="w-3.5 h-3.5" />
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
