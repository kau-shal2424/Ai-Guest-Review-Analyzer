import React from 'react';
import { Sparkles, X, Wand2 } from 'lucide-react';

export default function AnalyzeInput({ 
  review, 
  setReview, 
  onAnalyze, 
  loading, 
  maxLength = 10000 
}) {

  const handleSample = () => {
    setReview("The room was incredibly clean and the host was very friendly. However, the location was a bit noisy at night. Overall, a great stay!");
  };

  const charCount = review.length;
  const isOverLimit = charCount > maxLength;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />
      
      <div className="flex justify-between items-center mb-4">
        <label htmlFor="review-input" className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <MessageIcon className="w-4 h-4 text-indigo-500" />
          Guest Review
        </label>
        
        <div className="flex gap-2">
          <button
            onClick={handleSample}
            disabled={loading}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Wand2 className="w-3 h-3" />
            Sample
          </button>
          {charCount > 0 && (
            <button
              onClick={() => setReview("")}
              disabled={loading}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          id="review-input"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          disabled={loading}
          placeholder="Paste or type a guest review here to extract sentiment, themes, and generate an AI response..."
          className={`w-full h-48 md:h-56 p-5 bg-slate-50 dark:bg-slate-950 border ${isOverLimit ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-2xl resize-none outline-none focus:ring-4 transition-all text-slate-700 dark:text-slate-300 placeholder:text-slate-400 leading-relaxed font-medium`}
        />
        
        <div className="absolute bottom-4 right-4 flex items-center gap-4">
          <span className={`text-xs font-semibold ${isOverLimit ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
            {charCount} / {maxLength}
          </span>
          
          <button
            onClick={onAnalyze}
            disabled={loading || charCount === 0 || isOverLimit}
            className="group relative flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 overflow-hidden"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <span className="relative z-10">Analyze</span>
                <Sparkles className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
