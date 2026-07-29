import React from 'react';

export default function Card({ 
  children, 
  className = '', 
  elevated = false, 
  hoverable = false, 
  onClick 
}) {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white dark:bg-slate-900 
        rounded-2xl border border-slate-100 dark:border-slate-800/80
        transition-all duration-300
        ${elevated ? 'shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50' : 'shadow-sm'}
        ${hoverable ? 'hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700/80 hover:-translate-y-0.5 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
