// Domain Types and Interfaces

export interface Skill {
  skill_id: string;
  skill_name: string;
  parent_skill_id?: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Competency {
  competency_id: string;
  competency_name: string;
  description?: string;
  parent_competency_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface User {
  user_id: string;
  user_name: string;
  company_id: string;
  employee_type?: string;
  path_career?: string;
  raw_data?: string;
  relevance_score: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface VerifiedSkill {
  skill_id: string;
  skill_name: string;
  verified: boolean;
  lastUpdate: string;
}

export interface UserCompetency {
  user_id: string;
  competency_id: string;
  coverage_percentage: number;
  proficiency_level?: ProficiencyLevel;
  verifiedSkills: VerifiedSkill[];
  created_at?: Date;
  updated_at?: Date;
}

export interface UserSkill {
  user_id: string;
  skill_id: string;
  skill_name: string;
  verified: boolean;
  source?: SkillSource;
  last_update?: Date;
  created_at?: Date;
}

export interface OfficialSource {
  source_id: string;
  source_name: string;
  reference_index_url: string;
  reference_type?: string;
  access_method?: string;
  hierarchy_support: boolean;
  provides?: string;
  topics_covered?: string;
  skill_focus?: string;
  notes?: string;
  last_checked?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type SkillSource = 'assessment' | 'certification' | 'claim' | 'ai';
export type ExamType = 'baseline' | 'post_course';
export type ExamStatus = 'PASS' | 'FAIL' | 'completed';

export interface SkillResult {
  skill_id: string;
  skill_name: string;
  status: 'PASS' | 'FAIL';
}

export interface AssessmentResult {
  user_id: string;
  user_name: string;
  exam_type: ExamType;
  exam_status: ExamStatus;
  course_name?: string;
  skills: SkillResult[];
}

export interface GapAnalysisResult {
  user_id: string;
  user_name: string;
  exam_status?: ExamStatus;
  exam_type?: ExamType;
  course_name?: string;
  company?: string;
  career_path_goal?: string;
  missing_skills_map: Record<string, MissingSkillGroup>;
}

export interface MissingSkillGroup {
  competency_id: string;
  competency_name: string;
  missing_mgs: MissingSkill[];
}

export interface MissingSkill {
  skill_id: string;
  skill_name: string;
}

export interface UserProfile {
  user_id: string;
  user_name: string;
  company_id: string;
  relevance_score: number;
  competencies: CompetencyProfile[];
  missing_skills?: Record<string, MissingSkill[]>;
  last_updated?: Date;
}

export interface CompetencyProfile {
  competency_id: string;
  competency_name: string;
  coverage_percentage: number;
  proficiency_level: ProficiencyLevel;
  l1_skills?: Skill[];
  verified_skills_count?: number;
  total_required_mgs?: number;
}

export interface UnifiedRequest {
  service_id: string;
  endpoint: string;
  method: string;
  body?: any;
  headers?: Record<string, string>;
}

export interface UnifiedResponse {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

