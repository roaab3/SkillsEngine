/**
 * Integration Tests for Frontend API Client
 */

import { api } from '@/lib/api';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
}));

describe('API Client Integration', () => {
  it('should have getUserProfile method', () => {
    expect(api.getUserProfile).toBeDefined();
    expect(typeof api.getUserProfile).toBe('function');
  });

  it('should have getCompetencies method', () => {
    expect(api.getCompetencies).toBeDefined();
    expect(typeof api.getCompetencies).toBe('function');
  });

  it('should have importCSV method', () => {
    expect(api.importCSV).toBeDefined();
    expect(typeof api.importCSV).toBe('function');
  });
});

