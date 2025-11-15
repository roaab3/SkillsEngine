import { ProfileService } from '../../services/ProfileService';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { TaxonomyRepository } from '../../repositories/TaxonomyRepository';
import { AIService } from '../../services/AIService';
import { NotFoundError } from '../../utils/errors';
import { User, UserCompetency, SkillResult } from '../../types';

jest.mock('../../repositories/ProfileRepository');
jest.mock('../../repositories/TaxonomyRepository');
jest.mock('../../services/AIService');

describe('ProfileService', () => {
  let service: ProfileService;
  let mockProfileRepository: jest.Mocked<ProfileRepository>;
  let mockTaxonomyRepository: jest.Mocked<TaxonomyRepository>;
  let mockAIService: jest.Mocked<AIService>;

  beforeEach(() => {
    mockProfileRepository = {
      getUserById: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      updateRelevanceScore: jest.fn(),
      getUserCompetencies: jest.fn(),
      getUserCompetency: jest.fn(),
      createUserCompetency: jest.fn(),
      updateUserCompetency: jest.fn(),
      updateVerifiedSkills: jest.fn(),
      getUserSkills: jest.fn(),
      createUserSkill: jest.fn(),
    } as any;

    mockTaxonomyRepository = {
      getAllMGSForCompetency: jest.fn(),
      getCompetencyById: jest.fn(),
      getL1SkillsForCompetency: jest.fn(),
    } as any;

    mockAIService = {
      extractSkillsFromData: jest.fn(),
      normalizeSkills: jest.fn(),
    } as any;

    (ProfileRepository as jest.Mock).mockImplementation(() => mockProfileRepository);
    (TaxonomyRepository as jest.Mock).mockImplementation(() => mockTaxonomyRepository);
    (AIService as jest.Mock).mockImplementation(() => mockAIService);

    service = new ProfileService();
  });

  describe('createUserProfile', () => {
    it('should create user profile', async () => {
      const userData: Partial<User> = {
        user_id: 'user_123',
        user_name: 'John Doe',
        company_id: 'company_456',
        employee_type: 'employee',
        path_career: 'Full Stack Developer',
      };

      const mockUser: User = {
        ...userData,
        relevance_score: 0.00,
      } as User;

      const mockUserCompetencies: UserCompetency[] = [];

      mockProfileRepository.createUser.mockResolvedValueOnce(undefined);
      mockProfileRepository.getUserById.mockResolvedValueOnce(mockUser);
      mockProfileRepository.getUserCompetencies.mockResolvedValueOnce(mockUserCompetencies);

      const result = await service.createUserProfile(userData);

      expect(result.user_id).toBe('user_123');
      expect(mockProfileRepository.createUser).toHaveBeenCalled();
    });

    it('should extract skills from raw data if provided', async () => {
      const userData: Partial<User> = {
        user_id: 'user_123',
        user_name: 'John Doe',
        company_id: 'company_456',
        raw_data: 'LinkedIn profile with React, Node.js experience',
      };

      const extracted = {
        competencies: ['Full Stack Development'],
        skills: ['React', 'Node.js'],
      };

      const normalized = ['react', 'nodejs'];

      mockAIService.extractSkillsFromData.mockResolvedValueOnce(extracted);
      mockAIService.normalizeSkills.mockResolvedValueOnce(normalized);
      mockProfileRepository.createUser.mockResolvedValueOnce(undefined);
      mockProfileRepository.getUserById.mockResolvedValueOnce({
        user_id: 'user_123',
        user_name: 'John Doe',
        company_id: 'company_456',
        relevance_score: 0.00,
      } as User);
      mockProfileRepository.getUserCompetencies.mockResolvedValueOnce([]);

      await service.createUserProfile(userData);

      expect(mockAIService.extractSkillsFromData).toHaveBeenCalledWith(userData.raw_data);
      expect(mockAIService.normalizeSkills).toHaveBeenCalled();
    });
  });

  describe('updateVerifiedSkills', () => {
    it('should update verified skills and recalculate coverage', async () => {
      const userId = 'user_123';
      const skills: SkillResult[] = [
        {
          skill_id: 'skill_123',
          skill_name: 'React Hooks',
          status: 'PASS',
        },
      ];

      const userCompetencies: UserCompetency[] = [
        {
          user_id: userId,
          competency_id: 'comp_123',
          coverage_percentage: 0.00,
          verifiedSkills: [],
        },
      ];

      const requiredMGS = [
        { skill_id: 'skill_123', skill_name: 'React Hooks' },
        { skill_id: 'skill_456', skill_name: 'Node.js' },
      ];

      mockProfileRepository.getUserCompetencies.mockResolvedValueOnce(userCompetencies);
      mockTaxonomyRepository.getAllMGSForCompetency.mockResolvedValueOnce(requiredMGS as any);
      mockProfileRepository.updateVerifiedSkills.mockResolvedValueOnce(undefined);
      mockProfileRepository.updateUserCompetency.mockResolvedValueOnce(undefined);
      mockProfileRepository.updateRelevanceScore.mockResolvedValueOnce(undefined);

      await service.updateVerifiedSkills(userId, skills, 'baseline');

      expect(mockProfileRepository.updateVerifiedSkills).toHaveBeenCalled();
      expect(mockProfileRepository.updateUserCompetency).toHaveBeenCalled();
    });
  });

  describe('calculateCoveragePercentage', () => {
    it('should calculate coverage percentage correctly', async () => {
      const userId = 'user_123';
      const competencyId = 'comp_123';

      const userComp: UserCompetency = {
        user_id: userId,
        competency_id: competencyId,
        coverage_percentage: 0.00,
        verifiedSkills: [
          {
            skill_id: 'skill_123',
            skill_name: 'React Hooks',
            verified: true,
            lastUpdate: '2025-01-27T10:00:00Z',
          },
        ],
      };

      const requiredMGS = [
        { skill_id: 'skill_123', skill_name: 'React Hooks' },
        { skill_id: 'skill_456', skill_name: 'Node.js' },
      ];

      mockProfileRepository.getUserCompetency.mockResolvedValueOnce(userComp);
      mockTaxonomyRepository.getAllMGSForCompetency.mockResolvedValueOnce(requiredMGS as any);
      mockProfileRepository.updateUserCompetency.mockResolvedValueOnce(undefined);

      const result = await service.calculateCoveragePercentage(userId, competencyId);

      expect(result).toBe(50); // 1 verified out of 2 required
      expect(mockProfileRepository.updateUserCompetency).toHaveBeenCalledWith(
        userId,
        competencyId,
        expect.objectContaining({
          coverage_percentage: 50,
          proficiency_level: 'INTERMEDIATE',
        })
      );
    });

    it('should return 0 when no required MGS', async () => {
      const userId = 'user_123';
      const competencyId = 'comp_123';

      const userComp: UserCompetency = {
        user_id: userId,
        competency_id: competencyId,
        coverage_percentage: 0.00,
        verifiedSkills: [],
      };

      mockProfileRepository.getUserCompetency.mockResolvedValueOnce(userComp);
      mockTaxonomyRepository.getAllMGSForCompetency.mockResolvedValueOnce([]);
      mockProfileRepository.updateUserCompetency.mockResolvedValueOnce(undefined);

      const result = await service.calculateCoveragePercentage(userId, competencyId);

      expect(result).toBe(0);
    });
  });

  describe('mapProficiencyLevel', () => {
    it('should map coverage to BEGINNER', () => {
      expect(service.mapProficiencyLevel(15)).toBe('BEGINNER');
      expect(service.mapProficiencyLevel(30)).toBe('BEGINNER');
    });

    it('should map coverage to INTERMEDIATE', () => {
      expect(service.mapProficiencyLevel(31)).toBe('INTERMEDIATE');
      expect(service.mapProficiencyLevel(50)).toBe('INTERMEDIATE');
      expect(service.mapProficiencyLevel(65)).toBe('INTERMEDIATE');
    });

    it('should map coverage to ADVANCED', () => {
      expect(service.mapProficiencyLevel(66)).toBe('ADVANCED');
      expect(service.mapProficiencyLevel(75)).toBe('ADVANCED');
      expect(service.mapProficiencyLevel(85)).toBe('ADVANCED');
    });

    it('should map coverage to EXPERT', () => {
      expect(service.mapProficiencyLevel(86)).toBe('EXPERT');
      expect(service.mapProficiencyLevel(100)).toBe('EXPERT');
    });
  });

  describe('calculateRelevanceScore', () => {
    it('should calculate relevance score based on verified MGS', async () => {
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
              skill_id: 'skill_123',
              skill_name: 'React Hooks',
              verified: true,
              lastUpdate: '2025-01-27T10:00:00Z',
            },
          ],
        },
      ];

      const requiredMGS = [
        { skill_id: 'skill_123', skill_name: 'React Hooks' },
        { skill_id: 'skill_456', skill_name: 'Node.js' },
      ];

      mockProfileRepository.getUserById.mockResolvedValueOnce(user);
      mockProfileRepository.getUserCompetencies.mockResolvedValueOnce(userCompetencies);
      mockTaxonomyRepository.getAllMGSForCompetency.mockResolvedValueOnce(requiredMGS as any);
      mockProfileRepository.updateRelevanceScore.mockResolvedValueOnce(undefined);

      const result = await service.calculateRelevanceScore(userId);

      expect(result).toBe(50); // 1 verified out of 2 required
      expect(mockProfileRepository.updateRelevanceScore).toHaveBeenCalledWith(userId, 50);
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile with competencies', async () => {
      const userId = 'user_123';
      const user: User = {
        user_id: userId,
        user_name: 'John Doe',
        company_id: 'company_456',
        relevance_score: 75.50,
      };

      const userCompetencies: UserCompetency[] = [
        {
          user_id: userId,
          competency_id: 'comp_123',
          coverage_percentage: 75.50,
          proficiency_level: 'ADVANCED',
          verifiedSkills: [],
        },
      ];

      const competency = {
        competency_id: 'comp_123',
        competency_name: 'Full Stack Development',
      };

      const l1Skills = [{ skill_id: 'skill_1', skill_name: 'Frontend Development' }];
      const requiredMGS = [
        { skill_id: 'skill_1', skill_name: 'Frontend Development' },
        { skill_id: 'skill_2', skill_name: 'Backend Development' },
      ];

      mockProfileRepository.getUserById.mockResolvedValueOnce(user);
      mockProfileRepository.getUserCompetencies.mockResolvedValueOnce(userCompetencies);
      mockTaxonomyRepository.getCompetencyById.mockResolvedValueOnce(competency as any);
      mockTaxonomyRepository.getL1SkillsForCompetency.mockResolvedValueOnce(l1Skills as any);
      mockTaxonomyRepository.getAllMGSForCompetency.mockResolvedValueOnce(requiredMGS as any);

      const result = await service.getUserProfile(userId);

      expect(result.user_id).toBe(userId);
      expect(result.competencies).toHaveLength(1);
      expect(result.competencies[0].competency_id).toBe('comp_123');
    });

    it('should throw NotFoundError when user not found', async () => {
      mockProfileRepository.getUserById.mockResolvedValueOnce(null);

      await expect(service.getUserProfile('user_999')).rejects.toThrow(NotFoundError);
    });
  });
});

