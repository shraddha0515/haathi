import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import axios from "axios";
import MapModal from "../components/MapModal";
import {
    requestNotificationPermission,
    showElephantDetectionNotification,
    showProximityAlertNotification,
    areNotificationsEnabled,
    playAlertSound,
    stopAlertSound,
} from "../utils/notificationUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "https://sih-saksham.onrender.com";
const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [latestEvent, setLatestEvent] = useState(null);
    const [connected, setConnected] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [mapModalOpen, setMapModalOpen] = useState(false);
    const [modalEventData, setModalEventData] = useState(null);
    const [modalDeviceLocation, setModalDeviceLocation] = useState(null);

    // Function to fetch device location
    const fetchDeviceLocation = async (deviceId) => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get(`${API_BASE_URL}/api/devices`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const devices = Array.isArray(res.data) ? res.data : [];
            const device = devices.find(d => d.device_id === deviceId);
            return device || null;
        } catch (err) {
            console.error("Error fetching device location:", err);
            return null;
        }
    };

    // Function to open map modal with event data (exported via context)
    const openMapModal = async (eventData) => {
        setModalEventData(eventData);

        // Fetch device location if we have a device ID
        if (eventData.source_device || eventData.device_id) {
            const deviceId = eventData.source_device || eventData.device_id;
            const deviceLocation = await fetchDeviceLocation(deviceId);
            setModalDeviceLocation(deviceLocation);
        }

        setMapModalOpen(true);
    };

    // Custom toast content with click handler
    const ToastContent = ({ message, eventData }) => (
        <div
            onClick={() => {
                stopAlertSound(); // Stop the alarm when toast is clicked
                openMapModal(eventData);
            }}
            className="cursor-pointer hover:opacity-90 transition-opacity"
        >
            <div className="font-semibold">{message}</div>
            <div className="text-xs mt-1 opacity-75">Click to view on map</div>
        </div>
    );

    useEffect(() => {
        // Request notification permission on mount
        requestNotificationPermission().then((granted) => {
            setNotificationsEnabled(granted);
            if (granted) {
                console.log("✅ Browser notifications enabled");
            } else {
                console.warn("⚠️ Browser notifications not enabled");
                toast.info("Enable notifications to receive elephant alerts!", {
                    position: "top-center",
                    autoClose: 5000,
                });
            }
        });

        // Listen for browser notification clicks
        const handleNotificationClick = (event) => {
            stopAlertSound(); // Stop the alarm when browser notification is clicked
            openMapModal(event.detail);
        };
        window.addEventListener('openElephantMap', handleNotificationClick);

        const newSocket = io(API_BASE_URL, {
            transports: ["websocket", "polling"],
            withCredentials: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
            setConnected(true);
        });

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
            setConnected(false);
        });

        newSocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error.message);
            setConnected(false);
        });

        newSocket.on("new_event", (data) => {
            console.log("🐘 New Elephant Detection Event:", data);
            setLatestEvent(data);

            // Play alarm sound for all notifications
            playAlertSound();

            // Show browser notification
            if (areNotificationsEnabled()) {
                showElephantDetectionNotification(data);
            }

            // Show clickable toast notification
            toast.warning(
                <ToastContent
                    message={`🐘 Elephant Detected! Device ${data.source_device} at (${data.latitude?.toFixed(4)}, ${data.longitude?.toFixed(4)})`}
                    eventData={data}
                />,
                {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: false,
                    closeOnClick: false, // Prevent default close on click
                    pauseOnHover: true,
                    draggable: true,
                }
            );
        });

        newSocket.on("proximity_alert", (data) => {
            console.log("⚠️ Proximity Alert:", data);

            // Play alarm sound for all notifications
            playAlertSound();

            // Show browser notification
            if (areNotificationsEnabled()) {
                showProximityAlertNotification(data);
            }

            // Show clickable toast notification
            const eventData = data.detection || data;
            toast.error(
                <ToastContent
                    message={`⚠️ Proximity Alert! Elephant near ${data.hotspot?.name} (${Math.round(data.hotspot?.distance_meters)}m away)`}
                    eventData={eventData}
                />,
                {
                    position: "top-right",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: false, // Prevent default close on click
                    pauseOnHover: true,
                    draggable: true,
                }
            );
        });

        return () => {
            window.removeEventListener('openElephantMap', handleNotificationClick);
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, latestEvent, connected, notificationsEnabled, openMapModal }}>
            {children}
            <MapModal
                isOpen={mapModalOpen}
                onClose={() => setMapModalOpen(false)}
                eventData={modalEventData}
                deviceLocation={modalDeviceLocation}
            />
        </SocketContext.Provider>
    );
};
