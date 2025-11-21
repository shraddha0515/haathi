import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashed, role || "officer"]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Registration error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const result = await db.query(
    `SELECT * FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );

  if (result.rows.length === 0)
    return res.status(400).json({ error: "User not found" });

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
};

export const logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  const decoded = jwt.decode(token);

  await db.query(
    `INSERT INTO token_blacklist (token, expires_at)
     VALUES ($1, to_timestamp($2))`,
    [token, decoded.exp]
  );

  res.json({ message: "Logged out successfully" });
};

export const me = async (req, res) => {
  res.json(req.user);
};
