/**
 * Skill Service
 * 
 * Business logic layer for skill hierarchy management.
 * Handles complex operations like hierarchy manipulation, validation, and traversal.
 */

const skillRepository = require('../repositories/skillRepository');
const Skill = require('../models/Skill');

class SkillService {
  /**
   * Create a new skill with hierarchy validation
   * @param {Object} skillData - Skill data
   * @returns {Promise<Skill>}
   */
  async createSkill(skillData) {
    const skill = new Skill(skillData);

    // Validate skill data
    const validation = skill.validate();
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // If parent is specified, validate it exists
    if (skill.parent_skill_id) {
      const parent = await skillRepository.findById(skill.parent_skill_id);
      if (!parent) {
        throw new Error(`Parent skill with ID ${skill.parent_skill_id} not found`);
      }
    }

    return await skillRepository.create(skill);
  }

  /**
   * Add a child skill to a parent
   * @param {string} parentSkillId - Parent skill ID
   * @param {Object} childSkillData - Child skill data
   * @returns {Promise<Skill>}
   */
  async addChildSkill(parentSkillId, childSkillData) {
    // Validate parent exists
    const parent = await skillRepository.findById(parentSkillId);
    if (!parent) {
      throw new Error(`Parent skill with ID ${parentSkillId} not found`);
    }

    // Set parent relationship
    childSkillData.parent_skill_id = parentSkillId;

    return await this.createSkill(childSkillData);
  }

  /**
   * Move a skill to a new parent
   * @param {string} skillId - Skill ID to move
   * @param {string} newParentId - New parent skill ID (null for root)
   * @returns {Promise<Skill>}
   */
  async moveSkill(skillId, newParentId) {
    const skill = await skillRepository.findById(skillId);
    if (!skill) {
      throw new Error(`Skill with ID ${skillId} not found`);
    }

    // Prevent moving to itself
    if (newParentId === skillId) {
      throw new Error('Cannot move skill to itself');
    }

    // If new parent is specified, validate it exists and check for circular reference
    if (newParentId) {
      const newParent = await skillRepository.findById(newParentId);
      if (!newParent) {
        throw new Error(`New parent skill with ID ${newParentId} not found`);
      }

      // Check for circular reference: new parent cannot be a descendant of the skill being moved
      const isDescendant = await this.isDescendant(newParentId, skillId);
      if (isDescendant) {
        throw new Error('Cannot move skill: would create circular reference');
      }
    }

    return await skillRepository.update(skillId, { parent_skill_id: newParentId });
  }

  /**
   * Check if a skill is a descendant of another skill
   * @param {string} potentialDescendantId - Potential descendant skill ID
   * @param {string} ancestorId - Ancestor skill ID
   * @returns {Promise<boolean>}
   */
  async isDescendant(potentialDescendantId, ancestorId) {
    if (potentialDescendantId === ancestorId) {
      return false; // Same skill is not a descendant
    }

    let currentSkillId = potentialDescendantId;
    const visited = new Set();

    while (currentSkillId) {
      if (visited.has(currentSkillId)) {
        // Circular reference detected
        return false;
      }
      visited.add(currentSkillId);

      const currentSkill = await skillRepository.findById(currentSkillId);
      if (!currentSkill || !currentSkill.parent_skill_id) {
        return false; // Reached root, not a descendant
      }

      if (currentSkill.parent_skill_id === ancestorId) {
        return true; // Found ancestor
      }

      currentSkillId = currentSkill.parent_skill_id;
    }

    return false;
  }

  /**
   * Get full skill hierarchy tree
   * @param {string} rootSkillId - Root skill ID
   * @returns {Promise<Object>} Tree structure
   */
  async getSkillTree(rootSkillId) {
    return await skillRepository.traverseHierarchy(rootSkillId);
  }

  /**
   * Get all root skills (L1 skills)
   * @returns {Promise<Skill[]>}
   */
  async getRootSkills() {
    return await skillRepository.findRootSkills();
  }

  /**
   * Get all MGS (Most Granular Skills) for a root skill
   * @param {string} rootSkillId - Root skill ID
   * @returns {Promise<Skill[]>}
   */
  async getMGS(rootSkillId) {
    // Validate root exists
    const root = await skillRepository.findById(rootSkillId);
    if (!root) {
      throw new Error(`Root skill with ID ${rootSkillId} not found`);
    }

    return await skillRepository.findMGS(rootSkillId);
  }

  /**
   * Count MGS for a root skill
   * @param {string} rootSkillId - Root skill ID
   * @returns {Promise<number>}
   */
  async countMGS(rootSkillId) {
    return await skillRepository.countMGS(rootSkillId);
  }

  /**
   * Get skill depth level
   * @param {string} skillId - Skill ID
   * @returns {Promise<number>} Depth (1 = L1, 2 = L2, etc.)
   */
  async getSkillDepth(skillId) {
    const skill = await skillRepository.findById(skillId);
    if (!skill) {
      throw new Error(`Skill with ID ${skillId} not found`);
    }

    // Calculate depth by traversing up to root
    let depth = 1;
    let currentSkill = skill;
    while (currentSkill.parent_skill_id) {
      depth++;
      currentSkill = await skillRepository.findById(currentSkill.parent_skill_id);
      if (!currentSkill) break;
    }

    return depth;
  }

