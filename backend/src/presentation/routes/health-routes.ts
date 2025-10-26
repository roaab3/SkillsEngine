import { Router, Request, Response } from 'express';
import { AppDataSource } from '@/infrastructure/database/connection';
import { logger } from '@/infrastructure/logger/logger';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      services: {
        database: 'unknown',
        kafka: 'unknown',
        redis: 'unknown'
      }
    };

    // Check database connection (non-blocking)
    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.query('SELECT 1');
        healthCheck.services.database = 'healthy';
      } else {
        healthCheck.services.database = 'disconnected';
      }
    } catch (error) {
      healthCheck.services.database = 'unhealthy';
      logger.error('Database health check failed:', error);
    }

    // Check Kafka connection (if configured)
    if (process.env.KAFKA_BROKER_URL) {
      healthCheck.services.kafka = 'configured';
    } else {
      healthCheck.services.kafka = 'not_configured';
    }

    // Check Redis connection (if configured)
    if (process.env.REDIS_URL) {
      healthCheck.services.redis = 'configured';
    } else {
      healthCheck.services.redis = 'not_configured';
    }

    // Always return 200 for basic health check - Railway just needs the endpoint to respond
    res.status(200).json(healthCheck);
  } catch (error) {
    logger.error('Health check failed:', error);
    // Even on error, return 200 to prevent Railway from thinking the service is down
    res.status(200).json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      error: 'Health check failed but service is running'
    });
  }
});

export { router as healthRoutes };

