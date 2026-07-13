import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X, Settings, User, LogOut, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
      }
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

  // Get active links based on authentication and user role
  const getNavLinks = () => {
    if (!user) {
      return [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
      ];
    }
    if (user.role === "admin") {
      return [
        { to: "/admin-dashboard", label: "Admin Dashboard" },
        { to: "/admin/users", label: "Manage Users" },
        { to: "/reviews", label: "Reviews" },
        { to: "/admin/analytics", label: "Analytics" },
        { to: "/settings", label: "Settings" },
      ];
    }
    return [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/reviews", label: "Reviews" },
      { to: "/analyze", label: "Analyze" },
      { to: "/settings", label: "Settings" },
    ];
  };

  const navLinks = getNavLinks();

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
          {navLinks.map((link) => (
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

          {/* Notification Center - Only for logged in users */}
          {user && <NotificationDropdown />}

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2"></div>

          {/* Dynamic User Area (Dropdown / Login-Signup Buttons) */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-1 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 overflow-hidden">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold">{user.fullName.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {/* Profile Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user.fullName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{user.email}</p>
                    <div className="mt-1.5">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 uppercase tracking-wide">
                          Administrator
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 uppercase tracking-wide">
                          User
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    <NavLink
                      to="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </NavLink>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800/80 my-1"></div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink
                to="/login"
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className="flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-500/20"
              >
                Sign Up
              </NavLink>
            </div>
          )}
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

          {/* Drawer Profile Info if logged in */}
          {user && (
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold">{user.fullName.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate">{user.fullName}</h4>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Drawer Nav Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
            <span className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Navigation
            </span>
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={mobileLinkStyle}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Drawer Footer Actions */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-3">
            {user ? (
              <>
                <NavLink
                  to="/settings"
                  className="flex items-center justify-center px-4 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all shadow-sm gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </NavLink>
                <button
                  onClick={logout}
                  className="flex items-center justify-center px-4 py-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold text-sm transition-all shadow-sm gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="flex items-center justify-center px-4 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all shadow-sm"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="flex items-center justify-center px-4 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-500/20"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}