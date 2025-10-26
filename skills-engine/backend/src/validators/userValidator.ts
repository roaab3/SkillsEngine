import Joi from 'joi';

export const userProfileSchema = Joi.object({
  name: Joi.string().max(255).required(),
  email: Joi.string().email().required(),
  role: Joi.string().max(100).optional(),
  department: Joi.string().max(100).optional(),
  profile_data: Joi.object().optional()
});

export const userCompetencySchema = Joi.object({
  competency_id: Joi.number().integer().positive().required(),
  level: Joi.string().valid('Missing', 'Beginner', 'Intermediate', 'Advanced', 'Expert').required()
});

export const userSkillSchema = Joi.object({
  skill_id: Joi.number().integer().positive().required(),
  level: Joi.string().valid('Missing', 'Beginner', 'Intermediate', 'Advanced', 'Expert').required(),
  proficiency_score: Joi.number().min(0).max(100).optional()
});

export function validateUserProfile(data: any) {
  return userProfileSchema.validate(data, { abortEarly: false });
}

export function validateUserCompetency(data: any) {
  return userCompetencySchema.validate(data, { abortEarly: false });
}

export function validateUserSkill(data: any) {
  return userSkillSchema.validate(data, { abortEarly: false });
}
