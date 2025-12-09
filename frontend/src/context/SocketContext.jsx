import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "https://sih-saksham.onrender.com";
const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [latestEvent, setLatestEvent] = useState(null);
    const [connected, setConnected] = useState(false);
    useEffect(() => {
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
            console.log("New Event Received:", data);
            setLatestEvent(data);
        });
        return () => {
            newSocket.close();
        };
    }, []);
    return (
        <SocketContext.Provider value={{ socket, latestEvent, connected }}>
            {children}
        </SocketContext.Provider>
    );
};
