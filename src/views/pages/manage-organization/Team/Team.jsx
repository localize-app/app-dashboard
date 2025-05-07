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
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
// import { UserContext } from '@/context/UserContext';

const { Title, Text } = Typography;
const { useToken } = theme;

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState('1');
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const authToken = localStorage.getItem('auth_token');
  // let { userCount, setUserCount } = useContext(UserContext);

  // Fetch team members with Axios (try/catch)
  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/user`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setTeamMembers(res.data);
      // setUserCount(res.data.length);
      setIsError(false);
    } catch (err) {
      console.error(err);
      setIsError(true);
      setErrorMessage(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const filteredMembers = teamMembers.filter((member) =>
    Object.values(member).some((value) =>
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1677ff' }}>
            {record.initials || record.name?.charAt(0)}
          </Avatar>
          <div>
            <div>{record.name}</div>
            <div style={{ fontSize: 12, color: '#888' }}>
              {record.email}
              {record.verified && (
                <Badge
                  status="processing"
                  color="#1890ff"
                  style={{ marginLeft: 4 }}
                />
              )}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Billing',
      dataIndex: 'billing',
      key: 'billing',
    },
    {
      title: 'Last Online',
      dataIndex: 'lastOnline',
      key: 'lastOnline',
    },
    {
      title: 'Project Access',
      dataIndex: 'projectAccess',
      key: 'projectAccess',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => <Button type="text" icon={<EditOutlined />} />,
    },
  ];

  const exportTeamData = () => {
    console.log('Exporting team data');
  };

  const addMember = () => {
    console.log('Adding new member');
  };

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
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ maxWidth: 300 }}
              />
              <Space wrap>
                <Select defaultValue="Inter-Val" style={{ width: 120 }}>
                  <Select.Option value="inter-val">Inter-Val</Select.Option>
                </Select>
                <Button icon={<DownloadOutlined />} onClick={exportTeamData}>
                  Export Team Data
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={addMember}
                >
                  Add Member
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
                All Team Members:{' '}
                <Text strong>{teamMembers.length} Members</Text>
              </Text>
              <Space>
                <Text>Team Seats</Text>
                <Progress
                  percent={teamMembers.length * 10}
                  showInfo={false}
                  strokeColor="#f0c132"
                  style={{ width: 180 }}
                />
                <Text>Used {teamMembers.length} / 10</Text>
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
                emptyText: searchText
                  ? 'No team members match your search'
                  : 'No team members found',
              }}
            />
          )}
        </>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          User Groups <Badge count={0} style={{ backgroundColor: '#a0a0ff' }} />
        </span>
      ),
      children: (
        <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>
          User groups content would appear here
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm, // Change to darkAlgorithm for dark mode
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <div style={{ padding: 24, backgroundColor: '#fff' }}>
        <Title level={3}>Your Team</Title>
        <Text type="secondary">
          Streamline your team management—manage users, setup granular control
          of permissions, and setup user groups.
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
      </div>
    </ConfigProvider>
  );
}
