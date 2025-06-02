// src/views/pages/Phrases/ManagePhrases/components/PhrasesTable.tsx (Updated to pass selectedPhrases)
import React from 'react';
import {
  Table,
  Space,
  Button,
  Input,
  Dropdown,
  Menu,
  Pagination,
  Tag,
  Typography,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
  SortAscendingOutlined,
  SettingOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { Phrase, Translation } from '@/types/phrases.types';
import { getFormattedLocaleName, LocaleCode } from '@/types/locale.types';
import { getBatchActionsForTab } from '../utils/batchActions';
import BatchActionToolbar from './BatchActionToolbar';

const { Text } = Typography;

interface PhrasesTableProps {
  phrases: Phrase[];
  loading: boolean;
  pagination: any;
  selectedRows: Phrase[];
  activeTab: string;
  searchText: string;
  targetLocale: string;
  projectLocales: { sourceLocale: string; supportedLocales: string[] };
  onSearch: (value: string) => void;
  onRowSelection: (selectedRows: Phrase[]) => void;
  onBatchOperation: (operation: string, phrases: Phrase[]) => void;
  onUpdateStatus: (phraseId: string, status: string) => void;
  onProposeTranslation: (phrase: Phrase) => void;
  onDefineVariables: (phrase: Phrase) => void;
  onExport: () => void;
  onClearSelection: () => void;
}

const PhrasesTable: React.FC<PhrasesTableProps> = ({
  phrases,
  loading,
  pagination,
  selectedRows,
  activeTab,
  searchText,
  targetLocale,
  projectLocales,
  onSearch,
  onRowSelection,
  onBatchOperation,
  onUpdateStatus,
  onProposeTranslation,
  onDefineVariables,
  onExport,
  onClearSelection,
}) => {
  const batchActions = getBatchActionsForTab(activeTab);

  const rowSelection = {
    selectedRowKeys: selectedRows.map((row) => row.id),
    onChange: (selectedRowKeys: React.Key[], selectedRows: Phrase[]) => {
      onRowSelection(selectedRows);
    },
  };

  // Helper function to get translation from phrase
  const getTranslation = (
    phrase: Phrase,
    locale: string
  ): Translation | null => {
    return phrase.translations?.[locale] || null;
  };

  // Check if phrase has translations for the current target locale
  const hasRequiredTranslations = (phrase: Phrase): boolean => {
    const translation = getTranslation(phrase, targetLocale);
    if (!translation) return false;

    // Check if the translation text is present and not just whitespace
    return !!(translation.text && translation.text.trim().length > 0);
  };

  // Render translation status tag
  const renderStatusTag = (status?: any) => {
    if (!status) return null;

    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'orange', text: 'Pending' },
      approved: { color: 'green', text: 'Approved' },
      rejected: { color: 'red', text: 'Rejected' },
      needs_review: { color: 'blue', text: 'Needs Review' },
      published: { color: 'green', text: 'Published' },
      archived: { color: 'default', text: 'Archived' },
    };

    const { color, text } = statusMap[status?.status] || {
      color: 'default',
      text: status?.status || 'Unknown',
    };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: 'Source Text',
      dataIndex: 'sourceText',
      key: 'sourceText',
      render: (text: string, record: Phrase) => {
        const hasTranslations = hasRequiredTranslations(record);

        return (
          <div>
            <div className="font-medium">{text}</div>
            {record.context && (
              <div className="text-xs text-gray-500">{record.context}</div>
            )}
            {!hasTranslations && (
              <div className="text-xs text-red-500 mt-1">
                ⚠ Missing required translations
              </div>
            )}
          </div>
        );
      },
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
                  {renderStatusTag(translation)}
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
      // render: (status: string) => renderStatusTag(status),
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      render: (_: any, record: Phrase) => {
        const hasTranslations = hasRequiredTranslations(record);

        return (
          <Space size="small">
            <Button type="link" onClick={() => onProposeTranslation(record)}>
              Propose
            </Button>

            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="propose"
                    onClick={() => onProposeTranslation(record)}
                  >
                    Propose Translation
                  </Menu.Item>

                  {record.status === 'published' && (
                    <Menu.Item
                      key="unpublish"
                      onClick={() => onUpdateStatus(record.id, 'pending')}
                    >
                      Unpublish
                    </Menu.Item>
                  )}

                  {hasTranslations && record.status === 'pending' && (
                    <Menu.Item
                      key="publish"
                      onClick={() => onUpdateStatus(record.id, 'publish')}
                    >
                      Publish
                    </Menu.Item>
                  )}

                  {!hasTranslations && record.status === 'pending' && (
                    <Menu.Item
                      key="publish"
                      disabled
                      title="Cannot publish without required translations"
                    >
                      Publish (Missing Translations)
                    </Menu.Item>
                  )}

                  <Menu.Item
                    key="markHuman"
                    onClick={() => {
                      console.log('Mark as human:', record.id);
                    }}
                  >
                    Mark as Human
                  </Menu.Item>

                  <Menu.Item
                    key="variables"
                    onClick={() => onDefineVariables(record)}
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
        );
      },
    },
  ];

  return (
    <div className="w-3/4">
      {/* Action bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search phrases..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => onSearch(e.target.value)}
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
                <Menu.Item key="export-json" onClick={onExport}>
                  Export JSON
                </Menu.Item>
                <Menu.Item key="export-csv" onClick={onExport}>
                  Export CSV
                </Menu.Item>
                <Menu.Item key="export-xlsx" onClick={onExport}>
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

      {/* Batch Actions Toolbar */}
      {selectedRows.length > 0 && (
        <BatchActionToolbar
          selectedCount={selectedRows.length}
          selectedPhrases={selectedRows}
          activeTab={activeTab}
          batchActions={batchActions}
          projectLocales={projectLocales}
          onBatchOperation={onBatchOperation}
          onClearSelection={onClearSelection}
        />
      )}

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
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhrasesTable;
