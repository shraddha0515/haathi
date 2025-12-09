import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { createServer } from "http";
import { Server } from "socket.io";
import notificationRoutes from "./routes/notifications.js";
import eventRoutes from "./routes/eventRoutes.js";
import deviceRoutes from "./routes/devices.js";
import hotspotRoutes from './routes/hotspots.js';


dotenv.config();

import db from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "exp://*",
  "https://haathi.vercel.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowed = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        /\.ngrok-free\.app$/,
        /^exp:\/\/.*/,
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

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New WebSocket client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/hotspots', hotspotRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

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

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server + WebSockets running on http://localhost:${PORT}`);
});
