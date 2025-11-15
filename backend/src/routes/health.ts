import { Router } from 'express';
import { pool } from '../config/database';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  // Check database connection
  await pool.query('SELECT NOW()');

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'skills-engine',
  });
}));

export default router;

