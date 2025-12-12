import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "https://sih-saksham.onrender.com";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("login");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        formData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const { accessToken, user } = res.data;
      if (!accessToken || !user) {
        throw new Error("Invalid response from server");
      }
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      toast.success(`Welcome back, ${user.name}!`);
      switch (user.role) {
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
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        const message = err.response.data?.message || "Login failed";
        toast.error(message);
        if (err.response.status === 401) {
          setErrors({ general: "Invalid email or password" });
        } else if (err.response.status === 404) {
          setErrors({ general: "Account not found" });
        } else {
          setErrors({ general: message });
        }
      } else if (err.request) {
        toast.error("Unable to connect to server. Please check your internet connection.");
        setErrors({ general: "Network error. Please try again." });
      } else {
        toast.error("An unexpected error occurred");
        setErrors({ general: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Elephant Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80"
          alt="Elephant in nature"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay with logo */}
        <div className="absolute top-8 left-8 flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/375/375048.png"
              alt="Elephant"
              className="w-6 h-6"
            />
          </div>
          <span className="text-xl font-semibold">Project Airavata</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-black flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Log in to the world<br />of Wild
            </h1>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setActiveTab("login")}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeTab === "login"
                    ? "text-white border-b-2 border-yellow-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeTab === "signup"
                    ? "text-white border-b-2 border-yellow-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-0 py-3 bg-transparent border-b border-gray-700 focus:border-yellow-500 outline-none transition-colors text-white placeholder-gray-500"
                placeholder=""
                disabled={loading}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-0 py-3 bg-transparent border-b border-gray-700 focus:border-yellow-500 outline-none transition-colors text-white placeholder-gray-500 pr-10"
                  placeholder=""
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-4 rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center mt-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-gray-500">or</span>
            </div>
          </div>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-yellow-500 hover:text-yellow-400 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
