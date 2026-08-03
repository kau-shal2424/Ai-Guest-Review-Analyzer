import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Lock, Eye } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans">
      {/* Top Header Bar */}
      <header className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Platform
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FF385C] flex items-center justify-center text-white font-bold text-xs">
              R
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">ReviewPulse</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-10">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Data Protection & Privacy
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last updated: August 3, 2026 · Committed to enterprise privacy & data isolation
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-955 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">1</span>
              Information We Collect
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We collect user account information (full name, email address, password hash, role) and review content uploaded for analysis. When using Google OAuth, we receive authorized profile information such as your verified email address and public profile name.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-955 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">2</span>
              How We Use Information
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Information collected is used strictly to provide, maintain, and personalize the ReviewPulse platform, deliver AI sentiment analysis, manage subscriptions, secure accounts, and generate aggregated analytics.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-955 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">3</span>
              AI Model Processing & Third Parties
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Review text submitted for analysis is processed via Google Gemini AI APIs under enterprise data confidentiality parameters. ReviewPulse does not sell, lease, or share your proprietary guest data with unverified third-party advertisers.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-955 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">4</span>
              Data Security & Storage
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We employ industry-standard encryption protocols (TLS in transit, bcrypt password hashing, JWT bearer verification) and cloud-level access control on MongoDB Atlas to prevent unauthorized access.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-955 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">5</span>
              Cookies & Local Storage
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              ReviewPulse uses browser local storage and session storage to maintain authentication tokens. Choosing "Remember Me" during sign-in securely persists authentication across sessions.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <span>© 2026 ReviewPulse • AI-Powered Guest Review Intelligence</span>
      </footer>
    </div>
  );
}
