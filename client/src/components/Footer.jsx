import { Link } from "react-router-dom";
import { Mail, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "Analyze Reviews", to: "/user/analyze" },
      { label: "Guest Insights", to: "/user/insights" },
      { label: "Reports & BI", to: "/user/reports" },
      { label: "Dashboard", to: "/user/dashboard" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "System Status", to: "#" },
      { label: "Security & SOC-2", to: "#" },
      { label: "API Documentation", to: "#" },
      { label: "Release Notes", to: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About ReviewAI", to: "/about" },
      { label: "Privacy Policy", to: "#" },
      { label: "Terms of Service", to: "#" },
      { label: "Contact Support", to: "/user/help" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">

        {/* Top Section: Brand + Links grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                ReviewAI <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">OS</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-sm">
              The enterprise guest intelligence platform powering sentiment analytics and automated AI responses for hotel chains, luxury resorts, and hospitality groups worldwide.
            </p>

            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (99.99%)</span>
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.heading} className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {section.heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider & Sub-footer */}
        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <span>© 2026 ReviewAI OS Inc. Built for Enterprise Hospitality.</span>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-300 cursor-pointer">Security</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms</span>
          </div>
        </div>

      </div>
    </footer>
  );
}