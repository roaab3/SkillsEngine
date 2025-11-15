import { Router } from 'express';
import { pool } from '../config/database';
import logger from '../utils/logger';

const router = Router();

router.get('/', async (req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'skills-engine',
    database: 'unknown' as string,
  };

  // Check database connection (non-blocking)
  // Always return 200 for Railway healthcheck - it just needs the endpoint to respond
  try {
    await pool.query('SELECT NOW()');
    healthCheck.database = 'connected';
  } catch (error) {
    healthCheck.database = 'disconnected';
    logger.warn('Database health check failed, but service is still running:', error);
  }

  // Always return 200 status code for Railway healthcheck
  // Railway needs this to be 200 to consider the service ready for zero-downtime deployments
  res.status(200).json(healthCheck);
});

export default router;

