import axios from 'axios';
import type { UserProfile, GapAnalysis, CompetencyDetail } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
    
    // Always send user_id - extract from URL if available, or use localStorage/default
    const userId = localStorage.getItem('user_id') || 
                   config.url?.match(/\/profile\/([^\/]+)/)?.[1] ||
                   config.url?.match(/\/gap-analysis\/([^\/\?]+)/)?.[1] ||
                   'user_123'; // Default for development
    
    if (userId) {
      config.headers['X-User-Id'] = userId;
      // Also set auth token if not present (for development)
      if (!token) {
        config.headers.Authorization = `Bearer dev-token-${userId}`;
      }
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
      // Handle unauthorized - clear auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      
      // VERSION 1: Redirect to home page (ACTIVE)
      window.location.href = '/';
      
      // VERSION 2: Don't redirect - let component handle error (COMMENTED OUT)
      // Uncomment the line below and comment out window.location.href to use this version
      // This allows components to show error messages instead of redirecting
      // return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export const api = {
  // User Profile
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    // Try to get from API, fallback to mock data if fails
    try {
      const response = await apiClient.get(`/api/frontend/profile/${userId}`);
      return response.data.data;
    } catch (error: any) {
      // If API fails, try to get mock data from JSON file
      if (error.response?.status === 404 || error.response?.status === 401) {
        try {
          const mockResponse = await apiClient.get('/api/frontend/mock/profile');
          const mockData = mockResponse.data.data;
          // Override user_id with requested userId
          return { ...mockData, user_id: userId };
        } catch (mockError) {
          // If mock data also fails, try to load from public folder
          try {
            const publicMockResponse = await fetch('/mockdata/userProfile.json');
            if (publicMockResponse.ok) {
              const publicMockData = await publicMockResponse.json();
              return { ...publicMockData, user_id: userId };
            }
          } catch (publicError) {
            // Fall through to throw original error
          }
        }
      }
      throw error;
    }
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

