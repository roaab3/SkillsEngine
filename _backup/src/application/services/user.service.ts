import { AppDataSource } from '@/infrastructure/database/connection';
import { User } from '@/domain/entities/user.entity';
import { UserSkill } from '@/domain/entities/user-skill.entity';
import { UserCompetency } from '@/domain/entities/user-competency.entity';
import { logger } from '@/infrastructure/logger/logger';

export interface UserProfile {
  user_id: string;
  name: string;
  company_id: string;
  competencies: UserCompetency[];
  skills: UserSkill[];
  created_at: Date;
  updated_at: Date;
}

export interface SkillGap {
  competency_id: string;
  competency_name: string;
  missing_skills: Array<{
    skill_id: string;
    name: string;
    type: string;
    priority: string;
  }>;
  gap_percentage: number;
  recommendations?: Array<{
    type: string;
    title: string;
    provider: string;
    estimated_duration: string;
  }>;
}

export interface SkillGapsResult {
  user_id: string;
  gaps: SkillGap[];
  overall_gap_percentage: number;
  generated_at: Date;
}

export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private userSkillRepository = AppDataSource.getRepository(UserSkill);
  private userCompetencyRepository = AppDataSource.getRepository(UserCompetency);

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['user_skills', 'user_competencies']
      });

      if (!user) {
        return null;
      }

      return {
        user_id: user.id,
        name: user.name,
        company_id: user.company_id,
        competencies: user.user_competencies,
        skills: user.user_skills,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    } catch (error) {
      logger.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async getSkillGaps(userId: string, options: {
    target_competency_id?: string;
    include_recommendations?: boolean;
  } = {}): Promise<SkillGapsResult> {
    try {
      // Get user competencies
      const userCompetencies = await this.userCompetencyRepository.find({
        where: { user_id: userId },
        relations: ['competency', 'competency.skills']
      });

      const gaps: SkillGap[] = [];
      let totalGapPercentage = 0;

      for (const userCompetency of userCompetencies) {
        // Filter by target competency if specified
        if (options.target_competency_id && userCompetency.competency_id !== options.target_competency_id) {
          continue;
        }

        // Get all skills for this competency
        const competencySkills = userCompetency.competency.skills || [];
        
        // Get user's verified skills for this competency
        const userSkills = await this.userSkillRepository.find({
          where: {
            user_id: userId,
            verified: true
          },
          relations: ['skill']
        });

        const verifiedSkillIds = userSkills.map(us => us.skill_id);
        const missingSkills = competencySkills.filter(skill => !verifiedSkillIds.includes(skill.id));

        if (missingSkills.length > 0) {
          const gapPercentage = (missingSkills.length / competencySkills.length) * 100;
          totalGapPercentage += gapPercentage;

          const gap: SkillGap = {
            competency_id: userCompetency.competency_id,
            competency_name: userCompetency.competency.name,
            missing_skills: missingSkills.map(skill => ({
              skill_id: skill.id,
              name: skill.name,
              type: skill.type,
              priority: this.calculateSkillPriority(skill.type)
            })),
            gap_percentage: gapPercentage
          };

          // Add recommendations if requested
          if (options.include_recommendations) {
            gap.recommendations = this.generateRecommendations(missingSkills);
          }

          gaps.push(gap);
        }
      }

      const overallGapPercentage = gaps.length > 0 ? totalGapPercentage / gaps.length : 0;

      return {
        user_id: userId,
        gaps,
        overall_gap_percentage: overallGapPercentage,
        generated_at: new Date()
      };
    } catch (error) {
      logger.error('Error fetching skill gaps:', error);
      throw error;
    }
  }

  private calculateSkillPriority(skillType: string): string {
    // L4 (Nano-skills) are highest priority, L1 (Macro-skills) are lowest
    switch (skillType) {
      case 'L4': return 'High';
      case 'L3': return 'Medium';
      case 'L2': return 'Low';
      case 'L1': return 'Low';
      default: return 'Medium';
    }
  }

  private generateRecommendations(skills: any[]): Array<{
    type: string;
    title: string;
    provider: string;
    estimated_duration: string;
  }> {
    // This is a simplified recommendation system
    // In a real implementation, this would integrate with Course Builder and Learner AI
    return skills.map(skill => ({
      type: 'course',
      title: `${skill.name} Fundamentals`,
      provider: 'Skills Engine Learning',
      estimated_duration: '4 hours'
    }));
  }
}

