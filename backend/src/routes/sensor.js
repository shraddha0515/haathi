import express from "express";
import { receiveSensorData } from "../controllers/sensorController.js";

const router = express.Router();

router.post("/gps", receiveSensorData);

export default router;
