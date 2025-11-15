import { useQuery } from 'react-query';
import apiClient from '@/services/api-client';

interface UserProfile {
  user_id: string;
  name: string;
  company_id: string;
  competencies: Array<{
    id: string;
    competency_id: string;
    name: string;
    level: string;
    progress_percentage: number;
    verification_source: string;
    last_evaluate: string;
  }>;
  skills: Array<{
    id: string;
    skill_id: string;
    name: string;
    verified: boolean;
    verification_source: string;
    last_evaluate: string;
  }>;
  created_at: string;
  updated_at: string;
}

export function useUserProfile(userId: string) {
  return useQuery<UserProfile>(
    ['userProfile', userId],
    async () => {
      const response = await apiClient.get(`/users/${userId}/profile`);
      return response.data.data;
    },
    {
      enabled: !!userId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}

