import app from "./app.js";
import dotenv from "dotenv";
dotenv.config(); // loads .env into process.env


const PORT = process.env.PORT || 5000;
const dbHost = process.env.DB_HOST;

// Allow ESP32 on same WiFi
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
