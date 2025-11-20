/**
 * Unit Tests for Skill Model
 */

const Skill = require('../../../src/models/Skill');

describe('Skill Model', () => {
  describe('Validation', () => {
    it('should validate a valid skill', () => {
      const skill = new Skill({
        skill_id: 'skill_123',
        skill_name: 'JavaScript',
        parent_skill_id: null,
        description: 'Programming language'
      });

      const result = skill.validate();
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when skill_id is missing', () => {
      const skill = new Skill({
        skill_name: 'JavaScript'
      });

      const result = skill.validate();
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should fail validation when skill_name is missing', () => {
      const skill = new Skill({
        skill_id: 'skill_123'
      });

      const result = skill.validate();
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('isRoot', () => {
    it('should return true for root skill', () => {
      const skill = new Skill({
        skill_id: 'skill_123',
        skill_name: 'JavaScript',
        parent_skill_id: null
      });

      expect(skill.isRoot()).toBe(true);
    });

    it('should return false for child skill', () => {
      const skill = new Skill({
        skill_id: 'skill_123',
        skill_name: 'JavaScript',
        parent_skill_id: 'skill_456'
      });

      expect(skill.isRoot()).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should convert skill to JSON', () => {
      const skill = new Skill({
        skill_id: 'skill_123',
        skill_name: 'JavaScript',
        parent_skill_id: null,
        description: 'Programming language'
      });

      const json = skill.toJSON();
      expect(json).toHaveProperty('skill_id', 'skill_123');
      expect(json).toHaveProperty('skill_name', 'JavaScript');
    });
  });
});

