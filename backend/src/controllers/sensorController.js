import db from "../config/db.js";

export const receiveSensorData = async (req, res) => {
  try {
    const { device_id, latitude, longitude } = req.body;

    // Basic validation
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({ error: "latitude and longitude must be numbers" });
    }

    // Insert into PostgreSQL + create geom
    const query = `
      INSERT INTO gps_data (device_id, latitude, longitude, geom)
      VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($3, $2), 4326))
      RETURNING *;
    `;

    const values = [device_id || null, latitude, longitude];
    const result = await db.query(query, values);

    return res.json({
      status: "success",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("Error inserting GPS:", err);
    return res.status(500).json({ error: "internal server error" });
  }
};
