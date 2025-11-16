import { getPool } from '../config/database';
import { User, UserCompetency, UserSkill, VerifiedSkill } from '../types';
import { DatabaseError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

export class ProfileRepository {
  async getUserById(userId: string): Promise<User | null> {
    try {
      const pool = getPool();
      const result = await pool.query(
        'SELECT * FROM users WHERE user_id = $1',
        [userId]
      );
      if (!result.rows[0]) return null;
      
      const user = result.rows[0];
      // Convert numeric strings to numbers (PostgreSQL returns numeric as strings)
      return {
        ...user,
        relevance_score: typeof user.relevance_score === 'string' 
          ? parseFloat(user.relevance_score) 
          : (user.relevance_score ?? 0),
      };
    } catch (error) {
      logger.error('Error getting user by ID:', error);
      throw new DatabaseError('Failed to get user', error as Error);
    }
  }

  async createUser(user: User): Promise<void> {
    try {
      const pool = getPool();
      await pool.query(
        `INSERT INTO users (user_id, user_name, company_id, employee_type, path_career, raw_data, relevance_score)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (user_id) DO UPDATE SET
           user_name = EXCLUDED.user_name,
           company_id = EXCLUDED.company_id,
           employee_type = EXCLUDED.employee_type,
           path_career = EXCLUDED.path_career,
           raw_data = EXCLUDED.raw_data`,
        [
          user.user_id,
          user.user_name,
          user.company_id,
          user.employee_type,
          user.path_career,
          user.raw_data,
          user.relevance_score || 0.00,
        ]
      );
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new DatabaseError('Failed to create user', error as Error);
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && key !== 'user_id') {
          fields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });

      if (fields.length === 0) return;

      values.push(userId);
      const pool = getPool();
      await pool.query(
        `UPDATE users SET ${fields.join(', ')} WHERE user_id = $${paramIndex}`,
        values
      );
    } catch (error) {
      logger.error('Error updating user:', error);
      throw new DatabaseError('Failed to update user', error as Error);
    }
  }

  async updateRelevanceScore(userId: string, score: number): Promise<void> {
    try {
      const pool = getPool();
      await pool.query(
        'UPDATE users SET relevance_score = $1 WHERE user_id = $2',
        [score, userId]
      );
    } catch (error) {
      logger.error('Error updating relevance score:', error);
      throw new DatabaseError('Failed to update relevance score', error as Error);
    }
  }

  async getUserCompetencies(userId: string): Promise<UserCompetency[]> {
    try {
      const pool = getPool();
      const result = await pool.query(
        'SELECT * FROM userCompetency WHERE user_id = $1',
        [userId]
      );
      // Convert numeric strings to numbers (PostgreSQL returns numeric as strings)
      return result.rows.map(row => ({
        ...row,
        coverage_percentage: typeof row.coverage_percentage === 'string' 
          ? parseFloat(row.coverage_percentage) 
          : (row.coverage_percentage ?? 0),
      }));
    } catch (error) {
      logger.error('Error getting user competencies:', error);
      throw new DatabaseError('Failed to get user competencies', error as Error);
    }
  }

  async getUserCompetency(userId: string, competencyId: string): Promise<UserCompetency | null> {
    try {
      const pool = getPool();
      const result = await pool.query(
        'SELECT * FROM userCompetency WHERE user_id = $1 AND competency_id = $2',
        [userId, competencyId]
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error getting user competency:', error);
      throw new DatabaseError('Failed to get user competency', error as Error);
    }
  }

  async createUserCompetency(userCompetency: UserCompetency): Promise<void> {
    try {
      const pool = getPool();
      await pool.query(
        `INSERT INTO userCompetency (user_id, competency_id, coverage_percentage, proficiency_level, verifiedSkills)
         VALUES ($1, $2, $3, $4, $5::jsonb)
         ON CONFLICT (user_id, competency_id) DO UPDATE SET
           coverage_percentage = EXCLUDED.coverage_percentage,
           proficiency_level = EXCLUDED.proficiency_level,
           verifiedSkills = EXCLUDED.verifiedSkills`,
        [
          userCompetency.user_id,
          userCompetency.competency_id,
          userCompetency.coverage_percentage,
          userCompetency.proficiency_level,
          JSON.stringify(userCompetency.verifiedSkills),
        ]
      );
    } catch (error) {
      logger.error('Error creating user competency:', error);
      throw new DatabaseError('Failed to create user competency', error as Error);
    }
  }

  async updateUserCompetency(
    userId: string,
    competencyId: string,
    updates: Partial<UserCompetency>
  ): Promise<void> {
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && key !== 'user_id' && key !== 'competency_id') {
          if (key === 'verifiedSkills') {
            fields.push(`${key} = $${paramIndex}::jsonb`);
            values.push(JSON.stringify(value));
          } else {
            fields.push(`${key} = $${paramIndex}`);
            values.push(value);
          }
          paramIndex++;
        }
      });

      if (fields.length === 0) return;

      values.push(userId, competencyId);
      const pool = getPool();
      await pool.query(
        `UPDATE userCompetency SET ${fields.join(', ')} 
         WHERE user_id = $${paramIndex} AND competency_id = $${paramIndex + 1}`,
        values
      );
    } catch (error) {
      logger.error('Error updating user competency:', error);
      throw new DatabaseError('Failed to update user competency', error as Error);
    }
  }

  async updateVerifiedSkills(
    userId: string,
    competencyId: string,
    verifiedSkills: VerifiedSkill[]
  ): Promise<void> {
    try {
      const pool = getPool();
      await pool.query(
        'UPDATE userCompetency SET verifiedSkills = $1::jsonb WHERE user_id = $2 AND competency_id = $3',
        [JSON.stringify(verifiedSkills), userId, competencyId]
      );
    } catch (error) {
      logger.error('Error updating verified skills:', error);
      throw new DatabaseError('Failed to update verified skills', error as Error);
    }
  }

  async getUserSkills(userId: string): Promise<UserSkill[]> {
    try {
      const pool = getPool();
      const result = await pool.query(
        'SELECT * FROM userSkill WHERE user_id = $1',
        [userId]
      );
      return result.rows;
    } catch (error) {
      logger.error('Error getting user skills:', error);
      throw new DatabaseError('Failed to get user skills', error as Error);
    }
  }

  async createUserSkill(userSkill: UserSkill): Promise<void> {
    try {
      const pool = getPool();
      await pool.query(
        `INSERT INTO userSkill (user_id, skill_id, skill_name, verified, source, last_update)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id, skill_id) DO UPDATE SET
           skill_name = EXCLUDED.skill_name,
           verified = EXCLUDED.verified,
           source = EXCLUDED.source,
           last_update = EXCLUDED.last_update`,
        [
          userSkill.user_id,
          userSkill.skill_id,
          userSkill.skill_name,
          userSkill.verified,
          userSkill.source,
          userSkill.last_update || new Date(),
        ]
      );
    } catch (error) {
      logger.error('Error creating user skill:', error);
      throw new DatabaseError('Failed to create user skill', error as Error);
    }
  }
}

