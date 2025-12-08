import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSocket } from "../context/SocketContext";
import MapView from "../components/MapView";
import { Bell, Map as MapIcon, AlertTriangle, ShieldCheck, Globe } from "lucide-react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "https://sih-saksham.onrender.com";

export default function UserDashboard() {
    const { t, i18n } = useTranslation();
    const { latestEvent } = useSocket();
    const [userLocation, setUserLocation] = useState(null);
    const [elephantLocation, setElephantLocation] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isSafe, setIsSafe] = useState(true);

    // 1. Get User Location
    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => console.error("Error getting location:", error),
                { enableHighAccuracy: true }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    // 2. Handle Real-time Events (Socket)
    useEffect(() => {
        if (latestEvent) {
            // Update Elephant Location
            if (latestEvent.latitude && latestEvent.longitude) {
                setElephantLocation([latestEvent.latitude, latestEvent.longitude]);
                setIsSafe(false); // Assume danger if event received
            }

            // Add to notifications
            const newNotif = {
                id: Date.now(),
                message: `Elephant detected at ${latestEvent.latitude.toFixed(4)}, ${latestEvent.longitude.toFixed(4)}`,
                time: new Date().toLocaleTimeString(),
                type: "warning",
            };
            setNotifications((prev) => [newNotif, ...prev]);
        }
    }, [latestEvent]);

    // 3. Initial Fetch of Latest Event (API)
    useEffect(() => {
        const fetchLatest = async () => {
            try {
                // Fetching all events for now to get the latest one
                const res = await axios.get(`${API_BASE_URL}/api/events`);
                if (res.data && res.data.length > 0) {
                    // Assuming the API returns an array and we take the first one as latest
                    // Or sort by timestamp if needed. For now taking the first one.
                    const latest = res.data[0];
                    if (latest.latitude && latest.longitude) {
                        setElephantLocation([latest.latitude, latest.longitude]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch latest events", err);
            }
        };
        fetchLatest();
    }, []);

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
    };

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{t("dashboard_title")}</h1>
                    <p className="text-gray-500 text-sm mt-1">{t("welcome")}, User</p>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                    >
                        <Globe className="w-4 h-4 mr-2 text-blue-500" />
                        {t("switch_language")}
                    </button>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium text-sm whitespace-nowrap">
                        {t("status_active")}
                    </span>
                </div>
            </div>

            {/* Safety Alert Banner */}
            {!isSafe ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl animate-pulse">
                    <div className="flex items-center">
                        <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                        <div>
                            <h3 className="text-red-800 font-bold text-lg">{t("danger_alert")}</h3>
                            <p className="text-red-600 text-sm">Please move to a safe location immediately.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl">
                    <div className="flex items-center">
                        <ShieldCheck className="w-6 h-6 text-emerald-600 mr-3" />
                        <div>
                            <h3 className="text-emerald-800 font-bold">{t("safe_status")}</h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map Section */}
                <div className="lg:col-span-2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center mb-4">
                        <MapIcon className="w-5 h-5 text-emerald-500 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-700">{t("live_map")}</h2>
                    </div>
                    <MapView userLocation={userLocation} elephantLocation={elephantLocation} />
                </div>

                {/* Notifications Section */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-fit max-h-[600px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b border-gray-100">
                        <div className="flex items-center">
                            <Bell className="w-5 h-5 text-emerald-500 mr-2" />
                            <h2 className="text-lg font-semibold text-gray-700">{t("notifications")}</h2>
                        </div>
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {notifications.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-3 rounded-xl border-l-4 ${notif.type === 'warning' ? 'border-amber-500 bg-amber-50' : 'border-blue-500 bg-blue-50'
                                        }`}
                                >
                                    <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Bell className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                                <p className="text-gray-400 text-sm">{t("no_notifications")}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
