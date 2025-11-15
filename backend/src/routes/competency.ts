import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateService } from '../middleware/auth';
import { TaxonomyService } from '../services/TaxonomyService';
import { NotFoundError } from '../utils/errors';

const router = Router();
const taxonomyService = new TaxonomyService();

// Get MGS for competency (conditional logic based on service)
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

export default router;

