// src/views/pages/manage-organization/Companies/Companies.tsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Typography,
  message,
  Modal,
  Form,
  Tooltip,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

import companyService from '@/api/services/companyService';
import { Company, CreateCompanyDto } from '@/types/company.types';
import { useAuthContext } from '@/context/AuthContext';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Validation schema for company form
const CompanySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Company name is required'),
  description: Yup.string().max(500, 'Description too long'),
});

const Companies: React.FC = () => {
  const { user } = useAuthContext();

  // State management
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Fetch companies
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await companyService.getAll();
      setCompanies(response);
    } catch (error) {
      console.error('Error fetching companies:', error);
      message.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  // Load companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Handle company creation/update
  const handleSubmit = async (values: CreateCompanyDto) => {
    try {
      if (editingCompany) {
        await companyService.update(editingCompany._id, values);
        message.success('Company updated successfully');
      } else {
        await companyService.create(values);
        message.success('Company created successfully');
      }

      setModalVisible(false);
      setEditingCompany(null);
      fetchCompanies();
    } catch (error: any) {
      console.error('Error saving company:', error);
      message.error(error.response?.data?.message || 'Failed to save company');
    }
  };

  // Handle company deletion
  const handleDelete = async (id: string) => {
    try {
      await companyService.delete(id);
      message.success('Company deleted successfully');
      fetchCompanies();
    } catch (error: any) {
      console.error('Error deleting company:', error);
      message.error(
        error.response?.data?.message || 'Failed to delete company'
      );
    }
  };

  // Open modal for editing
  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setModalVisible(true);
  };

  // Open modal for creating
  const handleCreate = () => {
    setEditingCompany(null);
    setModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setModalVisible(false);
    setEditingCompany(null);
  };

  // Filter companies based on search
  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchText.toLowerCase()) ||
      company.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Company) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.description && (
            <div className="text-xs text-gray-500 truncate max-w-xs">
              {record.description.length > 80
                ? `${record.description.substring(0, 80)}...`
                : record.description}
            </div>
          )}
        </div>
      ),
      sorter: (a: Company, b: Company) => a.name.localeCompare(b.name),
    },
    {
      title: 'Projects',
      dataIndex: 'projects',
      key: 'projects',
      render: (projects: string[]) => (
        <div className="flex items-center">
          <ProjectOutlined className="mr-1 text-blue-500" />
          <span>{projects?.length || 0} Projects</span>
        </div>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString();
      },
      sorter: (a: Company, b: Company) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: Company) => (
        <Space size="small">
          <Tooltip title="Edit Company">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          <Popconfirm
            title="Delete Company"
            description="Are you sure you want to delete this company? This action cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Tooltip title="Delete Company">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <Title level={3} className="mb-2">
              Companies
            </Title>
            <Text className="text-gray-500">
              Manage your organizations and companies
            </Text>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            className="mt-4 md:mt-0"
          >
            Add Company
          </Button>
        </div>

        {/* Search bar */}
        <div className="mb-4">
          <Input
            placeholder="Search companies..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ maxWidth: 400 }}
          />
        </div>

        {/* Companies table */}
        <Table
          columns={columns}
          dataSource={filteredCompanies}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} companies`,
          }}
          locale={{
            emptyText: searchText
              ? 'No companies match your search'
              : 'No companies found. Create your first company!',
          }}
        />

        {/* Statistics */}
        {companies.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                Total Companies:{' '}
                <span className="font-medium text-gray-700">
                  {companies.length}
                </span>
              </div>
              <div>
                Total Projects:{' '}
                <span className="font-medium text-gray-700">
                  {companies.reduce(
                    (sum, company) => sum + (company.projects?.length || 0),
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingCompany ? 'Edit Company' : 'Create New Company'}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Formik
          initialValues={{
            name: editingCompany?.name || '',
            description: editingCompany?.description || '',
          }}
          validationSchema={CompanySchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Company Name"
                required
                validateStatus={errors.name && touched.name ? 'error' : ''}
                help={errors.name && touched.name ? errors.name : ''}
              >
                <Input
                  placeholder="Enter company name"
                  value={values.name}
                  onChange={(e) => setFieldValue('name', e.target.value)}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Description"
                validateStatus={
                  errors.description && touched.description ? 'error' : ''
                }
                help={
                  errors.description && touched.description
                    ? errors.description
                    : ''
                }
              >
                <TextArea
                  placeholder="Enter company description (optional)"
                  value={values.description}
                  onChange={(e) => setFieldValue('description', e.target.value)}
                  rows={4}
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              {/* Form Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                  {editingCompany ? 'Update Company' : 'Create Company'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Companies;
