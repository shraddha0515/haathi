import express from "express";
import {
  getAllUsers,
  getUsersByRole,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {requireRole} from "../middleware/roleMiddleware.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(requireRole(["admin"]));

// Get all users
router.get("/", getAllUsers);

// Search users
router.get("/search", searchUsers);

// Get users by role
router.get("/role/:role", getUsersByRole);

// Get user by ID
router.get("/:id", getUserById);

// Update user
router.put("/:id", updateUser);

// Delete user
router.delete("/:id", deleteUser);

export default router;
