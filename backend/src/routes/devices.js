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

/**
 * @route   POST /api/devices/create
 * @desc    Register a new device
 * @access  Admin only
 * @body    { device_id, description?, latitude, longitude }
 */
router.post(
  "/create",
  authMiddleware,
  requireRole("admin"),
  createDevice
);

/**
 * @route   GET /api/devices
 * @desc    Get all devices
 * @access  Admin + Officer
 */
router.get(
  "/",
  authMiddleware,
  requireRole("admin", "officer"),
  getDevices
);

/**
 * @route   GET /api/devices/:id
 * @desc    Get single device by ID
 * @access  Admin + Officer
 * @params  id - Device ID
 */
router.get(
  "/:id",
  authMiddleware,
  requireRole("admin", "officer"),
  getDeviceById
);

/**
 * @route   PUT /api/devices/:id
 * @desc    Update device location or description
 * @access  Admin only
 * @params  id - Device ID
 * @body    { description?, latitude?, longitude? }
 */
router.put(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  updateDevice
);

/**
 * @route   DELETE /api/devices/:id
 * @desc    Delete device
 * @access  Admin only
 * @params  id - Device ID
 */
router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  deleteDevice
);

export default router;