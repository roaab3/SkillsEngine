/**
 * Integration Tests for Competencies API
 */

const request = require('supertest');
const app = require('../../../src/index');

describe('Competencies API Integration Tests', () => {
  describe('GET /api/competencies/parents', () => {
    it('should return parent competencies', async () => {
      const response = await request(app)
        .get('/api/competencies/parents')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/competencies/:competencyId', () => {
    it('should return 404 for non-existent competency', async () => {
      const response = await request(app)
        .get('/api/competencies/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
    });
  });
});

