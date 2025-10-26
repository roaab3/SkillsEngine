import { Router, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { CompetencyService } from '@/application/services/competency.service';
import { logger } from '@/infrastructure/logger/logger';

const router = Router();
const competencyService = new CompetencyService();

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

// GET /api/competencies - List competencies
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('company_id').optional().isUUID().withMessage('Company ID must be a valid UUID'),
  validateRequest
], async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      company_id
    } = req.query;

    const result = await competencyService.getCompetencies({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
      category: category as string,
      company_id: company_id as string
    });

    res.json(result);
  } catch (error) {
    logger.error('Error fetching competencies:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch competencies'
      }
    });
  }
});

// GET /api/competencies/:id - Get competency by ID
router.get('/:id', [
  param('id').isUUID().withMessage('Competency ID must be a valid UUID'),
  validateRequest
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const competency = await competencyService.getCompetencyById(id);

    if (!competency) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Competency not found'
        }
      });
    }

    res.json({ data: competency });
  } catch (error) {
    logger.error('Error fetching competency:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch competency'
      }
    });
  }
});

// POST /api/competencies - Create new competency
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('behavioral_definition').optional().isString().withMessage('Behavioral definition must be a string'),
  body('category').optional().isString().withMessage('Category must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('standard_id').optional().isString().withMessage('Standard ID must be a string'),
  body('company_id').optional().isUUID().withMessage('Company ID must be a valid UUID'),
  validateRequest
], async (req: Request, res: Response) => {
  try {
    const competencyData = req.body;
    const competency = await competencyService.createCompetency(competencyData);

    res.status(201).json({ data: competency });
  } catch (error) {
    logger.error('Error creating competency:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create competency'
      }
    });
  }
});

export { router as competencyRoutes };

