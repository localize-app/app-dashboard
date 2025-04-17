import React, { useContext } from 'react';

// Try importing from a different path that might be supported in your environment
// Assuming you have Ant Design configured in your project
import { Card, Row, Col, Button, Input, Progress, Typography, Space, Select, Tooltip } from 'antd';
import { UserContext } from '@/context/UserContext';

// For icons, use simple SVG or emoji instead of Ant Design icons
const { Title, Text } = Typography;
const { Option } = Select;
// let { userCount , setUserCount } = useContext(UserContext);

export default function OrganizationOverview() {
  let { userCount } = useContext(UserContext);
  return (
    <div className="p-6 bg-white">
      {/* Organization Header */}
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="m-0">Inter-Val</Title>
        <div className="flex items-center">
          <Text className="mr-2">Plan:</Text>
          <Text className="text-blue-500">INTERVAL ADVANCED</Text>
        </div>
      </div>

      {/* Organization Overview Card */}
      <Card className="mb-2">
        <div className="flex justify-between items-center mb-4">
          <Title level={4} className="m-0">Organization Overview</Title>
          <Button type="primary">Add New Project</Button>
        </div>

        <Row gutter={16}>
          {/* Active Project Card */}
          <Col xs={24} md={8} className="mb-4">
            <Card
              title={
                <div className="flex items-center justify-between">
                  <Space>
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span>Active Project</span>
                  </Space>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">1 Project</span>
                </div>
              }
              bordered={true}
            >
              <Text type="secondary" className="block mb-2">Used: 1 / 2</Text>
              <Progress
                percent={50}
                showInfo={false}
                strokeColor="#a855f7"
                trailColor="#e6e6e6"
              />
            </Card>
          </Col>

          {/* Language Card */}
          <Col xs={24} md={8} className="mb-4">
            <Card
              title={
                <div className="flex items-center justify-between">
                  <Space>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Language</span>
                  </Space>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">1 Language</span>
                </div>
              }
              bordered={true}
            >
              <Text type="secondary" className="block mb-2">Used: 1 / 1</Text>
              <Progress
                percent={100}
                showInfo={false}
                strokeColor="#22c55e"
                trailColor="#e6e6e6"
              />
            </Card>
          </Col>

          {/* Team Members Card */}
          <Col xs={24} md={8} className="mb-4">
            <Card
              title={
                <div className="flex items-center justify-between">
                  <Space>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Team Members</span>
                  </Space>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{userCount} Members</span>
                </div>
              }
              bordered={true}
            >
              <Text type="secondary" className="block mb-2">Used: {userCount} / 10</Text>
              <Progress
                percent={userCount * 10}
                showInfo={false}
                strokeColor="#eab308"
                trailColor="#e6e6e6"
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Projects List Card */}
      <Card className="mb-6">
        <Title level={4} className="m-0 mb-4">Projects List</Title>

        <div className="flex justify-between items-center mb-4 flex-col sm:flex-row gap-4">
          {/* Search Input - Using plain SVG for the search icon */}
          <Input
            placeholder="Find a Project..."
            prefix={
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            }
            className="w-full sm:w-64"
          />

          {/* Sort Dropdown */}
          <Select
            defaultValue="name-asc"
            style={{ minWidth: 180 }}
            dropdownMatchSelectWidth={false}
          >
            <Option value="name-asc">Name (ascending)</Option>
            <Option value="name-desc">Name (descending)</Option>
            <Option value="date-asc">Date (ascending)</Option>
            <Option value="date-desc">Date (descending)</Option>
          </Select>
        </div>

        <Row gutter={16}>
          {/* Inter-Val Project Card */}
          <Col xs={24} md={12} lg={8} xl={6} className="mb-4">
            <Card className="h-full">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-blue-600">I</span>
                </div>
                <Text strong>Inter-Val</Text>
                <Button
                  type="text"
                  className="ml-auto p-1"
                >
                  ⋮
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Space>
                    <span>📄</span>
                    <Text>Published Phrases</Text>
                  </Space>
                  <Text strong>1275</Text>
                </div>

                <div className="flex items-center justify-between">
                  <Space>
                    <span>⏳</span>
                    <Text>Pending Phrases</Text>
                  </Space>
                  <Text strong>2</Text>
                </div>

                <div className="flex items-center justify-between">
                  <Space>
                    <span>🌐</span>
                    <Text>Language</Text>
                  </Space>
                  <Text strong>1</Text>
                </div>

                <div className="flex items-center justify-between">
                  <Space>
                    <span>📊</span>
                    <Text>Pageviews</Text>
                  </Space>
                  <Text strong>406</Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* New Project Card */}
          <Col xs={24} md={12} lg={8} xl={6} className="mb-4">
            <Card
              className="h-full flex flex-col items-center justify-center text-center text-gray-400 border-dashed"
              bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            >
              <div className="text-4xl mb-2">+</div>
              <Text>New Project</Text>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
