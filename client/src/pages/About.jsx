import React from "react";
import { Sparkles, Brain, Shield, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-16 px-5 sm:px-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-200/50 dark:border-indigo-500/20">
            About Project
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Empowering Hospitality with AI-Driven Guest Intelligence
          </h1>
          <p className="text-slate-600 dark:text-slate-300 font-medium text-base sm:text-lg max-w-2xl leading-relaxed">
            AI Guest Review Analyzer helps hospitality businesses understand customer feedback, identify operational trends, and respond to guest reviews in seconds using Google Gemini AI.
          </p>
        </div>
      </section>

      {/* Mission & Key Pillars */}
      <section className="max-w-6xl mx-auto w-full px-5 sm:px-8 py-12 flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl flex flex-col gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">AI-Powered Analysis</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Extract exact sentiment, categorize primary topics (Cleanliness, Host, Food, Location), and generate context-aware response drafts automatically.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl flex flex-col gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl w-fit">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Guest Centric Focus</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Turn guest complaints into actionable operational checklists to boost guest satisfaction and increase repeat booking rates.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl flex flex-col gap-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl w-fit">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Secure & Role-Based</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Built with enterprise JWT security, system-wide admin control panels, and multi-tenant account isolation.
            </p>
          </div>
        </div>

        {/* Story / How it Works section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Why Choose AI Review Analyzer
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Built for Modern Hospitality Managers
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
              Manual review management is slow and prone to oversight. Our platform uses natural language processing to deliver instant actionable insights, so property managers can focus on hospitality.
            </p>
            <ul className="space-y-2.5 pt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500" /> Instant sentiment & topic extraction
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500" /> Automated AI draft reply generation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500" /> Period export report capabilities (PDF & CSV)
              </li>
            </ul>
          </div>

          <div className="p-6 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl text-white space-y-4">
            <h3 className="text-xl font-bold">Key Project Technologies</h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-indigo-200">
              <div className="p-3 bg-white/10 rounded-xl">React 18 & Vite</div>
              <div className="p-3 bg-white/10 rounded-xl">Tailwind CSS</div>
              <div className="p-3 bg-white/10 rounded-xl">FastAPI Backend</div>
              <div className="p-3 bg-white/10 rounded-xl">Google Gemini AI</div>
              <div className="p-3 bg-white/10 rounded-xl">MongoDB Database</div>
              <div className="p-3 bg-white/10 rounded-xl">Recharts Analytics</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto w-full px-5 sm:px-8 pb-16 sm:pb-20">
        <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 sm:p-12 overflow-hidden text-center flex flex-col items-center gap-6">
          <h2 className="relative text-2xl sm:text-4xl font-black text-white leading-tight max-w-2xl">
            Start Analyzing Your Guest Reviews Today
          </h2>
          <p className="relative text-indigo-100 font-medium max-w-lg text-sm sm:text-base">
            Create an account in seconds to transform your feedback into actionable intelligence.
          </p>

          <div className="relative flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 py-3.5 rounded-2xl transition-all active:scale-95 shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/user/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-500/30 hover:bg-indigo-500/50 text-white border border-white/20 font-bold px-8 py-3.5 rounded-2xl transition-all active:scale-95"
            >
              Try AI Analyzer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
