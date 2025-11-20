/**
 * Jest Setup File
 */

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.GEMINI_API_KEY = 'test-api-key';

// Increase timeout for async operations
jest.setTimeout(10000);

