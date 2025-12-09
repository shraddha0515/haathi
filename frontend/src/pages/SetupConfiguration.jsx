import React from "react";
import { useNavigate } from "react-router-dom";
export default function SetupConfiguration() {
  const navigate = useNavigate();
  const configs = [
    {
      title: "Sensor Network Initialized",
      desc: "50 sensors ready for deployment",
    },
    {
      title: "AI Model Loaded",
      desc: "Predictive analytics engine active",
    },
    {
      title: "GIS Maps Configured",
      desc: "Regional boundaries loaded",
    },
    {
      title: "Communication Channels Ready",
      desc: "SMS, email, and in-app notifications enabled",
    },
  ];
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-50 via-green-100 to-blue-50">
      <div className="bg-white shadow-2xl rounded-2xl w-[600px] max-w-[90%] p-10 border border-gray-100">
        {}
        <div className="mb-6">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
            <span>Setup Progress</span>
            <span className="font-medium">Step 3 of 4</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>
        {}
        <div className="flex flex-col items-start text-left mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-600 text-3xl">📡</span>
            <h1 className="text-2xl font-semibold text-green-700">
              System Configuration
            </h1>
          </div>
          <p className="text-gray-600 text-sm mb-6">
            Configure your monitoring preferences
          </p>
          <div className="space-y-4 w-full">
            {configs.map((config, index) => (
              <div
                key={index}
                className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-600 text-lg">✔</span>
                  <div>
                    <h3 className="text-gray-800 font-medium">
                      {config.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{config.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {}
        <div className="flex justify-between items-center">
          <button
            className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            onClick={() => navigate("/setup/department")}
          >
            Back
          </button>
          <button
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
            onClick={() => navigate("/dashboard")}
          >
            Next <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
