/**
 * Competency Repository
 * 
 * Data access layer for competencies table.
 * Handles CRUD operations, parent-child relationships, and skill mappings.
 */

const { query } = require('../../config/database');
const Competency = require('../models/Competency');

class CompetencyRepository {
  /**
   * Create a new competency
   * @param {Competency} competency - Competency model instance
   * @returns {Promise<Competency>}
   */
  async create(competency) {
    const validation = competency.validate();
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const sql = `
      INSERT INTO competencies (competency_id, competency_name, description, parent_competency_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      competency.competency_id,
      competency.competency_name,
      competency.description,
      competency.parent_competency_id
    ];

    const result = await query(sql, values);
    return new Competency(result.rows[0]);
  }

  /**
   * Find competency by ID
   * @param {string} competencyId - Competency ID
   * @returns {Promise<Competency|null>}
   */
  async findById(competencyId) {
    const sql = 'SELECT * FROM competencies WHERE competency_id = $1';
    const result = await query(sql, [competencyId]);

    if (result.rows.length === 0) {
      return null;
    }

    return new Competency(result.rows[0]);
  }

  /**
   * Find competency by name (case-insensitive)
   * @param {string} competencyName - Competency name
   * @returns {Promise<Competency|null>}
   */
  async findByName(competencyName) {
    const sql = 'SELECT * FROM competencies WHERE LOWER(TRIM(competency_name)) = LOWER(TRIM($1))';
    const result = await query(sql, [competencyName]);

    if (result.rows.length === 0) {
      return null;
    }

    return new Competency(result.rows[0]);
  }

  /**
   * Find all competencies
   * @param {Object} options - Query options
   * @param {number} options.limit - Maximum number of results
   * @param {number} options.offset - Number of results to skip
   * @returns {Promise<Competency[]>}
   */
  async findAll(options = {}) {
    const { limit = 100, offset = 0 } = options;
    const sql = `
      SELECT * FROM competencies
      ORDER BY competency_name
      LIMIT $1 OFFSET $2
    `;
    const result = await query(sql, [limit, offset]);
    return result.rows.map(row => new Competency(row));
  }

  /**
   * Find all parent competencies (top-level)
   * @returns {Promise<Competency[]>}
   */
  async findParentCompetencies() {
    const sql = 'SELECT * FROM competencies WHERE parent_competency_id IS NULL ORDER BY competency_name';
    const result = await query(sql);
    return result.rows.map(row => new Competency(row));
  }

  /**
   * Find all child competencies of a parent
   * @param {string} parentCompetencyId - Parent competency ID
   * @returns {Promise<Competency[]>}
   */
  async findChildren(parentCompetencyId) {
    const sql = 'SELECT * FROM competencies WHERE parent_competency_id = $1 ORDER BY competency_name';
    const result = await query(sql, [parentCompetencyId]);
    return result.rows.map(row => new Competency(row));
  }

  /**
   * Find parent competency
   * @param {string} competencyId - Competency ID
   * @returns {Promise<Competency|null>}
   */
  async findParent(competencyId) {
    const competency = await this.findById(competencyId);
    if (!competency || !competency.parent_competency_id) {
      return null;
    }
    return this.findById(competency.parent_competency_id);
  }

  /**
   * Update a competency
   * @param {string} competencyId - Competency ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Competency|null>}
   */
  async update(competencyId, updates) {
    const allowedFields = ['competency_name', 'description', 'parent_competency_id'];
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

    values.push(competencyId);
    const sql = `
      UPDATE competencies
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE competency_id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return null;
    }

