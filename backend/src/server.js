import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sensorRoutes from "./routes/sensor.js";
import elephantRoutes from "./routes/elephant.js";
import authRoutes from "./routes/auth.js";
import detectionRoutes from "./routes/detections.js";
import deviceRoutes from "./routes/devices.js";

dotenv.config();

import db from "./config/db.js";


const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-frontend-domain.vercel.app', // Add your frontend URL later
    'https://your-frontend-domain.netlify.app'
  ],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/sensors", sensorRoutes);
app.use("/api/elephants", elephantRoutes);
app.use("/api/detections", detectionRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);

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
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      status: "unhealthy",
      database: "disconnected",
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});