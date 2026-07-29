import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, ChevronDown, ArrowLeft } from "lucide-react";
import { Button, Input, showError } from "../../../shared/ui";
import { useAuth } from "../../../shared/context/AuthContext";
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
              Create an account
            </h1>
            <p className="text-xs text-[#717171] font-normal">
              Join hospitality managers using AI Guest Review Analyzer
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Full Name"
              placeholder="Elena Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-[#717171]" />}
              error={error && !name ? "Name is required" : ""}
            />

            <Input
              type="email"
              label="Work Email"
              placeholder="elena@resort.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-[#717171]" />}
              error={error && !email ? "Email is required" : ""}
            />

            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              error={error && !password ? "Password is required" : ""}
            />

            <Input
              type={showPassword ? "text" : "password"}
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-[#717171]" />}
              error={error && !confirmPassword ? "Confirm password is required" : ""}
            />

            {/* Account Type / Role Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#222222] dark:text-white">
                Account License Type
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1a1a1a] border border-[#EBEBEB] dark:border-[#333333] rounded-lg text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] text-[#222222] dark:text-white cursor-pointer appearance-none"
                >
                  <option value="user">Hotel Manager / Analyst (User)</option>
                  <option value="admin">System Administrator (Admin)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#717171]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 rounded border-[#EBEBEB] text-[#FF385C] focus:ring-[#FF385C] cursor-pointer"
              />
              <label htmlFor="terms" className="font-normal text-[#717171] leading-snug cursor-pointer">
                I agree to the <a href="#" className="font-semibold text-[#FF385C] hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-[#FF385C] hover:underline">Privacy Policy</a>
              </label>
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
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs font-normal text-[#717171] pt-1">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#FF385C] hover:underline">
              Sign In
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
