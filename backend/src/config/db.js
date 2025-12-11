import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not defined in environment variables');
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('DB')));
  console.error('Make sure .env file exists in:', process.cwd());
}

// Enhanced pool configuration for Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  
  // Connection pool settings (important for Supabase free tier)
  max: 10,                    // Maximum number of clients in the pool
  min: 2,                     // Minimum number of clients in the pool
  idleTimeoutMillis: 30000,   // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return error if connection takes > 10s
  
  // Keep-alive settings to prevent connection termination
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  
  // Allow pool to handle errors gracefully
  allowExitOnIdle: false
});

// Initial connection test
pool.query("SELECT NOW()")
  .then((result) => {
    console.log("✅ Connected to Supabase PostgreSQL");
    console.log("📅 Server time:", result.rows[0].now);
  })
  .catch(err => {
    console.error("❌ Failed to connect to DB", err.message);
    console.error("Connection string format should be: postgresql://user:password@host:port/database");
  });

// Connection event handlers
pool.on("connect", (client) => {
  console.log("🔌 Pool connected to Supabase PostgreSQL");
});

pool.on("acquire", (client) => {
  console.log("📥 Client acquired from pool");
});

pool.on("remove", (client) => {
  console.log("📤 Client removed from pool");
});

// Enhanced error handler with reconnection logic
pool.on('error', (err, client) => {
  console.error('❌ Unexpected Postgres error:', err.message);
  console.error('Error code:', err.code);
  
  // Handle specific error codes
  if (err.code === 'XX000') {
    console.error('⚠️ Database termination detected. Pool will attempt to reconnect...');
  } else if (err.code === 'ECONNRESET') {
    console.error('⚠️ Connection reset. Pool will create new connections...');
  } else if (err.code === '57P01') {
    console.error('⚠️ Admin shutdown detected.');
  }
  
  // Don't exit the process - let the pool handle reconnection
  console.log('🔄 Connection pool will automatically recover');
});

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  console.log('📴 SIGTERM received, closing database pool...');
  await pool.end();
  console.log('✅ Database pool closed');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📴 SIGINT received, closing database pool...');
  await pool.end();
  console.log('✅ Database pool closed');
  process.exit(0);
});

// Enhanced query wrapper with retry logic
const queryWithRetry = async (text, params, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.error(`❌ Query attempt ${attempt} failed:`, err.message);
      
      // Retry on connection errors
      if (attempt < retries && (
        err.code === 'XX000' || 
        err.code === 'ECONNRESET' || 
        err.code === '57P01' ||
        err.message.includes('termination')
      )) {
        console.log(`🔄 Retrying in ${attempt}s...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
      
      throw err;
    }
  }
};

const db = {
  query: queryWithRetry,
  pool,
  
  // Health check function
  async healthCheck() {
    try {
      const result = await pool.query('SELECT NOW()');
      return { healthy: true, timestamp: result.rows[0].now };
    } catch (err) {
      return { healthy: false, error: err.message };
    }
  },
  
  // Get pool stats
  getStats() {
    return {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };
  }
};

export default db;
