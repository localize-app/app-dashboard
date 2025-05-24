// src/views/pages/Phrases/ManagePhrases/ManagePhrases.tsx (Updated main component)
import React from 'react';

import ProjectSelector from '@/views/components/ProjectSelector';
import { useManagePhrases } from '@/views/pages/phrases/ManagePhrases/hooks/useManagePhrases';
import PhrasesHeader from '@/views/pages/phrases/ManagePhrases/components/PhrasesHeader';
import PhrasesSidebar from '@/views/pages/phrases/ManagePhrases/components/PhrasesSidebar';
import PhrasesModals from '@/views/pages/phrases/ManagePhrases/components/PhrasesModals';
import PhrasesTable from '@/views/pages/phrases/ManagePhrases/components/PhrasesTable';
import ValidationWarningModal from '@/views/pages/phrases/ManagePhrases/components/ValidationWarningModal';

const ManagePhrases: React.FC = () => {
  const {
    // State
    selectedProject,
    loading,
    error,
    phrases,
    pagination,
    selectedRows,
    activeTab,
    tabCounts,
    searchText,
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
    clearSelection,
    hideValidationModal,
    proceedWithoutValidation,

    // Modal states and handlers
    modalStates,
    modalHandlers,

    // Utils
    refreshData,
  } = useManagePhrases();

  return (
    <div className="p-4">
      <ProjectSelector onProjectSelect={handleProjectChange}>
        <PhrasesHeader
          selectedProject={selectedProject}
          onAddPhrase={() => modalHandlers.showAddPhrase()}
        />

        <div className="flex gap-4">
          <PhrasesSidebar
            activeTab={activeTab}
            tabCounts={tabCounts}
            sourceLocale={sourceLocale}
            targetLocale={targetLocale}
            onTabChange={handleTabChange}
            onLanguageChange={handleLanguageChange}
          />

          <PhrasesTable
            phrases={phrases}
            loading={loading}
            pagination={pagination}
            selectedRows={selectedRows}
            activeTab={activeTab}
            searchText={searchText}
            targetLocale={targetLocale}
            projectLocales={projectLocales}
            onSearch={handleSearch}
            onRowSelection={handleRowSelection}
            onBatchOperation={handleBatchOperation}
            onUpdateStatus={handleUpdatePhraseStatus}
            onProposeTranslation={modalHandlers.showProposeModal}
            onDefineVariables={modalHandlers.showVariablesModal}
            onExport={modalHandlers.showExportModal}
            onClearSelection={clearSelection}
          />
        </div>

        {/* All Modals */}
        <PhrasesModals
          modalStates={modalStates}
          modalHandlers={modalHandlers}
          targetLocale={targetLocale}
          selectedProject={selectedProject}
          onSuccess={refreshData}
        />

        {/* Validation Warning Modal */}
        <ValidationWarningModal
          visible={validationModalVisible}
          validationResult={validationResult}
          operation={currentOperation as 'publish' | 'approve'}
          onCancel={hideValidationModal}
          onProceedAnyway={proceedWithoutValidation}
          onFixTranslations={handleFixTranslations}
        />
      </ProjectSelector>
    </div>
  );
};

export default ManagePhrases;
