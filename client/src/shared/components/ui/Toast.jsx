import React from "react";
import toast from "react-hot-toast";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export const showSuccess = (message, description = "") => {
  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-fade-in-up" : "animate-fade-out"
        } max-w-md w-full bg-white dark:bg-slate-900 border border-emerald-500/20 shadow-2xl rounded-2xl pointer-events-auto flex items-start gap-3.5 p-4 transition-all duration-300`}
      >
        <div className="flex-shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {message}
          </h4>
          {description && (
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ),
    { duration: 4000 }
  );
};

export const showError = (message, description = "") => {
  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-fade-in-up" : "animate-fade-out"
        } max-w-md w-full bg-white dark:bg-slate-900 border border-rose-500/20 shadow-2xl rounded-2xl pointer-events-auto flex items-start gap-3.5 p-4 transition-all duration-300`}
      >
        <div className="flex-shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5 text-rose-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {message}
          </h4>
          {description && (
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ),
    { duration: 5000 }
  );
};

// Default export of standard toast component for manual styling instances
export default function Toast({
  message,
  description,
  type = "success",
  onClose,
}) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
  };

  const borders = {
    success:
      "border-emerald-500/20 bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300",
    error:
      "border-rose-500/20 bg-rose-50/80 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300",
  };

  return (
    <div
      className={`flex items-start gap-3.5 p-4 rounded-2xl border backdrop-blur-md shadow-xl transition-all duration-300 w-full max-w-sm pointer-events-auto ${borders[type]}`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          {message}
        </h4>
        {description && (
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
