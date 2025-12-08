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


router.post(
  "/create",
  authMiddleware,
  requireRole("admin"),
  createDevice
);

router.get(
  "/",
  authMiddleware,
  requireRole("admin", "officer"),
  getDevices
);


router.get(
  "/:id",
  authMiddleware,
  requireRole("admin", "officer"),
  getDeviceById
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  updateDevice
);


router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  deleteDevice
);

export default router;