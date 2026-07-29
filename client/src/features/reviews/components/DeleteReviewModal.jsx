import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeleteReviewModal({ review, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (review) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [review]);

  if (!review) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm();
      toast.success('Review deleted successfully');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  const sentimentColors = {
    Positive: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300',
    Negative: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const sentimentClass = sentimentColors[review.sentiment] || sentimentColors.Neutral;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
          <h2 id="delete-modal-title" className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> Delete Review
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {/* Review preview */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-medium">"{review.review || 'No review text'}"</p>
          </div>

          {/* Badges */}
          <div className="flex gap-3">
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${sentimentClass}`}> {review.sentiment || 'Neutral'} </span>
            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              {review.theme || 'No theme'}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-red-600 via-red-500 to-pink-600 hover:from-red-500 hover:to-pink-500 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
