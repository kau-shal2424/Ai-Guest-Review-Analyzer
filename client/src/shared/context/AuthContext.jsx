import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../ui";

export const extractErrorMessage = (err, defaultMsg = "An unexpected error occurred.") => {
  if (!err) return defaultMsg;

  // Handle Network Errors (e.g. backend server offline)
  if (err.message === "Network Error" || !err.response) {
    return "Network error. Please check your internet connection or server status.";
  }

  const status = err.response?.status;
  const detail = err.response?.data?.detail;

  // HTTP Status Specific Overrides
  if (status === 401 || status === 403) {
    if (typeof detail === "string" && detail.trim()) return detail;
    return "Invalid email or password.";
  }
  if (status === 404) {
    return "Authentication service endpoint not found.";
  }
  if (status === 500) {
    return "Internal server error. Please try again later.";
  }

  // Parse detail array or dict from FastAPI
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }
  if (Array.isArray(detail)) {
    const parsed = detail
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.msg || item?.detail || JSON.stringify(item)
      )
      .join(", ");
    if (parsed) return parsed;
  }
  if (typeof detail === "object" && detail !== null) {
    if (typeof detail.msg === "string") return detail.msg;
    if (typeof detail.detail === "string") return detail.detail;
    if (typeof detail.message === "string") return detail.message;
  }

  if (typeof err.message === "string" && err.message) {
    return err.message;
  }

  return defaultMsg;
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Expose roles as quick checks
  const isAdmin = user?.role === "admin";

  // Load and verify session on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
      const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

      if (savedToken && savedUser) {
        try {
          // Set global axios auth header
          axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
          
          // Verify user by calling /me
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`);
          setUser(res.data);
          setToken(savedToken);
          
          if (localStorage.getItem("token")) {
            localStorage.setItem("user", JSON.stringify(res.data));
          } else {
            sessionStorage.setItem("user", JSON.stringify(res.data));
          }
        } catch (err) {
          console.error("Session restoration failed:", err);
          // Invalid token – clean up storage silently without navigating away
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        email: email.trim().toLowerCase(),
        password,
      });
      
      const data = response?.data;
      if (!data || !data.access_token || !data.user) {
        throw new Error("Invalid server response structure.");
      }

      const { access_token, user: loggedUser } = data;
      
      // Clear previous storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Store in selected storage
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", access_token);
      storage.setItem("user", JSON.stringify(loggedUser));
      
      // Update axios headers and state
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      setToken(access_token);
      setUser(loggedUser);
      
      showSuccess("Successfully logged in!");
      
      // Role-based redirect
      if (loggedUser.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      const msg = extractErrorMessage(err, "Invalid email or password.");
      showError(msg);
      const errorObj = new Error(msg);
      errorObj.originalError = err;
      throw errorObj;
    }
  };

  const register = async (fullName, email, password, confirmPassword) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        fullName,
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        agreeToTerms: true,
      });
      showSuccess("Successfully registered! Please log in.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.detail || "Registration failed. Please try again.";
      showError(msg);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
    navigate("/");
  };

  // Helper functions as requested
  const isAuthenticated = () => {
    return !!token;
  };

  const currentUser = () => {
    return user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        logout,
        register,
        isAuthenticated,
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
