import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
export default function PrivateRoute({ children }) {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  useEffect(() => {
    validateAuth();
  }, []);
  const validateAuth = () => {
    try {
      const token = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");
      if (!token || !user) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }
      const parts = token.split('.');
      if (parts.length !== 3) {
        clearAuthData();
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }
      try {
        const payload = JSON.parse(atob(parts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          clearAuthData();
          setIsAuthenticated(false);
          setIsValidating(false);
          return;
        }
      } catch (e) {
        console.warn("Could not decode token:", e);
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth validation error:", error);
      clearAuthData();
      setIsAuthenticated(false);
    } finally {
      setIsValidating(false);
    }
  };
  const clearAuthData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
