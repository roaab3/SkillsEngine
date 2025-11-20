/**
 * Skill Controller
 * 
 * Handles HTTP requests for skill operations.
 */

const skillService = require('../services/skillService');
const { query } = require('../../config/database');

class SkillController {
  /**
   * Get all root skills (L1)
   * GET /api/skills/roots
   */
  async getRootSkills(req, res) {
    try {
      const skills = await skillService.getRootSkills();
      res.json({ success: true, data: skills });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get skill by ID
   * GET /api/skills/:skillId
   */
  async getSkillById(req, res) {
    try {
      const { skillId } = req.params;
      const skill = await skillService.getSkillById(skillId);
      
      if (!skill) {
        return res.status(404).json({ success: false, error: 'Skill not found' });
      }

      res.json({ success: true, data: skill });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Create a new skill
   * POST /api/skills
   */
  async createSkill(req, res) {
    try {
      const skill = await skillService.createSkill(req.body);
      res.status(201).json({ success: true, data: skill });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * Update a skill
   * PUT /api/skills/:skillId
   */
  async updateSkill(req, res) {
    try {
      const { skillId } = req.params;
      const skill = await skillService.updateSkill(skillId, req.body);
      
      if (!skill) {
        return res.status(404).json({ success: false, error: 'Skill not found' });
      }

      res.json({ success: true, data: skill });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * Delete a skill
   * DELETE /api/skills/:skillId
   */
  async deleteSkill(req, res) {
    try {
      const { skillId } = req.params;
      const deleted = await skillService.deleteSkill(skillId);
      
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Skill not found' });
      }

      res.json({ success: true, message: 'Skill deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * Get skill tree (hierarchy)
   * GET /api/skills/:skillId/tree
   */
  async getSkillTree(req, res) {
    try {
      const { skillId } = req.params;
      const tree = await skillService.getSkillTree(skillId);
      
      if (!tree) {
        return res.status(404).json({ success: false, error: 'Skill not found' });
      }

      res.json({ success: true, data: tree });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get MGS for a root skill
   * GET /api/skills/:skillId/mgs
   */
  async getMGS(req, res) {
    try {
      const { skillId } = req.params;
      const mgs = await skillService.getMGS(skillId);
      res.json({ success: true, data: mgs, count: mgs.length });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * Search skills
   * GET /api/skills/search?q=pattern
   */
  async searchSkills(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ success: false, error: 'Search query is required' });
      }

      const skills = await skillService.searchSkills(q, {
        limit: parseInt(req.query.limit) || 100,
        offset: parseInt(req.query.offset) || 0
      });

      res.json({ success: true, data: skills });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new SkillController();


