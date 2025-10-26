import { AppDataSource } from '@/infrastructure/database/connection';
import { Competency } from '@/domain/entities/competency.entity';
import { logger } from '@/infrastructure/logger/logger';

export interface CompetencyFilters {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  company_id?: string;
}

export interface CompetencyListResult {
  data: Competency[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class CompetencyService {
  private competencyRepository = AppDataSource.getRepository(Competency);

  async getCompetencies(filters: CompetencyFilters): Promise<CompetencyListResult> {
    try {
      const queryBuilder = this.competencyRepository.createQueryBuilder('competency');

      // Apply filters
      if (filters.search) {
        queryBuilder.where('competency.name ILIKE :search', { search: `%${filters.search}%` });
      }

      if (filters.category) {
        queryBuilder.andWhere('competency.category = :category', { category: filters.category });
      }

      if (filters.company_id) {
        queryBuilder.andWhere('competency.company_id = :company_id', { company_id: filters.company_id });
      }

      // Add pagination
      const offset = (filters.page - 1) * filters.limit;
      queryBuilder.skip(offset).take(filters.limit);

      // Add ordering
      queryBuilder.orderBy('competency.name', 'ASC');

      // Get total count
      const totalQueryBuilder = this.competencyRepository.createQueryBuilder('competency');
      if (filters.search) {
        totalQueryBuilder.where('competency.name ILIKE :search', { search: `%${filters.search}%` });
      }
      if (filters.category) {
        totalQueryBuilder.andWhere('competency.category = :category', { category: filters.category });
      }
      if (filters.company_id) {
        totalQueryBuilder.andWhere('competency.company_id = :company_id', { company_id: filters.company_id });
      }

      const [competencies, total] = await Promise.all([
        queryBuilder.getMany(),
        totalQueryBuilder.getCount()
      ]);

      return {
        data: competencies,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total,
          pages: Math.ceil(total / filters.limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching competencies:', error);
      throw error;
    }
  }

  async getCompetencyById(id: string): Promise<Competency | null> {
    try {
      const competency = await this.competencyRepository.findOne({
        where: { id },
        relations: ['skills', 'parent_relationships', 'child_relationships']
      });

      return competency;
    } catch (error) {
      logger.error('Error fetching competency by ID:', error);
      throw error;
    }
  }

  async createCompetency(competencyData: Partial<Competency>): Promise<Competency> {
    try {
      const competency = this.competencyRepository.create(competencyData);
      const savedCompetency = await this.competencyRepository.save(competency);

      logger.info('Competency created successfully:', { competencyId: savedCompetency.id, name: savedCompetency.name });
      return savedCompetency;
    } catch (error) {
      logger.error('Error creating competency:', error);
      throw error;
    }
  }
}

