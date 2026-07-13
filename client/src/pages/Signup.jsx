import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, ChevronDown } from "lucide-react";
import { Button, Input, showError } from "../components/ui";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { register, token } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !role) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      showError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      showError("Password must be at least 8 characters long");
      return;
    }
    if (!agree) {
      setError("You must agree to the Terms of Service");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await register(name, email, password, confirmPassword, role);
      // AuthContext handles navigate to login on success
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Registration failed. Please try again.";
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
              Create Account
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Start analyzing reviews in seconds
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              error={error && !name ? "Name is required" : ""}
            />

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

            <Input
              type={showPassword ? "text" : "password"}
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              error={error && !confirmPassword ? "Confirm password is required" : ""}
            />

            {/* Account Type (Role Selection Dropdown) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Account Type
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-slate-100 transition-all cursor-pointer appearance-none"
                >
                  <option value="user">User (Standard Account)</option>
                  <option value="admin">Admin (System Manager)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500 dark:text-slate-400">
                  <ChevronDown className="w-4.5 h-4.5" />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs mt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-950 cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="font-medium text-slate-600 dark:text-slate-400 cursor-pointer leading-normal"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Privacy Policy
                </a>
              </label>
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
              Sign Up
            </Button>
          </form>

          <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
