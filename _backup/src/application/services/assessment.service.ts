import { AppDataSource } from '@/infrastructure/database/connection';
import { UserSkill } from '@/domain/entities/user-skill.entity';
import { UserCompetency } from '@/domain/entities/user-competency.entity';
import { logger } from '@/infrastructure/logger/logger';

export interface AssessmentResult {
  user_id: string;
  assessment_id: string;
  results: Array<{
    skill_id: string;
    score: number;
    max_score: number;
    completed_at: string;
  }>;
}

export interface ProcessedAssessmentResult {
  user_id: string;
  assessment_id: string;
  processed_skills: Array<{
    skill_id: string;
    verified: boolean;
    verification_source: string;
    last_evaluate: Date;
  }>;
  updated_competencies: Array<{
    competency_id: string;
    new_level: string;
    progress_percentage: number;
  }>;
  processed_at: Date;
}

export class AssessmentService {
  private userSkillRepository = AppDataSource.getRepository(UserSkill);
  private userCompetencyRepository = AppDataSource.getRepository(UserCompetency);

  async processAssessmentResults(assessmentData: AssessmentResult): Promise<ProcessedAssessmentResult> {
    try {
      const { user_id, assessment_id, results } = assessmentData;
      const processedSkills = [];
      const updatedCompetencies = [];

      // Process each assessment result
      for (const result of results) {
        const { skill_id, score, max_score, completed_at } = result;
        
        // Calculate verification threshold (e.g., 70% of max score)
        const threshold = max_score * 0.7;
        const verified = score >= threshold;

        // Update or create user skill record
        let userSkill = await this.userSkillRepository.findOne({
          where: { user_id, skill_id }
        });

        if (userSkill) {
          // Update existing record
          userSkill.verified = verified;
          userSkill.verification_source = 'Assessment';
          userSkill.last_evaluate = new Date(completed_at);
          userSkill.proficiency_score = (score / max_score) * 100;
        } else {
          // Create new record
          userSkill = this.userSkillRepository.create({
            user_id,
            skill_id,
            verified,
            verification_source: 'Assessment',
            last_evaluate: new Date(completed_at),
            proficiency_score: (score / max_score) * 100
          });
        }

        await this.userSkillRepository.save(userSkill);
        processedSkills.push({
          skill_id,
          verified,
          verification_source: 'Assessment',
          last_evaluate: userSkill.last_evaluate
        });

        // Recalculate competency levels if skill was verified
        if (verified) {
          const competencyUpdates = await this.recalculateCompetencyLevels(user_id, skill_id);
          updatedCompetencies.push(...competencyUpdates);
        }
      }

      logger.info('Assessment results processed successfully:', {
        user_id,
        assessment_id,
        processed_skills_count: processedSkills.length,
        updated_competencies_count: updatedCompetencies.length
      });

      return {
        user_id,
        assessment_id,
        processed_skills: processedSkills,
        updated_competencies: updatedCompetencies,
        processed_at: new Date()
      };
    } catch (error) {
      logger.error('Error processing assessment results:', error);
      throw error;
    }
  }

  private async recalculateCompetencyLevels(userId: string, skillId: string): Promise<Array<{
    competency_id: string;
    new_level: string;
    progress_percentage: number;
  }>> {
    try {
      // Get competencies that include this skill
      const query = `
        SELECT DISTINCT c.id as competency_id, c.name as competency_name
        FROM competencies c
        INNER JOIN competency_skill cs ON c.id = cs.competency_id
        WHERE cs.skill_id = $1
      `;

      const competencies = await AppDataSource.query(query, [skillId]);
      const updatedCompetencies = [];

      for (const competency of competencies) {
        // Get all skills for this competency
        const competencySkillsQuery = `
          SELECT s.id, s.name, s.type
          FROM skills s
          INNER JOIN competency_skill cs ON s.id = cs.skill_id
          WHERE cs.competency_id = $1
        `;

        const competencySkills = await AppDataSource.query(competencySkillsQuery, [competency.competency_id]);

        // Get user's verified skills for this competency
        const userSkillsQuery = `
          SELECT us.skill_id, us.verified, us.proficiency_score
          FROM user_skills us
          INNER JOIN competency_skill cs ON us.skill_id = cs.skill_id
          WHERE us.user_id = $1 AND cs.competency_id = $2 AND us.verified = true
        `;

        const userSkills = await AppDataSource.query(userSkillsQuery, [userId, competency.competency_id]);

        // Calculate progress percentage
        const progressPercentage = (userSkills.length / competencySkills.length) * 100;

        // Determine competency level based on progress
        let newLevel = 'Beginner';
        if (progressPercentage >= 90) {
          newLevel = 'Expert';
        } else if (progressPercentage >= 70) {
          newLevel = 'Advanced';
        } else if (progressPercentage >= 40) {
          newLevel = 'Intermediate';
        }

        // Update user competency record
        let userCompetency = await this.userCompetencyRepository.findOne({
          where: { user_id: userId, competency_id: competency.competency_id }
        });

        if (userCompetency) {
          userCompetency.level = newLevel;
          userCompetency.progress_percentage = progressPercentage;
          userCompetency.last_evaluate = new Date();
        } else {
          userCompetency = this.userCompetencyRepository.create({
            user_id: userId,
            competency_id: competency.competency_id,
            level: newLevel,
            progress_percentage: progressPercentage,
            last_evaluate: new Date()
          });
        }

        await this.userCompetencyRepository.save(userCompetency);

        updatedCompetencies.push({
          competency_id: competency.competency_id,
          new_level: newLevel,
          progress_percentage: progressPercentage
        });
      }

      return updatedCompetencies;
    } catch (error) {
      logger.error('Error recalculating competency levels:', error);
      throw error;
    }
  }
}
