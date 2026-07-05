import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Edit2, Trash2, Calendar, Hash, Tag, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReviewModal({ review, onClose, onEdit, onDelete }) {
  const [copiedReview, setCopiedReview] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (review) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [review]);

  if (!review) return null;

  const handleCopyReview = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(review.review || '');
    setCopiedReview(true);
    toast.success('Review copied to clipboard!');
    setTimeout(() => setCopiedReview(false), 2000);
  };

  const handleCopyResponse = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(review.response || '');
    setCopiedResponse(true);
    toast.success('Response copied to clipboard!');
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const sentimentColors = {
    Positive: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30',
    Neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400 border-gray-200 dark:border-gray-500/30',
    Negative: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30',
  };

  const sentimentClass = sentimentColors[review.sentiment] || sentimentColors.Neutral;

  const dateObj = review.createdAt ? new Date(review.createdAt) : null;
  const formattedDate = dateObj && !isNaN(dateObj) 
    ? dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Unknown Date';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in duration-300 ease-out">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
          <h2 id="modal-title" className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Review Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto px-6 py-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3 h-3" /> Sentiment
              </span>
              <span className={`inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-bold border ${sentimentClass}`}>
                {review.sentiment || 'Unknown'}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3 h-3" /> Theme
              </span>
              <span className="inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400">
                {review.theme || 'Unknown'}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Date
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {formattedDate}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3 h-3" /> ID
              </span>
              <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md truncate" title={review._id}>
                {review._id?.substring(0, 8)}...
              </span>
            </div>
          </div>

          {/* Guest Review Text */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Guest Review</h3>
              <button
                onClick={handleCopyReview}
                className="group flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors"
              >
                {copiedReview ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />}
                {copiedReview ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50">
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                "{review.review || "No review text available."}"
              </p>
            </div>
          </div>

          {/* AI Response Text */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                AI Suggested Response
              </h3>
              <button
                onClick={handleCopyResponse}
                className="group flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-3 py-1.5 rounded-full transition-colors"
              >
                {copiedResponse ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />}
                {copiedResponse ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-5 border border-indigo-100/50 dark:border-indigo-500/20 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap italic">
                {review.response || "No response generated."}
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800/80 backdrop-blur-md">
          <button
            onClick={() => {
              onDelete(review._id);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Review
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onEdit(review);
                onClose();
              }}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all active:scale-95"
            >
              <Edit2 className="w-4 h-4" />
              Edit Review
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
