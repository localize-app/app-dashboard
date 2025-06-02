/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, Layout } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  ProjectOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

function Sidebar({ sidebarOpen, setSidebarOpen, variant = 'default' }: any) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [collapsed, setCollapsed] = useState(
    !storedSidebarExpanded || storedSidebarExpanded === 'false'
  );

  // Tracking open submenus
  const [openKeys, setOpenKeys] = useState<any>([]);

  // Determine which keys should be open based on the current path
  useEffect(() => {
    const pathParts = pathname.split('/');

    if (
      pathname === '/' ||
      pathname.includes('organization') ||
      pathname.includes('team') ||
      pathname.includes('activity-stream') ||
      pathname.includes('api-keys') ||
      pathname.includes('organization-settings')
    ) {
      setOpenKeys((prev: any) => [...new Set([...prev, 'organization'])]);
    }

    if (
      pathname.includes('project') ||
      pathname.includes('languages') ||
      pathname.includes('web-hooks') ||
      pathname.includes('style-guide') ||
      pathname.includes('integration') ||
      pathname.includes('widget') ||
      pathname.includes('project-settings')
    ) {
      setOpenKeys((prev: any) => [...new Set([...prev, 'projects'])]);
    }

    if (
      pathname.includes('phrases') ||
      pathname.includes('manage-phrases') ||
      pathname.includes('cat-tool') ||
      pathname.includes('glossary') ||
      pathname.includes('file-managment') ||
      pathname.includes('context-editor') ||
      pathname.includes('page-manager') ||
      pathname.includes('lable-manager') ||
      pathname.includes('dynamic-phrases')
    ) {
      setOpenKeys((prev: any) => [...new Set([...prev, 'phrases'])]);
    }

    if (pathname.includes('orders')) {
      setOpenKeys((prev: any) => [...new Set([...prev, 'orders'])]);
    }

    if (pathname.includes('reports')) {
      setOpenKeys((prev: any) => [...new Set([...prev, 'reports'])]);
    }
  }, [pathname]);

  // Manage collapsed state
  const handleToggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem('sidebar-expanded', (!newCollapsed).toString());

    if (newCollapsed) {
      // @ts-ignore
      document.querySelector('body').classList.remove('sidebar-expanded');
    } else {
      // @ts-ignore
      document.querySelector('body').classList.add('sidebar-expanded');
    }
  };

  // Handle submenu opening/closing
  const onOpenChange = (keys: any) => {
    setOpenKeys(keys);
  };

  // Close on click outside (mobile only)
  useEffect(() => {
    const clickHandler = ({ target }: any) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        // @ts-ignore
        sidebar.current.contains(target) ||
        // @ts-ignore
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: any) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  // Determine which menu item is selected
  const selectedKeys = () => {
    if (pathname === '/') return ['dashboard'];
    if (pathname.includes('organization-overview'))
      return ['organization-overview'];
    if (pathname.includes('team')) return ['team'];
    if (pathname.includes('activity-stream')) return ['activity-stream'];
    if (pathname.includes('api-keys')) return ['api-keys'];
    if (pathname.includes('organization-settings'))
      return ['organization-settings'];
    if (pathname.includes('project-overview')) return ['project-overview'];
    if (pathname.includes('languages')) return ['languages'];
    if (pathname.includes('web-hooks')) return ['web-hooks'];
    if (pathname.includes('style-guide')) return ['style-guide'];
    if (pathname.includes('integration')) return ['integration'];
    if (pathname.includes('widget')) return ['widget'];
    if (pathname.includes('project-settings')) return ['project-settings'];
    if (pathname.includes('manage-phrases')) return ['manage-phrases'];
    if (pathname.includes('cat-tool')) return ['cat-tool'];
    if (pathname.includes('glossary')) return ['glossary'];
    if (pathname.includes('file-managment')) return ['file-managment'];
    if (pathname.includes('context-editor')) return ['context-editor'];
    if (pathname.includes('page-manager')) return ['page-manager'];
    if (pathname.includes('lable-manager')) return ['lable-manager'];
    if (pathname.includes('dynamic-phrases')) return ['dynamic-phrases'];
    if (pathname.includes('orders')) return ['orders'];
    if (pathname.includes('reports')) return ['reports'];
    return [];
  };

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <Sider
        id="sidebar"
        ref={sidebar}
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={280}
        collapsedWidth={80}
        style={{ height: '100%', minHeight: '100vh' }}
        className={`flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        } ${
          variant === 'v2'
            ? 'border-r border-gray-200 dark:border-gray-700/60'
            : 'shadow-xs'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-8 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>

          {/* Logo */}
          <NavLink end to="/" className="block">
            <svg
              className="fill-violet-500"
              xmlns="http://www.w3.org/2000/svg"
              width={32}
              height={32}
            >
              <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
            </svg>
          </NavLink>

          {/* Toggle collapse button (desktop only) */}
          <button
            className="hidden lg:block text-gray-500 hover:text-gray-400"
            onClick={handleToggleCollapse}
          >
            {collapsed ? (
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M8 18L14 12 8 6 9.4 4.6 16.8 12 9.4 19.4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M16 18L10 12 16 6 14.6 4.6 7.2 12 14.6 19.4z" />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="inline"
          theme="dark"
          className="border-none sidebar-menu"
          selectedKeys={selectedKeys()}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: <NavLink to="/">Dashboard</NavLink>,
            },
            {
              key: 'organization',
              icon: <TeamOutlined />,
              label: 'Manage Organization',
              children: [
                {
                  key: 'organization-overview',
                  label: (
                    <NavLink to="/organization-overview">
                      Organization Overview
                    </NavLink>
                  ),
                },
                {
                  key: 'team',
                  label: <NavLink to="/team">Team</NavLink>,
                },
                // {
                //   key: 'activity-stream',
                //   label: (
                //     <NavLink to="/activity-stream">Activity Stream</NavLink>
                //   ),
                // },
                // {
                //   key: 'api-keys',
                //   label: <NavLink to="/api-keys">API Keys</NavLink>,
                // },
                {
                  key: 'organization-settings',
                  label: (
                    <NavLink to="/organization-settings">Settings</NavLink>
                  ),
                },
              ],
            },
            {
              key: 'projects',
              icon: <ProjectOutlined />,
              label: 'Manage Project',
              children: [
                {
                  key: 'projects-list',
                  label: <NavLink to="/projects">Projects List</NavLink>,
                },
                {
                  key: 'languages',
                  label: <NavLink to="/languages">Languages</NavLink>,
                },
                // {
                //   key: 'web-hooks',
                //   label: <NavLink to="/web-hooks">Web Hooks</NavLink>,
                // },
                {
                  key: 'style-guide',
                  label: <NavLink to="/style-guide">Style Guide</NavLink>,
                },
                // {
                //   key: 'integration',
                //   label: <NavLink to="/integration">Integration</NavLink>,
                // },
                {
                  key: 'widget',
                  label: <NavLink to="/widget">Widget</NavLink>,
                },
                {
                  key: 'project-settings',
                  label: <NavLink to="/project-settings">Settings</NavLink>,
                },
              ],
            },
            {
              key: 'phrases',
              icon: <FileTextOutlined />,
              label: 'Phrases',
              children: [
                {
                  key: 'manage-phrases',
                  label: <NavLink to="/manage-phrases">Manage Phrases</NavLink>,
                },
                // {
                //   key: 'cat-tool',
                //   label: <NavLink to="/cat-tool">Cat Tool</NavLink>,
                // },
                {
                  key: 'glossary',
                  label: <NavLink to="/glossary">Glossary</NavLink>,
                },
                {
                  key: 'file-managment',
                  label: (
                    <NavLink to="/file-managment">File Import / Export</NavLink>
                  ),
                },
                {
                  key: 'context-editor',
                  label: (
                    <NavLink to="/context-editor">In Context Editor</NavLink>
                  ),
                },
                {
                  key: 'page-manager',
                  label: <NavLink to="/page-manager">Page Manager</NavLink>,
                },
                {
                  key: 'lable-manager',
                  label: <NavLink to="/lable-manager">Label Manager</NavLink>,
                },
                {
                  key: 'dynamic-phrases',
                  label: (
                    <NavLink to="/dynamic-phrases">
                      Dynamic Phrases Manager
                    </NavLink>
                  ),
                },
              ],
            },
            {
              key: 'orders',
              icon: <ShoppingOutlined />,
              label: 'Orders',
              children: [
                // {
                //   key: 'cards',
                //   label: <NavLink to="/orders">Cards</NavLink>,
                // },
                {
                  key: 'transactions',
                  label: <NavLink to="/orders">Transactions</NavLink>,
                },
                {
                  key: 'transaction-details',
                  label: <NavLink to="/orders">Transaction Details</NavLink>,
                },
              ],
            },
            // {
            //   key: 'reports',
            //   icon: <BarChartOutlined />,
            //   label: 'Reports',
            //   children: [
            //     {
            //       key: 'reports-cards',
            //       label: <NavLink to="/reports">Cards</NavLink>,
            //     },
            //     {
            //       key: 'reports-transactions',
            //       label: <NavLink to="/reports">Transactions</NavLink>,
            //     },
            //     {
            //       key: 'reports-details',
            //       label: <NavLink to="/reports">Transaction Details</NavLink>,
            //     },
            //   ],
            // },
          ]}
        />
      </Sider>
    </div>
  );
}

export default Sidebar;
