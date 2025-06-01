// src/views/pages/manage-organization/Team/Team.jsx - Fixed to follow your project structure
import React, { useContext, useEffect, useState } from 'react';
import {
  Table,
  Input,
  Button,
  Tabs,
  Select,
  Tooltip,
  Badge,
  Progress,
  Typography,
  Spin,
  Alert,
  ConfigProvider,
  theme,
  Space,
  Avatar,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
  UserAddOutlined,
  DeleteOutlined,
  MailOutlined,
} from '@ant-design/icons';

import { useAuthContext } from '@/context/AuthContext';
import apiServices from '@/api/apiServices';

const { Title, Text } = Typography;
const { Option } = Select;
const { useToken } = theme;

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState('1');
  const [teamMembers, setTeamMembers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Modal states
  const [createUserModalVisible, setCreateUserModalVisible] = useState(false);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('all');

  // Form instances
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { user: currentUser } = useAuthContext();

  // Fetch companies for assignment
  const fetchCompanies = async () => {
    try {
      const companiesData = await apiServices.companies.getAll();
      setCompanies(companiesData);
    } catch (err) {
      console.error('Error fetching companies:', err);
      message.error('Failed to load companies');
    }
  };

  // Fetch team members using your existing API service
  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const data = await apiServices.users.getAll();
      setTeamMembers(data);
      setIsError(false);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setIsError(true);
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          'Failed to fetch team members'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Create new user using your API service
  const handleCreateUser = async (values) => {
    try {
      setIsLoading(true);

      console.log('Form values received:', values); // Debug log
      console.log('Available companies:', companies); // Debug log

      // Validate that company is selected
      if (!values.company) {
        message.error('Please select a company');
        return;
      }

      // Ensure company is included in the payload
      const userData = {
        ...values,
        company: values.company,
      };

      console.log('Creating user with data:', userData); // Debug log

      await apiServices.users.create(userData);
      message.success('User created successfully');
      setCreateUserModalVisible(false);
      createForm.resetFields();
      fetchTeamMembers(); // Refresh the list
    } catch (err) {
      console.error('Error creating user:', err);
      message.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user using your API service
  const handleUpdateUser = async (values) => {
    if (!selectedUser) return;

    console.log(selectedUser, values);

    try {
      setIsLoading(true);
      await apiServices.users.update(selectedUser.id, values);
      message.success('User updated successfully');
      setEditUserModalVisible(false);
      setSelectedUser(null);
      editForm.resetFields();
      fetchTeamMembers(); // Refresh the list
    } catch (err) {
      console.error('Error updating user:', err);
      message.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete user using your API service
  const handleDeleteUser = async (userId) => {
    try {
      setIsLoading(true);
      await apiServices.users.delete(userId);
      message.success('User deleted successfully');
      fetchTeamMembers(); // Refresh the list
    } catch (err) {
      console.error('Error deleting user:', err);
      message.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  };

  // Assign user to company using your API service
  const handleAssignUserToCompany = async (userId, companyId) => {
    try {
      await apiServices.users.assignToCompany(userId, companyId);
      message.success('User assigned to company successfully');
      fetchTeamMembers(); // Refresh the list
    } catch (err) {
      console.error('Error assigning user to company:', err);
      message.error(
        err.response?.data?.message || 'Failed to assign user to company'
      );
    }
  };

  useEffect(() => {
    fetchTeamMembers();
    fetchCompanies();
  }, []);

  // Filter members by company and search text
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch = Object.values(member).some((value) =>
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    );

    const matchesCompany =
      selectedCompany === 'all' ||
      (member.company && member.company.toString() === selectedCompany);

    return matchesSearch && matchesCompany;
  });

  // Get company name by ID
  const getCompanyName = (companyId) => {
    console.log(companyId);

    const company = companies.find(
      (c) => c.id === companyId || c.id === companyId
    );
    return company ? company.name : 'No Company';
  };

  // Role colors
  const getRoleColor = (role) => {
    const colors = {
      admin: 'red',
      manager: 'blue',
      member: 'green',
      translator: 'orange',
      owner: 'purple',
    };
    return colors[role] || 'default';
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1677ff' }}>
            {(record.firstName?.[0] || '') + (record.lastName?.[0] || '')}
          </Avatar>
          <div>
            <div className="font-medium">
              {record.firstName} {record.lastName}
            </div>
            <div style={{ fontSize: 12, color: '#888' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {role?.charAt(0).toUpperCase() + role?.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (company) => <span>{company?.name ?? 'No Company'}</span>,
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (date) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleDateString();
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit User">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedUser(record);
                editForm.setFieldsValue({
                  firstName: record.firstName,
                  lastName: record.lastName,
                  email: record.email,
                  role: record.role,
                  company: record.company,
                });
                setEditUserModalVisible(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Send Invitation Email">
            <Button
              type="text"
              icon={<MailOutlined />}
              onClick={() => {
                message.info('Email invitation feature coming soon');
              }}
            />
          </Tooltip>

          {currentUser?.role === 'admin' && record.id !== currentUser.id && (
            <Popconfirm
              title="Delete User"
              description="Are you sure you want to delete this user?"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete User">
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: '1',
      label: 'Your Team',
      children: (
        <>
          <Space
            direction="vertical"
            size="middle"
            style={{ display: 'flex', marginBottom: 16 }}
          >
            <Space
              wrap
              style={{ justifyContent: 'space-between', width: '100%' }}
            >
              {/* <Space>
                <Input
                  placeholder="Search team members..."
                  prefix={<SearchOutlined />}
                  allowClear
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                />

                <Select
                  placeholder="Filter by company"
                  value={selectedCompany}
                  onChange={setSelectedCompany}
                  style={{ width: 200 }}
                  allowClear
                >
                  <Option value="all">All Companies</Option>
                  {companies.map((company) => (
                    <Option key={company.id} value={company.id}>
                      {company.name}
                    </Option>
                  ))}
                </Select>
              </Space> */}

              <Space wrap>
                {/* <Button
                  icon={<DownloadOutlined />}
                  onClick={() => message.info('Export feature coming soon')}
                >
                  Export Team Data
                </Button> */}

                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={() => {
                    // Ensure companies are loaded before opening modal
                    if (companies.length === 0) {
                      fetchCompanies().then(() => {
                        setCreateUserModalVisible(true);
                      });
                    } else {
                      setCreateUserModalVisible(true);
                    }
                  }}
                >
                  Add Team Member
                </Button>
              </Space>
            </Space>

            <Space
              style={{
                justifyContent: 'space-between',
                width: '100%',
              }}
              wrap
            >
              <Text>
                Team Members:{' '}
                <Text strong>{filteredMembers.length} Members</Text>
              </Text>
              <Space>
                <Text>Team Capacity</Text>
                <Progress
                  percent={Math.min((teamMembers.length / 50) * 100, 100)}
                  showInfo={false}
                  strokeColor="#f0c132"
                  style={{ width: 180 }}
                />
                <Text>Used {teamMembers.length} / 50</Text>
              </Space>
            </Space>
          </Space>

          {isLoading ? (
            <Spin size="large" style={{ display: 'block', marginTop: 64 }} />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredMembers}
              rowKey="_id"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total}`,
                size: 'small',
              }}
              locale={{
                emptyText:
                  searchText || selectedCompany !== 'all'
                    ? 'No team members match your filters'
                    : 'No team members found',
              }}
            />
          )}
        </>
      ),
    },
    // {
    //   key: '2',
    //   label: (
    //     <span>
    //       User Groups <Badge count={0} style={{ backgroundColor: '#a0a0ff' }} />
    //     </span>
    //   ),
    //   children: (
    //     <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>
    //       User groups feature coming soon...
    //     </div>
    //   ),
    // },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <div style={{ padding: 24, backgroundColor: '#fff' }}>
        <Title level={3}>Team Management</Title>
        <Text type="secondary">
          Manage your team members, assign them to companies, and control their
          permissions.
          <Tooltip title="More information">
            <InfoCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </Text>

        {isError && (
          <Alert
            message="Error Loading Team Data"
            description={errorMessage}
            type="error"
            showIcon
            closable
            style={{ marginTop: 16 }}
          />
        )}

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ marginTop: 24 }}
        />

        {/* Create User Modal */}
        <Modal
          title="Add New Team Member"
          open={createUserModalVisible}
          onCancel={() => {
            setCreateUserModalVisible(false);
            createForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={createForm}
            layout="vertical"
            onFinish={handleCreateUser}
            initialValues={{
              role: 'member',
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: 'Please enter first name!' },
                  {
                    min: 2,
                    message: 'First name must be at least 2 characters!',
                  },
                ]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: 'Please enter last name!' },
                  {
                    min: 2,
                    message: 'Last name must be at least 2 characters!',
                  },
                ]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </div>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: 'Please enter email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input type="email" placeholder="Enter email address" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter password!' },
                { min: 8, message: 'Password must be at least 8 characters!' },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please select a role!' }]}
              >
                <Select placeholder="Select role">
                  <Option value="member">Member</Option>
                  <Option value="translator">Translator</Option>
                  <Option value="manager">Manager</Option>
                  {currentUser?.role === 'admin' && (
                    <Option value="admin">Admin</Option>
                  )}
                </Select>
              </Form.Item>

              <Form.Item
                label="Company"
                name="company"
                rules={[
                  { required: true, message: 'Please select a company!' },
                ]}
              >
                <Select
                  placeholder="Select company"
                  loading={companies.length === 0}
                  notFoundContent={
                    companies.length === 0
                      ? 'Loading companies...'
                      : 'No companies found'
                  }
                >
                  {companies.map((company) => (
                    <Option key={company.id} value={company.id}>
                      {`${company.name}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                onClick={() => {
                  setCreateUserModalVisible(false);
                  createForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Create User
              </Button>
            </div>
          </Form>
        </Modal>

        {/* Edit User Modal */}
        <Modal
          title="Edit Team Member"
          open={editUserModalVisible}
          onCancel={() => {
            setEditUserModalVisible(false);
            setSelectedUser(null);
            editForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form form={editForm} layout="vertical" onFinish={handleUpdateUser}>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: 'Please enter first name!' },
                  {
                    min: 2,
                    message: 'First name must be at least 2 characters!',
                  },
                ]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: 'Please enter last name!' },
                  {
                    min: 2,
                    message: 'Last name must be at least 2 characters!',
                  },
                ]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </div>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: 'Please enter email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input type="email" placeholder="Enter email address" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please select a role!' }]}
              >
                <Select placeholder="Select role">
                  <Option value="member">Member</Option>
                  <Option value="translator">Translator</Option>
                  <Option value="manager">Manager</Option>
                  {currentUser?.role === 'admin' && (
                    <Option value="admin">Admin</Option>
                  )}
                </Select>
              </Form.Item>

              <Form.Item
                label="Company"
                name="company"
                rules={[
                  { required: true, message: 'Please select a company!' },
                ]}
              >
                <Select placeholder="Select company">
                  {companies.map((company) => (
                    <Option key={company.id} value={company.id}>
                      {company.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                onClick={() => {
                  setEditUserModalVisible(false);
                  setSelectedUser(null);
                  editForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Update User
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
}
