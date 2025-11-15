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

// Assessment results schema
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

// POST /api/assessment/results - Receive assessment results and update user profile
router.post(
  '/results',
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

    // Perform gap analysis if needed
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

    // Get updated profile to count verified skills
    const profile = await profileService.getUserProfile(assessmentData.user_id);
    const verifiedSkillsCount = profile.competencies.reduce(
      (sum, comp) => sum + (comp.verified_skills_count || 0),
      0
    );

    res.status(200).json({
      user_id: assessmentData.user_id,
      status: 'updated',
      verified_skills_count: verifiedSkillsCount,
      profile_updated: true,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;

