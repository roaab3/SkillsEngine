import { MockDatabaseService } from './mockDatabaseService';
import { logger } from '../utils/logger';

export interface User {
  id: number;
  external_id: string;
  name: string;
  company_id: number;
}

export interface UserCompetency {
  id: number;
  user_id: number;
  competency_id: number;
  level: string;
  verification_source?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSkill {
  id: number;
  user_id: number;
  skill_id: number;
  is_verified: boolean;
  verification_source?: string;
  created_at: string;
  updated_at: string;
}

export interface UserFilters {
  page: number;
  limit: number;
  verified?: boolean;
  level?: string;
}

export interface UserResult {
  data: any[];
  total: number;
}

export class UserService {
  private mockDb = MockDatabaseService.getInstance();

  async getUserProfile(userId: number): Promise<any> {
    try {
      const user = await this.mockDb.getUserById(userId);
      if (!user) {
        return null;
      }

      const competenciesResult = await this.mockDb.getUserCompetencies(userId, { page: 1, limit: 100 });
      const skillsResult = await this.mockDb.getUserSkills(userId, { page: 1, limit: 100 });

      const progressSummary = await this.calculateProgressSummary(userId);

      return {
        user_id: userId,
        name: user.name,
        competencies: competenciesResult.data,
        skills: skillsResult.data,
        progress_summary: progressSummary
      };
    } catch (error) {
      logger.error('Error getting user profile:', error);
      throw error;
    }
  }

  async getUserCompetencies(userId: number, filters: UserFilters): Promise<UserResult> {
    try {
      const result = await this.mockDb.getUserCompetencies(userId, filters);
      return result;
    } catch (error) {
      logger.error('Error getting user competencies:', error);
      throw error;
    }
  }

  async getUserSkills(userId: number, filters: UserFilters): Promise<UserResult> {
    try {
      const result = await this.mockDb.getUserSkills(userId, filters);
      return result;
    } catch (error) {
      logger.error('Error getting user skills:', error);
      throw error;
    }
  }

  async addUserCompetency(userId: number, data: { competency_id: number; level: string }): Promise<UserCompetency> {
    try {
      const userCompetency = await this.mockDb.addUserCompetency(userId, data);
      logger.info('User competency added successfully', { userId, competencyId: data.competency_id });
      return userCompetency;
    } catch (error) {
      logger.error('Error adding user competency:', error);
      throw error;
    }
  }

  async updateUserCompetency(userId: number, competencyId: number, data: { level: string }): Promise<UserCompetency | null> {
    try {
      const userCompetency = await this.mockDb.updateUserCompetency(userId, competencyId, data);
      if (userCompetency) {
        logger.info('User competency updated successfully', { userId, competencyId });
      }
      return userCompetency;
    } catch (error) {
      logger.error('Error updating user competency:', error);
      throw error;
    }
  }

  async removeUserCompetency(userId: number, competencyId: number): Promise<boolean> {
    try {
      const deleted = await this.mockDb.removeUserCompetency(userId, competencyId);
      if (deleted) {
        logger.info('User competency removed successfully', { userId, competencyId });
      }
      return deleted;
    } catch (error) {
      logger.error('Error removing user competency:', error);
      throw error;
    }
  }

  async getUserSkillGaps(userId: number, filters: { competency_id?: number; level?: string }): Promise<any[]> {
    try {
      const gaps = await this.mockDb.getUserSkillGaps(userId);
      logger.info('User skill gaps retrieved successfully', { userId });
      return gaps;
    } catch (error) {
      logger.error('Error getting user skill gaps:', error);
      throw error;
    }
  }

  async getUserProgress(userId: number): Promise<any> {
    try {
      const progress = await this.calculateProgressSummary(userId);
      return progress;
    } catch (error) {
      logger.error('Error getting user progress:', error);
      throw error;
    }
  }

  private async calculateProgressSummary(userId: number): Promise<any> {
    try {
      const competenciesResult = await this.mockDb.getUserCompetencies(userId, { page: 1, limit: 100 });
      const skillsResult = await this.mockDb.getUserSkills(userId, { page: 1, limit: 100 });

      const totalComp = competenciesResult.total;
      const completedComp = competenciesResult.data.filter(uc => uc.is_verified).length;
      const totalSk = skillsResult.total;
      const verifiedSk = skillsResult.data.filter(us => us.is_verified).length;

      const overallProgress = totalComp > 0 ? (completedComp / totalComp) * 100 : 0;

      return {
        total_competencies: totalComp,
        completed_competencies: completedComp,
        total_skills: totalSk,
        verified_skills: verifiedSk,
        overall_progress: Math.round(overallProgress * 100) / 100
      };
    } catch (error) {
      logger.error('Error calculating progress summary:', error);
      throw error;
    }
  }
}
