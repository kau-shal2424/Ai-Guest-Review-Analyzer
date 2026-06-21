import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button, Input } from "../components/ui";
import Navbar from "../components/Navbar";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!agree) {
      setError("You must agree to the Terms of Service");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Successfully signed up! (Mock)");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-hidden">
      <Navbar />

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

            <div className="flex items-start gap-2 text-xs">
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

            {error && (!name || !email || !password || !agree) && (
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
