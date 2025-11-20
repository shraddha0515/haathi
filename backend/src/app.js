import express from "express";
import cors from "cors";

import sensorRoutes from "./routes/sensor.js";
import elephantRoutes from "./routes/elephant.js";

const app = express();

app.use(cors());
app.use(express.json());   // IMPORTANT: allows ESP32 to send JSON

app.use("/api", sensorRoutes);
app.use("/api/elephants", elephantRoutes);

export default app;
