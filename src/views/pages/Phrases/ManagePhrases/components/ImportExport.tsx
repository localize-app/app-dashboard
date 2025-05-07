// src/views/pages/Phrases/ManagePhrases/components/ExportImportPhrases.tsx
import React, { useState } from 'react';
import {
  Button,
  Dropdown,
  Menu,
  Modal,
  message,
  Select,
  Upload,
  Form,
  Checkbox,
  Space,
  Tooltip,
} from 'antd';
import {
  DownOutlined,
  ExportOutlined,
  ImportOutlined,
  UploadOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { LocaleCode, getFormattedLocaleName } from '@/types/locale.types';
import phrasesApi from '@/api/services/phrasesService';

interface ExportImportPhrasesProps {
  projectId: string;
  supportedLocales: string[];
  selectedPhraseIds?: string[];
  onImportComplete?: () => void;
}

const ExportImportPhrases: React.FC<ExportImportPhrasesProps> = ({
  projectId,
  supportedLocales,
  selectedPhraseIds,
  onImportComplete,
}) => {
  // Export modal state
  const [exportModalVisible, setExportModalVisible] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'xlsx'>(
    'json'
  );
  const [exportLocales, setExportLocales] = useState<string[]>([]);
  const [exportSource, setExportSource] = useState<'all' | 'selected'>('all');
  const [exportStatus, setExportStatus] = useState<string[]>([]);
  const [exporting, setExporting] = useState<boolean>(false);

  // Import modal state
  const [importModalVisible, setImportModalVisible] = useState<boolean>(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [overwriteExisting, setOverwriteExisting] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);

  // Export functions
  const handleExport = async () => {
    if (!projectId) {
      message.error('Please select a project first');
      return;
    }

    try {
      setExporting(true);

      // Prepare export options
      const options: any = {
        locales: exportLocales.length > 0 ? exportLocales : undefined,
        status: exportStatus.length > 0 ? exportStatus : undefined,
      };

      // If we're exporting selected phrases, add them to the options
      if (exportSource === 'selected' && selectedPhraseIds?.length) {
        options.ids = selectedPhraseIds;
      }

      // Call export API
      await phrasesApi.exportPhrases(projectId, exportFormat, options);
      message.success(
        `Successfully exported phrases as ${exportFormat.toUpperCase()}`
      );
      setExportModalVisible(false);
    } catch (error) {
      console.error('Export failed:', error);
      message.error('Failed to export phrases. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Import functions
  const handleImport = async () => {
    if (!projectId || !importFile) {
      message.error(
        importFile
          ? 'Please select a project first'
          : 'Please select a file to import'
      );
      return;
    }

    try {
      setImporting(true);
      const result = await phrasesApi.importPhrases(projectId, importFile, {
        overwrite: overwriteExisting,
      });

      message.success(
        `Import successful! ${result.imported} phrases imported, ${result.updated} updated.${
          result.errors ? ` ${result.errors} errors encountered.` : ''
        }`
      );

      setImportModalVisible(false);
      setImportFile(null);

      // Trigger refresh of phrases list
      if (onImportComplete) {
        onImportComplete();
      }
    } catch (error) {
      console.error('Import failed:', error);
      message.error('Failed to import phrases. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const handleFileChange = (info: any) => {
    if (info.file.status !== 'uploading') {
      setImportFile(info.file.originFileObj);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file ready to import`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // Dropdown menu for Export/Import
  const menu = (
    <Menu>
      <Menu.Item
        key="export"
        icon={<ExportOutlined />}
        onClick={() => setExportModalVisible(true)}
      >
        Export Phrases
      </Menu.Item>
      <Menu.Item
        key="import"
        icon={<ImportOutlined />}
        onClick={() => setImportModalVisible(true)}
      >
        Import Phrases
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={['click']}>
        <Button>
          Export <DownOutlined />
        </Button>
      </Dropdown>

      {/* Export Modal */}
      <Modal
        title="Export Phrases"
        visible={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        onOk={handleExport}
        okText="Export"
        confirmLoading={exporting}
      >
        <Form layout="vertical">
          <Form.Item
            label="Export Format"
            tooltip="Choose the file format for your exported phrases"
          >
            <Select
              value={exportFormat}
              onChange={(value: 'json' | 'csv' | 'xlsx') =>
                setExportFormat(value)
              }
              style={{ width: '100%' }}
            >
              <Select.Option value="json">JSON</Select.Option>
              <Select.Option value="csv">CSV</Select.Option>
              <Select.Option value="xlsx">Excel (XLSX)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Include Translations"
            tooltip="Select which language translations to include in the export"
          >
            <Select
              mode="multiple"
              placeholder="Select locales to include"
              value={exportLocales}
              onChange={(values) => setExportLocales(values)}
              style={{ width: '100%' }}
              optionLabelProp="label"
            >
              {supportedLocales.map((locale) => (
                <Select.Option key={locale} value={locale} label={locale}>
                  <div className="flex justify-between">
                    <span>{getFormattedLocaleName(locale as LocaleCode)}</span>
                    <span className="text-gray-400">{locale}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
            <div className="text-xs text-gray-500 mt-1">
              Leave empty to include all translations
            </div>
          </Form.Item>

          <Form.Item
            label="Export Source"
            tooltip="Choose to export all phrases or only selected ones"
          >
            <Select
              value={exportSource}
              onChange={(value: 'all' | 'selected') => setExportSource(value)}
              style={{ width: '100%' }}
              disabled={!selectedPhraseIds?.length}
            >
              <Select.Option value="all">All Phrases</Select.Option>
              <Select.Option value="selected">
                Selected Phrases Only ({selectedPhraseIds?.length || 0})
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Filter by Status"
            tooltip="Only export phrases with selected statuses"
          >
            <Select
              mode="multiple"
              placeholder="Select statuses to include"
              value={exportStatus}
              onChange={(values) => setExportStatus(values)}
              style={{ width: '100%' }}
            >
              <Select.Option value="published">Published</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="needs_review">Needs Review</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
            <div className="text-xs text-gray-500 mt-1">
              Leave empty to include all statuses
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Import Modal */}
      <Modal
        title="Import Phrases"
        visible={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        onOk={handleImport}
        okText="Import"
        confirmLoading={importing}
        okButtonProps={{ disabled: !importFile }}
      >
        <Form layout="vertical">
          <Form.Item
            label="Upload File"
            tooltip="Supported formats: JSON, CSV, XLSX"
            required
          >
            <Upload
              name="file"
              accept=".json,.csv,.xlsx,.xls"
              beforeUpload={() => false}
              onChange={handleFileChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            <div className="text-xs text-gray-500 mt-2">
              <Space>
                <InfoCircleOutlined />
                <span>Supported file formats: JSON, CSV, Excel</span>
              </Space>
            </div>
          </Form.Item>

          <Form.Item>
            <Checkbox
              checked={overwriteExisting}
              onChange={(e) => setOverwriteExisting(e.target.checked)}
            >
              Overwrite existing phrases (if key already exists)
            </Checkbox>
            <Tooltip title="If unchecked, existing phrases with the same key will be skipped during import">
              <InfoCircleOutlined className="ml-2 text-gray-500" />
            </Tooltip>
          </Form.Item>

          <div className="bg-blue-50 p-3 rounded-md text-sm">
            <p className="text-blue-800 font-medium mb-1">
              File Format Requirements:
            </p>
            <ul className="text-blue-700 list-disc pl-5">
              <li>
                JSON: Array of phrase objects with required fields: key,
                sourceText, project
              </li>
              <li>
                CSV/Excel: Headers must include 'key' and 'sourceText' columns
              </li>
              <li>
                Translations should be in columns named [locale]_text (e.g.,
                fr-CA_text)
              </li>
            </ul>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ExportImportPhrases;
