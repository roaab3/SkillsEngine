/**
 * User Skill Model
 * 
 * Represents a user's individual skill record.
 */

class UserSkill {
  constructor(data) {
    this.user_id = data.user_id;
    this.skill_id = data.skill_id;
    this.skill_name = data.skill_name;
    this.verified = data.verified || false;
    this.source = data.source || null;
    this.last_update = data.last_update || null;
    this.created_at = data.created_at || null;
  }

  /**
   * Validate user skill data
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.user_id || typeof this.user_id !== 'string') {
      errors.push('user_id is required and must be a string');
    }

    if (!this.skill_id || typeof this.skill_id !== 'string') {
      errors.push('skill_id is required and must be a string');
    }

    if (!this.skill_name || typeof this.skill_name !== 'string') {
      errors.push('skill_name is required and must be a string');
    }

    if (this.skill_name && this.skill_name.length > 500) {
      errors.push('skill_name must not exceed 500 characters');
    }

    if (typeof this.verified !== 'boolean') {
      errors.push('verified must be a boolean');
    }

    if (this.source && !['assessment', 'certification', 'claim', 'ai'].includes(this.source)) {
      errors.push('source must be one of: assessment, certification, claim, ai');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      user_id: this.user_id,
      skill_id: this.skill_id,
      skill_name: this.skill_name,
      verified: this.verified,
      source: this.source,
      last_update: this.last_update,
      created_at: this.created_at
    };
  }
}

module.exports = UserSkill;


