import { Router, Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { CompetencyService } from '../services/competencyService';
import { validateCompetency } from '../validators/competencyValidator';

const router = Router();
const competencyService = new CompetencyService();

// GET /api/v1/competencies - Get all competencies
router.get('/', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, search, level } = req.query;
    
    const competencies = await competencyService.getAllCompetencies({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
      level: level as string
    });

    logger.info('Competencies retrieved successfully', {
      count: competencies.data.length,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });

    res.json({
      success: true,
      data: competencies.data,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: competencies.total,
        pages: Math.ceil(competencies.total / parseInt(limit as string))
      }
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/competencies/:id - Get competency by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const competency = await competencyService.getCompetencyById(parseInt(id));
    
    if (!competency) {
      return res.status(404).json({
        success: false,
        message: 'Competency not found'
      });
    }

    logger.info('Competency retrieved successfully', { competencyId: id });

    res.json({
      success: true,
      data: competency
    });
  } catch (error) {
    next(error);
  }
}));

// POST /api/v1/competencies - Create new competency
router.post('/', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = validateCompetency(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details
      });
    }

    const competency = await competencyService.createCompetency(value);

    logger.info('Competency created successfully', { competencyId: competency.id });

    res.status(201).json({
      success: true,
      data: competency
    });
  } catch (error) {
    next(error);
  }
}));

// PUT /api/v1/competencies/:id - Update competency
router.put('/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { error, value } = validateCompetency(req.body, true);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details
      });
    }

    const competency = await competencyService.updateCompetency(parseInt(id), value);

    if (!competency) {
      return res.status(404).json({
        success: false,
        message: 'Competency not found'
      });
    }

    logger.info('Competency updated successfully', { competencyId: id });

    res.json({
      success: true,
      data: competency
    });
  } catch (error) {
    next(error);
  }
}));

// DELETE /api/v1/competencies/:id - Delete competency
router.delete('/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const deleted = await competencyService.deleteCompetency(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Competency not found'
      });
    }

    logger.info('Competency deleted successfully', { competencyId: id });

    res.json({
      success: true,
      message: 'Competency deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/competencies/:id/skills - Get skills for competency
router.get('/:id/skills', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const skills = await competencyService.getCompetencySkills(parseInt(id));

    logger.info('Competency skills retrieved successfully', { competencyId: id });

    res.json({
      success: true,
      data: skills
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/competencies/:id/skills/detailed - Get detailed skills for competency
router.get('/:id/skills/detailed', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const competencyId = parseInt(id);
    
    const competency = await competencyService.getCompetencyById(competencyId);
    
    if (!competency) {
      return res.status(404).json({
        success: false,
        message: 'Competency not found'
      });
    }

    const skills = await competencyService.getCompetencySkills(competencyId);

    logger.info('Detailed competency skills retrieved successfully', { 
      competencyId: id,
      skillCount: skills.length 
    });

    res.json({
      success: true,
      data: {
        competency: {
          id: competency.id,
          name: competency.name,
          description: competency.description
        },
        skills: skills,
        total_skills: skills.length,
        description: `This competency includes ${skills.length} skills that are essential for mastering ${competency.name}`
      }
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/competencies/:id/hierarchy - Get competency hierarchy
router.get('/:id/hierarchy', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const hierarchy = await competencyService.getCompetencyHierarchy(parseInt(id));

    logger.info('Competency hierarchy retrieved successfully', { competencyId: id });

    res.json({
      success: true,
      data: hierarchy
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/competencies/:id/tree - Get full competency tree with nested competencies and skills
router.get('/:id/tree', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const competencyId = parseInt(id);
    
    const tree = await competencyService.getCompetencyTree(competencyId);

    if (!tree) {
      return res.status(404).json({
        success: false,
        message: 'Competency not found'
      });
    }

    logger.info('Competency tree retrieved successfully', { 
      competencyId: id,
      childrenCount: tree.total_children,
      skillsCount: tree.total_skills
    });

    res.json({
      success: true,
      data: {
        ...tree,
        message: `This competency tree shows ${tree.total_children} nested competencies and ${tree.total_skills} skills`
      }
    });
  } catch (error) {
    next(error);
  }
}));

export default router;
