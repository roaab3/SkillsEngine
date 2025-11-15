import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

// Unified Data Exchange authentication
// In production, this would validate the X-Service-Id header and token
export const authenticateService = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const serviceId = req.headers['x-service-id'] as string;
  const authToken = req.headers['authorization'] as string;

  if (!serviceId && !authToken) {
    throw new UnauthorizedError('Service identification required');
  }

  // In production, validate token against Unified Data Exchange
  // For now, we'll allow requests with service ID
  req.serviceId = serviceId;
  next();
};

// Frontend authentication (for user-specific endpoints)
export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers['authorization'] as string;
  const userId = req.headers['x-user-id'] as string;
  const nodeEnv = process.env.NODE_ENV || 'development';

  // In development, allow requests without auth for easier testing
  if (nodeEnv === 'development') {
    // Extract userId from URL params if not in header
    const urlUserId = (req.params as any).user_id;
    req.userId = userId || urlUserId || 'user_123'; // Default for dev
    return next();
  }

  // Production: require authentication
  if (!authToken) {
    throw new UnauthorizedError('Authentication required');
  }

  if (!userId) {
    throw new UnauthorizedError('User identification required');
  }

  req.userId = userId;
  next();
};

// Role-based access control (for Trainer-only endpoints)
export const requireTrainer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const employeeType = req.headers['x-employee-type'] as string;

  if (employeeType !== 'trainer') {
    throw new ForbiddenError('Trainer access required');
  }

  next();
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      serviceId?: string;
      userId?: string;
    }
  }
}

