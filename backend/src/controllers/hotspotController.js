import db from "../config/db.js";
import { io } from "../../server.js";
import { sendPushNotification } from './notificationController.js';

/**
 * Create a new hotspot
 */
export const createHotspot = async (req, res) => {
  try {
    const { name, type, description, latitude, longitude, metadata } = req.body;
    const userId = req.user.id;

    if (!name || !type || !latitude || !longitude) {
      return res.status(400).json({ error: "name, type, latitude, longitude required" });
    }

    // Insert hotspot
    const result = await db.query(
      `INSERT INTO hotspots (name, type, description, location, created_by)
       VALUES ($1, $2, $3, ST_SetSRID(ST_Point($4, $5), 4326), $6)
       RETURNING 
         id, name, type, description,
         ST_X(location::geometry) AS longitude,
         ST_Y(location::geometry) AS latitude,
         created_by, is_active, created_at`,
      [name, type, description || null, longitude, latitude, userId]
    );

    const hotspot = result.rows[0];

    // Add metadata if provided
    if (metadata && typeof metadata === 'object') {
      for (const [key, value] of Object.entries(metadata)) {
        await db.query(
          `INSERT INTO hotspot_metadata (hotspot_id, key, value)
           VALUES ($1, $2, $3)`,
          [hotspot.id, key, JSON.stringify(value)]
        );
      }
    }

    // Create default alert zone (500m radius)
    await db.query(
      `INSERT INTO alert_zones (hotspot_id, radius_meters, alert_level, zone_geometry)
       VALUES ($1, 500, 'medium', 
         ST_Buffer(ST_SetSRID(ST_Point($2, $3), 4326)::geography, 500)::geography)`,
      [hotspot.id, longitude, latitude]
    );

    // Broadcast to connected clients
    io.emit('hotspot_created', hotspot);

    res.status(201).json({
      message: "Hotspot created successfully",
      hotspot
    });

  } catch (err) {
    console.error("Create hotspot error:", err);
    res.status(500).json({ error: "Failed to create hotspot" });
  }
};

/**
 * Get all hotspots with optional filters
 */
export const getHotspots = async (req, res) => {
  try {
    const { type, active, near_lat, near_lng, radius_km } = req.query;

    let query = `
      SELECT 
        h.id, h.name, h.type, h.description,
        ST_X(h.location::geometry) AS longitude,
        ST_Y(h.location::geometry) AS latitude,
        h.is_active, h.created_at,
        u.name AS created_by_name,
        COALESCE(
          json_agg(
            json_build_object('key', hm.key, 'value', hm.value)
          ) FILTER (WHERE hm.id IS NOT NULL),
          '[]'
        ) AS metadata
      FROM hotspots h
      LEFT JOIN users u ON h.created_by = u.id
      LEFT JOIN hotspot_metadata hm ON h.id = hm.hotspot_id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 0;

    if (type) {
      paramCount++;
      query += ` AND h.type = $${paramCount}`;
      params.push(type);
    }

    if (active !== undefined) {
      paramCount++;
      query += ` AND h.is_active = $${paramCount}`;
      params.push(active === 'true');
    }

    // Proximity filter
    if (near_lat && near_lng && radius_km) {
      paramCount += 3;
      query += ` AND ST_DWithin(
        h.location,
        ST_SetSRID(ST_Point($${paramCount - 1}, $${paramCount - 2}), 4326)::geography,
        $${paramCount} * 1000
      )`;
      params.push(parseFloat(near_lat), parseFloat(near_lng), parseFloat(radius_km));
    }

    query += ` GROUP BY h.id, u.name ORDER BY h.created_at DESC`;

    const result = await db.query(query, params);

    res.json(result.rows);

  } catch (err) {
    console.error("Get hotspots error:", err);
    res.status(500).json({ error: "Failed to fetch hotspots" });
  }
};

/**
 * Get hotspot by ID with details
 */
export const getHotspotById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT 
        h.id, h.name, h.type, h.description,
        ST_X(h.location::geometry) AS longitude,
        ST_Y(h.location::geometry) AS latitude,
        h.is_active, h.created_at,
        u.name AS created_by_name,
        json_agg(
          json_build_object('key', hm.key, 'value', hm.value)
        ) FILTER (WHERE hm.id IS NOT NULL) AS metadata,
        az.radius_meters, az.alert_level
      FROM hotspots h
      LEFT JOIN users u ON h.created_by = u.id
      LEFT JOIN hotspot_metadata hm ON h.id = hm.hotspot_id
      LEFT JOIN alert_zones az ON h.id = az.hotspot_id
      WHERE h.id = $1
      GROUP BY h.id, u.name, az.radius_meters, az.alert_level`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hotspot not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("Get hotspot error:", err);
    res.status(500).json({ error: "Failed to fetch hotspot" });
  }
};

