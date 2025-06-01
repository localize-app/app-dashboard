// src/api/apiServices.ts - Enhanced with user management
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
  CreateUserDto,
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

  // USER MANAGEMENT SERVICES
  users: {
    // Get all users
    getAll: async (params: Record<string, any> = {}): Promise<User[]> => {
      const response = await apiClient.get<User[]>('/user', { params });
      return response.data;
    },

    // Get a specific user by ID
    getById: async (id: string): Promise<User> => {
      const response = await apiClient.get<User>(`/user/${id}`);
      return response.data;
    },

    // Create a new user
    create: async (userData: CreateUserDto): Promise<User> => {
      const response = await apiClient.post<User>('/user', userData);
      return response.data;
    },

    // Update a user
    update: async (id: string, userData: Partial<User>): Promise<User> => {
      const response = await apiClient.put<User>(`/user/${id}`, userData);
      return response.data;
    },

    // Delete a user
    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/user/${id}`);
    },

    // Assign user to company
    assignToCompany: async (
      userId: string,
      companyId: string
    ): Promise<User> => {
      const response = await apiClient.patch<User>(
        `/user/${userId}/company/${companyId}`
      );
      return response.data;
    },

    // Get user permissions
    getPermissions: async (id: string): Promise<any> => {
      const response = await apiClient.get(`/user/${id}/permissions`);
      return response.data;
    },

    // Update user permissions
    updatePermissions: async (id: string, permissions: any): Promise<any> => {
      const response = await apiClient.patch(
        `/user/${id}/permissions`,
        permissions
      );
      return response.data;
    },

    // Reset user permissions to role defaults
    resetPermissions: async (id: string): Promise<any> => {
      const response = await apiClient.post(`/user/${id}/permissions/reset`);
      return response.data;
    },

    // Get default permissions for a role
    getRolePermissions: async (role: string): Promise<any> => {
      const response = await apiClient.get(`/user/roles/${role}/permissions`);
      return response.data;
    },

    // Invite user via email (if you implement this endpoint)
    sendInvitation: async (
      email: string,
      companyId: string,
      role: string
    ): Promise<any> => {
      const response = await apiClient.post('/user/invite', {
        email,
        companyId,
        role,
      });
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

    // Add user to company
    addUser: async (companyId: string, userId: string): Promise<Company> => {
      const response = await apiClient.post<Company>(
        `/companies/${companyId}/users/${userId}`
      );
      return response.data;
    },

    // Remove user from company
    removeUser: async (companyId: string, userId: string): Promise<Company> => {
      const response = await apiClient.delete<Company>(
        `/companies/${companyId}/users/${userId}`
      );
      return response.data;
    },

    // Get company users
    getUsers: async (companyId: string): Promise<User[]> => {
      const response = await apiClient.get<User[]>(
        `/companies/${companyId}/users`
      );
      return response.data;
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

    // Update project settings
    updateSettings: async (
      projectId: string,
      settings: any
    ): Promise<Project> => {
      const response = await apiClient.patch<Project>(
        `/projects/${projectId}/settings`,
        settings
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

    // Create a new locale
    create: async (localeData: any): Promise<any> => {
      const response = await apiClient.post<any>('/locales', localeData);
      return response.data;
    },

    // Update a locale
    update: async (id: string, localeData: any): Promise<any> => {
      const response = await apiClient.patch<any>(`/locales/${id}`, localeData);
      return response.data;
    },

    // Delete a locale
    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/locales/${id}`);
    },
  },

  // PHRASE SERVICES
  phrases: {
    // Get all phrases with optional filters
    getAll: async (params: Record<string, any> = {}): Promise<any[]> => {
      const response = await apiClient.get<any[]>('/phrases', { params });
      return response.data;
    },

    // Get a specific phrase by ID
    getById: async (id: string): Promise<any> => {
      const response = await apiClient.get<any>(`/phrases/${id}`);
      return response.data;
    },

    // Create a new phrase
    create: async (phraseData: any): Promise<any> => {
      const response = await apiClient.post<any>('/phrases', phraseData);
      return response.data;
    },

    // Update a phrase
    update: async (id: string, phraseData: any): Promise<any> => {
      const response = await apiClient.patch<any>(`/phrases/${id}`, phraseData);
      return response.data;
    },

    // Delete a phrase
    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/phrases/${id}`);
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

    // Update phrase status
    updateStatus: async (id: string, status: string): Promise<any> => {
      const response = await apiClient.patch<any>(`/phrases/${id}/status`, {
        status,
      });
      return response.data;
    },

    // Batch operations on phrases
    batchOperation: async (operationData: any): Promise<any> => {
      const response = await apiClient.post<any>(
        '/phrases/batch',
        operationData
      );
      return response.data;
    },

    // Export phrases
    exportPhrases: async (
      projectId: string,
      format: 'json' | 'csv' | 'xlsx' = 'json',
      options?: any
    ): Promise<void> => {
      const params: Record<string, any> = {
        project: projectId,
        format,
        ...options,
      };

      const response = await apiClient.get('/phrases/export', {
        params,
        responseType: 'blob',
      });

      // Handle file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `phrases_export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },

    // Import phrases
    importPhrases: async (
      projectId: string,
      file: File,
      options?: any
    ): Promise<any> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('project', projectId);

      if (options) {
        Object.keys(options).forEach((key) => {
          formData.append(key, options[key]);
        });
      }

      const response = await apiClient.post('/phrases/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
  },

  // GLOSSARY SERVICES
  glossary: {
    // Get all glossary terms
    getAll: async (params: Record<string, any> = {}): Promise<any[]> => {
      const response = await apiClient.get<any[]>('/glossary-terms', {
        params,
      });
      return response.data;
    },

    // Get a specific glossary term
    getById: async (id: string): Promise<any> => {
      const response = await apiClient.get<any>(`/glossary-terms/${id}`);
      return response.data;
    },

    // Create a new glossary term
    create: async (termData: any): Promise<any> => {
      const response = await apiClient.post<any>('/glossary-terms', termData);
      return response.data;
    },

    // Update a glossary term
    update: async (id: string, termData: any): Promise<any> => {
      const response = await apiClient.patch<any>(
        `/glossary-terms/${id}`,
        termData
      );
      return response.data;
    },

    // Delete a glossary term
    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/glossary-terms/${id}`);
    },

    // Add translation to glossary term
    addTranslation: async (
      termId: string,
      locale: string,
      translationData: any
    ): Promise<any> => {
      const response = await apiClient.post<any>(
        `/glossary-terms/${termId}/translations/${locale}`,
        translationData
      );
      return response.data;
    },

    // Remove translation from glossary term
    removeTranslation: async (
      termId: string,
      locale: string
    ): Promise<void> => {
      await apiClient.delete(
        `/glossary-terms/${termId}/translations/${locale}`
      );
    },
  },

  // TRANSLATION SERVICES
  translation: {
    // Get available translation providers
    getProviders: async (): Promise<any> => {
      const response = await apiClient.get('/translate/providers');
      return response.data;
    },

    // Translate a single text
    translateText: async (translationData: any): Promise<any> => {
      const response = await apiClient.post('/translate', translationData);
      return response.data;
    },

    // Batch translate phrases
    translateBatchPhrases: async (batchData: any): Promise<any> => {
      const response = await apiClient.post(
        '/translate/phrases/batch',
        batchData
      );
      return response.data;
    },
  },

  // ACTIVITY SERVICES
  activities: {
    // Get all activities
    getAll: async (params: Record<string, any> = {}): Promise<any[]> => {
      const response = await apiClient.get<any[]>('/activities', { params });
      return response.data;
    },

    // Create a new activity
    create: async (activityData: any): Promise<any> => {
      const response = await apiClient.post<any>('/activities', activityData);
      return response.data;
    },
  },

  // STYLE GUIDE SERVICES
  styleGuides: {
    // Get all style guides
    getAll: async (params: Record<string, any> = {}): Promise<any[]> => {
      const response = await apiClient.get<any[]>('/style-guides', { params });
      return response.data;
    },

    // Get a specific style guide
    getById: async (id: string): Promise<any> => {
      const response = await apiClient.get<any>(`/style-guides/${id}`);
      return response.data;
    },

    // Create a new style guide
    create: async (styleGuideData: any): Promise<any> => {
      const response = await apiClient.post<any>(
        '/style-guides',
        styleGuideData
      );
      return response.data;
    },

    // Update a style guide
    update: async (id: string, styleGuideData: any): Promise<any> => {
      const response = await apiClient.patch<any>(
        `/style-guides/${id}`,
        styleGuideData
      );
      return response.data;
    },

    // Delete a style guide
    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/style-guides/${id}`);
    },
  },

  // TEAM SERVICES (Legacy support)
  team: {
    // Get team members (alias for users.getAll)
    getMembers: async (companyId?: string): Promise<User[]> => {
      if (companyId) {
        return apiServices.companies.getUsers(companyId);
      }
      return apiServices.users.getAll();
    },
  },
};

export default apiServices;
