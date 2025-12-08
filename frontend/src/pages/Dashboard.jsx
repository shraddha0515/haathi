// src/pages/Dashboard.jsx
import React from "react";
import MapView from "../components/MapView";
import { MapPin, AlertTriangle, Radio } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full bg-green-50">
      {/* Quick Stats Bar */}
      <section className="grid grid-cols-3 gap-4 px-6 py-4">
        <div className="bg-white border-l-4 border-green-500 shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Active Alerts</span>
            <AlertTriangle className="text-red-500" size={20} />
          </div>
          <h2 className="text-2xl font-semibold text-green-700 mt-2">8</h2>
        </div>

        <div className="bg-white border-l-4 border-green-500 shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Elephants Tracked</span>
            <MapPin className="text-green-600" size={20} />
          </div>
          <h2 className="text-2xl font-semibold text-green-700 mt-2">3</h2>
        </div>

        <div className="bg-white border-l-4 border-green-500 shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Sensors Online</span>
            <Radio className="text-green-600" size={20} />
          </div>
          <h2 className="text-2xl font-semibold text-green-700 mt-2">4 / 5</h2>
        </div>
      </section>

      {/* Map Section */}
      <section className="flex-1 relative px-6 pb-4">
        <MapView />

        {/* Map Legend */}
        <div className="absolute bottom-6 left-10 bg-white border border-green-200 rounded-xl shadow-md p-4 text-sm">
          <h4 className="font-semibold text-green-700 mb-2">Map Legend</h4>
          <ul className="space-y-1 text-gray-700">
            <li>🟢 Online Sensor</li>
            <li>🔴 Offline Sensor</li>
            <li>🐘 Elephant Path</li>
          </ul>
        </div>
      </section>

      {/* Real-time Alerts */}
      <section className="bg-white shadow-inner border-t border-green-200 px-6 py-4">
        <h3 className="font-semibold text-green-700 mb-3">Real-time Alert Feed</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded shadow-sm">
            <p className="text-sm text-gray-700 font-medium">⚠️ Movement Alert</p>
            <p className="text-xs text-gray-500">Elephant herd detected near Zone A</p>
          </div>
          <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded shadow-sm">
            <p className="text-sm text-gray-700 font-medium">🚨 Critical Alert</p>
            <p className="text-xs text-gray-500">Bull Beta moving aggressively in Zone B</p>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded shadow-sm">
            <p className="text-sm text-gray-700 font-medium">⚠️ Proximity Warning</p>
            <p className="text-xs text-gray-500">Herd Gamma near Rice Fields</p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded shadow-sm">
            <p className="text-sm text-gray-700 font-medium">✅ System Normal</p>
            <p className="text-xs text-gray-500">No recent activity detected</p>
          </div>
        </div>
      </section>
    </div>
  );
}
