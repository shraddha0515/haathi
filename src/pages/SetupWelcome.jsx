import React from "react";
import { useNavigate } from "react-router-dom";

export default function SetupWelcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-50 via-green-100 to-blue-50">
      <div className="bg-white shadow-2xl rounded-2xl w-[600px] max-w-[90%] p-10 border border-gray-100">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
            <span>Setup Progress</span>
            <span className="font-medium">Step 1 of 4</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div className="h-2 bg-green-500 rounded-full" style={{ width: "25%" }}></div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-green-100 p-5 rounded-2xl mb-5 shadow-inner">
            <img
              src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
              alt="Airavata Icon"
              className="w-16 h-16"
            />
          </div>

          <h1 className="text-3xl font-semibold text-green-700 mb-2">
            Welcome to Project Airavata
          </h1>
          <p className="text-gray-600 max-w-md mb-8">
            AI-powered Human-Elephant Conflict prevention system. Let's configure your
            command center for optimal performance.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow hover:shadow-lg transition">
            <span className="text-green-600 text-2xl mb-2 block">📍</span>
            <h3 className="font-medium text-gray-800">Real-time Tracking</h3>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow hover:shadow-lg transition">
            <span className="text-green-600 text-2xl mb-2 block">📡</span>
            <h3 className="font-medium text-gray-800">Sensor Network</h3>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow hover:shadow-lg transition">
            <span className="text-green-600 text-2xl mb-2 block">🔔</span>
            <h3 className="font-medium text-gray-800">Smart Alerts</h3>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            onClick={() => navigate(-1)}
          >
            Back
          </button>

          <button
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
            onClick={() => navigate("/setup/department")}
          >
            Next <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
