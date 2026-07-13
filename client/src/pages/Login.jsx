import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button, Input, showError } from "../components/ui";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, token, user } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect to appropriate dashboard based on role
  useEffect(() => {
    if (token && user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      // AuthContext handles state updates and role-based redirecting
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to log in. Please check your credentials.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Decorative ambient background blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 md:py-12 lg:px-8 z-10">
        <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl px-5 py-8 sm:p-8 md:p-10 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Log in to analyze your guest reviews
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              error={error && !email ? "Email is required" : ""}
            />

            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer flex items-center justify-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              error={error && !password ? "Password is required" : ""}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <label className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-950"
                />
                Remember me
              </label>
              <a
                href="#"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Google Sign In */}
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}/auth/google/login`}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 font-semibold text-sm text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </a>

          <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mt-8">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
