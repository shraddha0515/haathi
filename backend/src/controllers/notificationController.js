import admin from '../config/firebase.js';
import db from '../config/db.js';
import { io } from '../../server.js';

export const registerFCMToken = async (req, res) => {
  try {
    const { fcm_token, device_type } = req.body;
    const userId = req.user.id;

    await db.query(
      `INSERT INTO user_fcm_tokens (user_id, fcm_token, device_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, fcm_token) 
       DO UPDATE SET device_type = $3`,
      [userId, fcm_token, device_type || 'web']
    );

    res.json({ message: 'FCM token registered' });
  } catch (err) {
    console.error('FCM token error:', err);
    res.status(500).json({ error: 'Failed to register FCM token' });
  }
};

export const sendPushNotification = async (userIds, title, body, data = {}) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT fcm_token FROM user_fcm_tokens WHERE user_id = ANY($1)`,
      [userIds]
    );

    const tokens = result.rows.map(row => row.fcm_token);
    
    if (tokens.length === 0) {
      console.log('No FCM tokens found for users');
      return;
    }

    const message = {
      notification: {
        title,
        body,
      },
      data: {
        ...data,
        timestamp: new Date().toISOString(),
      },
      tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    
    console.log(`Sent ${response.successCount} notifications`);
    
    if (response.failureCount > 0) {
      const invalidTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          invalidTokens.push(tokens[idx]);
        }
      });
      
      if (invalidTokens.length > 0) {
        await db.query(
          `DELETE FROM user_fcm_tokens WHERE fcm_token = ANY($1)`,
          [invalidTokens]
        );
      }
    }

    return response;
  } catch (err) {
    console.error('Push notification error:', err);
  }
};

export const sendNotificationToAll = async (req, res) => {
  try {
    const { title, body, data } = req.body;

    const result = await db.query(`SELECT id FROM users`);
    const userIds = result.rows.map(row => row.id);

    await db.query(
      `INSERT INTO notifications (user_id, title, body, data)
       SELECT id, $1, $2, $3 FROM users`,
      [title, body, JSON.stringify(data || {})]
    );

    await sendPushNotification(userIds, title, body, data);

    io.emit('notification', {
      title,
      body,
      data,
      timestamp: new Date().toISOString(),
    });

    res.json({ message: 'Notification sent to all users' });
  } catch (err) {
    console.error('Send notification error:', err);
    res.status(500).json({ error: 'Failed to send notification' });
  }
};

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