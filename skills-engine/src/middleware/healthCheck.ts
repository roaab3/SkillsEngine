import { Request, Response, NextFunction } from 'express';
import { MockDatabaseService } from '../services/mockDatabaseService';
import { logger } from '../utils/logger';

export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'unknown',
        redis: 'unknown',
        memory: 'unknown',
        cpu: 'unknown'
      }
    };

    // Check mock database
    try {
      const mockDb = MockDatabaseService.getInstance();
      const dbHealth = await mockDb.healthCheck();
      healthStatus.services.database = dbHealth.status;
      (healthStatus.services as any).database_details = dbHealth.details;
    } catch (error) {
      healthStatus.services.database = 'unhealthy';
      logger.error('Database health check failed:', error);
    }

    // Mock Redis as healthy for now
    healthStatus.services.redis = 'healthy';

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024)
    };

    healthStatus.services.memory = JSON.stringify(memoryUsageMB);

    // Check CPU usage (simplified)
    const cpuUsage = process.cpuUsage();
    healthStatus.services.cpu = JSON.stringify({
      user: cpuUsage.user,
      system: cpuUsage.system
    });

    // Determine overall health
    const isHealthy = 
      healthStatus.services.database === 'healthy' &&
      healthStatus.services.redis === 'healthy';

    if (!isHealthy) {
      healthStatus.status = 'unhealthy';
    }

    const statusCode = isHealthy ? 200 : 503;
    
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
};
