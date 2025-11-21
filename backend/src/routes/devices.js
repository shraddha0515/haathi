import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  createDevice,
  getDevices,
  getDeviceById,
  updateDevice,
  deleteDevice
} from "../controllers/deviceController.js";

const router = express.Router();

// Admin-only: add a new device
router.post(
  "/create",
  authMiddleware,
  requireRole("admin"),
  createDevice
);

// Admin + Officer: view devices
router.get(
  "/",
  authMiddleware,
  requireRole("admin", "officer"),
  getDevices
);

// Admin + Officer: view one device
router.get(
  "/:id",
  authMiddleware,
  requireRole("admin", "officer"),
  getDeviceById
);

// Admin-only: update device
router.put(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  updateDevice
);

// Admin-only: delete device
router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  deleteDevice
);

export default router;
