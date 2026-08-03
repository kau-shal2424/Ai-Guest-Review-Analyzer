import React, { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, MessageSquare, Users, Sparkles, Calendar, ShieldCheck, Award, CheckCircle2 } from 'lucide-react';
import { fetchAnalytics, fetchExportData } from '../services/admin';
import toast from 'react-hot-toast';
import Loader from '../../shared/ui/Loader';

export default function AdminReports() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
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

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const { default: jsPDF } = await import('jspdf');
      const exportData = await fetchExportData();
      const { summary, users, reviews, topContributors } = exportData;

      const doc       = new jsPDF('p', 'mm', 'a4');
      const PW        = doc.internal.pageSize.getWidth();   // 210
      const PH        = doc.internal.pageSize.getHeight();  // 297
      const ML        = 14;   // margin left
      const MR        = 14;   // margin right
      const CW        = PW - ML - MR;  // content width = 182
      const HEADER_H  = 14;
      const FOOTER_H  = 12;
      const CONTENT_T = HEADER_H + 6;  // top of content area
      const CONTENT_B = PH - FOOTER_H - 4; // bottom of content area

      const genDate    = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const periodLabel = { today: 'Today', week: 'This Week', month: 'This Month', year: 'This Year', all: 'All Time' }[period] || period.toUpperCase();

      // ─── Reusable: Page header strip ───────────────────────────────────
      const drawPageHeader = (sectionTitle) => {
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, PW, HEADER_H, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text('ReviewPulse', ML, 9.5);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(203, 213, 225);
        doc.text(sectionTitle, PW - MR, 9.5, { align: 'right' });
      };

      // ─── Reusable: Page footer ──────────────────────────────────────────
      // Called after all pages are added — iterates every page
      const drawAllFooters = () => {
        const total = doc.internal.getNumberOfPages();
        for (let i = 1; i <= total; i++) {
          doc.setPage(i);
          doc.setDrawColor(226, 232, 240);
          doc.line(ML, PH - FOOTER_H, PW - MR, PH - FOOTER_H);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(148, 163, 184);
          doc.text('ReviewPulse  |  Executive Analytics Report', ML, PH - 5);
          doc.text(`Page ${i} of ${total}`, PW - MR, PH - 5, { align: 'right' });
        }
      };

      // ─── Reusable: Section heading ──────────────────────────────────────
      const sectionHeading = (text, y) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(text, ML, y);
        return y + 6;
      };

      // ─── Reusable: Table header row ─────────────────────────────────────
      const tableHeader = (cols, y, rowH = 7) => {
        doc.setFillColor(226, 232, 240);
        doc.rect(ML, y, CW, rowH, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(30, 41, 59);
        cols.forEach(({ label, x, align }) => {
          doc.text(label, x, y + 5, { align: align || 'left' });
        });
        return y + rowH;
      };

      // ─── Reusable: Divider line ─────────────────────────────────────────
      const divider = (y) => {
        doc.setDrawColor(241, 245, 249);
        doc.line(ML, y, PW - MR, y);
      };

      // ═══════════════════════════════════════════════════════════════════
      // PAGE 1 — COVER
      // ═══════════════════════════════════════════════════════════════════
      drawPageHeader('Executive Analytics Report');

      // Hero block
      doc.setFillColor(15, 23, 42);
      doc.rect(0, HEADER_H, PW, 72, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.text('ReviewPulse', ML, 42);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(13);
      doc.setTextColor(203, 213, 225);
      doc.text('Executive Analytics Report', ML, 54);

      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('AI-Powered Hospitality Business Intelligence', ML, 63);

      // Specification card
      const cardY = HEADER_H + 80;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(ML, cardY, CW, 58, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('Report Details', ML + 6, cardY + 10);

      const specRows = [
        ['Report Period',  periodLabel],
        ['Generated Date', genDate],
        ['Generated By',   'Platform Administrator'],
        ['Data Source',    'MongoDB Atlas + Gemini AI'],
      ];
      let sY = cardY + 18;
      doc.setFontSize(8.5);
      specRows.forEach(([k, v]) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text(k, ML + 6, sY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(v, ML + 55, sY);
        sY += 9;
      });

      // ═══════════════════════════════════════════════════════════════════
      // PAGE 2 — EXECUTIVE SUMMARY
      // ═══════════════════════════════════════════════════════════════════
      doc.addPage();
      drawPageHeader('Executive Summary');

      let y = CONTENT_T + 4;
      y = sectionHeading('Business Performance Metrics', y);
      y += 2;

      const posPct = summary.totalReviews > 0 ? Math.round((summary.positiveReviews / summary.totalReviews) * 100) : 0;
      const neuPct = summary.totalReviews > 0 ? Math.round((summary.neutralReviews  / summary.totalReviews) * 100) : 0;
      const negPct = summary.totalReviews > 0 ? Math.round((summary.negativeReviews / summary.totalReviews) * 100) : 0;
      const topSent = posPct >= neuPct && posPct >= negPct ? 'Positive' : neuPct >= negPct ? 'Neutral' : 'Negative';
      const topSentPct = Math.max(posPct, neuPct, negPct);

      const metricGrid = [
        ['Total Users',          String(summary.totalUsers),      'Active Users',          String(summary.activeUsers)],
        ['Total Reviews',        String(summary.totalReviews),    'Positive Reviews',      `${summary.positiveReviews} (${posPct}%)`],
        ['Neutral Reviews',      `${summary.neutralReviews} (${neuPct}%)`, 'Negative Reviews', `${summary.negativeReviews} (${negPct}%)`],
        ['AI Response Coverage', summary.aiResponseCoverage || '—', 'Top Theme',           summary.topTheme || '—'],
        ['Avg Reviews / User',   String(summary.avgReviewsPerUser), 'Report Period',       periodLabel],
      ];

      const CELL_H   = 10;
      const HALF_CW  = (CW - 4) / 2;
      metricGrid.forEach((row) => {
        // Left cell
        doc.setFillColor(241, 245, 249);
        doc.rect(ML, y, HALF_CW, CELL_H, 'F');
        // Right cell
        doc.rect(ML + HALF_CW + 4, y, HALF_CW, CELL_H, 'F');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text(row[0], ML + 3, y + 4);
        doc.text(row[2], ML + HALF_CW + 7, y + 4);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 70, 229);
        doc.text(row[1], ML + HALF_CW - 3, y + 7, { align: 'right' });
        doc.text(row[3], ML + CW - 3, y + 7, { align: 'right' });

        y += CELL_H + 2;
      });

      y += 8;
      y = sectionHeading('AI Narrative Summary', y);
      y += 2;

      const topContributor = topContributors?.[0]?.fullName || 'N/A';
      const narrativeText = `During the ${periodLabel} reporting period, ${topSent} guest reviews represented the largest sentiment segment at ${topSentPct}% of all feedback. The dominant discussion theme was "${summary.topTheme || 'N/A'}". Gemini AI generated automated responses with a coverage rate of ${summary.aiResponseCoverage || 'N/A'}. Top contributor: ${topContributor}.`;

      doc.setFillColor(243, 244, 246);
      const narrativeLines = doc.splitTextToSize(narrativeText, CW - 10);
      const narrativeH     = narrativeLines.length * 5 + 8;
      doc.rect(ML, y, CW, narrativeH, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(narrativeLines, ML + 5, y + 6);
      y += narrativeH + 10;

      // Operational Recommendations
      y = sectionHeading('Operational Recommendations', y);
      y += 2;

      const recs = [
        `Guest sentiment is ${posPct}% Positive — sustain current service quality and responsiveness.`,
        `"${summary.topTheme || 'Experience'}" is the leading discussion topic — prioritise operational resources in this area.`,
        `Automated AI response coverage: ${summary.aiResponseCoverage || 'N/A'} — maintain the Gemini AI reply pipeline.`,
        `Average reviews per user: ${summary.avgReviewsPerUser} — consider engagement campaigns to grow submission rates.`,
      ];

      recs.forEach((rec) => {
        doc.setFillColor(248, 250, 252);
        doc.rect(ML, y, CW, 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(79, 70, 229);
        doc.text('▸', ML + 3, y + 5.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const recLines = doc.splitTextToSize(rec, CW - 12);
        doc.text(recLines[0], ML + 9, y + 5.5); // single line to keep row height fixed
        y += 10;
      });

      // ═══════════════════════════════════════════════════════════════════
      // PAGE 3 — THEME DISTRIBUTION & TOP CONTRIBUTORS
      // ═══════════════════════════════════════════════════════════════════
      doc.addPage();
      drawPageHeader('Theme Distribution & Top Contributors');

      y = CONTENT_T + 4;
      y = sectionHeading('Review Theme Distribution', y);
      y += 2;

      const COLS_THEME = [
        { label: 'Theme',      x: ML + 3 },
        { label: 'Reviews',    x: ML + 110 },
        { label: '% Share',    x: ML + CW, align: 'right' },
      ];
      y = tableHeader(COLS_THEME, y);

      const themesObj = summary.themes || analytics?.themes || {};
      const tTotal    = Object.values(themesObj).reduce((a, b) => a + b, 0) || 1;

      Object.entries(themesObj).forEach(([tName, tCount]) => {
        const tPct = Math.round((tCount / tTotal) * 100);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        doc.text(String(tName), ML + 3, y + 5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 70, 229);
        doc.text(String(tCount), ML + 110, y + 5);
        doc.text(`${tPct}%`, ML + CW, y + 5, { align: 'right' });
        divider(y + 7);
        y += 8;
      });

      y += 10;
      y = sectionHeading('Top Contributor Leaderboard', y);
      y += 2;

      const COLS_TC = [
        { label: 'Rank & Name',    x: ML + 3 },
        { label: 'Email',          x: ML + 72 },
        { label: 'Provider',       x: ML + 140 },
        { label: 'Reviews',        x: ML + CW, align: 'right' },
      ];
      y = tableHeader(COLS_TC, y);

      (topContributors || []).slice(0, 10).forEach((tc, idx) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(`#${idx + 1}  ${(tc.fullName || '').substring(0, 22)}`, ML + 3, y + 5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text((tc.email || '').substring(0, 28), ML + 72, y + 5);
        doc.text(tc.authProvider || 'local', ML + 140, y + 5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 70, 229);
        doc.text(String(tc.reviewsSubmitted ?? 0), ML + CW, y + 5, { align: 'right' });
        divider(y + 7);
        y += 8;
      });

      // ═══════════════════════════════════════════════════════════════════
      // PAGE 4 — REGISTERED USERS DIRECTORY
      // ═══════════════════════════════════════════════════════════════════
      doc.addPage();
      drawPageHeader('Registered Users Directory');

      y = CONTENT_T + 4;
      y = sectionHeading('Registered Customer Directory', y);
      y += 2;

      const COLS_U = [
        { label: 'Name',     x: ML + 3 },
        { label: 'Email',    x: ML + 50 },
        { label: 'Provider', x: ML + 112 },
        { label: 'Status',   x: ML + 138 },
        { label: 'Reviews',  x: ML + CW, align: 'right' },
      ];
      y = tableHeader(COLS_U, y);

      users.forEach((u) => {
        if (y > CONTENT_B - 6) {
          doc.addPage();
          drawPageHeader('Registered Users Directory (cont.)');
          y = CONTENT_T + 4;
          y = tableHeader(COLS_U, y);
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text((u.fullName || '').substring(0, 22), ML + 3, y + 5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text((u.email || '').substring(0, 26), ML + 50, y + 5);
        doc.text(u.authProvider || 'local', ML + 112, y + 5);
        doc.text(u.status || 'Active', ML + 138, y + 5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 70, 229);
        doc.text(String(u.reviewsSubmitted ?? 0), ML + CW, y + 5, { align: 'right' });
        divider(y + 7);
        y += 8;
      });

      // ═══════════════════════════════════════════════════════════════════
      // PAGE 5 — GUEST REVIEWS LOG
      // ═══════════════════════════════════════════════════════════════════
      doc.addPage();
      drawPageHeader('Guest Reviews & AI Response Log');

      y = CONTENT_T + 4;
      y = sectionHeading('Guest Reviews & AI Automated Responses', y);
      y += 2;

      reviews.forEach((r) => {
        const reviewText   = (r.review   || '').substring(0, 100) + ((r.review || '').length > 100 ? '…' : '');
        const responseText = (r.response || '').substring(0, 95)  + ((r.response || '').length > 95  ? '…' : '');
        const CARD_H       = r.response ? 28 : 20;

        if (y + CARD_H > CONTENT_B) {
          doc.addPage();
          drawPageHeader('Guest Reviews & AI Response Log (cont.)');
          y = CONTENT_T + 4;
        }

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.rect(ML, y, CW, CARD_H, 'FD');

        // Sentiment badge colour
        const sentColor = r.sentiment === 'Positive' ? [16, 185, 129] :
                          r.sentiment === 'Negative' ? [239, 68, 68]  : [245, 158, 11];

        // Row 1: user + sentiment
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(`${(r.userName || 'Unknown')}  ·  ${(r.userEmail || '').substring(0, 28)}`, ML + 4, y + 6);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...sentColor);
        doc.text(`[${r.sentiment || ''}]  ${r.theme || ''}`, ML + CW - 4, y + 6, { align: 'right' });

        // Row 2: review text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);
        doc.text(`"${reviewText}"`, ML + 4, y + 13);

        // Row 3: AI reply
        if (r.response) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7.5);
          doc.setTextColor(79, 70, 229);
          doc.text(`AI: ${responseText}`, ML + 4, y + 21);
        }

        y += CARD_H + 3;
      });

      // ─── Add footers to all pages ────────────────────────────────────────
      drawAllFooters();

      doc.save(`ReviewPulse_Executive_Report_${period}_${new Date().toISOString().slice(0,10)}.pdf`);
      toast.success('Executive PDF Report exported successfully!');
    } catch (err) {
      console.error('Export PDF error:', err);
      toast.error('Failed to export PDF report.');
    } finally {
      setExporting(false);
    }
  };

  const sentimentTotal = analytics
    ? Object.values(analytics.sentiments || {}).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">System Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Platform-wide analytics and executive PDF management report export.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={handleExportPDF}
            disabled={loading || !analytics || exporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-60 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exporting PDF...' : 'Export Executive PDF Report'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>
      ) : !analytics ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Analytics Reports Available</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">No analytics data recorded for the selected period.</p>
        </div>
      ) : (
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
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">Top Contributors</h2>
              <div className="space-y-3">
                {analytics.topUsers.map((u, i) => (
                  <div key={u.userId} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{u.fullName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                    </div>
                    <span className="text-sm font-bold text-violet-600 dark:text-violet-400">{u.reviewCount} reviews</span>
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
