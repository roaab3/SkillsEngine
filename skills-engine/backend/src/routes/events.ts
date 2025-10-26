import { Router, Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { EventService } from '../services/eventService';
import { publishEvent } from '../config/kafka';

const router = Router();
const eventService = new EventService();

// POST /api/v1/events/user-created - Handle user created event
router.post('/user-created', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, user_data } = req.body;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    await eventService.handleUserCreatedEvent(parseInt(user_id), user_data);

    logger.info('User created event processed successfully', { userId: user_id });

    res.json({
      success: true,
      message: 'User created event processed successfully'
    });
  } catch (error) {
    next(error);
  }
}));

// POST /api/v1/events/assessment-completed - Handle assessment completed event
router.post('/assessment-completed', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, assessment_id, results } = req.body;
    
    if (!user_id || !assessment_id || !results) {
      return res.status(400).json({
        success: false,
        message: 'User ID, assessment ID, and results are required'
      });
    }

    const processedResults = await eventService.handleAssessmentCompletedEvent(
      parseInt(user_id),
      parseInt(assessment_id),
      results
    );

    // Publish skill verification event
    await publishEvent('skill-verified', {
      user_id: parseInt(user_id),
      assessment_id: parseInt(assessment_id),
      verified_skills: processedResults.verified_skills,
      updated_competencies: processedResults.updated_competencies
    });

    logger.info('Assessment completed event processed successfully', {
      userId: user_id,
      assessmentId: assessment_id
    });

    res.json({
      success: true,
      data: processedResults
    });
  } catch (error) {
    next(error);
  }
}));

// POST /api/v1/events/skill-verified - Handle skill verified event
router.post('/skill-verified', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, skill_id, verification_data } = req.body;
    
    if (!user_id || !skill_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID and skill ID are required'
      });
    }

    await eventService.handleSkillVerifiedEvent(
      parseInt(user_id),
      parseInt(skill_id),
      verification_data
    );

    logger.info('Skill verified event processed successfully', {
      userId: user_id,
      skillId: skill_id
    });

    res.json({
      success: true,
      message: 'Skill verified event processed successfully'
    });
  } catch (error) {
    next(error);
  }
}));

// POST /api/v1/events/competency-updated - Handle competency updated event
router.post('/competency-updated', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, competency_id, level, completion_percentage } = req.body;
    
    if (!user_id || !competency_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID and competency ID are required'
      });
    }

    await eventService.handleCompetencyUpdatedEvent(
      parseInt(user_id),
      parseInt(competency_id),
      {
        level,
        completion_percentage
      }
    );

    // Publish profile updated event
    await publishEvent('profile-updated', {
      user_id: parseInt(user_id),
      competency_id: parseInt(competency_id),
      level,
      completion_percentage
    });

    logger.info('Competency updated event processed successfully', {
      userId: user_id,
      competencyId: competency_id
    });

    res.json({
      success: true,
      message: 'Competency updated event processed successfully'
    });
  } catch (error) {
    next(error);
  }
}));

// GET /api/v1/events/:user_id/history - Get user event history
router.get('/:user_id/history', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 10, event_type } = req.query;
    
    const events = await eventService.getUserEventHistory(parseInt(user_id), {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      event_type: event_type as string
    });

    logger.info('User event history retrieved successfully', {
      userId: user_id,
      count: events.data.length
    });

    res.json({
      success: true,
      data: events.data,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: events.total,
        pages: Math.ceil(events.total / parseInt(limit as string))
      }
    });
  } catch (error) {
    next(error);
  }
}));

// POST /api/v1/events/publish - Publish custom event
router.post('/publish', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topic, message } = req.body;
    
    if (!topic || !message) {
      return res.status(400).json({
        success: false,
        message: 'Topic and message are required'
      });
    }

    await publishEvent(topic, message);

    logger.info('Custom event published successfully', { topic });

    res.json({
      success: true,
      message: 'Event published successfully'
    });
  } catch (error) {
    next(error);
  }
}));

export default router;
