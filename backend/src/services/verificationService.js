/**
 * Verification Service
 * 
 * Handles skill verification from exam results.
 * Features 3.1, 3.2, 3.3: Baseline and Post-Course Exam Verification
 */

const userCompetencyRepository = require('../repositories/userCompetencyRepository');
const userSkillRepository = require('../repositories/userSkillRepository');
const competencyService = require('./competencyService');
const skillRepository = require('../repositories/skillRepository');

class VerificationService {
  /**
   * Process baseline exam results (Feature 3.2)
   * @param {string} userId - User ID
   * @param {Object} examResults - Exam results from Assessment MS
   * @returns {Promise<Object>} Updated profile
   */
  async processBaselineExamResults(userId, examResults) {
    const { verified_skills = [] } = examResults;

    // Update userCompetency with verified skills
    const updatedCompetencies = new Set();

    for (const verifiedSkill of verified_skills) {
      const { skill_id, skill_name, score, passed } = verifiedSkill;

      // Update userSkill
      const userSkill = await userSkillRepository.findByUserAndSkill(userId, skill_id);
      if (userSkill) {
        await userSkillRepository.update(userId, skill_id, {
          verified: passed || score >= 70, // Assuming 70% is passing
          source: 'assessment'
        });
      }

      // Find competencies that require this skill
      const competencies = await competencyService.getCompetenciesBySkill(skill_id);

      for (const competency of competencies) {
        let userComp = await userCompetencyRepository.findByUserAndCompetency(
          userId,
          competency.competency_id
        );

        if (!userComp) {
          // Create userCompetency if doesn't exist
          userComp = await userCompetencyRepository.create({
            user_id: userId,
            competency_id: competency.competency_id,
            coverage_percentage: 0.00,
            proficiency_level: null,
            verifiedSkills: []
          });
        }

        // Update verifiedSkills array
        const verifiedSkills = userComp.verifiedSkills || [];
        const existingIndex = verifiedSkills.findIndex(s => s.skill_id === skill_id);

        const verifiedSkillData = {
          skill_id: skill_id,
          skill_name: skill_name,
          verified: passed || score >= 70,
          lastUpdate: new Date().toISOString()
        };

        if (existingIndex >= 0) {
          verifiedSkills[existingIndex] = verifiedSkillData;
        } else {
          verifiedSkills.push(verifiedSkillData);
        }

        // Recalculate coverage percentage
        const coverage = await this.calculateCoverage(userId, competency.competency_id);

        // Map coverage to proficiency level
        const proficiencyLevel = this.mapCoverageToProficiency(coverage);

        await userCompetencyRepository.update(userId, competency.competency_id, {
          verifiedSkills: verifiedSkills,
          coverage_percentage: coverage,
          proficiency_level: proficiencyLevel
        });

        updatedCompetencies.add(competency.competency_id);
      }
    }

    return {
      userId,
      updated_competencies: Array.from(updatedCompetencies),
      verified_skills_count: verified_skills.length
    };
  }

  /**
   * Process post-course exam results (Feature 3.3)
   * @param {string} userId - User ID
   * @param {Object} examResults - Exam results from Assessment MS
   * @returns {Promise<Object>} Updated profile
   */
  async processPostCourseExamResults(userId, examResults) {
    // Same logic as baseline, but may have different business rules
    return await this.processBaselineExamResults(userId, examResults);
  }

  /**
   * Calculate coverage percentage for a competency
   * @param {string} userId - User ID
   * @param {string} competencyId - Competency ID
   * @returns {Promise<number>} Coverage percentage (0-100)
   */
  async calculateCoverage(userId, competencyId) {
    // Get required MGS
    const requiredMGS = await competencyService.getRequiredMGS(competencyId);
    const requiredCount = requiredMGS.length;

    if (requiredCount === 0) {
      return 0;
    }

    // Get verified skills from userCompetency
    const userComp = await userCompetencyRepository.findByUserAndCompetency(userId, competencyId);
    if (!userComp) {
      return 0;
    }

    const verifiedSkills = userComp.verifiedSkills || [];
    const verifiedCount = verifiedSkills.filter(s => s.verified === true).length;

    return Math.round((verifiedCount / requiredCount) * 100 * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Map coverage percentage to proficiency level
   * @param {number} coverage - Coverage percentage (0-100)
   * @returns {string} Proficiency level
   */
  mapCoverageToProficiency(coverage) {
    if (coverage >= 80) return 'EXPERT';
    if (coverage >= 60) return 'ADVANCED';
    if (coverage >= 40) return 'INTERMEDIATE';
    if (coverage > 0) return 'BEGINNER';
    return null;
  }
}

module.exports = new VerificationService();


