/**
 * Gap Analysis Service
 * 
 * Calculates skill gaps for users based on competency requirements.
 * Feature 5: Gap Analysis
 */

const userCompetencyRepository = require('../repositories/userCompetencyRepository');
const competencyService = require('./competencyService');
const skillRepository = require('../repositories/skillRepository');

class GapAnalysisService {
  /**
   * Calculate gap analysis for a user
   * @param {string} userId - User ID
   * @param {string} competencyId - Competency ID (optional, if not provided, calculate for all)
   * @returns {Promise<Object>} Gap analysis result
   */
  async calculateGapAnalysis(userId, competencyId = null) {
    const userCompetencies = competencyId
      ? [await userCompetencyRepository.findByUserAndCompetency(userId, competencyId)]
      : await userCompetencyRepository.findByUser(userId);

    const gaps = {};

    for (const userComp of userCompetencies) {
      if (!userComp) continue;

      // Get required MGS for this competency
      const requiredMGS = await competencyService.getRequiredMGS(userComp.competency_id);
      const requiredMGSIds = new Set(requiredMGS.map(mgs => mgs.skill_id));

      // Get verified skills from userCompetency
      const verifiedSkillIds = new Set(
        (userComp.verifiedSkills || []).map(skill => skill.skill_id)
      );

      // Calculate missing MGS
      const missingMGS = requiredMGS.filter(mgs => !verifiedSkillIds.has(mgs.skill_id));

      // Group missing MGS by competency (for nested competencies)
      const missingByCompetency = {};
      for (const mgs of missingMGS) {
        // Find which competency this MGS belongs to
        const competency = await this.findCompetencyForMGS(mgs.skill_id, userComp.competency_id);
        const compName = competency?.competency_name || 'Unknown';
        
        if (!missingByCompetency[compName]) {
          missingByCompetency[compName] = [];
        }
        missingByCompetency[compName].push({
          skill_id: mgs.skill_id,
          skill_name: mgs.skill_name
        });
      }

      gaps[userComp.competency_id] = {
        competency_id: userComp.competency_id,
        required_mgs_count: requiredMGS.length,
        verified_mgs_count: verifiedSkillIds.size,
        missing_mgs_count: missingMGS.length,
        missing_mgs: missingByCompetency,
        coverage_percentage: userComp.coverage_percentage
      };
    }

    return gaps;
  }

  /**
   * Find which competency a MGS belongs to
   * @param {string} mgsId - MGS skill ID
   * @param {string} rootCompetencyId - Root competency ID
   * @returns {Promise<Object|null>} Competency object
   */
  async findCompetencyForMGS(mgsId, rootCompetencyId) {
    // Get all competencies that require this skill
    const competencies = await competencyService.getCompetenciesBySkill(mgsId);
    
    // Find the one that matches or is a child of rootCompetencyId
    for (const comp of competencies) {
      if (comp.competency_id === rootCompetencyId) {
        return comp;
      }
      
      // Check if it's a child of rootCompetencyId
      const hierarchy = await competencyService.getCompetencyHierarchy(rootCompetencyId);
      if (hierarchy && hierarchy.children) {
        const child = hierarchy.children.find(c => c.competency_id === comp.competency_id);
        if (child) {
          return comp;
        }
      }
    }

    return null;
  }

  /**
   * Calculate gap analysis for all user competencies
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Gap analysis for all competencies
   */
  async calculateAllGaps(userId) {
    return await this.calculateGapAnalysis(userId);
  }
}

module.exports = new GapAnalysisService();


