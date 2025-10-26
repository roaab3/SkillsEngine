import { AppDataSource } from '@/infrastructure/database/connection';
import { Skill } from '@/domain/entities/skill.entity';
import { logger } from '@/infrastructure/logger/logger';

export interface SkillFilters {
  page: number;
  limit: number;
  search?: string;
  type?: string;
  company_id?: string;
}

export interface SkillListResult {
  data: Skill[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class SkillService {
  private skillRepository = AppDataSource.getRepository(Skill);

  async getSkills(filters: SkillFilters): Promise<SkillListResult> {
    try {
      const queryBuilder = this.skillRepository.createQueryBuilder('skill');

      // Apply filters
      if (filters.search) {
        queryBuilder.where('skill.name ILIKE :search', { search: `%${filters.search}%` });
      }

      if (filters.type) {
        queryBuilder.andWhere('skill.type = :type', { type: filters.type });
      }

      if (filters.company_id) {
        queryBuilder.andWhere('skill.company_id = :company_id', { company_id: filters.company_id });
      }

      // Add pagination
      const offset = (filters.page - 1) * filters.limit;
      queryBuilder.skip(offset).take(filters.limit);

      // Add ordering
      queryBuilder.orderBy('skill.name', 'ASC');

      // Get total count
      const totalQueryBuilder = this.skillRepository.createQueryBuilder('skill');
      if (filters.search) {
        totalQueryBuilder.where('skill.name ILIKE :search', { search: `%${filters.search}%` });
      }
      if (filters.type) {
        totalQueryBuilder.andWhere('skill.type = :type', { type: filters.type });
      }
      if (filters.company_id) {
        totalQueryBuilder.andWhere('skill.company_id = :company_id', { company_id: filters.company_id });
      }

      const [skills, total] = await Promise.all([
        queryBuilder.getMany(),
        totalQueryBuilder.getCount()
      ]);

      return {
        data: skills,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total,
          pages: Math.ceil(total / filters.limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching skills:', error);
      throw error;
    }
  }

  async getSkillById(id: string): Promise<Skill | null> {
    try {
      const skill = await this.skillRepository.findOne({
        where: { id },
        relations: ['competencies', 'parent_relationships', 'child_relationships']
      });

      return skill;
    } catch (error) {
      logger.error('Error fetching skill by ID:', error);
      throw error;
    }
  }

  async createSkill(skillData: Partial<Skill>): Promise<Skill> {
    try {
      const skill = this.skillRepository.create(skillData);
      const savedSkill = await this.skillRepository.save(skill);

      logger.info('Skill created successfully:', { skillId: savedSkill.id, name: savedSkill.name });
      return savedSkill;
    } catch (error) {
      logger.error('Error creating skill:', error);
      throw error;
    }
  }

  async updateSkill(id: string, updateData: Partial<Skill>): Promise<Skill | null> {
    try {
      const skill = await this.skillRepository.findOne({ where: { id } });
      if (!skill) {
        return null;
      }

      Object.assign(skill, updateData);
      const updatedSkill = await this.skillRepository.save(skill);

      logger.info('Skill updated successfully:', { skillId: updatedSkill.id, name: updatedSkill.name });
      return updatedSkill;
    } catch (error) {
      logger.error('Error updating skill:', error);
      throw error;
    }
  }

  async deleteSkill(id: string): Promise<boolean> {
    try {
      const result = await this.skillRepository.delete(id);
      const deleted = result.affected && result.affected > 0;

      if (deleted) {
        logger.info('Skill deleted successfully:', { skillId: id });
      }

      return deleted;
    } catch (error) {
      logger.error('Error deleting skill:', error);
      throw error;
    }
  }

  async getSkillsByCompetency(competencyId: string): Promise<Skill[]> {
    try {
      const skills = await this.skillRepository
        .createQueryBuilder('skill')
        .innerJoin('skill.competencies', 'competency')
        .where('competency.id = :competencyId', { competencyId })
        .getMany();

      return skills;
    } catch (error) {
      logger.error('Error fetching skills by competency:', error);
      throw error;
    }
  }

  async getSkillHierarchy(skillId: string): Promise<{ parents: Skill[]; children: Skill[] }> {
    try {
      const skill = await this.skillRepository.findOne({
        where: { id: skillId },
        relations: ['parent_relationships', 'child_relationships']
      });

      if (!skill) {
        return { parents: [], children: [] };
      }

      const parents = skill.parent_relationships.map(rel => rel.parent_skill);
      const children = skill.child_relationships.map(rel => rel.child_skill);

      return { parents, children };
    } catch (error) {
      logger.error('Error fetching skill hierarchy:', error);
      throw error;
    }
  }
}

