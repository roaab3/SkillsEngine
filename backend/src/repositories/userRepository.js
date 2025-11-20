/**
 * User Repository
 * 
 * Data access layer for users table.
 */

const { query } = require('../../config/database');
const User = require('../models/User');

class UserRepository {
  /**
   * Create a new user
   * @param {User} user - User model instance
   * @returns {Promise<User>}
   */
  async create(user) {
    const validation = user.validate();
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const sql = `
      INSERT INTO users (user_id, user_name, company_id, employee_type, path_career, raw_data, relevance_score)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      user.user_id,
      user.user_name,
      user.company_id,
      user.employee_type,
      user.path_career,
      user.raw_data,
      user.relevance_score
    ];

    const result = await query(sql, values);
    return new User(result.rows[0]);
  }

  /**
   * Find user by ID
   * @param {string} userId - User ID
   * @returns {Promise<User|null>}
   */
  async findById(userId) {
    const sql = 'SELECT * FROM users WHERE user_id = $1';
    const result = await query(sql, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    return new User(result.rows[0]);
  }

  /**
   * Find users by company
   * @param {string} companyId - Company ID
   * @param {Object} options - Query options
   * @returns {Promise<User[]>}
   */
  async findByCompany(companyId, options = {}) {
    const { limit = 100, offset = 0 } = options;
    const sql = `
      SELECT * FROM users
      WHERE company_id = $1
      ORDER BY user_name
      LIMIT $2 OFFSET $3
    `;
    const result = await query(sql, [companyId, limit, offset]);
    return result.rows.map(row => new User(row));
  }

  /**
   * Find users by employee type
   * @param {string} employeeType - Employee type ('regular' or 'trainer')
   * @param {Object} options - Query options
   * @returns {Promise<User[]>}
   */
  async findByEmployeeType(employeeType, options = {}) {
    const { limit = 100, offset = 0 } = options;
    const sql = `
      SELECT * FROM users
      WHERE employee_type = $1
      ORDER BY user_name
      LIMIT $2 OFFSET $3
    `;
    const result = await query(sql, [employeeType, limit, offset]);
    return result.rows.map(row => new User(row));
  }

  /**
   * Update a user
   * @param {string} userId - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<User|null>}
   */
  async update(userId, updates) {
    const allowedFields = ['user_name', 'company_id', 'employee_type', 'path_career', 'raw_data', 'relevance_score'];
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

    values.push(userId);
    const sql = `
      UPDATE users
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return null;
    }

    return new User(result.rows[0]);
  }

  /**
   * Delete a user (cascade deletes related records)
   * @param {string} userId - User ID
   * @returns {Promise<boolean>}
   */
  async delete(userId) {
    const sql = 'DELETE FROM users WHERE user_id = $1 RETURNING user_id';
    const result = await query(sql, [userId]);
    return result.rows.length > 0;
  }

  /**
   * Upsert user (insert or update)
   * @param {User} user - User model instance
   * @returns {Promise<User>}
   */
  async upsert(user) {
    const existing = await this.findById(user.user_id);
    if (existing) {
      return await this.update(user.user_id, user.toJSON());
    }
    return await this.create(user);
  }
}

module.exports = new UserRepository();


