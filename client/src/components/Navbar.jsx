import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X, Settings, Bell, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/reviews", label: "Reviews" },
  { to: "/analyze", label: "Analyze" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/components", label: "Showcase" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  // Handle scroll to add deeper shadow/border
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const desktopLinkStyle = ({ isActive }) =>
    `relative px-1 py-2 text-sm font-semibold transition-all duration-300 ease-in-out group ${
      isActive 
        ? "text-indigo-600 dark:text-indigo-400" 
        : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300"
    }`;

  const mobileLinkStyle = ({ isActive }) =>
    `flex items-center px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
      isActive
        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
    }`;

  return (
    <>
      <nav 
        aria-label="Main Navigation"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled 
            ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/80 shadow-sm" 
            : "bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border-b border-transparent"
        } px-5 md:px-8 py-3.5 flex justify-between items-center`}
      >
        {/* Logo */}
        <NavLink
          to="/"
          aria-label="Home"
          className="text-lg md:text-xl font-black tracking-tight flex items-center gap-2 hover:opacity-90 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 text-transparent bg-clip-text hidden sm:block">
            Review Analyzer
          </span>
        </NavLink>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8" role="menubar">
          {NAV_LINKS.map((link) => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              className={desktopLinkStyle}
              role="menuitem"
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full transition-transform origin-left duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications Placeholder */}
          <button
            aria-label="Notifications"
            className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
          </button>

          {/* Settings */}
          <NavLink
            to="/settings"
            aria-label="Settings"
            className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Settings className="w-5 h-5" />
          </NavLink>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2"></div>

          {/* User Profile Avatar Placeholder */}
          <NavLink
            to="/login"
            aria-label="User Profile"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 hover:ring-2 hover:ring-indigo-500/50 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-slate-950 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <User className="w-4 h-4" />
          </NavLink>
        </div>

        {/* Mobile Hamburger & Actions */}
        <div className="flex md:hidden items-center gap-1.5">
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isMenuOpen}
      >
        {/* Blurred Backdrop overlay */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Close menu backdrop"
        />

        {/* Drawer Panel */}
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">Menu</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Nav Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
            <span className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Navigation
            </span>
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={mobileLinkStyle}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Drawer Footer Actions */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-3">
            <NavLink
              to="/settings"
              className="flex items-center justify-center px-4 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all shadow-sm gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </NavLink>
            <NavLink
              to="/login"
              className="flex items-center justify-center px-4 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-500/20"
            >
              Sign In
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}