import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, ChevronDown, ArrowLeft, Building2 } from "lucide-react";
import { Button, Input, showError } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

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
      navigate("/user/dashboard");
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
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Registration failed. Please try again.";
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
              Create Account
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Join enterprise hospitality teams using ReviewAI
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <Input
              type="text"
              label="Full Name"
              placeholder="Elena Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
              error={error && !name ? "Name is required" : ""}
            />

            <Input
              type="email"
              label="Work Email"
              placeholder="elena@luxuryresorts.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              error={error && !email ? "Email is required" : ""}
            />

            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              error={error && !password ? "Password is required" : ""}
            />

            <Input
              type={showPassword ? "text" : "password"}
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              error={error && !confirmPassword ? "Confirm password is required" : ""}
            />

            {/* Account Type / Role Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Account License Type
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-200 cursor-pointer appearance-none"
                >
                  <option value="user">Hotel Manager / Analyst (User)</option>
                  <option value="admin">System Administrator (Admin)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="terms" className="font-medium text-slate-400 leading-snug cursor-pointer">
                I agree to the <a href="#" className="font-bold text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="font-bold text-blue-400 hover:underline">Privacy Policy</a>
              </label>
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
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs font-semibold text-slate-400 pt-2">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-blue-400 hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </main>

      <footer className="relative z-20 px-6 py-4 text-center text-[11px] text-slate-500 font-semibold">
        <span>Protected by SOC-2 Security Protocol · ReviewAI OS Inc.</span>
      </footer>
    </div>
  );
}
