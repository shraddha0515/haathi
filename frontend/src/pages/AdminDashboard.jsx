import React, { useState, useEffect } from "react";
import { Users, Shield, Activity, Plus, Search, HardDrive, Bell } from "lucide-react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "https://sih-saksham.onrender.com";
export default function AdminDashboard() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [officers, setOfficers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [officerForm, setOfficerForm] = useState({
        name: "",
        email: "",
        password: "",
        zone: "North Zone"
    });
    const [alertForm, setAlertForm] = useState({
        title: "",
        message: "",
        priority: "medium"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchDevices();
        fetchOfficers();
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
        } finally {
            setLoading(false);
        }
    };

    const fetchOfficers = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get(`${API_BASE_URL}/api/users/role/officer`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOfficers(res.data);
        } catch (err) {
            console.error("Error fetching officers:", err);
            toast.error("Failed to fetch officers");
        }
    };

    const handleOfficerFormChange = (e) => {
        setOfficerForm({
            ...officerForm,
            [e.target.name]: e.target.value
        });
    };

    const handleAddOfficer = async () => {
        // Validation
        if (!officerForm.name || !officerForm.email || !officerForm.password) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(officerForm.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // Password validation
        if (officerForm.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/register`,
                {
                    name: officerForm.name,
                    email: officerForm.email,
                    password: officerForm.password,
                    role: "officer"
                },
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success("Officer added successfully!");
            
            // Reset form and close modal
            setOfficerForm({
                name: "",
                email: "",
                password: "",
                zone: "North Zone"
            });
            setShowAddModal(false);

            // Refresh officers list
            fetchOfficers();

        } catch (err) {
            console.error("Error adding officer:", err);
            const errorMessage = err.response?.data?.error || "Failed to add officer";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteOfficer = async (officerId, officerName) => {
        if (!window.confirm(`Are you sure you want to remove ${officerName}? This action cannot be undone.`)) {
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(`${API_BASE_URL}/api/users/${officerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Officer removed successfully!");
            fetchOfficers(); // Refresh the list
        } catch (err) {
            console.error("Error deleting officer:", err);
            const errorMessage = err.response?.data?.error || "Failed to remove officer";
            toast.error(errorMessage);
        }
    };

    // Filter officers based on search query
    const filteredOfficers = officers.filter(officer => 
        officer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        officer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAlertFormChange = (e) => {
        setAlertForm({
            ...alertForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSendAlert = async () => {
        // Validation
        if (!alertForm.title || !alertForm.message) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("accessToken");
            
            // Here you would typically send the alert to your backend
            // For now, we'll simulate the API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            toast.success(`Alert sent successfully to all officers!`);
            
            // Reset form and close modal
            setAlertForm({
                title: "",
                message: "",
                priority: "medium"
            });
            setShowAlertModal(false);

        } catch (err) {
            console.error("Error sending alert:", err);
            const errorMessage = err.response?.data?.error || "Failed to send alert";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
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
                <div className="flex gap-3">
                    <button
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                        onClick={() => setShowAlertModal(true)}
                    >
                        <Bell className="w-4 h-4 mr-2" />
                        Send Alert
                    </button>
                    <button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                        onClick={() => setShowAddModal(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Officer
                    </button>
                </div>
            </div>
            {}
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
            {}
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
            {}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Officer Management</h2>
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search officers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-medium">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Joined Date</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOfficers.length > 0 ? filteredOfficers.map((officer) => (
                                <tr key={officer.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{officer.id}</td>
                                    <td className="px-6 py-4">{officer.name}</td>
                                    <td className="px-6 py-4">{officer.email}</td>
                                    <td className="px-6 py-4">
                                        {officer.created_at ? new Date(officer.created_at).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">Edit</button>
                                        <span className="mx-2 text-gray-300">|</span>
                                        <button 
                                            onClick={() => handleDeleteOfficer(officer.id, officer.name)}
                                            className="text-red-600 hover:text-red-800 font-medium text-xs"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">No officers found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Add New Officer</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={officerForm.name}
                                    onChange={handleOfficerFormChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                                    placeholder="Officer Name" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={officerForm.email}
                                    onChange={handleOfficerFormChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                                    placeholder="officer@example.com" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={officerForm.password}
                                    onChange={handleOfficerFormChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                                    placeholder="Minimum 6 characters" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
                                <select 
                                    name="zone"
                                    value={officerForm.zone}
                                    onChange={handleOfficerFormChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                >
                                    <option>North Zone</option>
                                    <option>South Zone</option>
                                    <option>East Zone</option>
                                    <option>West Zone</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setOfficerForm({
                                            name: "",
                                            email: "",
                                            password: "",
                                            zone: "North Zone"
                                        });
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddOfficer}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Creating..." : "Create Officer"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Send Alert Modal */}
            {showAlertModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-orange-600" />
                            Send Alert to All Officers
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Title *</label>
                                <input 
                                    type="text" 
                                    name="title"
                                    value={alertForm.title}
                                    onChange={handleAlertFormChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" 
                                    placeholder="Enter alert title" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                                <textarea 
                                    name="message"
                                    value={alertForm.message}
                                    onChange={handleAlertFormChange}
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none" 
                                    placeholder="Enter alert message" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                                <select 
                                    name="priority"
                                    value={alertForm.priority}
                                    onChange={handleAlertFormChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowAlertModal(false);
                                        setAlertForm({
                                            title: "",
                                            message: "",
                                            priority: "medium"
                                        });
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendAlert}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                    disabled={isSubmitting}
                                >
                                    <Bell className="w-4 h-4" />
                                    {isSubmitting ? "Sending..." : "Send Alert"}
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
