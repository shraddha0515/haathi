import React from "react";
import { Navigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
export default function RoleBasedRoute({ allowedRoles = [], children }) {
  const token = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(userRole)) {
    return <UnauthorizedAccess userRole={userRole} />;
  }
  return children;
}
function UnauthorizedAccess({ userRole }) {
  const getRedirectPath = () => {
    switch(userRole) {
      case "admin":
        return "/admin/dashboard";
      case "officer":
        return "/officer/dashboard";
      case "user":
        return "/user/home";
      default:
        return "/login";
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4">
            <ShieldAlert className="w-12 h-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Unauthorized</h2>
        <p className="text-gray-500 mb-8">
          You don't have permission to access this page. This area is restricted to specific user roles.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Your Role:</strong> {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'Unknown'}
          </p>
        </div>
        <a
          href={getRedirectPath()}
          className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
        >
          Go to Your Dashboard
        </a>
      </div>
    </div>
  );
}
