import React from "react";
import { Wifi, MapPin, Battery, CheckCircle, XCircle } from "lucide-react";
export default function Sensors() {
  const sensors = [
    {
      id: "SEN-001",
      name: "Forest Zone A",
      location: "Lat 21.34, Long 82.78",
      status: "online",
      battery: "92%",
      lastSignal: "2 min ago",
    },
  ];
  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-green-700 mb-2">Sensor Overview</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Monitor all deployed IoT sensors and their live status.
      </p>
      <div className="bg-white rounded-lg shadow-md border border-green-200 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-green-700 text-white uppercase text-xs">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Battery</th>
              <th className="px-6 py-3">Last Signal</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((sensor) => (
              <tr
                key={sensor.id}
                className="border-b hover:bg-green-50 transition-colors"
              >
                <td className="px-6 py-3 font-medium">{sensor.id}</td>
                <td className="px-6 py-3 flex items-center gap-2">
                  <MapPin size={16} className="text-green-600" />
                  {sensor.location}
                </td>
                <td className="px-6 py-3">
                  {sensor.status === "online" ? (
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <CheckCircle size={14} /> Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500 font-medium">
                      <XCircle size={14} /> Offline
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 flex items-center gap-1">
                  <Battery size={14} className="text-green-500" />
                  {sensor.battery}
                </td>
                <td className="px-6 py-3">{sensor.lastSignal}</td>
                <td className="px-6 py-3 text-right">
                  <button className="text-green-700 hover:text-green-800 text-sm font-medium flex items-center gap-1">
                    <Wifi size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {}
      <div className="mt-8 bg-white border border-green-200 rounded-lg p-6 shadow-inner text-center">
        <p className="text-gray-500">
          🗺️ Map preview of sensor positions will appear here (Leaflet integration pending)
        </p>
      </div>
    </div>
  );
}
