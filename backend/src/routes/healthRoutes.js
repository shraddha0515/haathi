import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const dbHealth = await db.healthCheck();
    const poolStats = db.getStats();
    
    const health = {
      status: dbHealth.healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: dbHealth.healthy,
        serverTime: dbHealth.timestamp || null,
        error: dbHealth.error || null
      },
      connectionPool: {
        total: poolStats.totalCount,
        idle: poolStats.idleCount,
        waiting: poolStats.waitingCount,
        active: poolStats.totalCount - poolStats.idleCount
      },
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB'
      }
    };
    
    const statusCode = dbHealth.healthy ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Database stats endpoint
router.get('/db-stats', async (req, res) => {
  try {
    const stats = db.getStats();
    res.json({
      pool: stats,
      recommendations: {
        healthy: stats.waitingCount === 0,
        message: stats.waitingCount > 0 
          ? `⚠️ ${stats.waitingCount} queries waiting for connection. Consider increasing pool size.`
          : '✅ Connection pool is healthy'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
