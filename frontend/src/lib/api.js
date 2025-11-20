/**
 * API Client for Skills Engine Backend
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // User Profile
  getUserProfile: async (userId) => {
    const response = await apiClient.get(`/api/user/${userId}/profile`);
    return response.data;
  },

  // Competencies
  getCompetencies: async () => {
    const response = await apiClient.get('/api/competencies/parents');
    return response.data;
  },

  getCompetencyById: async (competencyId) => {
    const response = await apiClient.get(`/api/competencies/${competencyId}`);
    return response.data;
  },

  getCompetencyHierarchy: async (competencyId) => {
    const response = await apiClient.get(`/api/competencies/${competencyId}/hierarchy`);
    return response.data;
  },

  getCompetencyMGS: async (competencyId) => {
    const response = await apiClient.get(`/api/competencies/${competencyId}/mgs`);
    return response.data;
  },

  // Skills
  getSkills: async () => {
    const response = await apiClient.get('/api/skills/roots');
    return response.data;
  },

  getSkillById: async (skillId) => {
    const response = await apiClient.get(`/api/skills/${skillId}`);
    return response.data;
  },

  getSkillTree: async (skillId) => {
    const response = await apiClient.get(`/api/skills/${skillId}/tree`);
    return response.data;
  },

  getSkillMGS: async (skillId) => {
    const response = await apiClient.get(`/api/skills/${skillId}/mgs`);
    return response.data;
  },

  // CSV Import (Trainer only)
  importCSV: async (file) => {
    const formData = new FormData();
    formData.append('csv', file);
    const response = await apiClient.post('/api/competencies/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  validateCSV: async (file) => {
    const formData = new FormData();
    formData.append('csv', file);
    const response = await apiClient.post('/api/competencies/import/validate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;

