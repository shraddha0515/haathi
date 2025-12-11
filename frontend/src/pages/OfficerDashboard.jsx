import React, { useState, useEffect } from "react";
import { Plus, HardDrive, MapPin, Battery, Signal, Loader2, Bell } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "https://sih-saksham.onrender.com";

export default function OfficerDashboard() {
    const { openMapModal } = useSocket();
    const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        device_id: "",
        description: "",
        latitude: "",
        longitude: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchDevices();
        fetchNotifications();
    }, []);

    // Close notifications panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showNotifications && !event.target.closest('.notification-panel') && !event.target.closest('.notification-button')) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotifications]);

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

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get(`${API_BASE_URL}/api/notifications/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const notificationsData = Array.isArray(res.data) ? res.data : [];
            setNotifications(notificationsData);
            const unread = notificationsData.filter(n => !n.read).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setNotifications([]);
            setUnreadCount(0);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.put(
                `${API_BASE_URL}/api/notifications/${notificationId}/read`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Error marking notification as read:", err);
            toast.error("Failed to mark notification as read");
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const unreadNotifications = notifications.filter(n => !n.read);

            // Mark all unread notifications as read
            await Promise.all(
                unreadNotifications.map(notification =>
                    axios.put(
                        `${API_BASE_URL}/api/notifications/${notification.id}/read`,
                        {},
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    )
                )
            );

            // Update local state
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
            toast.success("All notifications marked as read");
        } catch (err) {
            console.error("Error marking all as read:", err);
            toast.error("Failed to mark all notifications as read");
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
            fetchDevices();
        } catch (err) {
            console.error("Error adding device:", err);
            toast.error(err?.response?.data?.message || "Failed to register device");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Officer Dashboard</h1>
                            <p className="text-gray-500 text-sm">Field Operations & Device Management</p>
                        </div>
                        <div className="flex gap-3 items-center">
                            {/* Notification Button */}
                            <div className="relative">
                                <button
                                    className="notification-button relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            <button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
                                onClick={() => setShowAddDeviceModal(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Device
                            </button>
                        </div>
                    </div>

                    {/* Notification Dropdown Panel */}
                    {showNotifications && (
                        <div className="notification-panel absolute right-6 top-20 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-[1000] max-h-[500px] overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <h3 className="font-semibold text-gray-800">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="overflow-y-auto flex-1">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''
                                                }`}
                                            onClick={() => {
                                                // Mark as read
                                                if (!notification.read) {
                                                    handleMarkAsRead(notification.id);
                                                }
                                                // Open map modal if notification has event data
                                                if (notification.data && openMapModal) {
                                                    openMapModal(notification.data);
                                                    setShowNotifications(false);
                                                }
                                            }}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-semibold text-sm text-gray-900">{notification.title}</h4>
                                                {!notification.read && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{notification.body}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-blue-500 mt-1 font-medium">
                                                Click to view on map →
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-400">
                                        <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                        <p>No notifications</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

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
            </div>
        </div>
    );
}
