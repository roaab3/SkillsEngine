import { TaxonomyService } from '../../services/TaxonomyService';
import { TaxonomyRepository } from '../../repositories/TaxonomyRepository';
import { AIService } from '../../services/AIService';
import { NotFoundError } from '../../utils/errors';

jest.mock('../../repositories/TaxonomyRepository');
jest.mock('../../services/AIService');

describe('TaxonomyService', () => {
  let service: TaxonomyService;
  let mockTaxonomyRepository: jest.Mocked<TaxonomyRepository>;
  let mockAIService: jest.Mocked<AIService>;

  beforeEach(() => {
    mockTaxonomyRepository = {
      getCompetencyById: jest.fn(),
      getCompetencyByName: jest.fn(),
      getSkillById: jest.fn(),
      getL1SkillsForCompetency: jest.fn(),
      getChildSkills: jest.fn(),
      getMGSForCompetency: jest.fn(),
      getAllMGSForCompetency: jest.fn(),
      addCompetency: jest.fn(),
      addSkill: jest.fn(),
      linkSkillToCompetency: jest.fn(),
      linkParentChildSkill: jest.fn(),
    } as any;

    mockAIService = {
      normalizeCompetencyName: jest.fn(),
      discoverExternalCompetency: jest.fn(),
    } as any;

    (TaxonomyRepository as jest.Mock).mockImplementation(() => mockTaxonomyRepository);
    (AIService as jest.Mock).mockImplementation(() => mockAIService);

    service = new TaxonomyService();
  });

  describe('getMGSForCompetency', () => {
    it('should return MGS when competency found', async () => {
      const mockCompetency = {
        competency_id: 'comp_123',
        competency_name: 'Full Stack Development',
      };

      const mockMGS = [
        { skill_id: 'skill_1', skill_name: 'React Hooks' },
        { skill_id: 'skill_2', skill_name: 'Node.js' },
      ];

      mockTaxonomyRepository.getCompetencyByName.mockResolvedValueOnce(mockCompetency as any);
      mockTaxonomyRepository.getMGSForCompetency.mockResolvedValueOnce(mockMGS as any);

      const result = await service.getMGSForCompetency('Full Stack Development');

      expect(result).toEqual(mockMGS);
      expect(mockTaxonomyRepository.getCompetencyByName).toHaveBeenCalledWith('Full Stack Development');
      expect(mockTaxonomyRepository.getMGSForCompetency).toHaveBeenCalledWith('comp_123');
    });

    it('should return empty array when competency not found', async () => {
      mockTaxonomyRepository.getCompetencyByName.mockResolvedValueOnce(null);

      const result = await service.getMGSForCompetency('Non-existent');

      expect(result).toEqual([]);
    });
  });

  describe('getMGSForCompetencyWithDiscovery', () => {
    it('should normalize name and return MGS when found', async () => {
      const normalizedName = 'full stack development';
      const mockCompetency = {
        competency_id: 'comp_123',
        competency_name: normalizedName,
      };
      const mockMGS = [{ skill_id: 'skill_1', skill_name: 'React Hooks' }];

      mockAIService.normalizeCompetencyName.mockResolvedValueOnce(normalizedName);
      mockTaxonomyRepository.getCompetencyByName.mockResolvedValueOnce(mockCompetency as any);
      mockTaxonomyRepository.getAllMGSForCompetency.mockResolvedValueOnce(mockMGS as any);

      const result = await service.getMGSForCompetencyWithDiscovery('Full Stack Development');

      expect(result).toEqual(mockMGS);
      expect(mockAIService.normalizeCompetencyName).toHaveBeenCalledWith('Full Stack Development');
    });

    it('should discover external competency when not found', async () => {
      const normalizedName = 'full stack development';
      const discoveredCompetency = {
        competency_id: 'comp_new',
        competency_name: normalizedName,
        description: 'Discovered competency',
      };
      const mockMGS = [{ skill_id: 'skill_1', skill_name: 'React Hooks' }];

      mockAIService.normalizeCompetencyName.mockResolvedValueOnce(normalizedName);
      mockTaxonomyRepository.getCompetencyByName.mockResolvedValueOnce(null);
      mockAIService.discoverExternalCompetency.mockResolvedValueOnce(discoveredCompetency as any);
      mockTaxonomyRepository.addCompetency.mockResolvedValueOnce(undefined);
      mockTaxonomyRepository.getAllMGSForCompetency.mockResolvedValueOnce(mockMGS as any);

      const result = await service.getMGSForCompetencyWithDiscovery('New Competency');

      expect(result).toEqual(mockMGS);
      expect(mockAIService.discoverExternalCompetency).toHaveBeenCalledWith('New Competency');
      expect(mockTaxonomyRepository.addCompetency).toHaveBeenCalledWith(discoveredCompetency);
    });

    it('should throw NotFoundError when discovery fails', async () => {
      const normalizedName = 'new competency';

      mockAIService.normalizeCompetencyName.mockResolvedValueOnce(normalizedName);
      mockTaxonomyRepository.getCompetencyByName.mockResolvedValueOnce(null);
      mockAIService.discoverExternalCompetency.mockResolvedValueOnce(null);

      await expect(
        service.getMGSForCompetencyWithDiscovery('New Competency')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getCompetencyById', () => {
    it('should return competency when found', async () => {
      const mockCompetency = {
        competency_id: 'comp_123',
        competency_name: 'Full Stack Development',
      };

      mockTaxonomyRepository.getCompetencyById.mockResolvedValueOnce(mockCompetency as any);

      const result = await service.getCompetencyById('comp_123');

      expect(result).toEqual(mockCompetency);
    });

    it('should throw NotFoundError when not found', async () => {
      mockTaxonomyRepository.getCompetencyById.mockResolvedValueOnce(null);

      await expect(service.getCompetencyById('comp_999')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getSkillById', () => {
    it('should return skill when found', async () => {
      const mockSkill = {
        skill_id: 'skill_123',
        skill_name: 'React Hooks',
      };

      mockTaxonomyRepository.getSkillById.mockResolvedValueOnce(mockSkill as any);

      const result = await service.getSkillById('skill_123');

      expect(result).toEqual(mockSkill);
    });

    it('should throw NotFoundError when not found', async () => {
      mockTaxonomyRepository.getSkillById.mockResolvedValueOnce(null);

      await expect(service.getSkillById('skill_999')).rejects.toThrow(NotFoundError);
    });
  });
});

