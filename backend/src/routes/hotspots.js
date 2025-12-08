import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  createHotspot,
  getHotspots,
  getHotspotById,
  updateHotspot,
  deleteHotspot
} from '../controllers/hotspotController.js';

const router = express.Router();

// Public routes (read-only)
router.get('/', getHotspots);
router.get('/:id', getHotspotById);

// Protected routes (create/update/delete)
router.post('/', authMiddleware, requireRole('admin', 'officer'), createHotspot);
router.put('/:id', authMiddleware, requireRole('admin', 'officer'), updateHotspot);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteHotspot);

export default router;