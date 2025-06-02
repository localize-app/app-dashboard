import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { Phrase } from '@/types/phrases.types';
import {
  validatePhrasesForPublishing,
  ValidationResult,
} from '../utils/validationHelpers';
import apiServices from '@/api/apiServices';

interface UseTranslationValidationProps {
  targetLocale: string; // The target locale for validation
  selectedProject: string; // The currently selected project ID
  onValidationPassed: (phrases: Phrase[], operation: string) => void;
  onValidationFailed: (result: ValidationResult, operation: string) => void;
}

export const useTranslationValidation = ({
  targetLocale,
  selectedProject,
  onValidationPassed,
  onValidationFailed,
}: UseTranslationValidationProps) => {
  const [projectLocales, setProjectLocales] = useState<any>(null);

  // Fetch projects
  const fetchProjectById = async (projectId: string) => {
    if (!projectId) return;

    try {
      // Fetch projects with params
      const response = await apiServices.projects.getById(projectId);

      setProjectLocales({
        sourceLocale: response.sourceLocale ?? '',
        supportedLocales: response.supportedLocales ?? [],
        targetLocale,
      });
    } catch (err) {
      console.error('Error fetching project:', err);
      message.error('Failed to load project');
    }
  };

  // Initial load and refresh when filters change
  useEffect(() => {
    if (selectedProject) {
      fetchProjectById(selectedProject);
    }
  }, [selectedProject]);

  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [currentOperation, setCurrentOperation] = useState<string>('');
  const [validationModalVisible, setValidationModalVisible] = useState(false);

  const validateAndExecute = useCallback(
    (phrases: Phrase[], operation: string, skipValidation: boolean = false) => {
      // Skip validation for operations that don't require translations
      if (skipValidation || !['approve_translations'].includes(operation)) {
        onValidationPassed(phrases, operation);
        return;
      }

      // Validate translations
      const result = validatePhrasesForPublishing(phrases, {
        ...projectLocales,
        targetLocale,
      });

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
