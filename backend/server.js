import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.js";
import { createServer } from "http";
import { Server } from "socket.io";
import notificationRoutes from "./src/routes/notifications.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import deviceRoutes from "./src/routes/devices.js";
import hotspotRoutes from "./src/routes/hotspots.js";
import userRoutes from "./src/routes/users.js";
import healthRoutes from "./src/routes/healthRoutes.js";

dotenv.config();

import db from "./src/config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://haathi.vercel.app",
  "https://airavata.vercel.app",
  /\.ngrok-free\.app$/,
  /^exp:\/\/.*/,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((o) => {
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
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((o) => {
        if (o instanceof RegExp) return o.test(origin);
        return o === origin;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn("Socket.IO CORS blocked:", origin);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
  allowEIO3: true,
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
app.use("/api/hotspots", hotspotRoutes);
app.use("/api/users", userRoutes);
app.use("/api", healthRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server + WebSockets running on http://localhost:${PORT}`);
});
