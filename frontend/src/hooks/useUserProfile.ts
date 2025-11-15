import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { UserProfile } from '../types';

export const useUserProfile = (userId: string) => {
  return useQuery<UserProfile>({
    queryKey: ['userProfile', userId],
    queryFn: () => api.getUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserProfileDetail = (userId: string) => {
  return useQuery<UserProfile>({
    queryKey: ['userProfileDetail', userId],
    queryFn: () => api.getUserProfileDetail(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

