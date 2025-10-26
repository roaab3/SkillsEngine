import Joi from 'joi';

export const competencySchema = Joi.object({
  code: Joi.string().max(50).required(),
  name: Joi.string().max(255).required(),
  description: Joi.string().optional(),
  level: Joi.string().valid('L1', 'L2', 'L3', 'L4').required(),
  parent_id: Joi.number().integer().positive().optional(),
  external_id: Joi.string().max(100).optional(),
  external_source: Joi.string().max(50).optional(),
  metadata: Joi.object().optional()
});

export const updateCompetencySchema = Joi.object({
  code: Joi.string().max(50).optional(),
  name: Joi.string().max(255).optional(),
  description: Joi.string().optional(),
  level: Joi.string().valid('L1', 'L2', 'L3', 'L4').optional(),
  parent_id: Joi.number().integer().positive().optional(),
  external_id: Joi.string().max(100).optional(),
  external_source: Joi.string().max(50).optional(),
  metadata: Joi.object().optional()
});

export function validateCompetency(data: any, isUpdate: boolean = false) {
  const schema = isUpdate ? updateCompetencySchema : competencySchema;
  return schema.validate(data, { abortEarly: false });
}
