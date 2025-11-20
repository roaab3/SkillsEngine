/**
 * MGS Calculation Service
 * 
 * Handles MGS (Most Granular Skills) count calculation and caching.
 * Optimizes performance for frequently accessed MGS counts.
 */

const skillRepository = require('../repositories/skillRepository');
const competencyService = require('./competencyService');

class MGSCalculationService {
  /**
   * Calculate and cache MGS count for an L1 skill
   * @param {string} rootSkillId - Root (L1) skill ID
   * @returns {Promise<number>} MGS count
   */
  async calculateAndCacheMGS(rootSkillId) {
    const rootSkill = await skillRepository.findById(rootSkillId);
    if (!rootSkill) {
      throw new Error(`Root skill with ID ${rootSkillId} not found`);
    }

    if (!rootSkill.isRoot()) {
      throw new Error(`Skill ${rootSkillId} is not a root (L1) skill`);
    }

    const count = await skillRepository.countMGS(rootSkillId);
    
    // TODO: Implement caching mechanism (Redis or in-memory cache)
    // For now, just return the count
    
    return count;
  }

  /**
   * Get cached MGS count for an L1 skill
   * @param {string} rootSkillId - Root (L1) skill ID
   * @returns {Promise<number|null>} Cached count or null if not cached
   */
  async getCachedMGSCount(rootSkillId) {
    // TODO: Implement cache retrieval
    // For now, return null to force recalculation
    return null;
  }

  /**
   * Calculate MGS count for multiple L1 skills
   * @param {string[]} rootSkillIds - Array of root skill IDs
   * @returns {Promise<Object>} Map of skill_id -> MGS count
   */
  async calculateMGSForMultiple(rootSkillIds) {
    const results = {};

    for (const rootSkillId of rootSkillIds) {
      try {
        const count = await this.calculateAndCacheMGS(rootSkillId);
        results[rootSkillId] = count;
      } catch (error) {
        results[rootSkillId] = { error: error.message };
      }
    }

    return results;
  }

  /**
   * Calculate total MGS required for a competency
   * @param {string} competencyId - Competency ID
   * @returns {Promise<number>} Total MGS count
   */
  async calculateMGSForCompetency(competencyId) {
    const mgs = await competencyService.getRequiredMGS(competencyId);
    return mgs.length;
  }

  /**
   * Invalidate MGS cache for a skill (when hierarchy changes)
   * @param {string} skillId - Skill ID
   * @returns {Promise<boolean>}
   */
  async invalidateCache(skillId) {
    // TODO: Implement cache invalidation
    // Find all root skills that contain this skill and invalidate their cache
    return true;
  }

  /**
   * Batch calculate MGS for all L1 skills
   * @returns {Promise<Object>} Map of all L1 skills with their MGS counts
   */
  async calculateAllL1MGS() {
    const rootSkills = await skillRepository.findRootSkills();
    const results = {};

    for (const rootSkill of rootSkills) {
      try {
        const count = await this.calculateAndCacheMGS(rootSkill.skill_id);
        results[rootSkill.skill_id] = {
          skill_name: rootSkill.skill_name,
          mgs_count: count
        };
      } catch (error) {
        results[rootSkill.skill_id] = {
          skill_name: rootSkill.skill_name,
          error: error.message
        };
      }
    }

    return results;
  }
}

module.exports = new MGSCalculationService();


