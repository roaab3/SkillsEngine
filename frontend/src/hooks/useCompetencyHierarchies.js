/**
 * Custom Hook for Fetching Competency Hierarchies Progressively
 * Fetches complete hierarchy data for multiple competencies one at a time
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

/**
 * @param {Array} competencyIds - Array of competency IDs to fetch
 * @returns {{hierarchies: Object, loading: Object, errors: Object, isInitialLoading: boolean}}
 */
export function useCompetencyHierarchies(competencyIds = []) {
  const [hierarchies, setHierarchies] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Stable key for dependency tracking
  const idsKey = competencyIds.join(',');

  const fetchHierarchy = useCallback(async (competencyId) => {
    // Set loading state for this competency
    setLoading(prev => ({ ...prev, [competencyId]: true }));
    setErrors(prev => ({ ...prev, [competencyId]: null }));

    try {
      const response = await api.getCompetencyCompleteHierarchy(competencyId);

      if (response.success) {
        setHierarchies(prev => ({ ...prev, [competencyId]: response.data }));
      } else {
        setErrors(prev => ({
          ...prev,
          [competencyId]: response.error || 'Failed to load hierarchy'
        }));
      }
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        [competencyId]: err.message || 'Failed to load hierarchy'
      }));
    } finally {
      setLoading(prev => ({ ...prev, [competencyId]: false }));
    }
  }, []);

  useEffect(() => {
    if (!competencyIds || competencyIds.length === 0) {
      setIsInitialLoading(false);
      return;
    }

    // Fetch hierarchies progressively (one at a time) to avoid overwhelming the server
    const fetchAllHierarchies = async () => {
      setIsInitialLoading(true);

      for (const competencyId of competencyIds) {
        // Skip if already loaded or currently loading
        if (hierarchies[competencyId] || loading[competencyId]) {
          continue;
        }

        await fetchHierarchy(competencyId);

        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setIsInitialLoading(false);
    };

    fetchAllHierarchies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return {
    hierarchies,
    loading,
    errors,
    isInitialLoading,
    refetchHierarchy: fetchHierarchy
  };
}
