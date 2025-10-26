import { useQuery } from 'react-query';
import apiClient from '@/services/api-client';

interface SkillGap {
  competency_id: string;
  competency_name: string;
  missing_skills: Array<{
    skill_id: string;
    name: string;
    type: string;
    priority: string;
  }>;
  gap_percentage: number;
  recommendations?: Array<{
    type: string;
    title: string;
    provider: string;
    estimated_duration: string;
  }>;
}

interface SkillGapsResult {
  user_id: string;
  gaps: SkillGap[];
  overall_gap_percentage: number;
  generated_at: string;
}

export function useSkillGaps(userId: string, options?: {
  target_competency_id?: string;
  include_recommendations?: boolean;
}) {
  return useQuery<SkillGapsResult>(
    ['skillGaps', userId, options],
    async () => {
      const params = new URLSearchParams();
      if (options?.target_competency_id) {
        params.append('target_competency_id', options.target_competency_id);
      }
      if (options?.include_recommendations) {
        params.append('include_recommendations', 'true');
      }

      const response = await apiClient.get(`/users/${userId}/gaps?${params.toString()}`);
      return response.data.data;
    },
    {
      enabled: !!userId,
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
    }
  );
}

