import { ProfileRepository } from '../repositories/ProfileRepository';
import { TaxonomyRepository } from '../repositories/TaxonomyRepository';
import {
  GapAnalysisResult,
  MissingSkillGroup,
  MissingSkill,
  ExamStatus,
} from '../types';
import { NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

export class GapAnalysisService {
  private profileRepository: ProfileRepository;
  private taxonomyRepository: TaxonomyRepository;

  constructor() {
    this.profileRepository = new ProfileRepository();
    this.taxonomyRepository = new TaxonomyRepository();
  }

  async performNarrowGapAnalysis(
    userId: string,
    courseName: string,
    examStatus: ExamStatus
  ): Promise<GapAnalysisResult> {
    const user = await this.profileRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    // Get competency associated with course (simplified - would need course-competency mapping)
    // For now, assume course name maps to competency name
    const competency = await this.taxonomyRepository.getCompetencyByName(courseName);
    if (!competency) {
      throw new NotFoundError('Competency');
    }

    // Get required MGS for competency
    const requiredMGS = await this.taxonomyRepository.getAllMGSForCompetency(competency.competency_id);

    // Get user's verified skills for this competency
    const userComp = await this.profileRepository.getUserCompetency(userId, competency.competency_id);
    const verifiedSkills = userComp?.verifiedSkills || [];
    const verifiedSkillIds = new Set(verifiedSkills.filter((vs) => vs.verified).map((vs) => vs.skill_id));

    // Find missing MGS
    const missingMGS: MissingSkill[] = requiredMGS
      .filter((mgs) => !verifiedSkillIds.has(mgs.skill_id))
      .map((mgs) => ({
        skill_id: mgs.skill_id,
        skill_name: mgs.skill_name,
      }));

    const missingSkillsMap: Record<string, MissingSkillGroup> = {
      [competency.competency_id]: {
        competency_id: competency.competency_id,
        competency_name: competency.competency_name,
        missing_mgs: missingMGS,
      },
    };

    return {
      user_id: userId,
      user_name: user.user_name,
      exam_status: examStatus,
      exam_type: 'post_course',
      course_name: courseName,
      company: user.company_id,
      missing_skills_map: missingSkillsMap,
    };
  }

  async performBroadGapAnalysis(
    userId: string,
    examStatus: ExamStatus
  ): Promise<GapAnalysisResult> {
    const user = await this.profileRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    if (!user.path_career) {
      return {
        user_id: userId,
        user_name: user.user_name,
        exam_status: examStatus,
        career_path_goal: undefined,
        company: user.company_id,
        missing_skills_map: {},
      };
    }

    // Get all user competencies (simplified - would need to get all competencies for career path)
    const userCompetencies = await this.profileRepository.getUserCompetencies(userId);
    const missingSkillsMap: Record<string, MissingSkillGroup> = {};

    for (const userComp of userCompetencies) {
      // Get required MGS
      const requiredMGS = await this.taxonomyRepository.getAllMGSForCompetency(userComp.competency_id);

      // Get verified skills
      const verifiedSkills = userComp.verifiedSkills || [];
      const verifiedSkillIds = new Set(verifiedSkills.filter((vs) => vs.verified).map((vs) => vs.skill_id));

      // Find missing MGS
      const missingMGS: MissingSkill[] = requiredMGS
        .filter((mgs) => !verifiedSkillIds.has(mgs.skill_id))
        .map((mgs) => ({
          skill_id: mgs.skill_id,
          skill_name: mgs.skill_name,
        }));

      if (missingMGS.length > 0) {
        const competency = await this.taxonomyRepository.getCompetencyById(userComp.competency_id);
        if (competency) {
          missingSkillsMap[userComp.competency_id] = {
            competency_id: competency.competency_id,
            competency_name: competency.competency_name,
            missing_mgs: missingMGS,
          };
        }
      }
    }

    return {
      user_id: userId,
      user_name: user.user_name,
      exam_status: examStatus,
      exam_type: 'baseline',
      career_path_goal: user.path_career,
      company: user.company_id,
      missing_skills_map: missingSkillsMap,
    };
  }
}

