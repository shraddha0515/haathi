import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  History,
  MapPin,
  User,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const getNavItems = () => {
    const baseItems = [
      { name: "Home", icon: <Home size={20} />, path: getHomePath(), roles: ["user", "officer", "admin"] },
      { name: "History", icon: <History size={20} />, path: "/history", roles: ["user", "officer", "admin"] },
      { name: "Hotspots", icon: <MapPin size={20} />, path: "/hotspots", roles: ["user", "officer", "admin"] }
    ];
    return baseItems.filter(item => item.roles.includes(user?.role));
  };
  const getHomePath = () => {
    switch (user?.role) {
      case "admin":
        return "/admin/dashboard";
      case "officer":
        return "/officer/dashboard";
      case "user":
        return "/user/home";
      default:
        return "/dashboard";
    }
  };
  const handleProfileClick = () => {
    navigate("/profile");
  };
  const navItems = getNavItems();
  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen flex flex-col transition-all duration-300 shadow-2xl relative`}
    >
      {}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-1 top-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full p-1.5 shadow-lg transition-all z-10"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      {}
      <div className="px-4 py-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          {}
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-white">Airavat</h1>
              <p className="text-xs text-gray-400">Monitoring System</p>
            </div>
          )}
        </div>
      </div>
      {}
      <nav className="flex-1 mt-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
      {}
      <div className="border-t border-gray-700 p-4">
        {}
        <div
          onClick={handleProfileClick}
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-all mb-2 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={20} className="text-gray-200" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {user?.role || "guest"}
              </p>
            </div>
          )}
          {!collapsed && (
            <Settings size={16} className="text-gray-400 hover:text-white transition-colors" />
          )}
        </div>
      </div>
    </div>
  );
}
