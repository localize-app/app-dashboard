import { Avatar, Tag, Button } from 'antd';

export const teamTableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar src={record.image} alt={record.name} className="mr-3" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color="green">{role}</Tag>
      ),
    },
    {
      title: 'Configuration',
      key: 'configuration',
      align: 'center' ,
      render: () => (
        <Button type="link">Manage Access</Button>
      ),
    },
  ];