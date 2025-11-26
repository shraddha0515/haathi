import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { createServer } from "http";
import { Server } from "socket.io";

import eventRoutes from "./routes/eventRoutes.js";
import deviceRoutes from "./routes/devices.js";


dotenv.config();

import db from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",                // local frontend
  "http://localhost:3000",                // optional
  "exp://*",                              // Expo mobile app
  "https://your-frontend-url.vercel.app", // deployed frontend
 
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith("exp://")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

// Create HTTP server
const server = createServer(app);
// Setup Socket.IO
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  },
});

// Listen for WebSocket connections
io.on("connection", (socket) => {
  console.log("New WebSocket client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
// Routes

// ---------------------- ROUTES ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/events", eventRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

// Database health check
app.get("/health", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({
      status: "healthy",
      database: "connected",
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message,
    });
  }
});

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server + WebSockets running on http://localhost:${PORT}`);
});
