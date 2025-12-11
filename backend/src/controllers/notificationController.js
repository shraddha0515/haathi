import admin from '../config/firebase.js';
import db from '../config/db.js';
import { io } from '../../server.js';
import notificationService from '../services/notificationService.js';

/**
 * Register FCM token or Expo Push Token
 * Supports both web and mobile platforms
 */
export const registerFCMToken = async (req, res) => {
  try {
    const { fcm_token, device_type, platform, token } = req.body;
    const userId = req.user.id;

    // Support both old format (fcm_token) and new format (token + platform)
    const pushToken = token || fcm_token;
    const devicePlatform = platform || device_type || 'web';

    if (!pushToken) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Validate platform
    const validPlatforms = ['web', 'android', 'ios'];
    if (!validPlatforms.includes(devicePlatform)) {
      return res.status(400).json({ 
        error: 'Invalid platform. Must be: web, android, or ios' 
      });
    }

    // Determine which column to update based on platform
    let updateQuery;
    let updateParams;

    if (devicePlatform === 'web') {
      // Update FCM web token
      updateQuery = `
        UPDATE users 
        SET fcm_web_token = $1, 
            device_platform = $2, 
            last_token_update = NOW()
        WHERE id = $3
        RETURNING id, name, email
      `;
      updateParams = [pushToken, devicePlatform, userId];
    } else {
      // Update Expo push token for mobile
      updateQuery = `
        UPDATE users 
        SET expo_push_token = $1, 
            device_platform = $2, 
            last_token_update = NOW()
        WHERE id = $3
        RETURNING id, name, email
      `;
      updateParams = [pushToken, devicePlatform, userId];
    }

    const result = await db.query(updateQuery, updateParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ ${devicePlatform} token registered for user ${userId}`);

    // Also keep the old user_fcm_tokens table for backward compatibility
    if (devicePlatform === 'web') {
      await db.query(
        `INSERT INTO user_fcm_tokens (user_id, fcm_token, device_type)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, fcm_token) 
         DO UPDATE SET device_type = $3`,
        [userId, pushToken, devicePlatform]
      );
    }

    res.json({ 
      message: 'FCM token registered',
      platform: devicePlatform
    });
  } catch (err) {
    console.error('FCM token error:', err);
    res.status(500).json({ error: 'Failed to register FCM token' });
  }
};

/**
 * Send push notification using unified service (web + mobile)
 */
export const sendPushNotification = async (userIds, title, body, data = {}) => {
  try {
    // Get users with their tokens
    const result = await db.query(
      `SELECT id, name, email, expo_push_token, fcm_web_token 
       FROM users 
       WHERE id = ANY($1)
       AND (expo_push_token IS NOT NULL OR fcm_web_token IS NOT NULL)`,
      [userIds]
    );

    const users = result.rows;

    if (users.length === 0) {
      console.log('⚠️ No users with push tokens found');
      return { sent: 0, failed: 0 };
    }

    // Use unified notification service
    const notificationData = {
      title,
      body,
      data
    };

    const results = await notificationService.sendToAll(users, notificationData);

    console.log('📊 Notification Results:');
    console.log(`  Web: ${results.web.sent} sent, ${results.web.failed} failed`);
    console.log(`  Mobile: ${results.mobile.sent} sent, ${results.mobile.failed} failed`);

    return results;
  } catch (err) {
    console.error('❌ Push notification error:', err);
    return { error: err.message };
  }
};

/**
 * Send notification to all users (admin only)
 */
export const sendNotificationToAll = async (req, res) => {
  try {
    const { title, body, data } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    // Get all users
    const result = await db.query(`SELECT id FROM users`);
    const userIds = result.rows.map(row => row.id);

    // Save to database
    await db.query(
      `INSERT INTO notifications (user_id, title, body, data)
       SELECT id, $1, $2, $3 FROM users`,
      [title, body, JSON.stringify(data || {})]
    );

    // Send push notifications
    const pushResults = await sendPushNotification(userIds, title, body, data);

    // Emit WebSocket event
    io.emit('notification', {
      title,
      body,
      data,
      timestamp: new Date().toISOString(),
    });

    res.json({ 
      message: 'Notification sent to all users',
      results: pushResults
    });
  } catch (err) {
    console.error('Send notification error:', err);
    res.status(500).json({ error: 'Failed to send notification' });
  }
};

/**
 * Get user's notifications
 */
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const result = await db.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await db.query(
      `UPDATE notifications SET read = TRUE 
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};
