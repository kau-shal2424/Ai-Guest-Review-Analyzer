import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, MessageSquare, ThumbsUp, ThumbsDown, MinusCircle, 
  ArrowRight, Brain, Zap, Target, Star, ShieldAlert, Award, TrendingUp, BarChart2
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { Card, Badge, Progress, Skeleton, KPICard } from '../../../shared/ui';
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

  // Advanced metrics calculation
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

  // Updated Airbnb Palette for Pie chart
  const airbnbSentimentData = useMemo(() => {
    return sentimentData.map(item => ({
      ...item,
      color: item.name === 'Positive' ? '#00A699' : item.name === 'Negative' ? '#D93025' : '#FFB400'
    }));
  }, [sentimentData]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto font-sans text-left"
    >
      {/* Hero Welcome Banner — Clean White Card */}
      <Card className="p-6 bg-white dark:bg-[#222222] border border-[#EBEBEB] dark:border-[#333333] shadow-[0_2px_16px_rgba(0,0,0,0.08)] rounded-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0F3] border border-[#FFCCD5] text-[#FF385C] text-xs font-semibold">
              <Brain className="w-3.5 h-3.5" />
              <span>Hospitality Intelligence Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] dark:text-white tracking-tight">
              Executive Dashboard
            </h1>
            <p className="text-[#717171] text-xs sm:text-sm font-normal leading-relaxed">
              {computedMetrics.summary}
            </p>
          </div>

          <button
            onClick={() => navigate('/user/analyze')}
            className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-[0_2px_8px_rgba(255,56,92,0.3)] transition-all flex-shrink-0 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze New Feedback</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </Card>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={MessageSquare}
          color="rose"
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
          color="teal"
        >
          <div className="w-full mt-2">
            <Progress value={computedMetrics.avgConfidence} colorClass="bg-[#00A699]" />
          </div>
        </KPICard>

        <KPICard
          title="AI Insights Score"
          value={`${computedMetrics.avgAiScore}%`}
          icon={Award}
          color="rose"
        >
          <div className="w-full mt-2">
            <Progress value={computedMetrics.avgAiScore} colorClass="bg-[#FF385C]" />
          </div>
        </KPICard>
      </div>

      {/* Main Visualizations & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recharts Analytics Area */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-5">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-[#222222] dark:text-white">Review Volume Trend</h3>
                <p className="text-xs text-[#717171]">Daily guest feedback ingestion frequency</p>
              </div>
              <Badge variant="secondary">Last 7 Days</Badge>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF385C" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#FF385C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEBEB" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#717171', fontSize: 11, fontWeight: 500 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#717171', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #EBEBEB', boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }} />
                  <Area type="monotone" dataKey="reviews" stroke="#FF385C" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReviews)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5">
              <h3 className="text-base font-extrabold text-[#222222] dark:text-white mb-4">Sentiment Distribution</h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={airbnbSentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {airbnbSentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #EBEBEB' }} />
                    <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 500 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-base font-extrabold text-[#222222] dark:text-white mb-4">Topic Breakdown</h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={themeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEBEB" />
                    <XAxis dataKey="theme" axisLine={false} tickLine={false} tick={{ fill: '#717171', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#717171', fontSize: 11 }} />
                    <Tooltip cursor={{ fill: '#F7F7F7' }} contentStyle={{ borderRadius: '8px', border: '1px solid #EBEBEB' }} />
                    <Bar dataKey="count" fill="#222222" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>

        {/* AI Recommendations & Feed */}
        <div className="space-y-6">
          <Card className="p-5 border-l-4 border-l-[#FF385C]">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-full bg-[#FFF0F3] text-[#FF385C]">
                <Brain className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-[#222222] dark:text-white">AI Recommendations</h3>
            </div>
            
            <div className="space-y-3 text-xs font-normal">
              <div>
                <p className="text-[10px] font-semibold text-[#717171] uppercase tracking-wider">Top Priority Issue Area</p>
                <Badge variant="danger" className="mt-1">{computedMetrics.mostNegativeArea}</Badge>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-[#717171] uppercase tracking-wider">Highest Satisfaction Theme</p>
                <Badge variant="success" className="mt-1">{computedMetrics.mostPositiveArea}</Badge>
              </div>

              <div className="pt-2 border-t border-[#EBEBEB] dark:border-[#333333]">
                <p className="text-[10px] font-semibold text-[#FF385C] uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 inline" /> Recommended Action
                </p>
                <p className="text-xs text-[#717171] dark:text-gray-300 font-normal leading-relaxed mt-1">
                  {computedMetrics.recommendation}
                </p>
              </div>
            </div>
          </Card>

          {/* Activity Stream */}
          <Card className="p-5">
            <h3 className="text-sm font-extrabold text-[#222222] dark:text-white mb-4">Recent Guest Reviews</h3>
            <div className="space-y-3 overflow-y-auto max-h-[320px] pr-1 custom-scrollbar">
              {recentReviews.length === 0 ? (
                <p className="text-center text-xs text-[#717171] py-6 font-normal">No recent reviews analyzed.</p>
              ) : (
                recentReviews.map((item) => (
                  <div key={item._id} className="flex items-start gap-2.5 pb-2.5 border-b border-[#EBEBEB] dark:border-[#333333] last:border-0 last:pb-0">
                    <span className="text-xs mt-0.5">
                      {item.sentiment === 'Positive' ? '🟢' : item.sentiment === 'Negative' ? '🔴' : '🟡'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs font-bold text-[#222222] dark:text-white truncate">
                          {item.theme || 'General'}
                        </span>
                        <span className="text-[10px] text-[#717171]">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recent'}
                        </span>
                      </div>
                      <p className="text-xs text-[#717171] dark:text-gray-300 mt-0.5 truncate font-normal">
                        "{item.review}"
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
