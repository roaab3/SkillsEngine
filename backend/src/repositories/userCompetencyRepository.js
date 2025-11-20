/**
 * User Competency Repository
 * 
 * Data access layer for userCompetency table.
 */

const { query } = require('../../config/database');
const UserCompetency = require('../models/UserCompetency');

class UserCompetencyRepository {
  /**
   * Create a new user competency
   * @param {UserCompetency} userCompetency - UserCompetency model instance
   * @returns {Promise<UserCompetency>}
   */
  async create(userCompetency) {
    const validation = userCompetency.validate();
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const sql = `
      INSERT INTO userCompetency (user_id, competency_id, coverage_percentage, proficiency_level, verifiedSkills)
      VALUES ($1, $2, $3, $4, $5::jsonb)
      RETURNING *
    `;

    const values = [
      userCompetency.user_id,
      userCompetency.competency_id,
      userCompetency.coverage_percentage,
      userCompetency.proficiency_level,
      JSON.stringify(userCompetency.verifiedSkills)
    ];

    const result = await query(sql, values);
    const row = result.rows[0];
    return new UserCompetency({
      ...row,
      verifiedSkills: typeof row.verifiedskills === 'string' ? JSON.parse(row.verifiedskills) : row.verifiedskills
    });
  }

  /**
   * Find user competency by user ID and competency ID
   * @param {string} userId - User ID
   * @param {string} competencyId - Competency ID
   * @returns {Promise<UserCompetency|null>}
   */
  async findByUserAndCompetency(userId, competencyId) {
    const sql = 'SELECT * FROM userCompetency WHERE user_id = $1 AND competency_id = $2';
    const result = await query(sql, [userId, competencyId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new UserCompetency({
      ...row,
      verifiedSkills: typeof row.verifiedskills === 'string' ? JSON.parse(row.verifiedskills) : row.verifiedskills || []
    });
  }

  /**
   * Find all competencies for a user
   * @param {string} userId - User ID
   * @returns {Promise<UserCompetency[]>}
   */
  async findByUser(userId) {
    const sql = 'SELECT * FROM userCompetency WHERE user_id = $1 ORDER BY competency_id';
    const result = await query(sql, [userId]);
    return result.rows.map(row => new UserCompetency({
      ...row,
      verifiedSkills: typeof row.verifiedskills === 'string' ? JSON.parse(row.verifiedskills) : row.verifiedskills || []
    }));
  }

  /**
   * Find all users for a competency
   * @param {string} competencyId - Competency ID
   * @returns {Promise<UserCompetency[]>}
   */
  async findByCompetency(competencyId) {
    const sql = 'SELECT * FROM userCompetency WHERE competency_id = $1 ORDER BY user_id';
    const result = await query(sql, [competencyId]);
    return result.rows.map(row => new UserCompetency({
      ...row,
      verifiedSkills: typeof row.verifiedskills === 'string' ? JSON.parse(row.verifiedskills) : row.verifiedskills || []
    }));
  }

  /**
   * Update a user competency
   * @param {string} userId - User ID
   * @param {string} competencyId - Competency ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<UserCompetency|null>}
   */
  async update(userId, competencyId, updates) {
    const allowedFields = ['coverage_percentage', 'proficiency_level', 'verifiedSkills'];
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (updates.hasOwnProperty(field)) {
        if (field === 'verifiedSkills') {
          updateFields.push(`${field} = $${paramIndex}::jsonb`);
          values.push(JSON.stringify(updates[field]));
        } else {
          updateFields.push(`${field} = $${paramIndex}`);
          values.push(updates[field]);
        }
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(userId, competencyId);
    const sql = `
      UPDATE userCompetency
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $${paramIndex} AND competency_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new UserCompetency({
      ...row,
      verifiedSkills: typeof row.verifiedskills === 'string' ? JSON.parse(row.verifiedskills) : row.verifiedskills || []
    });
  }

  /**
   * Delete a user competency
   * @param {string} userId - User ID
   * @param {string} competencyId - Competency ID
   * @returns {Promise<boolean>}
   */
  async delete(userId, competencyId) {
    const sql = 'DELETE FROM userCompetency WHERE user_id = $1 AND competency_id = $2 RETURNING *';
    const result = await query(sql, [userId, competencyId]);
    return result.rows.length > 0;
  }

  /**
   * Upsert user competency
   * @param {UserCompetency} userCompetency - UserCompetency model instance
   * @returns {Promise<UserCompetency>}
   */
  async upsert(userCompetency) {
    const existing = await this.findByUserAndCompetency(userCompetency.user_id, userCompetency.competency_id);
    if (existing) {
      return await this.update(
        userCompetency.user_id,
        userCompetency.competency_id,
        {
          coverage_percentage: userCompetency.coverage_percentage,
          proficiency_level: userCompetency.proficiency_level,
          verifiedSkills: userCompetency.verifiedSkills
        }
      );
    }
    return await this.create(userCompetency);
  }
}

module.exports = new UserCompetencyRepository();


