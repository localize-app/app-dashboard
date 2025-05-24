// src/views/pages/Phrases/ManagePhrases/utils/validationHelpers.ts
import { Phrase } from '@/types/phrases.types';

export interface ValidationResult {
  isValid: boolean;
  invalidPhrases: Phrase[];
  missingTranslations: Array<{
    phrase: Phrase;
    missingLocales: string[];
  }>;
  message?: string;
}

export interface ProjectLocales {
  required: string[]; // Required locales for the project
  optional: string[]; // Optional locales
}

/**
 * Validates if phrases can be published based on translation requirements
 */
export const validatePhrasesForPublishing = (
  phrases: Phrase[],
  projectLocales: ProjectLocales
): ValidationResult => {
  const invalidPhrases: Phrase[] = [];
  const missingTranslations: Array<{
    phrase: Phrase;
    missingLocales: string[];
  }> = [];

  phrases.forEach((phrase) => {
    const missingLocales: string[] = [];

    // Check if phrase has translations for all required locales
    projectLocales.required.forEach((locale) => {
      const translation = phrase.translations?.[locale];

      // Translation is missing or empty
      if (!translation || !translation.text?.trim()) {
        missingLocales.push(locale);
      }
    });

    if (missingLocales.length > 0) {
      invalidPhrases.push(phrase);
      missingTranslations.push({
        phrase,
        missingLocales,
      });
    }
  });

  const isValid = invalidPhrases.length === 0;

  let message = '';
  if (!isValid) {
    const count = invalidPhrases.length;
    message = `${count} phrase${count > 1 ? 's' : ''} cannot be published because ${count > 1 ? 'they are' : 'it is'} missing required translations.`;
  }

  return {
    isValid,
    invalidPhrases,
    missingTranslations,
    message,
  };
};

/**
 * Get human-readable locale names
 */
export const getLocaleDisplayName = (locale: string): string => {
  const localeMap: Record<string, string> = {
    'en-US': 'English (US)',
    'en-GB': 'English (UK)',
    'fr-FR': 'French (France)',
    'fr-CA': 'French (Canada)',
    'es-ES': 'Spanish (Spain)',
    'es-MX': 'Spanish (Mexico)',
    'de-DE': 'German',
    'it-IT': 'Italian',
    'pt-BR': 'Portuguese (Brazil)',
    'zh-CN': 'Chinese (Simplified)',
    'ja-JP': 'Japanese',
    'ko-KR': 'Korean',
  };

  return localeMap[locale] || locale;
};
