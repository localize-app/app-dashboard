import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Progress,
  Typography,
  Space,
  Select,
  Spin,
  Empty,
} from 'antd';
import {
  SearchOutlined,
  GlobalOutlined,
  FileTextOutlined,
  // ClockOutlined,
  BarChartOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useAuthContext } from '@/context/AuthContext';
import apiServices from '@/api/apiServices';

const { Title, Text } = Typography;
const { Option } = Select;

export default function OrganizationOverview() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');

  // Stats for the dashboard
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalLanguages: 0,
    teamMembers: 0,
    maxProjects: 2, // Default limits
    maxLanguages: 1,
    maxTeamMembers: 10,
  });

  // Fetch projects when component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user || !user.company) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiServices.projects.getAll({
          company: user.company,
        });
        setProjects(response);

        // Calculate stats from projects
        const uniqueLanguages = new Set();
        response.forEach((project) => {
          if (project.supportedLocales && project.supportedLocales.length) {
            project.supportedLocales.forEach((locale) =>
              uniqueLanguages.add(locale)
            );
          }
        });

        // Update stats
        setStats({
          ...stats,
          totalProjects: response.length,
          totalLanguages: uniqueLanguages.size || 1,
          teamMembers: 6, // Hardcoded for now, would come from API
        });
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  // Handle search and sorting
  const filteredProjects = projects
    .filter((project) => {
      return (
        project.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (project.description &&
          project.description.toLowerCase().includes(searchText.toLowerCase()))
      );
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  return (
    <div className="p-6">
      {/* Organization Header */}
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="m-0">
          {user?.company?.name || 'Inter-Val'}
        </Title>
        <div className="flex items-center">
          <Text className="mr-2">Plan:</Text>
          <Text className="text-blue-500">INTERVAL ADVANCED</Text>
        </div>
      </div>

      {/* Organization Overview Card */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Title level={4} className="m-0">
            Organization Overview
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/add-project')}
          >
            Add New Project
          </Button>
        </div>

        <Row gutter={16}>
          {/* Active Project Card */}
          <Col xs={24} md={8} className="mb-4">
            <Card>
              <div className="flex justify-between items-center mb-3">
                <Space>
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                  <Text strong>Active Project</Text>
                </Space>
                <Text className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {stats.totalProjects}{' '}
                  {stats.totalProjects === 1 ? 'Project' : 'Projects'}
                </Text>
              </div>
              {/* <Text type="secondary" className="block mb-2">
                Used: {stats.totalProjects} / {stats.maxProjects}
              </Text> */}
              <Progress
                percent={(stats.totalProjects / stats.maxProjects) * 100}
                showInfo={false}
                strokeColor="#8c43fe"
              />
            </Card>
          </Col>

          {/* Language Card */}
          <Col xs={24} md={8} className="mb-4">
            <Card>
              <div className="flex justify-between items-center mb-3">
                <Space>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <Text strong>Language</Text>
                </Space>
                <Text className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {stats.totalLanguages}{' '}
                  {stats.totalLanguages === 1 ? 'Language' : 'Languages'}
                </Text>
              </div>
              {/* <Text type="secondary" className="block mb-2">
                Used: {stats.totalLanguages} / {stats.maxLanguages}
              </Text> */}
              <Progress
                percent={(stats.totalLanguages / stats.maxLanguages) * 100}
                showInfo={false}
                strokeColor="#52c41a"
              />
            </Card>
          </Col>

          {/* Team Members Card */}
          <Col xs={24} md={8} className="mb-4">
            <Card>
              <div className="flex justify-between items-center mb-3">
                <Space>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <Text strong>Team Members</Text>
                </Space>
                <Text className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {stats.teamMembers} Members
                </Text>
              </div>
              {/* <Text type="secondary" className="block mb-2">
                Used: {stats.teamMembers} / {stats.maxTeamMembers}
              </Text> */}
              <Progress
                percent={(stats.teamMembers / stats.maxTeamMembers) * 100}
                showInfo={false}
                strokeColor="#faad14"
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Projects List Card */}
      <Card>
        <Title level={4} className="mt-0 mb-4">
          Projects List
        </Title>

        <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
          <Input
            placeholder="Find a Project..."
            prefix={<SearchOutlined />}
            className="w-full sm:w-64"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select
            defaultValue="name-asc"
            className="min-w-44"
            value={sortOrder}
            onChange={(value) => setSortOrder(value)}
          >
            <Option value="name-asc">Name (ascending)</Option>
            <Option value="name-desc">Name (descending)</Option>
            <Option value="date-asc">Date (ascending)</Option>
            <Option value="date-desc">Date (descending)</Option>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" tip="Loading projects..." />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : (
          <Row gutter={16}>
            {filteredProjects.length === 0 && !searchText ? (
              <Col span={24}>
                <Empty
                  description="No projects found. Create your first project!"
                  className="my-10"
                />
              </Col>
            ) : filteredProjects.length === 0 && searchText ? (
              <Col span={24}>
                <Empty
                  description={`No projects match "${searchText}"`}
                  className="my-10"
                />
              </Col>
            ) : (
              <>
                {/* Project Cards */}
                {filteredProjects.map((project) => (
                  <Col
                    xs={24}
                    md={12}
                    lg={8}
                    xl={6}
                    className="mb-4"
                    key={project._id || project.id}
                  >
                    <Card className="h-full">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <GlobalOutlined className="text-blue-500" />
                        </div>
                        <Text strong>{project.name}</Text>
                        <Button
                          type="text"
                          icon={<SearchOutlined />}
                          className="ml-auto p-1"
                          onClick={() =>
                            navigate(`/projects/${project._id || project.id}`)
                          }
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Space>
                            <FileTextOutlined />
                            <Text>Published Phrases</Text>
                          </Space>
                          <Text strong>
                            {project.publishedPhraseCount || 0}
                          </Text>
                        </div>

                        <div className="flex items-center justify-between">
                          <Space>
                            {/* <ClockOutlined /> */}
                            <Text>Pending Phrases</Text>
                          </Space>
                          <Text strong>{project.pendingPhraseCount || 0}</Text>
                        </div>

                        <div className="flex items-center justify-between">
                          <Space>
                            <GlobalOutlined />
                            <Text>Languages</Text>
                          </Space>
                          <Text strong>
                            {project.supportedLocales
                              ? project.supportedLocales.length
                              : 1}
                          </Text>
                        </div>

                        <div className="flex items-center justify-between">
                          <Space>
                            <BarChartOutlined />
                            <Text>Pageviews</Text>
                          </Space>
                          <Text strong>{project.pageviews || 0}</Text>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}

                {/* New Project Card */}
                <div className="flex justify-between items-center mb-4">
                  <Space>
                    <Button
                      type="default"
                      onClick={() => navigate('/projects')}
                    >
                      View All Projects
                    </Button>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => navigate('/add-project')}
                    >
                      Add New Project
                    </Button>
                  </Space>
                </div>
              </>
            )}
          </Row>
        )}
      </Card>
    </div>
  );
}
