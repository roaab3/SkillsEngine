import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateUser } from '../middleware/auth';
import { ProfileService } from '../services/ProfileService';
import { GapAnalysisService } from '../services/GapAnalysisService';
import { NotFoundError } from '../utils/errors';
import fs from 'fs';
import path from 'path';

const router = Router();
const profileService = new ProfileService();
const gapAnalysisService = new GapAnalysisService();

// Get user profile
router.get(
  '/profile/:user_id',
  authenticateUser,
  asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    
    // Verify user can only access their own profile (skip in development)
    const nodeEnv = process.env.NODE_ENV || 'development';
    if (nodeEnv !== 'development' && req.userId !== user_id) {
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
    
    const nodeEnv = process.env.NODE_ENV || 'development';
    if (nodeEnv !== 'development' && req.userId !== user_id) {
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
    
    const nodeEnv = process.env.NODE_ENV || 'development';
    if (nodeEnv !== 'development' && req.userId !== user_id) {
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

// Get mock profile data from JSON file
router.get(
  '/mock/profile',
  asyncHandler(async (req, res) => {
    try {
      // After build, __dirname is dist/src/routes, so we need to go up 2 levels to backend root
      const mockDataPath = path.join(__dirname, '../../mockdata/userProfile.json');
      if (fs.existsSync(mockDataPath)) {
        const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));
        // Ensure numeric fields are numbers, not strings
        const normalizedData = {
          ...mockData,
          relevance_score: typeof mockData.relevance_score === 'string' 
            ? parseFloat(mockData.relevance_score) 
            : mockData.relevance_score,
          competencies: mockData.competencies?.map((comp: any) => ({
            ...comp,
            coverage_percentage: typeof comp.coverage_percentage === 'string' 
              ? parseFloat(comp.coverage_percentage) 
              : comp.coverage_percentage,
          })) || [],
        };
        res.json({
          success: true,
          data: normalizedData,
          timestamp: new Date().toISOString(),
        });
      } else {
        throw new NotFoundError('Mock profile data');
      }
    } catch (error) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NotFoundError',
          message: 'Mock profile data not found',
        },
      });
    }
  })
);

export default router;

