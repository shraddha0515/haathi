import express from "express";
import {
  receiveEvent,
  getLatestEvent,
  getEventHistory,
  getAllEvents
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/receive", receiveEvent);                  // Raspberry Pi
router.get("/latest/:device_id", getLatestEvent);       // Frontend map
router.get("/history/:device_id", getEventHistory);     // Movement log
router.get("/", getAllEvents);                          // Admin/Officer list

export default router;
