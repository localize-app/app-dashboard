import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { useParams } from 'react-router-dom';

import { Phrase } from '@/types/phrases.types';
import { ProjectLocales } from '../utils/validationHelpers';
import { useTranslationValidation } from './useTranslationValidation';

import phrasesApi from '@/api/services/phrasesService';
import translationApi from '@/api/services/translationService';
import apiServices from '@/api/apiServices';

export const useManagePhrases = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // State
  const [projectData, setProjectData] = useState<any>(null);

  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>(
    projectId || ''
  );
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<Phrase[]>([]);
  const [sourceLocale, setSourceLocale] = useState<string>('');
  const [targetLocale, setTargetLocale] = useState<string>('');

  // Project locales - in a real app, this would come from the project data
  const [projectLocales, setProjectLocales] = useState<ProjectLocales>({
    sourceLocale: '',
    supportedLocales: [],
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [tabCounts, setTabCounts] = useState({
    ready: 0,
    needs_attention: 0,
    pending: 0,
    untranslated: 0,
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

  // Fetch projects
  const fetchProjectById = async (projectId: string) => {
    if (!projectId) return;

    setLoading(true);
    try {
      // Fetch projects with params
      const response = await apiServices.projects.getById(projectId);

      setProjectData(response);
      setSourceLocale(response.sourceLocale ?? '');

      // Get target locales (exclude source locale from supported locales)
      const sourceLocale = response.sourceLocale ?? '';
      const supportedLocales = response.supportedLocales ?? [];
      const targetLocales = supportedLocales.filter(
        (locale: string) => locale !== sourceLocale
      );

      // Auto-select first target locale if none is currently selected and target locales exist
      let selectedTargetLocale = targetLocale;
      if (!targetLocale && targetLocales.length) {
        selectedTargetLocale = targetLocales[0];

        setTargetLocale(selectedTargetLocale);
      }

      setProjectLocales({
        sourceLocale: sourceLocale,
        supportedLocales: supportedLocales,
        targetLocale: selectedTargetLocale,
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project. Please try again.');
      message.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refresh when filters change
  useEffect(() => {
    if (!selectedProject) return;

    fetchProjectById(selectedProject);
  }, [selectedProject]);

  // Validation logic
  const {
    validationResult,
    validationModalVisible,
    currentOperation,
    validateAndExecute,
    hideValidationModal,
    proceedWithoutValidation,
  } = useTranslationValidation({
    selectedProject,
    targetLocale,
    projectLocales: { ...projectLocales, targetLocale },
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

      // Map phrases to items, handling both id and _id fields
      const items = phrasesArray.map((row) => {
        // Use id if available, otherwise use _id
        const phraseId = row.id || row._id;

        if (!phraseId) {
          console.error('Phrase without ID found:', row);
          throw new Error('One or more phrases are missing IDs');
        }

        return { id: phraseId };
      });

      // Map frontend operations to backend operations
      const operationMapping: Record<string, string> = {
        publish: 'approve_translations',
        approve: 'approve_translations',
        reject: 'reject_translations',
        archive: 'archive',
        delete: 'delete',
        unpublish: 'reject_translations',
        send_for_review: 'reject_translations',
        restore: 'archive',
      };

      const backendOperation = operationMapping[operation] || operation;

      // Prepare batch operation params according to Swagger spec
      const batchParams: any = {
        operation: backendOperation,
        items,
      };

      // Add locale for translation operations
      if (
        ['approve_translations', 'reject_translations'].includes(
          backendOperation
        )
      ) {
        batchParams.locale = targetLocale;
      }

      await phrasesApi.batchOperation(batchParams);

      message.success(`Successfully ${operation}ed ${items.length} phrases`);
      refreshData();
      clearSelection();
    } catch (err: any) {
      console.error(`Error performing batch operation: ${operation}`, err);

      // More detailed error messages
      if (err.response?.data?.message) {
        message.error(`Operation failed: ${err.response.data.message}`);
      } else if (err.message) {
        message.error(`Operation failed: ${err.message}`);
      } else {
        message.error('Operation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch phrases using the correct endpoints
  const fetchPhrases = useCallback(async () => {
    if (!selectedProject && !targetLocale) return;

    setLoading(true);
    try {
      let response;

      // Use the by-status endpoint for specific statuses
      if (
        [
          'pending',
          'approved',
          'needs_attention',
          'ready',
          'untranslated',
        ].includes(activeTab)
      ) {
        response = await phrasesApi.getPhrasesByStatus(
          selectedProject,
          activeTab as any,
          {
            locale: targetLocale,
            page: pagination.current,
            limit: pagination.pageSize,
          }
        );
      } else {
        // Use the general phrases endpoint for other cases
        const params: any = {
          project: selectedProject,
          page: pagination.current,
          limit: pagination.pageSize,
          search: searchText || undefined,
        };

        // Handle archive status
        if (activeTab === 'archive') {
          params.isArchived = true;
        } else if (activeTab === 'needs_review') {
          params.translationStatus = 'needs_review';
          params.locale = targetLocale;
        }

        response = await phrasesApi.getPhrases(params);
      }

      // Handle the response based on its structure
      let phrasesData = [];
      let totalCount = 0;

      // Check if response has the new API structure with data and pagination
      if (response && response.data && response.pagination) {
        phrasesData = response.data;
        totalCount = response.pagination.total;
      } else if (Array.isArray(response)) {
        // Fallback for old API structure
        phrasesData = response;
        totalCount = response.length;
      } else {
        console.warn('Unexpected response structure:', response);
        phrasesData = [];
        totalCount = 0;
      }

      // Ensure each phrase has an id field (not just _id)
      const normalizedPhrases = phrasesData.map((phrase: any) => ({
        ...phrase,
        id: phrase.id || phrase._id, // Ensure id is always present
      }));

      setPhrases(normalizedPhrases);
      setPagination((prev) => ({
        ...prev,
        total: totalCount,
        current: pagination.current,
        pageSize: pagination.pageSize,
      }));
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
    targetLocale,
    pagination.current,
    pagination.pageSize,
    searchText,
  ]);

  // Fetch phrase counts using the stats endpoint
  const fetchPhraseCounts = useCallback(async () => {
    if (!selectedProject) return;

    try {
      const stats = await phrasesApi.getPhraseStats(selectedProject);

      setTabCounts({
        ready: stats.ready || 0,
        needs_attention: stats.needsAttention || 0,
        pending: stats.pending || 0,
        untranslated: stats.untranslated || 0,
        archive: 0, // Would need separate call for archived phrases
      });
    } catch (err) {
      console.error('Error fetching phrase counts:', err);
      // Fallback to individual calls if stats endpoint fails
      try {
        const [pendingRes, approvedRes, needsReviewRes] = await Promise.all([
          phrasesApi.getPhrasesByStatus(selectedProject, 'pending', {
            limit: 1000,
          }),
          phrasesApi.getPhrasesByStatus(selectedProject, 'ready', {
            limit: 1000,
          }),
          phrasesApi.getPhrasesByStatus(selectedProject, 'needs_attention', {
            limit: 1000,
          }),
        ]);

        setTabCounts({
          ready: Array.isArray(approvedRes) ? approvedRes.length : 0,
          needs_attention: Array.isArray(needsReviewRes)
            ? needsReviewRes.length
            : 0,
          pending: Array.isArray(pendingRes) ? pendingRes.length : 0,
          untranslated: 0, // Would need separate call
          archive: 0, // Would need separate call with isArchived=true
        });
      } catch (fallbackErr) {
        console.error('Error fetching phrase counts (fallback):', fallbackErr);
      }
    }
  }, [selectedProject]);

  // handlePaginationChange
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
    clearSelection();
  };

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

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const refreshData = useCallback(() => {
    if (selectedProject && targetLocale) {
      fetchPhrases();
      fetchPhraseCounts();
    }
  }, [fetchPhrases, fetchPhraseCounts]);

  // Also update the handleLanguageChange function to ensure projectLocales is updated:
  const handleLanguageChange = useCallback(
    (locale: string) => {
      setTargetLocale(locale);
      setProjectLocales((prev) => ({
        ...prev,
        targetLocale: locale,
      }));

      // Clear selection when language changes
      clearSelection();

      // Reset pagination when changing language
      setPagination((prev) => ({ ...prev, current: 1 }));
    },
    [clearSelection]
  );

  const handleRowSelection = (selectedRows: Phrase[]) => {
    setSelectedRows(selectedRows);
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

      // Map frontend status to backend status
      const statusMapping: Record<string, string> = {
        publish: 'published',
        unpublish: 'pending',
        approve: 'published',
        reject: 'rejected',
      };

      const backendStatus = statusMapping[newStatus] || newStatus;

      // For other operations, proceed directly using the status endpoint
      await phrasesApi.updateStatus(phraseId, backendStatus as any);
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

  // Auto-translate using the translation service
  const handleAutoTranslate = async (phrases: Phrase[]) => {
    if (phrases.length === 0) {
      message.warning('No phrases selected');
      return;
    }

    try {
      setLoading(true);
      const phraseIds = phrases.map((p) => p.id);

      // Call for each target language in the project
      const promises = projectLocales.supportedLocales
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
        `Auto-translated ${phraseIds.length} phrases to ${projectLocales.supportedLocales.length - 1} languages`
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

  // Effects
  useEffect(() => {
    if (selectedProject) {
      refreshData();
    }
  }, [selectedProject, targetLocale, fetchPhrases, fetchPhraseCounts]);

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
    handlePaginationChange,
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
