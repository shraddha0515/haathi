import db from "../config/db.js";
export const createDevice = async (req, res) => {
  try {
    const { device_id, description, latitude, longitude } = req.body;
    if (!device_id || !latitude || !longitude) {
      return res.status(400).json({ error: "device_id, latitude, longitude are required" });
    }
    const result = await db.query(
      `
      INSERT INTO devices (device_id, description, install_geom)
      VALUES ($1, $2, ST_SetSRID(ST_Point($3, $4), 4326))
      RETURNING id, device_id, description,
        ST_X(install_geom::geometry) AS longitude,
        ST_Y(install_geom::geometry) AS latitude,
        created_at;
      `,
      [device_id, description || null, longitude, latitude]
    );
    res.status(201).json({
      message: "Device registered successfully",
      device: result.rows[0]
    });
  } catch (err) {
    console.error("Device creation error:", err);
    res.status(500).json({ error: "Failed to register device" });
  }
};
export const getDevices = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT 
        id,
        device_id,
        description,
        ST_X(install_geom::geometry) AS longitude,
        ST_Y(install_geom::geometry) AS latitude,
        status,
        last_seen,
        battery_percentage,
        created_at
      FROM devices;
      `
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get devices error:", err);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
};
export const getDeviceById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `
      SELECT 
        id, 
        device_id, 
        description,
        ST_X(install_geom::geometry) AS longitude,
        ST_Y(install_geom::geometry) AS latitude,
        status,
        last_seen,
        battery_percentage,
        created_at
      FROM devices
      WHERE id = $1;
      `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Get device error:", err);
    res.status(500).json({ error: "Failed to fetch device" });
  }
};
export const updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { device_id, description, latitude, longitude, status, battery_percentage } = req.body;
    const result = await db.query(
      `
      UPDATE devices
      SET 
        device_id = COALESCE($1, device_id),
        description = COALESCE($2, description),
        install_geom = 
          CASE 
            WHEN $3::float8 IS NOT NULL AND $4::float8 IS NOT NULL THEN 
              ST_SetSRID(ST_Point($4::float8, $3::float8), 4326)::geography
            ELSE install_geom
          END,
        status = COALESCE($5, status),
        battery_percentage = COALESCE($6, battery_percentage),
        last_seen = NOW()
      WHERE id = $7
      RETURNING 
        id,
        device_id,
        description,
        status,
        battery_percentage,
        last_seen,
        created_at,
        ST_X(install_geom::geometry) AS longitude,
        ST_Y(install_geom::geometry) AS latitude;
      `,
      [
        device_id || null,
        description || null,
        latitude || null,
        longitude || null,
        status || null,
        battery_percentage || null,
        id
      ]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Device not found" });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Update device error:", err);
    res.status(500).json({ error: "Failed to update device" });
  }
};
export const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Device ID is required" });
    }
    const check = await db.query(
      `SELECT id FROM devices WHERE id = $1`,
      [id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }
    await db.query(`DELETE FROM devices WHERE id = $1`, [id]);
    res.status(200).json({ message: "Device deleted successfully" });
  } catch (err) {
    console.error("Delete device error:", err);
    res.status(500).json({ error: "Failed to delete device" });
  }
};
