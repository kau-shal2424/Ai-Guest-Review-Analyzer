import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Lock, RefreshCw, Cpu, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { id: 0, label: 'Reading Review', icon: Cpu },
  { id: 1, label: 'Understanding Context', icon: Brain },
  { id: 2, label: 'Extracting Emotions', icon: Sparkles },
  { id: 3, label: 'Finding Topics', icon: Layers },
  { id: 4, label: 'Generating Business Insights', icon: Brain },
  { id: 5, label: 'Writing Professional Reply', icon: Sparkles },
  { id: 6, label: 'Preparing Report', icon: RefreshCw },
];

export default function AiLoadingAnimation() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8 flex flex-col items-center justify-center p-8 md:p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl relative overflow-hidden max-w-2xl mx-auto">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Center Orbit Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse rounded-full" />
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30 relative">
          <Sparkles className="w-10 h-10 text-white animate-spin-slow" />
        </div>
      </div>

      <div className="text-center w-full">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Analyzing Guest Review</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-6">Powered by Google Gemini AI</p>

        {/* Step Indicator */}
        <div className="max-w-md mx-auto space-y-3.5">
          {STEPS.map((step, idx) => {
            const isActive = idx === activeStep;
            const isCompleted = idx < activeStep;
            const IconComponent = step.icon;

            return (
              <div 
                key={step.id} 
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl border transition-all duration-300 ${
                  isActive 
                    ? 'bg-indigo-50/70 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400 font-bold scale-[1.02] shadow-sm'
                    : isCompleted
                    ? 'bg-slate-50/50 border-slate-100 text-slate-500 dark:bg-slate-800/20 dark:border-slate-800/40 dark:text-slate-500 font-medium'
                    : 'bg-transparent border-transparent text-slate-300 dark:text-slate-700 font-medium'
                }`}
              >
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${isActive ? 'bg-indigo-600 text-white animate-pulse' : isCompleted ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : 'bg-transparent text-slate-300 dark:text-slate-700'}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-sm">{step.label}</span>
                {isActive && (
                  <div className="ml-auto dot-pulse">
                    <span />
                    <span />
                    <span />
                  </div>
                )}
                {isCompleted && (
                  <span className="ml-auto text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold">Done</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
