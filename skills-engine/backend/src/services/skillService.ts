import { MockDatabaseService } from './mockDatabaseService';
import { logger } from '../utils/logger';

export interface Skill {
  id: number;
  code: string;
  name: string;
  description: string;
  external_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SkillFilters {
  page: number;
  limit: number;
  search?: string;
  level?: string;
  competency_id?: number;
}

export interface SkillResult {
  data: Skill[];
  total: number;
}

export class SkillService {
  private mockDb = MockDatabaseService.getInstance();

  async getAllSkills(filters: SkillFilters): Promise<SkillResult> {
    try {
      const result = await this.mockDb.getSkills(filters);
      return result;
    } catch (error) {
      logger.error('Error getting skills:', error);
      throw error;
    }
  }

  async getSkillById(id: number): Promise<Skill | null> {
    try {
      const skill = await this.mockDb.getSkillById(id);
      return skill;
    } catch (error) {
      logger.error('Error getting skill by ID:', error);
      throw error;
    }
  }

  async createSkill(data: Partial<Skill>): Promise<Skill> {
    try {
      const skill = await this.mockDb.createSkill(data);
      logger.info('Skill created successfully', { skillId: skill.id });
      return skill;
    } catch (error) {
      logger.error('Error creating skill:', error);
      throw error;
    }
  }

  async updateSkill(id: number, data: Partial<Skill>): Promise<Skill | null> {
    try {
      const skill = await this.mockDb.updateSkill(id, data);
      if (skill) {
        logger.info('Skill updated successfully', { skillId: id });
      }
      return skill;
    } catch (error) {
      logger.error('Error updating skill:', error);
      throw error;
    }
  }

  async deleteSkill(id: number): Promise<boolean> {
    try {
      const deleted = await this.mockDb.deleteSkill(id);
      if (deleted) {
        logger.info('Skill deleted successfully', { skillId: id });
      }
      return deleted;
    } catch (error) {
      logger.error('Error deleting skill:', error);
      throw error;
    }
  }

  async getSkillHierarchy(skillId: number): Promise<any> {
    try {
      const skill = await this.getSkillById(skillId);
      if (!skill) {
        return null;
      }

      // Get sub-skills
      const children = await this.mockDb.getSkillSubSkills(skillId);
      
      // Recursively build hierarchy
      const hierarchy = {
        ...skill,
        children: await Promise.all(
          children.map(child => this.getSkillHierarchy(child.id))
        )
      };

      return hierarchy;
    } catch (error) {
      logger.error('Error getting skill hierarchy:', error);
      throw error;
    }
  }

  async getChildSkills(skillId: number): Promise<Skill[]> {
    try {
      const children = await this.mockDb.getSkillSubSkills(skillId);
      return children;
    } catch (error) {
      logger.error('Error getting child skills:', error);
      throw error;
    }
  }

  async getCompetenciesForSkill(skillId: number): Promise<any[]> {
    try {
      const competencies = await this.mockDb.getCompetenciesForSkill(skillId);
      return competencies;
    } catch (error) {
      logger.error('Error getting competencies for skill:', error);
      throw error;
    }
  }

  async normalizeSkills(skills: string[]): Promise<any[]> {
    try {
      // This would integrate with AI service for skill normalization
      // For now, return a simple normalization
      const normalizedSkills = skills.map(skill => ({
        original: skill,
        normalized: skill.toLowerCase().trim(),
        confidence: 0.95,
        suggestions: [skill]
      }));

      logger.info('Skills normalized successfully', { count: normalizedSkills.length });
      return normalizedSkills;
    } catch (error) {
      logger.error('Error normalizing skills:', error);
      throw error;
    }
  }
}
