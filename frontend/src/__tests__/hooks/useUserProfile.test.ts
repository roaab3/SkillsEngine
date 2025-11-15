import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserProfile } from '../../hooks/useUserProfile';
import { api } from '../../services/api';

vi.mock('../../services/api');

describe('useUserProfile', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  it('should fetch user profile', async () => {
    const mockProfile = {
      user_id: 'user_123',
      user_name: 'John Doe',
      company_id: 'company_456',
      relevance_score: 75.50,
      competencies: [],
    };

    vi.spyOn(api, 'getUserProfile').mockResolvedValueOnce(mockProfile);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUserProfile('user_123'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProfile);
    expect(vi.mocked(api.getUserProfile)).toHaveBeenCalledWith('user_123');
  });

  it('should not fetch when userId is empty', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUserProfile(''), { wrapper });

    expect(result.current.isFetching).toBe(false);
  });
});

