import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateService } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import Joi from 'joi';
import { ProfileService } from '../services/ProfileService';
import { ProfileRepository } from '../repositories/ProfileRepository';

const router = Router();
const profileService = new ProfileService();
const profileRepository = new ProfileRepository();

// Update profile schema (from Directory)
const updateProfileSchema = Joi.object({
  user_id: Joi.string().required(),
  user_name: Joi.string().optional(),
  company_id: Joi.string().optional(),
  competencies: Joi.array().optional(),
  relevance_score: Joi.number().optional(),
  secure_profile_url: Joi.string().optional(),
  timestamp: Joi.string().optional(),
}).unknown(true); // Allow additional fields

// GET /api/directory/profile/:user_id - Retrieve user profile for Directory microservice
router.get(
  '/profile/:user_id',
  authenticateService,
  asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const profile = await profileService.getUserProfile(user_id);

    res.json({
      success: true,
      data: {
        ...profile,
        secure_profile_url: `${process.env.FRONTEND_URL || 'https://skills-engine.educora.ai'}/profile/${user_id}`,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  })
);

// POST /api/directory/profile/update - Receive updated profile from Directory after exam
router.post(
  '/profile/update',
  authenticateService,
  validateRequest(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const profileData = req.body;
    
    // Update user profile if needed
    if (profileData.user_name || profileData.company_id || profileData.relevance_score !== undefined) {
      await profileRepository.updateUser(profileData.user_id, {
        user_name: profileData.user_name,
        company_id: profileData.company_id,
        relevance_score: profileData.relevance_score,
      });
    }

    // Get updated profile
    const updatedProfile = await profileService.getUserProfile(profileData.user_id);

    res.json({
      status: 'received',
      user_id: profileData.user_id,
      message: 'Profile update received and processed',
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;

