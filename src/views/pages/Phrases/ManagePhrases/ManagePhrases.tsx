import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Input,
  Table,
  Tag,
  Menu,
  Dropdown,
  Space,
  message,
  Typography,
  Pagination,
  Modal,
  Checkbox,
  Radio,
  Upload,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  SettingOutlined,
  DownOutlined,
  SortAscendingOutlined,
  EllipsisOutlined,
  InboxOutlined,
} from '@ant-design/icons';

import phrasesApi from '@/api/services/phrasesService';
import { getFormattedLocaleName, LocaleCode } from '@/types/locale.types';
import { Phrase, Translation } from '@/types/phrases.types';
import ProjectSelector from '@/views/components/ProjectSelector';
import { Project } from '@/types/projects.types';

const { Title, Text } = Typography;

const ManagePhrases: React.FC = () => {
  // Get project ID from URL if available
  const { projectId } = useParams<{ projectId: string }>();

  // State for phrases data
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('published');
  const [tabCounts, setTabCounts] = useState({
    published: 0,
    translation_qa: 0,
    pending: 0,
    archive: 0,
  });

  // State for filtering and pagination
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<Phrase[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // State for source and target languages
  const [sourceLocale, setSourceLocale] = useState<string>('en-US');
  const [targetLocale, setTargetLocale] = useState<string>('fr-CA');

  // State for projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>(
    projectId || ''
  );

  // Fetch phrases based on current filters
  const fetchPhrases = useCallback(async () => {
    if (!selectedProject) return;

    setLoading(true);
    try {
      const params: any = {
        project: selectedProject,
        status: activeTab !== 'archive' ? activeTab : undefined,
        isArchived: activeTab === 'archive',
        search: searchText || undefined,
        page: pagination.current,
        limit: pagination.pageSize,
      };

      // Use your phrasesApi service to get phrases
      const response = await phrasesApi.getPhrases(params);
      setPhrases(Array.isArray(response) ? response : []);

      // In a real implementation, the API would return total count in headers or response object
      // For now, we'll just use the length of the returned array
      setPagination({
        ...pagination,
        total: Array.isArray(response) ? response.length : 0,
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching phrases:', err);
      setError('Failed to load phrases. Please try again.');
      message.error('Failed to load phrases');
    } finally {
      setLoading(false);
    }
  }, [
    selectedProject,
    activeTab,
    pagination.current,
    pagination.pageSize,
    searchText,
  ]);

  // Count the number of phrases per status
  const fetchPhraseCounts = async () => {
    if (!selectedProject) return;

    try {
      // In a real implementation, you'd have an optimized API endpoint for this
      // that counts phrases by status in a single request
      // For now, we'll use the existing API but this could be improved for performance

      // Set dummy values first to show loading state if needed
      setTabCounts({
        published: 0,
        translation_qa: 0,
        pending: 0,
        archive: 0,
      });

      // Fetch counts for each tab type
      const publishedResponse = await phrasesApi.getPhrases({
        project: selectedProject,
        status: 'published',
        limit: 1000, // This should be adjusted based on expected volume
      });

      const pendingResponse = await phrasesApi.getPhrases({
        project: selectedProject,
        status: 'pending',
        limit: 1000,
      });

      const needsReviewResponse = await phrasesApi.getPhrases({
        project: selectedProject,
        status: 'needs_review',
        limit: 1000,
      });

      const archivedResponse = await phrasesApi.getPhrases({
        project: selectedProject,
        isArchived: true,
        limit: 1000,
      });

      // Update counts
      setTabCounts({
        published: Array.isArray(publishedResponse)
          ? publishedResponse.length
          : 0,
        translation_qa: Array.isArray(needsReviewResponse)
          ? needsReviewResponse.length
          : 0,
        pending: Array.isArray(pendingResponse) ? pendingResponse.length : 0,
        archive: Array.isArray(archivedResponse) ? archivedResponse.length : 0,
      });
    } catch (err) {
      console.error('Error fetching phrase counts:', err);
    }
  };

  // Fetch phrases when filters change
  useEffect(() => {
    if (selectedProject) {
      fetchPhrases();
      fetchPhraseCounts();
    }
  }, [selectedProject, fetchPhrases]);

  // Handle tab change
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setPagination({ ...pagination, current: 1 });
    setSelectedRows([]);
  };

  // Handle project change
  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
    setPagination({ ...pagination, current: 1 });
    setSelectedRows([]);
  };

  // Handle language change
  const handleLanguageChange = (locale: string) => {
    setTargetLocale(locale);
  };

  // Table selection config
  const rowSelection = {
    selectedRowKeys: selectedRows.map((row) => row.id),
    onChange: (selectedRowKeys: React.Key[], selectedRows: Phrase[]) => {
      setSelectedRows(selectedRows);
    },
  };

  // Batch operations
  const handleBatchOperation = async (operation: string) => {
    if (selectedRows.length === 0) {
      message.warning('No phrases selected');
      return;
    }

    try {
      setLoading(true);

      const ids = selectedRows.map((row) => ({ id: row.id }));
      await phrasesApi.batchOperation({
        operation,
        items: ids,
      });

      message.success(`Successfully ${operation}ed ${ids.length} phrases`);
      fetchPhrases();
      fetchPhraseCounts();
      setSelectedRows([]);
    } catch (err) {
      console.error(`Error performing batch operation: ${operation}`, err);
      message.error('Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Individual phrase operations
  const handleUpdatePhraseStatus = async (
    phraseId: string,
    newStatus: string
  ) => {
    try {
      await phrasesApi.updateStatus(phraseId, { status: newStatus });
      message.success(`Status updated to ${newStatus}`);
      fetchPhrases();
      fetchPhraseCounts();
    } catch (err) {
      console.error('Error updating phrase status:', err);
      message.error('Failed to update status');
    }
  };

  // State for propose translation modal
  const [proposeModalVisible, setProposeModalVisible] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [proposedTranslation, setProposedTranslation] = useState('');
  const [markAsHuman, setMarkAsHuman] = useState(true);

  // Functions for propose modal
  const showProposeModal = (phrase: Phrase) => {
    setCurrentPhrase(phrase);
    const translation = phrase.translations?.[targetLocale];
    setProposedTranslation(translation?.text || '');
    setProposeModalVisible(true);
  };

  const handleProposeTranslation = async () => {
    if (!currentPhrase || !proposedTranslation.trim()) {
      message.warning('Please enter a translation.');
      return;
    }

    try {
      await phrasesApi.addTranslation(currentPhrase.id, targetLocale, {
        text: proposedTranslation,
        isHuman: markAsHuman,
        status: 'pending',
      });

      message.success('Translation proposed successfully');
      setProposeModalVisible(false);
      fetchPhrases();
    } catch (err) {
      console.error('Error proposing translation:', err);
      message.error('Failed to propose translation');
    }
  };

  // State for variables modal
  const [variablesModalVisible, setVariablesModalVisible] = useState(false);
  const [currentVariables, setCurrentVariables] = useState<string[]>([]);

  // Function to show variables modal
  const showVariablesModal = (phrase: Phrase) => {
    // Extract variables from the source text - a simple implementation
    // In a real app, you'd have a more sophisticated detection of variables
    const variables = (phrase.sourceText.match(/\{\{.*?\}\}/g) || []).map((v) =>
      v.replace(/\{\{|\}\}/g, '')
    );

    setCurrentVariables(variables);
    setCurrentPhrase(phrase);
    setVariablesModalVisible(true);
  };

  // Function to get translation from phrase
  const getTranslation = (
    phrase: Phrase,
    locale: string
  ): Translation | null => {
    return phrase.translations?.[locale] || null;
  };

  // Render translation status tag
  const renderStatusTag = (status?: string) => {
    if (!status) return null;

    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'orange', text: 'Pending' },
      approved: { color: 'green', text: 'Approved' },
      rejected: { color: 'red', text: 'Rejected' },
      needs_review: { color: 'blue', text: 'Needs Review' },
      published: { color: 'green', text: 'Published' },
      archived: { color: 'default', text: 'Archived' },
    };

    const { color, text } = statusMap[status] || {
      color: 'default',
      text: status,
    };
    return <Tag color={color}>{text}</Tag>;
  };

  // Export/Import functions
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);

  const handleExport = () => {
    // Show export modal with options
    setExportModalVisible(true);
  };

  const handleImport = () => {
    // Show import modal
    setImportModalVisible(true);
  };

  // Define table columns
  const columns = [
    {
      title: 'Source Text',
      dataIndex: 'sourceText',
      key: 'sourceText',
      render: (text: string, record: Phrase) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.context && (
            <div className="text-xs text-gray-500">{record.context}</div>
          )}
        </div>
      ),
    },
    {
      title: `Translation (${getFormattedLocaleName(targetLocale as LocaleCode)})`,
      key: 'translation',
      render: (_: any, record: Phrase) => {
        const translation = getTranslation(record, targetLocale);
        return (
          <div>
            {translation ? (
              <>
                <div>{translation.text}</div>
                <div className="flex items-center mt-1">
                  {renderStatusTag(translation.status)}
                  {translation.isHuman && (
                    <Tag color="purple" className="ml-1">
                      Human
                    </Tag>
                  )}
                </div>
              </>
            ) : (
              <Text type="secondary">No translation available</Text>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => renderStatusTag(status),
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      render: (_: any, record: Phrase) => (
        <Space size="small">
          <Button type="link" onClick={() => showProposeModal(record)}>
            Propose
          </Button>

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="propose"
                  onClick={() => showProposeModal(record)}
                >
                  Propose
                </Menu.Item>

                <Menu.Item
                  key="unpublish"
                  onClick={() => handleUpdatePhraseStatus(record.id, 'pending')}
                >
                  Unpublish
                </Menu.Item>

                <Menu.Item
                  key="markHuman"
                  onClick={() => {
                    const translation = record.translations?.[targetLocale];
                    if (translation) {
                      phrasesApi.addTranslation(record.id, targetLocale, {
                        ...translation,
                        isHuman: true,
                      });
                      message.success('Marked as human translation');
                      fetchPhrases();
                    }
                  }}
                >
                  Mark as Human
                </Menu.Item>

                <Menu.Item
                  key="variables"
                  onClick={() => showVariablesModal(record)}
                >
                  Define Variables
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Render sidebar
  const renderSidebar = () => {
    return (
      <div className="border rounded-md overflow-hidden">
        {/* Language selector section */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium m-0">Language</h3>
            <Button
              type="text"
              icon={<SettingOutlined />}
              className="p-0"
              onClick={() => message.info('Language settings')}
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500">Source:</div>
              <div className="flex justify-between">
                <div className="font-medium">English (United States)</div>
                <div className="text-gray-400">en-US</div>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-2 py-1 bg-blue-50">
              <div className="text-sm text-gray-500">Target:</div>
              <div className="flex justify-between">
                <div className="font-medium">French (Canada)</div>
                <div className="text-gray-400">fr-CA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div>
          <div
            className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 ${activeTab === 'published' ? 'bg-blue-50 border-l-4 border-blue-500 pl-3' : ''}`}
            onClick={() => handleTabChange('published')}
          >
            <div className="font-medium">Published</div>
            <Tag>{tabCounts.published}</Tag>
          </div>

          <div
            className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 ${activeTab === 'needs_review' ? 'bg-blue-50 border-l-4 border-blue-500 pl-3' : ''}`}
            onClick={() => handleTabChange('needs_review')}
          >
            <div className="font-medium">Translation QA</div>
            <Tag>{tabCounts.translation_qa}</Tag>
          </div>

          <div
            className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 ${activeTab === 'pending' ? 'bg-blue-50 border-l-4 border-blue-500 pl-3' : ''}`}
            onClick={() => handleTabChange('pending')}
          >
            <div className="font-medium">Pending</div>
            <Tag>{tabCounts.pending}</Tag>
          </div>

          <div
            className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 ${activeTab === 'archive' ? 'bg-blue-50 border-l-4 border-blue-500 pl-3' : ''}`}
            onClick={() => handleTabChange('archive')}
          >
            <div className="font-medium">Archive</div>
            <Tag>{tabCounts.archive}</Tag>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <ProjectSelector onProjectSelect={handleProjectChange} />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>Manage Phrases</Title>

        <div className="flex items-center gap-2">
          {/* <Button
            type="text"
            className="flex items-center border rounded-md px-3 py-1.5"
          >
            {selectedProject
              ? projects.find((p) => p.id === selectedProject)?.name ||
                'Select Project'
              : 'Select Project'}
            <DownOutlined className="ml-2" />
          </Button> */}

          <Button
            type="primary"
            onClick={() => message.info('Add phrase functionality')}
          >
            Add Phrase
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-4">
        {/* Sidebar */}
        <div className="w-1/4">{renderSidebar()}</div>

        {/* Phrases list */}
        <div className="w-3/4">
          {/* Action bar */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search phrases..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={fetchPhrases}
                style={{ width: 240 }}
              />

              <Button icon={<FilterOutlined />}>Filters</Button>

              <Button icon={<SortAscendingOutlined />}>Sort by</Button>

              <Button icon={<SettingOutlined />}>Settings</Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500">
                {selectedRows.length
                  ? `${selectedRows.length} phrase${selectedRows.length > 1 ? 's' : ''} selected`
                  : `1 of ${pagination.total}`}
              </div>

              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="export-json" onClick={handleExport}>
                      Export JSON
                    </Menu.Item>
                    <Menu.Item key="export-csv" onClick={handleExport}>
                      Export CSV
                    </Menu.Item>
                    <Menu.Item key="export-xlsx" onClick={handleExport}>
                      Export XLSX
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  Export <DownOutlined />
                </Button>
              </Dropdown>

              <Button>
                Move <DownOutlined />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-md overflow-hidden">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={phrases}
              rowKey="id"
              loading={loading}
              pagination={false}
              size="middle"
              locale={{
                emptyText:
                  'No phrases found. Try changing your filters or add a new phrase.',
              }}
            />

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="flex justify-center items-center p-4 border-t">
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={(page) =>
                    setPagination({ ...pagination, current: page })
                  }
                  showSizeChanger={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Propose Translation Modal */}
      <Modal
        title="Propose Translation"
        visible={proposeModalVisible}
        onCancel={() => setProposeModalVisible(false)}
        onOk={handleProposeTranslation}
        okText="Submit"
        width={600}
      >
        {currentPhrase && (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Source (en-US):</div>
              <div className="p-3 border rounded bg-gray-50">
                {currentPhrase.sourceText}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">
                Translation (fr-CA):
              </div>
              <Input.TextArea
                rows={5}
                value={proposedTranslation}
                onChange={(e) => setProposedTranslation(e.target.value)}
                placeholder="Enter translation here..."
                className="w-full"
              />
            </div>

            <Checkbox
              checked={markAsHuman}
              onChange={(e) => setMarkAsHuman(e.target.checked)}
            >
              Mark as human translation
            </Checkbox>
          </div>
        )}
      </Modal>

      {/* Define Variables Modal */}
      <Modal
        title="Define Variables"
        visible={variablesModalVisible}
        onCancel={() => setVariablesModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setVariablesModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={500}
      >
        {currentPhrase && (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Source:</div>
              <div className="p-3 border rounded bg-gray-50">
                {currentPhrase.sourceText}
              </div>
            </div>

            {currentVariables.length > 0 ? (
              <div>
                <div className="text-sm text-gray-500 mb-2">
                  Variables detected:
                </div>
                <div className="space-y-2">
                  {currentVariables.map((variable, index) => (
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

      {/* Export Modal */}
      <Modal
        title="Export Phrases"
        visible={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        onOk={() => {
          setExportModalVisible(false);
          message.success('Phrases exported successfully');
        }}
      >
        <div className="space-y-4">
          <div>
            <div className="font-medium mb-1">Export Format</div>
            <Radio.Group defaultValue="json">
              <Radio.Button value="json">JSON</Radio.Button>
              <Radio.Button value="csv">CSV</Radio.Button>
              <Radio.Button value="xlsx">XLSX</Radio.Button>
            </Radio.Group>
          </div>

          <div>
            <div className="font-medium mb-1">Export Scope</div>
            <Radio.Group defaultValue="all">
              <Radio.Button value="all">All Phrases</Radio.Button>
              <Radio.Button value="selected" disabled={!selectedRows.length}>
                Selected ({selectedRows.length})
              </Radio.Button>
            </Radio.Group>
          </div>

          <div>
            <div className="font-medium mb-1">Include Translations</div>
            <Checkbox.Group
              options={['en-US', 'fr-CA', 'es-ES'].map((locale) => ({
                label: getFormattedLocaleName(locale as LocaleCode),
                value: locale,
              }))}
              defaultValue={['fr-CA']}
            />
          </div>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal
        title="Import Phrases"
        visible={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        onOk={() => {
          setImportModalVisible(false);
          message.success('Phrases imported successfully');
          fetchPhrases();
          fetchPhraseCounts();
        }}
      >
        <div className="space-y-4">
          <div>
            <div className="font-medium mb-1">Upload File</div>
            <Upload.Dragger
              accept=".json,.csv,.xlsx"
              beforeUpload={() => false}
              maxCount={1}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Supported formats: JSON, CSV, Excel (XLSX)
              </p>
            </Upload.Dragger>
          </div>

          <div>
            <Checkbox defaultChecked>
              Overwrite existing phrases with the same key
            </Checkbox>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManagePhrases;
