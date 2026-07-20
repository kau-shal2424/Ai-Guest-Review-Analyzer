import React, { useState, useMemo } from 'react';
import { FileText, Download, TrendingUp, MessageSquare, Users, Sparkles, Calendar } from 'lucide-react';
import { fetchAnalytics } from '../api/admin';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import Loader from '../../components/ui/Loader';

export default function AdminReports() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchAnalytics(period);
        setAnalytics(data);
      } catch {
        toast.error('Failed to load report data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [period]);

  const handleExport = () => {
    if (!analytics) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('ReviewAI — Admin System Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Period: ${period} | Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.setFontSize(13);
    doc.text('Summary', 14, 44);
    doc.setFontSize(10);
    doc.text(`Total Reviews: ${analytics.reviews?.total ?? 0}`, 14, 54);
    doc.text(`Total Users: ${analytics.users?.total ?? 0}`, 14, 62);
    doc.text(`Active Users: ${analytics.users?.active ?? 0}`, 14, 70);
    doc.text(`AI Responses: ${analytics.ai?.totalResponses ?? 0} (${analytics.ai?.successPercent ?? 0}%)`, 14, 78);
    if (analytics.sentiments) {
      doc.setFontSize(13);
      doc.text('Sentiment Breakdown', 14, 92);
      doc.setFontSize(10);
      let y = 102;
      Object.entries(analytics.sentiments).forEach(([key, val]) => {
        doc.text(`${key}: ${val}`, 14, y);
        y += 8;
      });
    }
    doc.save(`admin-report-${period}-${Date.now()}.pdf`);
    toast.success('Report exported!');
  };

  const sentimentTotal = analytics
    ? Object.values(analytics.sentiments || {}).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">System Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Platform-wide analytics and export</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={handleExport}
            disabled={loading || !analytics}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-60 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>
      ) : !analytics ? null : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Reviews', value: analytics.reviews?.total ?? 0, icon: <MessageSquare className="w-5 h-5" />, color: 'text-violet-600 bg-violet-100 dark:bg-violet-950/40' },
              { label: 'Total Users', value: analytics.users?.total ?? 0, icon: <Users className="w-5 h-5" />, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950/40' },
              { label: 'Active Users', value: analytics.users?.active ?? 0, icon: <TrendingUp className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40' },
              { label: 'AI Responses', value: analytics.ai?.totalResponses ?? 0, icon: <Sparkles className="w-5 h-5" />, color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/40' },
            ].map(card => (
              <div key={card.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>{card.icon}</div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{card.value.toLocaleString()}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Sentiment Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">Sentiment Breakdown</h2>
            <div className="space-y-4">
              {Object.entries(analytics.sentiments || {}).map(([label, val]) => {
                const pct = sentimentTotal > 0 ? Math.round((val / sentimentTotal) * 100) : 0;
                const color = label === 'Positive' ? 'bg-emerald-500' : label === 'Negative' ? 'bg-rose-500' : 'bg-amber-500';
                return (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{label}</span>
                      <span className="text-slate-500 dark:text-slate-400">{val} reviews ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Theme Breakdown */}
          {analytics.themes && Object.keys(analytics.themes).length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">Reviews by Theme</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(analytics.themes).map(([theme, count]) => (
                  <div key={theme} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white">{count}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{theme}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Active Users */}
          {analytics.topUsers && analytics.topUsers.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">Most Active Users</h2>
              <div className="space-y-3">
                {analytics.topUsers.map((u, i) => (
                  <div key={u.userId} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{u.fullName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                    </div>
                    <span className="text-sm font-bold text-violet-600 dark:text-violet-400">{u.reviewCount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
