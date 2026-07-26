import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, MessageSquare, ThumbsUp, ThumbsDown, MinusCircle, 
  ArrowRight, Brain, Zap, Target, Star, ShieldAlert, Award, TrendingUp, BarChart2
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { Card, Badge, Progress, Skeleton, KPICard } from '../../components/ui';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area 
} from 'recharts';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    stats,
    reviews,
    loading,
    error,
    sentimentData,
    themeData,
    recentReviews,
    trendData
  } = useDashboard();

  // Advanced SaaS metrics calculation
  const computedMetrics = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        avgRating: 0,
        avgConfidence: 0,
        avgAiScore: 0,
        summary: "Welcome to ReviewAI! Begin by analyzing a guest review to generate insights.",
        recommendation: "Analyze your first review to unlock personalized AI business recommendations.",
        topTheme: "N/A",
        mostPositiveArea: "N/A",
        mostNegativeArea: "N/A",
        complaintPercent: 0
      };
    }

    let totalRatingPoints = 0;
    let totalConfidence = 0;
    let totalAiScore = 0;
    let aiPoweredCount = 0;
    const themeCounts = {};
    const themeSentiments = {};

    reviews.forEach(r => {
      const rVal = r.sentiment === 'Positive' ? 5 : r.sentiment === 'Neutral' ? 3 : 1;
      totalRatingPoints += rVal;

      const confVal = r.confidence || (r.sentiment === 'Positive' ? 92 : r.sentiment === 'Neutral' ? 82 : 72);
      totalConfidence += confVal;

      if (r.aiPowered) {
        aiPoweredCount++;
        const scoreVal = r.overall_score || (r.sentiment === 'Positive' ? 95 : r.sentiment === 'Neutral' ? 78 : 65);
        totalAiScore += scoreVal;
      }

      if (r.theme) {
        themeCounts[r.theme] = (themeCounts[r.theme] || 0) + 1;
        if (!themeSentiments[r.theme]) {
          themeSentiments[r.theme] = { pos: 0, neg: 0, total: 0 };
        }
        themeSentiments[r.theme].total++;
        if (r.sentiment === 'Positive') themeSentiments[r.theme].pos++;
        if (r.sentiment === 'Negative') themeSentiments[r.theme].neg++;
      }
    });

    const total = reviews.length;
    const avgRating = (totalRatingPoints / total).toFixed(1);
    const avgConfidence = Math.round(totalConfidence / total);
    const avgAiScore = aiPoweredCount > 0 ? Math.round(totalAiScore / aiPoweredCount) : 0;

    const sortedThemes = Object.entries(themeCounts).sort((a, b) => b[1] - a[1]);
    const topTheme = sortedThemes[0] ? sortedThemes[0][0] : 'N/A';

    let mostPositiveArea = 'N/A';
    let bestPosRate = -1;
    let mostNegativeArea = 'N/A';
    let worstNegRate = -1;

    Object.entries(themeSentiments).forEach(([theme, s]) => {
      const posRate = s.pos / s.total;
      const negRate = s.neg / s.total;
      if (posRate > bestPosRate) {
        bestPosRate = posRate;
        mostPositiveArea = theme;
      }
      if (negRate > worstNegRate) {
        worstNegRate = negRate;
        mostNegativeArea = theme;
      }
    });

    let recommendation = "Focus on maintaining friendly and active communication with guests.";
    if (mostNegativeArea === 'Cleanliness') {
      recommendation = "Review housekeeping checklists and perform secondary audits during peak checkout times.";
    } else if (mostNegativeArea === 'Host') {
      recommendation = "Enhance guest check-in onboarding process and address recent reception hospitality comments.";
    } else if (mostNegativeArea === 'Food') {
      recommendation = "Audit breakfast service times and standard food quality controls to improve dining ratings.";
    } else if (mostNegativeArea === 'Location') {
      recommendation = "Provide soundproofing alternatives or room earplugs to counter noise complaints in outer rooms.";
    }

    const overallPositive = Math.round((reviews.filter(r => r.sentiment === 'Positive').length / total) * 100);
    const summary = overallPositive >= 70
      ? `Guest satisfaction is outstanding at ${overallPositive}% positive. ${topTheme} remains your highest driving core theme.`
      : `Guest feedback is mixed. Address recent pain points in ${mostNegativeArea || 'service'} to boost satisfaction scores.`;

    return {
      avgRating,
      avgConfidence,
      avgAiScore,
      summary,
      recommendation,
      topTheme,
      mostPositiveArea,
      mostNegativeArea
    };
  }, [reviews]);

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto animate-pulse">
        <Skeleton className="h-36 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-96 lg:col-span-2 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
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
      {/* Hero Welcome banner */}
      <Card className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden border-none shadow-2xl rounded-3xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-purple-500 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <Badge variant="purple" className="bg-blue-500/20 text-blue-300 border-blue-400/20 backdrop-blur-md">
              <Brain className="w-3.5 h-3.5" />
              AI Intelligence Suite Active
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight">Executive Dashboard</h1>
            <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed">
              {computedMetrics.summary}
            </p>
          </div>
          <button
            onClick={() => navigate('/user/analyze')}
            className="group flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl shadow-blue-600/25 transition-all flex-shrink-0 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Analyze New Feedback</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </Card>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={MessageSquare}
          color="blue"
          subtitle={stats.totalReviews > 0 ? `${stats.positiveReviews} Positive Reviews` : 'No reviews processed'}
        />

        <KPICard
          title="Average Rating"
          value={`${computedMetrics.avgRating} / 5.0`}
          icon={Star}
          color="amber"
          subtitle="Based on 5-point scale"
        />

        <KPICard
          title="AI Confidence Index"
          value={`${computedMetrics.avgConfidence}%`}
          icon={Target}
          color="emerald"
        >
          <div className="w-full mt-2">
            <Progress value={computedMetrics.avgConfidence} colorClass="bg-emerald-500" />
          </div>
        </KPICard>

        <KPICard
          title="AI Insights Score"
          value={`${computedMetrics.avgAiScore}%`}
          icon={Award}
          color="purple"
        >
          <div className="w-full mt-2">
            <Progress value={computedMetrics.avgAiScore} colorClass="bg-purple-500" />
          </div>
        </KPICard>
      </div>

      {/* Main Visualizations & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Recharts Analytics Area */}
        <div className="xl:col-span-2 space-y-8">
          <Card className="p-6">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Review Volume Trend</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Daily guest feedback ingestion frequency</p>
              </div>
              <Badge variant="primary">Last 7 Days</Badge>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="reviews" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorReviews)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6">Sentiment Distribution</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6">Topic Breakdown</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={themeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <XAxis dataKey="theme" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>

        {/* AI Recommendations & Feed */}
        <div className="space-y-8">
          <Card className="p-6 border-l-4 border-l-purple-600">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">AI Executive Recommendations</h3>
            </div>
            
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Issue Area</p>
                <Badge variant="danger" className="mt-1">{computedMetrics.mostNegativeArea}</Badge>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Highest Driving Theme</p>
                <Badge variant="success" className="mt-1">{computedMetrics.mostPositiveArea}</Badge>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 inline animate-pulse" /> Action Item
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-1.5">
                  {computedMetrics.recommendation}
                </p>
              </div>
            </div>
          </Card>

          {/* Activity Stream */}
          <Card className="p-6">
            <h3 className="text-md font-extrabold text-slate-900 dark:text-white mb-6">Recent Guest Activity</h3>
            <div className="space-y-4 overflow-y-auto max-h-[360px] pr-1 custom-scrollbar">
              {recentReviews.length === 0 ? (
                <p className="text-center text-xs text-slate-400 dark:text-slate-500 py-6 font-medium">No recent reviews analyzed.</p>
              ) : (
                recentReviews.map((item) => (
                  <div key={item._id} className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80 last:border-0 last:pb-0">
                    <span className="text-base mt-0.5">
                      {item.sentiment === 'Positive' ? '🟢' : item.sentiment === 'Negative' ? '🔴' : '🟡'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.theme || 'General'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recent'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate font-medium">
                        {item.review}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

      </div>
    </motion.div>
  );
}
