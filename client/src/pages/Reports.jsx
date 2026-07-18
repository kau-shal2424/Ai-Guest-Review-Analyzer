import React, { useState, useMemo } from 'react';
import { useReviews } from '../hooks/useReviews';
import { Card, Badge, Progress } from '../components/ui';
import { 
  Calendar, FileText, Download, TrendingUp, Sparkles, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

export default function Reports() {
  const { reviews } = useReviews();
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

    // Filter reviews by selected date window
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

    // Theme frequency
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

  const handleExportPDF = () => {
    try {
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 text-[15px] font-medium">
            Generate and export custom analytics summaries over predefined periods.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/80 text-xs font-bold text-slate-500">
          {['weekly', 'monthly', 'quarterly', 'yearly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${period === p ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Overview statistics */}
      <Card className="p-6 md:p-8">
        
        <div className="flex justify-between items-center pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{reportStats.periodName}</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Summary Report Details</p>
          </div>
          
          <div className="flex gap-2">
            <button onClick={handleExportPDF} className="flex items-center gap-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl shadow-sm transition-colors">
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button onClick={handleExportCSV} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <FileText className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-b border-slate-100 dark:border-slate-800">
          
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Analyzed Reviews</p>
            <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white">{reportStats.total}</h4>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Theme driving ratings</p>
            <Badge variant="primary" className="mt-1">{reportStats.topTheme}</Badge>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Rating Sentiment</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{overallPositiveRate}% Positive</span>
            </div>
            <Progress value={overallPositiveRate} colorClass="bg-indigo-600 mt-1" />
          </div>

        </div>

        {/* Action recommendations summary */}
        <div className="pt-6">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            📋 Management Summary
          </h4>
          <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed font-semibold">
            During this period ({reportStats.periodName}), guest reviews were heavily centered around <Badge variant="primary">{reportStats.topTheme}</Badge> issues.
            {reportStats.negative > 0 ? (
              <span className="ml-1 text-rose-600 dark:text-rose-400 font-bold block mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Action required: Address the negative reviews to check core operational bottlenecks.</span>
            ) : (
              <span className="ml-1 text-emerald-600 dark:text-emerald-400 font-bold block mt-1 flex items-center gap-1"><Sparkles className="w-4 h-4" /> Operation stable: Standard checklists are effectively meeting user guest criteria.</span>
            )}
          </p>
        </div>

      </Card>

    </div>
  );
}
