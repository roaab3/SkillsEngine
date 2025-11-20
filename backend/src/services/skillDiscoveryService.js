/**
 * Skill Discovery Service
 * 
 * Handles internal and external skill discovery.
 * Features 6.1, 6.2: Internal Skill Lookup & External Competency Discovery
 */

const competencyRepository = require('../repositories/competencyRepository');
const skillRepository = require('../repositories/skillRepository');
const competencyService = require('./competencyService');
const aiService = require('./aiService');

class SkillDiscoveryService {
  /**
   * Internal skill lookup by competency (Feature 6.1)
   * @param {string} competencyName - Competency name
   * @returns {Promise<Object|null>} MGS list or null if not found
   */
  async lookupByCompetency(competencyName) {
    // Find competency by name
    const competency = await competencyRepository.findByName(competencyName);
    if (!competency) {
      return null;
    }

    // Get linked L1 skills
    const linkedSkills = await competencyRepository.getLinkedSkills(competency.competency_id);

    // Get all MGS for each L1 skill
    const allMGS = [];
    for (const skill of linkedSkills) {
      const mgs = await skillRepository.findMGS(skill.skill_id);
      allMGS.push(...mgs);
    }

    // If competency has children, aggregate their MGS too
    const children = await competencyRepository.findChildren(competency.competency_id);
    for (const child of children) {
      const childResult = await this.lookupByCompetency(child.competency_name);
      if (childResult && childResult.mgs) {
        allMGS.push(...childResult.mgs);
      }
    }

    // Remove duplicates
    const uniqueMGS = Array.from(
      new Map(allMGS.map(mgs => [mgs.skill_id, mgs])).values()
    );

    return {
      competency_id: competency.competency_id,
      competency_name: competency.competency_name,
      mgs: uniqueMGS.map(mgs => ({
        skill_id: mgs.skill_id,
        skill_name: mgs.skill_name
      }))
    };
  }

  /**
   * External competency discovery (Feature 6.2)
   * @param {string} competencyName - Competency name
   * @returns {Promise<Object>} Discovered competency and skills
   */
  async discoverExternal(competencyName) {
    // TODO: Load external discovery prompt
    const prompt = `Discover the competency "${competencyName}" and list all related skills in a hierarchical structure. Return JSON with competency name and skills array.`;

    try {
      const discovered = await aiService.callGeminiJSON(prompt, { modelType: 'pro' });

      // Store discovered data in taxonomy
      if (discovered.competency) {
        const competency = await competencyRepository.create({
          competency_id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          competency_name: discovered.competency.name || competencyName,
          description: discovered.competency.description || null,
          parent_competency_id: null
        });

        // Store skills
        const mgs = [];
        for (const skillData of discovered.skills || []) {
          const skill = await skillRepository.create({
            skill_id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            skill_name: skillData.name,
            description: skillData.description || null,
            parent_skill_id: null // L1 skill
          });

          // Link to competency
          await competencyRepository.linkSkill(competency.competency_id, skill.skill_id);

          // If skill has sub-skills, create them
          if (skillData.sub_skills && skillData.sub_skills.length > 0) {
            for (const subSkillData of skillData.sub_skills) {
              const subSkill = await skillRepository.create({
                skill_id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                skill_name: subSkillData.name,
                description: subSkillData.description || null,
                parent_skill_id: skill.skill_id
              });

              // Get MGS recursively
              const subMGS = await skillRepository.findMGS(subSkill.skill_id);
              mgs.push(...subMGS);
            }
          } else {
            // Skill itself is MGS
            mgs.push(skill);
          }
        }

        return {
          competency_id: competency.competency_id,
          competency_name: competency.competency_name,
          mgs: mgs.map(m => ({
            skill_id: m.skill_id,
            skill_name: m.skill_name
          }))
        };
      }

      throw new Error('Invalid discovery response structure');
    } catch (error) {
      throw new Error(`External discovery failed: ${error.message}`);
    }
  }
}

module.exports = new SkillDiscoveryService();


