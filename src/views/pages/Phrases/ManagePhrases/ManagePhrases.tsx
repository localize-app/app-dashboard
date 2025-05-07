import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  Button,
  Tabs,
  Input,
  Table,
  Tag,
  Dropdown,
  Menu,
  Tooltip,
  message,
  Spin,
  Typography,
  Space,
  Select,
  Modal,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  SettingOutlined,
  DownOutlined,
  ExportOutlined,
  ImportOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import { useAuthContext } from '@/context/AuthContext';
import apiServices from '@/api/apiServices';
import { getFormattedLocaleName, LocaleCode } from '@/types/locale.types';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface Phrase {
  id: string;
  _id?: string;
  key: string;
  sourceText: string;
  context?: string;
  project: string;
  status: 'published' | 'pending' | 'needs_review' | 'rejected' | 'archived';
  isArchived: boolean;
  translations: Record<string, Translation>;
  tags: string[];
  lastSeenAt?: string;
  sourceUrl?: string;
  screenshot?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Translation {
  text: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_review';
  isHuman: boolean;
  lastModified: string;
  modifiedBy?: string;
}

interface Project {
  id: string;
  name: string;
  supportedLocales: string[];
}

const ManagePhrases: React.FC = () => {
  // Get project ID from URL if available
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuthContext();

  // State for phrases data
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('published');

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
  const fetchPhrases = async () => {
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

      const response = await apiServices.phrases.getAll(params);
      setPhrases(response);
      setPagination({
        ...pagination,
        total: response.length, // Would normally come from headers in a real implementation
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching phrases:', err);
      setError('Failed to load phrases. Please try again.');
      message.error('Failed to load phrases');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available projects
  const fetchProjects = async () => {
    try {
      const response = await apiServices.projects.getAll({
        isArchived: false,
      });
      setProjects(response);

      // Set selected project if not already set
      if (!selectedProject && response.length > 0) {
        setSelectedProject(response[0].id);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      message.error('Failed to load projects');
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch phrases when filters change
  useEffect(() => {
    if (selectedProject) {
      fetchPhrases();
    }
  }, [selectedProject, activeTab, pagination.current, pagination.pageSize]);

  // Search handler with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedProject) {
        fetchPhrases();
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

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
      await apiServices.phrases.batchOperation({
        operation,
        items: ids,
      });

      message.success(`Successfully ${operation}ed ${ids.length} phrases`);
      fetchPhrases();
      setSelectedRows([]);
    } catch (err) {
      console.error(`Error performing batch operation: ${operation}`, err);
      message.error('Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Individual phrase operations
  const handleUpdatePhraseStatus = async (phraseId: string, status: string) => {
    try {
      await apiServices.phrases.updateStatus(phraseId, { status });
      message.success('Status updated successfully');
      fetchPhrases();
    } catch (err) {
      console.error('Error updating phrase status:', err);
      message.error('Failed to update status');
    }
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
      archived: { color: 'gray', text: 'Archived' },
    };

    const { color, text } = statusMap[status] || {
      color: 'default',
      text: status,
    };

    return <Tag color={color}>{text}</Tag>;
  };

  // Propose translation modal
  const [proposeModalVisible, setProposeModalVisible] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [proposedTranslation, setProposedTranslation] = useState('');

  const showProposeModal = (phrase: Phrase) => {
    setCurrentPhrase(phrase);
    const translation = getTranslation(phrase, targetLocale);
    setProposedTranslation(translation?.text || '');
    setProposeModalVisible(true);
  };

  const handleProposeTranslation = async () => {
    if (!currentPhrase || !proposedTranslation) return;

    try {
      await apiServices.phrases.addTranslation(currentPhrase.id, targetLocale, {
        text: proposedTranslation,
        isHuman: true,
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
      render: (status: string) => renderStatusTag(status),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Phrase) => (
        <Space size="small">
          <Button type="link" onClick={() => showProposeModal(record)}>
            Propose
          </Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="publish"
                  onClick={() =>
                    handleUpdatePhraseStatus(record.id, 'published')
                  }
                  icon={<CheckOutlined />}
                >
                  Publish
                </Menu.Item>
                <Menu.Item
                  key="unpublish"
                  onClick={() => handleUpdatePhraseStatus(record.id, 'pending')}
                  icon={<CloseOutlined />}
                >
                  Unpublish
                </Menu.Item>
                <Menu.Item
                  key="archive"
                  onClick={() =>
                    handleUpdatePhraseStatus(record.id, 'archived')
                  }
                  icon={<DeleteOutlined />}
                >
                  Archive
                </Menu.Item>
              </Menu>
            }
          >
            <Button>
              More <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Render phrase count
  const renderPhraseCount = () => {
    if (loading) return <Spin size="small" />;

    const totalCount = pagination.total;
    const selectedCount = selectedRows.length;

    return (
      <div className="text-sm">
        {selectedCount > 0 ? (
          <span>
            {selectedCount} selected of {totalCount} phrases
          </span>
        ) : (
          <span>{totalCount} phrases</span>
        )}
      </div>
    );
  };

  // Render language selection
  const renderLanguageSelector = () => {
    const project = projects.find((p) => p.id === selectedProject);

    if (!project) return null;

    return (
      <div className="mb-4 border rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <Title level={5} className="m-0">
            Language
          </Title>
          <Tooltip title="Select source and target languages">
            <Button type="text" icon={<SettingOutlined />} />
          </Tooltip>
        </div>

        <Divider className="my-2" />

        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <div>
              <div>Source:</div>
              <div className="font-medium">English (United States)</div>
            </div>
            <div className="text-gray-400">en-US</div>
          </div>

          <div className="flex justify-between border-l-4 border-blue-500 pl-2 py-1 bg-blue-50">
            <div>
              <div>Target:</div>
              <div className="font-medium">French (Canada)</div>
            </div>
            <div className="text-gray-400">fr-CA</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title level={3} className="m-0">
            Manage Phrases
          </Title>

          <Space>
            <Select
              placeholder="Select Project"
              style={{ width: 200 }}
              value={selectedProject}
              onChange={handleProjectChange}
            >
              {projects.map((project) => (
                <Option key={project.id} value={project.id}>
                  {project.name}
                </Option>
              ))}
            </Select>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => message.info('Add phrase functionality')}
            >
              Add Phrase
            </Button>
          </Space>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4">
            {renderLanguageSelector()}

            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              tabPosition="left"
              className="border rounded-lg"
            >
              <TabPane
                tab={
                  <span className="flex justify-between items-center w-full">
                    <span>Published</span>
                    <Tag>
                      {phrases.filter((p) => p.status === 'published').length}
                    </Tag>
                  </span>
                }
                key="published"
              />
              <TabPane
                tab={
                  <span className="flex justify-between items-center w-full">
                    <span>Translation QA</span>
                    <Tag>
                      {
                        phrases.filter((p) => p.status === 'needs_review')
                          .length
                      }
                    </Tag>
                  </span>
                }
                key="needs_review"
              />
              <TabPane
                tab={
                  <span className="flex justify-between items-center w-full">
                    <span>Pending</span>
                    <Tag>
                      {phrases.filter((p) => p.status === 'pending').length}
                    </Tag>
                  </span>
                }
                key="pending"
              />
              <TabPane
                tab={
                  <span className="flex justify-between items-center w-full">
                    <span>Archive</span>
                    <Tag>{phrases.filter((p) => p.isArchived).length}</Tag>
                  </span>
                }
                key="archive"
              />
            </Tabs>
          </div>

          <div className="w-full md:w-3/4">
            <div className="mb-4 flex justify-between items-center">
              <Space>
                <Input
                  placeholder="Search phrases..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                  allowClear
                />

                <Button icon={<FilterOutlined />}>Filters</Button>
              </Space>

              <Space>
                {selectedRows.length > 0 && (
                  <>
                    <Button
                      onClick={() => handleBatchOperation('publish')}
                      icon={<CheckOutlined />}
                    >
                      Publish
                    </Button>
                    <Button
                      onClick={() => handleBatchOperation('archive')}
                      icon={<DeleteOutlined />}
                    >
                      Archive
                    </Button>
                  </>
                )}

                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="export" icon={<ExportOutlined />}>
                        Export Phrases
                      </Menu.Item>
                      <Menu.Item key="import" icon={<ImportOutlined />}>
                        Import Phrases
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button>
                    Export <DownOutlined />
                  </Button>
                </Dropdown>
              </Space>
            </div>

            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={phrases}
              rowKey="id"
              loading={loading}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
                onChange: (page, pageSize) => {
                  setPagination({
                    ...pagination,
                    current: page,
                    pageSize: pageSize || 10,
                  });
                },
              }}
              locale={{
                emptyText: error
                  ? error
                  : 'No phrases found. Try changing your filters or add a new phrase.',
              }}
              footer={() => renderPhraseCount()}
            />
          </div>
        </div>
      </Card>

      {/* Propose Translation Modal */}
      <Modal
        title="Propose Translation"
        visible={proposeModalVisible}
        onCancel={() => setProposeModalVisible(false)}
        onOk={handleProposeTranslation}
        okText="Submit"
        confirmLoading={loading}
      >
        {currentPhrase && (
          <>
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">
                Source ({sourceLocale}):
              </div>
              <div className="p-2 border rounded bg-gray-50">
                {currentPhrase.sourceText}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">
                Translation ({targetLocale}):
              </div>
              <Input.TextArea
                rows={4}
                value={proposedTranslation}
                onChange={(e) => setProposedTranslation(e.target.value)}
                placeholder="Enter your translation..."
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ManagePhrases;
