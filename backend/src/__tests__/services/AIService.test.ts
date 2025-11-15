import { AIService } from '../../services/AIService';
import { SourceRepository } from '../../repositories/SourceRepository';
import { ExternalAPIError } from '../../utils/errors';
import fs from 'fs';
import path from 'path';

jest.mock('../../repositories/SourceRepository');
jest.mock('fs');
jest.mock('@google/generative-ai');

describe('AIService', () => {
  let service: AIService;
  let mockSourceRepository: jest.Mocked<SourceRepository>;
  let mockFlashModel: any;
  let mockDeepSearchModel: any;

  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-api-key';

    mockSourceRepository = {
      addOfficialSource: jest.fn(),
    } as any;

    mockFlashModel = {
      generateContent: jest.fn(),
    };

    mockDeepSearchModel = {
      generateContent: jest.fn(),
    };

    const mockGenAI = {
      getGenerativeModel: jest.fn((config: { model: string }) => {
        if (config.model === 'gemini-1.5-flash') {
          return mockFlashModel;
        }
        return mockDeepSearchModel;
      }),
    };

    jest.doMock('@google/generative-ai', () => ({
      GoogleGenerativeAI: jest.fn(() => mockGenAI),
    }));

    (SourceRepository as jest.Mock).mockImplementation(() => mockSourceRepository);

    // Mock fs.readFileSync
    (fs.readFileSync as jest.Mock).mockReturnValue('Mock prompt template');

    service = new AIService();
  });

  describe('normalizeCompetencyName', () => {
    it('should normalize competency name using Flash model', async () => {
      const mockResponse = {
        response: {
          text: () => '"normalized name"',
        },
      };

      mockFlashModel.generateContent.mockResolvedValueOnce(mockResponse);

      const result = await service.normalizeCompetencyName('Full Stack Development');

      expect(result).toBe('normalized name');
      expect(mockFlashModel.generateContent).toHaveBeenCalled();
    });

    it('should return original name if normalization fails', async () => {
      mockFlashModel.generateContent.mockRejectedValueOnce(new Error('API error'));

      const result = await service.normalizeCompetencyName('Original Name');

      expect(result).toBe('Original Name');
    });
  });

  describe('extractSkillsFromData', () => {
    it('should extract skills from raw data', async () => {
      const rawData = 'LinkedIn profile with React, Node.js experience';
      const mockResponse = {
        response: {
          text: () => JSON.stringify({
            competencies: ['Full Stack Development'],
            skills: ['React', 'Node.js'],
          }),
        },
      };

      mockDeepSearchModel.generateContent.mockResolvedValueOnce(mockResponse);

      const result = await service.extractSkillsFromData(rawData);

      expect(result).toHaveProperty('competencies');
      expect(result).toHaveProperty('skills');
      expect(mockDeepSearchModel.generateContent).toHaveBeenCalled();
    });

    it('should throw ExternalAPIError on failure', async () => {
      mockDeepSearchModel.generateContent.mockRejectedValueOnce(new Error('API error'));

      await expect(
        service.extractSkillsFromData('test data')
      ).rejects.toThrow(ExternalAPIError);
    });
  });

  describe('normalizeSkills', () => {
    it('should normalize array of skills', async () => {
      const skills = ['React Hooks', 'Node.js'];
      const mockResponse = {
        response: {
          text: () => JSON.stringify(['react hooks', 'nodejs']),
        },
      };

      mockFlashModel.generateContent.mockResolvedValueOnce(mockResponse);

      const result = await service.normalizeSkills(skills);

      expect(result).toEqual(['react hooks', 'nodejs']);
    });

    it('should return original skills if normalization fails', async () => {
      const skills = ['React Hooks'];
      mockFlashModel.generateContent.mockRejectedValueOnce(new Error('API error'));

      const result = await service.normalizeSkills(skills);

      expect(result).toEqual(skills);
    });
  });

  describe('discoverExternalCompetency', () => {
    it('should discover external competency', async () => {
      const mockResponse = {
        response: {
          text: () => JSON.stringify({
            competency_id: 'comp_new',
            competency_name: 'New Competency',
            description: 'Discovered competency',
          }),
        },
      };

      mockDeepSearchModel.generateContent.mockResolvedValueOnce(mockResponse);

      const result = await service.discoverExternalCompetency('New Competency');

      expect(result).toHaveProperty('competency_id');
      expect(result).toHaveProperty('competency_name');
    });

    it('should return null if discovery fails', async () => {
      mockDeepSearchModel.generateContent.mockRejectedValueOnce(new Error('API error'));

      const result = await service.discoverExternalCompetency('Unknown');

      expect(result).toBeNull();
    });
  });
});

