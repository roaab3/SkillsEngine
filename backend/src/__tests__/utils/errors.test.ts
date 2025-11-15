import {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  DatabaseError,
  ExternalAPIError,
} from '../../utils/errors';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create error with status code', () => {
      const error = new AppError('Test error', 400);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
    });

    it('should create non-operational error', () => {
      const error = new AppError('Test error', 500, false);
      expect(error.isOperational).toBe(false);
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with details', () => {
      const details = { field: 'email', message: 'Invalid format' };
      const error = new ValidationError('Validation failed', details);
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual(details);
    });
  });

  describe('NotFoundError', () => {
    it('should create not found error', () => {
      const error = new NotFoundError('User');
      expect(error.message).toBe('User not found');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('UnauthorizedError', () => {
    it('should create unauthorized error with default message', () => {
      const error = new UnauthorizedError();
      expect(error.message).toBe('Unauthorized');
      expect(error.statusCode).toBe(401);
    });

    it('should create unauthorized error with custom message', () => {
      const error = new UnauthorizedError('Invalid token');
      expect(error.message).toBe('Invalid token');
    });
  });

  describe('ForbiddenError', () => {
    it('should create forbidden error', () => {
      const error = new ForbiddenError();
      expect(error.message).toBe('Forbidden');
      expect(error.statusCode).toBe(403);
    });
  });

  describe('DatabaseError', () => {
    it('should create database error with original error', () => {
      const originalError = new Error('Connection failed');
      const error = new DatabaseError('Database operation failed', originalError);
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(false);
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('ExternalAPIError', () => {
    it('should create external API error with service name', () => {
      const error = new ExternalAPIError('API call failed', 'Gemini API');
      expect(error.statusCode).toBe(502);
      expect(error.service).toBe('Gemini API');
    });
  });
});

