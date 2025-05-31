// src/api/apiServices.ts - Updated with company service
import apiClient from './apiClient';
import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
} from '@/types/project.types';
import {
  User,
  LoginCredentials,
  RegisterDto,
  AuthResponse,
} from '@/types/auth.types';
import {
  Company,
  CreateCompanyDto,
  UpdateCompanyDto,
} from '@/types/company.types';

/**
 * Centralized API services with TypeScript typing
 */
export const apiServices = {
  // AUTH SERVICES
  auth: {
    // Login user
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await apiClient.post<AuthResponse>(
        '/auth/login',
        credentials
      );
      return response.data;
    },

    // Register user
    register: async (userData: RegisterDto): Promise<AuthResponse> => {
      const response = await apiClient.post<AuthResponse>(
        '/auth/register',
        userData
      );
      return response.data;
    },

    // Get current user profile
    getProfile: async (): Promise<User> => {
      const response = await apiClient.get<User>('/auth/profile');
      return response.data;
    },
  },

  // COMPANY SERVICES
  companies: {
    // Get all companies
    getAll: async (params: Record<string, any> = {}): Promise<Company[]> => {
      const response = await apiClient.get<Company[]>('/companies', { params });
      return response.data;
    },

    // Get a specific company by ID
    getById: async (id: string): Promise<Company> => {
      const response = await apiClient.get<Company>(`/companies/${id}`);
      return response.data;
    },

    // Create a new company
    create: async (companyData: CreateCompanyDto): Promise<Company> => {
      const response = await apiClient.post<Company>('/companies', companyData);
      return response.data;
    },

    // Update a company
    update: async (
      id: string,
      companyData: UpdateCompanyDto
    ): Promise<Company> => {
      const response = await apiClient.patch<Company>(
        `/companies/${id}`,
        companyData
      );
      return response.data;
    },

    // Delete a company
    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/companies/${id}`);
    },
  },

  // PROJECT SERVICES
  projects: {
    // Create a new project
    create: async (projectData: CreateProjectDto): Promise<Project> => {
      const response = await apiClient.post<Project>('/projects', projectData);
      return response.data;
    },

    // Get all projects with optional filters
    getAll: async (params: Record<string, any> = {}): Promise<Project[]> => {
      const response = await apiClient.get<Project[]>('/projects', { params });
      return response.data;
    },

    // Get a specific project by ID
    getById: async (id: string): Promise<Project> => {
      const response = await apiClient.get<Project>(`/projects/${id}`);
      return response.data;
    },

    // Update a project
    update: async (
      id: string,
      projectData: UpdateProjectDto
    ): Promise<Project> => {
      const response = await apiClient.patch<Project>(
        `/projects/${id}`,
        projectData
      );
      return response.data;
    },

    // Delete a project
    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/projects/${id}`);
    },

    // Add a member to a project
    addMember: async (projectId: string, userId: string): Promise<Project> => {
      const response = await apiClient.post<Project>(
        `/projects/${projectId}/members/${userId}`
      );
      return response.data;
    },

    // Remove a member from a project
    removeMember: async (
      projectId: string,
      userId: string
    ): Promise<Project> => {
      const response = await apiClient.delete<Project>(
        `/projects/${projectId}/members/${userId}`
      );
      return response.data;
    },
  },

  // LOCALE SERVICES
  locales: {
    // Get all locales
    getAll: async (): Promise<any[]> => {
      const response = await apiClient.get<any[]>('/locales');
      return response.data;
    },

    // Get a specific locale
    getById: async (id: string): Promise<any> => {
      const response = await apiClient.get<any>(`/locales/${id}`);
      return response.data;
    },
  },

  // PHRASE SERVICES
  phrases: {
    // Get all phrases with optional filters
    getAll: async (params: Record<string, any> = {}): Promise<any[]> => {
      const response = await apiClient.get<any[]>('/phrases', { params });
      return response.data;
    },

    // Add a translation to a phrase
    addTranslation: async (
      phraseId: string,
      locale: string,
      translationData: any
    ): Promise<any> => {
      const response = await apiClient.post<any>(
        `/phrases/${phraseId}/translations/${locale}`,
        translationData
      );
      return response.data;
    },
  },

  // TEAM SERVICES
  team: {
    // Get team members
    getMembers: async (companyId: string): Promise<User[]> => {
      const response = await apiClient.get<User[]>(
        `/companies/${companyId}/users`
      );
      return response.data;
    },
  },
};

export default apiServices;
