// src/views/pages/Phrases/ManagePhrases/components/BatchActionToolbar.tsx (Updated with validation)
import React from 'react';
import { Button, Space, Popconfirm, Divider, Tooltip } from 'antd';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Phrase } from '@/types/phrases.types';

export interface BatchAction {
  key: string;
  label: string;
  operation: string;
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  confirmMessage?: string;
  icon?: React.ReactNode;
  requiresTranslation?: boolean;
}

interface BatchActionToolbarProps {
  selectedCount: number;
  selectedPhrases: Phrase[];
  activeTab: string;
  batchActions: BatchAction[];
  projectLocales: { required: string[]; optional: string[] };
  onBatchOperation: (operation: string, phrases: Phrase[]) => void;
  onClearSelection?: () => void;
}

const BatchActionToolbar: React.FC<BatchActionToolbarProps> = ({
  selectedCount,
  selectedPhrases,
  activeTab,
  batchActions,
  projectLocales,
  onBatchOperation,
  onClearSelection,
}) => {
  // Check if phrases have required translations for publish/approve actions
  const getActionValidation = (action: BatchAction) => {
    if (!action.requiresTranslation) {
      return { isValid: true, invalidCount: 0 };
    }

    let invalidCount = 0;
    selectedPhrases.forEach((phrase) => {
      const hasAllTranslations = projectLocales.required.map((locale, i) => {
        const translation = phrase.translations?.[locale];
        return translation && translation.text?.trim();
      });

      if (!hasAllTranslations) {
        invalidCount++;
      }
    });

    return {
      isValid: invalidCount === 0,
      invalidCount,
    };
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-blue-800 font-medium">
            {selectedCount} phrase{selectedCount > 1 ? 's' : ''} selected
          </span>
          {onClearSelection && (
            <>
              <Divider type="vertical" />
              <Button
                type="link"
                size="small"
                icon={<CloseOutlined />}
                onClick={onClearSelection}
                className="text-blue-600 p-0"
              >
                Clear selection
              </Button>
            </>
          )}
        </div>

        <Space>
          {batchActions.map((action) => {
            const validation = getActionValidation(action);
            const isDisabled =
              action.requiresTranslation && !validation.isValid;

            const buttonContent = (
              <Button
                key={action.key}
                type={action.type || 'default'}
                size="small"
                icon={action.icon}
                disabled={isDisabled}
                onClick={() =>
                  onBatchOperation(action.operation, selectedPhrases)
                }
              >
                {action.label}
                {isDisabled && (
                  <ExclamationCircleOutlined className="ml-1 text-orange-500" />
                )}
              </Button>
            );

            console.log(isDisabled);

            // Wrap with tooltip if validation failed
            if (isDisabled) {
              return (
                <Tooltip
                  key={action.key}
                  title={`${validation.invalidCount} phrase${validation.invalidCount > 1 ? 's' : ''} missing required translations`}
                  placement="top"
                >
                  {buttonContent}
                </Tooltip>
              );
            }

            // Wrap with confirmation if needed
            if (action.confirmMessage && !isDisabled) {
              return (
                <Popconfirm
                  key={action.key}
                  title={action.confirmMessage}
                  description={`This action will affect ${selectedCount} phrase${selectedCount > 1 ? 's' : ''}.`}
                  onConfirm={() =>
                    onBatchOperation(action.operation, selectedPhrases)
                  }
                  okText="Yes"
                  cancelText="No"
                  placement="topRight"
                >
                  {buttonContent}
                </Popconfirm>
              );
            }

            return buttonContent;
          })}
        </Space>
      </div>
    </div>
  );
};

export default BatchActionToolbar;
