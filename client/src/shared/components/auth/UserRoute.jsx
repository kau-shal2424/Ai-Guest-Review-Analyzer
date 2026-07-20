import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Loader from "../../../components/ui/Loader";
import { showError } from "../../../components/ui";

export default function UserRoute() {
  const { token, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && token && user && user.role !== "user") {
      showError("Access denied: User role required");
    }
  }, [loading, token, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader size="lg" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "user") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
