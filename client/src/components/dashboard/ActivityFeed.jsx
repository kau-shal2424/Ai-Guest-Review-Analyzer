import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';

export default function ActivityFeed({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400">
        <MessageSquare className="w-10 h-10 mb-3 opacity-20" />
        <p className="text-sm font-medium">No recent activity</p>
      </div>
    );
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30';
      case 'Negative': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30';
      default: return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {reviews.slice(0, 5).map((review) => (
        <div key={review._id} className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-[-24px] last:before:hidden before:w-px before:bg-slate-200 dark:before:bg-slate-800">
          <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 shadow-sm z-10" />
          
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getSentimentColor(review.sentiment)}`}>
                {review.sentiment}
              </span>
              <div className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-medium">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(review.createdAt)}
              </div>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium line-clamp-2">
              "{review.review}"
            </p>
            {review.theme && (
              <div className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-500/10 inline-block px-2 py-1 rounded-md">
                Topic: {review.theme}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
