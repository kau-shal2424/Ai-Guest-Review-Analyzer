import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { MessageSquare, ThumbsUp, ThumbsDown, MinusCircle } from 'lucide-react';
import { fetchReviews } from "../api/reviews";
import StatCard from "../components/dashboard/StatCard";
import { SentimentPieChart, ThemeBarChart } from "../components/dashboard/Charts";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import InsightsPanel from "../components/dashboard/InsightsPanel";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import ErrorState from "../components/ErrorState";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsRes, reviewsData] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/dashboard"),
        fetchReviews()
      ]);

      setStats(statsRes.data);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Compute data for Recharts based on stats and reviews
  const pieData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Positive', value: stats.positive || 0 },
      { name: 'Neutral', value: stats.neutral || 0 },
      { name: 'Negative', value: stats.negative || 0 }
    ];
  }, [stats]);

  const barData = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    const themes = {};
    reviews.forEach(r => {
      if (r.theme) {
        themes[r.theme] = (themes[r.theme] || 0) + 1;
      }
    });
    return Object.entries(themes).map(([theme, count]) => ({ theme, count }));
  }, [reviews]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 pt-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
           <ErrorState message={error} onRetry={loadDashboardData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 space-y-8">
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Welcome back. Here's what's happening with your guest reviews today.
            </p>
          </div>
          <div className="text-sm font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Reviews" 
            value={stats.totalReviews} 
            icon={MessageSquare} 
            colorClass="text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400"
          />
          <StatCard 
            title="Positive Feedback" 
            value={stats.positive} 
            icon={ThumbsUp} 
            colorClass="text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400"
            trend={12} // Example static trend
          />
          <StatCard 
            title="Neutral Feedback" 
            value={stats.neutral} 
            icon={MinusCircle} 
            colorClass="text-amber-500 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400"
          />
          <StatCard 
            title="Negative Feedback" 
            value={stats.negative} 
            icon={ThumbsDown} 
            colorClass="text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400"
            trend={-5} // Example static trend
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Charts Column */}
          <div className="xl:col-span-2 space-y-8">
            {/* Sentiment Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sentiment Distribution</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Breakdown of positive, neutral, and negative reviews</p>
              </div>
              <SentimentPieChart data={pieData} />
            </div>

            {/* Themes Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Topics & Themes</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Most frequently mentioned topics in your reviews</p>
              </div>
              <ThemeBarChart data={barData} />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* AI Insights Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Insights</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Auto-generated summary</p>
                </div>
              </div>
              <InsightsPanel reviews={reviews} stats={stats} />
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="mb-6 flex-shrink-0">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Latest guest feedback</p>
              </div>
              <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                <ActivityFeed reviews={reviews} />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}