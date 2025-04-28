import React, { useState } from 'react';
import { Layout, Menu, Card, Input, Checkbox, Button, Typography, Divider, Row, Col, Tooltip, Space } from 'antd';
import { EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const OrganizationSettings = () => {
    const [orgName, setOrgName] = useState('Inter-Val');
    const [settings, setSettings] = useState({
        twoFactor: false,
        projectBasedTeams: false,
        localizeAccess: false,
        googleLogin: true,
        pageviewNotifications: true,
        machineNotifications: true,
    });
    const [activeSection, setActiveSection] = useState('organization');

    const handleSettingChange = (setting) => {
        setSettings({
            ...settings,
            [setting]: !settings[setting],
        });
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'organization':
                return (
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Card
                            title={
                                <Space align="center">
                                    <span>Organization Settings</span>
                                    <Tooltip title="Organization settings information">
                                        <QuestionCircleOutlined style={{ color: '#bfbfbf' }} />
                                    </Tooltip>
                                </Space>
                            }
                            bordered
                        >
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <Text strong>Organization Name</Text>
                                    <Input
                                        value={orgName}
                                        onChange={(e) => setOrgName(e.target.value)}
                                        prefix={<EditOutlined style={{ color: '#bfbfbf' }} />}
                                    />
                                </Space>

                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <Checkbox
                                        checked={settings.twoFactor}
                                        onChange={() => handleSettingChange('twoFactor')}
                                    >
                                        <Text strong>Mandatory two-factor authentication for all team members</Text>
                                    </Checkbox>
                                    <Paragraph type="secondary">
                                        When enabled, all users in the organization (including yourself) will be required to setup
                                        two-factor authentication before using Localize.
                                    </Paragraph>
                                </Space>

                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <Checkbox
                                        checked={settings.projectBasedTeams}
                                        onChange={() => handleSettingChange('projectBasedTeams')}
                                    >
                                        <Text strong>Show team members based on projects</Text>
                                    </Checkbox>
                                    <Paragraph type="secondary">
                                        Members can only see others if they share projects.
                                    </Paragraph>
                                </Space>

                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <Checkbox
                                        checked={settings.localizeAccess}
                                        onChange={() => handleSettingChange('localizeAccess')}
                                    >
                                        <Text strong>Allow Localize employees access to Organization</Text>
                                    </Checkbox>
                                    <Paragraph type="secondary">
                                        Allow Localize staff to access your account for support and debugging.
                                    </Paragraph>
                                </Space>

                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <Checkbox
                                        checked={settings.googleLogin}
                                        onChange={() => handleSettingChange('googleLogin')}
                                    >
                                        <Text strong style={{ color: '#1890ff' }}>Mandatory Google Login</Text>
                                    </Checkbox>
                                    <Paragraph type="secondary">
                                        Users must log in using Google OAuth.
                                    </Paragraph>
                                </Space>

                                <Row justify="end">
                                    <Col>
                                        <Button type="primary">Save</Button>
                                    </Col>
                                </Row>
                            </Space>
                        </Card>

                        <Card
                            title={
                                <Space align="center">
                                    <span>Notifications</span>
                                    <Tooltip title="Notification settings information">
                                        <QuestionCircleOutlined style={{ color: '#bfbfbf' }} />
                                    </Tooltip>
                                </Space>
                            }
                            bordered
                        >
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <Checkbox
                                        checked={settings.pageviewNotifications}
                                        onChange={() => handleSettingChange('pageviewNotifications')}
                                    >
                                        <Text strong style={{ color: '#1890ff' }}>Send notifications email for pageview limit</Text>
                                    </Checkbox>
                                    <Paragraph type="secondary">
                                        Email alerts at 80% and 90% pageview usage.
                                    </Paragraph>
                                </Space>

                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <Checkbox
                                        checked={settings.machineNotifications}
                                        onChange={() => handleSettingChange('machineNotifications')}
                                    >
                                        <Text strong style={{ color: '#1890ff' }}>Send notification emails for machine limit</Text>
                                    </Checkbox>
                                    <Paragraph type="secondary">
                                        Email alerts when machine usage is high.
                                    </Paragraph>
                                </Space>
                            </Space>
                        </Card>
                    </Space>
                );
            case 'usage':return (<>
                <Typography style={{ padding: '24px' }}>
                    <Title level={4}>Usage Overview</Title>
                    <Text type="secondary">Usage overview content goes here</Text>
                </Typography>
            </>
            );
            case 'billing':
            case 'invoices':
            case 'credit':
                return (
                    <Card title={activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} bordered>
                        <Row align="middle" justify="center" style={{ height: '300px' }}>
                            <Text>{activeSection} content goes here</Text>
                        </Row>
                    </Card>
                );
            default:
                return (
                    <Card bordered>
                        <Row align="middle" justify="center" style={{ height: '300px' }}>
                            <Text>Select an option from the menu</Text>
                        </Row>
                    </Card>
                );
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={250} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
                <Space direction="vertical" style={{ width: '100%', padding: '20px 0' }}>
                    <Text type="secondary" style={{ padding: '0 24px' }}>GENERAL</Text>
                    <Menu
                        mode="inline"
                        selectedKeys={[activeSection]}
                        style={{ border: 'none' }}
                        onClick={({ key }) => setActiveSection(key)}
                    >
                        <Menu.Item key="organization">Organization</Menu.Item>
                    </Menu>

                    <Divider style={{ margin: '10px 0' }} />

                    <Text type="secondary" style={{ padding: '0 24px' }}>PAYMENTS</Text>
                    <Menu
                        mode="inline"
                        selectedKeys={[activeSection]}
                        style={{ border: 'none' }}
                        onClick={({ key }) => setActiveSection(key)}
                    >
                        <Menu.Item key="usage">Usage Overview</Menu.Item>
                        <Menu.Item key="billing">Billing</Menu.Item>
                        <Menu.Item key="invoices">Invoices</Menu.Item>
                        <Menu.Item key="credit">Update Credit Card</Menu.Item>
                    </Menu>
                </Space>
            </Sider>

            <Content style={{ padding: '24px', background: '#f0f2f5' }}>
                <Row gutter={[0, 24]}>
                    <Col span={24}>
                        {renderContent()}
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default OrganizationSettings;
