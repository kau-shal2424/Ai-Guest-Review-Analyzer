import React from "react";

export default function Loader({
  size = "md",
  variant = "spinner",
  text = "",
  className = "",
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      {variant === "spinner" && (
        <svg
          className={`animate-spin text-indigo-600 dark:text-indigo-400 ${sizeClasses[size]}`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {variant === "dots" && (
        <div className="flex space-x-1.5 justify-center items-center">
          <div
            className={`bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce ${
              size === "sm"
                ? "w-1.5 h-1.5"
                : size === "md"
                ? "w-2.5 h-2.5 [animation-delay:-0.3s]"
                : "w-4 h-4 [animation-delay:-0.3s]"
            }`}
          ></div>
          <div
            className={`bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce ${
              size === "sm"
                ? "w-1.5 h-1.5 [animation-delay:-0.15s]"
                : size === "md"
                ? "w-2.5 h-2.5 [animation-delay:-0.15s]"
                : "w-4 h-4 [animation-delay:-0.15s]"
            }`}
          ></div>
          <div
            className={`bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce ${
              size === "sm" ? "w-1.5 h-1.5" : size === "md" ? "w-2.5 h-2.5" : "w-4 h-4"
            }`}
          ></div>
        </div>
      )}

      {variant === "pulse" && (
        <div
          className={`rounded-full bg-indigo-600/30 dark:bg-indigo-400/30 animate-ping ${sizeClasses[size]}`}
        />
      )}

      {text && (
        <p
          className={`font-semibold text-slate-600 dark:text-slate-400 animate-pulse ${textSizes[size]}`}
        >
          {text}
        </p>
      )}
    </div>
  );
}
