// src/components/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left sidebar */}
      <Sidebar />

      {/* Right side: header + page content */}
      <div className="flex-1 flex flex-col">
        {/* Greenish header */}
        <Header />

        {/* Main page content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
