import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock, Mail, User, Shield, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "https://sih-saksham.onrender.com";
export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
    
    // Check password strength
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.status === 200 || res.status === 201) {
        const { accessToken, user } = res.data;
        if (accessToken && user) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("role", user.role);
        }
        toast.success("Account created successfully! Welcome to Project Airavata 🎉");
        switch (formData.role) {
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
      }
    } catch (err) {
      console.error("Signup error:", err);
      
      if (err.response) {
        const message = err.response.data?.message || "Signup failed";
        
        if (err.response.status === 409 || message.includes("already exists")) {
          toast.error("An account with this email already exists");
          setErrors({ email: "This email is already registered" });
        } else if (err.response.status === 400) {
          toast.error(message);
          setErrors({ general: message });
        } else {
          toast.error("Signup failed. Please try again.");
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
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 2) return "bg-yellow-500";
    if (passwordStrength <= 3) return "bg-blue-500";
    return "bg-green-500";
  };
  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 2) return "Fair";
    if (passwordStrength <= 3) return "Good";
    return "Strong";
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <img
              src="https://cdn-icons-png.flaticon.com/512/375/375048.png"
              alt="Elephant"
              className="w-10 h-10"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Project Airavata</h1>
          <p className="text-gray-600 text-sm">Create your account to get started</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">Fill in your details below</p>
          </div>
          {}
          {errors.general && (
            <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}
          {}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-transparent border-b ${errors.name ? 'border-red-500' : 'border-gray-700 focus:border-white'
                    } py-3 text-white placeholder-transparent focus:outline-none transition-colors`}
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-transparent border-b ${errors.email ? 'border-red-500' : 'border-gray-700 focus:border-white'
                    } py-3 text-white placeholder-transparent focus:outline-none transition-colors`}
                  placeholder="name@example.com"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  placeholder="Create a strong password"
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Password strength:</span>
                    <span className={`text-xs font-medium ${passwordStrength <= 1 ? 'text-red-500' :
                        passwordStrength <= 2 ? 'text-yellow-500' :
                          passwordStrength <= 3 ? 'text-blue-500' : 'text-green-500'
                      }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-transparent border-b ${errors.confirmPassword ? 'border-red-500' : 'border-gray-700 focus:border-white'
                    } py-3 text-white placeholder-transparent focus:outline-none transition-colors`}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="mt-1 text-sm text-green-500 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Passwords match
                </p>
              )}
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div className="relative">
                <Shield className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 hidden" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-700 text-white py-3 focus:outline-none focus:border-white transition-all appearance-none"
                  disabled={loading}
                >
                  <option value="user" className="bg-gray-900 text-white">User - General Public</option>
                  <option value="officer" className="bg-gray-900 text-white">Officer - Field Operations</option>
                  <option value="admin" className="bg-gray-900 text-white">Admin - System Management</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {formData.role === 'user' && 'Access to alerts and safety information'}
                {formData.role === 'officer' && 'Manage devices and field operations'}
                {formData.role === 'admin' && 'Full system access and management'}
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-4 h-4 text-green-600 border-gray-700 rounded focus:ring-green-500 mt-1 bg-gray-900"
                disabled={loading}
              />
              <label className="ml-2 text-sm text-gray-400">
                I agree to the{" "}
                <Link to="/terms" className="text-yellow-500 hover:text-yellow-400 font-medium hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-yellow-500 hover:text-yellow-400 font-medium hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-green-500/30 flex items-center justify-center mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>

            <div className="text-center pt-2">
              <span className="text-gray-500 text-sm">or</span>
              <p className="mt-4 text-sm text-gray-400">
                Already have an account? <Link to="/login" className="text-yellow-500 hover:text-yellow-400 ml-1">Login</Link>
              </p>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full text-center py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Forest Department. All rights reserved.
        </p>
      </div>
    </div>
  );
}
