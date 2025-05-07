import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Input,
  Button,
  Tag,
  Select,
  Dropdown,
  Tooltip,
  Typography,
  message,
  MenuProps,
  TablePaginationConfig,
  TableProps,
} from 'antd';
import {
  PlusOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  SwapOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuthContext } from '@/context/AuthContext';
import apiServices from '@/api/apiServices';
import { Project } from '@/types/project.types';
import FlagView from '@/views/components/FlagView';

const { Title } = Typography;
const { Option } = Select;

// Typescript interfaces
interface ProjectsListProps {}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
}

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

const ProjectsList: React.FC<ProjectsListProps> = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter state
  const [searchText, setSearchText] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch projects
  const fetchProjects = async (params: TableParams = {}) => {
    if (!user) return;

    setLoading(true);
    try {
      // Build query params
      const queryParams: Record<string, any> = {
        page: params.pagination?.current || pagination.current,
        limit: params.pagination?.pageSize || pagination.pageSize,
        company: user.company,
        ...(searchText && { search: searchText }),
        ...(filterType !== 'all' && { projectType: filterType }),
        ...(filterStatus === 'archived' && { isArchived: true }),
        ...(filterStatus === 'active' && { isArchived: false }),
      };

      // Fetch projects with params
      const response = await apiServices.projects.getAll(queryParams);

      // Update state with fetched data
      setProjects(Array.isArray(response) ? response : []);

      // Update pagination
      setPagination({
        ...pagination,
        current: params.pagination?.current || pagination.current,
        pageSize: params.pagination?.pageSize || pagination.pageSize,
        total: response.length, // This should come from API header in a real implementation
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
      message.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refresh when filters change
  useEffect(() => {
    fetchProjects();
  }, [user, searchText, filterType, filterStatus]);

  // Handle table change (pagination, filters, sorter)
  const handleTableChange: TableProps<Project>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    const sorterObj = sorter as { field?: string; order?: string };

    fetchProjects({
      pagination,
      filters,
      sortField: sorterObj.field,
      sortOrder: sorterObj.order,
    });
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 }); // Reset to first page
  };

  // Handle project type filter
  const handleTypeFilter = (value: string) => {
    setFilterType(value);
    setPagination({ ...pagination, current: 1 });
  };

  // Handle status filter
  const handleStatusFilter = (value: string) => {
    setFilterStatus(value);
    setPagination({ ...pagination, current: 1 });
  };

  // Project action menu
  const getActionMenu = (project: Project): MenuProps => ({
    items: [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: 'View Details',
        onClick: () => navigate(`/projects/${project.id || project._id}`),
      },
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit Project',
        onClick: () => navigate(`/projects/${project.id || project._id}/edit`),
      },
      {
        key: 'languages',
        icon: <GlobalOutlined />,
        label: 'Manage Languages',
        onClick: () =>
          navigate(`/projects/${project.id || project._id}/languages`),
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Project Settings',
        onClick: () =>
          navigate(`/projects/${project.id || project._id}/settings`),
      },
      {
        type: 'divider',
      },
      {
        key: 'archive',
        icon: <SwapOutlined />,
        label: project.isArchived ? 'Unarchive Project' : 'Archive Project',
        onClick: () => handleArchiveProject(project),
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete Project',
        danger: true,
        onClick: () => handleDeleteProject(project),
      },
    ],
  });

  // Handle archive/unarchive
  const handleArchiveProject = async (project: Project) => {
    try {
      setLoading(true);
      await apiServices.projects.update(project.id || project._id, {
        isArchived: !project.isArchived,
      });

      message.success(
        `Project ${project.isArchived ? 'unarchived' : 'archived'} successfully`
      );
      fetchProjects(); // Refresh list
    } catch (err) {
      console.error('Error archiving project:', err);
      message.error('Failed to update project status');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDeleteProject = async (project: Project) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${project.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await apiServices.projects.delete(project.id || project._id);

      message.success('Project deleted successfully');
      fetchProjects(); // Refresh list
    } catch (err) {
      console.error('Error deleting project:', err);
      message.error('Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Project) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            {record.projectType === 'website' ? (
              <GlobalOutlined className="text-blue-500" />
            ) : (
              <SettingOutlined className="text-blue-500" />
            )}
          </div>
          <div>
            <div className="font-medium">{text}</div>
            {record.description && (
              <div className="text-xs text-gray-500 truncate max-w-xs">
                {record.description.length > 60
                  ? `${record.description.substring(0, 60)}...`
                  : record.description}
              </div>
            )}
          </div>
        </div>
      ),
      sorter: (a: Project, b: Project) => a.name.localeCompare(b.name),
    },
    {
      title: 'Type',
      dataIndex: 'projectType',
      key: 'projectType',
      render: (type: string) => {
        const typeLabels: Record<string, { label: string; color: string }> = {
          website: { label: 'Website', color: 'blue' },
          webapp: { label: 'Web App', color: 'purple' },
          mobile_app: { label: 'Mobile App', color: 'green' },
          desktop_app: { label: 'Desktop App', color: 'orange' },
          other: { label: 'Other', color: 'default' },
        };

        const typeInfo = typeLabels[type] || typeLabels.other;

        return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>;
      },
      filters: [
        { text: 'Website', value: 'website' },
        { text: 'Web App', value: 'webapp' },
        { text: 'Mobile App', value: 'mobile_app' },
        { text: 'Desktop App', value: 'desktop_app' },
        { text: 'Other', value: 'other' },
      ],
      onFilter: (value: string, record: Project) =>
        record.projectType === value,
    },
    {
      title: 'Languages',
      dataIndex: 'supportedLocales',
      key: 'supportedLocales',
      render: (locales: string[]) => {
        if (!locales || !locales.length) return '-';

        const languages: Record<string, string> = {
          'en-US': 'English (US)',
          'en-GB': 'English (UK)',
          'fr-FR': 'French',
          'es-ES': 'Spanish',
          'de-DE': 'German',
          'it-IT': 'Italian',
          'ja-JP': 'Japanese',
          'zh-CN': 'Chinese',
        };

        const count = locales.length;
        const mainLocale = locales[0];

        return (
          <Tooltip
            title={
              count > 1 ? (
                <div>
                  {locales.map((locale) => (
                    <div key={locale}>{languages[locale] || locale}</div>
                  ))}
                </div>
              ) : null
            }
          >
            <span>
              {languages[mainLocale] || mainLocale}
              {count > 1 && ` +${count - 1}`}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'isArchived',
      key: 'isArchived',
      render: (isArchived: boolean) => (
        <Tag color={isArchived ? 'default' : 'green'}>
          {isArchived ? 'Archived' : 'Active'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: false },
        { text: 'Archived', value: true },
      ],
      onFilter: (value: boolean, record: Project) =>
        record.isArchived === value,
    },
    {
      title: 'Phrases',
      key: 'phrases',
      render: (_: any, record: Project) => {
        const publishedCount = record.publishedPhraseCount || 0;
        const pendingCount = record.pendingPhraseCount || 0;
        const totalCount = publishedCount + pendingCount;

        return (
          <div>
            <div>{totalCount} Total</div>
            {totalCount > 0 && (
              <div className="text-xs text-gray-500">
                {publishedCount} Published, {pendingCount} Pending
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString();
      },
      sorter: (a: Project, b: Project) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Project) => (
        <Dropdown menu={getActionMenu(record)} trigger={['click']}>
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <Title level={3} className="mb-4 md:mb-0">
            Projects
          </Title>

          <FlagView view="canCreateProjects">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/add-project')}
            >
              Add New Project
            </Button>
          </FlagView>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input.Search
              placeholder="Search projects..."
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              className="w-full sm:w-64"
              allowClear
            />

            <Select
              placeholder="Filter by type"
              onChange={handleTypeFilter}
              value={filterType}
              style={{ minWidth: 150 }}
              allowClear
            >
              <Option value="all">All Types</Option>
              <Option value="website">Website</Option>
              <Option value="webapp">Web App</Option>
              <Option value="mobile_app">Mobile App</Option>
              <Option value="desktop_app">Desktop App</Option>
              <Option value="other">Other</Option>
            </Select>

            <Select
              placeholder="Filter by status"
              onChange={handleStatusFilter}
              value={filterStatus}
              style={{ minWidth: 150 }}
              allowClear
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="archived">Archived</Option>
            </Select>
          </div>

          <Button
            icon={<FilterOutlined />}
            onClick={() => {
              setSearchText('');
              setFilterType('all');
              setFilterStatus('all');
            }}
            disabled={
              searchText === '' &&
              filterType === 'all' &&
              filterStatus === 'all'
            }
          >
            Clear Filters
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded mb-4">{error}</div>
        )}

        <Table
          columns={columns}
          dataSource={projects}
          rowKey={(record) => record.id || record._id}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          locale={{
            emptyText:
              searchText || filterType !== 'all' || filterStatus !== 'all'
                ? 'No projects match your search criteria'
                : 'No projects found. Create your first project!',
          }}
        />

        {projects.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-gray-500 text-sm">
            <div>
              Showing{' '}
              {Math.min(
                (pagination.current - 1) * pagination.pageSize + 1,
                projects.length
              )}{' '}
              to{' '}
              {Math.min(
                pagination.current * pagination.pageSize,
                projects.length
              )}{' '}
              of {projects.length} projects
            </div>

            <Tooltip title="Projects data is refreshed automatically when filters change">
              <InfoCircleOutlined />
            </Tooltip>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProjectsList;
