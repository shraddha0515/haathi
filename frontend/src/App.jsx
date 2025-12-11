import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Sensors from "./pages/Sensors";
import History from "./pages/History";
import Hotspots from "./pages/Hotspots";
import Profile from "./pages/Profile";
import SetupWelcome from "./pages/SetupWelcome";
import SetupDepartment from "./pages/SetupDepartment";
import SetupConfiguration from "./pages/SetupConfiguration";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import TestNotifications from "./pages/TestNotifications";
import PrivateRoute from "./components/PrivateRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import MainLayout from "./components/MainLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
function AppContent() {
  return (
    <>
      <Routes>
        {}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/test-notifications" element={<TestNotifications />} />
        {}
        <Route path="/setup/welcome" element={<SetupWelcome />} />
        <Route path="/setup/department" element={<SetupDepartment />} />
        <Route path="/setup/configuration" element={<SetupConfiguration />} />
        {}
        <Route
          path="/user/home"
          element={
            <RoleBasedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </RoleBasedRoute>
          }
        />
        {}
        <Route
          path="/officer/dashboard"
          element={
            <RoleBasedRoute allowedRoles={["officer"]}>
              <OfficerDashboard />
            </RoleBasedRoute>
          }
        />
        {}
        <Route
          path="/admin/dashboard"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleBasedRoute>
          }
        />
        {}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          {}
          <Route
            path="dashboard"
            element={
              <RoleBasedRoute allowedRoles={["officer", "admin"]}>
                <Dashboard />
              </RoleBasedRoute>
            }
          />
          {}
          <Route
            path="analytics"
            element={
              <RoleBasedRoute allowedRoles={["officer", "admin"]}>
                <Analytics />
              </RoleBasedRoute>
            }
          />
          {}
          <Route
            path="sensors"
            element={
              <RoleBasedRoute allowedRoles={["officer", "admin"]}>
                <Sensors />
              </RoleBasedRoute>
            }
          />
          {}
          <Route
            path="history"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />
          {}
          <Route
            path="hotspots"
            element={
              <PrivateRoute>
                <Hotspots />
              </PrivateRoute>
            }
          />
          {}
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Route>
        {}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
function NotFound() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const handleGoHome = () => {
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
        navigate("/");
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
      <div className="text-center">
        <div className="mb-8">
          <img
            src="https://cdn-icons-png.flaticon.com/512/375/375048.png"
            alt="Elephant"
            className="w-32 h-32 mx-auto opacity-50"
          />
        </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={handleGoHome}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}
export default App;
