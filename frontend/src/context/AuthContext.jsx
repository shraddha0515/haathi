import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "https://sih-saksham.onrender.com";
const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    initializeAuth();

    // Set up periodic token refresh (every 10 minutes)
    const refreshInterval = setInterval(() => {
      refreshAccessToken();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  const refreshAccessToken = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const loginTime = localStorage.getItem("loginTime");

      if (!token || !loginTime) return;

      // Check if login is within 7 days
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      const timeSinceLogin = Date.now() - parseInt(loginTime);

      if (timeSinceLogin > sevenDaysInMs) {
        // Session expired after 7 days
        clearAuth();
        return;
      }

      // Refresh the access token
      const res = await axiosInstance.post('/api/auth/refresh');
      if (res.data.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      // If refresh fails after 7 days, clear auth
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime) {
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        const timeSinceLogin = Date.now() - parseInt(loginTime);
        if (timeSinceLogin > sevenDaysInMs) {
          clearAuth();
        }
      }
    }
  };

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("user");
      const loginTime = localStorage.getItem("loginTime");

      if (token && userData) {
        // Check if login is within 7 days
        if (loginTime) {
          const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
          const timeSinceLogin = Date.now() - parseInt(loginTime);

          if (timeSinceLogin > sevenDaysInMs) {
            // Session expired after 7 days
            clearAuth();
            setLoading(false);
            return;
          }
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);

        // Try to refresh the token on app load
        await refreshAccessToken();
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };
  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post(
        `/api/auth/login`,
        { email, password }
      );
      const { accessToken, user: userData } = res.data;
      if (!accessToken || !userData) {
        throw new Error("Invalid response from server");
      }
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userData.role);
      localStorage.setItem("loginTime", Date.now().toString()); // Store login timestamp
      setUser(userData);
      setIsAuthenticated(true);
      navigateByRole(userData.role);
      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Login failed"
      };
    }
  };
  const register = async (name, email, password, role = "user") => {
    try {
      const res = await axiosInstance.post(
        `/api/auth/register`,
        { name, email, password, role }
      );
      const { accessToken, user: userData } = res.data;
      if (!accessToken || !userData) {
        throw new Error("Invalid response from server");
      }
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userData.role);
      localStorage.setItem("loginTime", Date.now().toString()); // Store login timestamp
      setUser(userData);
      setIsAuthenticated(true);
      navigateByRole(userData.role);
      return { success: true, user: userData };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Registration failed"
      };
    }
  };
  const logout = async () => {
    try {
      await axiosInstance.post(`/api/auth/logout`);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      navigate("/login");
    }
  };
  const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("loginTime");
    setUser(null);
    setIsAuthenticated(false);
  };
  const navigateByRole = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "officer":
        navigate("/officer/dashboard");
        break;
      case "user":
        navigate("/user/home");
        break;
      default:
        navigate("/dashboard");
    }
  };
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    clearAuth
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
