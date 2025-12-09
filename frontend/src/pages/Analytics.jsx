import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
export default function Analytics() {
  const monthlyConflicts = [
    { month: "Jan", conflicts: 2 },
    { month: "Feb", conflicts: 1 },
    { month: "Mar", conflicts: 3 },
    { month: "Apr", conflicts: 0 },
    { month: "May", conflicts: 1 },
    { month: "Jun", conflicts: 0 },
  ];
  const conflictTypes = [
    { name: "Crop Damage", value: 60 },
    { name: "Property Loss", value: 20 },
    { name: "Forest Damage", value: 20 },
  ];
  const COLORS = ["#16a34a", "#4ade80", "#86efac"];
  return (
    <div className="h-full w-full p-6 bg-green-50 overflow-y-auto">
      {}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-green-700">
          Analytics Overview (Device: SEN-001)
        </h2>
        <p className="text-gray-600 text-sm">
          Visual insights from AI-powered elephant movement and conflict data for Forest Zone A
        </p>
      </div>
      {}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { title: "Total Conflicts", value: 34, color: "text-red-600" },
          { title: "Conflicts Prevented", value: 27, color: "text-green-600" },
          { title: "Avg Response Time", value: "4.3 min", color: "text-green-600" },
          { title: "Success Rate", value: "79%", color: "text-green-600" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border-l-4 border-green-500 shadow-md rounded-lg p-4"
          >
            <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
            <h2 className={`text-2xl font-semibold mt-1 ${stat.color}`}>
              {stat.value}
            </h2>
          </div>
        ))}
      </div>
      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <div className="bg-white p-6 shadow-md rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-4">
            Monthly Conflict Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyConflicts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="conflicts" fill="#16a34a" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {}
        <div className="bg-white p-6 shadow-md rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-4">
            Conflict Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={conflictTypes}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {conflictTypes.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
