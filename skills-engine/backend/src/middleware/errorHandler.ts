import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { statusCode = 500, message } = error;

  // Log error details
  logger.error('Error occurred:', {
    error: {
      message: error.message,
      stack: error.stack,
      statusCode,
      isOperational: error.isOperational
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query
    },
    timestamp: new Date().toISOString()
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method
    }
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Common error types
export const BadRequestError = (message: string = 'Bad Request') => 
  new CustomError(message, 400);

export const UnauthorizedError = (message: string = 'Unauthorized') => 
  new CustomError(message, 401);

export const ForbiddenError = (message: string = 'Forbidden') => 
  new CustomError(message, 403);

export const NotFoundError = (message: string = 'Not Found') => 
  new CustomError(message, 404);

export const ConflictError = (message: string = 'Conflict') => 
  new CustomError(message, 409);

export const ValidationError = (message: string = 'Validation Error') => 
  new CustomError(message, 422);

export const InternalServerError = (message: string = 'Internal Server Error') => 
  new CustomError(message, 500);

export const ServiceUnavailableError = (message: string = 'Service Unavailable') => 
  new CustomError(message, 503);
