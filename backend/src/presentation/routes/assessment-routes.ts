import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AssessmentService } from '@/application/services/assessment.service';
import { logger } from '@/infrastructure/logger/logger';

const router = Router();
const assessmentService = new AssessmentService();

// Validation middleware
const validateRequest = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: errors.array()
      }
    });
  }
  next();
};

// POST /api/assessments/results - Process assessment results
router.post('/results', [
  body('user_id').isUUID().withMessage('User ID must be a valid UUID'),
  body('assessment_id').isUUID().withMessage('Assessment ID must be a valid UUID'),
  body('results').isArray().withMessage('Results must be an array'),
  body('results.*.skill_id').isUUID().withMessage('Skill ID must be a valid UUID'),
  body('results.*.score').isNumeric().withMessage('Score must be a number'),
  body('results.*.max_score').isNumeric().withMessage('Max score must be a number'),
  body('results.*.completed_at').isISO8601().withMessage('Completed at must be a valid date'),
  validateRequest
], async (req: Request, res: Response) => {
  try {
    const assessmentData = req.body;
    const result = await assessmentService.processAssessmentResults(assessmentData);

    res.status(200).json({ data: result });
  } catch (error) {
    logger.error('Error processing assessment results:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to process assessment results'
      }
    });
  }
});

export { router as assessmentRoutes };

