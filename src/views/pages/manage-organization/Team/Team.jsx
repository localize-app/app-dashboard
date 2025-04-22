import { useUsers } from '@/api/hooks/useQueries';
import { useEffect, useMemo, useState } from 'react';
import { Card, Typography, Tag, Spin, Alert, Table, Progress, Flex, Input } from 'antd';
import { green, red } from '@ant-design/colors';
const { Title, Text } = Typography;
const { Search } = Input;


export default function Team() {
  const { data: usersTeam, isLoading, error } = useUsers();
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (usersTeam) {
      console.log(usersTeam);
    }
  }, [usersTeam]);


  const filteredUsers = useMemo(() => {
    if (!usersTeam) return [];
    return usersTeam.filter(user =>
      user.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [usersTeam, searchValue]);

  if (isLoading) return <Spin size="large" className="flex justify-center items-center w-100 my-8" />;

  if (error) return (
    <Alert
      message="Error"
      description={`Error loading user data: ${error.message}`}
      type="error"
      showIcon
    />
  );

  if (!usersTeam || usersTeam.length === 0) return (
    <Alert
      message="No Data"
      description="No user data available"
      type="info"
      showIcon
    />
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Billing',
      dataIndex: 'billing',
    },
    {
      title: 'Last Online',
      dataIndex: 'lastLoginAt',
      render: (text) => {
        const date = new Date(text);
        return (
          <Text>{date.toLocaleDateString()}</Text>
        );
      },
    },
    {
      title: 'Project Access',
      dataIndex: 'projects',
    },
    {
      title: 'Actions',
      width: 150,
      fixed: 'right',
      render: () => (
        <Flex vertical justify='center' align="center" gap={8}>
          <Typography.Link>Edit</Typography.Link>
          <Typography.Link type="danger">Delete</Typography.Link>
        </Flex>
      ),
    },
  ];
  return (
    <div className="p-4 overflow-hidden">
      <Title level={3} className="mb-4">Team</Title>
      <Card className="mb-4">
        <Title level={4} className="mb-4">
          Team Members   <Tag color="blue">{usersTeam.length}</Tag>
        </Title>
        <Flex 
        align="center" justify="space-between" style={{ width: '90%', marginTop: '2rem', marginBottom: '2rem' }}>
          <Search
            placeholder="Search by name or email"
            allowClear
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 300 }}
          />
          <Progress
            percent={usersTeam.length * 10}
            format={(number) => `${number / 10} Member Out of 10`}
            percentPosition={{ align: 'end', type: 'none' }}
            strokeColor={[green[6], green[6], red[5]]}
            steps={10}
          />
        </Flex>
        <Table columns={columns} dataSource={filteredUsers} rowKey="id" />
      </Card>
    </div>
  );
}