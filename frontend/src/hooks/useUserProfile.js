/**
 * Custom Hook for User Profile
 */

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

/**
 * @param {string} userId
 * @returns {{profile: any, loading: boolean, error: string|null, refetch: function}}
 */
export function useUserProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await api.getUserProfile(userId);
        setProfile(profileData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const refetch = async () => {
    if (userId) {
      try {
        setLoading(true);
        const profileData = await api.getUserProfile(userId);
        setProfile(profileData);
      } catch (err) {
        setError(err.message || 'Failed to reload profile');
      } finally {
        setLoading(false);
      }
    }
  };

  return { profile, loading, error, refetch };
}

