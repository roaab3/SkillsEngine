import { ProfileRepository } from '../repositories/ProfileRepository';
import { TaxonomyRepository } from '../repositories/TaxonomyRepository';
import { AIService } from './AIService';
import {
  User,
  UserProfile,
  CompetencyProfile,
  SkillResult,
  ExamType,
  VerifiedSkill,
  ProficiencyLevel,
} from '../types';
import { NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

export class ProfileService {
  private profileRepository: ProfileRepository;
  private taxonomyRepository: TaxonomyRepository;
  private aiService: AIService;

  constructor() {
    this.profileRepository = new ProfileRepository();
    this.taxonomyRepository = new TaxonomyRepository();
    this.aiService = new AIService();
  }

  async createUserProfile(userData: Partial<User>): Promise<UserProfile> {
    // Create user record
    const user: User = {
      user_id: userData.user_id!,
      user_name: userData.user_name!,
      company_id: userData.company_id!,
      employee_type: userData.employee_type,
      path_career: userData.path_career,
      raw_data: userData.raw_data,
      relevance_score: 0.00,
    };

    await this.profileRepository.createUser(user);

    // Extract skills from raw data if available
    if (userData.raw_data) {
      const extracted = await this.aiService.extractSkillsFromData(userData.raw_data);
      const normalizedSkills = await this.aiService.normalizeSkills(extracted.skills);
      
      // Map skills to competencies (simplified - would need full implementation)
      // For now, create basic profile structure
    }

    return await this.getUserProfile(user.user_id);
  }

  async updateVerifiedSkills(
    userId: string,
    skills: SkillResult[],
    examType: ExamType
  ): Promise<void> {
    // Get user competencies
    const userCompetencies = await this.profileRepository.getUserCompetencies(userId);

    for (const skillResult of skills) {
      // Find which competency this skill belongs to
      // This is simplified - would need to query competency_skill table
      for (const userComp of userCompetencies) {
        const verifiedSkills = userComp.verifiedSkills || [];
        const existingIndex = verifiedSkills.findIndex(
          (vs) => vs.skill_id === skillResult.skill_id
        );

        const verifiedSkill: VerifiedSkill = {
          skill_id: skillResult.skill_id,
          skill_name: skillResult.skill_name,
          verified: skillResult.status === 'PASS',
          lastUpdate: new Date().toISOString(),
        };

        if (existingIndex >= 0) {
          // Update existing (only if assessment has higher priority)
          if (examType === 'baseline' || examType === 'post_course') {
            verifiedSkills[existingIndex] = verifiedSkill;
          }
        } else {
          verifiedSkills.push(verifiedSkill);
        }

        await this.profileRepository.updateVerifiedSkills(
          userId,
          userComp.competency_id,
          verifiedSkills
        );

        // Recalculate coverage and proficiency
        await this.calculateCoveragePercentage(userId, userComp.competency_id);
      }
    }

    // Recalculate relevance score
    await this.calculateRelevanceScore(userId);
  }

  async calculateCoveragePercentage(userId: string, competencyId: string): Promise<number> {
    const userComp = await this.profileRepository.getUserCompetency(userId, competencyId);
    if (!userComp) {
      return 0;
    }

    // Get all required MGS for competency
    const requiredMGS = await this.taxonomyRepository.getAllMGSForCompetency(competencyId);
    const totalMGS = requiredMGS.length;

    if (totalMGS === 0) {
      return 0;
    }

    // Count verified MGS
    const verifiedSkills = userComp.verifiedSkills || [];
    const verifiedMGS = verifiedSkills.filter((vs) => vs.verified).length;

    const coveragePercentage = (verifiedMGS / totalMGS) * 100;

    // Update proficiency level
    const proficiencyLevel = this.mapProficiencyLevel(coveragePercentage);

    await this.profileRepository.updateUserCompetency(userId, competencyId, {
      coverage_percentage: coveragePercentage,
      proficiency_level: proficiencyLevel,
    });

    return coveragePercentage;
  }

  mapProficiencyLevel(coveragePercentage: number): ProficiencyLevel {
    if (coveragePercentage >= 0 && coveragePercentage <= 30) {
      return 'BEGINNER';
    } else if (coveragePercentage >= 31 && coveragePercentage <= 65) {
      return 'INTERMEDIATE';
    } else if (coveragePercentage >= 66 && coveragePercentage <= 85) {
      return 'ADVANCED';
    } else {
      return 'EXPERT';
    }
  }

  async calculateRelevanceScore(userId: string): Promise<number> {
    const user = await this.profileRepository.getUserById(userId);
    if (!user || !user.path_career) {
      return 0;
    }

    // Simplified calculation - would need to get all competencies for career path
    const userCompetencies = await this.profileRepository.getUserCompetencies(userId);
    
    let totalVerifiedMGS = 0;
    let totalRequiredMGS = 0;

    for (const userComp of userCompetencies) {
      const requiredMGS = await this.taxonomyRepository.getAllMGSForCompetency(userComp.competency_id);
      totalRequiredMGS += requiredMGS.length;
      
      const verifiedSkills = userComp.verifiedSkills || [];
      totalVerifiedMGS += verifiedSkills.filter((vs) => vs.verified).length;
    }

    const relevanceScore = totalRequiredMGS > 0 
      ? (totalVerifiedMGS / totalRequiredMGS) * 100 
      : 0;

    await this.profileRepository.updateRelevanceScore(userId, relevanceScore);
    return relevanceScore;
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const user = await this.profileRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    const userCompetencies = await this.profileRepository.getUserCompetencies(userId);
    const competencies: CompetencyProfile[] = [];

    for (const userComp of userCompetencies) {
      const competency = await this.taxonomyRepository.getCompetencyById(userComp.competency_id);
      if (!competency) continue;

      const l1Skills = await this.taxonomyRepository.getL1SkillsForCompetency(competency.competency_id);
      const requiredMGS = await this.taxonomyRepository.getAllMGSForCompetency(competency.competency_id);
      const verifiedSkills = userComp.verifiedSkills || [];

      competencies.push({
        competency_id: competency.competency_id,
        competency_name: competency.competency_name,
        coverage_percentage: userComp.coverage_percentage,
        proficiency_level: userComp.proficiency_level || 'BEGINNER',
        l1_skills: l1Skills,
        verified_skills_count: verifiedSkills.filter((vs) => vs.verified).length,
        total_required_mgs: requiredMGS.length,
      });
    }

    return {
      user_id: user.user_id,
      user_name: user.user_name,
      company_id: user.company_id,
      relevance_score: user.relevance_score,
      competencies,
      last_updated: user.updated_at,
    };
  }

  async getUserProfileDetail(userId: string): Promise<UserProfile> {
    // Same as getUserProfile but with more detail
    return await this.getUserProfile(userId);
  }
}

