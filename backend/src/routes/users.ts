import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateService, authenticateUser } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import Joi from 'joi';
import { ProfileService } from '../services/ProfileService';
import { NotFoundError } from '../utils/errors';

const router = Router();
const profileService = new ProfileService();

// Create user schema
const createUserSchema = Joi.object({
  user_id: Joi.string().required(),
  user_name: Joi.string().required(),
  company_id: Joi.string().required(),
  employee_type: Joi.string().optional(),
  path_career: Joi.string().optional(),
  raw_data: Joi.string().optional(),
});

// Update user schema (full update)
const updateUserSchema = Joi.object({
  user_name: Joi.string().optional(),
  company_id: Joi.string().optional(),
  employee_type: Joi.string().optional(),
  path_career: Joi.string().optional(),
  raw_data: Joi.string().optional(),
  relevance_score: Joi.number().optional(),
});

// Partial update schema (same as full, but all fields optional)
const patchUserSchema = Joi.object({
  user_name: Joi.string().optional(),
  company_id: Joi.string().optional(),
  employee_type: Joi.string().optional(),
  path_career: Joi.string().optional(),
  raw_data: Joi.string().optional(),
  relevance_score: Joi.number().optional(),
});

// POST /api/users - Create new user
router.post(
  '/',
  authenticateService,
  validateRequest(createUserSchema),
  asyncHandler(async (req, res) => {
    const userData = req.body;
    const profile = await profileService.createUserProfile(userData);

    res.status(201).json({
      user_id: userData.user_id,
      status: 'created',
      profile_url: `${process.env.FRONTEND_URL || 'https://skills-engine.educora.ai'}/profile/${userData.user_id}`,
      timestamp: new Date().toISOString(),
    });
  })
);

// GET /api/users/:user_id/profile - Get user profile
router.get(
  '/:user_id/profile',
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

// PUT /api/users/:user_id/profile - Full update of user profile
router.put(
  '/:user_id/profile',
  authenticateUser,
  validateRequest(updateUserSchema),
  asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    
    // Verify user can only update their own profile (skip in development)
    const nodeEnv = process.env.NODE_ENV || 'development';
    if (nodeEnv !== 'development' && req.userId !== user_id) {
      throw new NotFoundError('Profile');
    }

    // Get existing user to merge with updates
    const existingProfile = await profileService.getUserProfile(user_id);
    const updatedData = {
      ...existingProfile,
      ...req.body,
      user_id, // Ensure user_id is not changed
    };

    // Update user profile (would need updateUserProfile method in ProfileService)
    // For now, we'll use the repository directly
    const { ProfileRepository } = await import('../repositories/ProfileRepository');
    const profileRepository = new ProfileRepository();
    await profileRepository.updateUser(user_id, req.body);

    const updatedProfile = await profileService.getUserProfile(user_id);
    
    res.json({
      success: true,
      data: updatedProfile,
      timestamp: new Date().toISOString(),
    });
  })
);

// PATCH /api/users/:user_id/profile - Partial update of user profile
router.patch(
  '/:user_id/profile',
  authenticateUser,
  validateRequest(patchUserSchema),
  asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    
    // Verify user can only update their own profile (skip in development)
    const nodeEnv = process.env.NODE_ENV || 'development';
    if (nodeEnv !== 'development' && req.userId !== user_id) {
      throw new NotFoundError('Profile');
    }

    // Update user profile
    const { ProfileRepository } = await import('../repositories/ProfileRepository');
    const profileRepository = new ProfileRepository();
    await profileRepository.updateUser(user_id, req.body);

    const updatedProfile = await profileService.getUserProfile(user_id);
    
    res.json({
      success: true,
      data: updatedProfile,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;

