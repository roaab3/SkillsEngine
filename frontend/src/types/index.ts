// Frontend Type Definitions

export interface Skill {
  skill_id: string;
  skill_name: string;
  parent_skill_id?: string;
  description?: string;
  verified?: boolean;
}

export interface Competency {
  competency_id: string;
  competency_name: string;
  description?: string;
  coverage_percentage: number;
  proficiency_level: ProficiencyLevel;
  l1_skills?: Skill[];
  verified_skills_count?: number;
  total_required_mgs?: number;
}

export type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface UserProfile {
  user_id: string;
  user_name: string;
  company_id: string;
  relevance_score: number;
  competencies: Competency[];
  missing_skills?: Record<string, MissingSkill[]>;
  last_updated?: string;
}

export interface MissingSkill {
  skill_id: string;
  skill_name: string;
}

export interface GapAnalysis {
  user_id: string;
  user_name: string;
  gap_analysis_type: 'narrow' | 'broad';
  missing_skills_map: Record<string, MissingSkillGroup>;
  career_path_goal?: string;
}

export interface MissingSkillGroup {
  competency_id: string;
  competency_name: string;
  missing_mgs: MissingSkill[];
}

export interface CompetencyDetail {
  competency_id: string;
  competency_name: string;
  description?: string;
  skills: SkillHierarchy;
}

export interface SkillHierarchy {
  skill_id: string;
  skill_name: string;
  level: number;
  verified: boolean;
  children?: SkillHierarchy[];
}

