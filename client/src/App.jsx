import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import Components from "./pages/Components";
import Reviews from "./pages/Reviews";
import AuthCallback from "./pages/AuthCallback";

// Authentication wrappers
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public / Non-Layout Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/login/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Layout Routes */}
            <Route element={<MainLayout />}>
              {/* Public Layout Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/components" element={<Components />} />

              {/* Protected Layout Routes (Users) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/analyze" element={<Analyze />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Admin Protected Layout Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                <Route path="/admin/analytics" element={<Analytics />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;