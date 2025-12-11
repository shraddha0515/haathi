import { Expo } from 'expo-server-sdk';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Expo SDK for mobile notifications
const expo = new Expo();

// Initialize Firebase Admin for web notifications
let firebaseInitialized = false;

try {
  // Try to load service account key
  const serviceAccountPath = join(__dirname, '../../serviceAccountKey.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized for web notifications');
  } else {
    console.warn('⚠️ serviceAccountKey.json not found. Web notifications will be disabled.');
    console.warn('   Place your Firebase service account key at:', serviceAccountPath);
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message);
  console.warn('⚠️ Web notifications will be disabled. Mobile notifications will still work.');
}

class NotificationService {
  /**
   * Send notification to both web and mobile users
   * @param {Array} users - Array of user objects with tokens
   * @param {Object} notification - Notification data
   */
  async sendToAll(users, notification) {
    const webTokens = [];
    const mobileTokens = [];

    // Separate web and mobile tokens
    users.forEach(user => {
      if (user.fcm_web_token) {
        webTokens.push(user.fcm_web_token);
      }
      if (user.expo_push_token) {
        mobileTokens.push(user.expo_push_token);
      }
    });

    console.log(`📤 Sending notifications to ${webTokens.length} web users and ${mobileTokens.length} mobile users`);

    // Send to both platforms simultaneously
    const results = await Promise.allSettled([
      this.sendToWeb(webTokens, notification),
      this.sendToMobile(mobileTokens, notification)
    ]);

    return {
      web: results[0].status === 'fulfilled' ? results[0].value : { error: results[0].reason?.message || 'Failed' },
      mobile: results[1].status === 'fulfilled' ? results[1].value : { error: results[1].reason?.message || 'Failed' },
      totalSent: webTokens.length + mobileTokens.length
    };
  }

  /**
   * Send notification to web users (Firebase Cloud Messaging)
   * @param {Array} fcmTokens - Array of FCM web tokens
   * @param {Object} notification - Notification data
   */
  async sendToWeb(fcmTokens, notification) {
    if (!firebaseInitialized) {
      console.warn('⚠️ Firebase not initialized. Skipping web notifications.');
      return { sent: 0, failed: 0, message: 'Firebase not initialized' };
    }

    if (fcmTokens.length === 0) {
      return { sent: 0, failed: 0, message: 'No web tokens' };
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl || undefined,
      },
      data: notification.data || {},
      webpush: {
        notification: {
          title: notification.title,
          body: notification.body,
          icon: '/elephant-icon.png',
          badge: '/badge.png',
          vibrate: [200, 100, 200],
          requireInteraction: true,
          tag: 'elephant-alert',
          renotify: true,
          actions: [
            {
              action: 'view',
              title: 'View Location'
            },
            {
              action: 'dismiss',
              title: 'Dismiss'
            }
          ]
        },
        fcmOptions: {
          link: notification.data?.link || '/'
        }
      }
    };

    const results = [];
    
    // Send to each token
    for (const token of fcmTokens) {
      try {
        const response = await admin.messaging().send({
          ...message,
          token: token
        });
        results.push({ token: token.substring(0, 20) + '...', success: true, messageId: response });
        console.log(`✅ Web notification sent to ${token.substring(0, 20)}...`);
      } catch (error) {
        results.push({ token: token.substring(0, 20) + '...', success: false, error: error.message });
        console.error(`❌ Failed to send web notification:`, error.message);
        
        // Remove invalid tokens
        if (error.code === 'messaging/invalid-registration-token' || 
            error.code === 'messaging/registration-token-not-registered') {
          console.log(`🗑️ Invalid token detected, should be removed from database`);
        }
      }
    }

    return {
      sent: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  /**
   * Send notification to mobile users (Expo Push Notifications)
   * @param {Array} expoPushTokens - Array of Expo push tokens
   * @param {Object} notification - Notification data
   */
  async sendToMobile(expoPushTokens, notification) {
    if (expoPushTokens.length === 0) {
      return { sent: 0, failed: 0, message: 'No mobile tokens' };
    }

    // Filter valid Expo tokens
    const validTokens = expoPushTokens.filter(token => {
      if (!Expo.isExpoPushToken(token)) {
        console.warn(`⚠️ Invalid Expo token format: ${token}`);
        return false;
      }
      return true;
    });

    if (validTokens.length === 0) {
      return { sent: 0, failed: expoPushTokens.length, message: 'No valid Expo tokens' };
    }

    const messages = validTokens.map(token => ({
      to: token,
      sound: 'default',
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
      priority: 'high',
      channelId: 'critical-alerts',
      badge: 1
    }));

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
        console.log(`✅ Sent ${chunk.length} mobile notifications`);
      } catch (error) {
        console.error('❌ Error sending mobile notifications:', error);
        tickets.push(...chunk.map(() => ({ status: 'error', message: error.message })));
      }
    }

    // Check for errors in tickets
    const errorTickets = tickets.filter(ticket => ticket.status === 'error');
    if (errorTickets.length > 0) {
      console.error('❌ Some notifications failed:', errorTickets);
    }

    return {
      sent: tickets.filter(t => t.status === 'ok').length,
      failed: tickets.filter(t => t.status === 'error').length,
      tickets
    };
  }

  /**
   * Send elephant detection alert to all platforms
   * @param {Array} users - Array of users with tokens
   * @param {Object} elephantData - Detection data
   */
  async sendElephantAlert(users, elephantData) {
    const notification = {
      title: '🐘 Elephant Detected!',
      body: `Location: ${elephantData.latitude?.toFixed(4)}, ${elephantData.longitude?.toFixed(4)}`,
      data: {
        type: 'elephant_detection',
        latitude: String(elephantData.latitude),
        longitude: String(elephantData.longitude),
        source_device: elephantData.source_device || elephantData.device_id || 'Unknown',
        detected_at: elephantData.detected_at || new Date().toISOString(),
        confidence: String(elephantData.confidence || 0.95),
        link: `/map?lat=${elephantData.latitude}&lng=${elephantData.longitude}` // For web
      }
    };

    return this.sendToAll(users, notification);
  }

  /**
   * Send custom notification to specific users
   * @param {Array} users - Array of users with tokens
   * @param {Object} notificationData - Custom notification data
   */
  async sendCustomNotification(users, notificationData) {
    const notification = {
      title: notificationData.title,
      body: notificationData.body,
      data: notificationData.data || {},
      imageUrl: notificationData.imageUrl
    };

    return this.sendToAll(users, notification);
  }
}

export default new NotificationService();