    return new Competency(result.rows[0]);
  }

  /**
   * Delete a competency (cascade deletes children)
   * @param {string} competencyId - Competency ID
   * @returns {Promise<boolean>}
   */
  async delete(competencyId) {
    const sql = 'DELETE FROM competencies WHERE competency_id = $1 RETURNING competency_id';
    const result = await query(sql, [competencyId]);
    return result.rows.length > 0;
  }

  /**
   * Get all skills linked to a competency (L1 skills only)
   * @param {string} competencyId - Competency ID
   * @returns {Promise<Array>} Array of skill objects
   */
  async getLinkedSkills(competencyId) {
    const sql = `
      SELECT s.skill_id, s.skill_name, s.description, s.parent_skill_id, s.created_at, s.updated_at
      FROM skills s
      INNER JOIN competency_skill cs ON s.skill_id = cs.skill_id
      WHERE cs.competency_id = $1
      ORDER BY s.skill_name
    `;
    const result = await query(sql, [competencyId]);
    return result.rows;
  }

  /**
   * Link a skill to a competency
   * @param {string} competencyId - Competency ID
   * @param {string} skillId - Skill ID (should be L1/top-level skill)
   * @returns {Promise<boolean>}
   */
  async linkSkill(competencyId, skillId) {
    // Check if link already exists
    const checkSql = 'SELECT * FROM competency_skill WHERE competency_id = $1 AND skill_id = $2';
    const checkResult = await query(checkSql, [competencyId, skillId]);

    if (checkResult.rows.length > 0) {
      return true; // Already linked
    }

    const sql = `
      INSERT INTO competency_skill (competency_id, skill_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await query(sql, [competencyId, skillId]);
    return result.rows.length > 0;
  }

  /**
   * Unlink a skill from a competency
   * @param {string} competencyId - Competency ID
   * @param {string} skillId - Skill ID
   * @returns {Promise<boolean>}
   */
  async unlinkSkill(competencyId, skillId) {
    const sql = 'DELETE FROM competency_skill WHERE competency_id = $1 AND skill_id = $2 RETURNING *';
    const result = await query(sql, [competencyId, skillId]);
    return result.rows.length > 0;
  }

  /**
   * Get all competencies that require a specific skill
   * @param {string} skillId - Skill ID
   * @returns {Promise<Competency[]>}
   */
  async findBySkill(skillId) {
    const sql = `
      SELECT c.*
      FROM competencies c
      INNER JOIN competency_skill cs ON c.competency_id = cs.competency_id
      WHERE cs.skill_id = $1
      ORDER BY c.competency_name
    `;
    const result = await query(sql, [skillId]);
    return result.rows.map(row => new Competency(row));
  }

  /**
   * Get competency hierarchy (parent with all children)
   * @param {string} parentCompetencyId - Parent competency ID
   * @returns {Promise<Object>} Tree structure with parent and children
   */
  async getHierarchy(parentCompetencyId) {
    const parent = await this.findById(parentCompetencyId);
    if (!parent) {
      return null;
    }

    const children = await this.findChildren(parentCompetencyId);
    return {
      ...parent.toJSON(),
      children: children.map(child => child.toJSON())
    };
  }

  /**
   * Find all competencies by name pattern (LIKE search)
   * @param {string} pattern - Search pattern (supports % wildcards)
   * @param {Object} options - Query options
   * @returns {Promise<Competency[]>}
   */
  async searchByName(pattern, options = {}) {
    const { limit = 100, offset = 0 } = options;
    const sql = `
      SELECT * FROM competencies
      WHERE LOWER(competency_name) LIKE LOWER($1)
      ORDER BY competency_name
      LIMIT $2 OFFSET $3
    `;
    const result = await query(sql, [`%${pattern}%`, limit, offset]);
    return result.rows.map(row => new Competency(row));
  }

  /**
   * Check if competency has child competencies
   * @param {string} competencyId - Competency ID
   * @returns {Promise<boolean>}
   */
  async hasChildren(competencyId) {
    const sql = 'SELECT COUNT(*) as child_count FROM competencies WHERE parent_competency_id = $1';
    const result = await query(sql, [competencyId]);
    return parseInt(result.rows[0].child_count) > 0;
  }

  /**
   * Get all sub-competencies recursively (using junction table)
   * @param {string} parentCompetencyId - Parent competency ID
   * @returns {Promise<Competency[]>}
   */
  async getAllSubCompetencies(parentCompetencyId) {
    const sql = `
      WITH RECURSIVE sub_competencies AS (
        -- Base case: direct children
        SELECT c.*
        FROM competencies c
        INNER JOIN competency_subCompetency csc ON c.competency_id = csc.child_competency_id
        WHERE csc.parent_competency_id = $1
        
        UNION
        
        -- Recursive case: children of children
        SELECT c.*
        FROM competencies c
        INNER JOIN competency_subCompetency csc ON c.competency_id = csc.child_competency_id
        INNER JOIN sub_competencies sc ON csc.parent_competency_id = sc.competency_id
      )
      SELECT * FROM sub_competencies
      ORDER BY competency_name
    `;
    const result = await query(sql, [parentCompetencyId]);
    return result.rows.map(row => new Competency(row));
  }
}

module.exports = new CompetencyRepository();


