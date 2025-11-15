import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateUser } from '../middleware/auth';
import { ProfileService } from '../services/ProfileService';
import { GapAnalysisService } from '../services/GapAnalysisService';
import { NotFoundError } from '../utils/errors';

const router = Router();
const profileService = new ProfileService();
const gapAnalysisService = new GapAnalysisService();

// Get user profile
router.get(
  '/profile/:user_id',
  authenticateUser,
  asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    
    // Verify user can only access their own profile
    if (req.userId !== user_id) {
      throw new NotFoundError('Profile');
    }

    const profile = await profileService.getUserProfile(user_id);
    
    res.json({
      success: true,
      data: profile,
      timestamp: new Date().toISOString(),
    });
  })
);

// Get detailed profile
router.get(
  '/profile/:user_id/detail',
  authenticateUser,
  asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    
    if (req.userId !== user_id) {
      throw new NotFoundError('Profile');
    }

    const profile = await profileService.getUserProfileDetail(user_id);
    
    res.json({
      success: true,
      data: profile,
      timestamp: new Date().toISOString(),
    });
  })
);

// Get gap analysis
router.get(
  '/gap-analysis/:user_id',
  authenticateUser,
  asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const { type, course_name } = req.query;
    
    if (req.userId !== user_id) {
      throw new NotFoundError('Gap analysis');
    }

    let gapAnalysis;
    if (type === 'narrow' && course_name) {
      gapAnalysis = await gapAnalysisService.performNarrowGapAnalysis(
        user_id,
        course_name as string,
        'completed'
      );
    } else {
      gapAnalysis = await gapAnalysisService.performBroadGapAnalysis(
        user_id,
        'completed'
      );
    }
    
    res.json({
      success: true,
      data: gapAnalysis,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;

