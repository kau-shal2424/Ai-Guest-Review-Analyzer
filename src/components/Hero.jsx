import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, BarChart3, Brain, MessageSquareQuote } from "lucide-react";

const stats = [
  { label: "Reviews Analyzed", value: "2M+" },
  { label: "Properties Served", value: "12K+" },
  { label: "Avg. Accuracy", value: "96%" },
  { label: "Response Time", value: "<1s" },
];

export default function Hero() {
  return (
    <section className="relative bg-slate-950 dark:bg-slate-950 overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-indigo-500/10 rounded-full blur-2xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 lg:py-32 flex flex-col items-center text-center gap-6">
        {/* Badge */}


        {/* Headline — stacks vertically on all sizes */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
          Turn Guest Reviews Into{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Actionable Insights
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl font-medium leading-relaxed">
          Analyze thousands of hotel and Airbnb reviews instantly. Detect
          sentiments, uncover hidden themes, and generate AI-crafted responses
          in seconds.
        </p>

        {/* CTA Buttons — stack on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 w-full sm:w-auto">
          <Link
            to="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-95"
          >
            <Brain className="w-4 h-4" />
            Start Analyzing Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-7 py-3.5 rounded-2xl transition-all duration-200 active:scale-95"
          >
            <BarChart3 className="w-4 h-4" />
            View Dashboard
          </Link>
        </div>

        {/* Trust badge */}
        <p className="text-xs text-slate-500 font-medium mt-1">
          No credit card required · Free tier available · Cancel anytime
        </p>
      </div>

      {/* Stats Bar */}
      <div className="relative border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}