import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import elephantBg from "../assets/elephant_bg.png";

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
    <div className="min-h-screen flex bg-black">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src={elephantBg}
          alt="Majestic Elephant"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-8 left-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
              <img
                src="https://cdn-icons-png.flaticon.com/512/375/375048.png"
                alt="Elephant"
                className="w-6 h-6 invert"
              />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Project Airavata</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-black">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Log in to the world<br />of Wild</h2>
            <div className="flex items-center justify-center lg:justify-start gap-2 mt-4 text-sm">
              <span className="text-gray-400">Log In</span>
              <span className="text-gray-600">|</span>
              <Link to="/signup" className="text-yellow-500 font-medium hover:text-yellow-400 transition-colors">Sign Up</Link>
            </div>
          </div>

          {errors.general && (
            <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-transparent border-b ${errors.email ? 'border-red-500' : 'border-gray-700 focus:border-white'
                    } py-3 text-white placeholder-transparent focus:outline-none transition-colors`}
                  placeholder="Email"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-transparent border-b ${errors.password ? 'border-red-500' : 'border-gray-700 focus:border-white'
                    } py-3 text-white placeholder-transparent focus:outline-none transition-colors`}
                  placeholder="Password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
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
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </div>

            <div className="text-center pt-4">
              <span className="text-gray-500 text-sm">or</span>
              <p className="mt-4 text-sm text-gray-400">
                Don't have an account? <Link to="/signup" className="text-yellow-500 hover:text-yellow-400 ml-1">Sign Up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
