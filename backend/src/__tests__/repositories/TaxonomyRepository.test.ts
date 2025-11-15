import { TaxonomyRepository } from '../../repositories/TaxonomyRepository';
import { mockPool, mockQueryResult } from '../mocks/database';
import { Skill, Competency } from '../../types';

describe('TaxonomyRepository', () => {
  let repository: TaxonomyRepository;

  beforeEach(() => {
    repository = new TaxonomyRepository();
    jest.clearAllMocks();
  });

  describe('getCompetencyById', () => {
    it('should return competency when found', async () => {
      const mockCompetency: Competency = {
        competency_id: 'comp_123',
        competency_name: 'Full Stack Development',
        description: 'Test competency',
      };

      mockPool.query.mockResolvedValueOnce(mockQueryResult([mockCompetency]));

      const result = await repository.getCompetencyById('comp_123');

      expect(result).toEqual(mockCompetency);
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM competencies WHERE competency_id = $1',
        ['comp_123']
      );
    });

    it('should return null when competency not found', async () => {
      mockPool.query.mockResolvedValueOnce(mockQueryResult([]));

      const result = await repository.getCompetencyById('comp_999');

      expect(result).toBeNull();
    });

    it('should throw DatabaseError on query failure', async () => {
      const error = new Error('Database connection failed');
      mockPool.query.mockRejectedValueOnce(error);

      await expect(repository.getCompetencyById('comp_123')).rejects.toThrow('Failed to get competency');
    });
  });

  describe('getCompetencyByName', () => {
    it('should return competency when found by name', async () => {
      const mockCompetency: Competency = {
        competency_id: 'comp_123',
        competency_name: 'Full Stack Development',
      };

      mockPool.query.mockResolvedValueOnce(mockQueryResult([mockCompetency]));

      const result = await repository.getCompetencyByName('Full Stack Development');

      expect(result).toEqual(mockCompetency);
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM competencies WHERE LOWER(TRIM(competency_name)) = LOWER(TRIM($1))',
        ['Full Stack Development']
      );
    });
  });

  describe('getSkillById', () => {
    it('should return skill when found', async () => {
      const mockSkill: Skill = {
        skill_id: 'skill_123',
        skill_name: 'React Hooks',
        description: 'Test skill',
      };

      mockPool.query.mockResolvedValueOnce(mockQueryResult([mockSkill]));

      const result = await repository.getSkillById('skill_123');

      expect(result).toEqual(mockSkill);
    });
  });

  describe('getL1SkillsForCompetency', () => {
    it('should return L1 skills for competency', async () => {
      const mockSkills: Skill[] = [
        { skill_id: 'skill_1', skill_name: 'Frontend Development' },
        { skill_id: 'skill_2', skill_name: 'Backend Development' },
      ];

      mockPool.query.mockResolvedValueOnce(mockQueryResult(mockSkills));

      const result = await repository.getL1SkillsForCompetency('comp_123');

      expect(result).toEqual(mockSkills);
      expect(result.length).toBe(2);
    });
  });

  describe('getMGSForCompetency', () => {
    it('should return MGS using the view', async () => {
      const mockMGS: Skill[] = [
        { skill_id: 'skill_1', skill_name: 'React Hooks' },
        { skill_id: 'skill_2', skill_name: 'useState' },
      ];

      mockPool.query.mockResolvedValueOnce(mockQueryResult(mockMGS));

      const result = await repository.getMGSForCompetency('comp_123');

      expect(result).toEqual(mockMGS);
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT skill_id, skill_name FROM competency_leaf_skills WHERE competency_id = $1',
        ['comp_123']
      );
    });
  });

  describe('getAllMGSForCompetency', () => {
    it('should return all MGS through recursive traversal', async () => {
      const l1Skills: Skill[] = [
        { skill_id: 'skill_1', skill_name: 'Frontend Development' },
      ];

      const childSkills: Skill[] = [
        { skill_id: 'skill_2', skill_name: 'React Hooks' },
      ];

      const mgs: Skill[] = [
        { skill_id: 'skill_3', skill_name: 'useState' },
      ];

      // Mock getL1SkillsForCompetency
      mockPool.query
        .mockResolvedValueOnce(mockQueryResult(l1Skills)) // getL1SkillsForCompetency
        .mockResolvedValueOnce(mockQueryResult(childSkills)) // getChildSkills for skill_1
        .mockResolvedValueOnce(mockQueryResult(mgs)) // getChildSkills for skill_2
        .mockResolvedValueOnce(mockQueryResult([])) // getChildSkills for skill_3 (leaf)
        .mockResolvedValueOnce(mockQueryResult([{ skill_id: 'skill_3', skill_name: 'useState' }])); // getSkillById

      const result = await repository.getAllMGSForCompetency('comp_123');

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('addCompetency', () => {
    it('should add competency to database', async () => {
      const competency: Competency = {
        competency_id: 'comp_123',
        competency_name: 'Full Stack Development',
        description: 'Test',
      };

      mockPool.query.mockResolvedValueOnce(mockQueryResult([]));

      await repository.addCompetency(competency);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO competencies'),
        expect.arrayContaining([competency.competency_id, competency.competency_name])
      );
    });
  });

  describe('addSkill', () => {
    it('should add skill to database', async () => {
      const skill: Skill = {
        skill_id: 'skill_123',
        skill_name: 'React Hooks',
      };

      mockPool.query.mockResolvedValueOnce(mockQueryResult([]));

      await repository.addSkill(skill);

      expect(mockPool.query).toHaveBeenCalled();
    });
  });

  describe('linkSkillToCompetency', () => {
    it('should link skill to competency', async () => {
      mockPool.query.mockResolvedValueOnce(mockQueryResult([]));

      await repository.linkSkillToCompetency('comp_123', 'skill_123');

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO competency_skill'),
        ['comp_123', 'skill_123']
      );
    });
  });
});

