import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import {
  requestNotificationPermission,
  showElephantDetectionNotification,
  showProximityAlertNotification,
  areNotificationsEnabled,
} from "../utils/notificationUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "https://sih-saksham.onrender.com";
const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [latestEvent, setLatestEvent] = useState(null);
    const [connected, setConnected] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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

            // Show browser notification
            if (areNotificationsEnabled()) {
                showElephantDetectionNotification(data);
            }

            // Show toast notification as fallback
            toast.warning(
                `🐘 Elephant Detected! Device ${data.source_device} at (${data.latitude?.toFixed(4)}, ${data.longitude?.toFixed(4)})`,
                {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
        });

        newSocket.on("proximity_alert", (data) => {
            console.log("⚠️ Proximity Alert:", data);

            // Show browser notification
            if (areNotificationsEnabled()) {
                showProximityAlertNotification(data);
            }

            // Show toast notification as fallback
            toast.error(
                `⚠️ Proximity Alert! Elephant near ${data.hotspot?.name} (${Math.round(data.hotspot?.distance_meters)}m away)`,
                {
                    position: "top-right",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
        });

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, latestEvent, connected, notificationsEnabled }}>
            {children}
        </SocketContext.Provider>
    );
};
