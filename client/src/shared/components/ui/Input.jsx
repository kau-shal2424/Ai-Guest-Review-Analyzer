import React from "react";

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = "",
  id,
  ...props
}) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={`
            w-full rounded-xl border bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm transition-all duration-200
            placeholder:text-slate-400 focus:outline-none focus:ring-2
            ${leftIcon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${error
              ? "border-rose-300 dark:border-rose-800 text-rose-900 focus:ring-rose-500 focus:border-rose-500"
              : "border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
            }
            ${className}
          `}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
