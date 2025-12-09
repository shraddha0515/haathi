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
  }, []);
  const initializeAuth = () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("user");
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
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
