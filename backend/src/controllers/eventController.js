import db from "../config/db.js";
import { io } from "../server.js";   // SOCKET.IO
import { sendPushNotification } from './notificationController.js';

/**
 * @desc Receive detection from Raspberry Pi
 */
export const receiveEvent = async (req, res) => {
  try {
    const {
      device_id,
      latitude,
      longitude,
      confidence,
      battery_percentage
    } = req.body;

    if (!device_id || typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({
        error: "device_id, latitude, longitude are required"
      });
    }
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

    // Update device health
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

    // REAL-TIME BROADCAST
    io.emit("new_event", data);

     // 📱 SEND PUSH NOTIFICATION TO ALL USERS
     const userResult = await db.query(`SELECT id FROM users`);
     const userIds = userResult.rows.map(row => row.id);
 
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
 
     // Save notification to database
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

    return res.status(201).json({
      message: "Event stored & broadcasted",
      data
    });

  } catch (err) {
    console.error("Error receiving event:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};



/**
 * @desc Get latest event for a device
 */
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



/**
 * @desc Get event history for a device
 */
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



/**
 * @desc Get all detection events (Admin + Officer)
 */
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
