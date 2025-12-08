import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  registerFCMToken,
  sendNotificationToAll,
  getUserNotifications,
  markAsRead
} from '../controllers/notificationController.js';

const router = express.Router();

// Register FCM token (all authenticated users)
router.post('/register-token', authMiddleware, registerFCMToken);

// Send notification to all users (admin only)
router.post('/send-all', authMiddleware, requireRole('admin'), sendNotificationToAll);

// Get user's notifications
router.get('/my', authMiddleware, getUserNotifications);

// Mark as read
router.put('/:id/read', authMiddleware, markAsRead);

export default router;