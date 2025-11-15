import { GapAnalysisService } from '../../services/GapAnalysisService';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { TaxonomyRepository } from '../../repositories/TaxonomyRepository';
import { NotFoundError } from '../../utils/errors';
import { User, UserCompetency } from '../../types';

jest.mock('../../repositories/ProfileRepository');
jest.mock('../../repositories/TaxonomyRepository');

describe('GapAnalysisService', () => {
  let service: GapAnalysisService;
  let mockProfileRepository: jest.Mocked<ProfileRepository>;
  let mockTaxonomyRepository: jest.Mocked<TaxonomyRepository>;

  beforeEach(() => {
    mockProfileRepository = {
      getUserById: jest.fn(),
      getUserCompetencies: jest.fn(),
      getUserCompetency: jest.fn(),
    } as any;

    mockTaxonomyRepository = {
      getCompetencyByName: jest.fn(),
      getAllMGSForCompetency: jest.fn(),
      getCompetencyById: jest.fn(),
    } as any;

    (ProfileRepository as jest.Mock).mockImplementation(() => mockProfileRepository);
    (TaxonomyRepository as jest.Mock).mockImplementation(() => mockTaxonomyRepository);

    service = new GapAnalysisService();
  });

  describe('performNarrowGapAnalysis', () => {
    it('should perform narrow gap analysis for course', async () => {
      const userId = 'user_123';
      const courseName = 'Advanced React';
      const user: User = {
        user_id: userId,
        user_name: 'John Doe',
        company_id: 'company_456',
        relevance_score: 0.00,
      };

      const competency = {
        competency_id: 'comp_123',
        competency_name: courseName,
      };

      const requiredMGS = [
        { skill_id: 'skill_1', skill_name: 'React Hooks' },
        { skill_id: 'skill_2', skill_name: 'React Context' },
        { skill_id: 'skill_3', skill_name: 'React Router' },
      ];

      const userComp: UserCompetency = {
        user_id: userId,
        competency_id: 'comp_123',
        coverage_percentage: 33.33,
        verifiedSkills: [
          {
            skill_id: 'skill_1',
            skill_name: 'React Hooks',
            verified: true,
            lastUpdate: '2025-01-27T10:00:00Z',
          },
        ],
      };

      mockProfileRepository.getUserById.mockResolvedValueOnce(user);
      mockTaxonomyRepository.getCompetencyByName.mockResolvedValueOnce(competency as any);
      mockTaxonomyRepository.getAllMGSForCompetency.mockResolvedValueOnce(requiredMGS as any);
      mockProfileRepository.getUserCompetency.mockResolvedValueOnce(userComp);

      const result = await service.performNarrowGapAnalysis(userId, courseName, 'FAIL');

      expect(result.user_id).toBe(userId);
      expect(result.course_name).toBe(courseName);
      expect(result.exam_type).toBe('post_course');
      expect(result.missing_skills_map).toHaveProperty('comp_123');
      expect(result.missing_skills_map['comp_123'].missing_mgs).toHaveLength(2); // skill_2 and skill_3
    });

    it('should throw NotFoundError when user not found', async () => {
      mockProfileRepository.getUserById.mockResolvedValueOnce(null);

      await expect(
        service.performNarrowGapAnalysis('user_999', 'Course', 'FAIL')
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when competency not found', async () => {
      const user: User = {
        user_id: 'user_123',
        user_name: 'John Doe',
        company_id: 'company_456',
        relevance_score: 0.00,
      };

      mockProfileRepository.getUserById.mockResolvedValueOnce(user);
      mockTaxonomyRepository.getCompetencyByName.mockResolvedValueOnce(null);

      await expect(
        service.performNarrowGapAnalysis('user_123', 'Non-existent Course', 'FAIL')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('performBroadGapAnalysis', () => {
    it('should perform broad gap analysis for career path', async () => {
      const userId = 'user_123';
      const user: User = {
        user_id: userId,
        user_name: 'John Doe',
        company_id: 'company_456',
        path_career: 'Full Stack Developer',
        relevance_score: 0.00,
      };

      const userCompetencies: UserCompetency[] = [
        {
          user_id: userId,
          competency_id: 'comp_123',
          coverage_percentage: 50.00,
          verifiedSkills: [
            {
              skill_id: 'skill_1',
              skill_name: 'React Hooks',
              verified: true,
              lastUpdate: '2025-01-27T10:00:00Z',
            },
          ],
        },
      ];

      const competency = {
        competency_id: 'comp_123',
        competency_name: 'Full Stack Development',
      };

      const requiredMGS = [
        { skill_id: 'skill_1', skill_name: 'React Hooks' },
        { skill_id: 'skill_2', skill_name: 'Node.js' },
        { skill_id: 'skill_3', skill_name: 'PostgreSQL' },
      ];

      mockProfileRepository.getUserById.mockResolvedValueOnce(user);
      mockProfileRepository.getUserCompetencies.mockResolvedValueOnce(userCompetencies);
      mockTaxonomyRepository.getAllMGSForCompetency.mockResolvedValueOnce(requiredMGS as any);
      mockTaxonomyRepository.getCompetencyById.mockResolvedValueOnce(competency as any);

      const result = await service.performBroadGapAnalysis(userId, 'PASS');

      expect(result.user_id).toBe(userId);
      expect(result.career_path_goal).toBe('Full Stack Developer');
      expect(result.exam_type).toBe('baseline');
      expect(result.missing_skills_map).toHaveProperty('comp_123');
      expect(result.missing_skills_map['comp_123'].missing_mgs).toHaveLength(2); // skill_2 and skill_3
    });

    it('should return empty missing skills when no career path', async () => {
      const user: User = {
        user_id: 'user_123',
        user_name: 'John Doe',
        company_id: 'company_456',
        relevance_score: 0.00,
      };

      mockProfileRepository.getUserById.mockResolvedValueOnce(user);
      mockProfileRepository.getUserCompetencies.mockResolvedValueOnce([]);

      const result = await service.performBroadGapAnalysis('user_123', 'PASS');

      expect(result.missing_skills_map).toEqual({});
      expect(result.career_path_goal).toBeUndefined();
    });

    it('should throw NotFoundError when user not found', async () => {
      mockProfileRepository.getUserById.mockResolvedValueOnce(null);

      await expect(
        service.performBroadGapAnalysis('user_999', 'PASS')
      ).rejects.toThrow(NotFoundError);
    });
  });
});

