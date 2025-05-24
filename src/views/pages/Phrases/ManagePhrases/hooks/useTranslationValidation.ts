// src/views/pages/Phrases/ManagePhrases/hooks/useTranslationValidation.ts
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { Phrase } from '@/types/phrases.types';
import {
  validatePhrasesForPublishing,
  ValidationResult,
  ProjectLocales,
} from '../utils/validationHelpers';

interface UseTranslationValidationProps {
  projectLocales: ProjectLocales;
  onValidationPassed: (phrases: Phrase[], operation: string) => void;
  onValidationFailed: (result: ValidationResult, operation: string) => void;
}

export const useTranslationValidation = ({
  projectLocales,
  onValidationPassed,
  onValidationFailed,
}: UseTranslationValidationProps) => {
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [currentOperation, setCurrentOperation] = useState<string>('');
  const [validationModalVisible, setValidationModalVisible] = useState(false);

  const validateAndExecute = useCallback(
    (phrases: Phrase[], operation: string, skipValidation: boolean = false) => {
      // Skip validation for operations that don't require translations
      if (skipValidation || !['publish', 'approve'].includes(operation)) {
        onValidationPassed(phrases, operation);
        return;
      }

      // Validate translations
      const result = validatePhrasesForPublishing(phrases, projectLocales);

      if (result.isValid) {
        onValidationPassed(phrases, operation);
      } else {
        setValidationResult(result);
        setCurrentOperation(operation);
        setValidationModalVisible(true);
        onValidationFailed(result, operation);
      }
    },
    [projectLocales, onValidationPassed, onValidationFailed]
  );

  const hideValidationModal = () => {
    setValidationModalVisible(false);
    setValidationResult(null);
    setCurrentOperation('');
  };

  const proceedWithoutValidation = useCallback(
    (phrases: Phrase[]) => {
      hideValidationModal();
      onValidationPassed(phrases, currentOperation);
    },
    [currentOperation, onValidationPassed]
  );

  return {
    validationResult,
    validationModalVisible,
    currentOperation,
    validateAndExecute,
    hideValidationModal,
    proceedWithoutValidation,
  };
};
