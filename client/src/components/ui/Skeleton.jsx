import React from 'react';

export default function Skeleton({ 
  className = '', 
  circle = false 
}) {
  return (
    <div 
      className={`
        shimmer 
        ${circle ? 'rounded-full' : 'rounded-xl'} 
        bg-slate-200 dark:bg-slate-800
        ${className}
      `}
    />
  );
}
