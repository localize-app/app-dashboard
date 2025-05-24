import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { Phrase } from '@/types/phrases.types';

interface DefineVariablesModalProps {
  visible: boolean;
  phrase: Phrase | null;
  onCancel: () => void;
}

const DefineVariablesModal: React.FC<DefineVariablesModalProps> = ({
  visible,
  phrase,
  onCancel,
}) => {
  const [variables, setVariables] = useState<string[]>([]);

  useEffect(() => {
    if (phrase && visible) {
      // Extract variables from the source text
      const detectedVariables = (
        phrase.sourceText.match(/\{\{.*?\}\}/g) || []
      ).map((v) => v.replace(/\{\{|\}\}/g, ''));
      setVariables(detectedVariables);
    }
  }, [phrase, visible]);

  return (
    <Modal
      title="Define Variables"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
      width={500}
    >
      {phrase && (
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Source:</div>
            <div className="p-3 border rounded bg-gray-50">
              {phrase.sourceText}
            </div>
          </div>

          {variables.length > 0 ? (
            <div>
              <div className="text-sm text-gray-500 mb-2">
                Variables detected:
              </div>
              <div className="space-y-2">
                {variables.map((variable, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 border rounded"
                  >
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
                      {`{{${variable}}}`}
                    </div>
                    <div className="ml-2 text-gray-500">
                      Keep this variable unchanged in your translation
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">
              No variables detected in this phrase.
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default DefineVariablesModal;
