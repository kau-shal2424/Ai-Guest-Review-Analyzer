import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Shared Context & Route Guards
import { AuthProvider } from "../shared/context/AuthContext";
import UserRoute from "../shared/components/UserRoute";
import AdminRoute from "../shared/components/AdminRoute";

// Shared Layouts
import MainLayout from "../layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

// ─── Lazy Loaded Public Pages ────────────────────────────────────────────────
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Login = lazy(() => import("../features/auth/pages/Login"));
const Signup = lazy(() => import("../features/auth/pages/Signup"));
const AuthCallback = lazy(() => import("../features/auth/pages/AuthCallback"));

// ─── Lazy Loaded User Feature Pages ─────────────────────────────────────────
const UserDashboard = lazy(() => import("../features/dashboard/pages/Dashboard"));
const UserReviews = lazy(() => import("../features/reviews/pages/Reviews"));
const UserAnalyze = lazy(() => import("../features/analyze/pages/Analyze"));
const UserAIInsights = lazy(() => import("../features/ai-insights/pages/AIInsights"));
const UserReports = lazy(() => import("../features/reports/pages/Reports"));
const UserNotifications = lazy(() => import("../features/notifications/pages/Notifications"));
const UserSettings = lazy(() => import("../features/settings/pages/Settings"));
const UserProfile = lazy(() => import("../features/profile/pages/Profile"));
const UserHelpCenter = lazy(() => import("../features/profile/pages/HelpCenter"));

// ─── Lazy Loaded Admin Pages ─────────────────────────────────────────────────
const AdminDashboard = lazy(() => import("../admin/pages/AdminDashboard"));
const AdminReviews = lazy(() => import("../admin/pages/AdminReviews"));
const AdminManageUsers = lazy(() => import("../admin/pages/ManageUsers"));
const AdminAnalytics = lazy(() => import("../admin/pages/Analytics"));
const AdminReports = lazy(() => import("../admin/pages/AdminReports"));
const AdminSettings = lazy(() => import("../admin/pages/AdminSettings"));
const AdminProfile = lazy(() => import("../admin/pages/AdminProfile"));
const AdminNotifications = lazy(() => import("../admin/pages/AdminNotifications"));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] dark:bg-[#1a1a1a]">
    <div className="w-8 h-8 border-3 border-[#FF385C] border-t-transparent rounded-full animate-spin" />
  </div>
);

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
          <Suspense fallback={<PageFallback />}>
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

              {/* ── USER SUB-APPLICATION ── */}
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

              {/* ── ADMIN SUB-APPLICATION ── */}
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

              {/* ── Legacy route redirects ── */}
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
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
