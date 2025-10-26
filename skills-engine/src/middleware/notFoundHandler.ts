import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = {
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404,
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString()
  };

  logger.warn('Route not found:', error);

  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    }
  });
};
