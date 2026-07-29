import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button, Input } from "../../../shared/ui";
import { useAuth } from "../../../shared/context/AuthContext";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const { login, token, user } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Check URL error params
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "access_denied") {
        setError("Google authentication was denied or cancelled.");
      } else if (errorParam === "auth_cancelled_or_failed") {
        setError("Google login was cancelled or failed to complete.");
      } else if (errorParam === "google_auth_failed") {
        setError("Could not retrieve user info from Google. Please try again.");
      } else {
        setError("Authentication failed. Please check your credentials or try again.");
      }
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (token && user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to log in. Please check your credentials.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-[#1a1a1a] text-[#222222] dark:text-white flex flex-col justify-between relative font-sans">
      
      {/* Top Header Bar */}
      <header className="relative z-20 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full border-b border-[#EBEBEB] dark:border-[#333333] bg-white dark:bg-[#1a1a1a]">
        <Link
          to="/"
          className="flex items-center gap-2 text-[#717171] hover:text-[#222222] dark:hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Platform
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#FF385C] flex items-center justify-center text-white font-bold text-xs">
            R
          </div>
          <span className="font-extrabold text-sm tracking-tight text-[#222222] dark:text-white">ReviewAI</span>
        </div>
      </header>

      {/* Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white dark:bg-[#222222] border border-[#EBEBEB] dark:border-[#333333] rounded-2xl p-8 sm:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.12)] space-y-6 text-left"
        >
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#222222] dark:text-white">
              Welcome back
            </h1>
            <p className="text-xs text-[#717171] font-normal">
              Sign in to your hospitality review analyzer account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Work Email"
              placeholder="manager@hotel.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              leftIcon={<Mail className="w-4 h-4 text-[#717171]" />}
              error={emailError}
            />

            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              leftIcon={<Lock className="w-4 h-4 text-[#717171]" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#717171] hover:text-[#222222] dark:hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={passwordError}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 font-normal text-[#717171] cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-[#EBEBEB] text-[#FF385C] focus:ring-[#FF385C]"
                />
                Remember me
              </label>
              <a href="#" className="font-semibold text-[#FF385C] hover:underline">
                Forgot password?
              </a>
            </div>

            {error && (
              <p className="text-xs font-semibold text-[#D93025] text-center bg-[#FDECEA] border border-[#F5C6C2] py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full py-3 mt-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-bold rounded-full shadow-[0_2px_8px_rgba(255,56,92,0.3)] transition-all"
            >
              Sign In
            </Button>
          </form>

          {/* Social Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#EBEBEB] dark:bg-[#333333]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#717171]">
              OR
            </span>
            <div className="flex-1 h-px bg-[#EBEBEB] dark:bg-[#333333]" />
          </div>

          {/* Google SSO */}
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}/auth/google/login`}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-full border border-[#222222] dark:border-white bg-white dark:bg-[#1a1a1a] hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] transition-all font-semibold text-xs text-[#222222] dark:text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Continue with Google</span>
          </a>

          <p className="text-center text-xs font-normal text-[#717171] pt-1">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-[#FF385C] hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </main>

      {/* Footer info */}
      <footer className="relative z-20 px-6 py-4 text-center text-[11px] text-[#717171] font-normal border-t border-[#EBEBEB] dark:border-[#333333] bg-white dark:bg-[#1a1a1a]">
        <span>Protected by SOC-2 Protocol · AI Guest Review Analyzer</span>
      </footer>
    </div>
  );
}
