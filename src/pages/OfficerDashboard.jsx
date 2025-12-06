import React, { useState, useEffect } from "react";
import { Plus, HardDrive, MapPin, Battery, Signal, Loader2 } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";

export default function OfficerDashboard() {
    const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        device_id: "",
        description: "",
        latitude: "",
        longitude: ""
    });
    const [submitting, setSubmitting] = useState(false);

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

    const handleAddDevice = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem("accessToken");
            await axios.post(`${API_BASE_URL}/api/devices/create`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Device registered successfully!");
            setShowAddDeviceModal(false);
            setFormData({ device_id: "", description: "", latitude: "", longitude: "" });
            fetchDevices(); // Refresh list
        } catch (err) {
            console.error("Error adding device:", err);
            toast.error(err?.response?.data?.message || "Failed to register device");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Officer Dashboard</h1>
                    <p className="text-gray-500 text-sm">Field Operations & Device Management</p>
                </div>
                <button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
                    onClick={() => setShowAddDeviceModal(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Device
                </button>
            </div>

            {/* Devices Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {devices.length > 0 ? devices.map((device) => (
                        <div key={device.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                                        <HardDrive className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{device.device_id}</h3>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${device.status === 'offline' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {device.status || 'Online'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center text-xs text-gray-500 mb-1">
                                        <Battery className={`w-3 h-3 mr-1 ${device.battery_percentage < 20 ? 'text-red-500' : 'text-green-500'}`} />
                                        {device.battery_percentage || 100}%
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Signal className="w-3 h-3 mr-1 text-blue-500" />
                                        Strong
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                {device.description || "No description"}
                            </div>

                            <div className="mt-4 flex space-x-2">
                                <button className="flex-1 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                                    View Logs
                                </button>
                                <button className="flex-1 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                    Configure
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            No devices found. Add one to get started.
                        </div>
                    )}
                </div>
            )}

            {/* Add Device Modal */}
            {showAddDeviceModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Register New Device</h3>
                        <form onSubmit={handleAddDevice} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Device ID</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.device_id}
                                    onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    placeholder="e.g. H001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    placeholder="e.g. Forest north zone device"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        required
                                        value={formData.latitude}
                                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                        placeholder="21.xxx"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        required
                                        value={formData.longitude}
                                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                        placeholder="82.xxx"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddDeviceModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-70"
                                >
                                    {submitting ? "Registering..." : "Register Device"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
