import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateService } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import Joi from 'joi';
import { GapAnalysisService } from '../services/GapAnalysisService';

const router = Router();
const gapAnalysisService = new GapAnalysisService();

// Narrow gap analysis schema
const narrowGapAnalysisSchema = Joi.object({
  user_id: Joi.string().required(),
  user_name: Joi.string().required(),
  course_name: Joi.string().required(),
  exam_status: Joi.string().valid('PASS', 'FAIL', 'completed').required(),
});

// Broad gap analysis schema
const broadGapAnalysisSchema = Joi.object({
  user_id: Joi.string().required(),
  user_name: Joi.string().required(),
  exam_status: Joi.string().valid('PASS', 'FAIL', 'completed').required(),
});

// POST /api/gap-analysis/narrow - Perform narrow gap analysis for a specific course
router.post(
  '/narrow',
  authenticateService,
  validateRequest(narrowGapAnalysisSchema),
  asyncHandler(async (req, res) => {
    const { user_id, course_name, exam_status } = req.body;
    
    const gapAnalysis = await gapAnalysisService.performNarrowGapAnalysis(
      user_id,
      course_name,
      exam_status
    );

    res.json({
      success: true,
      data: gapAnalysis,
      timestamp: new Date().toISOString(),
    });
  })
);

// POST /api/gap-analysis/broad - Perform broad gap analysis for career path
router.post(
  '/broad',
  authenticateService,
  validateRequest(broadGapAnalysisSchema),
  asyncHandler(async (req, res) => {
    const { user_id, exam_status } = req.body;
    
    const gapAnalysis = await gapAnalysisService.performBroadGapAnalysis(
      user_id,
      exam_status
    );

    res.json({
      success: true,
      data: gapAnalysis,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;

