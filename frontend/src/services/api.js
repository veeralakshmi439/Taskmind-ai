import axios from 'axios';

// Use environment variable in production, fallback to localhost for dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
console.log('🔌 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized — token expired');
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ============
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/api/auth/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  getMe: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
};

// ============ PROJECTS ============
export const projectsAPI = {
  getAll: () => api.get('/api/projects/'),
  getById: (id) => api.get(`/api/projects/${id}`),
  create: (data) => api.post('/api/projects/', data),
  update: (id, data) => api.put(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`),
};

// ============ TASKS ============
export const tasksAPI = {
  getAll: () => api.get('/api/tasks/'),
  getById: (id) => api.get(`/api/tasks/${id}`),
  create: (data) => api.post('/api/tasks/', data),
  update: (id, data) => api.put(`/api/tasks/${id}`, data),
  delete: (id) => api.delete(`/api/tasks/${id}`),
};

// ============ MEETINGS ============
export const meetingsAPI = {
  getAll: () => api.get('/api/meetings/'),
  getById: (id) => api.get(`/api/meetings/${id}`),
  create: (data) => api.post('/api/meetings/', data),
  update: (id, data) => api.put(`/api/meetings/${id}`, data),
  delete: (id) => api.delete(`/api/meetings/${id}`),
  uploadAudio: (formData) =>
    api.post('/api/meetings/upload-audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ============ TEAM ============
export const teamAPI = {
  getAll: () => api.get('/api/team'),
  getById: (id) => api.get(`/api/team/${id}`),
};

// ============ DOCUMENTS ============
export const documentsAPI = {
  getAll: () => api.get('/api/documents'),
  create: (data) => api.post('/api/documents', data),
  delete: (id) => api.delete(`/api/documents/${id}`),
};

export default api;