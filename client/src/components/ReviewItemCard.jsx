import React from 'react';

const ReviewItemCard = ({ review, onDelete, onEdit, onCardClick }) => {
  const {
    _id,
    review: review_text,
    sentiment,
    theme,
    response: suggested_response,
    createdAt: created_at,
  } = review;

  const sentimentColors = {
    Positive: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300',
    Negative: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  // Determine sentiment dynamically or fallback to neutral
  const sentimentClass = sentimentColors[sentiment] || sentimentColors.Neutral;
  
  // Format Date
  const dateObj = created_at ? new Date(created_at) : null;
  const formattedDate = dateObj && !isNaN(dateObj) 
    ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Unknown Date';

  return (
    <div 
      className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col gap-4 border border-slate-100 dark:border-slate-800/80 group cursor-pointer"
      data-id={_id}
      onClick={() => onCardClick(review)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCardClick(review);
        }
      }}
    >
      {/* Header: Badges & Date */}
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div className="flex gap-2">
          {sentiment && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-transparent ${sentimentClass} dark:border-current`}>
              {sentiment}
            </span>
          )}
          {theme && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              {theme}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {formattedDate}
        </span>
      </div>

      {/* Review Text */}
      <div className="flex-1 mt-2">
        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium line-clamp-4">
          "{review_text || "No review text provided."}"
        </p>
      </div>

      {/* Footer Actions (Quick actions visible on hover) */}
      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus-within:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(review);
          }}
          className="text-sm font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors px-4 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(_id);
          }}
          className="text-sm font-bold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ReviewItemCard;
