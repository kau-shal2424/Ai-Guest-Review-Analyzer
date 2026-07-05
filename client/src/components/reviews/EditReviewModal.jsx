import React, { useEffect, useState } from 'react';
import { X, Check, Copy, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateReview } from '../../api/reviews';

export default function EditReviewModal({ review, onClose, onUpdate }) {
  const [text, setText] = useState(review ? review.review : '');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync when review changes
  useEffect(() => {
    if (review) {
      setText(review.review ?? '');
    }
  }, [review]);

  // ESC key & body scroll lock
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    if (review) document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [review, onClose]);

  if (!review) return null;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Review copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!text.trim()) {
      toast.error('Review cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const updated = await updateReview(review._id, { review: text.trim() });
      toast.success('Review updated successfully');
      if (onUpdate) onUpdate(updated);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      aria-labelledby="edit-modal-title"
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
      <div className="relative w-full max-w-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
          <h2 id="edit-modal-title" className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Edit Review
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
          <div className="flex items-center justify-between">
            <label htmlFor="review-text" className="text-sm font-medium text-slate-800 dark:text-slate-200">Guest Review</label>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            id="review-text"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`ml-3 flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
