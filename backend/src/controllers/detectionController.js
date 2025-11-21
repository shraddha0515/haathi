import db from "../config/db.js";

export const addDetection = async (req, res) => {
  try {
    const { lat, lng, confidence, device_id } = req.body;

    const result = await db.query(
      `INSERT INTO detections (location, confidence, source_device)
       VALUES (ST_Point($1, $2)::geography, $3, $4)
       RETURNING *`,
      [lng, lat, confidence, device_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to insert detection", details: err });
  }
};

export const getLatestDetection = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, detected_at,
       ST_Y(location::geometry) AS lat,
       ST_X(location::geometry) AS lng,
       confidence
       FROM detections
       ORDER BY detected_at DESC
       LIMIT 1`
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch latest detection" });
  }
};
