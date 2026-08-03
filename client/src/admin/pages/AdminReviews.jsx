import React, { useState, useEffect, useCallback } from 'react';
import { fetchAllReviews } from '../services/admin';
import {
  Search, ChevronLeft, ChevronRight, Trash2, Eye,
  MessageSquare, ThumbsUp, ThumbsDown, MinusCircle, Star, Sparkles, Calendar
} from 'lucide-react';
import Loader from '../../shared/ui/Loader';
import { showError, showSuccess } from '../../shared/ui';
import axios from 'axios';

const SENTIMENT_COLOR = {
  Positive: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40',
  Negative: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/40',
  Neutral: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40',
};

const SENTIMENT_ICON = {
  Positive: <ThumbsUp className="w-3.5 h-3.5" />,
  Negative: <ThumbsDown className="w-3.5 h-3.5" />,
  Neutral: <MinusCircle className="w-3.5 h-3.5" />,
};

export default function AdminReviews() {
  const [data, setData] = useState({ reviews: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (sentiment) params.sentiment = sentiment;
      const result = await fetchAllReviews(params);
      setData(result);
    } catch (err) {
      showError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  }, [page, search, sentiment]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/reviews/${deleteTarget._id}`);
      showSuccess('Review deleted successfully.');
      setDeleteTarget(null);
      load();
    } catch {
      showError('Failed to delete review.');
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, load]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Guest Reviews</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            System-wide review intelligence & response management — {data.total} total reviews
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user, review text, theme, or sentiment..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <select
          value={sentiment}
          onChange={e => { setSentiment(e.target.value); setPage(1); }}
          className="px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">All Sentiments</option>
          <option value="Positive">Positive</option>
          <option value="Neutral">Neutral</option>
          <option value="Negative">Negative</option>
        </select>
      </div>

      {/* Table & Custom Empty State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader size="lg" />
        </div>
      ) : data.reviews.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-xs">
          <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Guest Reviews Available</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search || sentiment ? `No reviews matched your search criteria ("${search || sentiment}")` : "No guest reviews have been submitted to the platform yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Review</th>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">AI Rating</th>
                  <th className="px-5 py-3.5">Sentiment</th>
                  <th className="px-5 py-3.5">Theme</th>
                  <th className="px-5 py-3.5">AI Confidence</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {data.reviews.map(rev => (
                  <tr key={rev._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 max-w-xs">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">{rev.review}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-xs flex-shrink-0">
                          {rev.userInfo?.fullName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{rev.userInfo?.fullName || 'Unknown'}</p>
                          <p className="text-[11px] text-slate-400 truncate">{rev.userInfo?.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {rev.detected_rating != null ? (
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {rev.detected_rating}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${SENTIMENT_COLOR[rev.sentiment] || SENTIMENT_COLOR.Neutral}`}>
                        {SENTIMENT_ICON[rev.sentiment]}
                        {rev.sentiment || 'Neutral'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {rev.theme || 'General'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-violet-500" />
                        {rev.confidence != null ? `${rev.confidence}%` : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelected(rev)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors cursor-pointer"
                          title="View Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(rev)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Page {page} of {data.totalPages} · {data.total} total reviews
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4 z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Review Detail &amp; Metadata</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 cursor-pointer">✕</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center font-bold text-violet-600 dark:text-violet-400 text-sm">
                  {selected.userInfo?.fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{selected.userInfo?.fullName || 'Unknown'}</p>
                  <p className="text-xs text-slate-500">{selected.userInfo?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  <p className="text-slate-400 font-medium">AI Detected Rating</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selected.detected_rating != null ? (
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {selected.detected_rating} / 5
                      </span>
                    ) : '—'}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  <p className="text-slate-400 font-medium">AI Confidence</p>
                  <p className="font-bold text-violet-600 dark:text-violet-400 mt-0.5">
                    {selected.confidence != null ? `${selected.confidence}%` : '—'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 mb-1">Guest Review Content</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{selected.review}</p>
              </div>

              {selected.response && (
                <div className="bg-violet-50 dark:bg-violet-950/20 rounded-xl p-4 border border-violet-100 dark:border-violet-900/40 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-violet-600 dark:text-violet-400">Gemini AI Generated Response</p>
                    {selected.confidence != null && (
                      <span className="text-[10px] font-bold text-violet-500">Confidence: {selected.confidence}%</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{selected.response}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 text-xs pt-1">
                <span className={`px-2.5 py-1 rounded-full font-semibold border ${SENTIMENT_COLOR[selected.sentiment] || ''}`}>{selected.sentiment}</span>
                <span className="px-2.5 py-1 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{selected.theme}</span>
                <span className="px-2.5 py-1 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">{new Date(selected.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4 z-10">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Delete Guest Review</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to permanently delete this review? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 disabled:opacity-60 transition-colors cursor-pointer">
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
