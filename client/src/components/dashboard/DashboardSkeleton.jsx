import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 pt-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        {/* Hero Skeleton */}
        <div className="space-y-4">
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-6 w-96 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 h-32 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
              </div>
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            </div>
          ))}
        </div>

        {/* Charts & Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 h-96 rounded-3xl border border-slate-100 dark:border-slate-800 p-6">
              <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md mb-6"></div>
              <div className="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-2xl"></div>
            </div>
            <div className="bg-white dark:bg-slate-900 h-96 rounded-3xl border border-slate-100 dark:border-slate-800 p-6">
              <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md mb-6"></div>
              <div className="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-2xl"></div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 h-80 rounded-3xl border border-slate-100 dark:border-slate-800 p-6">
              <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-md mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 h-80 rounded-3xl border border-slate-100 dark:border-slate-800 p-6">
              <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded-md mb-6"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-12 w-1 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                      <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
