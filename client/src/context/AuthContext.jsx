import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../components/ui";

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
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        try {
          // Set global axios auth header
          axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
          
          // Verify user by calling /me
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`);
          setUser(res.data);
          setToken(savedToken);
          localStorage.setItem("user", JSON.stringify(res.data));
        } catch (err) {
          console.error("Session restoration failed:", err);
          // Invalid token – clean up
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      const { access_token, user: loggedUser } = response.data;
      
      // Store in localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      
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
      const msg = err.response?.data?.detail || "Login failed. Please check your credentials.";
      showError(msg);
      throw err;
    }
  };

  const register = async (fullName, email, password, confirmPassword, role) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        fullName,
        email,
        password,
        confirmPassword,
        role,
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
