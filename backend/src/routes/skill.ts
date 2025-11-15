import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateService } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import Joi from 'joi';
import { TaxonomyService } from '../services/TaxonomyService';
import { TaxonomyRepository } from '../repositories/TaxonomyRepository';

const router = Router();
const taxonomyService = new TaxonomyService();
const taxonomyRepository = new TaxonomyRepository();

// Create skill schema
const createSkillSchema = Joi.object({
  skill_id: Joi.string().required(),
  skill_name: Joi.string().required(),
  description: Joi.string().optional(),
  parent_skill_id: Joi.string().optional(),
});

// GET /api/skill/:skill_id - Get specific skill
router.get(
  '/:skill_id',
  authenticateService,
  asyncHandler(async (req, res) => {
    const { skill_id } = req.params;
    const skill = await taxonomyService.getSkillById(skill_id);

    res.json({
      success: true,
      data: skill,
      timestamp: new Date().toISOString(),
    });
  })
);

// POST /api/skill - Add new skill
router.post(
  '/',
  authenticateService,
  validateRequest(createSkillSchema),
  asyncHandler(async (req, res) => {
    const skillData = req.body;
    await taxonomyRepository.addSkill(skillData);

    const skill = await taxonomyService.getSkillById(skillData.skill_id);

    res.status(201).json({
      success: true,
      data: skill,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;

