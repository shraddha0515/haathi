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

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow mobile apps + dev tools

      const allowed = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        /\.ngrok-free\.app$/,
        /^exp:\/\/.*/
      ];

      const isAllowed = allowed.some((o) => {
        if (o instanceof RegExp) return o.test(origin);
        return o === origin;
      });

      if (isAllowed) callback(null, true);
      else callback(new Error("CORS: Origin Not Allowed -> " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
