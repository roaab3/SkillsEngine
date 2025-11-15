import axios from 'axios';
import type { UserProfile, GapAnalysis, CompetencyDetail } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const userId = localStorage.getItem('user_id');
    if (userId) {
      config.headers['X-User-Id'] = userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // User Profile
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    const response = await apiClient.get(`/api/frontend/profile/${userId}`);
    return response.data.data;
  },

  getUserProfileDetail: async (userId: string): Promise<UserProfile> => {
    const response = await apiClient.get(`/api/frontend/profile/${userId}/detail`);
    return response.data.data;
  },

  // Gap Analysis
  getGapAnalysis: async (
    userId: string,
    type?: 'narrow' | 'broad',
    courseName?: string
  ): Promise<GapAnalysis> => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (courseName) params.append('course_name', courseName);

    const response = await apiClient.get(
      `/api/frontend/gap-analysis/${userId}?${params.toString()}`
    );
    return response.data.data;
  },

  // Competency Detail
  getCompetencyDetail: async (competencyId: string): Promise<CompetencyDetail> => {
    const response = await apiClient.get(`/api/frontend/competency/${competencyId}`);
    return response.data.data;
  },

  // CSV Upload (Trainer only)
  uploadCSV: async (file: File): Promise<{ upload_id: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/api/trainer/csv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  getUploadStatus: async (uploadId: string) => {
    const response = await apiClient.get(`/api/trainer/csv/status/${uploadId}`);
    return response.data.data;
  },
};

export default apiClient;

