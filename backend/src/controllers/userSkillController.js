/**
 * User Skill Controller
 *
 * CRUD operations for user_skill records.
 */

const userSkillRepository = require('../repositories/userSkillRepository');
const skillRepository = require('../repositories/skillRepository');
const UserSkill = require('../models/UserSkill');
const { paginate } = require('../utils/helpers');

class UserSkillController {
  /**
   * List user skills with optional filters
   * GET /api/user-skill/:userId
   */
  async getUserSkills(req, res) {
    try {
      const { userId } = req.params;
      const { skill_id: skillId, verified, source, page = 1, limit = 20 } = req.query;

      if (skillId) {
        const record = await userSkillRepository.findByUserAndSkill(userId, skillId);
        if (!record) {
          return res.status(404).json({ success: false, error: 'User skill not found' });
        }
        return res.json({ success: true, data: record.toJSON ? record.toJSON() : record });
      }

      const filters = {};
      if (verified !== undefined) {
        if (verified === 'true' || verified === true) {
          filters.verified = true;
        } else if (verified === 'false' || verified === false) {
          filters.verified = false;
        }
      }
      if (source) {
        filters.source = source;
      }

      const skills = await userSkillRepository.findByUser(userId, filters);
      const records = skills.map(skill => (skill.toJSON ? skill.toJSON() : skill));

      const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
      const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

      const paginated = paginate(records, pageNumber, limitNumber);

      res.json({
        success: true,
        data: paginated.data,
        pagination: paginated.pagination,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get user skill
   * GET /api/user-skill/:userId/:skillId
   */
  async getUserSkill(req, res) {
    try {
      const { userId, skillId } = req.params;
      const record = await userSkillRepository.findByUserAndSkill(userId, skillId);

      if (!record) {
        return res.status(404).json({ success: false, error: 'User skill not found' });
      }

      res.json({ success: true, data: record.toJSON ? record.toJSON() : record });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Upsert user skill
   * PUT /api/user-skill/:userId/:skillId
   */
  async upsertUserSkill(req, res) {
    try {
      const { userId, skillId } = req.params;

      const skillExists = await skillRepository.findById(skillId);
      if (!skillExists) {
        return res.status(404).json({ success: false, error: 'Skill not found' });
      }

      const payload = {
        user_id: userId,
        skill_id: skillId,
        skill_name: req.body.skill_name || req.body.skillName || skillExists.skill_name,
        verified: req.body.verified ?? false,
        source: req.body.source || 'ai',
      };

      const userSkill = new UserSkill(payload);
      const validation = userSkill.validate();
      if (!validation.valid) {
        return res.status(400).json({ success: false, error: validation.errors.join(', ') });
      }

      const existing = await userSkillRepository.findByUserAndSkill(userId, skillId);
      const result = await userSkillRepository.upsert(userSkill);

      res.status(existing ? 200 : 201).json({
        success: true,
        data: result.toJSON ? result.toJSON() : result,
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * Delete user skill
   * DELETE /api/user-skill/:userId/:skillId
   */
  async deleteUserSkill(req, res) {
    try {
      const { userId, skillId } = req.params;
      const deleted = await userSkillRepository.delete(userId, skillId);

      if (!deleted) {
        return res.status(404).json({ success: false, error: 'User skill not found' });
      }

      res.json({ success: true, message: 'User skill deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new UserSkillController();