  /**
   * Get all skills at a specific depth level
   * @param {number} depth - Depth level (1 = L1, 2 = L2, etc.)
   * @returns {Promise<Skill[]>}
   */
  async getSkillsByDepth(depth) {
    if (depth < 1) {
      throw new Error('Depth must be at least 1');
    }

    // Get all skills and filter by depth
    const allSkills = await skillRepository.findAll();
    const skillsWithDepth = await Promise.all(
      allSkills.map(async (skill) => {
        const skillDepth = await this.getSkillDepth(skill.skill_id);
        return { skill, depth: skillDepth };
      })
    );

    return skillsWithDepth
      .filter(item => item.depth === depth)
      .map(item => item.skill);
  }

  /**
   * Delete a skill and all its descendants
   * @param {string} skillId - Skill ID to delete
   * @returns {Promise<boolean>}
   */
  async deleteSkill(skillId) {
    const skill = await skillRepository.findById(skillId);
    if (!skill) {
      throw new Error(`Skill with ID ${skillId} not found`);
    }

    // Cascade delete is handled by database foreign key constraint
    return await skillRepository.delete(skillId);
  }

  /**
   * Get skill path from root to skill
   * @param {string} skillId - Skill ID
   * @returns {Promise<Skill[]>} Array of skills from root to target skill
   */
  async getSkillPath(skillId) {
    const skill = await skillRepository.findById(skillId);
    if (!skill) {
      throw new Error(`Skill with ID ${skillId} not found`);
    }

    const path = [];
    let currentSkill = skill;

    // Traverse up to root
    while (currentSkill) {
      path.unshift(currentSkill);
      if (currentSkill.parent_skill_id) {
        currentSkill = await skillRepository.findById(currentSkill.parent_skill_id);
      } else {
        currentSkill = null;
      }
    }

    return path;
  }

  /**
   * Find common ancestor of two skills
   * @param {string} skillId1 - First skill ID
   * @param {string} skillId2 - Second skill ID
   * @returns {Promise<Skill|null>}
   */
  async findCommonAncestor(skillId1, skillId2) {
    const path1 = await this.getSkillPath(skillId1);
    const path2 = await this.getSkillPath(skillId2);

    // Find first common skill in paths
    for (let i = path1.length - 1; i >= 0; i--) {
      for (let j = path2.length - 1; j >= 0; j--) {
        if (path1[i].skill_id === path2[j].skill_id) {
          return path1[i];
        }
      }
    }

    return null;
  }

  /**
   * Validate skill hierarchy integrity
   * @param {string} rootSkillId - Root skill ID to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateHierarchy(rootSkillId) {
    const errors = [];
    const warnings = [];

    const root = await skillRepository.findById(rootSkillId);
    if (!root) {
      return {
        valid: false,
        errors: [`Root skill with ID ${rootSkillId} not found`],
        warnings: []
      };
    }

    // Check for circular references
    const tree = await this.getSkillTree(rootSkillId);
    if (!tree) {
      errors.push('Failed to build hierarchy tree');
    }

    // Check all skills in hierarchy
    const checkSkill = async (skillNode) => {
      if (!skillNode) return;

      const skill = await skillRepository.findById(skillNode.skill_id);
      if (!skill) {
        errors.push(`Skill ${skillNode.skill_id} not found in database`);
        return;
      }

      // Validate parent relationship
      if (skill.parent_skill_id) {
        const parent = await skillRepository.findById(skill.parent_skill_id);
        if (!parent) {
          errors.push(`Parent ${skill.parent_skill_id} not found for skill ${skill.skill_id}`);
        }
      }

      // Recursively check children
      if (skillNode.children && skillNode.children.length > 0) {
        for (const child of skillNode.children) {
          await checkSkill(child);
        }
      }
    };

    if (tree) {
      await checkSkill(tree);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Search skills by name
   * @param {string} pattern - Search pattern
   * @param {Object} options - Search options
   * @returns {Promise<Skill[]>}
   */
  async searchSkills(pattern, options = {}) {
    return await skillRepository.searchByName(pattern, options);
  }

  /**
   * Get skill by ID
   * @param {string} skillId - Skill ID
   * @returns {Promise<Skill|null>}
   */
  async getSkillById(skillId) {
    return await skillRepository.findById(skillId);
  }

  /**
   * Update a skill
   * @param {string} skillId - Skill ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Skill|null>}
   */
  async updateSkill(skillId, updates) {
    // Validate parent if being updated
    if (updates.parent_skill_id !== undefined) {
      if (updates.parent_skill_id) {
        const newParent = await skillRepository.findById(updates.parent_skill_id);
        if (!newParent) {
          throw new Error(`New parent skill with ID ${updates.parent_skill_id} not found`);
        }

        // Check for circular reference
        const isDescendant = await this.isDescendant(updates.parent_skill_id, skillId);
        if (isDescendant) {
          throw new Error('Cannot update: would create circular reference');
        }
      }
    }

    return await skillRepository.update(skillId, updates);
  }
}

module.exports = new SkillService();

