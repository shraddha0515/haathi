// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3, Rss, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Analytics", icon: <BarChart3 size={20} />, path: "/analytics" },
    { name: "Sensors", icon: <Rss size={20} />, path: "/sensors" },
  ];

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-green-700 text-white h-screen flex flex-col transition-all duration-300 shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-green-600">
        {!collapsed && (
          <div>
            <h1 className="text-lg font-semibold">Airavata</h1>
            <p className="text-xs text-green-100">Command Center</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-green-600"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-green-100 hover:bg-green-600 hover:text-white"
              }`
            }
          >
            {item.icon}
            {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-green-600 text-xs text-green-100">
        {!collapsed && "System Online"}
        {collapsed && <div className="w-3 h-3 bg-green-400 rounded-full mx-auto"></div>}
      </div>
    </div>
  );
}
