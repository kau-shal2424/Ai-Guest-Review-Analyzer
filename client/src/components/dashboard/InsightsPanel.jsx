import React, { useMemo } from 'react';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function InsightsPanel({ reviews, stats }) {
  const insights = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];

    const recentReviews = reviews.slice(0, 10); // Look at last 10 for trends
    const themes = {};
    let recentPositives = 0;
    let recentNegatives = 0;

    recentReviews.forEach(r => {
      if (r.theme) {
        themes[r.theme] = (themes[r.theme] || 0) + 1;
      }
      if (r.sentiment === 'Positive') recentPositives++;
      if (r.sentiment === 'Negative') recentNegatives++;
    });

    const topThemeEntry = Object.entries(themes).sort((a, b) => b[1] - a[1])[0];
    const topTheme = topThemeEntry ? topThemeEntry[0] : null;
    const topThemeCount = topThemeEntry ? topThemeEntry[1] : 0;

    const generatedInsights = [];

    // Insight 1: General Sentiment Trend
    const positiveRatio = recentPositives / recentReviews.length;
    if (positiveRatio >= 0.7) {
      generatedInsights.push({
        id: 'sentiment-high',
        icon: TrendingUp,
        color: 'text-green-500 bg-green-50 dark:bg-green-500/10',
        title: 'Strong Positive Momentum',
        description: `Guests are loving their stay! ${Math.round(positiveRatio * 100)}% of recent feedback is positive.`
      });
    } else if (recentNegatives / recentReviews.length >= 0.3) {
      generatedInsights.push({
        id: 'sentiment-low',
        icon: AlertCircle,
        color: 'text-red-500 bg-red-50 dark:bg-red-500/10',
        title: 'Attention Needed',
        description: `Negative feedback is trending upwards in the latest reviews. Keep an eye on recent complaints.`
      });
    } else {
      generatedInsights.push({
        id: 'sentiment-stable',
        icon: CheckCircle2,
        color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10',
        title: 'Stable Performance',
        description: 'Guest satisfaction is stable with a balanced mix of reviews.'
      });
    }

    // Insight 2: Top Theme
    if (topTheme && topThemeCount >= 3) {
      generatedInsights.push({
        id: 'top-theme',
        icon: Sparkles,
        color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10',
        title: 'Trending Topic',
        description: `"${topTheme}" is frequently mentioned right now (${topThemeCount} times in recent reviews).`
      });
    }

    // Insight 3: Quick Stat
    if (stats && stats.totalReviews > 0) {
      const overallPositive = Math.round((stats.positive / stats.totalReviews) * 100);
      if (overallPositive) {
         generatedInsights.push({
          id: 'overall-stat',
          icon: CheckCircle2,
          color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
          title: 'Overall Satisfaction',
          description: `Your all-time positive feedback rate stands at ${overallPositive}%.`
        });
      }
    }

    return generatedInsights;
  }, [reviews, stats]);

  if (insights.length === 0) {
    return (
      <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 text-center">
        <Sparkles className="w-8 h-8 mx-auto text-indigo-300 mb-2" />
        <p className="text-sm text-indigo-700 dark:text-indigo-400 font-medium">Gathering more data to generate insights...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {insights.slice(0, 3).map((insight) => {
        const Icon = insight.icon;
        return (
          <div key={insight.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:bg-white hover:shadow-sm dark:hover:bg-slate-800">
            <div className={`p-2.5 rounded-xl h-fit ${insight.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {insight.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {insight.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
