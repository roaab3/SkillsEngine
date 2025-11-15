import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { GapAnalysis } from '../types';

export const useSkillGaps = (
  userId: string,
  type: 'narrow' | 'broad' = 'broad',
  courseName?: string
) => {
  return useQuery<GapAnalysis>({
    queryKey: ['skillGaps', userId, type, courseName],
    queryFn: () => api.getGapAnalysis(userId, type, courseName),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

