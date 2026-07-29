import React, { useState, useEffect } from 'react';

const useCountUp = (end, duration = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
};

export default function StatCard({ title, value, icon: Icon, trend, colorClass }) {
  const animatedValue = useCountUp(value);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/5 transition-all duration-300 group flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </h3>
        <div className={`p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:scale-110 transition-transform duration-300 ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className={`text-4xl font-extrabold tracking-tight ${colorClass.split(' ')[0]}`}>
          {animatedValue}
        </p>
        {trend && (
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
            <span className={trend > 0 ? "text-green-500" : "text-red-500"}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>{' '}
            from last month
          </p>
        )}
      </div>
    </div>
  );
}
