// src/api/services/companyService.ts
import apiClient from '../apiClient';
import {
  Company,
  CreateCompanyDto,
  UpdateCompanyDto,
} from '@/types/company.types';

const companyService = {
  // Get all companies
  getAll: async (params: Record<string, any> = {}): Promise<Company[]> => {
    try {
      const response = await apiClient.get<Company[]>('/companies', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  // Get a specific company by ID
  getById: async (id: string): Promise<Company> => {
    try {
      const response = await apiClient.get<Company>(`/companies/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error);
      throw error;
    }
  },

  // Create a new company
  create: async (companyData: CreateCompanyDto): Promise<Company> => {
    try {
      const response = await apiClient.post<Company>('/companies', companyData);
      return response.data;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },

  // Update a company
  update: async (
    id: string,
    companyData: UpdateCompanyDto
  ): Promise<Company> => {
    try {
      const response = await apiClient.patch<Company>(
        `/companies/${id}`,
        companyData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating company ${id}:`, error);
      throw error;
    }
  },

  // Delete a company
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/companies/${id}`);
    } catch (error) {
      console.error(`Error deleting company ${id}:`, error);
      throw error;
    }
  },
};

export default companyService;
