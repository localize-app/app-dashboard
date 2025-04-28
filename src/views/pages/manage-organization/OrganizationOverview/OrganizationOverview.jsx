import { useProjects, useUsers } from '@/api/hooks/useQueries';
import { useEffect } from 'react';
import { Card, Typography, Divider, Flex, Button, Progress, Tag, List } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { green, purple, red, yellow } from '@ant-design/colors';

export default function OrganizationOverview() {
  const { data: usersTeam, isLoading, error } = useUsers();
  const { data: companyProjects, isLoadingProjects, errorProjects } = useProjects();
  const actions = [
    <EllipsisOutlined key="ellipsis" />
  ];
  const data = [
    {
      title: 'Title 1',
    },
    {
      title: 'Title 2',
    },
    {
      title: 'Title 3',
    },
  ];
  useEffect(() => {
    if (usersTeam && companyProjects) {
      console.log(usersTeam)
      console.log(companyProjects);
    }
  }, [usersTeam, companyProjects]);
  return (<>
    <Flex
      justify='space-between'
      align='center'
      >
      <Typography.Title level={2}>Company Name</Typography.Title>
      <Typography.Title level={5}>Company's plane
        <Tag color="green">Free</Tag>
      </Typography.Title>
    </Flex>
    <Flex vertical className='w-full bg-white rounded-lg shadow-md'
      justify='space-between'
      align='center'
      style={{ padding: '20px' }}>
      <Flex wrap align='center' justify='space-between' className='w-full'>
        <Typography.Title level={3}>Organization Overview</Typography.Title>
        <Button type="primary">Add New Project</Button>
      </Flex>
      <Divider />
      <Flex wrap gap={16} size={16} justify='space-between' align='center'>
        <Card title="Active Project" extra={<Link to="/project-overview">More</Link>} style={{ width: 350 }}>
          <Tag color="purple">{companyProjects?.length}</Tag>
          <Progress
            percent={companyProjects?.length * 50}
            format={(number) => `${number / 10} projects Out of 2`}
            strokeColor={[purple[5], purple[6]]} />
        </Card>
        <Card title="Languages" extra={<Link to="/languages">More</Link>} style={{ width: 350 }}>
          <Tag color="green">LANGUAGES</Tag>
          <Progress
            percent={10}
            format={(number) => `${number / 10} languages`}
            strokeColor={[green[6], green[6]]} />
        </Card>
        <Card title="Team Members" extra={<Link to="/team">More</Link>} style={{ width: 350 }}>
          <Tag color="gold">{usersTeam?.length} Members Out of 10</Tag>
          <Progress
            percent={usersTeam?.length * 10}
            format={(number) => `${number / 10}`}
            percentPosition={{ align: 'end', type: 'none' }}
            strokeColor={[yellow[5], yellow[6], red[6]]} />
        </Card>
      </Flex>
    </Flex>
    <Divider />
    <Flex vertical className='w-full bg-white rounded-lg shadow-md'
      justify='space-between'
      align='center'
      style={{ padding: '20px' }}>
      <List
        grid={{
          gutter: 16,
          column: companyProjects ? Math.min(companyProjects.length, 3) : 1
        }}
        dataSource={companyProjects}
        renderItem={(item) => (
          <List.Item>
            <Card title={item.title}>Card content</Card>
          </List.Item>
        )}
      />
    </Flex>
  </>
  );
}