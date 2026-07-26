import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useReviews } from '../hooks/useReviews';
import { Card, Badge, Progress, Skeleton, KPICard } from '../../components/ui';
import { 
  Calendar, FileText, Download, TrendingUp, Sparkles, AlertCircle, 
  MessageSquare, BarChart2, ShieldCheck, ArrowRight, Brain
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Reports() {
  const { reviews, loading, error, reload } = useReviews();
  const [period, setPeriod] = useState('monthly'); // 'weekly', 'monthly', 'quarterly', 'yearly'

  // Dynamic grouping based on selected period
  const reportStats = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        total: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        periodName: "Current Period",
        topTheme: "N/A"
      };
    }

    const now = new Date();
    let filtered = [...reviews];

    if (period === 'weekly') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      filtered = reviews.filter(r => new Date(r.createdAt || 0) >= oneWeekAgo);
    } else if (period === 'monthly') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      filtered = reviews.filter(r => new Date(r.createdAt || 0) >= oneMonthAgo);
    } else if (period === 'quarterly') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      filtered = reviews.filter(r => new Date(r.createdAt || 0) >= threeMonthsAgo);
    } else if (period === 'yearly') {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      filtered = reviews.filter(r => new Date(r.createdAt || 0) >= oneYearAgo);
    }

    const total = filtered.length;
    const pos = filtered.filter(r => r.sentiment === 'Positive').length;
    const neg = filtered.filter(r => r.sentiment === 'Negative').length;
    const neu = filtered.filter(r => r.sentiment === 'Neutral').length;

    const themes = {};
    filtered.forEach(r => {
      if (r.theme) themes[r.theme] = (themes[r.theme] || 0) + 1;
    });
    const topTheme = Object.entries(themes).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const periodNameMap = {
      weekly: "Last 7 Days Summary",
      monthly: "Last 30 Days Summary",
      quarterly: "Last 90 Days Summary",
      yearly: "Last 365 Days Summary"
    };

    return {
      total,
      positive: pos,
      negative: neg,
      neutral: neu,
      periodName: periodNameMap[period],
      topTheme
    };
  }, [reviews, period]);

  const handleExportPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, 210, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(18);
      doc.text("GUEST INTELLIGENCE BUSINESS REPORT", 15, 22);
      
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Period: ${reportStats.periodName} (${new Date().toLocaleDateString()})`, 15, 28);
      
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.setFont('Helvetica', 'bold');
      doc.text("EXECUTIVE METRICS", 15, 55);
      
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Total Reviews Analyzed: ${reportStats.total}`, 15, 65);
      doc.text(`Positive Feedback: ${reportStats.positive}`, 15, 72);
      doc.text(`Neutral Feedback: ${reportStats.neutral}`, 15, 79);
      doc.text(`Negative Feedback: ${reportStats.negative}`, 15, 86);
      doc.text(`Primary Core Theme: ${reportStats.topTheme}`, 15, 93);
      
      doc.setFontSize(12);
      doc.setFont('Helvetica', 'bold');
      doc.text("BUSINESS IMPACT RECOMMENDATION", 15, 110);
      
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      const recText = reportStats.negative > 0
        ? "Action Recommended: Enhance housekeeping workflows and monitor checkout response delays to boost overall guest ratings."
        : "Action Recommended: Maintain baseline standards and share positive reviews with front desk teams to preserve momentum.";
      const splitRec = doc.splitTextToSize(recText, 180);
      doc.text(splitRec, 15, 120);

      doc.save(`Business_Report_${period}.pdf`);
      toast.success("PDF Report Exported!");
    } catch (err) {
      toast.error("Failed to generate PDF report.");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Metric", "Value"];
    const rows = [
      ["Period", reportStats.periodName],
      ["Total Reviews", reportStats.total],
      ["Positive Feedback", reportStats.positive],
      ["Neutral Feedback", reportStats.neutral],
      ["Negative Feedback", reportStats.negative],
      ["Top Driving Theme", reportStats.topTheme]
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Report_Metrics_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Report Exported!");
  };

  const overallPositiveRate = reportStats.total > 0
    ? Math.round((reportStats.positive / reportStats.total) * 100)
    : 0;

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto animate-pulse font-sans">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Skeleton className="h-10 w-48 rounded-2xl" />
          <Skeleton className="h-10 w-64 rounded-2xl" />
        </div>
        <Card className="p-6 md:p-8 space-y-6 rounded-3xl">
          <Skeleton className="h-40 w-full rounded-2xl" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 font-sans">
        <Card className="p-8 text-center max-w-md mx-auto space-y-4 rounded-3xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Unable to Load Analytics Report</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{error}</p>
          <button
            onClick={reload}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Retry Loading
          </button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-7xl mx-auto font-sans"
    >
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Business Intelligence Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Generate executive summaries, track period performance, and export PDF reports.
          </p>
        </div>

        {/* Filters & Export */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
            {['weekly', 'monthly', 'quarterly', 'yearly'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  period === p
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            disabled={reportStats.total === 0}
            className="flex items-center gap-1.5 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl shadow-sm disabled:opacity-50 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-500" /> Export CSV
          </button>

          <button
            onClick={handleExportPDF}
            disabled={reportStats.total === 0}
            className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Main Content State */}
      {reportStats.total === 0 ? (
        <Card className="p-12 text-center max-w-xl mx-auto space-y-5 rounded-3xl border-dashed">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">No Review Data to Report</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Analyze your guest reviews to generate period summaries, PDF reports, and downloadable CSV analytics.
            </p>
          </div>
          <Link
            to="/user/analyze"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Analyze a Review Now
          </Link>
        </Card>
      ) : (
        <>
          {/* Executive Overview Banner */}
          <Card className="p-6 md:p-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white relative overflow-hidden border-none shadow-2xl rounded-3xl">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <Badge variant="purple" className="bg-blue-500/20 text-blue-300 border-blue-400/20">
                  <Brain className="w-3.5 h-3.5" />
                  {reportStats.periodName}
                </Badge>
                <h2 className="text-2xl font-extrabold">{overallPositiveRate}% Overall Positive Index</h2>
                <p className="text-slate-300 text-sm max-w-xl font-medium leading-relaxed">
                  Based on {reportStats.total} reviews analyzed. Primary theme category: <strong className="text-white">{reportStats.topTheme}</strong>.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center flex-shrink-0">
                <p className="text-xs font-bold text-slate-400 uppercase">Top Theme</p>
                <p className="text-xl font-black text-white mt-0.5">{reportStats.topTheme}</p>
              </div>
            </div>
          </Card>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard title="Total Processed" value={reportStats.total} icon={MessageSquare} color="blue" />
            <KPICard title="Positive Reviews" value={reportStats.positive} icon={TrendingUp} color="emerald" />
            <KPICard title="Neutral Feedback" value={reportStats.neutral} icon={FileText} color="amber" />
            <KPICard title="Negative Issues" value={reportStats.negative} icon={AlertCircle} color="rose" />
          </div>

          {/* Sentiment Health Bar */}
          <Card className="p-6 md:p-8 space-y-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-900 dark:text-white">Sentiment Ratio Breakdown</span>
              <span className="text-blue-600 dark:text-blue-400">{overallPositiveRate}% Positive Ratio</span>
            </div>
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full transition-all duration-700" style={{ width: `${(reportStats.positive / reportStats.total) * 100}%` }} title="Positive" />
              <div className="bg-amber-400 h-full transition-all duration-700" style={{ width: `${(reportStats.neutral / reportStats.total) * 100}%` }} title="Neutral" />
              <div className="bg-rose-500 h-full transition-all duration-700" style={{ width: `${(reportStats.negative / reportStats.total) * 100}%` }} title="Negative" />
            </div>
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 font-semibold pt-2">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Positive ({reportStats.positive})</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Neutral ({reportStats.neutral})</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Negative ({reportStats.negative})</span>
            </div>
          </Card>
        </>
      )}
    </motion.div>
  );
}
