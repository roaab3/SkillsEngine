import request from 'supertest';
import express from 'express';
import { ProfileService } from '../../services/ProfileService';
import { GapAnalysisService } from '../../services/GapAnalysisService';
import webhookRoutes from '../../routes/webhooks';

jest.mock('../../services/ProfileService');
jest.mock('../../services/GapAnalysisService');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/webhooks', webhookRoutes);

describe('Webhook Routes', () => {
  let mockProfileService: jest.Mocked<ProfileService>;
  let mockGapAnalysisService: jest.Mocked<GapAnalysisService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockProfileService = {
      createUserProfile: jest.fn(),
      updateVerifiedSkills: jest.fn(),
    } as any;

    mockGapAnalysisService = {
      performBroadGapAnalysis: jest.fn(),
      performNarrowGapAnalysis: jest.fn(),
    } as any;

    (ProfileService as jest.Mock).mockImplementation(() => mockProfileService);
    (GapAnalysisService as jest.Mock).mockImplementation(() => mockGapAnalysisService);
  });

  describe('POST /api/webhooks/user-creation', () => {
    it('should accept user creation webhook', async () => {
      const userData = {
        user_id: 'user_123',
        user_name: 'John Doe',
        company_id: 'company_456',
        employee_type: 'employee',
        path_career: 'Full Stack Developer',
      };

      mockProfileService.createUserProfile.mockResolvedValueOnce({
        user_id: 'user_123',
        user_name: 'John Doe',
        company_id: 'company_456',
        relevance_score: 0.00,
        competencies: [],
      } as any);

      const response = await request(app)
        .post('/api/webhooks/user-creation')
        .set('X-Service-Id', 'directory')
        .send(userData);

      expect(response.status).toBe(202);
      expect(response.body).toHaveProperty('status', 'received');
      expect(response.body).toHaveProperty('user_id', 'user_123');
      expect(mockProfileService.createUserProfile).toHaveBeenCalledWith(userData);
    });

    it('should reject request without service ID', async () => {
      const response = await request(app)
        .post('/api/webhooks/user-creation')
        .send({ user_id: 'user_123' });

      expect(response.status).toBe(401);
    });

    it('should validate request body', async () => {
      const response = await request(app)
        .post('/api/webhooks/user-creation')
        .set('X-Service-Id', 'directory')
        .send({}); // Missing required fields

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/webhooks/assessment-results', () => {
    it('should accept baseline assessment results', async () => {
      const assessmentData = {
        user_id: 'user_123',
        user_name: 'John Doe',
        exam_type: 'baseline',
        exam_status: 'PASS',
        skills: [
          {
            skill_id: 'skill_123',
            skill_name: 'React Hooks',
            status: 'PASS',
          },
        ],
      };

      mockProfileService.updateVerifiedSkills.mockResolvedValueOnce(undefined);
      mockGapAnalysisService.performBroadGapAnalysis.mockResolvedValueOnce({
        user_id: 'user_123',
        missing_skills_map: {},
      } as any);

      const response = await request(app)
        .post('/api/webhooks/assessment-results')
        .set('X-Service-Id', 'assessment')
        .send(assessmentData);

      expect(response.status).toBe(202);
      expect(response.body).toHaveProperty('status', 'received');
      expect(mockProfileService.updateVerifiedSkills).toHaveBeenCalled();
      expect(mockGapAnalysisService.performBroadGapAnalysis).toHaveBeenCalled();
    });

    it('should accept post-course assessment results with FAIL status', async () => {
      const assessmentData = {
        user_id: 'user_123',
        user_name: 'John Doe',
        exam_type: 'post_course',
        exam_status: 'FAIL',
        course_name: 'Advanced React',
        skills: [
          {
            skill_id: 'skill_123',
            skill_name: 'React Hooks',
            status: 'FAIL',
          },
        ],
      };

      mockProfileService.updateVerifiedSkills.mockResolvedValueOnce(undefined);
      mockGapAnalysisService.performNarrowGapAnalysis.mockResolvedValueOnce({
        user_id: 'user_123',
        missing_skills_map: {},
      } as any);

      const response = await request(app)
        .post('/api/webhooks/assessment-results')
        .set('X-Service-Id', 'assessment')
        .send(assessmentData);

      expect(response.status).toBe(202);
      expect(mockGapAnalysisService.performNarrowGapAnalysis).toHaveBeenCalledWith(
        'user_123',
        'Advanced React',
        'FAIL'
      );
    });
  });
});

