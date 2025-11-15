import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateService } from '../middleware/auth';
import { TaxonomyService } from '../services/TaxonomyService';
import { TaxonomyRepository } from '../repositories/TaxonomyRepository';
import { ProfileService } from '../services/ProfileService';

const router = Router();
const taxonomyService = new TaxonomyService();
const taxonomyRepository = new TaxonomyRepository();
const profileService = new ProfileService();

// GET /api/rag/taxonomy - Get taxonomy data for RAG/Chatbot
router.get(
  '/taxonomy',
  authenticateService,
  asyncHandler(async (req, res) => {
    // Return taxonomy structure for RAG
    // This would typically return all competencies and skills in a structured format
    // For now, return a placeholder - would need a method to get full taxonomy
    
    res.json({
      success: true,
      data: {
        competencies: [],
        skills: [],
        message: 'Taxonomy endpoint - full implementation pending',
      },
      timestamp: new Date().toISOString(),
    });
  })
);

// GET /api/rag/user/:user_id/profile - Get user profile for RAG/Chatbot
router.get(
  '/user/:user_id/profile',
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

export default router;

