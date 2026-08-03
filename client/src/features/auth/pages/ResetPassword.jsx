import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { Button, Input, showError, showSuccess } from "../../../shared/ui";
import { motion } from "framer-motion";
import axios from "axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      showError("Invalid or missing password reset token.");
    }
  }, [token]);

  const validatePasswordStrength = (pass) => {
    if (pass.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter (A-Z).";
    if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter (a-z).";
    if (!/[0-9]/.test(pass)) return "Password must contain at least one number (0-9).";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Password must contain at least one special character (!@#$%^&*).";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showError("Invalid or missing reset token. Please request a new link.");
      return;
    }

    const passErr = validatePasswordStrength(newPassword);
    if (passErr) {
      setPasswordError(passErr);
      showError(passErr);
      return;
    } else {
      setPasswordError("");
    }

    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      showError("Passwords do not match.");
      return;
    } else {
      setConfirmError("");
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
        token,
        newPassword,
        confirmPassword,
      });

      showSuccess(response.data?.message || "Password updated successfully!");
      navigate("/login", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail || "Reset link is invalid or has expired.";
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-[#1a1a1a] text-[#222222] dark:text-white flex flex-col justify-between relative font-sans">
      {/* Top Header Bar */}
      <header className="relative z-20 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full border-b border-[#EBEBEB] dark:border-[#333333] bg-white dark:bg-[#1a1a1a]">
        <Link
          to="/login"
          className="flex items-center gap-2 text-[#717171] hover:text-[#222222] dark:hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#FF385C] flex items-center justify-center text-white font-bold text-xs">
            R
          </div>
          <span className="font-extrabold text-sm tracking-tight text-[#222222] dark:text-white">ReviewPulse</span>
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
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#222222] dark:text-white">
              Create new password
            </h1>
            <p className="text-xs text-[#717171] font-normal">
              Your new password must be at least 8 characters and include uppercase, lowercase, number, and special character.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type={showNewPassword ? "text" : "password"}
              label="New Password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              leftIcon={<Lock className="w-4 h-4 text-[#717171]" />}
              rightIcon={
                <button
                  type="button"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-[#717171] hover:text-[#222222] dark:hover:text-white transition-colors cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={passwordError}
            />

            <Input
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm New Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmError) setConfirmError("");
              }}
              leftIcon={<Lock className="w-4 h-4 text-[#717171]" />}
              rightIcon={
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[#717171] hover:text-[#222222] dark:hover:text-white transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={confirmError}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading || !token}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full py-3 mt-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-bold rounded-full shadow-[0_2px_8px_rgba(255,56,92,0.3)] transition-all"
            >
              Update Password
            </Button>
          </form>

          <p className="text-center text-xs font-normal text-[#717171] pt-1">
            Back to{" "}
            <Link to="/login" className="font-bold text-[#FF385C] hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </main>

      {/* Footer info */}
      <footer className="relative z-20 px-6 py-4 text-center text-[11px] text-[#717171] font-normal border-t border-[#EBEBEB] dark:border-[#333333] bg-white dark:bg-[#1a1a1a]">
        <span>© 2026 ReviewPulse • AI-Powered Guest Review Intelligence</span>
      </footer>
    </div>
  );
}
