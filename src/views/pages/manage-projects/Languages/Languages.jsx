import React, { useState } from 'react';
import {
  Card,
  Button,
  Switch,
  Table,
  Typography,
  Space,
  Tooltip,
  Tag,
  Pagination,
  Dropdown,
  Menu,
} from 'antd';
import {
  QuestionCircleOutlined,
  RightOutlined,
  CheckOutlined,
  DesktopOutlined,
  DownOutlined,
  PlusOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const LanguageSettings = () => {
  // States
  const [orderMachineTranslation, setOrderMachineTranslation] = useState(true);
  const [googleGlossarySync, setGoogleGlossarySync] = useState(true);
  const [enableFrench, setEnableFrench] = useState(true);
  const [enableQA, setEnableQA] = useState(true);
  const [showDisabled, setShowDisabled] = useState(false);

  // Table columns
  const columns = [
    {
      title: (
        <Space>
          Enable
          <DownOutlined />
        </Space>
      ),
      dataIndex: 'enable',
      key: 'enable',
      render: (_, record) => (
        <Switch
          checked={record.enabled}
          onChange={(checked) => {
            if (record.key === 'fr-ca') {
              setEnableFrench(checked);
            }
          }}
        />
      ),
    },
    {
      title: (
        <Space>
          Language
          <DownOutlined />
        </Space>
      ),
      dataIndex: 'language',
      key: 'language',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.code}</Text>
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: (
        <Space>
          Machine Translations
          <DownOutlined />
        </Space>
      ),
      dataIndex: 'machineTranslations',
      key: 'machineTranslations',
      render: (text) => (
        <Space>
          <DesktopOutlined />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: (
        <Space>
          Human %
          <DownOutlined />
        </Space>
      ),
      dataIndex: 'humanPercentage',
      key: 'humanPercentage',
    },
    {
      title: (
        <Space>
          Machine %
          <DownOutlined />
        </Space>
      ),
      dataIndex: 'machinePercentage',
      key: 'machinePercentage',
    },
    {
      title: (
        <Space>
          Not Translated %
          <DownOutlined />
        </Space>
      ),
      dataIndex: 'notTranslatedPercentage',
      key: 'notTranslatedPercentage',
    },
    {
      title: (
        <Space>
          Translation QA
          <DownOutlined />
        </Space>
      ),
      dataIndex: 'translationQA',
      key: 'translationQA',
      render: (_, record) => (
        <Switch
          checked={record.qaEnabled}
          onChange={(checked) => {
            if (record.key === 'fr-ca') {
              setEnableQA(checked);
            }
          }}
        />
      ),
    },
  ];

  // Table data
  const data = [
    {
      key: 'fr-ca',
      enabled: enableFrench,
      code: 'fr-CA',
      language: 'French (Canada)',
      machineTranslations: 'Google',
      humanPercentage: '95%',
      machinePercentage: '5%',
      notTranslatedPercentage: '0%',
      qaEnabled: enableQA,
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      {/* Default Translation Settings Card */}
      <Card
        title={
          <Space>
            Default Translation Settings
            <Tooltip title="More information about translation settings">
              <QuestionCircleOutlined />
            </Tooltip>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <div style={{ display: 'flex', marginBottom: 24 }}>
          <div style={{ marginRight: 16 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                backgroundColor: orderMachineTranslation
                  ? '#1890ff'
                  : '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              {orderMachineTranslation && <CheckOutlined />}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>
              Order machine translations
            </Title>
            <Text style={{ display: 'block', marginBottom: 8 }}>
              Automatically order machine translations for approved phrases with
              no translations in your project.
            </Text>
            <Button
              type="link"
              icon={<RightOutlined />}
              style={{ padding: 0 }}
              onClick={() =>
                console.log('Machine Translation Settings clicked')
              }
            >
              Machine Translation Settings
            </Button>
          </div>
          <div>
            <Switch
              checked={orderMachineTranslation}
              onChange={setOrderMachineTranslation}
            />
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: 16 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                backgroundColor: googleGlossarySync ? '#1890ff' : '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              {googleGlossarySync && <CheckOutlined />}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>
              Google Glossary Sync
            </Title>
            <Text>
              Automate the translation of glossary terms when using the Google
              Translate engine.
            </Text>
          </div>
          <div>
            <Switch
              checked={googleGlossarySync}
              onChange={setGoogleGlossarySync}
            />
          </div>
        </div>
      </Card>

      {/* Add Languages Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 24,
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => console.log('Add Languages clicked')}
        >
          Add Languages
        </Button>
      </div>

      {/* Language Table */}
      <div>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Text strong>Source Language:</Text>
            <Text>English (en)</Text>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
        />

        <div
          style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}
        >
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="1"
                  onClick={() => setShowDisabled(!showDisabled)}
                >
                  {showDisabled ? 'Hide' : 'Show'} disabled languages
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button>
              Show disabled languages <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        <div
          style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}
        >
          <Pagination simple current={1} total={1} disabled={true} />
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;
