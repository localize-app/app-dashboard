import React, { useState } from 'react';
import { Button, Dropdown, Menu, Modal, message, Select } from 'antd';
import { DownOutlined, ExportOutlined } from '@ant-design/icons';
import { LocaleCode, getFormattedLocaleName } from '../../types/locale.types';
import phrasesApi from '@/api/services/phrasesService';

interface ExportPhrasesButtonProps {
  projectId: string;
  supportedLocales: string[]; // Array of locale codes supported by the project
}

const ExportPhrasesButton: React.FC<ExportPhrasesButtonProps> = ({
  projectId,
  supportedLocales,
}) => {
  const [exportModalVisible, setExportModalVisible] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'csv' | 'xlsx'>(
    'json'
  );
  const [selectedLocales, setSelectedLocales] = useState<string[]>([]);
  const [exportSource, setExportSource] = useState<string>('all'); // 'all' or 'selected'
  const [exporting, setExporting] = useState<boolean>(false);

  // Toggle modal visibility
  const toggleExportModal = () => {
    setExportModalVisible(!exportModalVisible);

    // Reset state when opening modal
    if (!exportModalVisible) {
      setSelectedFormat('json');
      setSelectedLocales([]);
      setExportSource('all');
    }
  };

  // Handle locale selection
  const handleLocaleChange = (locales: string[]) => {
    setSelectedLocales(locales);
  };

  // Handle export button click
  const handleExport = async () => {
    if (!projectId) {
      message.error('Please select a project first');
      return;
    }

    try {
      setExporting(true);

      // Perform export
      await phrasesApi.exportPhrases(projectId, selectedFormat, {
        locales: selectedLocales.length > 0 ? selectedLocales : undefined,
      });

      message.success(
        `Successfully exported phrases as ${selectedFormat.toUpperCase()}`
      );
      setExportModalVisible(false);
    } catch (error) {
      console.error('Export failed:', error);
      message.error('Failed to export phrases. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Export dropdown menu
  const exportMenu = (
    <Menu>
      <Menu.Item key="export" onClick={toggleExportModal}>
        <ExportOutlined /> Export Phrases
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={exportMenu} trigger={['click']}>
        <Button>
          Export <DownOutlined />
        </Button>
      </Dropdown>

      {/* Export Modal */}
      <Modal
        title="Export Phrases"
        visible={exportModalVisible}
        onCancel={toggleExportModal}
        onOk={handleExport}
        okText="Export"
        confirmLoading={exporting}
      >
        <div className="mb-4">
          <div className="font-medium mb-2">Export Format</div>
          <Select
            style={{ width: '100%' }}
            value={selectedFormat}
            onChange={(value) => setSelectedFormat(value)}
          >
            <Select.Option value="json">JSON</Select.Option>
            <Select.Option value="csv">CSV</Select.Option>
            <Select.Option value="xlsx">Excel (XLSX)</Select.Option>
          </Select>
        </div>

        <div className="mb-4">
          <div className="font-medium mb-2">Include Translations</div>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select locales to include"
            value={selectedLocales}
            onChange={handleLocaleChange}
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
        </div>

        <div className="mb-4">
          <div className="font-medium mb-2">Export Source</div>
          <Select
            style={{ width: '100%' }}
            value={exportSource}
            onChange={(value) => setExportSource(value)}
          >
            <Select.Option value="all">All Phrases</Select.Option>
            <Select.Option value="selected">
              Selected Phrases Only
            </Select.Option>
          </Select>
        </div>
      </Modal>
    </>
  );
};

export default ExportPhrasesButton;
