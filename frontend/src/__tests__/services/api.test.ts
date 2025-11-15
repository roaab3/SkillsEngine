import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { api } from '../../services/api';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('getUserProfile', () => {
    it('should fetch user profile', async () => {
      const mockProfile = {
        user_id: 'user_123',
        user_name: 'John Doe',
        company_id: 'company_456',
        relevance_score: 75.50,
        competencies: [],
      };

      const mockAxiosInstance = {
        get: vi.fn().mockResolvedValue({
          data: { success: true, data: mockProfile },
        }),
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
      };

      vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any);

      const result = await api.getUserProfile('user_123');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('getGapAnalysis', () => {
    it('should fetch gap analysis', async () => {
      const mockGapAnalysis = {
        user_id: 'user_123',
        user_name: 'John Doe',
        gap_analysis_type: 'broad' as const,
        missing_skills_map: {},
      };

      const mockAxiosInstance = {
        get: vi.fn().mockResolvedValue({
          data: { success: true, data: mockGapAnalysis },
        }),
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
      };

      vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any);

      const result = await api.getGapAnalysis('user_123', 'broad');
      expect(result).toEqual(mockGapAnalysis);
    });
  });

  describe('uploadCSV', () => {
    it('should upload CSV file', async () => {
      const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });
      const mockResponse = { upload_id: 'upload_123' };

      const mockAxiosInstance = {
        post: vi.fn().mockResolvedValue({
          data: { success: true, data: mockResponse },
        }),
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
      };

      vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any);

      const result = await api.uploadCSV(mockFile);
      expect(result).toEqual(mockResponse);
    });
  });
});

