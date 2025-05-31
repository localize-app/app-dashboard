// src/types/company.types.ts

export interface Company {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  projects?: string[]; // Array of project IDs
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCompanyDto {
  name: string;
  description?: string;
  projects?: string[];
}

export interface UpdateCompanyDto {
  name?: string;
  description?: string;
  projects?: string[];
}
