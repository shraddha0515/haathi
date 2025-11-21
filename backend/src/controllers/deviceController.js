import db from "../config/db.js";

/**
 * @desc Create a new device (Admin only)
 */
export const createDevice = async (req, res) => {
  try {
    const { device_id, description, latitude, longitude } = req.body;

    if (!device_id || !latitude || !longitude) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await db.query(
      `INSERT INTO devices (device_id, description, location)
       VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326))
       RETURNING id, device_id, description, location;`,
      [device_id, description || null, longitude, latitude]
    );

    res.status(201).json({
      message: "Device registered successfully",
      device: result.rows[0],
    });
  } catch (err) {
    console.error("Device creation error:", err);
    res.status(500).json({ error: "Failed to create device" });
  }
};

/**
 * @desc Fetch all devices (Admin + Officer)
 */
export const getDevices = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, device_id, description,
        ST_X(location) AS longitude,
        ST_Y(location) AS latitude,
        created_at
      FROM devices
      ORDER BY created_at DESC;
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get devices error:", err);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
};

/**
 * @desc Fetch device by ID
 */
export const getDeviceById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT id, device_id, description,
        ST_X(location) AS longitude,
        ST_Y(location) AS latitude,
        created_at
      FROM devices
      WHERE id = $1;
      `,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Device not found" });

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Get device error:", err);
    res.status(500).json({ error: "Failed to fetch device" });
  }
};

/**
 * @desc Update a device (Admin only)
 */
export const updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, latitude, longitude } = req.body;

    const result = await db.query(
      `
      UPDATE devices
      SET 
        description = COALESCE($1, description),
        location = COALESCE(ST_SetSRID(ST_MakePoint($2, $3), 4326), location)
      WHERE id = $4
      RETURNING id, device_id, description,
        ST_X(location) AS longitude,
        ST_Y(location) AS latitude,
        updated_at;
      `,
      [
        description || null,
        longitude || null,
        latitude || null,
        id
      ]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Device not found" });

    res.status(200).json({
      message: "Device updated successfully",
      device: result.rows[0],
    });
  } catch (err) {
    console.error("Update device error:", err);
    res.status(500).json({ error: "Failed to update device" });
  }
};

/**
 * @desc Delete a device (Admin only)
 */
export const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;

    const check = await db.query(`SELECT id FROM devices WHERE id = $1`, [id]);
    if (check.rows.length === 0)
      return res.status(404).json({ error: "Device not found" });

    await db.query(`DELETE FROM devices WHERE id = $1`, [id]);

    res.status(200).json({ message: "Device deleted successfully" });
  } catch (err) {
    console.error("Delete device error:", err);
    res.status(500).json({ error: "Failed to delete device" });
  }
};
