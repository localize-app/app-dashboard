// src/api/services/translationService.ts
import apiClient from '../apiClient';

export interface TranslationParams {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface BatchTranslationParams {
  texts: string[];
  targetLanguage: string;
  sourceLanguage?: string;
}

const translationApi = {
  // Translate a single text
  translateText: async (params: TranslationParams): Promise<any> => {
    try {
      const response = await apiClient.post('/translate', params);
      return response.data;
    } catch (error) {
      console.error('Error translating text:', error);
      throw error;
    }
  },

  // Translate multiple texts
  translateBatch: async (data: {
    phraseIds: string[];
    targetLanguage: string;
    sourceLanguage?: string;
    autoApprove?: boolean;
    overwriteExisting?: boolean;
  }) => {
    try {
      const response = await apiClient.post('/translate/phrases/batch', data);
      return response.data.translatedTexts;
    } catch (error) {
      console.error('Error batch translating texts:', error);
      throw error;
    }
  },
};

export default translationApi;
