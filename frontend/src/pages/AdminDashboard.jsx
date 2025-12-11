import React, { useState, useEffect } from "react";
import { Users, Shield, Activity, Plus, Search, HardDrive, Bell } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AdminMapView from "../components/AdminMapView";
import axios from "axios";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "https://sih-saksham.onrender.com";
export default function AdminDashboard() {
    const [devices, setDevices] = useState([]);
    const [events, setEvents] = useState([]);
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
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
    const [deviceForm, setDeviceForm] = useState({
        device_id: "",
        description: "",
        latitude: "",
        longitude: ""
    });
    
    // Modal states for stat cards
    const [showDevicesModal, setShowDevicesModal] = useState(false);
    const [showOfficersModal, setShowOfficersModal] = useState(false);
    const [showEventsModal, setShowEventsModal] = useState(false);
    const [modalSearchQuery, setModalSearchQuery] = useState("");
    
    // Map focus states
    const [focusedEvent, setFocusedEvent] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.log("Could not get user location:", error);
                }
            );
        }
    }, []);

    // Handler for clicking on an event in the modal
    const handleEventClick = (event) => {
        setFocusedEvent(event);
        setShowEventsModal(false);
        setModalSearchQuery("");
        // Scroll to map
        document.getElementById('admin-map-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        fetchDevices();
        fetchOfficers();
        fetchEvents();
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
            const devicesData = Array.isArray(res.data) ? res.data : [];
            setDevices(devicesData);
        } catch (err) {
            console.error("Error fetching devices:", err);
            setDevices([]);
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
            // Ensure we have an array
            const officersData = Array.isArray(res.data) ? res.data : [];
            setOfficers(officersData);
        } catch (err) {
            console.error("Error fetching officers:", err);
            console.error("Error details:", err.response?.data);
            setOfficers([]); // Set empty array on error
            // Only show toast if it's not a 404 or empty response
            // if (err.response?.status !== 404) {
            //     toast.error("Failed to fetch officers");
            // }
        }
    };

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get(`${API_BASE_URL}/api/events`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const eventsData = Array.isArray(res.data) ? res.data : [];
            setEvents(eventsData);
        } catch (err) {
            console.error("Error fetching events:", err);
            setEvents([]);
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

    const handleDeviceFormChange = (e) => {
        setDeviceForm({
            ...deviceForm,
            [e.target.name]: e.target.value
        });
    };

    const handleAddDevice = async () => {
        // Validation
        if (!deviceForm.device_id || !deviceForm.latitude || !deviceForm.longitude) {
            toast.error("Device ID, Latitude, and Longitude are required");
            return;
        }

        // Validate latitude and longitude
        const lat = parseFloat(deviceForm.latitude);
        const lng = parseFloat(deviceForm.longitude);

        if (isNaN(lat) || lat < -90 || lat > 90) {
            toast.error("Latitude must be between -90 and 90");
            return;
        }

        if (isNaN(lng) || lng < -180 || lng > 180) {
            toast.error("Longitude must be between -180 and 180");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(
                `${API_BASE_URL}/api/devices/create`,
                {
                    device_id: deviceForm.device_id,
                    description: deviceForm.description || null,
                    latitude: lat,
                    longitude: lng
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success("Device added successfully!");

            // Reset form and close modal
            setDeviceForm({
                device_id: "",
                description: "",
                latitude: "",
                longitude: ""
            });
            setShowAddDeviceModal(false);

            // Refresh devices list
            fetchDevices();

        } catch (err) {
            console.error("Error adding device:", err);
            const errorMessage = err.response?.data?.error || "Failed to add device";
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
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                                onClick={() => setShowAlertModal(true)}
                            >
                                <Bell className="w-4 h-4 mr-2" />
                                Send Alert
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                                onClick={() => setShowAddDeviceModal(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Device
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

                    {/* Notification Dropdown Panel */}
                    {showNotifications && (
                        <div className="notification-panel absolute right-6 top-20 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
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
                                            onClick={() => !notification.read && handleMarkAsRead(notification.id)}
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
                    { }
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div 
                            onClick={() => setShowDevicesModal(true)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center cursor-pointer hover:shadow-md hover:border-blue-200 transition-all"
                        >
                            <div className="p-3 bg-blue-100 rounded-xl mr-4">
                                <HardDrive className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Devices</p>
                                <h3 className="text-2xl font-bold text-gray-800">{devices.length}</h3>
                            </div>
                        </div>
                        <div 
                            onClick={() => setShowOfficersModal(true)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center cursor-pointer hover:shadow-md hover:border-emerald-200 transition-all"
                        >
                            <div className="p-3 bg-emerald-100 rounded-xl mr-4">
                                <Shield className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Active Officers</p>
                                <h3 className="text-2xl font-bold text-gray-800">{officers.length}</h3>
                            </div>
                        </div>
                        <div 
                            onClick={() => setShowEventsModal(true)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center cursor-pointer hover:shadow-md hover:border-purple-200 transition-all"
                        >
                            <div className="p-3 bg-purple-100 rounded-xl mr-4">
                                <Activity className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Events</p>
                                <h3 className="text-2xl font-bold text-gray-800">{events.length}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Map View Section */}
                    <div id="admin-map-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800">Device Locations & Detections Map</h2>
                            <p className="text-sm text-gray-500 mt-1">Real-time locations of all registered devices and elephant detections</p>
                        </div>
                        <div className="p-6">
                            {devices.length > 0 || events.length > 0 ? (
                                <AdminMapView 
                                    devices={devices} 
                                    detections={events} 
                                    userLocation={userLocation}
                                    focusedEvent={focusedEvent}
                                />
                            ) : (
                                <div className="h-[500px] flex items-center justify-center bg-gray-50 rounded-xl">
                                    <div className="text-center text-gray-400">
                                        <HardDrive className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                        <p className="text-lg font-medium">No data available</p>
                                        <p className="text-sm">Devices and detections will appear here once registered</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    { }
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
                    { }
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
                    { }
                    {showAddModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
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
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
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

                    {/* Add Device Modal */}
                    {showAddDeviceModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
                            <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <HardDrive className="w-5 h-5 text-blue-600" />
                                    Add New Device
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Device ID *</label>
                                        <input
                                            type="text"
                                            name="device_id"
                                            value={deviceForm.device_id}
                                            onChange={handleDeviceFormChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="e.g., DEV-001"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <input
                                            type="text"
                                            name="description"
                                            value={deviceForm.description}
                                            onChange={handleDeviceFormChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="Device description (optional)"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                                            <input
                                                type="number"
                                                name="latitude"
                                                value={deviceForm.latitude}
                                                onChange={handleDeviceFormChange}
                                                step="0.000001"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                placeholder="21.34"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                                            <input
                                                type="number"
                                                name="longitude"
                                                value={deviceForm.longitude}
                                                onChange={handleDeviceFormChange}
                                                step="0.000001"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                placeholder="82.75"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            onClick={() => {
                                                setShowAddDeviceModal(false);
                                                setDeviceForm({
                                                    device_id: "",
                                                    description: "",
                                                    latitude: "",
                                                    longitude: ""
                                                });
                                            }}
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddDevice}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                            disabled={isSubmitting}
                                        >
                                            <HardDrive className="w-4 h-4" />
                                            {isSubmitting ? "Adding..." : "Add Device"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Devices Modal */}
                    {showDevicesModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col">
                                {/* Modal Header */}
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <HardDrive className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">All Devices</h3>
                                            <p className="text-sm text-gray-500">{devices.length} total devices</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowDevicesModal(false);
                                            setModalSearchQuery("");
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="relative">
                                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="Search devices by ID, description, or location..."
                                            value={modalSearchQuery}
                                            onChange={(e) => setModalSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Devices List */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    <div className="space-y-3">
                                        {devices
                                            .filter(device => 
                                                device.device_id?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                                                device.description?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                                                device.latitude?.toString().includes(modalSearchQuery) ||
                                                device.longitude?.toString().includes(modalSearchQuery)
                                            )
                                            .map((device) => (
                                                <div key={device.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h4 className="font-semibold text-gray-900">{device.device_id}</h4>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    device.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                    {device.status || 'Offline'}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 mb-2">{device.description || 'No description'}</p>
                                                            <div className="flex gap-4 text-xs text-gray-500">
                                                                <span>📍 Lat: {device.latitude}</span>
                                                                <span>Lng: {device.longitude}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        {devices.filter(device => 
                                            device.device_id?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                                            device.description?.toLowerCase().includes(modalSearchQuery.toLowerCase())
                                        ).length === 0 && (
                                            <div className="text-center py-12">
                                                <HardDrive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500">No devices found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Officers Modal */}
                    {showOfficersModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col">
                                {/* Modal Header */}
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-100 rounded-lg">
                                            <Shield className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">All Officers</h3>
                                            <p className="text-sm text-gray-500">{officers.length} active officers</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowOfficersModal(false);
                                            setModalSearchQuery("");
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="relative">
                                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="Search officers by name or email..."
                                            value={modalSearchQuery}
                                            onChange={(e) => setModalSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Officers List */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    <div className="space-y-3">
                                        {officers
                                            .filter(officer => 
                                                officer.name?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                                                officer.email?.toLowerCase().includes(modalSearchQuery.toLowerCase())
                                            )
                                            .map((officer) => (
                                                <div key={officer.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h4 className="font-semibold text-gray-900">{officer.name}</h4>
                                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                                                    Officer
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 mb-2">✉️ {officer.email}</p>
                                                            <div className="flex gap-4 text-xs text-gray-500">
                                                                <span>ID: {officer.id}</span>
                                                                <span>Joined: {officer.created_at ? new Date(officer.created_at).toLocaleDateString() : 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        {officers.filter(officer => 
                                            officer.name?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                                            officer.email?.toLowerCase().includes(modalSearchQuery.toLowerCase())
                                        ).length === 0 && (
                                            <div className="text-center py-12">
                                                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500">No officers found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Events Modal */}
                    {showEventsModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col">
                                {/* Modal Header */}
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Activity className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">All Detection Events</h3>
                                            <p className="text-sm text-gray-500">{events.length} total events</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowEventsModal(false);
                                            setModalSearchQuery("");
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="relative">
                                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="Search events by device ID or location..."
                                            value={modalSearchQuery}
                                            onChange={(e) => setModalSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Events List */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    <div className="space-y-3">
                                        {events
                                            .filter(event => 
                                                event.source_device?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                                                event.device_id?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                                                event.latitude?.toString().includes(modalSearchQuery) ||
                                                event.longitude?.toString().includes(modalSearchQuery)
                                            )
                                            .map((event) => (
                                                <div 
                                                    key={event.id} 
                                                    onClick={() => handleEventClick(event)}
                                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-2xl">🐘</span>
                                                                <h4 className="font-semibold text-gray-900">Elephant Detection</h4>
                                                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                                                    Alert
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 mb-2">
                                                                Device: {event.source_device || event.device_id || 'Unknown'}
                                                            </p>
                                                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-2">
                                                                <span>📍 Lat: {event.latitude?.toFixed(6)}</span>
                                                                <span>Lng: {event.longitude?.toFixed(6)}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-400">
                                                                🕐 {new Date(event.detected_at || event.created_at).toLocaleString()}
                                                            </p>
                                                            <p className="text-xs text-purple-600 font-medium mt-2">
                                                                👆 Click to view on map
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        {events.filter(event => 
                                            event.source_device?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                                            event.device_id?.toLowerCase().includes(modalSearchQuery.toLowerCase())
                                        ).length === 0 && (
                                            <div className="text-center py-12">
                                                <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500">No events found</p>
                                            </div>
                                        )}
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
