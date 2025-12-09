import React from "react";
export default function SetupDepartment() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-green-50">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Department Setup</h2>
      <p className="text-gray-600 mb-6">Configure department details and device assignment.</p>
      <button
        onClick={() => (window.location.href = "/setup/configuration")}
        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Next
      </button>
    </div>
  );
}
