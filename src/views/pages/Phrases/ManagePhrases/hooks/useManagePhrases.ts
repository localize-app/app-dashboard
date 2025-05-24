import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import phrasesApi from '@/api/services/phrasesService';
import { Phrase } from '@/types/phrases.types';
import { useTranslationValidation } from './useTranslationValidation';
import { ProjectLocales } from '../utils/validationHelpers';
import translationApi from '@/api/services/translationService';

export const useManagePhrases = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // State
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>(
    projectId || ''
  );
  const [activeTab, setActiveTab] = useState<string>('published');
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<Phrase[]>([]);
  const [sourceLocale] = useState<string>('en-US');
  const [targetLocale, setTargetLocale] = useState<string>('fr-CA');

  // Project locales - in a real app, this would come from the project data
  const [projectLocales] = useState<ProjectLocales>({
    required: ['fr-CA'], // These are required for publishing
    optional: ['es-ES', 'de-DE'], // These are optional
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [tabCounts, setTabCounts] = useState({
    published: 0,
    translation_qa: 0,
    pending: 0,
    archive: 0,
  });

  // Modal states
  const [modalStates, setModalStates] = useState({
    proposeModal: { visible: false, phrase: null },
    variablesModal: { visible: false, phrase: null },
    exportModal: { visible: false },
    importModal: { visible: false },
    addPhraseModal: { visible: false },
  });

  // Validation logic
  const {
    validationResult,
    validationModalVisible,
    currentOperation,
    validateAndExecute,
    hideValidationModal,
    proceedWithoutValidation,
  } = useTranslationValidation({
    projectLocales,
    onValidationPassed: async (phrases: Phrase[], operation: string) => {
      await executeBatchOperation(operation, phrases);
    },
    onValidationFailed: (result, operation) => {
      // The validation modal will be shown automatically
      console.log('Validation failed for operation:', operation, result);
    },
  });

  // Execute batch operation without validation
  const executeBatchOperation = async (
    operation: string,
    phrasesToProcess?: Phrase[]
  ) => {
    const phrasesArray = phrasesToProcess || selectedRows;

    if (phrasesArray.length === 0) {
      message.warning('No phrases selected');
      return;
    }

    try {
      setLoading(true);
      const ids = phrasesArray.map((row) => ({ id: row.id }));
      await phrasesApi.batchOperation({ operation, items: ids });

      message.success(`Successfully ${operation}ed ${ids.length} phrases`);
      refreshData();
      clearSelection();
    } catch (err) {
      console.error(`Error performing batch operation: ${operation}`, err);
      message.error('Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch phrases
  const fetchPhrases = useCallback(async () => {
    if (!selectedProject) return;

    setLoading(true);
    try {
      const params: any = {
        project: selectedProject,
        status: activeTab !== 'archive' ? activeTab : undefined,
        isArchived: activeTab === 'archive',
        search: searchText || undefined,
        page: pagination.current,
        limit: pagination.pageSize,
      };

      const response = await phrasesApi.getPhrases(params);
      setPhrases(Array.isArray(response) ? response : []);
      setPagination((prev) => ({ ...prev, total: response.length }));
      setError(null);
    } catch (err) {
      console.error('Error fetching phrases:', err);
      setError('Failed to load phrases');
      message.error('Failed to load phrases');
    } finally {
      setLoading(false);
    }
  }, [
    selectedProject,
    activeTab,
    pagination.current,
    pagination.pageSize,
    searchText,
  ]);

  // Fetch phrase counts
  const fetchPhraseCounts = useCallback(async () => {
    if (!selectedProject) return;

    try {
      const [publishedRes, pendingRes, reviewRes, archivedRes] =
        await Promise.all([
          phrasesApi.getPhrases({
            project: selectedProject,
            status: 'published',
            limit: 1000,
          }),
          phrasesApi.getPhrases({
            project: selectedProject,
            status: 'pending',
            limit: 1000,
          }),
          phrasesApi.getPhrases({
            project: selectedProject,
            status: 'needs_review',
            limit: 1000,
          }),
          phrasesApi.getPhrases({
            project: selectedProject,
            isArchived: true,
            limit: 1000,
          }),
        ]);

      setTabCounts({
        published: Array.isArray(publishedRes) ? publishedRes.length : 0,
        translation_qa: Array.isArray(reviewRes) ? reviewRes.length : 0,
        pending: Array.isArray(pendingRes) ? pendingRes.length : 0,
        archive: Array.isArray(archivedRes) ? archivedRes.length : 0,
      });
    } catch (err) {
      console.error('Error fetching phrase counts:', err);
    }
  }, [selectedProject]);

  // Handlers
  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
    setPagination((prev) => ({ ...prev, current: 1 }));
    clearSelection();
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setPagination((prev) => ({ ...prev, current: 1 }));
    clearSelection();
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleLanguageChange = (locale: string) => {
    setTargetLocale(locale);
  };

  const handleRowSelection = (selectedRows: Phrase[]) => {
    setSelectedRows(selectedRows);
  };

  const clearSelection = () => {
    setSelectedRows([]);
  };

  // Batch operation handler with validation
  const handleBatchOperation = async (
    operation: string,
    phrases?: Phrase[]
  ) => {
    const phrasesToProcess = phrases || selectedRows;

    if (operation === 'auto_translate') {
      // Handle auto-translate separately
      await handleAutoTranslate(phrasesToProcess);
      return;
    }

    // Use validation for operations that require translations
    validateAndExecute(phrasesToProcess, operation);
  };

  // Individual phrase operations with validation
  const handleUpdatePhraseStatus = async (
    phraseId: string,
    newStatus: string
  ) => {
    try {
      // For publish/approve operations, validate the single phrase
      if (['publish', 'approve'].includes(newStatus)) {
        const phrase = phrases.find((p) => p.id === phraseId);
        if (phrase) {
          validateAndExecute([phrase], newStatus);
          return;
        }
      }

      console.log(`Updating phrase ${phraseId} status to ${newStatus}`);

      // For other operations, proceed directly
      await phrasesApi.updateStatus(phraseId, newStatus);
      message.success(`Status updated to ${newStatus}`);
      refreshData();
    } catch (err) {
      console.error('Error updating phrase status:', err);
      message.error('Failed to update status');
    }
  };

  // Handle fixing translations (opens first phrase for editing)
  const handleFixTranslations = () => {
    if (validationResult && validationResult.missingTranslations.length > 0) {
      const firstPhrase = validationResult.missingTranslations[0].phrase;
      modalHandlers.showProposeModal(firstPhrase);
      hideValidationModal();
    }
  };

  // Add this new function:
  const handleAutoTranslate = async (phrases: Phrase[]) => {
    if (phrases.length === 0) {
      message.warning('No phrases selected');
      return;
    }

    try {
      setLoading(true);
      const phraseIds = phrases.map((p) => p.id);

      console.log(projectLocales);

      // Call for each target language in the project
      const promises = projectLocales.required
        .filter((locale) => locale !== sourceLocale) // Don't translate to source language
        .map((targetLang) =>
          translationApi.translateBatch({
            phraseIds,
            targetLanguage: targetLang,
            sourceLanguage: sourceLocale,
            autoApprove: false, // Always require review
            overwriteExisting: false, // Don't overwrite existing translations
          })
        );

      await Promise.all(promises);

      message.success(
        `Auto-translated ${phraseIds.length} phrases to ${projectLocales.required.length - 1} languages`
      );
      refreshData();
      clearSelection();
    } catch (err) {
      console.error('Auto-translation failed:', err);
      message.error('Auto-translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const modalHandlers = {
    showProposeModal: (phrase: Phrase) => {
      setModalStates((prev) => ({
        ...prev,
        proposeModal: { visible: true, phrase },
      }));
    },
    hideProposeModal: () => {
      setModalStates((prev) => ({
        ...prev,
        proposeModal: { visible: false, phrase: null },
      }));
    },
    showVariablesModal: (phrase: Phrase) => {
      setModalStates((prev) => ({
        ...prev,
        variablesModal: { visible: true, phrase },
      }));
    },
    hideVariablesModal: () => {
      setModalStates((prev) => ({
        ...prev,
        variablesModal: { visible: false, phrase: null },
      }));
    },
    showExportModal: () => {
      setModalStates((prev) => ({
        ...prev,
        exportModal: { visible: true },
      }));
    },
    hideExportModal: () => {
      setModalStates((prev) => ({
        ...prev,
        exportModal: { visible: false },
      }));
    },
    showImportModal: () => {
      setModalStates((prev) => ({
        ...prev,
        importModal: { visible: true },
      }));
    },
    hideImportModal: () => {
      setModalStates((prev) => ({
        ...prev,
        importModal: { visible: false },
      }));
    },
    showAddPhrase: () => {
      setModalStates((prev) => ({
        ...prev,
        addPhraseModal: { visible: true },
      }));
    },
    hideAddPhrase: () => {
      setModalStates((prev) => ({
        ...prev,
        addPhraseModal: { visible: false },
      }));
    },
  };

  const refreshData = () => {
    fetchPhrases();
    fetchPhraseCounts();
  };

  // Effects
  useEffect(() => {
    if (selectedProject) {
      refreshData();
    }
  }, [selectedProject, fetchPhrases, fetchPhraseCounts]);

  return {
    // State
    phrases,
    loading,
    error,
    selectedProject,
    activeTab,
    searchText,
    selectedRows,
    pagination,
    tabCounts,
    sourceLocale,
    targetLocale,
    projectLocales,

    // Validation
    validationResult,
    validationModalVisible,
    currentOperation,

    // Handlers
    handleProjectChange,
    handleTabChange,
    handleSearch,
    handleLanguageChange,
    handleRowSelection,
    handleBatchOperation,
    handleUpdatePhraseStatus,
    handleFixTranslations,
    handleAutoTranslate,
    clearSelection,
    hideValidationModal,
    proceedWithoutValidation: () => proceedWithoutValidation(selectedRows),

    // Modal states and handlers
    modalStates,
    modalHandlers,

    // Utils
    refreshData,
  };
};
