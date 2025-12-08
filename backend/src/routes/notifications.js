import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  registerFCMToken,
  sendNotificationToAll,
  getUserNotifications,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/register-token", authMiddleware, registerFCMToken);

router.post(
  "/send-all",
  authMiddleware,
  requireRole("admin"),
  sendNotificationToAll
);

router.get("/my", authMiddleware, getUserNotifications);

router.put("/:id/read", authMiddleware, markAsRead);

export default router;
