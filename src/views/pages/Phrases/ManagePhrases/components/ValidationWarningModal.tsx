// src/views/pages/Phrases/ManagePhrases/components/ValidationWarningModal.tsx
import React from 'react';
import { Modal, Alert, Table, Tag, Typography, Space, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  ValidationResult,
  getLocaleDisplayName,
} from '../utils/validationHelpers';

const { Paragraph } = Typography;

interface ValidationWarningModalProps {
  visible: boolean;
  validationResult: ValidationResult | null;
  operation: 'publish' | 'approve';
  onCancel: () => void;
  onAutoTranslate?: () => void;
  onProceedAnyway?: () => void;
  onFixTranslations: () => void;
}

const ValidationWarningModal: React.FC<ValidationWarningModalProps> = ({
  visible,
  validationResult,
  operation,
  onCancel,
  onAutoTranslate,
  onProceedAnyway,
  onFixTranslations,
}) => {
  if (!validationResult || validationResult.isValid) return null;

  const columns = [
    {
      title: 'Phrase',
      dataIndex: 'phrase',
      key: 'phrase',
      render: (phrase: any) => (
        <div>
          <div className="font-medium">{phrase.sourceText}</div>
          {phrase.key && (
            <div className="text-xs text-gray-500">{phrase.key}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Missing Translations',
      dataIndex: 'missingLocales',
      key: 'missingLocales',
      render: (locales: string[]) => (
        <Space wrap>
          {locales.map((locale) => (
            <Tag key={locale} color="red">
              {getLocaleDisplayName(locale)}
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  const operationText = operation === 'publish' ? 'published' : 'approved';
  const operationAction = operation === 'publish' ? 'Publishing' : 'Approving';

  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined className="text-orange-500" />
          <span>Translation Validation Warning</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="fix" type="primary" onClick={onFixTranslations}>
          Fix Translations
        </Button>,

        <Button key="auto-translate" type="primary" onClick={onAutoTranslate}>
          Auto-translate Missing
        </Button>,

        ...(onProceedAnyway
          ? [
              <Button
                key="proceed"
                type="default"
                danger
                onClick={onProceedAnyway}
              >
                {operationAction} Anyway
              </Button>,
            ]
          : []),
      ]}
    >
      <div className="space-y-4">
        <Alert
          message={`Cannot ${operation} phrases with missing translations`}
          description={validationResult.message}
          type="warning"
          showIcon
        />

        <div>
          <Paragraph>
            The following phrases are missing required translations and cannot
            be {operationText}:
          </Paragraph>

          <Table
            columns={columns}
            dataSource={validationResult.missingTranslations}
            rowKey={(record) => record.phrase.id}
            pagination={false}
            size="small"
            scroll={{ y: 300 }}
          />
        </div>

        <Alert
          message="What would you like to do?"
          description={
            <div className="mt-2">
              <div>
                • <strong>Fix Translations:</strong> Add missing translations
                before publishing
              </div>
              {onProceedAnyway && (
                <div>
                  • <strong>{operationAction} Anyway:</strong> Proceed without
                  translations (not recommended)
                </div>
              )}
            </div>
          }
          type="info"
          showIcon
        />
      </div>
    </Modal>
  );
};

export default ValidationWarningModal;
