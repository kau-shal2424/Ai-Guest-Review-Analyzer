import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showSuccess, showError } from "../components/ui";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      showError("Google authentication failed. Please try again.");
      navigate("/login", { replace: true });
      return;
    }

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(parsedUser));
        showSuccess("Successfully logged in with Google!");
        navigate("/dashboard", { replace: true });
      } catch {
        showError("Authentication error. Please try again.");
        navigate("/login", { replace: true });
      }
    } else {
      showError("Authentication failed. Missing credentials.");
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}
