import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context
import { AuthProvider } from "./context/AuthContext";

// Route Guards
import UserRoute from "./shared/components/auth/UserRoute";
import AdminRoute from "./shared/components/auth/AdminRoute";

// Layouts
import MainLayout from "./layouts/MainLayout";
import UserLayout from "./user/layouts/UserLayout";
import AdminLayout from "./admin/layouts/AdminLayout";

// ─── Public Pages ───────────────────────────────────────────────────────────
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";

// ─── User Pages ──────────────────────────────────────────────────────────────
import UserDashboard from "./user/pages/Dashboard";
import UserReviews from "./user/pages/Reviews";
import UserAnalyze from "./user/pages/Analyze";
import UserAIInsights from "./user/pages/AIInsights";
import UserReports from "./user/pages/Reports";
import UserNotifications from "./user/pages/Notifications";
import UserSettings from "./user/pages/Settings";
import UserProfile from "./user/pages/Profile";
import UserHelpCenter from "./user/pages/HelpCenter";

// ─── Admin Pages ─────────────────────────────────────────────────────────────
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminReviews from "./admin/pages/AdminReviews";
import AdminManageUsers from "./admin/pages/ManageUsers";
import AdminAnalytics from "./admin/pages/Analytics";
import AdminReports from "./admin/pages/AdminReports";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminProfile from "./admin/pages/AdminProfile";
import AdminNotifications from "./admin/pages/AdminNotifications";

function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: { borderRadius: '12px', fontSize: '14px' },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* ── Public: no layout ── */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* ── Public: marketing layout (Navbar + Footer) ── */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
            </Route>

            {/* ─────────────────────────────────────────────────────────────
                USER SUB-APPLICATION  (role === "user" required)
                All routes live under /user/*
            ───────────────────────────────────────────────────────────── */}
            <Route element={<UserRoute />}>
              <Route element={<UserLayout />}>
                <Route path="/user/dashboard"     element={<UserDashboard />} />
                <Route path="/user/reviews"        element={<UserReviews />} />
                <Route path="/user/analyze"        element={<UserAnalyze />} />
                <Route path="/user/insights"       element={<UserAIInsights />} />
                <Route path="/user/reports"        element={<UserReports />} />
                <Route path="/user/notifications"  element={<UserNotifications />} />
                <Route path="/user/settings"       element={<UserSettings />} />
                <Route path="/user/profile"        element={<UserProfile />} />
                <Route path="/user/help"           element={<UserHelpCenter />} />
                {/* Catch-all redirect within /user */}
                <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />
                <Route path="/user/*" element={<Navigate to="/user/dashboard" replace />} />
              </Route>
            </Route>

            {/* ─────────────────────────────────────────────────────────────
                ADMIN SUB-APPLICATION  (role === "admin" required)
                All routes live under /admin/*
            ───────────────────────────────────────────────────────────── */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard"   element={<AdminDashboard />} />
                <Route path="/admin/reviews"     element={<AdminReviews />} />
                <Route path="/admin/users"       element={<AdminManageUsers />} />
                <Route path="/admin/analytics"   element={<AdminAnalytics />} />
                <Route path="/admin/reports"     element={<AdminReports />} />
                <Route path="/admin/settings"    element={<AdminSettings />} />
                <Route path="/admin/profile"     element={<AdminProfile />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                {/* Catch-all redirect within /admin */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
              </Route>
            </Route>

            {/* ── Legacy route redirects (old paths → new paths) ── */}
            <Route path="/dashboard"   element={<Navigate to="/user/dashboard" replace />} />
            <Route path="/analyze"     element={<Navigate to="/user/analyze" replace />} />
            <Route path="/reviews"     element={<Navigate to="/user/reviews" replace />} />
            <Route path="/insights"    element={<Navigate to="/user/insights" replace />} />
            <Route path="/reports"     element={<Navigate to="/user/reports" replace />} />
            <Route path="/settings"    element={<Navigate to="/user/settings" replace />} />
            <Route path="/profile"     element={<Navigate to="/user/profile" replace />} />
            <Route path="/help"        element={<Navigate to="/user/help" replace />} />
            <Route path="/notifications" element={<Navigate to="/user/notifications" replace />} />
            <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />

            {/* ── 404 fallback ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;