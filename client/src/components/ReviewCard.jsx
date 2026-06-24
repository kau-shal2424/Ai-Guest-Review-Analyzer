export default function ReviewCard({
  title,
  description,
  icon,
  badge,
  buttonText = "Learn More",
  onClick,
}) {
  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 shadow-md hover:shadow-xl dark:hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 overflow-hidden">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-violet-500/0 group-hover:from-indigo-500/[0.03] group-hover:to-violet-500/[0.03] transition-all duration-300 rounded-3xl pointer-events-none" />

      {/* Icon */}
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
          {icon}
        </div>
      )}

      {/* Badge */}
      {badge && (
        <span className="self-start text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
          {badge}
        </span>
      )}

      <div className="flex-1 flex flex-col gap-2">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
          {title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {description}
        </p>
      </div>

      <button
        onClick={onClick}
        className="self-start inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group/btn"
      >
        {buttonText}
        <span className="transform transition-transform duration-200 group-hover/btn:translate-x-0.5">
          →
        </span>
      </button>
    </div>
  );
}