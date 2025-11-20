/**
 * Unit Tests for Skill Service
 */

const skillService = require('../../../src/services/skillService');
const skillRepository = require('../../../src/repositories/skillRepository');

// Mock the repository
jest.mock('../../../src/repositories/skillRepository');

describe('Skill Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSkill', () => {
    it('should create a skill successfully', async () => {
      const skillData = {
        skill_id: 'skill_123',
        skill_name: 'JavaScript',
        parent_skill_id: null,
        description: 'Programming language'
      };

      skillRepository.findById.mockResolvedValue(null);
      skillRepository.create.mockResolvedValue({
        skill_id: 'skill_123',
        skill_name: 'JavaScript',
        parent_skill_id: null,
        description: 'Programming language'
      });

      const result = await skillService.createSkill(skillData);
      expect(result).toBeDefined();
      expect(skillRepository.create).toHaveBeenCalled();
    });

    it('should throw error if parent skill does not exist', async () => {
      const skillData = {
        skill_id: 'skill_123',
        skill_name: 'JavaScript',
        parent_skill_id: 'parent_456',
        description: 'Programming language'
      };

      skillRepository.findById.mockResolvedValue(null);

      await expect(skillService.createSkill(skillData)).rejects.toThrow();
    });
  });

  describe('getMGS', () => {
    it('should get MGS for a root skill', async () => {
      const rootSkillId = 'skill_123';
      const mockMGS = [
        { skill_id: 'mgs_1', skill_name: 'MGS 1' },
        { skill_id: 'mgs_2', skill_name: 'MGS 2' }
      ];

      skillRepository.findById.mockResolvedValue({
        skill_id: rootSkillId,
        isRoot: () => true
      });
      skillRepository.findMGS.mockResolvedValue(mockMGS);

      const result = await skillService.getMGS(rootSkillId);
      expect(result).toEqual(mockMGS);
      expect(skillRepository.findMGS).toHaveBeenCalledWith(rootSkillId);
    });
  });
});

