import request from 'supertest';
import express from 'express';
import { ProfileService } from '../../services/ProfileService';
import { GapAnalysisService } from '../../services/GapAnalysisService';
import { NotFoundError } from '../../utils/errors';
import frontendRoutes from '../../routes/frontend';

jest.mock('../../services/ProfileService');
jest.mock('../../services/GapAnalysisService');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/frontend', frontendRoutes);

describe('Frontend Routes', () => {
  let mockProfileService: jest.Mocked<ProfileService>;
  let mockGapAnalysisService: jest.Mocked<GapAnalysisService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockProfileService = {
      getUserProfile: jest.fn(),
      getUserProfileDetail: jest.fn(),
    } as any;

    mockGapAnalysisService = {
      performBroadGapAnalysis: jest.fn(),
      performNarrowGapAnalysis: jest.fn(),
    } as any;

    (ProfileService as jest.Mock).mockImplementation(() => mockProfileService);
    (GapAnalysisService as jest.Mock).mockImplementation(() => mockGapAnalysisService);
  });

  describe('GET /api/frontend/profile/:user_id', () => {
    it('should return user profile', async () => {
      const mockProfile = {
        user_id: 'user_123',
        user_name: 'John Doe',
        company_id: 'company_456',
        relevance_score: 75.50,
        competencies: [],
      };

      mockProfileService.getUserProfile.mockResolvedValueOnce(mockProfile as any);

      const response = await request(app)
        .get('/api/frontend/profile/user_123')
        .set('Authorization', 'Bearer token')
        .set('X-User-Id', 'user_123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toEqual(mockProfile);
    });

    it('should reject access to other user profile', async () => {
      mockProfileService.getUserProfile.mockRejectedValueOnce(new NotFoundError('Profile'));

      const response = await request(app)
        .get('/api/frontend/profile/user_999')
        .set('Authorization', 'Bearer token')
        .set('X-User-Id', 'user_123');

      expect(response.status).toBe(404);
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/api/frontend/profile/user_123');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/frontend/gap-analysis/:user_id', () => {
    it('should return broad gap analysis by default', async () => {
      const mockGapAnalysis = {
        user_id: 'user_123',
        user_name: 'John Doe',
        missing_skills_map: {},
      };

      mockGapAnalysisService.performBroadGapAnalysis.mockResolvedValueOnce(mockGapAnalysis as any);

      const response = await request(app)
        .get('/api/frontend/gap-analysis/user_123')
        .set('Authorization', 'Bearer token')
        .set('X-User-Id', 'user_123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(mockGapAnalysisService.performBroadGapAnalysis).toHaveBeenCalled();
    });

    it('should return narrow gap analysis when type specified', async () => {
      const mockGapAnalysis = {
        user_id: 'user_123',
        course_name: 'Advanced React',
        missing_skills_map: {},
      };

      mockGapAnalysisService.performNarrowGapAnalysis.mockResolvedValueOnce(mockGapAnalysis as any);

      const response = await request(app)
        .get('/api/frontend/gap-analysis/user_123?type=narrow&course_name=Advanced React')
        .set('Authorization', 'Bearer token')
        .set('X-User-Id', 'user_123');

      expect(response.status).toBe(200);
      expect(mockGapAnalysisService.performNarrowGapAnalysis).toHaveBeenCalledWith(
        'user_123',
        'Advanced React',
        'completed'
      );
    });
  });
});

