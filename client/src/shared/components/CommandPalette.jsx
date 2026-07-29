import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, Sparkles, BookOpen, Brain, BarChart3, Settings, User, HelpCircle, X } from 'lucide-react';

const COMMANDS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Go to Dashboard', to: '/user/dashboard', category: 'Navigate' },
  { id: 'analyze', icon: Sparkles, label: 'Analyze a Review', to: '/user/analyze', category: 'Navigate' },
  { id: 'reviews', icon: BookOpen, label: 'My Reviews', to: '/user/reviews', category: 'Navigate' },
  { id: 'insights', icon: Brain, label: 'AI Insights', to: '/user/insights', category: 'Navigate' },
  { id: 'reports', icon: BarChart3, label: 'Reports', to: '/user/reports', category: 'Navigate' },
  { id: 'settings', icon: Settings, label: 'Settings', to: '/user/settings', category: 'Account' },
  { id: 'profile', icon: User, label: 'Profile', to: '/user/profile', category: 'Account' },
  { id: 'help', icon: HelpCircle, label: 'Help Center', to: '/user/help', category: 'Support' },
];

export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  const handleSelect = useCallback((to) => {
    navigate(to);
    onClose();
    setQuery('');
  }, [navigate, onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Reset query when opened
  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/30 overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search pages, actions..."
                className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
              />
              <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-3">
                  <p className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                    {category}
                  </p>
                  {items.map(cmd => (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd.to)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors text-left"
                    >
                      <cmd.icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      {cmd.label}
                    </button>
                  ))}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                  No results for "{query}"
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              <span><kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">↑↓</kbd> navigate</span>
              <span><kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">↵</kbd> select</span>
              <span><kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">Esc</kbd> close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
