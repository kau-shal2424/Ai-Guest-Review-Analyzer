import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 flex flex-col gap-4 border border-slate-100 dark:border-slate-800/80 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
      </div>

      {/* Review Text Skeleton */}
      <div className="flex-1 mt-2 space-y-2">
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        <div className="h-4 w-4/6 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
      </div>

      {/* Suggested Response Skeleton */}
      <div className="mt-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
        <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded-md mb-3"></div>
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-md mb-2"></div>
        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
