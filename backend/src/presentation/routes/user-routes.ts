import { Router, Request, Response } from 'express';
import { param, query, validationResult } from 'express-validator';
import { UserService } from '@/application/services/user.service';
import { logger } from '@/infrastructure/logger/logger';

const router = Router();
const userService = new UserService();

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

// GET /api/users/:id/profile - Get user profile
router.get('/:id/profile', [
  param('id').isUUID().withMessage('User ID must be a valid UUID'),
  validateRequest
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = await userService.getUserProfile(id);

    if (!profile) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    res.json({ data: profile });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch user profile'
      }
    });
  }
});

// GET /api/users/:id/gaps - Get skill gaps
router.get('/:id/gaps', [
  param('id').isUUID().withMessage('User ID must be a valid UUID'),
  query('target_competency_id').optional().isUUID().withMessage('Target competency ID must be a valid UUID'),
  query('include_recommendations').optional().isBoolean().withMessage('Include recommendations must be a boolean'),
  validateRequest
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { target_competency_id, include_recommendations } = req.query;

    const gaps = await userService.getSkillGaps(id, {
      target_competency_id: target_competency_id as string,
      include_recommendations: include_recommendations === 'true'
    });

    res.json({ data: gaps });
  } catch (error) {
    logger.error('Error fetching skill gaps:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch skill gaps'
      }
    });
  }
});

export { router as userRoutes };

