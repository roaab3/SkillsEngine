/**
 * User Competency Controller
 *
 * CRUD operations for user_competency records.
 */

const userCompetencyRepository = require('../repositories/userCompetencyRepository');
const competencyRepository = require('../repositories/competencyRepository');
const UserCompetency = require('../models/UserCompetency');
const { paginate } = require('../utils/helpers');

class UserCompetencyController {
  /**
   * List user competencies with optional pagination
   * GET /api/user-competency/:userId
   */
  async getUserCompetencies(req, res) {
    try {
      const { userId } = req.params;
      const { competency_id: competencyId, page = 1, limit = 20 } = req.query;

      if (competencyId) {
        const competency = await userCompetencyRepository.findByUserAndCompetency(userId, competencyId);
        if (!competency) {
          return res.status(404).json({ success: false, error: 'User competency not found' });
        }
        return res.json({ success: true, data: competency.toJSON ? competency.toJSON() : competency });
      }

      const competencies = await userCompetencyRepository.findByUser(userId);
      const records = competencies.map(record => (record.toJSON ? record.toJSON() : record));

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
   * Get single user competency
   * GET /api/user-competency/:userId/:competencyId
   */
  async getUserCompetency(req, res) {
    try {
      const { userId, competencyId } = req.params;
      const competency = await userCompetencyRepository.findByUserAndCompetency(userId, competencyId);

      if (!competency) {
        return res.status(404).json({ success: false, error: 'User competency not found' });
      }

      res.json({ success: true, data: competency.toJSON ? competency.toJSON() : competency });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Upsert user competency
   * PUT /api/user-competency/:userId/:competencyId
   */
  async upsertUserCompetency(req, res) {
    try {
      const { userId, competencyId } = req.params;
      const competencyExists = await competencyRepository.findById(competencyId);

      if (!competencyExists) {
        return res.status(404).json({ success: false, error: 'Competency not found' });
      }

      const payload = {
        user_id: userId,
        competency_id: competencyId,
        coverage_percentage:
          req.body.coverage_percentage ?? req.body.coveragePercentage ?? 0,
        proficiency_level: req.body.proficiency_level || req.body.proficiencyLevel || null,
        verifiedSkills: req.body.verified_skills || req.body.verifiedSkills || [],
      };

      const userCompetency = new UserCompetency(payload);
      const validation = userCompetency.validate();
      if (!validation.valid) {
        return res.status(400).json({ success: false, error: validation.errors.join(', ') });
      }

      const existing = await userCompetencyRepository.findByUserAndCompetency(userId, competencyId);
      const result = await userCompetencyRepository.upsert(userCompetency);

      res.status(existing ? 200 : 201).json({
        success: true,
        data: result.toJSON ? result.toJSON() : result,
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * Delete user competency
   * DELETE /api/user-competency/:userId/:competencyId
   */
  async deleteUserCompetency(req, res) {
    try {
      const { userId, competencyId } = req.params;
      const deleted = await userCompetencyRepository.delete(userId, competencyId);

      if (!deleted) {
        return res.status(404).json({ success: false, error: 'User competency not found' });
      }

      res.json({ success: true, message: 'User competency deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new UserCompetencyController();


