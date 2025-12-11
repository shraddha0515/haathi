import db from "../config/db.js";
import { io } from "../../server.js";
import { sendPushNotification } from './notificationController.js';
import { checkProximityAlerts } from './hotspotController.js';

export const receiveEvent = async (req, res) => {
  try {
    const {
      device_id,
      latitude,
      longitude,
      confidence,
      battery_percentage
    } = req.body;

    console.log('🐘 Elephant Detection Event Received:', {
      device_id,
      latitude,
      longitude,
      confidence,
      battery_percentage,
      timestamp: new Date().toISOString()
    });

    if (!device_id || typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({
        error: "device_id, latitude, longitude are required"
      });
    }

    // 1. Store detection in database
    const insertQuery = `
    INSERT INTO detections 
    (source_device, latitude, longitude, location, confidence, battery_percentage)
    VALUES ($1, $2, $3, ST_SetSRID(ST_Point($3, $2), 4326), $4, $5)
    RETURNING *;
  `;
    
    const values = [
      device_id,
      latitude,
      longitude,
      confidence || null,
      battery_percentage || null
    ];

    const result = await db.query(insertQuery, values);
    const data = result.rows[0];
    
    console.log('✅ Detection stored in database:', data.id);

    // 2. Update device status
    await db.query(
      `
      UPDATE devices
      SET 
        last_seen = NOW(),
        battery_percentage = $1,
        status = 'online'
      WHERE device_id = $2;
      `,
      [battery_percentage || null, device_id]
    );

    // 3. Broadcast to all connected WebSocket clients
    console.log('📡 Broadcasting to WebSocket clients...');
    io.emit("new_event", data);
    console.log('✅ WebSocket broadcast sent');

    // 4. Get all users for notifications
    const userResult = await db.query(`SELECT id FROM users`);
    const userIds = userResult.rows.map(row => row.id);
    console.log(`👥 Sending notifications to ${userIds.length} users`);

    // 5. Send push notifications (FCM - for mobile apps if configured)
    await sendPushNotification(
      userIds,
      'Elephant Detected!',
      `Device ${device_id} detected movement at coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
      {
        event_id: data.id.toString(),
        device_id,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        type: 'elephant_detection'
      }
    );

    // 6. Store notifications in database for all users
    await db.query(
      `INSERT INTO notifications (user_id, title, body, data)
       SELECT id, $1, $2, $3 FROM users`,
      [
        'Elephant Detected!',
        `Device ${device_id} detected movement`,
        JSON.stringify({
          event_id: data.id,
          device_id,
          latitude,
          longitude
        })
      ]
    );
    console.log('✅ Notifications stored in database');

    // 7. Check for proximity alerts (near hotspots)
    console.log('🔍 Checking proximity alerts...');
    await checkProximityAlerts(latitude, longitude, device_id);

    console.log('🎉 All notifications sent successfully!');

    return res.status(201).json({
      message: "Event stored & broadcasted to all devices",
      data,
      notifications_sent: userIds.length,
      websocket_broadcast: true
    });
  } catch (err) {
    console.error("❌ Error receiving event:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const getLatestEvent = async (req, res) => {
  try {
    const { device_id } = req.params;
    const query = `
      SELECT *
      FROM detections
      WHERE source_device = $1
      ORDER BY detected_at DESC
      LIMIT 1;
    `;
    const result = await db.query(query, [device_id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "No events found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Latest event error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getEventHistory = async (req, res) => {
  try {
    const { device_id } = req.params;
    const query = `
      SELECT *
      FROM detections
      WHERE source_device = $1
      ORDER BY detected_at DESC
      LIMIT 500; 
    `;
    const result = await db.query(query, [device_id]);
    res.json(result.rows);
  } catch (err) {
    console.error("Event history error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getAllEvents = async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM detections
      ORDER BY detected_at DESC;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Get all events error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
