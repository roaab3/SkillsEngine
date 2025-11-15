import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateService } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import Joi from 'joi';
import { TaxonomyService } from '../services/TaxonomyService';
import { TaxonomyRepository } from '../repositories/TaxonomyRepository';
import { NotFoundError } from '../utils/errors';

const router = Router();
const taxonomyService = new TaxonomyService();
const taxonomyRepository = new TaxonomyRepository();

// Create competency schema
const createCompetencySchema = Joi.object({
  competency_id: Joi.string().required(),
  competency_name: Joi.string().required(),
  description: Joi.string().optional(),
  parent_competency_id: Joi.string().optional(),
});

// POST /api/competency - Add new competency (must come before parameterized routes)
router.post(
  '/',
  authenticateService,
  validateRequest(createCompetencySchema),
  asyncHandler(async (req, res) => {
    const competencyData = req.body;
    await taxonomyRepository.addCompetency(competencyData);

    const competency = await taxonomyService.getCompetencyById(competencyData.competency_id);

    res.status(201).json({
      success: true,
      data: competency,
      timestamp: new Date().toISOString(),
    });
  })
);

// Get MGS for competency (conditional logic based on service)
// This must come before /:competency_id to avoid route conflicts
router.get(
  '/:competencyName/skills',
  authenticateService,
  asyncHandler(async (req, res) => {
    const { competencyName } = req.params;
    const service = req.query.service as string;
    const serviceId = req.serviceId || service;

    let mgs;
    
    if (serviceId === 'course-builder' || serviceId === 'course_builder') {
      // Course Builder: AI normalization + external discovery if missing
      mgs = await taxonomyService.getMGSForCompetencyWithDiscovery(competencyName);
    } else if (serviceId === 'content-studio' || serviceId === 'content_studio' || 
               serviceId === 'learner-ai' || serviceId === 'learner_ai') {
      // Content Studio / Learner AI: Internal lookup only
      mgs = await taxonomyService.getMGSForCompetency(competencyName);
      if (!mgs || mgs.length === 0) {
        throw new NotFoundError('Competency');
      }
    } else {
      // Default: Internal lookup
      mgs = await taxonomyService.getMGSForCompetency(competencyName);
    }

    res.json({
      success: true,
      data: {
        competency_name: competencyName,
        mgs: mgs,
      },
      timestamp: new Date().toISOString(),
    });
  })
);

// GET /api/competency/:competency_id - Get specific competency
// This must come after /:competencyName/skills to avoid route conflicts
router.get(
  '/:competency_id',
  authenticateService,
  asyncHandler(async (req, res) => {
    const { competency_id } = req.params;
    const competency = await taxonomyService.getCompetencyById(competency_id);

    res.json({
      success: true,
      data: competency,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;

