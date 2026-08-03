import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import { Button, Input, showError, showSuccess } from "../../../shared/ui";
import { motion } from "framer-motion";
import axios from "axios";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [demoToken, setDemoToken] = useState("");

  const validateEmail = (val) => {
    if (!val) return "Email is required.";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(val)) return "Please enter a valid email address.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      showError(err);
      return;
    }

    setEmailError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
        email: email.trim().toLowerCase(),
      });

      const message = response.data?.message || "Reset link sent if account exists.";
      showSuccess(message);
      setIsSubmitted(true);

      if (response.data?.resetToken) {
        setDemoToken(response.data.resetToken);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "Network error. Please try again.";
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
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-[#FF385C] flex items-center justify-center mb-3">
              <KeyRound className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#222222] dark:text-white">
              Reset password
            </h1>
            <p className="text-xs text-[#717171] font-normal">
              Enter your work email address and we'll generate a secure password reset link.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label="Email Address"
                placeholder="abcd@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                leftIcon={<Mail className="w-4 h-4 text-[#717171]" />}
                error={emailError}
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full py-3 mt-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-bold rounded-full shadow-[0_2px_8px_rgba(255,56,92,0.3)] transition-all"
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-emerald-900 dark:text-emerald-200">Reset instructions generated</p>
                  <p className="text-emerald-700 dark:text-emerald-300">
                    If an account with <span className="font-semibold">{email}</span> exists in ReviewPulse, a reset token has been activated.
                  </p>
                </div>
              </div>

              {demoToken && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Demo Password Reset Link:
                  </p>
                  <button
                    onClick={() => navigate(`/reset-password?token=${demoToken}`)}
                    className="w-full text-left text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline break-all bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer"
                  >
                    Click to Reset Password →
                  </button>
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="w-full py-2.5 text-xs font-semibold"
              >
                Try another email
              </Button>
            </div>
          )}

          <p className="text-center text-xs font-normal text-[#717171] pt-1">
            Remembered your password?{" "}
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
