// src/views/pages/Phrases/ManagePhrases/components/modals/ExportModal.tsx - Updated with Swagger params
import React, { useState } from 'react';
import { Modal, Form, Select, Radio, message } from 'antd';
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

      // Prepare export options according to Swagger spec
      const options: any = {};

      // Convert locale arrays to comma-separated strings as per Swagger
      if (values.locales && values.locales.length > 0) {
        options.locales = values.locales.join(',');
      }

      // Convert status arrays to comma-separated strings as per Swagger
      if (values.status && values.status.length > 0) {
        options.status = values.status.join(',');
      }

      await phrasesApi.exportPhrases(projectId, values.format, options);

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
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          format: 'json',
          scope: 'all',
          locales: ['fr-CA'],
          status: ['pending', 'approved'],
        }}
      >
        <Form.Item
          name="format"
          label="Export Format"
          tooltip="Choose the file format for your exported phrases"
        >
          <Radio.Group>
            <Radio.Button value="json">JSON</Radio.Button>
            <Radio.Button value="csv">CSV</Radio.Button>
            <Radio.Button value="xlsx">Excel (XLSX)</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="scope"
          label="Export Scope"
          tooltip="Choose what phrases to export"
        >
          <Radio.Group>
            <Radio.Button value="all">All Phrases</Radio.Button>
            <Radio.Button value="selected">Selected Phrases</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="locales"
          label="Include Translations"
          tooltip="Select which language translations to include in the export"
        >
          <Select
            mode="multiple"
            placeholder="Select locales to include"
            style={{ width: '100%' }}
            allowClear
          >
            <Option value="en-US">
              {getFormattedLocaleName('en-US' as LocaleCode)}
            </Option>
            <Option value="fr-CA">
              {getFormattedLocaleName('fr-CA' as LocaleCode)}
            </Option>
            <Option value="es-ES">
              {getFormattedLocaleName('es-ES' as LocaleCode)}
            </Option>
            <Option value="de-DE">
              {getFormattedLocaleName('de-DE' as LocaleCode)}
            </Option>
            <Option value="it-IT">
              {getFormattedLocaleName('it-IT' as LocaleCode)}
            </Option>
          </Select>
          <div className="text-xs text-gray-500 mt-1">
            Leave empty to include all available translations
          </div>
        </Form.Item>

        <Form.Item
          name="status"
          label="Filter by Status"
          tooltip="Only export phrases with selected statuses"
        >
          <Select
            mode="multiple"
            placeholder="Select statuses to include"
            style={{ width: '100%' }}
            allowClear
          >
            <Option value="pending">Pending</Option>
            <Option value="approved">Approved</Option>
            <Option value="rejected">Rejected</Option>
            <Option value="needs_review">Needs Review</Option>
            <Option value="published">Published</Option>
            <Option value="archived">Archived</Option>
          </Select>
          <div className="text-xs text-gray-500 mt-1">
            Leave empty to include phrases with all statuses
          </div>
        </Form.Item>

        <div className="bg-blue-50 p-3 rounded-md text-sm">
          <div className="text-blue-800 font-medium mb-1">
            Export Information:
          </div>
          <ul className="text-blue-700 list-disc pl-5 space-y-1">
            <li>JSON format includes all phrase data including metadata</li>
            <li>CSV format is optimized for spreadsheet applications</li>
            <li>Excel format supports multiple sheets for different locales</li>
            <li>Large exports may take some time to generate</li>
          </ul>
        </div>
      </Form>
    </Modal>
  );
};

export default ExportModal;
