/**
 * Skill Repository
 * 
 * Data access layer for skills table.
 * Handles CRUD operations, hierarchy traversal, and MGS identification.
 */

const { query, transaction } = require('../../config/database');
const Skill = require('../models/Skill');

class SkillRepository {
  /**
   * Create a new skill
   * @param {Skill} skill - Skill model instance
   * @returns {Promise<Skill>}
   */
  async create(skill) {
    const validation = skill.validate();
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const sql = `
      INSERT INTO skills (skill_id, skill_name, parent_skill_id, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      skill.skill_id,
      skill.skill_name,
      skill.parent_skill_id,
      skill.description
    ];

    const result = await query(sql, values);
    return new Skill(result.rows[0]);
  }

  /**
   * Find skill by ID
   * @param {string} skillId - Skill ID
   * @returns {Promise<Skill|null>}
   */
  async findById(skillId) {
    const sql = 'SELECT * FROM skills WHERE skill_id = $1';
    const result = await query(sql, [skillId]);

    if (result.rows.length === 0) {
      return null;
    }

    return new Skill(result.rows[0]);
  }

  /**
   * Find skill by name (case-insensitive)
   * @param {string} skillName - Skill name
   * @returns {Promise<Skill|null>}
   */
  async findByName(skillName) {
    const sql = 'SELECT * FROM skills WHERE LOWER(TRIM(skill_name)) = LOWER(TRIM($1))';
    const result = await query(sql, [skillName]);

    if (result.rows.length === 0) {
      return null;
    }

    return new Skill(result.rows[0]);
  }

  /**
   * Find all skills
   * @param {Object} options - Query options
   * @param {number} options.limit - Maximum number of results
   * @param {number} options.offset - Number of results to skip
   * @returns {Promise<Skill[]>}
   */
  async findAll(options = {}) {
    const { limit = 100, offset = 0 } = options;
    const sql = `
      SELECT * FROM skills
      ORDER BY skill_name
      LIMIT $1 OFFSET $2
    `;
    const result = await query(sql, [limit, offset]);
    return result.rows.map(row => new Skill(row));
  }

  /**
   * Find all root/top-level skills (L1 skills)
   * @returns {Promise<Skill[]>}
   */
  async findRootSkills() {
    const sql = 'SELECT * FROM skills WHERE parent_skill_id IS NULL ORDER BY skill_name';
    const result = await query(sql);
    return result.rows.map(row => new Skill(row));
  }

  /**
   * Find all child skills of a parent skill
   * @param {string} parentSkillId - Parent skill ID
   * @returns {Promise<Skill[]>}
   */
  async findChildren(parentSkillId) {
    const sql = 'SELECT * FROM skills WHERE parent_skill_id = $1 ORDER BY skill_name';
    const result = await query(sql, [parentSkillId]);
    return result.rows.map(row => new Skill(row));
  }

  /**
   * Find parent skill
   * @param {string} skillId - Skill ID
   * @returns {Promise<Skill|null>}
   */
  async findParent(skillId) {
    const skill = await this.findById(skillId);
    if (!skill || !skill.parent_skill_id) {
      return null;
    }
    return this.findById(skill.parent_skill_id);
  }

  /**
   * Update a skill
   * @param {string} skillId - Skill ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Skill|null>}
   */
  async update(skillId, updates) {
    const allowedFields = ['skill_name', 'parent_skill_id', 'description'];
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (updates.hasOwnProperty(field)) {
        updateFields.push(`${field} = $${paramIndex}`);
        values.push(updates[field]);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(skillId);
    const sql = `
      UPDATE skills
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE skill_id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return null;
    }

