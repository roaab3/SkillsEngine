import { Router, Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { GapAnalysisService } from '../services/gapAnalysisService';

const router = Router();
const gapAnalysisService = new GapAnalysisService();

// GET /api/v1/gaps/:user_id - Get skill gaps for user
router.get('/:user_id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;
    const { competency_id, level, priority } = req.query;
    
    const gaps = await gapAnalysisService.getUserSkillGaps(parseInt(user_id), {
      competency_id: competency_id ? parseInt(competency_id as string) : undefined,
      level: level as string,
      priority: priority as string
    });

    logger.info('Skill gaps retrieved successfully', {
      userId: user_id,
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

// POST /api/v1/gaps/analyze - Perform gap analysis
router.post('/analyze', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, competency_id, target_level } = req.body;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const analysis = await gapAnalysisService.performGapAnalysis(parseInt(user_id), {
      competency_id: competency_id ? parseInt(competency_id) : undefined,
      target_level
    });

    logger.info('Gap analysis performed successfully', {
      userId: user_id,
      competencyId: competency_id
    });

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/gaps/:user_id/competency/:competency_id - Get gaps for specific competency
router.get('/:user_id/competency/:competency_id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, competency_id } = req.params;
    const { target_level } = req.query;
    
    const gaps = await gapAnalysisService.getCompetencyGaps(
      parseInt(user_id),
      parseInt(competency_id),
      {
        target_level: target_level as string
      }
    );

    logger.info('Competency gaps retrieved successfully', {
      userId: user_id,
      competencyId: competency_id
    });

    res.json({
      success: true,
      data: gaps
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/gaps/:user_id/summary - Get gap analysis summary
router.get('/:user_id/summary', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;
    
    const summary = await gapAnalysisService.getGapAnalysisSummary(parseInt(user_id));

    logger.info('Gap analysis summary retrieved successfully', { userId: user_id });

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
}));

// POST /api/v1/gaps/:user_id/recommendations - Get learning recommendations
router.post('/:user_id/recommendations', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;
    const { competency_id, limit = 10 } = req.body;
    
    const recommendations = await gapAnalysisService.getLearningRecommendations(
      parseInt(user_id),
      {
        competency_id: competency_id ? parseInt(competency_id) : undefined,
        limit: parseInt(limit)
      }
    );

    logger.info('Learning recommendations retrieved successfully', {
      userId: user_id,
      count: recommendations.length
    });

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/gaps/:user_id/trends - Get gap analysis trends
router.get('/:user_id/trends', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;
    const { period = '30d' } = req.query;
    
    const trends = await gapAnalysisService.getGapAnalysisTrends(parseInt(user_id), {
      period: period as string
    });

    logger.info('Gap analysis trends retrieved successfully', {
      userId: user_id,
      period
    });

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    next(error);
  }
}));

export default router;
