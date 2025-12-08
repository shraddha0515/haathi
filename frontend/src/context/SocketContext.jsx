import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "https://sih-saksham.onrender.com";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [latestEvent, setLatestEvent] = useState(null);

    useEffect(() => {
        const newSocket = io(API_BASE_URL);
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Socket connected");
        });

        newSocket.on("new_event", (data) => {
            console.log("New Event Received:", data);
            setLatestEvent(data);
        });

        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={{ socket, latestEvent }}>
            {children}
        </SocketContext.Provider>
    );
};
