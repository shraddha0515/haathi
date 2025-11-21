import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  const black = await db.query(
    "SELECT * FROM token_blacklist WHERE token = $1 LIMIT 1",
    [token]
  );
  if (black.rows.length > 0)
    return res.status(401).json({ error: "Token invalidated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userResult = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [decoded.id]
    );

    req.user = userResult.rows[0];
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
