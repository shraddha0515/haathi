import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * Register/Update user's push token (Web or Mobile)
 * POST /api/notifications/register-token
 * Body: { 
 *   token: "ExponentPushToken[...]" or "fcm-web-token",
 *   platform: "android" | "ios" | "web"
 * }
 */
router.post('/register-token', authenticateToken, async (req, res) => {
  try {
    const { token, platform } = req.body;
    const userId = req.user.id;

    if (!token || !platform) {
      return res.status(400).json({ 
        error: 'Token and platform are required',
        received: { token: !!token, platform: !!platform }
      });
    }

    // Validate platform
    const validPlatforms = ['web', 'android', 'ios'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ 
        error: 'Invalid platform. Must be: web, android, or ios',
        received: platform
      });
    }

    // Validate token format based on platform
    if (platform === 'android' || platform === 'ios') {
      if (!token.startsWith('ExponentPushToken[')) {
        return res.status(400).json({ 
          error: 'Invalid Expo Push Token format. Should start with "ExponentPushToken["',
          received: token.substring(0, 30) + '...'
        });
      }
    }

    // Determine which column to update
    let updateQuery;
    let updateParams;

    if (platform === 'web') {
      updateQuery = `
        UPDATE users 
        SET fcm_web_token = $1, 
            device_platform = $2, 
            last_token_update = NOW()
        WHERE id = $3
        RETURNING id, name, email, device_platform, last_token_update
      `;
      updateParams = [token, platform, userId];
    } else {
      // android or ios
      updateQuery = `
        UPDATE users 
        SET expo_push_token = $1, 
            device_platform = $2, 
            last_token_update = NOW()
        WHERE id = $3
        RETURNING id, name, email, device_platform, last_token_update
      `;
      updateParams = [token, platform, userId];
    }

    const result = await db.query(updateQuery, updateParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    console.log(`✅ ${platform} token registered for user ${userId} (${user.email})`);

    res.json({ 
      success: true, 
      message: `${platform} push token registered successfully`,
      platform,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        platform: user.device_platform,
        lastUpdate: user.last_token_update
      }
    });

  } catch (error) {
    console.error('❌ Error registering token:', error);
    res.status(500).json({ 
      error: 'Failed to register push token',
      details: error.message
    });
  }
});

/**
 * Remove user's push token (for logout or opt-out)
 * DELETE /api/notifications/remove-token
 * Body: { platform: "android" | "ios" | "web" }
 */
router.delete('/remove-token', authenticateToken, async (req, res) => {
  try {
    const { platform } = req.body;
    const userId = req.user.id;

    if (!platform) {
      return res.status(400).json({ error: 'Platform is required' });
    }

    let updateQuery;
    if (platform === 'web') {
      updateQuery = `
        UPDATE users 
        SET fcm_web_token = NULL, 
            last_token_update = NOW()
        WHERE id = $1
        RETURNING id
      `;
    } else {
      updateQuery = `
        UPDATE users 
        SET expo_push_token = NULL, 
            last_token_update = NOW()
        WHERE id = $1
        RETURNING id
      `;
    }

    await db.query(updateQuery, [userId]);

    console.log(`🗑️ ${platform} token removed for user ${userId}`);

    res.json({ 
      success: true, 
      message: `${platform} push token removed successfully`
    });

  } catch (error) {
    console.error('❌ Error removing token:', error);
    res.status(500).json({ 
      error: 'Failed to remove push token',
      details: error.message
    });
  }
});

/**
 * Get user's current notification settings
 * GET /api/notifications/settings
 */
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT 
        id, 
        name, 
        email, 
        device_platform,
        CASE WHEN expo_push_token IS NOT NULL THEN true ELSE false END as has_mobile_token,
        CASE WHEN fcm_web_token IS NOT NULL THEN true ELSE false END as has_web_token,
        last_token_update
      FROM users 
      WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        platform: user.device_platform,
        hasMobileNotifications: user.has_mobile_token,
        hasWebNotifications: user.has_web_token,
        lastUpdate: user.last_token_update
      }
    });

  } catch (error) {
    console.error('❌ Error fetching notification settings:', error);
    res.status(500).json({ 
      error: 'Failed to fetch notification settings',
      details: error.message
    });
  }
});

/**
 * Send custom alert to all users (Admin only)
 * POST /api/notifications/send-alert
 * Body: { 
 *   title: "Alert Title",
 *   message: "Alert message",
 *   priority: "low" | "medium" | "high" | "critical"
 * }
 */
router.post('/send-alert', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Forbidden. Only admins can send alerts to all users.' 
      });
    }

    const { title, message, priority } = req.body;

    if (!title || !message) {
      return res.status(400).json({ 
        error: 'Title and message are required' 
      });
    }

    // Get all users with notification tokens
    const usersResult = await db.query(
      `SELECT id, name, email, expo_push_token, fcm_web_token, device_platform
       FROM users 
       WHERE expo_push_token IS NOT NULL OR fcm_web_token IS NOT NULL`
    );

    const users = usersResult.rows;

    if (users.length === 0) {
      return res.json({ 
        success: true,
        message: 'No users with notification tokens found',
        sent: 0
      });
    }

    // Import notification service
    const notificationService = (await import('../services/notificationService.js')).default;

    // Send notifications
    const result = await notificationService.sendCustomNotification(users, {
      title,
      body: message,
      data: {
        type: 'admin_alert',
        priority: priority || 'medium',
        sent_at: new Date().toISOString()
      }
    });

    // Store notification in database for each user
    const notificationInserts = users.map(user => 
      db.query(
        `INSERT INTO notifications (user_id, title, body, data, read)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, title, message, JSON.stringify({ type: 'admin_alert', priority }), false]
      )
    );

    await Promise.all(notificationInserts);

    console.log(`✅ Admin alert sent to ${users.length} users`);

    res.json({
      success: true,
      message: `Alert sent successfully to ${users.length} users`,
      sent: result.totalSent,
      details: {
        web: result.web,
        mobile: result.mobile
      }
    });

  } catch (error) {
    console.error('❌ Error sending admin alert:', error);
    res.status(500).json({ 
      error: 'Failed to send alert',
      details: error.message
    });
  }
});

export default router;

