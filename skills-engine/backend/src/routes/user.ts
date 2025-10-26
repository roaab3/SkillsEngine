import { Router, Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { UserService } from '../services/userService';
import { validateUserProfile } from '../validators/userValidator';

const router = Router();
const userService = new UserService();

// GET /api/v1/users/:id/profile - Get user competency profile
router.get('/:id/profile', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const profile = await userService.getUserProfile(parseInt(id));
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    logger.info('User profile retrieved successfully', { userId: id });

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/users/:id/competencies - Get user competencies
router.get('/:id/competencies', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, level } = req.query;
    
    const competencies = await userService.getUserCompetencies(parseInt(id), {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      level: level as string
    });

    logger.info('User competencies retrieved successfully', {
      userId: id,
      count: competencies.data.length
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

// GET /api/v1/users/:id/skills - Get user skills
router.get('/:id/skills', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, verified, level } = req.query;
    
    const skills = await userService.getUserSkills(parseInt(id), {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      verified: verified === 'true' ? true : verified === 'false' ? false : undefined,
      level: level as string
    });

    logger.info('User skills retrieved successfully', {
      userId: id,
      count: skills.data.length
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

// POST /api/v1/users/:id/competencies - Add competency to user
router.post('/:id/competencies', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { competency_id, level } = req.body;
    
    const userCompetency = await userService.addUserCompetency(parseInt(id), {
      competency_id,
      level
    });

    logger.info('User competency added successfully', {
      userId: id,
      competencyId: competency_id
    });

    res.status(201).json({
      success: true,
      data: userCompetency
    });
  } catch (error) {
    next(error);
  }
}));

// PUT /api/v1/users/:id/competencies/:competency_id - Update user competency level
router.put('/:id/competencies/:competency_id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, competency_id } = req.params;
    const { level } = req.body;
    
    const userCompetency = await userService.updateUserCompetency(
      parseInt(id),
      parseInt(competency_id),
      { level }
    );

    if (!userCompetency) {
      return res.status(404).json({
        success: false,
        message: 'User competency not found'
      });
    }

    logger.info('User competency updated successfully', {
      userId: id,
      competencyId: competency_id
    });

    res.json({
      success: true,
      data: userCompetency
    });
  } catch (error) {
    next(error);
  }
}));

// DELETE /api/v1/users/:id/competencies/:competency_id - Remove user competency
router.delete('/:id/competencies/:competency_id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, competency_id } = req.params;
    
    const deleted = await userService.removeUserCompetency(
      parseInt(id),
      parseInt(competency_id)
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User competency not found'
      });
    }

    logger.info('User competency removed successfully', {
      userId: id,
      competencyId: competency_id
    });

    res.json({
      success: true,
      message: 'User competency removed successfully'
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/users/:id/gaps - Get user skill gaps
router.get('/:id/gaps', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { competency_id, level } = req.query;
    
    const gaps = await userService.getUserSkillGaps(parseInt(id), {
      competency_id: competency_id ? parseInt(competency_id as string) : undefined,
      level: level as string
    });

    logger.info('User skill gaps retrieved successfully', {
      userId: id,
      count: gaps.length
    });

    res.json({
      success: true,
      data: gaps
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/users/:id/progress - Get user progress summary
router.get('/:id/progress', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const progress = await userService.getUserProgress(parseInt(id));

    logger.info('User progress retrieved successfully', { userId: id });

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
}));

export default router;
