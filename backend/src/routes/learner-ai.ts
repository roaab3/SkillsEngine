import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateService } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import Joi from 'joi';
import { GapAnalysisService } from '../services/GapAnalysisService';

const router = Router();
const gapAnalysisService = new GapAnalysisService();

// Gap analysis schema for Learner AI
const gapAnalysisSchema = Joi.object({
  user_id: Joi.string().required(),
  user_name: Joi.string().required(),
  exam_status: Joi.string().valid('PASS', 'FAIL', 'completed').required(),
  exam_type: Joi.string().valid('baseline', 'post_course').optional(),
  course_name: Joi.string().optional(),
});

// POST /api/learner-ai/gap-analysis - Outgoing async gap analysis for Learner AI
router.post(
  '/gap-analysis',
  authenticateService,
  validateRequest(gapAnalysisSchema),
  asyncHandler(async (req, res) => {
    const { user_id, exam_status, exam_type, course_name } = req.body;
    
    // Queue for async processing (non-blocking)
    // In a real implementation, this would be queued and processed asynchronously
    let gapAnalysis;
    if (exam_type === 'post_course' && course_name) {
      gapAnalysis = await gapAnalysisService.performNarrowGapAnalysis(
        user_id,
        course_name,
        exam_status
      );
    } else {
      gapAnalysis = await gapAnalysisService.performBroadGapAnalysis(
        user_id,
        exam_status
      );
    }

    // Return immediately with 202 Accepted status
    res.status(202).json({
      status: 'accepted',
      user_id: user_id,
      message: 'Gap analysis queued for processing',
      timestamp: new Date().toISOString(),
    });

    // Note: In production, this would trigger an async job/queue
    // and send results to Learner AI via webhook/callback
  })
);

export default router;

