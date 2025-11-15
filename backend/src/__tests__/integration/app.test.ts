import request from 'supertest';
import express from 'express';
import { mockPool, mockQueryResult } from '../mocks/database';
import healthRoutes from '../../routes/health';

jest.mock('../../config/database');

// Create minimal test app
const app = express();
app.use(express.json());
app.use('/health', healthRoutes);
app.get('/', (req, res) => {
  res.json({
    service: 'Skills Engine',
    version: '1.0.0',
    status: 'running',
  });
});

describe('Application Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Root Endpoint', () => {
    it('should return service information', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('service', 'Skills Engine');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('status', 'running');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');

      expect(response.status).toBe(404);
    });

    it('should handle errors with proper format', async () => {
      // This would require a route that throws an error
      // For now, we test the error handler middleware
      const response = await request(app)
        .post('/api/webhooks/user-creation')
        .send({}); // Invalid request

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app).get('/health');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Request Size Limits', () => {
    it('should reject requests exceeding size limit', async () => {
      const largeBody = 'x'.repeat(11 * 1024 * 1024); // 11MB

      const response = await request(app)
        .post('/api/webhooks/user-creation')
        .set('X-Service-Id', 'directory')
        .send({ raw_data: largeBody });

      expect(response.status).toBe(413); // Payload Too Large
    });
  });
});

