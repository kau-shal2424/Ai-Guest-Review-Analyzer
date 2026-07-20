import React, { useMemo } from 'react';
import { useReviews } from '../hooks/useReviews';
import { Card, Badge, Progress, Skeleton } from '../../components/ui';
import { 
  Brain, TrendingUp, Sparkles, Award, AlertTriangle, 
  BarChart, Zap, HelpCircle, ArrowUpRight, Smile 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

export default function AIInsights() {
  const { reviews, loading } = useReviews();

  // Dynamic calculations from real review data
  const biData = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        posRate: 0,
        radarData: [],
        praises: ["N/A"],
        complaints: ["N/A"],
        weeklySummary: "Gathering more reviews data to generate weekly summaries.",
        monthlySummary: "Gathering more reviews data to generate monthly summaries.",
        recommendations: ["Create an analysis list to get custom suggestions."],
        topKeywords: [],
        mostImproved: "N/A",
        leastPerforming: "N/A"
      };
    }

    const total = reviews.length;
    const pos = reviews.filter(r => r.sentiment === 'Positive').length;
    const neg = reviews.filter(r => r.sentiment === 'Negative').length;
    const neu = reviews.filter(r => r.sentiment === 'Neutral').length;
    const posRate = Math.round((pos / total) * 100);

    // 1. Polar Radar chart data for emotions
    const radarData = [
      { subject: 'Satisfaction', A: posRate, fullMark: 100 },
      { subject: 'Attention', A: Math.round((neg / total) * 100), fullMark: 100 },
      { subject: 'Stability', A: Math.round((neu / total) * 100), fullMark: 100 },
      { subject: 'Fidelity', A: Math.min(100, posRate + 5), fullMark: 100 },
      { subject: 'Engagement', A: Math.round((reviews.filter(r => r.aiPowered).length / total) * 100), fullMark: 100 },
    ];

    // 2. Count themes and extract positive/negative mentions
    const themeSentiments = {};
    const words = {};
    const praises = [];
    const complaints = [];

    reviews.forEach(r => {
      // Grouping sentiments per theme
      if (r.theme) {
        if (!themeSentiments[r.theme]) {
          themeSentiments[r.theme] = { pos: 0, neg: 0, total: 0 };
        }
        themeSentiments[r.theme].total++;
        if (r.sentiment === 'Positive') themeSentiments[r.theme].pos++;
        if (r.sentiment === 'Negative') themeSentiments[r.theme].neg++;
      }

      // Keyword cloud counting (excluding simple words)
      const stopWords = new Set(["the", "and", "was", "wasn't", "a", "of", "to", "in", "is", "for", "with", "but", "very", "great", "room", "stay"]);
      const rawWords = r.review?.toLowerCase()?.match(/\b[a-z]{3,}\b/g) || [];
      rawWords.forEach(w => {
        if (!stopWords.has(w)) {
          words[w] = (words[w] || 0) + 1;
        }
      });

      // Quick quotes lists
      if (r.sentiment === 'Positive' && praises.length < 3) {
        praises.push(r.review);
      }
      if (r.sentiment === 'Negative' && complaints.length < 3) {
        complaints.push(r.review);
      }
    });

    const topKeywords = Object.entries(words)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    // Determine performance categories
    let mostImproved = "Cleanliness";
    let leastPerforming = "Host";
    let highestPosRate = -1;
    let highestNegRate = -1;

    Object.entries(themeSentiments).forEach(([theme, stats]) => {
      const pRate = stats.pos / stats.total;
      const nRate = stats.neg / stats.total;
      if (pRate > highestPosRate) {
        highestPosRate = pRate;
        mostImproved = theme;
      }
      if (nRate > highestNegRate) {
        highestNegRate = nRate;
        leastPerforming = theme;
      }
    });

    // 3. Actionable lists
    const recommendations = [];
    if (leastPerforming === 'Cleanliness') {
      recommendations.push("Housekeeping deep-clean schedules should be optimized for check-in hours.");
      recommendations.push("Provide secondary inspections for high-value suite bathrooms.");
    } else if (leastPerforming === 'Host') {
      recommendations.push("Launch front desk greeting review protocols to elevate check-in scores.");
      recommendations.push("Provide staff feedback training options covering difficult host situations.");
    } else {
      recommendations.push("Implement guest response workflows to reduce reply delays below 12 hours.");
      recommendations.push("Maintain current cleaning standards to safeguard baseline ratings.");
    }

    const weeklySummary = `Guest ratings peaked this week around ${mostImproved}. Maintain active focus on resolving recent ${leastPerforming} items.`;
    const monthlySummary = `Overall guest satisfaction index is stable at ${posRate}%. Action items on ${leastPerforming} are recommended to improve monthly repeat rates.`;

    return {
      posRate,
      radarData,
      praises: praises.length > 0 ? praises : ["No positive feedback quotes available yet."],
      complaints: complaints.length > 0 ? complaints : ["No negative feedback quotes available yet."],
      weeklySummary,
      monthlySummary,
      recommendations,
      topKeywords,
      mostImproved,
      leastPerforming
    };
  }, [reviews]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">AI Insights</h1>
        <p className="text-slate-500 dark:text-slate-400 text-[15px] font-medium">
          Deep customer intelligence dynamically derived from your guest reviews.
        </p>
      </div>

      {/* Overview Satisfaction Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gauge Card */}
        <Card className="p-6 flex flex-col justify-between border-l-4 border-l-indigo-600">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Satisfaction</span>
              <Smile className="w-5 h-5 text-indigo-500" />
            </div>
            <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{biData.posRate}%</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Based on the positive sentiment percentage across all analyzed feedback items.
            </p>
          </div>
          <div className="mt-6">
            <Progress value={biData.posRate} colorClass="bg-indigo-600" />
          </div>
        </Card>

        {/* Categories Performance Card */}
        <Card className="p-6 flex flex-col justify-between border-l-4 border-l-emerald-500">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Performing Category</span>
              <Award className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">{biData.mostImproved}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Theme with the highest ratio of positive mentions.
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Least Performing Area:</span>
            <Badge variant="danger">{biData.leastPerforming}</Badge>
          </div>
        </Card>

        {/* Radar Map Card */}
        <Card className="p-6 flex flex-col justify-between border-l-4 border-l-purple-500">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engagement & Quality</span>
              <Brain className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">AI Guided Index</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Quality indexes mapped dynamically from AI analysis.
            </p>
          </div>
          <div className="mt-6 flex justify-between items-center text-xs text-slate-400">
            <span>Keyword Focus:</span>
            <div className="flex gap-1 flex-wrap justify-end">
              {biData.topKeywords.slice(0, 3).map((kw, i) => <Badge key={i} variant="primary">{kw}</Badge>)}
            </div>
          </div>
        </Card>

      </div>

      {/* Main Analysis Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Radar Radar Plot */}
        <Card className="p-6 xl:col-span-2">
          <h3 className="text-md font-bold text-slate-900 dark:text-white mb-6">AI Index Radar Profile</h3>
          <div className="h-80 w-full flex items-center justify-center">
            {biData.radarData.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold">No profile data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" radius="80%" data={biData.radarData}>
                  <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-850" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                  <Radar name="Index" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* AI Recommendations */}
        <Card className="p-6">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Zap className="w-4.5 h-4.5 animate-bounce" />
            </div>
            <h3 className="text-md font-bold text-slate-900 dark:text-white">Actionable Recommendations</h3>
          </div>

          <ul className="space-y-4">
            {biData.recommendations.map((rec, i) => (
              <li key={i} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                {rec}
              </li>
            ))}
          </ul>
        </Card>

      </div>

      {/* Periodic Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-sm font-bold text-indigo-600 uppercase mb-3.5 flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> Weekly Performance Summary</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">{biData.weeklySummary}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-bold text-purple-600 uppercase mb-3.5 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Monthly Business Intelligence</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">{biData.monthlySummary}</p>
        </Card>
      </div>

      {/* Customer voice quotes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <Card className="p-6">
          <h3 className="text-sm font-bold text-emerald-600 uppercase mb-4 flex items-center gap-1.5">👍 Guest Praises</h3>
          <div className="space-y-3.5">
            {biData.praises.map((p, idx) => (
              <div key={idx} className="p-3 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/30 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{p}"
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-bold text-rose-600 uppercase mb-4 flex items-center gap-1.5">👎 Guest Complaints</h3>
          <div className="space-y-3.5">
            {biData.complaints.map((c, idx) => (
              <div key={idx} className="p-3 bg-rose-50/20 dark:bg-rose-950/10 border border-rose-100/30 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{c}"
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
}