/**
 * Update hotspot
 */
export const updateHotspot = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description, latitude, longitude, is_active } = req.body;

    const result = await db.query(
      `UPDATE hotspots
       SET 
         name = COALESCE($1, name),
         type = COALESCE($2, type),
         description = COALESCE($3, description),
         location = CASE 
           WHEN $4::float8 IS NOT NULL AND $5::float8 IS NOT NULL 
           THEN ST_SetSRID(ST_Point($5, $4), 4326)::geography
           ELSE location
         END,
         is_active = COALESCE($6, is_active),
         updated_at = NOW()
       WHERE id = $7
       RETURNING 
         id, name, type, description,
         ST_X(location::geometry) AS longitude,
         ST_Y(location::geometry) AS latitude,
         is_active, updated_at`,
      [name, type, description, latitude, longitude, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hotspot not found" });
    }

    // Broadcast update
    io.emit('hotspot_updated', result.rows[0]);

    res.json(result.rows[0]);

  } catch (err) {
    console.error("Update hotspot error:", err);
    res.status(500).json({ error: "Failed to update hotspot" });
  }
};

/**
 * Delete hotspot
 */
export const deleteHotspot = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM hotspots WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hotspot not found" });
    }

    // Broadcast deletion
    io.emit('hotspot_deleted', { id: parseInt(id) });

    res.json({ message: "Hotspot deleted successfully" });

  } catch (err) {
    console.error("Delete hotspot error:", err);
    res.status(500).json({ error: "Failed to delete hotspot" });
  }
};

/**
 * Check proximity alerts when elephant detected
 */
export const checkProximityAlerts = async (latitude, longitude, deviceId) => {
  try {
    // Find hotspots within alert zones
    const hotspots = await db.query(
      `SELECT 
        h.id, h.name, h.type,
        ST_Distance(
          h.location,
          ST_SetSRID(ST_Point($1, $2), 4326)::geography
        ) AS distance_meters,
        az.alert_level
      FROM hotspots h
      JOIN alert_zones az ON h.id = az.hotspot_id
      WHERE h.is_active = TRUE
        AND ST_DWithin(
          az.zone_geometry,
          ST_SetSRID(ST_Point($1, $2), 4326)::geography,
          0
        )
      ORDER BY distance_meters ASC`,
      [longitude, latitude]
    );

    if (hotspots.rows.length > 0) {
      // Get users who should receive alerts
      const users = await db.query(
        `SELECT DISTINCT u.id
         FROM users u
         JOIN user_alert_preferences uap ON u.id = uap.user_id
         WHERE uap.enabled = TRUE
           AND ST_DWithin(
             ST_SetSRID(ST_Point($1, $2), 4326)::geography,
             ST_SetSRID(ST_Point(0, 0), 4326)::geography,
             uap.notification_radius_km * 1000
           )`,
        [longitude, latitude]
      );

      const userIds = users.rows.map(u => u.id);

      // Send alerts for each hotspot
      for (const hotspot of hotspots.rows) {
        const alertMessage = `⚠️ Elephant detected ${Math.round(hotspot.distance_meters)}m from ${hotspot.name} (${hotspot.type})`;
        
        await sendPushNotification(
          userIds,
          'Proximity Alert!',
          alertMessage,
          {
            type: 'proximity_alert',
            hotspot_id: hotspot.id.toString(),
            device_id: deviceId,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            distance_meters: hotspot.distance_meters.toString(),
            alert_level: hotspot.alert_level
          }
        );

        // Save to notifications
        await db.query(
          `INSERT INTO notifications (user_id, title, body, data)
           SELECT id, $1, $2, $3 FROM users WHERE id = ANY($4)`,
          [
            'Proximity Alert!',
            alertMessage,
            JSON.stringify({
              type: 'proximity_alert',
              hotspot_id: hotspot.id,
              device_id: deviceId,
              latitude,
              longitude
            }),
            userIds
          ]
        );

        // Broadcast via WebSocket
        io.emit('proximity_alert', {
          hotspot: hotspot,
          detection: { latitude, longitude, deviceId }
        });
      }
    }

  } catch (err) {
    console.error("Proximity alert error:", err);
  }
};