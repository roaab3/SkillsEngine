import { Router, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { SkillService } from '@/application/services/skill.service';
import { logger } from '@/infrastructure/logger/logger';

const router = Router();
const skillService = new SkillService();

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

// GET /api/skills - List skills
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('type').optional().isIn(['L1', 'L2', 'L3', 'L4']).withMessage('Type must be L1, L2, L3, or L4'),
  query('company_id').optional().isUUID().withMessage('Company ID must be a valid UUID'),
  validateRequest
], async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      type,
      company_id
    } = req.query;

    const result = await skillService.getSkills({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
      type: type as string,
      company_id: company_id as string
    });

    res.json(result);
  } catch (error) {
    logger.error('Error fetching skills:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch skills'
      }
    });
  }
});

// GET /api/skills/:id - Get skill by ID
router.get('/:id', [
  param('id').isUUID().withMessage('Skill ID must be a valid UUID'),
  validateRequest
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const skill = await skillService.getSkillById(id);

    if (!skill) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Skill not found'
        }
      });
    }

    res.json({ data: skill });
  } catch (error) {
    logger.error('Error fetching skill:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch skill'
      }
    });
  }
});

// POST /api/skills - Create new skill
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('type').isIn(['L1', 'L2', 'L3', 'L4']).withMessage('Type must be L1, L2, L3, or L4'),
  body('code').optional().isString().withMessage('Code must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('parent_skill_id').optional().isUUID().withMessage('Parent skill ID must be a valid UUID'),
  body('company_id').optional().isUUID().withMessage('Company ID must be a valid UUID'),
  validateRequest
], async (req: Request, res: Response) => {
  try {
    const skillData = req.body;
    const skill = await skillService.createSkill(skillData);

    res.status(201).json({ data: skill });
  } catch (error) {
    logger.error('Error creating skill:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create skill'
      }
    });
  }
});

// PUT /api/skills/:id - Update skill
router.put('/:id', [
  param('id').isUUID().withMessage('Skill ID must be a valid UUID'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('type').optional().isIn(['L1', 'L2', 'L3', 'L4']).withMessage('Type must be L1, L2, L3, or L4'),
  body('code').optional().isString().withMessage('Code must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  validateRequest
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const skill = await skillService.updateSkill(id, updateData);

    if (!skill) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Skill not found'
        }
      });
    }

    res.json({ data: skill });
  } catch (error) {
    logger.error('Error updating skill:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update skill'
      }
    });
  }
});

// DELETE /api/skills/:id - Delete skill
router.delete('/:id', [
  param('id').isUUID().withMessage('Skill ID must be a valid UUID'),
  validateRequest
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await skillService.deleteSkill(id);

    if (!deleted) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Skill not found'
        }
      });
    }

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting skill:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete skill'
      }
    });
  }
});

export { router as skillRoutes };

