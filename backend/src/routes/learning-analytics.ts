import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateService } from '../middleware/auth';
import { ProfileService } from '../services/ProfileService';
import { ProfileRepository } from '../repositories/ProfileRepository';

const router = Router();
const profileService = new ProfileService();
const profileRepository = new ProfileRepository();

// GET /api/learning-analytics/user/:user_id - Get user profile for analytics
router.get(
  '/user/:user_id',
  authenticateService,
  asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const profile = await profileService.getUserProfile(user_id);

    res.json({
      success: true,
      data: profile,
      timestamp: new Date().toISOString(),
    });
  })
);

// GET /api/learning-analytics/team/:team_id - Get team competency status
router.get(
  '/team/:team_id',
  authenticateService,
  asyncHandler(async (req, res) => {
    const { team_id } = req.params;
    
    // Get all users in the team (simplified - would need team-user mapping)
    // For now, we'll return a placeholder structure
    // In production, this would query users by company_id or team_id
    
    // Placeholder response - would need team repository/service
    res.json({
      success: true,
      data: {
        team_id: team_id,
        total_users: 0,
        competencies_summary: {},
        aggregate_competency_status: {},
        timestamp: new Date().toISOString(),
      },
      message: 'Team analytics endpoint - implementation pending team-user mapping',
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;

