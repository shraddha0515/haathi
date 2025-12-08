import express from "express";
import { register, login, getProfile, logout, refresh } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getProfile);
router.post("/logout", authMiddleware, logout);

router.post("/refresh", refresh);

export default router;