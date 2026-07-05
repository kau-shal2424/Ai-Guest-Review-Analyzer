import React from 'react';

const EmptyState = ({ searchQuery = '' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
      <div className="w-20 h-20 mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {searchQuery ? 'No reviews found' : 'No reviews yet'}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6 font-medium">
        {searchQuery 
          ? `We couldn't find any reviews matching "${searchQuery}". Try adjusting your search.`
          : 'It looks like there are no guest reviews available at the moment. Check back later!'}
      </p>
    </div>
  );
};

export default EmptyState;
