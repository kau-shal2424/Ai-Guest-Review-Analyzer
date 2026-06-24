import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X, Settings } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/analyze", label: "Analyze" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/components", label: "Showcase" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const desktopLinkStyle = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-indigo-400 ${isActive ? "text-indigo-400 font-semibold" : "text-slate-300"
    }`;

  const mobileLinkStyle = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-2xl text-base font-semibold transition-all ${isActive
      ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
    }`;

  return (
    <>
      <nav className="bg-slate-950 text-white px-5 md:px-8 py-4 flex justify-between items-center border-b border-slate-900 sticky top-0 z-40 backdrop-blur-md">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-lg md:text-xl font-black tracking-tight flex items-center gap-2 hover:opacity-90 flex-shrink-0"
        >
          <span className="bg-gradient-to-r from-indigo-500 to-violet-500 text-transparent bg-clip-text">
            AI Guest Review Analyzer
          </span>
        </NavLink>

        {/* Desktop Nav Links (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={desktopLinkStyle}>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <NavLink
            to="/login"
            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-1"
          >
            Sign In
          </NavLink>

          <NavLink
            to="/settings"
            className="p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-all"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </NavLink>
        </div>

        {/* Mobile Right — Theme + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-30 transition-all duration-300 ${isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-slate-950 border-l border-slate-900 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-slate-900">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Navigation
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Nav Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={mobileLinkStyle}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Drawer Footer */}
          <div className="border-t border-slate-900 px-4 py-5 flex flex-col gap-2">
            <NavLink
              to="/login"
              className="flex items-center justify-center px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
            >
              Sign In
            </NavLink>
            <NavLink
              to="/settings"
              className="flex items-center justify-center px-4 py-3 rounded-2xl border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-sm transition-all gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}