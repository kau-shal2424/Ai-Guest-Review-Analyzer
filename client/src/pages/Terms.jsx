import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, FileText, CheckCircle } from "lucide-react";

export default function Terms() {
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
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4" /> Legal Documentation
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Terms of Service & Conditions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last updated: August 3, 2026 · Effective for all ReviewPulse platform users
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">1</span>
              Introduction & Acceptance
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Welcome to ReviewPulse. By accessing or using our SaaS platform, API endpoints, guest review analyzer features, and AI insights ("Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">2</span>
              User Responsibilities & Account Security
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              You are responsible for maintaining the confidentiality of your account credentials, passwords, and access tokens. You agree to immediately notify ReviewPulse of any unauthorized access to your account. You accept responsibility for all activities conducted under your registered account.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">3</span>
              Acceptable Use & Prohibited Activities
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              You agree not to use ReviewPulse to submit malicious, illegal, fraudulent, or harassing content. You must not attempt to decompile, reverse-engineer, or execute automated scraping on the ReviewPulse architecture without express written consent.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">4</span>
              AI Analysis Disclaimer
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              ReviewPulse utilizes artificial intelligence models (including Google Gemini AI) to extract review sentiments, categorize operational topics, and generate draft responses. AI outputs are advisory recommendations. Users should review and verify AI-generated draft responses prior to external publishing.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">5</span>
              Data Collection, Privacy & Cookies
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              ReviewPulse collects essential personal identifiers (name, work email) and uploaded review metadata to deliver analytical services. We use session tokens and browser cookies to maintain user authentication. Please refer to our <Link to="/privacy" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Privacy Policy</Link> for full details.
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
