import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

const { Pool } = pg;

// Validate environment variables
if (!process.env.DATABASE_URL) {
  console.error(' DATABASE_URL is not defined in environment variables');
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('DB')));
  console.error('Make sure .env file exists in:', process.cwd());
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection
pool.query("SELECT NOW()")
  .then(() => console.log("Connected to Supabase PostgreSQL"))
  .catch(err => {
    console.error("Failed to connect to DB", err);
    console.error("Connection string format should be: postgresql://user:password@host:port/database");
  });

pool.on("connect", () => {
  console.log("Pool connected to Supabase PostgreSQL");
});

pool.on('error', (err) => {
  console.error('Unexpected Postgres error', err);
});

const db = {
  query: (text, params) => pool.query(text, params),
  pool
};

export default db;