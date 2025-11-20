/**
 * Integration Tests for Skills API
 */

const request = require('supertest');
const app = require('../../../src/index');

describe('Skills API Integration Tests', () => {
  describe('GET /api/skills/roots', () => {
    it('should return root skills', async () => {
      const response = await request(app)
        .get('/api/skills/roots')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/skills/:skillId', () => {
    it('should return 404 for non-existent skill', async () => {
      const response = await request(app)
        .get('/api/skills/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/skills', () => {
    it('should create a new skill', async () => {
      const skillData = {
        skill_id: `test_skill_${Date.now()}`,
        skill_name: 'Test Skill',
        parent_skill_id: null,
        description: 'Test description'
      };

      const response = await request(app)
        .post('/api/skills')
        .send(skillData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('skill_id', skillData.skill_id);
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        skill_name: 'Test Skill'
        // Missing skill_id
      };

      const response = await request(app)
        .post('/api/skills')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });
});

