/**
 * User Skill Repository
 * 
 * Data access layer for userSkill table.
 */

const { query } = require('../../config/database');
const UserSkill = require('../models/UserSkill');

class UserSkillRepository {
  /**
   * Create a new user skill
   * @param {UserSkill} userSkill - UserSkill model instance
   * @returns {Promise<UserSkill>}
   */
  async create(userSkill) {
    const validation = userSkill.validate();
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const sql = `
      INSERT INTO userSkill (user_id, skill_id, skill_name, verified, source)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      userSkill.user_id,
      userSkill.skill_id,
      userSkill.skill_name,
      userSkill.verified,
      userSkill.source
    ];

    const result = await query(sql, values);
    return new UserSkill(result.rows[0]);
  }

  /**
   * Find user skill by user ID and skill ID
   * @param {string} userId - User ID
   * @param {string} skillId - Skill ID
   * @returns {Promise<UserSkill|null>}
   */
  async findByUserAndSkill(userId, skillId) {
    const sql = 'SELECT * FROM userSkill WHERE user_id = $1 AND skill_id = $2';
    const result = await query(sql, [userId, skillId]);

    if (result.rows.length === 0) {
      return null;
    }

    return new UserSkill(result.rows[0]);
  }

  /**
   * Find all skills for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<UserSkill[]>}
   */
  async findByUser(userId, options = {}) {
    const { verified = null, source = null } = options;
    let sql = 'SELECT * FROM userSkill WHERE user_id = $1';
    const values = [userId];
    let paramIndex = 2;

    if (verified !== null) {
      sql += ` AND verified = $${paramIndex}`;
      values.push(verified);
      paramIndex++;
    }

    if (source) {
      sql += ` AND source = $${paramIndex}`;
      values.push(source);
      paramIndex++;
    }

    sql += ' ORDER BY skill_name';

    const result = await query(sql, values);
    return result.rows.map(row => new UserSkill(row));
  }

  /**
   * Find all users for a skill
   * @param {string} skillId - Skill ID
   * @returns {Promise<UserSkill[]>}
   */
  async findBySkill(skillId) {
    const sql = 'SELECT * FROM userSkill WHERE skill_id = $1 ORDER BY user_id';
    const result = await query(sql, [skillId]);
    return result.rows.map(row => new UserSkill(row));
  }

  /**
   * Update a user skill
   * @param {string} userId - User ID
   * @param {string} skillId - Skill ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<UserSkill|null>}
   */
  async update(userId, skillId, updates) {
    const allowedFields = ['skill_name', 'verified', 'source'];
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

    values.push(userId, skillId);
    const sql = `
      UPDATE userSkill
      SET ${updateFields.join(', ')}, last_update = CURRENT_TIMESTAMP
      WHERE user_id = $${paramIndex} AND skill_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return null;
    }

    return new UserSkill(result.rows[0]);
  }

  /**
   * Delete a user skill
   * @param {string} userId - User ID
   * @param {string} skillId - Skill ID
   * @returns {Promise<boolean>}
   */
  async delete(userId, skillId) {
    const sql = 'DELETE FROM userSkill WHERE user_id = $1 AND skill_id = $2 RETURNING *';
    const result = await query(sql, [userId, skillId]);
    return result.rows.length > 0;
  }

  /**
   * Upsert user skill
   * @param {UserSkill} userSkill - UserSkill model instance
   * @returns {Promise<UserSkill>}
   */
  async upsert(userSkill) {
    const existing = await this.findByUserAndSkill(userSkill.user_id, userSkill.skill_id);
    if (existing) {
      return await this.update(
        userSkill.user_id,
        userSkill.skill_id,
        {
          skill_name: userSkill.skill_name,
          verified: userSkill.verified,
          source: userSkill.source
        }
      );
    }
    return await this.create(userSkill);
  }
}

module.exports = new UserSkillRepository();


