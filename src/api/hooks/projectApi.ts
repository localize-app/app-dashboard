// src/api/projectApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup axios interceptor for auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const projectApi = {
  // Create a new project
  createProject: async (projectData: any) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error?.response?.data || error;
    }
  },

  // Get all projects
  getProjects: async (params = {}) => {
    try {
      const response = await api.get('/projects', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error?.response?.data || error;
    }
  },

  // Get a single project
  getProject: async (id: string) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error?.response?.data || error;
    }
  },

  // Update a project
  updateProject: async (id: string, projectData: any) => {
    try {
      const response = await api.patch(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error?.response?.data || error;
    }
  },

  // Delete a project
  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error?.response?.data || error;
    }
  },

  // Add a member to a project
  addProjectMember: async (projectId, userId) => {
    try {
      const response = await api.post(
        `/projects/${projectId}/members/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding member to project:`, error);
      throw error?.response?.data || error;
    }
  },

  // Remove a member from a project
  removeProjectMember: async (projectId, userId) => {
    try {
      const response = await api.delete(
        `/projects/${projectId}/members/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error removing member from project:`, error);
      throw error?.response?.data || error;
    }
  },
};

export default projectApi;
