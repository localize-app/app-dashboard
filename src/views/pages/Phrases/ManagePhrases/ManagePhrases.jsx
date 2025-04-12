import { useState } from 'react';
import {
  Layout,
  Input,
  Button,
  Menu,
  Checkbox,
  Typography,
  Space,
  Dropdown,
  List,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  SettingOutlined,
  LeftOutlined,
  RightOutlined,
  InfoCircleOutlined,
  DownOutlined,
  CaretRightOutlined,
  UserOutlined,
  MoreOutlined,
  ExportOutlined,
} from '@ant-design/icons';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const ManagePhrases = () => {
  // States
  const [selectedTab, setSelectedTab] = useState('published');
  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedPhrases, setExpandedPhrases] = useState([
    'phrase1',
    'phrase2',
    'phrase3',
    'phrase4',
  ]);

  // Dummy data
  const tabs = [
    { key: 'published', label: 'Published', count: 1113 },
    { key: 'translation-qa', label: 'Translation QA', count: 149 },
    { key: 'pending', label: 'Pending', count: 2 },
    { key: 'archive', label: 'Archive', count: 558 },
  ];

  const phrases = [
    {
      id: 'phrase1',
      source: 'Please refresh the page or try again later.',
      translation: 'Veuillez actualiser la page ou réessayer plus tard.',
    },
    {
      id: 'phrase2',
      source: 'It looks like something unexpected happened.',
      translation: "Il semble que quelque chose d'inattendu se soit produit.",
    },
    {
      id: 'phrase3',
      source: 'Oops! Something went wrong',
      translation: "Oups! Quelque chose s'est mal passé",
    },
    {
      id: 'phrase4',
      source: 'Start typing for options',
      translation: 'Commencez à taper les options',
    },
  ];

  // Event handlers
  const handleCheckboxChange = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(phrases.map((phrase) => phrase.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleExpand = (id) => {
    if (expandedPhrases.includes(id)) {
      setExpandedPhrases(expandedPhrases.filter((item) => item !== id));
    } else {
      setExpandedPhrases([...expandedPhrases, id]);
    }
  };

  // Custom dropdown menu
  const moreMenu = (
    <Menu>
      <Menu.Item key="1">Option 1</Menu.Item>
      <Menu.Item key="2">Option 2</Menu.Item>
      <Menu.Item key="3">Option 3</Menu.Item>
    </Menu>
  );

  const sortMenu = (
    <Menu>
      <Menu.Item key="asc">Ascending</Menu.Item>
      <Menu.Item key="desc">Descending</Menu.Item>
      <Menu.Item key="recent">Recently Updated</Menu.Item>
    </Menu>
  );

  return (
    <Layout
      style={
        {
          // minHeight: '100vh'
        }
      }
    >
      {/* Secondary layout that respects the main sidebar */}
      <Layout style={{ marginLeft: 100 }}>
        {/* Page filter sidebar */}
        <Sider
          width={260}
          theme="light"
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            height: '100vh',
            overflow: 'auto',
            position: 'sticky',
            top: 0,
            left: 0,
            zIndex: 5,
          }}
        >
          {/* Search bar */}
          <div style={{ padding: '16px 16px 8px' }}>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              suffix={
                <Button type="text" style={{ border: 'none' }}>
                  <DownOutlined style={{ fontSize: '10px', color: '#999' }} />
                </Button>
              }
              style={{ borderRadius: '4px' }}
            />
          </div>

          {/* Status tabs */}
          <div style={{ padding: '0 16px' }}>
            {tabs.map((tab) => (
              <div
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                style={{
                  padding: '12px 0',
                  borderLeft:
                    tab.key === selectedTab
                      ? '3px solid #1890ff'
                      : '3px solid transparent',
                  background:
                    tab.key === selectedTab ? '#f0f7ff' : 'transparent',
                  display: 'flex',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  paddingLeft: '8px',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    background: '#f0f0f0',
                    borderRadius: '10px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    color: '#666',
                  }}
                >
                  {tab.count}
                </span>
              </div>
            ))}
          </div>

          {/* Language section */}
          <div
            style={{
              padding: '16px',
              borderTop: '1px solid #f0f0f0',
              marginTop: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>Language</span>
                <InfoCircleOutlined
                  style={{ marginLeft: '5px', color: '#1890ff' }}
                />
              </div>
              <div>
                {/* <Button type="text" icon={<CogOutlined />} size="small" />
                <Button
                  type="text"
                  icon={<CaretRightOutlined rotate={90} />}
                  size="small"
                /> */}
              </div>
            </div>

            <div
              style={{
                marginBottom: '8px',
                padding: '8px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>Source: English</span>
              <span style={{ color: '#999' }}>en</span>
            </div>

            <div
              style={{
                padding: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                borderLeft: '3px solid #1890ff',
                background: '#f0f7ff',
              }}
            >
              <div>
                <div>French</div>
                <div style={{ fontSize: '12px', color: '#999' }}>Canada</div>
              </div>
              <span style={{ color: '#999' }}>fr-CA</span>
            </div>
          </div>
        </Sider>

        {/* Main content */}
        <Content style={{ padding: '0 24px', background: '#fff' }}>
          {/* Header */}
          <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                Published
              </Title>

              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Button icon={<FilterOutlined />}>Filters</Button>

                <Dropdown overlay={sortMenu} trigger={['click']}>
                  <Button>
                    <Space>
                      Sort by
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>

                <Button icon={<SettingOutlined />}>Settings</Button>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '8px',
                  }}
                >
                  <Button
                    icon={<LeftOutlined />}
                    style={{ marginRight: '4px' }}
                  />
                  <div style={{ margin: '0 8px' }}>
                    1 of 75 <DownOutlined style={{ fontSize: '10px' }} />
                  </div>
                  <Button icon={<RightOutlined />} />
                </div>
              </div>
            </div>
          </div>

          {/* Select all checkbox */}
          <div style={{ padding: '16px 0' }}>
            <Checkbox
              onChange={handleSelectAll}
              checked={selectedItems.length === phrases.length}
              indeterminate={
                selectedItems.length > 0 &&
                selectedItems.length < phrases.length
              }
            />
          </div>

          {/* Phrases list */}
          <List
            dataSource={phrases}
            renderItem={(phrase) => (
              <List.Item
                key={phrase.id}
                style={{
                  padding: '0',
                  borderBottom: '1px solid #f0f0f0',
                  background: '#fff',
                }}
              >
                <div style={{ width: '100%', padding: '16px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Checkbox
                      checked={selectedItems.includes(phrase.id)}
                      onChange={() => handleCheckboxChange(phrase.id)}
                      style={{ marginRight: '16px', marginTop: '3px' }}
                    />

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleExpand(phrase.id)}
                      >
                        <Text strong>{phrase.source}</Text>
                        <CaretRightOutlined
                          rotate={expandedPhrases.includes(phrase.id) ? 90 : 0}
                          style={{ marginLeft: '8px', fontSize: '12px' }}
                        />
                      </div>

                      {expandedPhrases.includes(phrase.id) && (
                        <div style={{ marginTop: '16px' }}>
                          <Text type="secondary">{phrase.translation}</Text>

                          <div
                            style={{
                              display: 'flex',
                              marginTop: '16px',
                              gap: '8px',
                              alignItems: 'center',
                            }}
                          >
                            <Button size="small">Propose</Button>
                            <Button size="small">Unpublish</Button>
                            <Button size="small">
                              Define Variables{' '}
                              <ExportOutlined
                                style={{
                                  fontSize: '10px',
                                  transform: 'rotate(45deg)',
                                }}
                              />
                            </Button>
                            <div style={{ flex: 1 }}></div>
                            <Button
                              size="small"
                              icon={<UserOutlined />}
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              Gengo
                            </Button>
                            <Button
                              icon={<MoreOutlined />}
                              size="small"
                              style={{
                                border: '1px solid #f0c14b',
                                background: '#fffbe6',
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagePhrases;
