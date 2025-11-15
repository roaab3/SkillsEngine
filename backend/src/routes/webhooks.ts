import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateService } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import Joi from 'joi';
import { ProfileService } from '../services/ProfileService';
import { GapAnalysisService } from '../services/GapAnalysisService';

const router = Router();
const profileService = new ProfileService();
const gapAnalysisService = new GapAnalysisService();

// User creation webhook
const userCreationSchema = Joi.object({
  user_id: Joi.string().required(),
  user_name: Joi.string().required(),
  company_id: Joi.string().required(),
  employee_type: Joi.string().optional(),
  path_career: Joi.string().optional(),
  raw_data: Joi.string().optional(),
});

router.post(
  '/user-creation',
  authenticateService,
  validateRequest(userCreationSchema),
  asyncHandler(async (req, res) => {
    const userData = req.body;
    const profile = await profileService.createUserProfile(userData);

    res.status(202).json({
      status: 'received',
      user_id: userData.user_id,
      message: 'User creation event queued for processing',
      profile_url: `${process.env.FRONTEND_URL}/profile/${userData.user_id}`,
    });
  })
);

// Assessment results webhook
const assessmentResultSchema = Joi.object({
  user_id: Joi.string().required(),
  user_name: Joi.string().required(),
  exam_type: Joi.string().valid('baseline', 'post_course').required(),
  exam_status: Joi.string().valid('PASS', 'FAIL', 'completed').required(),
  course_name: Joi.string().optional(),
  skills: Joi.array().items(
    Joi.object({
      skill_id: Joi.string().required(),
      skill_name: Joi.string().required(),
      status: Joi.string().valid('PASS', 'FAIL').required(),
    })
  ).required(),
});

router.post(
  '/assessment-results',
  authenticateService,
  validateRequest(assessmentResultSchema),
  asyncHandler(async (req, res) => {
    const assessmentData = req.body;
    
    // Update verified skills
    await profileService.updateVerifiedSkills(
      assessmentData.user_id,
      assessmentData.skills,
      assessmentData.exam_type
    );

    // Perform gap analysis
    let gapAnalysis;
    if (assessmentData.exam_type === 'baseline' || assessmentData.exam_status === 'PASS') {
      gapAnalysis = await gapAnalysisService.performBroadGapAnalysis(
        assessmentData.user_id,
        assessmentData.exam_status
      );
    } else if (assessmentData.exam_type === 'post_course' && assessmentData.exam_status === 'FAIL') {
      gapAnalysis = await gapAnalysisService.performNarrowGapAnalysis(
        assessmentData.user_id,
        assessmentData.course_name!,
        assessmentData.exam_status
      );
    }

    res.status(202).json({
      status: 'received',
      exam_type: assessmentData.exam_type,
      user_id: assessmentData.user_id,
      message: 'Assessment results queued for processing',
    });
  })
);

export default router;

