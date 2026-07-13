import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  ArrowLeft, BarChart2, MessageSquare, Users, Shield, Sparkles,
  Calendar, Download, CheckCircle, XCircle, TrendingUp, Cpu
} from "lucide-react";
import { Link } from "react-router-dom";
import { SentimentPieChart, ThemeBarChart } from "../components/dashboard/Charts";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ErrorState";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Analytics() {
  const [period, setPeriod] = useState("all");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/analytics`,
        { params: { period } }
      );
      setAnalytics(response.data);
    } catch (err) {
      console.error("Error fetching admin analytics:", err);
      setError("Failed to load administration analytics statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const pieData = useMemo(() => {
    if (!analytics || !analytics.sentiments) return [];
    return Object.entries(analytics.sentiments).map(([name, value]) => ({
      name,
      value
    }));
  }, [analytics]);

  const barData = useMemo(() => {
    if (!analytics || !analytics.themes) return [];
    return Object.entries(analytics.themes).map(([theme, count]) => ({
      theme,
      count
    }));
  }, [analytics]);

  const timelineData = useMemo(() => {
    if (!analytics || !analytics.reviews || !analytics.reviews.daily) return [];
    return analytics.reviews.daily;
  }, [analytics]);

  const handleExportCSV = () => {
    if (!analytics) return;
    const rows = [
      ["AI Guest Review Analyzer - Analytics Export"],
      ["Generated At", new Date(analytics.generatedAt).toLocaleString()],
      ["Period Filter", period.toUpperCase()],
      [],
      ["User Segment Metrics"],
      ["Total Accounts", analytics.users.total],
      ["New Users in Period", analytics.users.newUsers],
      ["Active Users", analytics.users.active],
      ["Inactive Users", analytics.users.inactive],
      ["Admins", analytics.users.admins],
      [],
      ["Sentiment Metrics"],
      ...Object.entries(analytics.sentiments).map(([sent, count]) => [sent, count]),
      [],
      ["Theme Distribution"],
      ...Object.entries(analytics.themes).map(([theme, count]) => [theme, count]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `system_analytics_${period}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !analytics) {
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
          <ErrorState message={error} onRetry={fetchAnalytics} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 space-y-8">
        
        {/* Back Link */}
        <Link to="/admin-dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Admin Panel
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Advanced System Analytics</h1>
            <p className="text-slate-500 dark:text-slate-400">System-wide reviews distribution, user engagement, and AI performance logs.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/50 shadow-sm cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-bold bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
              Generated: {new Date(analytics.generatedAt).toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 w-full sm:w-auto overflow-x-auto">
          {[
            { value: "all", label: "All Time" },
            { value: "today", label: "Today" },
            { value: "week", label: "This Week" },
            { value: "month", label: "This Month" },
            { value: "year", label: "This Year" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setPeriod(tab.value)}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                period === tab.value
                  ? "bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/40 dark:border-slate-850"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 flex items-center gap-4 shadow-md">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Accounts</p>
              <h3 className="text-2xl font-black mt-0.5">{analytics.users.total}</h3>
              <p className="text-[10px] text-indigo-500 font-semibold mt-0.5">{analytics.users.admins} Admins</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 flex items-center gap-4 shadow-md">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Active Users</p>
              <h3 className="text-2xl font-black mt-0.5">{analytics.users.active}</h3>
              <p className="text-[10px] text-green-500 font-semibold mt-0.5">{analytics.users.newUsers} New Signups</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 flex items-center gap-4 shadow-md">
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Reviews Analyzed</p>
              <h3 className="text-2xl font-black mt-0.5">{analytics.reviews.total}</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">In selected period</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 flex items-center gap-4 shadow-md">
            <div className="p-3 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-2xl">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">AI Responses</p>
              <h3 className="text-2xl font-black mt-0.5">{analytics.ai.totalResponses}</h3>
              <p className="text-[10px] text-violet-500 font-semibold mt-0.5">{analytics.ai.successPercent}% Autoreply Rate</p>
            </div>
          </div>
        </div>

        {/* Daily Timeline Line Chart */}
        {timelineData.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                Review Activity Trend
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total reviews submitted daily over the last 7 active days.</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sentiment Distribution */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Sentiment Distribution
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Breakdown of customer sentiments analyzed by AI.</p>
            </div>
            <SentimentPieChart data={pieData} />
          </div>

          {/* Topics & Themes */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-500" />
                Topics &amp; Themes Analysis
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Most frequently mentioned topics in customer reviews.</p>
            </div>
            <ThemeBarChart data={barData} />
          </div>
        </div>

        {/* Most Active Users */}
        {analytics.topUsers && analytics.topUsers.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                Most Active Review Authors
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Top users by reviews written in the selected period.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <th className="pb-3 pr-4">User</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4 text-right">Reviews Written</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm font-semibold">
                  {analytics.topUsers.map((item, idx) => (
                    <tr key={item.userId}>
                      <td className="py-3.5 pr-4 text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        {item.fullName}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-500 dark:text-slate-400">{item.email}</td>
                      <td className="py-3.5 pr-4 text-right text-indigo-600 dark:text-indigo-400 font-extrabold">{item.reviewCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
