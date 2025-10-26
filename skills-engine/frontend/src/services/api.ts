import axios from 'axios';

// API base URL - this would normally point to your backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User API functions
export const fetchUserProfile = async (userId: number) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: number, userData: any) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Competency API functions
export const fetchCompetencies = async () => {
  try {
    const response = await api.get('/competencies');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching competencies:', error);
    throw error;
  }
};

export const fetchCompetencyById = async (competencyId: number) => {
  try {
    const response = await api.get(`/competencies/${competencyId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching competency:', error);
    throw error;
  }
};

export const fetchCompetencyTree = async (competencyId: number) => {
  try {
    const response = await api.get(`/competencies/${competencyId}/tree`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching competency tree:', error);
    throw error;
  }
};

export const fetchCompetencySkills = async (competencyId: number) => {
  try {
    const response = await api.get(`/competencies/${competencyId}/skills`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching competency skills:', error);
    throw error;
  }
};

// Skill API functions
export const fetchSkills = async () => {
  try {
    const response = await api.get('/skills');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

export const fetchSkillById = async (skillId: number) => {
  try {
    const response = await api.get(`/skills/${skillId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching skill:', error);
    throw error;
  }
};

export const fetchSkillTree = async (skillId: number) => {
  try {
    const response = await api.get(`/skills/${skillId}/tree`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching skill tree:', error);
    throw error;
  }
};

export const fetchSkillCompetencies = async (skillId: number) => {
  try {
    const response = await api.get(`/skills/${skillId}/competencies`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching skill competencies:', error);
    throw error;
  }
};

// User Competency API functions
export const fetchUserCompetencies = async (userId: number) => {
  try {
    const response = await api.get(`/users/${userId}/competencies`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user competencies:', error);
    throw error;
  }
};

export const updateUserCompetency = async (userId: number, competencyId: number, level: string) => {
  try {
    const response = await api.put(`/users/${userId}/competencies/${competencyId}`, { level });
    return response.data.data;
  } catch (error) {
    console.error('Error updating user competency:', error);
    throw error;
  }
};

// User Skill API functions
export const fetchUserSkills = async (userId: number) => {
  try {
    const response = await api.get(`/users/${userId}/skills`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user skills:', error);
    throw error;
  }
};

export const updateUserSkill = async (userId: number, skillId: number, value: string) => {
  try {
    const response = await api.put(`/users/${userId}/skills/${skillId}`, { value });
    return response.data.data;
  } catch (error) {
    console.error('Error updating user skill:', error);
    throw error;
  }
};

// Gap Analysis API functions
export const fetchGapAnalysis = async (userId: number) => {
  try {
    const response = await api.get(`/gap-analysis/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching gap analysis:', error);
    throw error;
  }
};

export const generateGapAnalysis = async (userId: number, targetRole?: string) => {
  try {
    const response = await api.post(`/gap-analysis/${userId}/generate`, { targetRole });
    return response.data.data;
  } catch (error) {
    console.error('Error generating gap analysis:', error);
    throw error;
  }
};

// AI API functions
export const normalizeSkill = async (skillName: string) => {
  try {
    const response = await api.post('/ai/normalize-skill', { skillName });
    return response.data.data;
  } catch (error) {
    console.error('Error normalizing skill:', error);
    throw error;
  }
};

export const suggestSkills = async (query: string) => {
  try {
    const response = await api.get(`/ai/suggest-skills?q=${encodeURIComponent(query)}`);
    return response.data.data;
  } catch (error) {
    console.error('Error suggesting skills:', error);
    throw error;
  }
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

export default api;

