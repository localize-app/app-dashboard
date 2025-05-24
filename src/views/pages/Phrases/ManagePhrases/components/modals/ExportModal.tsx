// src/views/pages/Phrases/ManagePhrases/components/modals/ExportModal.tsx
import React, { useState } from 'react';
import { Modal, Form, Select, Radio, Checkbox, message } from 'antd';
import { getFormattedLocaleName, LocaleCode } from '@/types/locale.types';
import phrasesApi from '@/api/services/phrasesService';

const { Option } = Select;

interface ExportModalProps {
  visible: boolean;
  projectId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
  visible,
  projectId,
  onCancel,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleExport = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await phrasesApi.exportPhrases(projectId, values.format, {
        locales: values.locales,
        status: values.status,
      });

      message.success(
        `Successfully exported phrases as ${values.format.toUpperCase()}`
      );
      onSuccess();
    } catch (err) {
      console.error('Export failed:', err);
      message.error('Failed to export phrases');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Export Phrases"
      open={visible}
      onCancel={onCancel}
      onOk={handleExport}
      okText="Export"
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          format: 'json',
          scope: 'all',
          locales: ['fr-CA'],
        }}
      >
        <Form.Item name="format" label="Export Format">
          <Radio.Group>
            <Radio.Button value="json">JSON</Radio.Button>
            <Radio.Button value="csv">CSV</Radio.Button>
            <Radio.Button value="xlsx">XLSX</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="scope" label="Export Scope">
          <Radio.Group>
            <Radio.Button value="all">All Phrases</Radio.Button>
            <Radio.Button value="selected">Selected Phrases</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="locales" label="Include Translations">
          <Checkbox.Group
            options={['en-US', 'fr-CA', 'es-ES'].map((locale) => ({
              label: getFormattedLocaleName(locale as LocaleCode),
              value: locale,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExportModal;
