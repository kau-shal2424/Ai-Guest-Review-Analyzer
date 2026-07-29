import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Menu, X, Settings, User, LogOut, ChevronDown, Search, Globe, Sparkles } from "lucide-react";
import { useTheme } from "../shared/context/ThemeContext";
import { useAuth } from "../shared/context/AuthContext";
import NotificationDropdown from "../features/notifications/components/NotificationDropdown";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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

  // Handle scroll shadow
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

  // Navigation Links based on role
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

  return (
    <>
      <nav 
        aria-label="Main Navigation"
        className={`sticky top-0 z-40 bg-white dark:bg-[#1a1a1a] transition-shadow duration-200 border-b border-[#EBEBEB] dark:border-[#333333] px-4 md:px-8 py-3 flex items-center justify-between gap-4 ${
          scrolled ? "shadow-[0_4px_12px_rgba(0,0,0,0.08)]" : "shadow-none"
        }`}
      >
        {/* Left: Airbnb-Style Brand Logo */}
        <NavLink
          to="/"
          aria-label="Home"
          className="flex items-center gap-2 text-[#FF385C] hover:opacity-90 transition-opacity flex-shrink-0 focus:outline-none rounded-xl"
        >
          <div className="w-8 h-8 rounded-full bg-[#FF385C] flex items-center justify-center text-white shadow-sm">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 32 32">
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.308-3.3 7.806-7.5 7.806-3.18 0-5.908-1.996-7-4.873-1.092 2.877-3.82 4.873-7 4.873-4.2 0-7.5-3.498-7.5-7.806 0-.834.195-1.745.885-3.396l.169-.395c.987-2.296 5.147-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.258 0-2.316.666-3.416 2.628l-.488.941c-1.921 3.766-6.046 12.404-7.018 14.673l-.156.368c-.602 1.436-.763 2.158-.802 2.809l-.008.237c0 3.208 2.463 5.806 5.5 5.806 2.766 0 5.127-1.996 5.856-4.786l.094-.374h1.898l.094.374c.729 2.79 3.09 4.786 5.856 4.786 3.037 0 5.5-2.598 5.5-5.806 0-.666-.17-1.427-.81-2.956l-.148-.344c-.972-2.269-5.097-10.907-7.018-14.673l-.488-.941C18.316 3.666 17.258 3 16 3z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-[#222222] dark:text-white leading-none text-lg">
              ReviewAI
            </span>
            <span className="text-[10px] font-semibold text-[#717171] dark:text-[#A0A0A0] tracking-wider uppercase">
              Hospitality
            </span>
          </div>
        </NavLink>

        {/* Center: Airbnb-Style Search Pill */}
        <div 
          onClick={() => navigate(user ? "/user/analyze" : "/login")}
          className="hidden md:flex items-center gap-3 border border-[#EBEBEB] dark:border-[#333333] hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-shadow duration-200 rounded-full px-4 py-2 bg-white dark:bg-[#222222] cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
        >
          <span className="text-xs font-semibold text-[#222222] dark:text-white px-2">Analyze Reviews</span>
          <span className="h-4 w-[1px] bg-[#EBEBEB] dark:bg-[#333333]" />
          <span className="text-xs font-semibold text-[#222222] dark:text-white px-2">Platform</span>
          <span className="h-4 w-[1px] bg-[#EBEBEB] dark:bg-[#333333]" />
          <span className="text-xs font-normal text-[#717171] px-2 flex items-center gap-1.5">
            AI Search
          </span>
          <div className="w-7 h-7 rounded-full bg-[#FF385C] flex items-center justify-center text-white">
            <Search className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Right: Airbnb User Menu Pill (☰ + Avatar) */}
        <div className="flex items-center gap-2">
          {/* Become a Host / Platform link */}
          <NavLink
            to={user ? "/user/dashboard" : "/signup"}
            className="hidden sm:inline-block px-3 py-2 text-xs font-semibold text-[#222222] dark:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] rounded-full transition-colors"
          >
            {user ? "Dashboard" : "Airbnb Partner"}
          </NavLink>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 text-[#717171] hover:text-[#222222] dark:hover:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] rounded-full transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification Center - Logged in users */}
          {user && <NotificationDropdown />}

          {/* Airbnb User Menu Pill Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 border border-[#EBEBEB] dark:border-[#333333] hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-shadow duration-200 rounded-full px-3 py-1.5 bg-white dark:bg-[#222222] cursor-pointer"
            >
              <Menu className="w-4 h-4 text-[#222222] dark:text-white" />
              <div className="w-7 h-7 rounded-full bg-[#717171] text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" />
                ) : user ? (
                  <span>{user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}</span>
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
            </button>

            {/* Profile Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#222222] border border-[#EBEBEB] dark:border-[#333333] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.14)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-[#EBEBEB] dark:border-[#333333]">
                      <p className="text-sm font-bold text-[#222222] dark:text-white truncate">{user.fullName}</p>
                      <p className="text-xs text-[#717171] truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="py-1">
                      {navLinks.map((link) => (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm font-medium text-[#222222] dark:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] transition-colors"
                        >
                          {link.label}
                        </NavLink>
                      ))}
                    </div>

                    <div className="border-t border-[#EBEBEB] dark:border-[#333333] my-1" />

                    <div className="py-1">
                      <NavLink
                        to="/settings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#717171] dark:text-gray-300 hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </NavLink>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#D93025] hover:bg-[#FFF0F3] transition-colors font-semibold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-1">
                    <NavLink
                      to="/login"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm font-bold text-[#222222] dark:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A]"
                    >
                      Sign In
                    </NavLink>
                    <NavLink
                      to="/signup"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-[#717171] dark:text-gray-300 hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A]"
                    >
                      Sign Up
                    </NavLink>
                    <div className="border-t border-[#EBEBEB] dark:border-[#333333] my-1" />
                    <NavLink
                      to="/about"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-[#717171] hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A]"
                    >
                      About Platform
                    </NavLink>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
