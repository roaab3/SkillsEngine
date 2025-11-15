import request from 'supertest';
import express from 'express';
import { mockPool, mockQueryResult } from '../mocks/database';
import healthRoutes from '../../routes/health';

jest.mock('../../config/database');

// Create test app
const app = express();
app.use(express.json());
app.use('/health', healthRoutes);

describe('Health Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      mockPool.query.mockResolvedValueOnce(mockQueryResult([{ now: new Date() }]));

      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('service', 'skills-engine');
    });

    it('should handle database connection failure', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('Database connection failed'));

      const response = await request(app).get('/health');

      expect(response.status).toBe(500);
    });
  });
});
