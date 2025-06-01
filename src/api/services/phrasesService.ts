// src/api/services/phrasesService.ts - Updated with correct Swagger endpoints
import apiClient from '../apiClient';

export interface QueryParams {
  project?: string;
  limit?: number;
  page?: number;
  tags?: string;
  search?: string;
  isArchived?: boolean;
  locale?: string;
  translationStatus?: 'pending' | 'approved' | 'rejected' | 'needs_review';
}

export interface TranslationParams {
  text: string;
  status?: 'pending' | 'approved' | 'rejected' | 'needs_review';
  isHuman?: boolean;
}

export interface BatchOperationParams {
  operation:
    | 'approve_translations'
    | 'reject_translations'
    | 'archive'
    | 'delete'
    | 'tag'
    | 'untag';
  items: { id: string }[];
  tag?: string; // For tag/untag operations
  locale?: string; // For translation operations
}

export interface CreatePhraseParams {
  key: string;
  sourceText: string;
  context?: string;
  project: string;
  isArchived?: boolean;
  translations?: Record<string, TranslationParams>;
  tags?: string[];
  sourceUrl?: string;
  screenshot?: string;
}

export interface UpdatePhraseParams {
  key?: string;
  sourceText?: string;
  context?: string;
  project?: string;
  isArchived?: boolean;
  translations?: Record<string, TranslationParams>;
  tags?: string[];
  sourceUrl?: string;
  screenshot?: string;
}

export interface PhraseStats {
  total: number;
  untranslated: number;
  pending: number;
  approved: number;
  needsAttention: number;
  ready: number;
  byLocale: Record<
    string,
    {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
      needsReview: number;
    }
  >;
}

const phrasesApi = {
  // Get phrases with filtering and pagination
  getPhrases: async (params: QueryParams = {}) => {
    try {
      const response = await apiClient.get('/phrases', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching phrases:', error);
      throw error;
    }
  },

  // Get phrases by overall status (new endpoint from Swagger)
  getPhrasesByStatus: async (
    projectId: string,
    status:
      | 'pending'
      | 'approved'
      | 'needs_attention'
      | 'ready'
      | 'untranslated',
    options: {
      locale?: string;
      page?: number;
      limit?: number;
    } = {}
  ) => {
    try {
      const response = await apiClient.get(
        `/phrases/by-status/${projectId}/${status}`,
        {
          params: options,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching phrases by status:', error);
      throw error;
    }
  },

  // Get phrase statistics for a project
  getPhraseStats: async (projectId: string): Promise<PhraseStats> => {
    try {
      const response = await apiClient.get<PhraseStats>(
        `/phrases/stats/${projectId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching phrase stats:', error);
      throw error;
    }
  },

  // Get a single phrase by ID
  getPhrase: async (id: string) => {
    try {
      const response = await apiClient.get(`/phrases/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching phrase ${id}:`, error);
      throw error;
    }
  },

  // Create a new phrase
  createPhrase: async (data: CreatePhraseParams) => {
    try {
      const response = await apiClient.post('/phrases', data);
      return response.data;
    } catch (error) {
      console.error('Error creating phrase:', error);
      throw error;
    }
  },

  // Update a phrase
  updatePhrase: async (id: string, data: UpdatePhraseParams) => {
    try {
      const response = await apiClient.patch(`/phrases/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating phrase ${id}:`, error);
      throw error;
    }
  },

  // Update phrase status (specific endpoint for status updates)
  updateStatus: async (
    id: string,
    status: 'published' | 'pending' | 'needs_review' | 'rejected' | 'archived'
  ) => {
    try {
      const response = await apiClient.patch(`/phrases/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating phrase status ${id}:`, error);
      throw error;
    }
  },

  // Delete a phrase
  deletePhrase: async (id: string) => {
    try {
      await apiClient.delete(`/phrases/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting phrase ${id}:`, error);
      throw error;
    }
  },

  // Add or update a translation for a phrase
  addTranslation: async (
    phraseId: string,
    locale: string,
    translation: TranslationParams
  ) => {
    try {
      const response = await apiClient.post(
        `/phrases/${phraseId}/translations/${locale}`,
        translation
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding translation for phrase ${phraseId}:`, error);
      throw error;
    }
  },

  // Batch operations on phrases (updated with correct operations)
  batchOperation: async (batchParams: BatchOperationParams) => {
    try {
      const response = await apiClient.post('/phrases/batch', batchParams);
      return response.data;
    } catch (error) {
      console.error('Error performing batch operation:', error);
      throw error;
    }
  },

  // Export phrases to a file
  exportPhrases: async (
    projectId: string,
    format: 'json' | 'csv' | 'xlsx' = 'json',
    options?: {
      locales?: string; // comma-separated locale codes
      status?: string; // comma-separated status values
    }
  ) => {
    try {
      // Build query parameters according to Swagger spec
      const params: Record<string, any> = {
        project: projectId,
        format,
      };

      if (options?.locales) {
        params.locales = options.locales;
      }

      if (options?.status) {
        params.status = options.status;
      }

      // Make a request with blob response type to get file
      const response = await apiClient.get('/phrases/export', {
        params,
        responseType: 'blob',
      });

      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Get filename from headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'phrases_export.' + format;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=(.+)/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1].replace(/"/g, '');
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return true;
    } catch (error) {
      console.error('Error exporting phrases:', error);
      throw error;
    }
  },

  // Import phrases from a file
  importPhrases: async (
    projectId: string,
    file: File,
    options?: { overwrite?: boolean }
  ) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('project', projectId);

      if (options?.overwrite !== undefined) {
        formData.append('overwrite', options.overwrite.toString());
      }

      const response = await apiClient.post('/phrases/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error importing phrases:', error);
      throw error;
    }
  },

  // Extract phrases (batch extract endpoint from Swagger)
  extractPhrases: async (data: any) => {
    try {
      const response = await apiClient.post('/phrases/batch-extract', data);
      return response.data;
    } catch (error) {
      console.error('Error extracting phrases:', error);
      throw error;
    }
  },
};

export default phrasesApi;
