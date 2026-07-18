import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchReviews } from '../api/reviews';

/**
 * Fetches all dashboard data in a single call.
 * Combines /api/dashboard stats with user reviews.
 */
export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, reviewsData] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard`),
        fetchReviews(),
      ]);
      setStats(statsRes.data);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error('useDashboard error:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Derived sentiment distribution
  const sentimentData = stats ? [
    { name: 'Positive', value: stats.positive || 0, color: '#10b981' },
    { name: 'Neutral', value: stats.neutral || 0, color: '#f59e0b' },
    { name: 'Negative', value: stats.negative || 0, color: '#f43f5e' },
  ] : [];

  // Derived theme distribution from reviews
  const themeData = (() => {
    const themes = {};
    reviews.forEach(r => {
      if (r.theme) themes[r.theme] = (themes[r.theme] || 0) + 1;
    });
    return Object.entries(themes)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count);
  })();

  // Derived recent reviews (last 5)
  const recentReviews = [...reviews]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Positive rate
  const positiveRate = stats && stats.totalReviews > 0
    ? Math.round((stats.positive / stats.totalReviews) * 100)
    : 0;

  // Review trend (last 7 days)
  const trendData = (() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = d.toISOString().split('T')[0];
      const count = reviews.filter(r => {
        const created = r.createdAt ? r.createdAt.split('T')[0] : '';
        return created === dateStr;
      }).length;
      days.push({ day: label, reviews: count });
    }
    return days;
  })();

  return {
    stats,
    reviews,
    loading,
    error,
    reload: load,
    sentimentData,
    themeData,
    recentReviews,
    positiveRate,
    trendData,
  };
}
