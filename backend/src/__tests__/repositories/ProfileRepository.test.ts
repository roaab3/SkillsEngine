import { ProfileRepository } from '../../repositories/ProfileRepository';
import { mockPool, mockQueryResult } from '../mocks/database';
import { User, UserCompetency, VerifiedSkill } from '../../types';

describe('ProfileRepository', () => {
  let repository: ProfileRepository;

  beforeEach(() => {
    repository = new ProfileRepository();
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser: User = {
        user_id: 'user_123',
        user_name: 'John Doe',
        company_id: 'company_456',
        relevance_score: 75.50,
      };

      mockPool.query.mockResolvedValueOnce(mockQueryResult([mockUser]));

      const result = await repository.getUserById('user_123');

      expect(result).toEqual(mockUser);
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE user_id = $1',
        ['user_123']
      );
    });

    it('should return null when user not found', async () => {
      mockPool.query.mockResolvedValueOnce(mockQueryResult([]));

      const result = await repository.getUserById('user_999');

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create user in database', async () => {
      const user: User = {
        user_id: 'user_123',
        user_name: 'John Doe',
        company_id: 'company_456',
        employee_type: 'employee',
        path_career: 'Full Stack Developer',
        relevance_score: 0.00,
      };

      mockPool.query.mockResolvedValueOnce(mockQueryResult([]));

      await repository.createUser(user);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.arrayContaining([
          user.user_id,
          user.user_name,
          user.company_id,
        ])
      );
    });
  });

  describe('updateUser', () => {
    it('should update user fields', async () => {
      const updates = {
        user_name: 'Jane Doe',
        relevance_score: 85.00,
      };

      mockPool.query.mockResolvedValueOnce(mockQueryResult([]));

      await repository.updateUser('user_123', updates);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET'),
        expect.arrayContaining(['Jane Doe', 85.00, 'user_123'])
      );
    });
  });

  describe('updateRelevanceScore', () => {
    it('should update relevance score', async () => {
      mockPool.query.mockResolvedValueOnce(mockQueryResult([]));

      await repository.updateRelevanceScore('user_123', 85.50);

      expect(mockPool.query).toHaveBeenCalledWith(
        'UPDATE users SET relevance_score = $1 WHERE user_id = $2',
        [85.50, 'user_123']
      );
    });
  });

  describe('getUserCompetencies', () => {
    it('should return user competencies', async () => {
      const mockUserCompetencies: UserCompetency[] = [
        {
          user_id: 'user_123',
          competency_id: 'comp_123',
          coverage_percentage: 75.50,
          proficiency_level: 'ADVANCED',
          verifiedSkills: [],
        },
      ];

      mockPool.query.mockResolvedValueOnce(mockQueryResult(mockUserCompetencies));

      const result = await repository.getUserCompetencies('user_123');

      expect(result).toEqual(mockUserCompetencies);
    });
  });

  describe('getUserCompetency', () => {
    it('should return specific user competency', async () => {
      const mockUserCompetency: UserCompetency = {
        user_id: 'user_123',
        competency_id: 'comp_123',
        coverage_percentage: 75.50,
        proficiency_level: 'ADVANCED',
        verifiedSkills: [],
      };

      mockPool.query.mockResolvedValueOnce(mockQueryResult([mockUserCompetency]));

      const result = await repository.getUserCompetency('user_123', 'comp_123');

      expect(result).toEqual(mockUserCompetency);
    });
  });

  describe('createUserCompetency', () => {
    it('should create user competency', async () => {
      const userCompetency: UserCompetency = {
        user_id: 'user_123',
        competency_id: 'comp_123',
        coverage_percentage: 0.00,
        verifiedSkills: [],
      };

      mockPool.query.mockResolvedValueOnce(mockQueryResult([]));

      await repository.createUserCompetency(userCompetency);

      expect(mockPool.query).toHaveBeenCalled();
    });
  });

  describe('updateVerifiedSkills', () => {
    it('should update verified skills JSON', async () => {
      const verifiedSkills: VerifiedSkill[] = [
        {
          skill_id: 'skill_123',
          skill_name: 'React Hooks',
          verified: true,
          lastUpdate: '2025-01-27T10:00:00Z',
        },
      ];

      mockPool.query.mockResolvedValueOnce(mockQueryResult([]));

      await repository.updateVerifiedSkills('user_123', 'comp_123', verifiedSkills);

      expect(mockPool.query).toHaveBeenCalledWith(
        'UPDATE userCompetency SET verifiedSkills = $1::jsonb WHERE user_id = $2 AND competency_id = $3',
        [JSON.stringify(verifiedSkills), 'user_123', 'comp_123']
      );
    });
  });
});

