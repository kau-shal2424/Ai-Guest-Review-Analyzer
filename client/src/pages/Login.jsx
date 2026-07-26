import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import { Button, Input, showError } from "../components/ui";
import { useAuth } from "../context/AuthContext";
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

  // Check for error parameters in the URL (e.g. from Google OAuth callback)
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

  // If already logged in, redirect to appropriate dashboard based on role
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

    if (hasError) {
      return;
    }

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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Platform
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-sm">
            R
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">ReviewAI</span>
        </div>
      </header>

      {/* Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-blue-500/10 backdrop-blur-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Access your hospitality intelligence console
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <Input
              type="email"
              label="Work Email"
              placeholder="manager@luxuryhotel.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
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
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={passwordError}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 font-medium text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <a href="#" className="font-bold text-blue-400 hover:underline">
                Forgot password?
              </a>
            </div>

            {error && (
              <p className="text-xs font-bold text-rose-400 text-center bg-rose-500/10 border border-rose-500/20 py-2 rounded-xl">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/25 transition-all"
            >
              Sign In
            </Button>
          </form>

          {/* Social Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
              OR
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Google SSO */}
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}/auth/google/login`}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border border-slate-800 bg-slate-950/80 hover:bg-slate-850 hover:border-slate-700 transition-all font-semibold text-xs text-slate-200 shadow-md"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Sign in with Google Workspace</span>
          </a>

          <p className="text-center text-xs font-semibold text-slate-400 pt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-blue-400 hover:underline">
              Create Enterprise Account
            </Link>
          </p>
        </motion.div>
      </main>

      {/* Footer info */}
      <footer className="relative z-20 px-6 py-4 text-center text-[11px] text-slate-500 font-semibold">
        <span>Protected by SOC-2 Security Protocol · ReviewAI OS Inc.</span>
      </footer>
    </div>
  );
}
