import { Router, Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { AIService } from '../services/aiService';

const router = Router();
const aiService = new AIService();

// POST /api/v1/ai/normalize-skills - Normalize skills using AI
router.post('/normalize-skills', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { skills, source } = req.body;
    
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills array is required'
      });
    }

    const normalizedSkills = await aiService.normalizeSkills(skills, {
      source: source || 'manual'
    });

    logger.info('Skills normalized successfully', {
      count: normalizedSkills.length,
      source
    });

    res.json({
      success: true,
      data: normalizedSkills
    });
  } catch (error) {
    next(error);
  }
}));

// POST /api/v1/ai/extract-skills - Extract skills from text using AI
router.post('/extract-skills', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, context } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    const extractedSkills = await aiService.extractSkillsFromText(text, {
      context: context || 'general'
    });

    logger.info('Skills extracted successfully', {
      textLength: text.length,
      skillCount: extractedSkills.length
    });

    res.json({
      success: true,
      data: extractedSkills
    });
  } catch (error) {
    next(error);
  }
}));

// POST /api/v1/ai/semantic-similarity - Find semantically similar skills
router.post('/semantic-similarity', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { skill, threshold = 0.8, limit = 10 } = req.body;
    
    if (!skill) {
      return res.status(400).json({
        success: false,
        message: 'Skill is required'
      });
    }

    const similarSkills = await aiService.findSimilarSkills(skill, {
      threshold: parseFloat(threshold),
      limit: parseInt(limit)
    });

    logger.info('Similar skills found successfully', {
      skill,
      count: similarSkills.length
    });

    res.json({
      success: true,
      data: similarSkills
    });
  } catch (error) {
    next(error);
  }
}));

// POST /api/v1/ai/classify-skill - Classify skill level using AI
router.post('/classify-skill', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { skill, context, evidence } = req.body;
    
    if (!skill) {
      return res.status(400).json({
        success: false,
        message: 'Skill is required'
      });
    }

    const classification = await aiService.classifySkillLevel(skill, {
      context: context || 'general',
      evidence: evidence || []
    });

    logger.info('Skill classified successfully', {
      skill,
      level: classification.level
    });

    res.json({
      success: true,
      data: classification
    });
  } catch (error) {
    next(error);
  }
}));

// POST /api/v1/ai/generate-recommendations - Generate learning recommendations
router.post('/generate-recommendations', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, gaps, preferences } = req.body;
    
    if (!user_id || !gaps) {
      return res.status(400).json({
        success: false,
        message: 'User ID and gaps are required'
      });
    }

    const recommendations = await aiService.generateLearningRecommendations(
      parseInt(user_id),
      gaps,
      {
        preferences: preferences || {}
      }
    );

    logger.info('Learning recommendations generated successfully', {
      userId: user_id,
      gapCount: gaps.length,
      recommendationCount: recommendations.length
    });

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/ai/model-status - Get AI model status
router.get('/model-status', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await aiService.getModelStatus();

    logger.info('AI model status retrieved successfully');

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    next(error);
  }
}));

// POST /api/v1/ai/retrain-model - Retrain AI model
router.post('/retrain-model', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { model_type, training_data } = req.body;
    
    const result = await aiService.retrainModel(model_type, {
      training_data: training_data || []
    });

    logger.info('AI model retraining initiated successfully', {
      modelType: model_type
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}));

export default router;
