import { MockDatabaseService } from './mockDatabaseService';
import { MockCompetency } from '../data/mockData';
import { logger } from '../utils/logger';

export interface Competency {
  id: number;
  code: string;
  name: string;
  description: string;
  external_id?: string;
  external_source?: string;
  updated_at: string;
}

export interface CompetencyFilters {
  page: number;
  limit: number;
  search?: string;
  level?: string;
}

export interface CompetencyResult {
  data: Competency[];
  total: number;
}

export class CompetencyService {
  private mockDb = MockDatabaseService.getInstance();

  async getAllCompetencies(filters: CompetencyFilters): Promise<CompetencyResult> {
    try {
      const result = await this.mockDb.getCompetencies(filters);
      return result;
    } catch (error) {
      logger.error('Error getting competencies:', error);
      throw error;
    }
  }

  async getCompetencyById(id: number): Promise<Competency | null> {
    try {
      const competency = await this.mockDb.getCompetencyById(id);
      return competency;
    } catch (error) {
      logger.error('Error getting competency by ID:', error);
      throw error;
    }
  }

  async createCompetency(data: Partial<Competency>): Promise<Competency> {
    try {
      const competency = await this.mockDb.createCompetency(data);
      logger.info('Competency created successfully', { competencyId: competency.id });
      return competency;
    } catch (error) {
      logger.error('Error creating competency:', error);
      throw error;
    }
  }

  async updateCompetency(id: number, data: Partial<Competency>): Promise<Competency | null> {
    try {
      const competency = await this.mockDb.updateCompetency(id, data);
      if (competency) {
        logger.info('Competency updated successfully', { competencyId: id });
      }
      return competency;
    } catch (error) {
      logger.error('Error updating competency:', error);
      throw error;
    }
  }

  async deleteCompetency(id: number): Promise<boolean> {
    try {
      const deleted = await this.mockDb.deleteCompetency(id);
      if (deleted) {
        logger.info('Competency deleted successfully', { competencyId: id });
      }
      return deleted;
    } catch (error) {
      logger.error('Error deleting competency:', error);
      throw error;
    }
  }

  async getCompetencySkills(competencyId: number): Promise<any[]> {
    try {
      const skills = await this.mockDb.getCompetencySkills(competencyId);
      return skills;
    } catch (error) {
      logger.error('Error getting competency skills:', error);
      throw error;
    }
  }

  async getCompetencyHierarchy(competencyId: number): Promise<any> {
    try {
      const competency = await this.getCompetencyById(competencyId);
      if (!competency) {
        return null;
      }

      // Get sub-competencies
      const children = await this.mockDb.getCompetencySubCompetencies(competencyId);
      
      // Recursively build hierarchy
      const hierarchy = {
        ...competency,
        children: await Promise.all(
          children.map(child => this.getCompetencyHierarchy(child.id))
        )
      };

      return hierarchy;
    } catch (error) {
      logger.error('Error getting competency hierarchy:', error);
      throw error;
    }
  }

  async getCompetencyTree(competencyId: number): Promise<any> {
    try {
      const tree = await this.mockDb.getCompetencyTree(competencyId);
      return tree;
    } catch (error) {
      logger.error('Error getting competency tree:', error);
      throw error;
    }
  }
}
