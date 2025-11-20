/**
 * Competency Skill Controller
 *
 * Manage links between competencies and skills (competency_skill junction table).
 */

const competencyRepository = require('../repositories/competencyRepository');
const competencyService = require('../services/competencyService');
const skillRepository = require('../repositories/skillRepository');

class CompetencySkillController {
  /**
   * Get all skills linked to a competency
   * GET /api/competency-skill/:competencyId
   */
  async getLinkedSkills(req, res) {
    try {
      const { competencyId } = req.params;
      const competency = await competencyRepository.findById(competencyId);
      if (!competency) {
        return res.status(404).json({ success: false, error: 'Competency not found' });
      }

      const skills = await competencyRepository.getLinkedSkills(competencyId);
      const data = skills.map(skill => (skill.toJSON ? skill.toJSON() : skill));
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Link skills to a competency
   * POST /api/competency-skill/:competencyId
   */
  async addSkills(req, res) {
    try {
      const { competencyId } = req.params;
      const { skillIds } = req.body;

      if (!Array.isArray(skillIds) || skillIds.length === 0) {
        return res.status(400).json({ success: false, error: 'skillIds must be a non-empty array' });
      }

      await competencyService.linkSkills(competencyId, skillIds);
      const updated = await competencyRepository.getLinkedSkills(competencyId);
      const data = updated.map(skill => (skill.toJSON ? skill.toJSON() : skill));

      res.json({
        success: true,
        message: 'Skills linked successfully',
        data,
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * Remove skill link
   * DELETE /api/competency-skill/:competencyId/:skillId
   */
  async removeSkill(req, res) {
    try {
      const { competencyId, skillId } = req.params;

      const competency = await competencyRepository.findById(competencyId);
      if (!competency) {
        return res.status(404).json({ success: false, error: 'Competency not found' });
      }

      const skill = await skillRepository.findById(skillId);
      if (!skill) {
        return res.status(404).json({ success: false, error: 'Skill not found' });
      }

      const removed = await competencyService.unlinkSkill(competencyId, skillId);
      if (!removed) {
        return res.status(404).json({ success: false, error: 'Link not found' });
      }

      res.json({ success: true, message: 'Skill unlinked successfully' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new CompetencySkillController();


