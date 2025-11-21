import express from "express";
import { addDetection, getLatestDetection } from "../controllers/detectionController.js";

const router = express.Router();

router.post("/", addDetection);
router.get("/latest", getLatestDetection);

export default router;
