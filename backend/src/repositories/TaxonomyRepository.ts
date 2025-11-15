import { pool } from '../config/database';
import { Skill, Competency } from '../types';
import { DatabaseError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

export class TaxonomyRepository {
  async getCompetencyById(competencyId: string): Promise<Competency | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM competencies WHERE competency_id = $1',
        [competencyId]
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error getting competency by ID:', error);
      throw new DatabaseError('Failed to get competency', error as Error);
    }
  }

  async getCompetencyByName(competencyName: string): Promise<Competency | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM competencies WHERE LOWER(TRIM(competency_name)) = LOWER(TRIM($1))',
        [competencyName]
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error getting competency by name:', error);
      throw new DatabaseError('Failed to get competency', error as Error);
    }
  }

  async getSkillById(skillId: string): Promise<Skill | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM skills WHERE skill_id = $1',
        [skillId]
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error getting skill by ID:', error);
      throw new DatabaseError('Failed to get skill', error as Error);
    }
  }

  async getL1SkillsForCompetency(competencyId: string): Promise<Skill[]> {
    try {
      // Get skills that are linked to competency and have no parent in skill_subSkill
      const result = await pool.query(
        `SELECT s.* FROM skills s
         INNER JOIN competency_skill cs ON s.skill_id = cs.skill_id
         WHERE cs.competency_id = $1
         AND NOT EXISTS (
           SELECT 1 FROM skill_subSkill ss WHERE ss.child_skill_id = s.skill_id
         )`,
        [competencyId]
      );
      return result.rows;
    } catch (error) {
      logger.error('Error getting L1 skills for competency:', error);
      throw new DatabaseError('Failed to get L1 skills', error as Error);
    }
  }

  async getChildSkills(parentSkillId: string): Promise<Skill[]> {
    try {
      const result = await pool.query(
        `SELECT s.* FROM skills s
         INNER JOIN skill_subSkill ss ON s.skill_id = ss.child_skill_id
         WHERE ss.parent_skill_id = $1`,
        [parentSkillId]
      );
      return result.rows;
    } catch (error) {
      logger.error('Error getting child skills:', error);
      throw new DatabaseError('Failed to get child skills', error as Error);
    }
  }

  async getMGSForCompetency(competencyId: string): Promise<Skill[]> {
    try {
      // Use the view for efficient MGS retrieval
      const result = await pool.query(
        'SELECT skill_id, skill_name FROM competency_leaf_skills WHERE competency_id = $1',
        [competencyId]
      );
      return result.rows;
    } catch (error) {
      logger.error('Error getting MGS for competency:', error);
      throw new DatabaseError('Failed to get MGS', error as Error);
    }
  }

  async getAllMGSForCompetency(competencyId: string): Promise<Skill[]> {
    try {
      // Recursive traversal to get all MGS
      const l1Skills = await this.getL1SkillsForCompetency(competencyId);
      const allMGS: Skill[] = [];

      for (const l1Skill of l1Skills) {
        const mgs = await this.traverseSkillHierarchy(l1Skill.skill_id);
        allMGS.push(...mgs);
      }

      // Remove duplicates
      const uniqueMGS = Array.from(
        new Map(allMGS.map(skill => [skill.skill_id, skill])).values()
      );

      return uniqueMGS;
    } catch (error) {
      logger.error('Error getting all MGS for competency:', error);
      throw new DatabaseError('Failed to get all MGS', error as Error);
    }
  }

  private async traverseSkillHierarchy(skillId: string): Promise<Skill[]> {
    const children = await this.getChildSkills(skillId);
    
    if (children.length === 0) {
      // This is a leaf skill (MGS)
      const skill = await this.getSkillById(skillId);
      return skill ? [skill] : [];
    }

    // Recursively get MGS from children
    const mgs: Skill[] = [];
    for (const child of children) {
      const childMGS = await this.traverseSkillHierarchy(child.skill_id);
      mgs.push(...childMGS);
    }

    return mgs;
  }

  async addCompetency(competency: Competency): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO competencies (competency_id, competency_name, description, parent_competency_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (competency_id) DO NOTHING`,
        [
          competency.competency_id,
          competency.competency_name,
          competency.description,
          competency.parent_competency_id,
        ]
      );
    } catch (error) {
      logger.error('Error adding competency:', error);
      throw new DatabaseError('Failed to add competency', error as Error);
    }
  }

  async addSkill(skill: Skill): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO skills (skill_id, skill_name, parent_skill_id, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (skill_id) DO NOTHING`,
        [
          skill.skill_id,
          skill.skill_name,
          skill.parent_skill_id,
          skill.description,
        ]
      );
    } catch (error) {
      logger.error('Error adding skill:', error);
      throw new DatabaseError('Failed to add skill', error as Error);
    }
  }

  async linkSkillToCompetency(competencyId: string, skillId: string): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO competency_skill (competency_id, skill_id)
         VALUES ($1, $2)
         ON CONFLICT (competency_id, skill_id) DO NOTHING`,
        [competencyId, skillId]
      );
    } catch (error) {
      logger.error('Error linking skill to competency:', error);
      throw new DatabaseError('Failed to link skill to competency', error as Error);
    }
  }

  async linkParentChildSkill(parentSkillId: string, childSkillId: string): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO skill_subSkill (parent_skill_id, child_skill_id)
         VALUES ($1, $2)
         ON CONFLICT (parent_skill_id, child_skill_id) DO NOTHING`,
        [parentSkillId, childSkillId]
      );
    } catch (error) {
      logger.error('Error linking parent-child skill:', error);
      throw new DatabaseError('Failed to link parent-child skill', error as Error);
    }
  }
}