    return new Skill(result.rows[0]);
  }

  /**
   * Delete a skill (cascade deletes children)
   * @param {string} skillId - Skill ID
   * @returns {Promise<boolean>}
   */
  async delete(skillId) {
    const sql = 'DELETE FROM skills WHERE skill_id = $1 RETURNING skill_id';
    const result = await query(sql, [skillId]);
    return result.rows.length > 0;
  }

  /**
   * Traverse skill hierarchy from a root skill to all descendants
   * @param {string} rootSkillId - Root skill ID
   * @returns {Promise<Object>} Tree structure with all descendants
   */
  async traverseHierarchy(rootSkillId) {
    const rootSkill = await this.findById(rootSkillId);
    if (!rootSkill) {
      return null;
    }

    const buildTree = async (skill) => {
      const children = await this.findChildren(skill.skill_id);
      const childrenWithDescendants = await Promise.all(
        children.map(child => buildTree(child))
      );

      return {
        ...skill.toJSON(),
        children: childrenWithDescendants
      };
    };

    return buildTree(rootSkill);
  }

  /**
   * Get all MGS (Most Granular Skills) for a given root skill
   * MGS are leaf nodes (skills with no children) in the hierarchy
   * @param {string} rootSkillId - Root skill ID
   * @returns {Promise<Skill[]>}
   */
  async findMGS(rootSkillId) {
    // Recursive CTE to find all leaf nodes under the root skill
    const sql = `
      WITH RECURSIVE skill_tree AS (
        -- Base case: start with root skill
        SELECT skill_id, skill_name, parent_skill_id, description, created_at, updated_at
        FROM skills
        WHERE skill_id = $1
        
        UNION ALL
        
        -- Recursive case: get all children
        SELECT s.skill_id, s.skill_name, s.parent_skill_id, s.description, s.created_at, s.updated_at
        FROM skills s
        INNER JOIN skill_tree st ON s.parent_skill_id = st.skill_id
      )
      SELECT st.*
      FROM skill_tree st
      WHERE NOT EXISTS (
        SELECT 1
        FROM skills s
        WHERE s.parent_skill_id = st.skill_id
      )
      ORDER BY st.skill_name
    `;

    const result = await query(sql, [rootSkillId]);
    return result.rows.map(row => new Skill(row));
  }

  /**
   * Count total MGS for a root skill
   * @param {string} rootSkillId - Root skill ID
   * @returns {Promise<number>}
   */
  async countMGS(rootSkillId) {
    const mgs = await this.findMGS(rootSkillId);
    return mgs.length;
  }

  /**
   * Get hierarchy depth for a skill
   * @param {string} skillId - Skill ID
   * @returns {Promise<number>} Depth level (1 = L1, 2 = L2, etc.)
   */
  async getDepth(skillId) {
    const sql = `
      WITH RECURSIVE skill_depth AS (
        -- Base case: start with the skill
        SELECT skill_id, parent_skill_id, 1 as depth
        FROM skills
        WHERE skill_id = $1
        
        UNION ALL
        
        -- Recursive case: traverse up to root
        SELECT s.skill_id, s.parent_skill_id, sd.depth + 1
        FROM skills s
        INNER JOIN skill_depth sd ON s.skill_id = sd.parent_skill_id
      )
      SELECT MAX(depth) as max_depth
      FROM skill_depth
    `;

    const result = await query(sql, [skillId]);
    return result.rows[0]?.max_depth || 0;
  }

  /**
   * Check if a skill is a leaf node (MGS)
   * @param {string} skillId - Skill ID
   * @returns {Promise<boolean>}
   */
  async isLeaf(skillId) {
    const sql = `
      SELECT COUNT(*) as child_count
      FROM skills
      WHERE parent_skill_id = $1
    `;
    const result = await query(sql, [skillId]);
    return parseInt(result.rows[0].child_count) === 0;
  }

  /**
   * Find all skills by name pattern (LIKE search)
   * @param {string} pattern - Search pattern (supports % wildcards)
   * @param {Object} options - Query options
   * @returns {Promise<Skill[]>}
   */
  async searchByName(pattern, options = {}) {
    const { limit = 100, offset = 0 } = options;
    const sql = `
      SELECT * FROM skills
      WHERE LOWER(skill_name) LIKE LOWER($1)
      ORDER BY skill_name
      LIMIT $2 OFFSET $3
    `;
    const result = await query(sql, [`%${pattern}%`, limit, offset]);
    return result.rows.map(row => new Skill(row));
  }
}

module.exports = new SkillRepository();


