import React, { useState, useEffect } from "react";
import { Users, Shield, Activity, Plus, Search, HardDrive } from "lucide-react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "https://sih-saksham.onrender.com";

export default function AdminDashboard() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock officers for now as no API endpoint provided
    const [officers, setOfficers] = useState([
        { id: "OFF-001", name: "Ramesh Gupta", zone: "North", status: "Active" },
        { id: "OFF-002", name: "Suresh Kumar", zone: "South", status: "On Leave" },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get(`${API_BASE_URL}/api/devices`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDevices(res.data);
        } catch (err) {
            console.error("Error fetching devices:", err);
            // toast.error("Failed to load devices");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm">System Overview & Management</p>
                </div>
                <button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                    onClick={() => setShowAddModal(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Officer
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 bg-blue-100 rounded-xl mr-4">
                        <HardDrive className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Devices</p>
                        <h3 className="text-2xl font-bold text-gray-800">{devices.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 bg-emerald-100 rounded-xl mr-4">
                        <Shield className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Active Officers</p>
                        <h3 className="text-2xl font-bold text-gray-800">{officers.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 bg-purple-100 rounded-xl mr-4">
                        <Activity className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">System Health</p>
                        <h3 className="text-2xl font-bold text-gray-800">98%</h3>
                    </div>
                </div>
            </div>

            {/* Device List (Real Data) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Registered Devices</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-medium">
                            <tr>
                                <th className="px-6 py-3">Device ID</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3">Location</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {devices.length > 0 ? devices.map((device) => (
                                <tr key={device.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{device.device_id}</td>
                                    <td className="px-6 py-4">{device.description}</td>
                                    <td className="px-6 py-4">{device.latitude}, {device.longitude}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${device.status === 'offline' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {device.status || 'Online'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-400">No devices found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Officer Management Section (Mock) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Officer Management</h2>
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search officers..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-medium">
                            <tr>
                                <th className="px-6 py-3">Officer ID</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Zone</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {officers.map((officer) => (
                                <tr key={officer.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{officer.id}</td>
                                    <td className="px-6 py-4">{officer.name}</td>
                                    <td className="px-6 py-4">{officer.zone}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${officer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {officer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">Edit</button>
                                        <span className="mx-2 text-gray-300">|</span>
                                        <button className="text-red-600 hover:text-red-800 font-medium text-xs">Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Officer Modal (Mock) */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Add New Officer</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Officer Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
                                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                                    <option>North Zone</option>
                                    <option>South Zone</option>
                                    <option>East Zone</option>
                                    <option>West Zone</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        // Add logic here
                                    }}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                >
                                    Create Officer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
                </div>
            </div>
        </div>
    );
}
