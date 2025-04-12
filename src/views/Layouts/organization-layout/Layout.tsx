import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntLayout, Button, Space } from 'antd';
import { FilterOutlined, PlusOutlined } from '@ant-design/icons';

// Import the sidebar styles
import '../../../css/sidebar-styles.css';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content } = AntLayout;

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AntLayout className="min-h-screen">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <AntLayout className="relative flex flex-col overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <Content className="grow p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-9xl mx-auto">
            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Dashboard
                </h1>
              </div>

              <Space size="small">
                <Button
                  icon={<FilterOutlined />}
                  className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-400 dark:text-gray-500"
                >
                  Filter
                </Button>

                {/* <Datepicker align="right" /> */}

                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                >
                  <span className="max-xs:sr-only">Add View</span>
                </Button>
              </Space>
            </div>

            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
