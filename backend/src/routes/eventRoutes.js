import express from "express";
import {
  receiveEvent,
  getLatestEvent,
  getEventHistory,
  getAllEvents
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/receive", receiveEvent);
router.get("/latest/:device_id", getLatestEvent);
router.get("/history/:device_id", getEventHistory);
router.get("/", getAllEvents);

export default router;
