// src/views/pages/Phrases/ManagePhrases/components/PhrasesModals.tsx
import React from 'react';

import ProposeTranslationModal from './modals/ProposeTranslationModal';
import DefineVariablesModal from './modals/DefineVariablesModal';
import ExportModal from './modals/ExportModal';
import ImportModal from './modals/ImportModal';
import AddPhraseModal from './modals/AddPhraseModal';

interface PhrasesModalsProps {
  modalStates: {
    proposeModal: { visible: boolean; phrase: any };
    variablesModal: { visible: boolean; phrase: any };
    exportModal: { visible: boolean };
    importModal: { visible: boolean };
    addPhraseModal: { visible: boolean };
  };
  modalHandlers: {
    hideProposeModal: () => void;
    hideVariablesModal: () => void;
    hideExportModal: () => void;
    hideImportModal: () => void;
    hideAddPhrase: () => void;
  };
  targetLocale: string;
  selectedProject: string;
  onSuccess: () => void;
}

const PhrasesModals: React.FC<PhrasesModalsProps> = ({
  modalStates,
  modalHandlers,
  targetLocale,
  selectedProject,
  onSuccess,
}) => {
  return (
    <>
      <ProposeTranslationModal
        visible={modalStates.proposeModal.visible}
        phrase={modalStates.proposeModal.phrase}
        targetLocale={targetLocale}
        onCancel={modalHandlers.hideProposeModal}
        onSuccess={() => {
          modalHandlers.hideProposeModal();
          onSuccess();
        }}
      />

      <DefineVariablesModal
        visible={modalStates.variablesModal.visible}
        phrase={modalStates.variablesModal.phrase}
        onCancel={modalHandlers.hideVariablesModal}
      />

      <ExportModal
        visible={modalStates.exportModal.visible}
        projectId={selectedProject}
        onCancel={modalHandlers.hideExportModal}
        onSuccess={() => {
          modalHandlers.hideExportModal();
        }}
      />

      <ImportModal
        visible={modalStates.importModal.visible}
        projectId={selectedProject}
        onCancel={modalHandlers.hideImportModal}
        onSuccess={() => {
          modalHandlers.hideImportModal();
          onSuccess();
        }}
      />

      <AddPhraseModal
        visible={modalStates.addPhraseModal.visible}
        projectId={selectedProject}
        onCancel={modalHandlers.hideAddPhrase}
        onSuccess={() => {
          modalHandlers.hideAddPhrase();
          onSuccess();
        }}
      />
    </>
  );
};

export default PhrasesModals;
