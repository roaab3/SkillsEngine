import { Router, Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { SkillService } from '../services/skillService';
import { validateSkill } from '../validators/skillValidator';

const router = Router();
const skillService = new SkillService();

// GET /api/v1/skills - Get all skills
router.get('/', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, search, level, competency_id } = req.query;
    
    const skills = await skillService.getAllSkills({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
      level: level as string,
      competency_id: competency_id ? parseInt(competency_id as string) : undefined
    });

    logger.info('Skills retrieved successfully', {
      count: skills.data.length,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });

    res.json({
      success: true,
      data: skills.data,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: skills.total,
        pages: Math.ceil(skills.total / parseInt(limit as string))
      }
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/skills/:id - Get skill by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const skill = await skillService.getSkillById(parseInt(id));
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    logger.info('Skill retrieved successfully', { skillId: id });

    res.json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
}));

// POST /api/v1/skills - Create new skill
router.post('/', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = validateSkill(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details
      });
    }

    const skill = await skillService.createSkill(value);

    logger.info('Skill created successfully', { skillId: skill.id });

    res.status(201).json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
}));

// PUT /api/v1/skills/:id - Update skill
router.put('/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { error, value } = validateSkill(req.body, true);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details
      });
    }

    const skill = await skillService.updateSkill(parseInt(id), value);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    logger.info('Skill updated successfully', { skillId: id });

    res.json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
}));

// DELETE /api/v1/skills/:id - Delete skill
router.delete('/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const deleted = await skillService.deleteSkill(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    logger.info('Skill deleted successfully', { skillId: id });

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/skills/:id/hierarchy - Get skill hierarchy
router.get('/:id/hierarchy', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const hierarchy = await skillService.getSkillHierarchy(parseInt(id));

    logger.info('Skill hierarchy retrieved successfully', { skillId: id });

    res.json({
      success: true,
      data: hierarchy
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/skills/:id/children - Get child skills
router.get('/:id/children', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const children = await skillService.getChildSkills(parseInt(id));

    logger.info('Child skills retrieved successfully', { skillId: id });

    res.json({
      success: true,
      data: children
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/skills/:id/competencies - Get competencies that include this skill
router.get('/:id/competencies', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const skillId = parseInt(id);
    
    const skill = await skillService.getSkillById(skillId);
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    const competencies = await skillService.getCompetenciesForSkill(skillId);

    logger.info('Skill competencies retrieved successfully', { 
      skillId: id,
      competencyCount: competencies.length 
    });

    res.json({
      success: true,
      data: {
        skill: {
          id: skill.id,
          name: skill.name,
          description: skill.description
        },
        competencies: competencies,
        total_competencies: competencies.length,
        description: `This skill is part of ${competencies.length} competency areas`
      }
    });
  } catch (error) {
    next(error);
  }
}));

// POST /api/v1/skills/normalize - Normalize skill using AI
router.post('/normalize', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { skills } = req.body;
    
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills array is required'
      });
    }

    const normalizedSkills = await skillService.normalizeSkills(skills);

    logger.info('Skills normalized successfully', { count: normalizedSkills.length });

    res.json({
      success: true,
      data: normalizedSkills
    });
  } catch (error) {
    next(error);
  }
}));

export default router;
