import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Sensors from "./pages/Sensors";
import SetupWelcome from "./pages/SetupWelcome";
import SetupDepartment from "./pages/SetupDepartment";
import SetupConfiguration from "./pages/SetupConfiguration";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./components/MainLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Setup Wizard Routes */}
        <Route path="/setup/welcome" element={<SetupWelcome />} />
        <Route path="/setup/department" element={<SetupDepartment />} />
        <Route path="/setup/configuration" element={<SetupConfiguration />} />

        {/* Protected Routes under Layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="sensors" element={<Sensors />} />

          {/* Role Based Dashboards */}
          <Route path="user/home" element={<UserDashboard />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="officer/dashboard" element={<OfficerDashboard />} />
        </Route>
      </Routes>

      <ToastContainer position="top-left" autoClose={3000} />
    </Router>
  );
}

export default App;