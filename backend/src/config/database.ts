import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

// Make database connection optional - service can run without it
let pool: Pool | null = null;

if (process.env.DATABASE_URL) {
  const poolConfig: PoolConfig = {
    connectionString: process.env.DATABASE_URL,
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    // Railway requires SSL for PostgreSQL connections
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false,
  };

  logger.info('Database configuration:', {
    hasConnectionString: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV || 'development',
    sslEnabled: process.env.NODE_ENV === 'production',
  });

  pool = new Pool(poolConfig);

  // Log successful connections
  pool.on('connect', () => {
    logger.info('Database connection established');
  });

  // Handle database errors gracefully - don't crash the service
  pool.on('error', (err) => {
    logger.error('Unexpected database error:', err);
    // Don't exit - let the service continue running
    // Individual queries will handle their own errors
  });
} else {
  logger.warn('DATABASE_URL not set - service will run without database connection');
}

// Export a safe pool wrapper that handles null pool
export const getPool = () => {
  if (!pool) {
    throw new Error('Database pool is not initialized. DATABASE_URL environment variable is required for database operations.');
  }
  return pool;
};

// Export pool directly for backward compatibility, but mark as nullable
export { pool };

export default pool;

