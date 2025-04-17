import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';
// import { FilterOutlined, PlusOutlined } from '@ant-design/icons';

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

        <Content className="grow p-4 sm:p-6 lg:p-8 dark:bg-gray-900 bg-gray-100">
          <div className="w-full max-w-9xl mx-auto">
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
