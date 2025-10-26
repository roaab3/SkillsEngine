import { MockDatabaseService } from './mockDatabaseService';
import { logger } from '../utils/logger';

export interface EventData {
  event_type: string;
  user_id: number;
  event_data: any;
  source?: string;
  status?: string;
  processed_at?: Date;
  error_message?: string;
}

export interface EventFilters {
  page: number;
  limit: number;
  event_type?: string;
}

export interface EventResult {
  data: EventData[];
  total: number;
}

export class EventService {
  private mockDb = MockDatabaseService.getInstance();

  async handleUserCreatedEvent(userId: number, userData: any): Promise<void> {
    try {
      // Log the event
      await this.mockDb.logEvent({
        event_type: 'user-created',
        user_id: userId,
        event_data: userData,
        source: 'directory-service',
        status: 'processed'
      });

      logger.info('User created event processed successfully', { userId });
    } catch (error) {
      logger.error('Error handling user created event:', error);
      throw error;
    }
  }

  async handleAssessmentCompletedEvent(userId: number, assessmentId: number, results: any): Promise<any> {
    try {
      // Process assessment results and update competencies
      const processedResults = {
        user_id: userId,
        assessment_id: assessmentId,
        verified_skills: [],
        updated_competencies: []
      };

      // Log the event
      await this.mockDb.logEvent({
        event_type: 'assessment-completed',
        user_id: userId,
        event_data: { assessment_id: assessmentId, results },
        source: 'assessment-service',
        status: 'processed'
      });

      logger.info('Assessment completed event processed successfully', { userId, assessmentId });
      return processedResults;
    } catch (error) {
      logger.error('Error handling assessment completed event:', error);
      throw error;
    }
  }

  async handleSkillVerifiedEvent(userId: number, skillId: number, verificationData: any): Promise<void> {
    try {
      // Log the event
      await this.mockDb.logEvent({
        event_type: 'skill-verified',
        user_id: userId,
        event_data: { skill_id: skillId, verification_data: verificationData },
        source: 'assessment-service',
        status: 'processed'
      });

      logger.info('Skill verified event processed successfully', { userId, skillId });
    } catch (error) {
      logger.error('Error handling skill verified event:', error);
      throw error;
    }
  }

  async handleCompetencyUpdatedEvent(userId: number, competencyId: number, data: { level: string; completion_percentage: number }): Promise<void> {
    try {
      // Log the event
      await this.mockDb.logEvent({
        event_type: 'competency-updated',
        user_id: userId,
        event_data: { competency_id: competencyId, level: data.level, completion_percentage: data.completion_percentage },
        source: 'skills-engine',
        status: 'processed'
      });

      logger.info('Competency updated event processed successfully', { userId, competencyId });
    } catch (error) {
      logger.error('Error handling competency updated event:', error);
      throw error;
    }
  }

  async getUserEventHistory(userId: number, filters: EventFilters): Promise<EventResult> {
    try {
      const result = await this.mockDb.getEvents(userId);
      return result as EventResult;
    } catch (error) {
      logger.error('Error getting user event history:', error);
      throw error;
    }
  }
}
