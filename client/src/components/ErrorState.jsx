import React from 'react';

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-dashed border-red-200 dark:border-red-900/50">
      <div className="w-20 h-20 mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 dark:text-red-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-red-600 dark:text-red-300/80 text-center max-w-sm mb-6 font-medium">
        {message || 'We encountered an unexpected error while fetching your reviews. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
