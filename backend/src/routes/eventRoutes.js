import express from "express";
import {
  receiveEvent,
  getLatestEvent,
  getEventHistory,
  getAllEvents,
} from "../controllers/eventController.js";

const router = express.Router();

// Main endpoint for hardware to send detection events
router.post("/", receiveEvent); // POST /api/events
router.post("/receive", receiveEvent); // POST /api/events/receive (alias)

// Query endpoints
router.get("/latest/:device_id", getLatestEvent);
router.get("/history/:device_id", getEventHistory);
router.get("/", getAllEvents);

export default router;
