import { Link } from "react-router-dom";
import { Mail, Sparkles } from "lucide-react";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "Analyze Reviews", to: "/analyze" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Component Showcase", to: "/components" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign In", to: "/login" },
      { label: "Sign Up", to: "/signup" },
      { label: "Settings", to: "/settings" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Privacy Policy", to: "#" },
      { label: "Terms of Service", to: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">

        {/* Top Section: Brand + Links grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4 sm:col-span-1">
            <div>
              <h2 className="text-lg font-black">
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  AI Guest Review Analyzer
                </span>
              </h2>
              <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">
                AI-powered hospitality review insights for hotels, Airbnb hosts,
                and property managers.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="#"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                title="GitHub"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href="#"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                title="LinkedIn"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="#"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link Columns — 1 col on mobile, row on sm+ */}
          {footerLinks.map((section) => (
            <div key={section.heading} className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {section.heading}
              </h3>
              <ul className="flex flex-col gap-2">
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

        {/* Divider */}
        <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-medium">
          <span>© 2026 AI Guest Review Analyzer. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}