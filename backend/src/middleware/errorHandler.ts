import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error(`AppError: ${err.message}`, {
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });

    const errorResponse: any = {
      code: err.constructor.name,
      message: err.message,
    };

    if (err instanceof ValidationError && err.details) {
      errorResponse.details = err.details;
    }

    return res.status(err.statusCode).json({
      success: false,
      error: errorResponse,
      timestamp: new Date().toISOString(),
    });
  }

  // Unexpected errors
  logger.error('Unexpected error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
    timestamp: new Date().toISOString(),
  });
};

