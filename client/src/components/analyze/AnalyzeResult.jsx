import React, { useState } from 'react';
import { Copy, Check, Sparkles, Hash, Tag, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AnalyzeResult({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.response);
    setCopied(true);
    toast.success('Response copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30';
      case 'Negative': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30';
      default: return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
    }
  };

  const getSentimentDot = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return '🟢';
      case 'Negative': return '🔴';
      default: return '🟡';
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-500/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Analysis Complete</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Data successfully extracted and processed</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Processed
        </div>
      </div>

      {/* Grid Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-slate-100 dark:border-slate-800">
        
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Sentiment
          </span>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getSentimentColor(result.sentiment)}`}>
              {getSentimentDot(result.sentiment)} {result.sentiment}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            Core Theme
          </span>
          <div>
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/30 rounded-full text-sm font-bold">
              {result.theme}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5" />
            Analysis ID
          </span>
          <span className="text-sm font-mono text-slate-600 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-800 truncate" title={result.id}>
            {result.id || "N/A"}
          </span>
        </div>

      </div>

      {/* Suggested Response */}
      <div className="pt-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            AI Suggested Reply
          </span>
          <button
            onClick={handleCopy}
            className="group flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-3 py-1.5 rounded-full transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />}
            {copied ? 'Copied!' : 'Copy Reply'}
          </button>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 md:p-6 border border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
          <p className="text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed font-medium whitespace-pre-wrap">
            {result.response}
          </p>
        </div>
      </div>

    </div>
  );
}
